declare module 'spectral.js' {
  /** Kubelka-Munk pigment colour (reflectance reconstructed from sRGB). */
  class Color {
    constructor(color: string | [number, number, number]);
    /** 0-255 sRGB channels of the colour. */
    sRGB: [number, number, number];
  }

  /** Weighted K-M mix: spectral.mix([colorA, wA], [colorB, wB], ...). */
  function mix(...entries: Array<[Color, number]>): Color;

  const spectral: { Color: typeof Color; mix: typeof mix };
  export default spectral;
}
declare module 'culori';
