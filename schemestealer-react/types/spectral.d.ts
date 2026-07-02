declare module 'spectral.js' {
  export class Color {
    constructor(color: string | number[]);
    sRGB: [number, number, number];
  }

  export function mix(...args: (Color | number | [Color, number])[]): Color;
}
