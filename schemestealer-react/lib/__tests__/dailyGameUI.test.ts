import { describe, it, expect } from 'vitest';
import { generateShareGrid } from '../colourClues';

describe('DailyGameUI Share Logic', () => {
  it('generates correct share string emojis for a win', () => {
    // 3 guesses:
    // 1: warm hue, lighter, cold heat
    // 2: cool hue, darker, warm heat
    // 3: match hue, match light, win heat
    const grid = generateShareGrid([
      { paint_id: '1', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 15 },
      { paint_id: '2', familyMatch: 'adjacent', hueDirection: 'cooler', lightnessDirection: 'darker', deltaE: 8 },
      { paint_id: '3', familyMatch: 'exact', hueDirection: 'match', lightnessDirection: 'match', deltaE: 0 },
    ]);

    // Expected lines:
    // ➡️🔼🧊
    // ⬅️🔽😐
    // 🟩🟩🎯
    expect(grid).toContain('➡️🔼🧊\n');
    expect(grid).toContain('⬅️🔽😐\n');
    expect(grid).toContain('🟩🟩🎯\n');
  });

  it('generates correct share string emojis for a loss', () => {
    // All misses
    const grid = generateShareGrid([
      { paint_id: '1', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 20 },
      { paint_id: '2', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 20 },
      { paint_id: '3', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 20 },
      { paint_id: '4', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 20 },
      { paint_id: '5', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 20 },
      { paint_id: '6', familyMatch: 'far', hueDirection: 'warmer', lightnessDirection: 'lighter', deltaE: 20 },
    ]);
    expect(grid).toContain('➡️🔼🧊\n➡️🔼🧊\n➡️🔼🧊\n➡️🔼🧊\n➡️🔼🧊\n➡️🔼🧊\n');
  });
});
