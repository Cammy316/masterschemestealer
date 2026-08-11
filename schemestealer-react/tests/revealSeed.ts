/**
 * Shared synthetic MASKED scan for the pict-cast specs. Runs as an init
 * script in the page, so it must stay self-contained (no imports/closures).
 */
export const seedScan = (key: string) => {
    window.localStorage.setItem('schemestealer-analytics-consent', 'granted');

    const miniUrl = (() => {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 600;
      const x = c.getContext('2d')!;
      x.fillStyle = '#0a0a0a';
      x.fillRect(0, 0, 400, 600);
      x.fillStyle = '#8a3a3a';
      x.fillRect(140, 180, 120, 260);
      x.fillStyle = '#c8a06a';
      x.beginPath();
      x.arc(200, 140, 50, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#3a5a8a';
      x.fillRect(120, 200, 40, 240);
      x.fillRect(240, 200, 40, 240);
      // near-black plinth — exercises the dark-scheme paths (adaptive base
      // brightness + label lightness floor) that solid bright shapes never hit
      x.fillStyle = '#141414';
      x.fillRect(130, 440, 140, 36);
      return c.toDataURL('image/png');
    })();

    const maskB64 = (draw: (x: CanvasRenderingContext2D) => void) => {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 600;
      const x = c.getContext('2d')!;
      x.fillStyle = '#ffffff';
      draw(x);
      return c.toDataURL('image/png').split(',')[1];
    };
    const redMask = maskB64((x) => x.fillRect(140, 180, 120, 260));
    const boneMask = maskB64((x) => {
      x.beginPath();
      x.arc(200, 140, 50, 0, Math.PI * 2);
      x.fill();
    });
    const blueMask = maskB64((x) => {
      x.fillRect(120, 200, 40, 240);
      x.fillRect(240, 200, 40, 240);
    });
    const blackMask = maskB64((x) => x.fillRect(130, 440, 140, 36));

    const recipe = (hex: string) => ({
      base: { name: 'Mephiston Red', hex, type: 'base', deltaE: 1.2 },
      shade: { name: 'Nuln Oil', hex: '#141414', type: 'shade', deltaE: 0 },
      highlight: { name: 'Evil Sunz Scarlet', hex: '#d49a9a', type: 'layer', deltaE: 2.4 },
      wash: { name: 'Reikland Fleshshade', hex: '#7a3b1a', type: 'wash', deltaE: 0 },
    });
    const colour = (
      hex: string,
      rgb: number[],
      lab: number[],
      family: string,
      pct: number,
      pos: { x: number; y: number },
      mask: string,
    ) => ({
      hex,
      rgb,
      lab,
      family,
      percentage: pct,
      position: pos,
      mask,
      paintRecipe: { citadel: recipe(hex), vallejo: recipe(hex), army_painter: recipe(hex) },
    });

    const scan = {
      id: 'reveal-seed',
      mode: 'miniature',
      timestamp: '2026-06-30T00:00:00.000Z',
      analysisSource: 'backend',
      recommendedPaints: [],
      imageUrl: miniUrl,
      maskFrame: { width: 400, height: 600, cropX: 0, cropY: 0, cropW: 400, cropH: 600, frameW: 400, frameH: 600 },
      detectedColors: [
        colour('#8a3a3a', [138, 58, 58], [40, 35, 20], 'red', 50, { x: 0.5, y: 0.55 }, redMask),
        colour('#c8a06a', [200, 160, 106], [70, 10, 35], 'bone', 25, { x: 0.5, y: 0.23 }, boneMask),
        colour('#3a5a8a', [58, 90, 138], [40, 5, -30], 'blue', 20, { x: 0.35, y: 0.5 }, blueMask),
        // near-black region: label tint + adaptive brightness under real frames
        colour('#141414', [20, 20, 20], [7, 0, 0], 'black', 5, { x: 0.5, y: 0.76 }, blackMask),
      ],
    };
  (window as unknown as { __seedScan: unknown }).__seedScan = scan;
  const state = { cart: [], scanHistory: [scan], currentScan: scan, preferredBrands: ['all'], preferredRegion: 'global' };
  window.localStorage.setItem(key, JSON.stringify({ state, version: 0 }));
};

/**
 * Synthetic MASKLESS scan for the warp-cast specs — an inspiration scan.
 *
 * Six colour patches at known, distinct locations, full paint recipes, and
 * deliberately NO masks: that combination is the whole reason the mask-gated
 * miniature storyboard cannot run on inspiration results.
 *
 * Every `position` is set to dead centre on purpose. The backend does not send
 * positions for inspiration scans, so if the pixel scan ever silently stopped
 * running, every orb would stack in the middle of the frame — and the spec
 * asserts they do not, which only means something because the seed starts them
 * stacked.
 */
export const seedInspirationScan = (key: string) => {
  window.localStorage.setItem('schemestealer-analytics-consent', 'granted');

  const PATCHES: [string, number, number][] = [
    ['#c92a2a', 0.12, 0.16],
    ['#1971c2', 0.62, 0.14],
    ['#2f9e44', 0.16, 0.52],
    ['#f59f00', 0.66, 0.5],
    ['#7048e8', 0.14, 0.82],
    // Deliberately near-white: a pale paint beside a pale gutter is the case
    // that loses its edge, and it must be in the fixture or nothing tests it.
    ['#f1efe9', 0.64, 0.8],
  ];

  const imageUrl = (() => {
    // 16:9, deliberately. Inspiration scans are overwhelmingly landscape —
    // skies, posters, landscapes — and landscape is the case the poster layout
    // has to fight hardest, because a wide photo cannot fill a 9:16 frame
    // without either a crop or a very tall palette. A square seed tested the
    // easy case and hid that entirely.
    const W = 854;
    const H = 480;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const x = c.getContext('2d')!;
    x.fillStyle = '#101014';
    x.fillRect(0, 0, W, H);
    for (const [hex, px, py] of PATCHES) {
      x.fillStyle = hex;
      x.fillRect(Math.round(px * W), Math.round(py * H), 150, 74);
    }
    return c.toDataURL('image/png');
  })();

  const recipe = (hex: string, name: string, dE: number) => ({
    base: { name, hex, type: 'base', deltaE: dE },
    shade: { name: 'Nuln Oil', hex: '#141414', type: 'shade', deltaE: 0 },
    highlight: { name: 'Wild Rider Red', hex: '#e07a7a', type: 'layer', deltaE: 3.1 },
    wash: { name: 'Agrax Earthshade', hex: '#5a3a1a', type: 'wash', deltaE: 0 },
  });

  const NAMES = [
    ['Mephiston Red', 1.1],
    ['Macragge Blue', 2.4],
    ['Caliban Green', 3.8],
    ['Averland Sunset', 6.2],
    ['Naggaroth Night', 4.5],
    ['White Scar', 9.6],
  ] as const;

  const detectedColors = PATCHES.map(([hex], i) => ({
    hex,
    rgb: [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)],
    lab: [50, 0, 0],
    family: ['red', 'blue', 'green', 'yellow', 'purple', 'white'][i],
    percentage: 30 - i * 3,
    // Deliberately stacked — see the note above.
    position: { x: 0.5, y: 0.5 },
    paintRecipe: {
      citadel: recipe(hex, NAMES[i][0], NAMES[i][1]),
      vallejo: recipe(hex, NAMES[i][0], NAMES[i][1]),
      army_painter: recipe(hex, NAMES[i][0], NAMES[i][1]),
    },
  }));

  const scan = {
    id: 'warp-seed',
    mode: 'inspiration',
    timestamp: '2026-06-30T00:00:00.000Z',
    analysisSource: 'backend',
    recommendedPaints: [],
    imageUrl,
    // No maskFrame, no masks. This is what an inspiration scan actually is.
    detectedColors,
  };
  (window as unknown as { __seedScan: unknown }).__seedScan = scan;
  const state = { cart: [], scanHistory: [scan], currentScan: scan, preferredBrands: ['all'], preferredRegion: 'global' };
  window.localStorage.setItem(key, JSON.stringify({ state, version: 0 }));
};
