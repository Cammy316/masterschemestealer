import { describe, it, expect } from 'vitest';
import { patchColrToBt709, buildTestColrBuffer } from '../reveal/mp4ColrPatch';

/**
 * This is the ONLY platform-independent test for the colour-tag defect.
 *
 * The end-to-end ffprobe assertion cannot catch it: headless Chrome has no GPU,
 * uses the software encoder, and already emits BT.709. Only hardware encoders
 * produce the bad tag, so the E2E test passed all through the bug's lifetime.
 * These assertions fail against the exact bytes a real device shipped.
 */
describe('patchColrToBt709', () => {
  // The values measured on MobileV5/V6: bt470bg(5) / smpte170m(6) / smpte170m(6).
  it('rewrites the BT.601 tags a real device shipped', () => {
    const buf = buildTestColrBuffer(5, 6, 6);
    const res = patchColrToBt709(buf);
    expect(res.patched).toBe(1);
    expect(res.previous[0]).toEqual({ primaries: 5, transfer: 6, matrix: 6 });
    const view = new DataView(buf);
    expect(view.getUint16(16, false), 'primaries').toBe(1);
    expect(view.getUint16(18, false), 'transfer').toBe(1);
    expect(view.getUint16(20, false), 'matrix').toBe(1);
  });

  // Intent: HD content is limited-range. A stray full-range flag would shift
  // every level and undo the point of tagging correctly in the first place.
  it('clears the full-range flag', () => {
    const buf = buildTestColrBuffer(5, 6, 6);
    patchColrToBt709(buf);
    expect(new DataView(buf).getUint8(22) & 0x80).toBe(0);
  });

  // Intent: idempotent — the export path may run it after an encoder that was
  // already correct, and it must not corrupt that file.
  it('leaves an already-correct atom untouched and stays idempotent', () => {
    const buf = buildTestColrBuffer(1, 1, 1);
    patchColrToBt709(buf);
    const again = patchColrToBt709(buf);
    expect(again.previous[0]).toEqual({ primaries: 1, transfer: 1, matrix: 1 });
    const view = new DataView(buf);
    expect([view.getUint16(16, false), view.getUint16(18, false), view.getUint16(20, false)]).toEqual([1, 1, 1]);
  });

  // Intent: the scan is byte-based, so it must refuse anything that is not a
  // real atom rather than corrupting unrelated media data that happens to spell
  // "colr".
  it('ignores a byte run that is not a valid atom', () => {
    const buf = new ArrayBuffer(64);
    const bytes = new Uint8Array(buf);
    bytes.set([0x63, 0x6f, 0x6c, 0x72], 20); // 'colr' with junk around it
    bytes.set([0x6e, 0x63, 0x6c, 0x78], 24);
    // size field before the tag is nonsense (0), so it must be rejected
    expect(patchColrToBt709(buf).patched).toBe(0);
  });

  it('reports zero when no colr atom is present', () => {
    expect(patchColrToBt709(new ArrayBuffer(256)).patched).toBe(0);
  });
});
