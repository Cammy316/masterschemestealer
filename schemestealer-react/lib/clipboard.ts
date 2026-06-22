/**
 * Clipboard utilities — single source of truth for copy actions.
 *
 * Consolidated (Prompt C): the older parallel formatters (copyAllHexCodes /
 * copyFormattedColors / copyPaintRequisition) were unused and removed. What
 * remains: copyHexCode (the hex chip), copyRecipe (the recipe card) and
 * copyForDiscord (kept for the Share flow). Recipe output is plain text so it
 * pastes cleanly anywhere.
 */

export interface CopyNotification {
  message: string;
  type: 'success' | 'error';
}

/**
 * Copy a single hex code to the clipboard.
 */
export async function copyHexCode(hex: string): Promise<CopyNotification> {
  try {
    await navigator.clipboard.writeText(hex);
    return { message: `Copied ${hex}`, type: 'success' };
  } catch {
    return { message: 'Failed to copy', type: 'error' };
  }
}

export interface RecipeSlot {
  /** BASE / SHADE / HIGHLIGHT / WASH */
  role: string;
  /** Paint name, or '' for an empty slot (rendered as an em-dash). */
  name: string;
  hex: string;
  deltaE?: number;
}

export interface CopyRecipeInput {
  family: string;
  sourceHex: string;
  coverage?: number;
  brand: string;
  /** Slots in display order (BASE, SHADE, HIGHLIGHT, WASH). */
  slots: RecipeSlot[];
}

/**
 * Copy the selected brand's recipe as aligned plain text:
 *
 *   PINK  #c7afbd  (69.3% coverage)
 *   Citadel recipe
 *   ─────────────────────
 *   BASE       Dechala Lilac        #b384c4   ΔE 10.7
 *   HIGHLIGHT  —
 *
 *   via SchemeStealer · schemestealer.com
 */
export async function copyRecipe(input: CopyRecipeInput): Promise<CopyNotification> {
  try {
    const { family, sourceHex, coverage, brand, slots } = input;

    const roleWidth = Math.max(...slots.map((s) => s.role.length)) + 2;
    const present = slots.filter((s) => s.name);
    const nameWidth = present.length
      ? Math.max(...present.map((s) => s.name.length)) + 2
      : 2;

    const header = coverage !== undefined
      ? `${family.toUpperCase()}  ${sourceHex}  (${coverage.toFixed(1)}% coverage)`
      : `${family.toUpperCase()}  ${sourceHex}`;

    const lines = slots.map((s) => {
      const role = s.role.toUpperCase().padEnd(roleWidth);
      if (!s.name) return `${role}—`;
      const name = s.name.padEnd(nameWidth);
      const deltaE = s.deltaE !== undefined ? `   ΔE ${s.deltaE.toFixed(1)}` : '';
      return `${role}${name}${s.hex}${deltaE}`;
    });

    const text = [
      header,
      `${brand} recipe`,
      '─────────────────────',
      ...lines,
      '',
      'via SchemeStealer · schemestealer.com',
    ].join('\n');

    await navigator.clipboard.writeText(text);
    return { message: 'Recipe copied', type: 'success' };
  } catch {
    return { message: 'Failed to copy', type: 'error' };
  }
}

/**
 * Copy for Discord — markdown formatted. Kept available for the Share flow.
 */
export async function copyForDiscord(data: {
  type: 'miniscan' | 'inspiration';
  colors: Array<{ hex: string; name: string; percentage?: number }>;
  paints?: Array<{ name: string; brand: string }>;
}): Promise<CopyNotification> {
  try {
    const title = data.type === 'miniscan'
      ? '**🎨 Miniature Colour Analysis - SchemeStealer**'
      : '**✨ Colour Palette Extraction - SchemeStealer**';

    const colorList = data.colors
      .map((c) => {
        const percentage = c.percentage ? ` (${c.percentage}%)` : '';
        return `• \`${c.hex}\` ${c.name}${percentage}`;
      })
      .join('\n');

    let message = `${title}\n\n${colorList}`;

    if (data.paints && data.paints.length > 0) {
      const paintList = data.paints
        .slice(0, 5)
        .map((p) => `• ${p.brand} - ${p.name}`)
        .join('\n');
      message += `\n\n**Recommended Paints:**\n${paintList}`;
    }

    message += '\n\n_Powered by SchemeStealer_';

    await navigator.clipboard.writeText(message);
    return { message: 'Copied Discord-formatted text', type: 'success' };
  } catch {
    return { message: 'Failed to copy', type: 'error' };
  }
}
