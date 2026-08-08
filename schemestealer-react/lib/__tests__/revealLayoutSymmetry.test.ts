import { describe, it, expect } from 'vitest';
import {
  CANVAS_H,
  CANVAS_W,
  COMPACT_BOX,
  DECOR_BAND,
  FRAME_CX,
  LAYOUT,
  SAFE_RECT,
  calloutLeaderPath,
  intersects,
  pathLength,
  recipeRowY,
  CHIP_H,
} from '../reveal/revealLayout';

/**
 * v5.2 introduced the safe area and got its geometry wrong in two ways at once.
 * These are the assertions that would have caught each.
 */
describe('revealLayout — symmetry', () => {
  // Intent: content used to centre on 505 (the middle of an asymmetric usable
  // band) while the corner brackets, the scan sweep and the model all centre on
  // the frame. Every heading therefore sat 35 px left of the furniture around
  // it, which on a device reads as the whole layout being subtly askew.
  //
  // 540 is written as a LITERAL on purpose: deriving it from SAFE_RECT would
  // make this test agree with any future rect, symmetric or not, which is
  // exactly the failure mode being guarded against.
  it('the safe area is centred on the frame', () => {
    expect(FRAME_CX).toBe(540);
    expect(SAFE_RECT.x + SAFE_RECT.w / 2, 'SAFE_RECT is not centred on 540').toBe(540);
    expect(SAFE_RECT.x).toBe(CANVAS_W - (SAFE_RECT.x + SAFE_RECT.w));
  });

  // Intent: the like/comment/share column covers roughly the right 17% of the
  // frame. Symmetry alone would have been satisfied by x 90–990, which puts
  // content straight back under the rail — the defect the safe area was added
  // to fix. Both constraints together force this exact right edge.
  it('stops clear of the action rail', () => {
    expect(SAFE_RECT.x + SAFE_RECT.w, 'right edge reaches into the action rail').toBeLessThanOrEqual(900);
  });
});

describe('revealLayout — the band below the safe area', () => {
  // Intent: a platform caption bar can cover this band entirely, so anything
  // informational placed here is invisible to a real viewer.
  it('carries no information element', () => {
    for (const [name, rect] of Object.entries(LAYOUT)) {
      expect(intersects(rect, DECOR_BAND), `${name} reaches into the decor band`).toBe(false);
    }
  });

  it('covers everything from the safe area to the bottom of the frame', () => {
    expect(DECOR_BAND.y).toBe(SAFE_RECT.y + SAFE_RECT.h);
    expect(DECOR_BAND.y + DECOR_BAND.h).toBe(CANVAS_H);
  });
});

describe('revealLayout — model vs information', () => {
  // Intent: on a shipped export the recipe heading drew over the model's feet.
  // The outro is the one phase where the model and the recipe block are on
  // screen together, so it is the one phase where an overlap is a defect rather
  // than an intentional overlay.
  //
  // Deliberately NOT asserted for FULL_BOX: during the hero phases the caption
  // is burned in OVER the artwork, with a glow behind it, and that is the
  // design. Only the outro framing has to keep clear.
  it('the outro model box clears the recipe block and the end card', () => {
    const outroElements = ['recipeHeading', 'recipeSubheading', 'recipeRows', 'endCardTitle', 'endCardSub'] as const;
    for (const name of outroElements) {
      expect(intersects(COMPACT_BOX, LAYOUT[name]), `${name} overlaps the outro model`).toBe(false);
    }
    // …and every individual row, not just the block that nominally contains them.
    for (let i = 0; i < 4; i++) {
      const row = { x: LAYOUT.recipeRows.x, y: recipeRowY(i), w: LAYOUT.recipeRows.w, h: CHIP_H };
      expect(intersects(COMPACT_BOX, row), `recipe row ${i} overlaps the outro model`).toBe(false);
    }
  });
});

describe('revealLayout — callout leader lines', () => {
  // Intent: on a shipped export one leader ended in a stub pointing at empty
  // space and another had no visible line at all. Neither was catchable while
  // the geometry lived inline between ctx.moveTo calls. The contract is that
  // the line ENDS ON the thing it points at.
  const cases = [
    { name: 'left rail, anchor far right', side: 'left' as const, leaderStart: 300, railY: 400, anchorX: 700, anchorY: 900, modelEdge: 340 },
    { name: 'right rail, anchor far left', side: 'right' as const, leaderStart: 780, railY: 400, anchorX: 380, anchorY: 900, modelEdge: 740 },
    // The degenerate case: anchor almost underneath the label end, which is
    // where a clamped elbow collapses the path into a stub.
    { name: 'left rail, anchor beside the label', side: 'left' as const, leaderStart: 300, railY: 400, anchorX: 305, anchorY: 420, modelEdge: 340 },
    { name: 'right rail, anchor beside the label', side: 'right' as const, leaderStart: 780, railY: 400, anchorX: 775, anchorY: 420, modelEdge: 740 },
  ];

  for (const c of cases) {
    it(`terminates on the anchor — ${c.name}`, () => {
      const path = calloutLeaderPath(c);
      const end = path[path.length - 1];
      expect(Math.hypot(end.x - c.anchorX, end.y - c.anchorY), 'leader does not reach its anchor').toBeLessThanOrEqual(40);
    });

    // Intent: a zero-length path satisfies "ends on the anchor" while being
    // invisible — which is precisely what "no line at all" looked like.
    it(`draws a line the viewer can see — ${c.name}`, () => {
      expect(pathLength(calloutLeaderPath(c)), 'leader is too short to read').toBeGreaterThan(20);
    });
  }
});
