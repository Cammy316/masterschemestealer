export type HueDirection = 'achromatic' | 'match' | 'warmer' | 'cooler';

export function hueDirection(
  guessLab: { l: number; a: number; b: number },
  targetLab: { l: number; a: number; b: number }
): HueDirection {
  const guessChroma = Math.hypot(guessLab.a, guessLab.b);
  const targetChroma = Math.hypot(targetLab.a, targetLab.b);

  if (guessChroma < 8 || targetChroma < 8) {
    return 'achromatic';
  }

  // atan2(b, a) in radians, convert to degrees [0, 360)
  const toDegrees = (rad: number) => ((rad * 180) / Math.PI + 360) % 360;
  
  const guessH = toDegrees(Math.atan2(guessLab.b, guessLab.a));
  const targetH = toDegrees(Math.atan2(targetLab.b, targetLab.a));

  // Shortest arc difference
  const diff = Math.abs((((targetH - guessH) % 360) + 540) % 360 - 180);

  if (diff < 10) {
    return 'match';
  }

  // Distance to warm pole (55 deg)
  const distToWarm = (h: number) => Math.abs((((h - 55) % 360) + 540) % 360 - 180);

  const guessDist = distToWarm(guessH);
  const targetDist = distToWarm(targetH);

  return targetDist < guessDist ? 'warmer' : 'cooler';
}

export function proximityPercentage(de: number): number {
  return 100 * Math.pow(Math.max(0, 1 - de / 40), 1.5);
}

export function proximityLabel(de: number): 'WIN' | 'HOT' | 'WARM' | 'COLD' {
  if (de === 0) return 'WIN';
  if (de <= 4) return 'HOT';
  if (de <= 12) return 'WARM';
  return 'COLD';
}

export interface Guess {
  paint_id: string;
  familyMatch: 'exact' | 'adjacent' | 'far';
  hueDirection: HueDirection;
  lightnessDirection: 'match' | 'lighter' | 'darker';
  deltaE: number;
}

export function generateShareGrid(guesses: Guess[]) {
  let grid = '';
  for (const g of guesses) {
    if (g.hueDirection === 'match' || g.hueDirection === 'achromatic') grid += '🟩';
    else if (g.hueDirection === 'warmer') grid += '➡️';
    else grid += '⬅️';
    
    if (g.lightnessDirection === 'match') grid += '🟩';
    else if (g.lightnessDirection === 'lighter') grid += '🔼';
    else grid += '🔽';
    
    const prox = proximityLabel(g.deltaE);
    if (prox === 'WIN') grid += '🎯';
    else if (prox === 'HOT') grid += '🔥';
    else if (prox === 'WARM') grid += '😐';
    else grid += '🧊';
    
    grid += '\n';
  }
  return grid;
}
