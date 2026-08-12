import { describe, it, expect } from 'vitest';
import {
  escapeRbsp,
  findColourDescriptionBitOffset,
  patchSpsNal,
  patchSpsVuiToBt709,
  SpsVuiPatchError,
  unescapeRbsp,
} from '../reveal/spsVuiPatch';
import deviceSps from './fixtures/deviceSps.json';

const hexToBytes = (hex: string) =>
  Uint8Array.from(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

/** The real SPS from the two device exports measured 2026-08-12. Captured from
 *  the shipped files rather than synthesised — a synthetic SPS would agree with
 *  whatever the parser happens to do. */
const MINI = hexToBytes(deviceSps.mini.sps_hex);
const WARP = hexToBytes(deviceSps.warp.sps_hex);

const readTriple = (nal: Uint8Array) => {
  const rbsp = unescapeRbsp(nal);
  const off = findColourDescriptionBitOffset(rbsp)!;
  const at = (o: number) => {
    let v = 0;
    for (let i = 0; i < 8; i++) {
      const p = o + i;
      v = (v << 1) | ((rbsp[p >> 3] >> (7 - (p & 7))) & 1);
    }
    return v;
  };
  return [at(off), at(off + 8), at(off + 16)];
};

describe('device fixtures', () => {
  // Intent: if these stop reading 6/6/5 the fixture has been regenerated from
  // an already-fixed build, and every assertion below becomes vacuous.
  it('both shipped files really do carry a BT.601 SPS', () => {
    expect(readTriple(MINI)).toEqual([6, 6, 5]);
    expect(readTriple(WARP)).toEqual([6, 6, 5]);
    expect(deviceSps.mini.bit_offset).toBe(94);
  });
});

describe('patchSpsNal', () => {
  it('rewrites both device streams to BT.709', () => {
    for (const nal of [MINI, WARP]) {
      const { nal: patched, previous } = patchSpsNal(nal);
      expect(previous).toEqual({ primaries: 6, transfer: 6, matrix: 5 });
      expect(readTriple(patched)).toEqual([1, 1, 1]);
    }
  });

  // Intent: the patch must change ONLY the three colour bytes. Everything else
  // in the SPS decides how the picture is decoded at all.
  it('leaves every other bit of the SPS identical', () => {
    const { nal: patched } = patchSpsNal(MINI);
    expect(patched.length).toBe(MINI.length);
    const a = unescapeRbsp(MINI);
    const b = unescapeRbsp(patched);
    const off = findColourDescriptionBitOffset(a)!;
    for (let bit = 0; bit < a.length * 8; bit++) {
      if (bit >= off && bit < off + 24) continue;
      const get = (d: Uint8Array) => (d[bit >> 3] >> (7 - (bit & 7))) & 1;
      expect(get(b), `bit ${bit} changed`).toBe(get(a));
    }
  });

  it('is idempotent', () => {
    const once = patchSpsNal(MINI).nal;
    const twice = patchSpsNal(once);
    expect(twice.previous).toEqual({ primaries: 1, transfer: 1, matrix: 1 });
    expect(Array.from(twice.nal)).toEqual(Array.from(once));
  });
});

describe('colour_description_present_flag == 0', () => {
  /**
   * Intent, and the reason this is an error rather than a silent skip:
   * inserting the 25 missing bits would shift every subsequent VUI field, so an
   * in-place patch would corrupt the stream while appearing to succeed. On the
   * observed devices the flag is 1; a device that omits it must not produce a
   * broken file.
   */
  it('refuses to patch rather than shifting every later VUI bit', () => {
    const absent = spsWithoutColourDescription();
    expect(findColourDescriptionBitOffset(unescapeRbsp(absent))).toBeNull();
    expect(() => patchSpsNal(absent)).toThrow(SpsVuiPatchError);
  });

  it('counts it and leaves the buffer untouched', () => {
    const buf = avcCContaining(spsWithoutColourDescription());
    const before = Array.from(new Uint8Array(buf));
    const { buffer, result } = patchSpsVuiToBt709(buf);
    expect(result.patched).toBe(0);
    expect(result.skippedAbsent).toBe(1);
    expect(Array.from(new Uint8Array(buffer))).toEqual(before);
  });
});

describe('rbsp escaping', () => {
  it('round-trips losslessly, including a real emulation pattern', () => {
    const raw = Uint8Array.from([0x67, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x03, 0x02]);
    expect(Array.from(escapeRbsp(unescapeRbsp(raw)))).toEqual(Array.from(raw));
  });
});

describe('patchSpsVuiToBt709 over a container', () => {
  it('patches the SPS inside an avcC record', () => {
    const { buffer, result } = patchSpsVuiToBt709(avcCContaining(MINI));
    expect(result.patched).toBe(1);
    expect(result.previous[0]).toEqual({ primaries: 6, transfer: 6, matrix: 5 });
    const out = new Uint8Array(buffer);
    // Locate the SPS again and confirm it now reads BT.709.
    const idx = indexOfAvcC(out) + 4 + 6 + 2;
    expect(readTriple(out.subarray(idx, idx + MINI.length))).toEqual([1, 1, 1]);
  });

  it('handles numOfSequenceParameterSets > 1', () => {
    const { result } = patchSpsVuiToBt709(avcCContaining(MINI, WARP));
    expect(result.patched).toBe(2);
  });

  it('is a no-op on a stream already tagged BT.709', () => {
    const already = patchSpsNal(MINI).nal;
    const buf = avcCContaining(already);
    const before = Array.from(new Uint8Array(buf));
    const { buffer, result } = patchSpsVuiToBt709(buf);
    expect(result.patched).toBe(0);
    expect(Array.from(new Uint8Array(buffer))).toEqual(before);
  });
});

// ---- helpers --------------------------------------------------------------

function indexOfAvcC(d: Uint8Array): number {
  for (let i = 0; i + 4 <= d.length; i++) {
    if (d[i] === 0x61 && d[i + 1] === 0x76 && d[i + 2] === 0x63 && d[i + 3] === 0x43) return i;
  }
  return -1;
}

/** Minimal buffer holding one avcC record with the given SPS NALs. */
function avcCContaining(...nals: Uint8Array[]): ArrayBuffer {
  const body: number[] = [1, 0x64, 0x00, 0x28, 0xff, 0xe0 | nals.length];
  for (const n of nals) {
    body.push((n.length >> 8) & 0xff, n.length & 0xff, ...Array.from(n));
  }
  body.push(0x01, 0x00, 0x04); // one PPS, length 4
  body.push(0x68, 0xee, 0x3c, 0xb0);
  const out = new Uint8Array(8 + body.length);
  new DataView(out.buffer).setUint32(0, out.length, false);
  out.set([0x61, 0x76, 0x63, 0x43], 4);
  out.set(body, 8);
  return out.buffer;
}

/** SPS with video_signal_type present but colour_description absent. */
function spsWithoutColourDescription(): Uint8Array {
  const bits: number[] = [];
  const u = (v: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((v >> i) & 1);
  };
  const ue = (v: number) => {
    const x = v + 1;
    const n = 32 - Math.clz32(x);
    u(0, n - 1);
    u(x, n);
  };
  u(0x67, 8);
  u(66, 8); // Baseline — skips the High-profile chroma branch
  u(0, 8);
  u(30, 8);
  ue(0);
  ue(0);
  ue(2);
  ue(1);
  u(0, 1);
  ue(67);
  ue(119);
  u(1, 1);
  u(1, 1);
  u(0, 1);
  u(1, 1); // vui present
  u(0, 1); // aspect_ratio_info_present_flag
  u(0, 1); // overscan_info_present_flag
  u(1, 1); // video_signal_type_present_flag
  u(5, 3);
  u(0, 1);
  u(0, 1); // colour_description_present_flag = 0  <- the case under test
  u(0, 1);
  u(0, 1);
  u(1, 1); // stop bit
  const bytes = new Uint8Array(Math.ceil(bits.length / 8));
  bits.forEach((b, i) => {
    if (b) bytes[i >> 3] |= 1 << (7 - (i & 7));
  });
  return bytes;
}
