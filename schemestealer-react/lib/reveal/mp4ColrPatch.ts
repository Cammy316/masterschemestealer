/**
 * Force an MP4's `colr` atom to BT.709, in the muxed bytes.
 *
 * WHY THIS EXISTS. The exported clip was shipping tagged BT.601 on a 1080×1920
 * file — `bt470bg / smpte170m / smpte170m` measured on real device exports.
 * Players and platform transcoders assume BT.709 for HD, so the same frame
 * decoded under the wrong matrix drifts by up to ΔE 4.9 (a full band) while the
 * recipe card claims ΔE 0.8. A colour-accuracy product cannot ship a file that
 * contradicts its own measurement.
 *
 * The first attempt at this tagged the input `VideoSample`. That failed, and the
 * reason is in mediabunny's muxer: the `colr` atom is written from
 * `decoderConfig.colorSpace` — the ENCODER'S OUTPUT metadata — not from the
 * frame we handed in. A hardware encoder (Android/Qualcomm) reports BT.601 and
 * the muxer faithfully writes that.
 *
 * We now set the metadata at the correct layer, but a device encoder has already
 * ignored us once, so this is the backstop: after muxing, rewrite the atom
 * directly. It is deterministic, encoder-independent, and — unlike the end-to-end
 * assertion — actually testable here, because headless Chrome uses the software
 * encoder and already emits BT.709.
 *
 * `colr` layout (ISO/IEC 14496-12), for `nclx`:
 *   4  size   4  'colr'   4  colour_type ('nclx')
 *   2  colour_primaries   2  transfer_characteristics   2  matrix_coefficients
 *   1  full_range_flag (top bit)
 */

/** ITU-T H.273 code points for BT.709. */
const BT709_PRIMARIES = 1;
const BT709_TRANSFER = 1;
const BT709_MATRIX = 1;

export interface ColrPatchResult {
  /** How many `colr` atoms were rewritten. 0 means none was present. */
  patched: number;
  /** What each atom said before, for telemetry — this is how we learn what the
   *  device's encoder actually reported. */
  previous: { primaries: number; transfer: number; matrix: number }[];
}

/**
 * Rewrite every `nclx` `colr` atom in `buffer` to BT.709, in place.
 *
 * Scans for the four-byte tag rather than walking the box tree: `colr` can be
 * nested several levels deep (moov→trak→mdia→minf→stbl→stsd→avc1→colr) and a
 * full walk buys nothing here — a false positive would have to be four bytes
 * spelling "colr" followed by a valid colour type, inside a box whose declared
 * size matches, which we verify before touching anything.
 */
export function patchColrToBt709(buffer: ArrayBuffer): ColrPatchResult {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const result: ColrPatchResult = { patched: 0, previous: [] };

  // 'colr' = 0x636F6C72, 'nclx' = 0x6E636C78, 'nclc' = 0x6E636C63
  // Needs to read through i+14 (the full-range byte), so the last viable start
  // is length-15.
  for (let i = 0; i + 15 <= bytes.length; i++) {
    if (bytes[i] !== 0x63 || bytes[i + 1] !== 0x6f || bytes[i + 2] !== 0x6c || bytes[i + 3] !== 0x72) {
      continue;
    }
    const type = view.getUint32(i + 4, false);
    const isNclx = type === 0x6e636c78 || type === 0x6e636c63;
    if (!isNclx) continue;
    // The size field sits immediately before the tag; sanity-check it so a
    // coincidental byte run cannot be mistaken for a real atom.
    if (i < 4) continue;
    const size = view.getUint32(i - 4, false);
    if (size < 18 || i - 4 + size > bytes.length) continue;

    result.previous.push({
      primaries: view.getUint16(i + 8, false),
      transfer: view.getUint16(i + 10, false),
      matrix: view.getUint16(i + 12, false),
    });
    view.setUint16(i + 8, BT709_PRIMARIES, false);
    view.setUint16(i + 10, BT709_TRANSFER, false);
    view.setUint16(i + 12, BT709_MATRIX, false);
    // full_range_flag lives in the top bit of the next byte; limited range.
    if (type === 0x6e636c78) view.setUint8(i + 14, view.getUint8(i + 14) & 0x7f);
    result.patched++;
  }
  return result;
}

/** Build a minimal buffer containing one `colr` atom — used by the unit test so
 *  the patcher is verifiable without a hardware encoder. */
export function buildTestColrBuffer(primaries: number, transfer: number, matrix: number): ArrayBuffer {
  const size = 19;
  const buf = new ArrayBuffer(8 + size);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  view.setUint32(0, 0, false); // leading padding, so the atom is not at offset 0
  view.setUint32(4, size, false);
  bytes.set([0x63, 0x6f, 0x6c, 0x72], 8); // 'colr'
  bytes.set([0x6e, 0x63, 0x6c, 0x78], 12); // 'nclx'
  view.setUint16(16, primaries, false);
  view.setUint16(18, transfer, false);
  view.setUint16(20, matrix, false);
  view.setUint8(22, 0x80); // full range set, so the patch must clear it
  return buf;
}
