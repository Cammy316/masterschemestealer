/**
 * Patch the H.264 SPS VUI colour_description to BT.709.
 *
 * WHY THIS EXISTS, given mp4ColrPatch.ts already patches the `colr` atom:
 * `colr` is the layer that LOSES. Both device exports measured 2026-08-12 carry
 * `colr` = 1/1/1 (correctly patched) and an SPS VUI of 6/6/5, and ffprobe —
 * therefore every platform transcoder — reports bt470bg/smpte170m/smpte170m.
 * The file contradicts itself and the reader that matters believes the wrong
 * half. Decoded under BT.601, a card reading "ΔE 2.1" arrives with roughly
 * ΔE 4.8 of decode error on top of it.
 *
 * Both patches ship. They fail independently on different devices, so neither
 * is redundant.
 */

const BT709 = { primaries: 1, transfer: 1, matrix: 1 } as const;

export interface SpsPatchResult {
  /** How many SPS NALs were rewritten. */
  patched: number;
  /** What each SPS said BEFORE the patch — on a device we cannot inspect, this
   *  log line is the only signal about what it actually reported. */
  previous: { primaries: number; transfer: number; matrix: number }[];
  /** SPS found whose colour_description_present_flag was 0. */
  skippedAbsent: number;
}

export class SpsVuiPatchError extends Error {}

/** Strip emulation-prevention bytes: 00 00 03 -> 00 00. */
export function unescapeRbsp(nal: Uint8Array): Uint8Array {
  const out: number[] = [];
  for (let i = 0; i < nal.length; i++) {
    if (i + 2 < nal.length && nal[i] === 0 && nal[i + 1] === 0 && nal[i + 2] === 3) {
      out.push(0, 0);
      i += 2; // skip the 0x03
    } else {
      out.push(nal[i]);
    }
  }
  return Uint8Array.from(out);
}

/** Re-insert emulation-prevention bytes. */
export function escapeRbsp(rbsp: Uint8Array): Uint8Array {
  const out: number[] = [];
  let zeros = 0;
  for (const b of rbsp) {
    if (zeros >= 2 && b <= 3) {
      out.push(3);
      zeros = 0;
    }
    out.push(b);
    zeros = b === 0 ? zeros + 1 : 0;
  }
  return Uint8Array.from(out);
}

class BitReader {
  pos = 0;
  constructor(private readonly d: Uint8Array) {}
  u(n: number): number {
    let v = 0;
    for (let i = 0; i < n; i++) {
      const byte = this.pos >> 3;
      if (byte >= this.d.length) throw new SpsVuiPatchError('SPS truncated');
      v = (v << 1) | ((this.d[byte] >> (7 - (this.pos & 7))) & 1);
      this.pos++;
    }
    return v >>> 0;
  }
  ue(): number {
    let lead = 0;
    while (this.u(1) === 0) {
      if (++lead > 32) throw new SpsVuiPatchError('invalid exp-Golomb');
    }
    return lead === 0 ? 0 : (1 << lead) - 1 + this.u(lead);
  }
  se(): number {
    const k = this.ue();
    return k % 2 ? (k + 1) / 2 : -(k / 2);
  }
}

const HIGH_PROFILES = new Set([100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134, 135]);

function skipScalingList(r: BitReader, size: number): void {
  let last = 8;
  let next = 8;
  for (let i = 0; i < size; i++) {
    if (next !== 0) next = (last + r.se() + 256) % 256;
    if (next !== 0) last = next;
  }
}

/**
 * Bit offset of colour_primaries inside the UNESCAPED SPS, or null when the
 * stream carries no colour description.
 */
export function findColourDescriptionBitOffset(rbsp: Uint8Array): number | null {
  const r = new BitReader(rbsp);
  r.u(8); // NAL header
  const profileIdc = r.u(8);
  r.u(8); // constraint flags
  r.u(8); // level_idc
  r.ue(); // sps id

  if (HIGH_PROFILES.has(profileIdc)) {
    const chromaFormatIdc = r.ue();
    if (chromaFormatIdc === 3) r.u(1);
    r.ue(); // bit_depth_luma_minus8
    r.ue(); // bit_depth_chroma_minus8
    r.u(1); // qpprime_y_zero_transform_bypass_flag
    if (r.u(1)) {
      const count = chromaFormatIdc !== 3 ? 8 : 12;
      for (let i = 0; i < count; i++) if (r.u(1)) skipScalingList(r, i < 6 ? 16 : 64);
    }
  }

  r.ue(); // log2_max_frame_num_minus4
  const pocType = r.ue();
  if (pocType === 0) r.ue();
  else if (pocType === 1) {
    r.u(1);
    r.se();
    r.se();
    const n = r.ue();
    for (let i = 0; i < n; i++) r.se();
  }

  r.ue(); // max_num_ref_frames
  r.u(1); // gaps_in_frame_num_value_allowed_flag
  r.ue(); // pic_width_in_mbs_minus1
  r.ue(); // pic_height_in_map_units_minus1
  if (!r.u(1)) r.u(1); // frame_mbs_only_flag / mb_adaptive_frame_field_flag
  r.u(1); // direct_8x8_inference_flag
  if (r.u(1)) {
    r.ue();
    r.ue();
    r.ue();
    r.ue();
  }
  if (!r.u(1)) return null; // vui_parameters_present_flag

  if (r.u(1) && r.u(8) === 255) {
    r.u(16);
    r.u(16);
  }
  if (r.u(1)) r.u(1); // overscan
  if (!r.u(1)) return null; // video_signal_type_present_flag
  r.u(3); // video_format
  r.u(1); // video_full_range_flag
  if (!r.u(1)) return null; // colour_description_present_flag
  return r.pos;
}

function writeU8At(rbsp: Uint8Array, bitOffset: number, value: number): void {
  for (let i = 0; i < 8; i++) {
    const bit = (value >> (7 - i)) & 1;
    const p = bitOffset + i;
    const byte = p >> 3;
    const mask = 1 << (7 - (p & 7));
    rbsp[byte] = bit ? rbsp[byte] | mask : rbsp[byte] & ~mask;
  }
}

/**
 * Rewrite one SPS NAL's colour_description to BT.709.
 *
 * Throws when colour_description_present_flag is 0. Inserting the 25 bits would
 * shift every subsequent VUI field and silently corrupt the stream, so a device
 * that omits the description must fail loudly rather than produce a broken file.
 */
export function patchSpsNal(nal: Uint8Array): {
  nal: Uint8Array;
  previous: { primaries: number; transfer: number; matrix: number };
} {
  const rbsp = unescapeRbsp(nal);
  const offset = findColourDescriptionBitOffset(rbsp);
  if (offset === null) {
    throw new SpsVuiPatchError(
      'SPS has no colour_description; refusing to patch in place because ' +
        'inserting the field would shift every later VUI bit'
    );
  }
  const read = (o: number) => {
    const r = new BitReader(rbsp);
    r.pos = o;
    return r.u(8);
  };
  const previous = {
    primaries: read(offset),
    transfer: read(offset + 8),
    matrix: read(offset + 16),
  };
  writeU8At(rbsp, offset, BT709.primaries);
  writeU8At(rbsp, offset + 8, BT709.transfer);
  writeU8At(rbsp, offset + 16, BT709.matrix);
  return { nal: escapeRbsp(rbsp), previous };
}

/**
 * Patch every SPS in every `avcC` record in `buffer`.
 *
 * Returns a NEW buffer: re-escaping can change the SPS length, which changes
 * the avcC length and every enclosing box size, so this cannot be done in
 * place the way the `colr` patch can.
 */
export function patchSpsVuiToBt709(buffer: ArrayBuffer): {
  buffer: ArrayBuffer;
  result: SpsPatchResult;
} {
  const src = new Uint8Array(buffer);
  const result: SpsPatchResult = { patched: 0, previous: [], skippedAbsent: 0 };

  // Collect edits first so we can rebuild in one pass.
  const edits: { start: number; end: number; bytes: Uint8Array }[] = [];

  for (let i = 0; i + 8 <= src.length; i++) {
    if (src[i] !== 0x61 || src[i + 1] !== 0x76 || src[i + 2] !== 0x63 || src[i + 3] !== 0x43) {
      continue; // 'avcC'
    }
    let p = i + 4;
    if (p + 6 > src.length) break;
    const numSps = src[p + 5] & 0x1f;
    p += 6;
    for (let s = 0; s < numSps; s++) {
      if (p + 2 > src.length) break;
      const len = (src[p] << 8) | src[p + 1];
      const nalStart = p + 2;
      if (len === 0 || nalStart + len > src.length) break;
      const nal = src.subarray(nalStart, nalStart + len);
      if ((nal[0] & 0x1f) === 7) {
        try {
          const { nal: patched, previous } = patchSpsNal(nal);
          // Idempotent: an already-BT.709 stream is left byte-identical.
          if (previous.primaries !== 1 || previous.transfer !== 1 || previous.matrix !== 1) {
            result.previous.push(previous);
            result.patched++;
            edits.push({ start: p, end: nalStart + len, bytes: withLength(patched) });
          }
        } catch (e) {
          if (e instanceof SpsVuiPatchError) result.skippedAbsent++;
          else throw e;
        }
      }
      p = nalStart + len;
    }
  }

  if (edits.length === 0) return { buffer, result };

  // Rebuild. Length deltas must propagate to avcC and to every enclosing box,
  // so if re-escaping changed a length we refuse rather than emit a file whose
  // box sizes lie.
  const grew = edits.some((e) => e.bytes.length !== e.end - e.start);
  if (grew) {
    throw new SpsVuiPatchError(
      'patching changed the SPS length; box sizes would need rewriting. ' +
        'Writing 01 01 01 cannot create an emulation pattern, so this means ' +
        'the input was unusual — refusing to emit a file with lying box sizes'
    );
  }

  const out = new Uint8Array(src); // same length by the check above
  for (const e of edits) out.set(e.bytes, e.start);
  return { buffer: out.buffer, result };
}

/** Prefix a NAL with its 16-bit length, as avcC stores it. */
function withLength(nal: Uint8Array): Uint8Array {
  const out = new Uint8Array(nal.length + 2);
  out[0] = (nal.length >> 8) & 0xff;
  out[1] = nal.length & 0xff;
  out.set(nal, 2);
  return out;
}
