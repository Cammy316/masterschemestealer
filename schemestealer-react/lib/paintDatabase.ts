/**
 * Paint Database - Auto-generated
 *
 * Contains 1312 pre-computed paints with RGB and LAB values.
 * Generated from the master paints_groundtruth.json database.
 *
 * DO NOT EDIT MANUALLY - run `node scripts/generatePaintDatabase.js` to regenerate.
 *
 * Last generated: 2026-07-03T10:05:37.958Z
 */

import type { RGB, LAB } from './colorConversion';

export interface PaintData {
  paint_id: string;
  name: string;
  brand: string;
  hex: string;
  rgb: RGB;
  lab: LAB;
  type: string;          // capitalised role (Base/Layer/Shade…) — back-compat
  category: string;      // raw lowercase DB category
  family: string;        // capitalised family — back-compat
  colorFamily: string;   // lowercase canonical family (matches backend color_family)
  finish: string;        // sheen: flat/matte/satin/glossy (never 'metallic')
  metallic: boolean;     // metallic-ness flag (replaces finish === 'metallic')
  transparency: number;
  matchable: boolean;
  aliases: string[];     // alt names (old Warpaints names, GW names) for search
}

/**
 * Pre-computed paint database with LAB values
 * Optimized subset of ~1312 paints for fast offline matching
 */
export const PAINT_DATABASE: PaintData[] = [
  {
    "paint_id": "ak-3gen-afro-shadow",
    "name": "Afro Shadow",
    "brand": "AK",
    "hex": "#35221B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 53,
      "g": 34,
      "b": 27
    },
    "lab": {
      "l": 15.38,
      "a": 8.04,
      "b": 8.39
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-alga-green",
    "name": "Alga Green",
    "brand": "AK",
    "hex": "#586F31",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 88,
      "g": 111,
      "b": 49
    },
    "lab": {
      "l": 43.75,
      "a": -19.44,
      "b": 31.39
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-aluminium",
    "name": "Aluminium",
    "brand": "AK",
    "hex": "#E6DFD9",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 230,
      "g": 223,
      "b": 217
    },
    "lab": {
      "l": 89.21,
      "a": 1.34,
      "b": 3.78
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-amaranth-red",
    "name": "Amaranth Red",
    "brand": "AK",
    "hex": "#CC402E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 204,
      "g": 64,
      "b": 46
    },
    "lab": {
      "l": 47.89,
      "a": 54.25,
      "b": 41.65
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-amethyst-blue",
    "name": "Amethyst Blue",
    "brand": "AK",
    "hex": "#31285D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 49,
      "g": 40,
      "b": 93
    },
    "lab": {
      "l": 19.89,
      "a": 19.25,
      "b": -30.46
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-anodized-violet",
    "name": "Anodized Violet",
    "brand": "AK",
    "hex": "#8F7CAF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 143,
      "g": 124,
      "b": 175
    },
    "lab": {
      "l": 55.43,
      "a": 17.81,
      "b": -24.34
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-anthracite-grey",
    "name": "Anthracite Grey",
    "brand": "AK",
    "hex": "#2F3D43",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 61,
      "b": 67
    },
    "lab": {
      "l": 24.79,
      "a": -4.03,
      "b": -5.55
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-aquatic-turquoise",
    "name": "Aquatic Turquoise",
    "brand": "AK",
    "hex": "#00869F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 134,
      "b": 159
    },
    "lab": {
      "l": 51.33,
      "a": -21.32,
      "b": -21.95
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-archaic-turquoise",
    "name": "Archaic Turquoise",
    "brand": "AK",
    "hex": "#00657F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 101,
      "b": 127
    },
    "lab": {
      "l": 39.31,
      "a": -14.95,
      "b": -21.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ash-grey",
    "name": "Ash Grey",
    "brand": "AK",
    "hex": "#4F4F4F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 79,
      "g": 79,
      "b": 79
    },
    "lab": {
      "l": 33.6,
      "a": 0,
      "b": 0
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-astral-beryllium",
    "name": "Astral Beryllium",
    "brand": "AK",
    "hex": "#5B8EA5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 91,
      "g": 142,
      "b": 165
    },
    "lab": {
      "l": 56.37,
      "a": -10.75,
      "b": -17.48
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-basalt-grey",
    "name": "Basalt Grey",
    "brand": "AK",
    "hex": "#494D52",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 73,
      "g": 77,
      "b": 82
    },
    "lab": {
      "l": 32.55,
      "a": -0.46,
      "b": -3.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-basic-skin-tone",
    "name": "Basic Skin Tone",
    "brand": "AK",
    "hex": "#F0AF89",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 240,
      "g": 175,
      "b": 137
    },
    "lab": {
      "l": 76.68,
      "a": 19.16,
      "b": 28.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-beast-brown",
    "name": "Beast Brown",
    "brand": "AK",
    "hex": "#6F2E15",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 111,
      "g": 46,
      "b": 21
    },
    "lab": {
      "l": 27.81,
      "a": 27.2,
      "b": 29.3
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-beige",
    "name": "Beige",
    "brand": "AK",
    "hex": "#D0A769",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 208,
      "g": 167,
      "b": 105
    },
    "lab": {
      "l": 70.92,
      "a": 7.34,
      "b": 37.61
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-beige-red",
    "name": "Beige Red",
    "brand": "AK",
    "hex": "#CC8366",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 204,
      "g": 131,
      "b": 102
    },
    "lab": {
      "l": 61.68,
      "a": 24.97,
      "b": 27.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-black",
    "name": "Black",
    "brand": "AK",
    "hex": "#141317",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 20,
      "g": 19,
      "b": 23
    },
    "lab": {
      "l": 6.11,
      "a": 1.36,
      "b": -2.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-black-green",
    "name": "Black Green",
    "brand": "AK",
    "hex": "#1B3721",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 27,
      "g": 55,
      "b": 33
    },
    "lab": {
      "l": 20.34,
      "a": -16.51,
      "b": 10.59
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-black-night",
    "name": "Black Night",
    "brand": "AK",
    "hex": "#14100E",
    "type": "Shade",
    "category": "wash",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 20,
      "g": 16,
      "b": 14
    },
    "lab": {
      "l": 4.98,
      "a": 1.2,
      "b": 1.54
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-black-purple",
    "name": "Black Purple",
    "brand": "AK",
    "hex": "#2B2223",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 43,
      "g": 34,
      "b": 35
    },
    "lab": {
      "l": 14.28,
      "a": 4.49,
      "b": 0.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-black-red",
    "name": "Black Red",
    "brand": "AK",
    "hex": "#4A1917",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 74,
      "g": 25,
      "b": 23
    },
    "lab": {
      "l": 16.57,
      "a": 23.17,
      "b": 13.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-blood-red",
    "name": "Blood Red",
    "brand": "AK",
    "hex": "#D10F14",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 209,
      "g": 15,
      "b": 20
    },
    "lab": {
      "l": 44.16,
      "a": 67.7,
      "b": 51.37
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-blue-green",
    "name": "Blue Green",
    "brand": "AK",
    "hex": "#008E9F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 142,
      "b": 159
    },
    "lab": {
      "l": 53.86,
      "a": -25.48,
      "b": -18.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-blue-grey",
    "name": "Blue Grey",
    "brand": "AK",
    "hex": "#96A9AB",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 150,
      "g": 169,
      "b": 171
    },
    "lab": {
      "l": 67.87,
      "a": -6.19,
      "b": -3.28
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-blue-moon",
    "name": "Blue Moon",
    "brand": "AK",
    "hex": "#125899",
    "type": "Shade",
    "category": "wash",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 18,
      "g": 88,
      "b": 153
    },
    "lab": {
      "l": 36.76,
      "a": 4.54,
      "b": -41.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-blue-violet",
    "name": "Blue Violet",
    "brand": "AK",
    "hex": "#8664C6",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 134,
      "g": 100,
      "b": 198
    },
    "lab": {
      "l": 49.81,
      "a": 34.89,
      "b": -46.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-bordeaux-red",
    "name": "Bordeaux Red",
    "brand": "AK",
    "hex": "#9F384D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 159,
      "g": 56,
      "b": 77
    },
    "lab": {
      "l": 39.13,
      "a": 44.36,
      "b": 10.62
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-brass",
    "name": "Brass",
    "brand": "AK",
    "hex": "#B47F2E",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 180,
      "g": 127,
      "b": 46
    },
    "lab": {
      "l": 57.15,
      "a": 12.98,
      "b": 49.99
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-brick-red",
    "name": "Brick Red",
    "brand": "AK",
    "hex": "#8D0B19",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 141,
      "g": 11,
      "b": 25
    },
    "lab": {
      "l": 29.35,
      "a": 50.26,
      "b": 30.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-british-khaki",
    "name": "British Khaki",
    "brand": "AK",
    "hex": "#745225",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 116,
      "g": 82,
      "b": 37
    },
    "lab": {
      "l": 37.63,
      "a": 9.16,
      "b": 31.39
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-bronze",
    "name": "Bronze",
    "brand": "AK",
    "hex": "#765A1A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 118,
      "g": 90,
      "b": 26
    },
    "lab": {
      "l": 39.98,
      "a": 4.67,
      "b": 39.29
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-brown-rose",
    "name": "Brown Rose",
    "brand": "AK",
    "hex": "#C07268",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 192,
      "g": 114,
      "b": 104
    },
    "lab": {
      "l": 56.33,
      "a": 29.63,
      "b": 18.77
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-brownish-green",
    "name": "Brownish Green",
    "brand": "AK",
    "hex": "#6A652E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 106,
      "g": 101,
      "b": 46
    },
    "lab": {
      "l": 42.11,
      "a": -6.13,
      "b": 31.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-buff",
    "name": "Buff",
    "brand": "AK",
    "hex": "#CBA672",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 203,
      "g": 166,
      "b": 114
    },
    "lab": {
      "l": 70.31,
      "a": 6.71,
      "b": 32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-burn-orange",
    "name": "Burn Orange",
    "brand": "AK",
    "hex": "#CD3E36",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 205,
      "g": 62,
      "b": 54
    },
    "lab": {
      "l": 47.87,
      "a": 55.66,
      "b": 37.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-burnt-red",
    "name": "Burnt Red",
    "brand": "AK",
    "hex": "#651A14",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 26,
      "b": 20
    },
    "lab": {
      "l": 22.15,
      "a": 33.13,
      "b": 23.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-burnt-tin",
    "name": "Burnt Tin",
    "brand": "AK",
    "hex": "#412E20",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 65,
      "g": 46,
      "b": 32
    },
    "lab": {
      "l": 20.76,
      "a": 6.59,
      "b": 12.43
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-burnt-umber",
    "name": "Burnt Umber",
    "brand": "AK",
    "hex": "#3E342A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 62,
      "g": 52,
      "b": 42
    },
    "lab": {
      "l": 22.47,
      "a": 2.6,
      "b": 7.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-cadmium-red",
    "name": "Cadmium Red",
    "brand": "AK",
    "hex": "#E9471B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 233,
      "g": 71,
      "b": 27
    },
    "lab": {
      "l": 53.94,
      "a": 60.51,
      "b": 57.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-camouflage-green",
    "name": "Camouflage Green",
    "brand": "AK",
    "hex": "#5E5A37",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 94,
      "g": 90,
      "b": 55
    },
    "lab": {
      "l": 37.79,
      "a": -4.26,
      "b": 20.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-carmine",
    "name": "Carmine",
    "brand": "AK",
    "hex": "#B30223",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 179,
      "g": 2,
      "b": 35
    },
    "lab": {
      "l": 37.39,
      "a": 61.79,
      "b": 35.39
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-carmine-dawn",
    "name": "Carmine Dawn",
    "brand": "AK",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-chocolate-chipping",
    "name": "Chocolate (Chipping)",
    "brand": "AK",
    "hex": "#4D3825",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 56,
      "b": 37
    },
    "lab": {
      "l": 25.38,
      "a": 6.56,
      "b": 15.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-cobalt-blue",
    "name": "Cobalt Blue",
    "brand": "AK",
    "hex": "#0B345A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 11,
      "g": 52,
      "b": 90
    },
    "lab": {
      "l": 21.08,
      "a": 1.83,
      "b": -26.71
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-cold-green",
    "name": "Cold Green",
    "brand": "AK",
    "hex": "#01433B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 67,
      "b": 59
    },
    "lab": {
      "l": 24.75,
      "a": -21.08,
      "b": -0.51
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-command-green",
    "name": "Command Green",
    "brand": "AK",
    "hex": "#454A34",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 69,
      "g": 74,
      "b": 52
    },
    "lab": {
      "l": 30.43,
      "a": -6.45,
      "b": 12.5
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-copper",
    "name": "Copper",
    "brand": "AK",
    "hex": "#B15D23",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 177,
      "g": 93,
      "b": 35
    },
    "lab": {
      "l": 48.64,
      "a": 30.02,
      "b": 46.36
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-cork",
    "name": "Cork",
    "brand": "AK",
    "hex": "#AF7355",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 175,
      "g": 115,
      "b": 85
    },
    "lab": {
      "l": 54.06,
      "a": 20.28,
      "b": 26.24
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-crimson-veil",
    "name": "Crimson Veil",
    "brand": "AK",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-aluminium",
    "name": "Dark Aluminium",
    "brand": "AK",
    "hex": "#D0D0CE",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 208,
      "g": 208,
      "b": 206
    },
    "lab": {
      "l": 83.43,
      "a": -0.36,
      "b": 0.99
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-blue",
    "name": "Dark Blue",
    "brand": "AK",
    "hex": "#0B276A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 11,
      "g": 39,
      "b": 106
    },
    "lab": {
      "l": 18.2,
      "a": 18.37,
      "b": -41.85
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-blue-grey",
    "name": "Dark Blue Grey",
    "brand": "AK",
    "hex": "#5B7579",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 91,
      "g": 117,
      "b": 121
    },
    "lab": {
      "l": 47.4,
      "a": -8.43,
      "b": -5.3
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-brown",
    "name": "Dark Brown",
    "brand": "AK",
    "hex": "#5D422F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 93,
      "g": 66,
      "b": 47
    },
    "lab": {
      "l": 30.47,
      "a": 9.04,
      "b": 16.16
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-flesh",
    "name": "Dark Flesh",
    "brand": "AK",
    "hex": "#D39140",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 211,
      "g": 145,
      "b": 64
    },
    "lab": {
      "l": 65.34,
      "a": 17.49,
      "b": 51.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-green",
    "name": "Dark Green",
    "brand": "AK",
    "hex": "#03542C",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 3,
      "g": 84,
      "b": 44
    },
    "lab": {
      "l": 30.74,
      "a": -32.59,
      "b": 17.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-green-grey",
    "name": "Dark Green Grey",
    "brand": "AK",
    "hex": "#455950",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 69,
      "g": 89,
      "b": 80
    },
    "lab": {
      "l": 35.96,
      "a": -9.77,
      "b": 2.7
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-grey",
    "name": "Dark Grey",
    "brand": "AK",
    "hex": "#3E474D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 71,
      "b": 77
    },
    "lab": {
      "l": 29.58,
      "a": -2.14,
      "b": -4.82
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-dark-grey",
    "name": "Dark Grey",
    "brand": "AK",
    "hex": "#5E5B5C",
    "type": "Shade",
    "category": "wash",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 94,
      "g": 91,
      "b": 92
    },
    "lab": {
      "l": 38.96,
      "a": 1.4,
      "b": -0.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-prussian-blue",
    "name": "Dark Prussian Blue",
    "brand": "AK",
    "hex": "#05234D",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 5,
      "g": 35,
      "b": 77
    },
    "lab": {
      "l": 14.23,
      "a": 7.8,
      "b": -28.96
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-rust",
    "name": "Dark Rust",
    "brand": "AK",
    "hex": "#713F32",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 63,
      "b": 50
    },
    "lab": {
      "l": 32.47,
      "a": 20.33,
      "b": 17.41
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-sand",
    "name": "Dark Sand",
    "brand": "AK",
    "hex": "#D6AF6C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 214,
      "g": 175,
      "b": 108
    },
    "lab": {
      "l": 73.57,
      "a": 5.82,
      "b": 39.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-sea-blue",
    "name": "Dark Sea Blue",
    "brand": "AK",
    "hex": "#1B333A",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 27,
      "g": 51,
      "b": 58
    },
    "lab": {
      "l": 19.66,
      "a": -7.05,
      "b": -7.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dark-sea-grey",
    "name": "Dark Sea Grey",
    "brand": "AK",
    "hex": "#645E5E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 100,
      "g": 94,
      "b": 94
    },
    "lab": {
      "l": 40.45,
      "a": 2.39,
      "b": 0.86
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dead-red",
    "name": "Dead Red",
    "brand": "AK",
    "hex": "#F73E59",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 247,
      "g": 62,
      "b": 89
    },
    "lab": {
      "l": 56.03,
      "a": 70.01,
      "b": 28.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deck-tan",
    "name": "Deck Tan",
    "brand": "AK",
    "hex": "#AFAC9F",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 175,
      "g": 172,
      "b": 159
    },
    "lab": {
      "l": 70.26,
      "a": -1.26,
      "b": 7.06
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-decomposed-flesh",
    "name": "Decomposed Flesh",
    "brand": "AK",
    "hex": "#AD8D67",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 173,
      "g": 141,
      "b": 103
    },
    "lab": {
      "l": 60.71,
      "a": 6.78,
      "b": 24.83
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-blue",
    "name": "Deep Blue",
    "brand": "AK",
    "hex": "#09439B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 9,
      "g": 67,
      "b": 155
    },
    "lab": {
      "l": 30.49,
      "a": 19.04,
      "b": -52.57
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-brown",
    "name": "Deep Brown",
    "brand": "AK",
    "hex": "#9A482C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 154,
      "g": 72,
      "b": 44
    },
    "lab": {
      "l": 40.72,
      "a": 32.18,
      "b": 32.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-green",
    "name": "Deep Green",
    "brand": "AK",
    "hex": "#01883F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 1,
      "g": 136,
      "b": 63
    },
    "lab": {
      "l": 49.46,
      "a": -48.4,
      "b": 30.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-orange",
    "name": "Deep Orange",
    "brand": "AK",
    "hex": "#FA501D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 250,
      "g": 80,
      "b": 29
    },
    "lab": {
      "l": 58.19,
      "a": 62.64,
      "b": 61.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-purple",
    "name": "Deep Purple",
    "brand": "AK",
    "hex": "#89277C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 137,
      "g": 39,
      "b": 124
    },
    "lab": {
      "l": 34.45,
      "a": 50.82,
      "b": -26.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-red",
    "name": "Deep Red",
    "brand": "AK",
    "hex": "#DE1720",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 222,
      "g": 23,
      "b": 32
    },
    "lab": {
      "l": 47.3,
      "a": 70.18,
      "b": 49.51
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-sky-blue",
    "name": "Deep Sky Blue",
    "brand": "AK",
    "hex": "#4EBAF9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 78,
      "g": 186,
      "b": 249
    },
    "lab": {
      "l": 71.94,
      "a": -11.39,
      "b": -40.17
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-violet",
    "name": "Deep Violet",
    "brand": "AK",
    "hex": "#8D48AD",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 141,
      "g": 72,
      "b": 173
    },
    "lab": {
      "l": 43.23,
      "a": 46.2,
      "b": -42.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-deep-yellow",
    "name": "Deep Yellow",
    "brand": "AK",
    "hex": "#F9C301",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 249,
      "g": 195,
      "b": 1
    },
    "lab": {
      "l": 81.39,
      "a": 5.76,
      "b": 82.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-dirtveil",
    "name": "Dirtveil",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dirty-red",
    "name": "Dirty Red",
    "brand": "AK",
    "hex": "#8C0723",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 140,
      "g": 7,
      "b": 35
    },
    "lab": {
      "l": 29.03,
      "a": 51,
      "b": 23.76
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dirty-yellow",
    "name": "Dirty Yellow",
    "brand": "AK",
    "hex": "#CF971F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 207,
      "g": 151,
      "b": 31
    },
    "lab": {
      "l": 66.14,
      "a": 11.21,
      "b": 64.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-dragon-blood",
    "name": "Dragon Blood",
    "brand": "AK",
    "hex": "#321721",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 50,
      "g": 23,
      "b": 33
    },
    "lab": {
      "l": 11.96,
      "a": 15.08,
      "b": -0.87
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ducat-blue",
    "name": "Ducat Blue",
    "brand": "AK",
    "hex": "#199EF5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 25,
      "g": 158,
      "b": 245
    },
    "lab": {
      "l": 62.72,
      "a": -2.29,
      "b": -52.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-emerald",
    "name": "Emerald",
    "brand": "AK",
    "hex": "#01806B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 128,
      "b": 107
    },
    "lab": {
      "l": 47.63,
      "a": -35.24,
      "b": 2.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-emerald-metallic-green",
    "name": "Emerald Metallic Green",
    "brand": "AK",
    "hex": "#057E6A",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 5,
      "g": 126,
      "b": 106
    },
    "lab": {
      "l": 46.97,
      "a": -34.39,
      "b": 2.61
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-english-grey",
    "name": "English Grey",
    "brand": "AK",
    "hex": "#5C636B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 92,
      "g": 99,
      "b": 107
    },
    "lab": {
      "l": 41.63,
      "a": -0.89,
      "b": -5.44
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-extra-dark-green",
    "name": "Extra Dark Green",
    "brand": "AK",
    "hex": "#333B30",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 59,
      "b": 48
    },
    "lab": {
      "l": 23.82,
      "a": -5.89,
      "b": 5.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-faded-green",
    "name": "Faded Green",
    "brand": "AK",
    "hex": "#6D886B",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 109,
      "g": 136,
      "b": 107
    },
    "lab": {
      "l": 53.94,
      "a": -15.61,
      "b": 12.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-foundry-red",
    "name": "Foundry Red",
    "brand": "AK",
    "hex": "#9F2120",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 159,
      "g": 33,
      "b": 32
    },
    "lab": {
      "l": 35.13,
      "a": 50.42,
      "b": 33.49
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-french-blue",
    "name": "French Blue",
    "brand": "AK",
    "hex": "#576573",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 87,
      "g": 101,
      "b": 115
    },
    "lab": {
      "l": 42.11,
      "a": -1.91,
      "b": -9.63
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-frog-green",
    "name": "Frog Green",
    "brand": "AK",
    "hex": "#95AE26",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 149,
      "g": 174,
      "b": 38
    },
    "lab": {
      "l": 67.13,
      "a": -26.09,
      "b": 61.46
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-german-field-grey",
    "name": "German Field Grey",
    "brand": "AK",
    "hex": "#4F4D3E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 79,
      "g": 77,
      "b": 62
    },
    "lab": {
      "l": 32.52,
      "a": -2.1,
      "b": 9.22
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-german-grey",
    "name": "German Grey",
    "brand": "AK",
    "hex": "#383A3F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 56,
      "g": 58,
      "b": 63
    },
    "lab": {
      "l": 24.4,
      "a": 0.35,
      "b": -3.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-gold",
    "name": "Gold",
    "brand": "AK",
    "hex": "#C48833",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 196,
      "g": 136,
      "b": 51
    },
    "lab": {
      "l": 61.3,
      "a": 15.28,
      "b": 52.59
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-golden-brown",
    "name": "Golden Brown",
    "brand": "AK",
    "hex": "#B87F26",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 184,
      "g": 127,
      "b": 38
    },
    "lab": {
      "l": 57.57,
      "a": 14.42,
      "b": 53.83
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-golden-olive",
    "name": "Golden Olive",
    "brand": "AK",
    "hex": "#767F2E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 118,
      "g": 127,
      "b": 46
    },
    "lab": {
      "l": 50.95,
      "a": -15.1,
      "b": 41.61
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-golden-yellow",
    "name": "Golden Yellow",
    "brand": "AK",
    "hex": "#FDB55D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 253,
      "g": 181,
      "b": 93
    },
    "lab": {
      "l": 78.88,
      "a": 17.57,
      "b": 54.22
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-graphite",
    "name": "Graphite",
    "brand": "AK",
    "hex": "#646665",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 100,
      "g": 102,
      "b": 101
    },
    "lab": {
      "l": 42.99,
      "a": -0.99,
      "b": 0.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-grass-green",
    "name": "Grass Green",
    "brand": "AK",
    "hex": "#5B9425",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 91,
      "g": 148,
      "b": 37
    },
    "lab": {
      "l": 55.62,
      "a": -37.09,
      "b": 49.6
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-green",
    "name": "Green",
    "brand": "AK",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-green-grey",
    "name": "Green Grey",
    "brand": "AK",
    "hex": "#CDC7AB",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 205,
      "g": 199,
      "b": 171
    },
    "lab": {
      "l": 80.05,
      "a": -2.59,
      "b": 14.79
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-green-ochre",
    "name": "Green Ochre",
    "brand": "AK",
    "hex": "#A77E4A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 167,
      "g": 126,
      "b": 74
    },
    "lab": {
      "l": 55.72,
      "a": 9.66,
      "b": 34.2
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-green-sky",
    "name": "Green Sky",
    "brand": "AK",
    "hex": "#9AB98A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 154,
      "g": 185,
      "b": 138
    },
    "lab": {
      "l": 71.83,
      "a": -19.29,
      "b": 20.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-green-brown",
    "name": "Green-Brown",
    "brand": "AK",
    "hex": "#7F6336",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 127,
      "g": 99,
      "b": 54
    },
    "lab": {
      "l": 43.8,
      "a": 5.53,
      "b": 29.61
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-greenish-white",
    "name": "Greenish White",
    "brand": "AK",
    "hex": "#DBEBCE",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 219,
      "g": 235,
      "b": 206
    },
    "lab": {
      "l": 91.2,
      "a": -10.42,
      "b": 12.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-greenskin-punch",
    "name": "Greenskin Punch",
    "brand": "AK",
    "hex": "#015D32",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 93,
      "b": 50
    },
    "lab": {
      "l": 34.12,
      "a": -35.11,
      "b": 18.11
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-grey-blue",
    "name": "Grey-Blue",
    "brand": "AK",
    "hex": "#7891B1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 120,
      "g": 145,
      "b": 177
    },
    "lab": {
      "l": 59.36,
      "a": -1.06,
      "b": -19.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-grey-brown",
    "name": "Grey-Brown",
    "brand": "AK",
    "hex": "#645647",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 100,
      "g": 86,
      "b": 71
    },
    "lab": {
      "l": 37.52,
      "a": 3.14,
      "b": 10.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-grey-green",
    "name": "Grey-Green",
    "brand": "AK",
    "hex": "#747766",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 116,
      "g": 119,
      "b": 102
    },
    "lab": {
      "l": 49.33,
      "a": -4.4,
      "b": 8.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-grim-brown",
    "name": "Grim Brown",
    "brand": "AK",
    "hex": "#282421",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 40,
      "g": 36,
      "b": 33
    },
    "lab": {
      "l": 14.53,
      "a": 1.2,
      "b": 2.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-grimy-grey",
    "name": "Grimy Grey",
    "brand": "AK",
    "hex": "#C3B399",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 195,
      "g": 179,
      "b": 153
    },
    "lab": {
      "l": 73.64,
      "a": 1.51,
      "b": 15.36
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-gun-metal",
    "name": "Gun Metal",
    "brand": "AK",
    "hex": "#616166",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 97,
      "g": 97,
      "b": 102
    },
    "lab": {
      "l": 41.3,
      "a": 1.07,
      "b": -2.83
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-gunship-green",
    "name": "Gunship Green",
    "brand": "AK",
    "hex": "#3E5944",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 89,
      "b": 68
    },
    "lab": {
      "l": 35.17,
      "a": -15.05,
      "b": 8.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-hazel-brown",
    "name": "Hazel Brown",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-hull-red",
    "name": "Hull Red",
    "brand": "AK",
    "hex": "#4F2720",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 79,
      "g": 39,
      "b": 32
    },
    "lab": {
      "l": 20.9,
      "a": 17.89,
      "b": 12.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ice-yellow",
    "name": "Ice Yellow",
    "brand": "AK",
    "hex": "#F5DCA4",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 245,
      "g": 220,
      "b": 164
    },
    "lab": {
      "l": 88.58,
      "a": 0.65,
      "b": 30.71
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-imperial-blue",
    "name": "Imperial Blue",
    "brand": "AK",
    "hex": "#0D0271",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 13,
      "g": 2,
      "b": 113
    },
    "lab": {
      "l": 11.42,
      "a": 42.71,
      "b": -57.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-intense-pink",
    "name": "Intense Pink",
    "brand": "AK",
    "hex": "#D762B7",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 215,
      "g": 98,
      "b": 183
    },
    "lab": {
      "l": 58.61,
      "a": 56.03,
      "b": -23.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-interior-yellow-green",
    "name": "Interior Yellow Green",
    "brand": "AK",
    "hex": "#C1AB36",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 193,
      "g": 171,
      "b": 54
    },
    "lab": {
      "l": 69.99,
      "a": -4.82,
      "b": 59.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-intermediate-blue",
    "name": "Intermediate Blue",
    "brand": "AK",
    "hex": "#71818B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 113,
      "g": 129,
      "b": 139
    },
    "lab": {
      "l": 53.03,
      "a": -3.57,
      "b": -7.36
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-intermediate-green",
    "name": "Intermediate Green",
    "brand": "AK",
    "hex": "#557D47",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 85,
      "g": 125,
      "b": 71
    },
    "lab": {
      "l": 48.33,
      "a": -24.94,
      "b": 25.07
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-invocation-purple",
    "name": "Invocation Purple",
    "brand": "AK",
    "hex": "#7A468C",
    "type": "Shade",
    "category": "wash",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 122,
      "g": 70,
      "b": 140
    },
    "lab": {
      "l": 38.57,
      "a": 34.67,
      "b": -30.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ivory",
    "name": "Ivory",
    "brand": "AK",
    "hex": "#EBE4C8",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 235,
      "g": 228,
      "b": 200
    },
    "lab": {
      "l": 90.47,
      "a": -2.22,
      "b": 14.53
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-japanese-brown",
    "name": "Japanese Brown",
    "brand": "AK",
    "hex": "#9B7719",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 155,
      "g": 119,
      "b": 25
    },
    "lab": {
      "l": 52.1,
      "a": 5.29,
      "b": 52.31
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-king-purple",
    "name": "King Purple",
    "brand": "AK",
    "hex": "#291724",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 41,
      "g": 23,
      "b": 36
    },
    "lab": {
      "l": 10.64,
      "a": 11.66,
      "b": -5.21
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-laser-magenta",
    "name": "Laser Magenta",
    "brand": "AK",
    "hex": "#7D013A",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 125,
      "g": 1,
      "b": 58
    },
    "lab": {
      "l": 25.83,
      "a": 49.55,
      "b": 3.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-laser-yellow",
    "name": "Laser Yellow",
    "brand": "AK",
    "hex": "#E3E42E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 227,
      "g": 228,
      "b": 46
    },
    "lab": {
      "l": 87.98,
      "a": -19.45,
      "b": 79.96
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-lead-grey",
    "name": "Lead Grey",
    "brand": "AK",
    "hex": "#333C43",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 60,
      "b": 67
    },
    "lab": {
      "l": 24.77,
      "a": -1.89,
      "b": -5.55
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-leather-brown",
    "name": "Leather Brown",
    "brand": "AK",
    "hex": "#59423C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 89,
      "g": 66,
      "b": 60
    },
    "lab": {
      "l": 30.27,
      "a": 8.97,
      "b": 7.51
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-lemon-yellow",
    "name": "Lemon Yellow",
    "brand": "AK",
    "hex": "#FDEA2A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 234,
      "b": 42
    },
    "lab": {
      "l": 91.64,
      "a": -11.67,
      "b": 84.87
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-brown",
    "name": "Light Brown",
    "brand": "AK",
    "hex": "#BE7445",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 190,
      "g": 116,
      "b": 69
    },
    "lab": {
      "l": 55.96,
      "a": 24.72,
      "b": 37.82
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-earth",
    "name": "Light Earth",
    "brand": "AK",
    "hex": "#BA9873",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 186,
      "g": 152,
      "b": 115
    },
    "lab": {
      "l": 65.07,
      "a": 7.48,
      "b": 24.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-flesh",
    "name": "Light Flesh",
    "brand": "AK",
    "hex": "#EECDC6",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 238,
      "g": 205,
      "b": 198
    },
    "lab": {
      "l": 84.96,
      "a": 10.47,
      "b": 7.76
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-green",
    "name": "Light Green",
    "brand": "AK",
    "hex": "#24A33F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 36,
      "g": 163,
      "b": 63
    },
    "lab": {
      "l": 58.91,
      "a": -54.36,
      "b": 41.63
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-orange",
    "name": "Light Orange",
    "brand": "AK",
    "hex": "#FE7A36",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 254,
      "g": 122,
      "b": 54
    },
    "lab": {
      "l": 65.95,
      "a": 46.32,
      "b": 58.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-prussian-blue",
    "name": "Light Prussian Blue",
    "brand": "AK",
    "hex": "#15385A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 21,
      "g": 56,
      "b": 90
    },
    "lab": {
      "l": 22.74,
      "a": 0.43,
      "b": -24.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-light-rust",
    "name": "Light Rust",
    "brand": "AK",
    "hex": "#EA6526",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 234,
      "g": 101,
      "b": 38
    },
    "lab": {
      "l": 58.92,
      "a": 48.41,
      "b": 57.64
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-light-rust",
    "name": "Light Rust",
    "brand": "AK",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 77
    },
    "lab": {
      "l": 59.53,
      "a": 23.57,
      "b": 38.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-lilac",
    "name": "Lilac",
    "brand": "AK",
    "hex": "#7B8FCA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 123,
      "g": 143,
      "b": 202
    },
    "lab": {
      "l": 60,
      "a": 7.67,
      "b": -32.74
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-lime-green",
    "name": "Lime Green",
    "brand": "AK",
    "hex": "#82961D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 130,
      "g": 150,
      "b": 29
    },
    "lab": {
      "l": 58.65,
      "a": -22.71,
      "b": 55.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-lizard-green",
    "name": "Lizard Green",
    "brand": "AK",
    "hex": "#026C46",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 108,
      "b": 70
    },
    "lab": {
      "l": 39.88,
      "a": -36.48,
      "b": 13.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-luminous-flesh",
    "name": "Luminous Flesh",
    "brand": "AK",
    "hex": "#F4C29B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 244,
      "g": 194,
      "b": 155
    },
    "lab": {
      "l": 81.94,
      "a": 12.68,
      "b": 26.43
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-luminous-green",
    "name": "Luminous Green",
    "brand": "AK",
    "hex": "#D5DB45",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 213,
      "g": 219,
      "b": 69
    },
    "lab": {
      "l": 84.61,
      "a": -19.93,
      "b": 69.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-luminous-orange",
    "name": "Luminous Orange",
    "brand": "AK",
    "hex": "#F66400",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 246,
      "g": 100,
      "b": 0
    },
    "lab": {
      "l": 60.53,
      "a": 52.69,
      "b": 69.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-magenta",
    "name": "Magenta",
    "brand": "AK",
    "hex": "#950B4E",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 149,
      "g": 11,
      "b": 78
    },
    "lab": {
      "l": 32.22,
      "a": 55.54,
      "b": -0.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-mahogany-brown",
    "name": "Mahogany Brown",
    "brand": "AK",
    "hex": "#763B2F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 118,
      "g": 59,
      "b": 47
    },
    "lab": {
      "l": 32.23,
      "a": 24.57,
      "b": 19.12
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-matt-red",
    "name": "Matt Red",
    "brand": "AK",
    "hex": "#AA1B0A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 170,
      "g": 27,
      "b": 10
    },
    "lab": {
      "l": 36.66,
      "a": 54.88,
      "b": 46.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-blue",
    "name": "Medium Blue",
    "brand": "AK",
    "hex": "#035684",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 3,
      "g": 86,
      "b": 132
    },
    "lab": {
      "l": 34.68,
      "a": -3.72,
      "b": -31.8
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-flesh-tone",
    "name": "Medium Flesh Tone",
    "brand": "AK",
    "hex": "#BC7B3A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 188,
      "g": 123,
      "b": 58
    },
    "lab": {
      "l": 57.24,
      "a": 19.33,
      "b": 44.82
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-grey",
    "name": "Medium Grey",
    "brand": "AK",
    "hex": "#ACB1B4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 172,
      "g": 177,
      "b": 180
    },
    "lab": {
      "l": 71.9,
      "a": -1.17,
      "b": -2.14
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-olive-green",
    "name": "Medium Olive Green",
    "brand": "AK",
    "hex": "#466132",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 70,
      "g": 97,
      "b": 50
    },
    "lab": {
      "l": 37.99,
      "a": -19.44,
      "b": 23.56
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-orange",
    "name": "Medium Orange",
    "brand": "AK",
    "hex": "#F84F22",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 248,
      "g": 79,
      "b": 34
    },
    "lab": {
      "l": 57.72,
      "a": 62.47,
      "b": 59.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-rust",
    "name": "Medium Rust",
    "brand": "AK",
    "hex": "#A43B2C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 164,
      "g": 59,
      "b": 44
    },
    "lab": {
      "l": 39.92,
      "a": 42.48,
      "b": 32.03
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-sand",
    "name": "Medium Sand",
    "brand": "AK",
    "hex": "#AF7E3D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 175,
      "g": 126,
      "b": 61
    },
    "lab": {
      "l": 56.46,
      "a": 12.18,
      "b": 42.05
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-medium-sea-green",
    "name": "Medium Sea-Green",
    "brand": "AK",
    "hex": "#909483",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 144,
      "g": 148,
      "b": 131
    },
    "lab": {
      "l": 60.56,
      "a": -4.64,
      "b": 8.5
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-metallic-blue",
    "name": "Metallic Blue",
    "brand": "AK",
    "hex": "#43A6CA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 67,
      "g": 166,
      "b": 202
    },
    "lab": {
      "l": 63.94,
      "a": -17.48,
      "b": -26.85
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-metallic-green",
    "name": "Metallic Green",
    "brand": "AK",
    "hex": "#77B088",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 119,
      "g": 176,
      "b": 136
    },
    "lab": {
      "l": 67.09,
      "a": -27.14,
      "b": 14.68
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-middle-stone",
    "name": "Middle Stone",
    "brand": "AK",
    "hex": "#8A6F36",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 138,
      "g": 111,
      "b": 54
    },
    "lab": {
      "l": 48.31,
      "a": 3.59,
      "b": 35.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-mint-green",
    "name": "Mint Green",
    "brand": "AK",
    "hex": "#15A57E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 21,
      "g": 165,
      "b": 126
    },
    "lab": {
      "l": 60.4,
      "a": -44.73,
      "b": 10.37
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-mud-brown",
    "name": "Mud Brown",
    "brand": "AK",
    "hex": "#6A4A35",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 106,
      "g": 74,
      "b": 53
    },
    "lab": {
      "l": 34.44,
      "a": 10.8,
      "b": 17.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-natural-steel",
    "name": "Natural Steel",
    "brand": "AK",
    "hex": "#8E8F91",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 142,
      "g": 143,
      "b": 145
    },
    "lab": {
      "l": 59.38,
      "a": 0.03,
      "b": -1.19
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-neutral-grey",
    "name": "Neutral Grey",
    "brand": "AK",
    "hex": "#5A5F65",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 90,
      "g": 95,
      "b": 101
    },
    "lab": {
      "l": 40.08,
      "a": -0.61,
      "b": -4.09
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-obsidian-holt",
    "name": "Obsidian Holt",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ocean-blue",
    "name": "Ocean Blue",
    "brand": "AK",
    "hex": "#194957",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 25,
      "g": 73,
      "b": 87
    },
    "lab": {
      "l": 28.54,
      "a": -11.04,
      "b": -13.06
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ocher-orange",
    "name": "Ocher Orange",
    "brand": "AK",
    "hex": "#E7A571",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 231,
      "g": 165,
      "b": 113
    },
    "lab": {
      "l": 72.95,
      "a": 18.56,
      "b": 36.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ochre",
    "name": "Ochre",
    "brand": "AK",
    "hex": "#CF983D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 207,
      "g": 152,
      "b": 61
    },
    "lab": {
      "l": 66.57,
      "a": 11.82,
      "b": 54.02
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-offwhite",
    "name": "Offwhite",
    "brand": "AK",
    "hex": "#DCD9D2",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 220,
      "g": 217,
      "b": 210
    },
    "lab": {
      "l": 86.75,
      "a": -0.21,
      "b": 3.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-oily-steel",
    "name": "Oily Steel",
    "brand": "AK",
    "hex": "#6E6D6B",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 110,
      "g": 109,
      "b": 107
    },
    "lab": {
      "l": 46.06,
      "a": -0.02,
      "b": 1.25
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-old-gold",
    "name": "Old Gold",
    "brand": "AK",
    "hex": "#9F7517",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 159,
      "g": 117,
      "b": 23
    },
    "lab": {
      "l": 52.01,
      "a": 8.22,
      "b": 53.05
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-old-rose",
    "name": "Old Rose",
    "brand": "AK",
    "hex": "#E1808F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 225,
      "g": 128,
      "b": 143
    },
    "lab": {
      "l": 64.51,
      "a": 38.97,
      "b": 8.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-olive-green",
    "name": "Olive Green",
    "brand": "AK",
    "hex": "#5E6827",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 94,
      "g": 104,
      "b": 39
    },
    "lab": {
      "l": 41.89,
      "a": -14,
      "b": 34.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-orange-brown",
    "name": "Orange Brown",
    "brand": "AK",
    "hex": "#C47534",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 196,
      "g": 117,
      "b": 52
    },
    "lab": {
      "l": 56.79,
      "a": 25.72,
      "b": 47.53
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-oxford",
    "name": "Oxford",
    "brand": "AK",
    "hex": "#3E4360",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 62,
      "g": 67,
      "b": 96
    },
    "lab": {
      "l": 29.11,
      "a": 5.78,
      "b": -17.78
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pale-blue",
    "name": "Pale Blue",
    "brand": "AK",
    "hex": "#AAC7C3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 170,
      "g": 199,
      "b": 195
    },
    "lab": {
      "l": 78.07,
      "a": -10.51,
      "b": -1.27
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pale-grey",
    "name": "Pale Grey",
    "brand": "AK",
    "hex": "#A3A8AE",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 163,
      "g": 168,
      "b": 174
    },
    "lab": {
      "l": 68.64,
      "a": -0.59,
      "b": -3.7
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pale-sand",
    "name": "Pale Sand",
    "brand": "AK",
    "hex": "#E5CCA3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 229,
      "g": 204,
      "b": 163
    },
    "lab": {
      "l": 83.17,
      "a": 2.68,
      "b": 23.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pale-yellow",
    "name": "Pale Yellow",
    "brand": "AK",
    "hex": "#F4D279",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 244,
      "g": 210,
      "b": 121
    },
    "lab": {
      "l": 85.36,
      "a": 0.92,
      "b": 48.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pastel-blue",
    "name": "Pastel Blue",
    "brand": "AK",
    "hex": "#B0E3E7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 176,
      "g": 227,
      "b": 231
    },
    "lab": {
      "l": 86.97,
      "a": -15.39,
      "b": -7.3
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pastel-green",
    "name": "Pastel Green",
    "brand": "AK",
    "hex": "#A8EDDE",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 168,
      "g": 237,
      "b": 222
    },
    "lab": {
      "l": 89,
      "a": -24.59,
      "b": 0.36
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pastel-peach",
    "name": "Pastel Peach",
    "brand": "AK",
    "hex": "#FD9D5F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 253,
      "g": 157,
      "b": 95
    },
    "lab": {
      "l": 73.43,
      "a": 30.24,
      "b": 46.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pastel-pink",
    "name": "Pastel Pink",
    "brand": "AK",
    "hex": "#E3B9C5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 227,
      "g": 185,
      "b": 197
    },
    "lab": {
      "l": 79.08,
      "a": 16.96,
      "b": -0.34
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pastel-violet",
    "name": "Pastel Violet",
    "brand": "AK",
    "hex": "#D3BCE4",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 211,
      "g": 188,
      "b": 228
    },
    "lab": {
      "l": 79.28,
      "a": 15.46,
      "b": -16.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pastel-yellow",
    "name": "Pastel Yellow",
    "brand": "AK",
    "hex": "#F7DF99",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 247,
      "g": 223,
      "b": 153
    },
    "lab": {
      "l": 89.32,
      "a": -1.38,
      "b": 37.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pearl",
    "name": "Pearl",
    "brand": "AK",
    "hex": "#EBE3DB",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 235,
      "g": 227,
      "b": 219
    },
    "lab": {
      "l": 90.65,
      "a": 1.34,
      "b": 4.86
    },
    "finish": "matte",
    "metallic": true,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-pistachio",
    "name": "Pistachio",
    "brand": "AK",
    "hex": "#D0C22B",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 208,
      "g": 194,
      "b": 43
    },
    "lab": {
      "l": 77.38,
      "a": -10.68,
      "b": 70.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-pure-grime",
    "name": "Pure Grime",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-purple",
    "name": "Purple",
    "brand": "AK",
    "hex": "#6C3969",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 108,
      "g": 57,
      "b": 105
    },
    "lab": {
      "l": 32.11,
      "a": 30.2,
      "b": -18.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-purulent-yellow",
    "name": "Purulent Yellow",
    "brand": "AK",
    "hex": "#BEA952",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 190,
      "g": 169,
      "b": 82
    },
    "lab": {
      "l": 69.42,
      "a": -3.29,
      "b": 46.96
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-putrid-green",
    "name": "Putrid Green",
    "brand": "AK",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-radiant-flesh",
    "name": "Radiant Flesh",
    "brand": "AK",
    "hex": "#DA9961",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 218,
      "g": 153,
      "b": 97
    },
    "lab": {
      "l": 68.43,
      "a": 18.33,
      "b": 38.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-radiant-yellow",
    "name": "Radiant Yellow",
    "brand": "AK",
    "hex": "#FDCF10",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 207,
      "b": 16
    },
    "lab": {
      "l": 84.77,
      "a": 1.42,
      "b": 84.02
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-reddish-grey",
    "name": "Reddish Grey",
    "brand": "AK",
    "hex": "#7A6865",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 122,
      "g": 104,
      "b": 101
    },
    "lab": {
      "l": 45.6,
      "a": 6.6,
      "b": 4.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-redskin-shadow",
    "name": "Redskin Shadow",
    "brand": "AK",
    "hex": "#472512",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 71,
      "g": 37,
      "b": 18
    },
    "lab": {
      "l": 18.83,
      "a": 14.13,
      "b": 19.35
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-reflective-green",
    "name": "Reflective Green",
    "brand": "AK",
    "hex": "#5B5E33",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 91,
      "g": 94,
      "b": 51
    },
    "lab": {
      "l": 38.67,
      "a": -8.48,
      "b": 24.19
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-rock-grey",
    "name": "Rock Grey",
    "brand": "AK",
    "hex": "#A69E95",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 166,
      "g": 158,
      "b": 149
    },
    "lab": {
      "l": 65.54,
      "a": 1.29,
      "b": 5.74
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-rotwood-brown",
    "name": "Rotwood Brown",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-rubber-black",
    "name": "Rubber Black",
    "brand": "AK",
    "hex": "#343231",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 52,
      "g": 50,
      "b": 49
    },
    "lab": {
      "l": 20.95,
      "a": 0.66,
      "b": 0.95
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ruby",
    "name": "Ruby",
    "brand": "AK",
    "hex": "#C83055",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 200,
      "g": 48,
      "b": 85
    },
    "lab": {
      "l": 45.71,
      "a": 60.74,
      "b": 15.85
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-russian-green",
    "name": "Russian Green",
    "brand": "AK",
    "hex": "#3B442B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 59,
      "g": 68,
      "b": 43
    },
    "lab": {
      "l": 27.4,
      "a": -8.83,
      "b": 13.97
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-rusty-brass",
    "name": "Rusty Brass",
    "brand": "AK",
    "hex": "#BC7425",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 188,
      "g": 116,
      "b": 37
    },
    "lab": {
      "l": 55.4,
      "a": 22.23,
      "b": 52.39
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-rusty-gold",
    "name": "Rusty Gold",
    "brand": "AK",
    "hex": "#634A1E",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 99,
      "g": 74,
      "b": 30
    },
    "lab": {
      "l": 33.23,
      "a": 5.35,
      "b": 29.67
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-saddle-brown",
    "name": "Saddle Brown",
    "brand": "AK",
    "hex": "#7D4539",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 125,
      "g": 69,
      "b": 57
    },
    "lab": {
      "l": 35.82,
      "a": 22.69,
      "b": 17.75
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sahara-yellow",
    "name": "Sahara Yellow",
    "brand": "AK",
    "hex": "#B58125",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 181,
      "g": 129,
      "b": 37
    },
    "lab": {
      "l": 57.71,
      "a": 11.94,
      "b": 54.21
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-salmon",
    "name": "Salmon",
    "brand": "AK",
    "hex": "#E88C7F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 232,
      "g": 140,
      "b": 127
    },
    "lab": {
      "l": 67.61,
      "a": 33.56,
      "b": 21.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sand-yellow",
    "name": "Sand Yellow",
    "brand": "AK",
    "hex": "#E4BA54",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 228,
      "g": 186,
      "b": 84
    },
    "lab": {
      "l": 77.43,
      "a": 3.99,
      "b": 56.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-scarlet-red",
    "name": "Scarlet Red",
    "brand": "AK",
    "hex": "#DF2620",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 223,
      "g": 38,
      "b": 32
    },
    "lab": {
      "l": 48.49,
      "a": 67.63,
      "b": 50.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-sepia-filth",
    "name": "Sepia Filth",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sickly-pink",
    "name": "Sickly Pink",
    "brand": "AK",
    "hex": "#DD9AA1",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 221,
      "g": 154,
      "b": 161
    },
    "lab": {
      "l": 70.22,
      "a": 26.01,
      "b": 6.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-silver",
    "name": "Silver",
    "brand": "AK",
    "hex": "#C9C8C6",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 201,
      "g": 200,
      "b": 198
    },
    "lab": {
      "l": 80.63,
      "a": -0.02,
      "b": 1.12
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-silver-grey",
    "name": "Silver Grey",
    "brand": "AK",
    "hex": "#BBB6B3",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 187,
      "g": 182,
      "b": 179
    },
    "lab": {
      "l": 74.37,
      "a": 1.22,
      "b": 2.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sky-blue",
    "name": "Sky Blue",
    "brand": "AK",
    "hex": "#77C7F7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 119,
      "g": 199,
      "b": 247
    },
    "lab": {
      "l": 76.97,
      "a": -11.57,
      "b": -31.19
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sky-grey",
    "name": "Sky Grey",
    "brand": "AK",
    "hex": "#9A9BA0",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 154,
      "g": 155,
      "b": 160
    },
    "lab": {
      "l": 64.04,
      "a": 0.62,
      "b": -2.73
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-slime-green",
    "name": "Slime Green",
    "brand": "AK",
    "hex": "#4CBC05",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 76,
      "g": 188,
      "b": 5
    },
    "lab": {
      "l": 67.66,
      "a": -58.38,
      "b": 66.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-smoke-black",
    "name": "Smoke Black",
    "brand": "AK",
    "hex": "#2B2C2E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 43,
      "g": 44,
      "b": 46
    },
    "lab": {
      "l": 17.97,
      "a": 0.05,
      "b": -1.45
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-snow-blue",
    "name": "Snow Blue",
    "brand": "AK",
    "hex": "#BCDBEF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 188,
      "g": 219,
      "b": 239
    },
    "lab": {
      "l": 85.8,
      "a": -5.98,
      "b": -13.18
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-spectrum-blue",
    "name": "Spectrum Blue",
    "brand": "AK",
    "hex": "#ACC2D9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 172,
      "g": 194,
      "b": 217
    },
    "lab": {
      "l": 77.5,
      "a": -2.56,
      "b": -13.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-standard-rust",
    "name": "Standard Rust",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-star-blue",
    "name": "Star Blue",
    "brand": "AK",
    "hex": "#015A91",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 90,
      "b": 145
    },
    "lab": {
      "l": 36.67,
      "a": -1.03,
      "b": -36.56
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-strong-dark-blue",
    "name": "Strong Dark Blue",
    "brand": "AK",
    "hex": "#303745",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 55,
      "b": 69
    },
    "lab": {
      "l": 22.97,
      "a": 0.87,
      "b": -9.63
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sun-red",
    "name": "Sun Red",
    "brand": "AK",
    "hex": "#BB3115",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 187,
      "g": 49,
      "b": 21
    },
    "lab": {
      "l": 42.49,
      "a": 53.62,
      "b": 47.73
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-sunny-skin-tone",
    "name": "Sunny Skin Tone",
    "brand": "AK",
    "hex": "#F89E61",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 248,
      "g": 158,
      "b": 97
    },
    "lab": {
      "l": 73.07,
      "a": 27.86,
      "b": 45.36
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-tan-earth",
    "name": "Tan Earth",
    "brand": "AK",
    "hex": "#88614A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 136,
      "g": 97,
      "b": 74
    },
    "lab": {
      "l": 44.63,
      "a": 12.8,
      "b": 19.37
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-tan-yelow",
    "name": "Tan Yelow",
    "brand": "AK",
    "hex": "#C88D5E",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 200,
      "g": 141,
      "b": 94
    },
    "lab": {
      "l": 63.46,
      "a": 17.14,
      "b": 33.87
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-tenebrious-grey",
    "name": "Tenebrious Grey",
    "brand": "AK",
    "hex": "#2C2828",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 44,
      "g": 40,
      "b": 40
    },
    "lab": {
      "l": 16.53,
      "a": 1.84,
      "b": 0.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-turquoise",
    "name": "Turquoise",
    "brand": "AK",
    "hex": "#015568",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 1,
      "g": 85,
      "b": 104
    },
    "lab": {
      "l": 32.92,
      "a": -14.5,
      "b": -17.16
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-ultramarine",
    "name": "Ultramarine",
    "brand": "AK",
    "hex": "#2440AF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 36,
      "g": 64,
      "b": 175
    },
    "lab": {
      "l": 32.11,
      "a": 30.96,
      "b": -61.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-us-dark-green",
    "name": "US Dark Green",
    "brand": "AK",
    "hex": "#515433",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 81,
      "g": 84,
      "b": 51
    },
    "lab": {
      "l": 34.66,
      "a": -7.18,
      "b": 18.91
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-vampiric-flesh",
    "name": "Vampiric Flesh",
    "brand": "AK",
    "hex": "#C5AE8B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 197,
      "g": 174,
      "b": 139
    },
    "lab": {
      "l": 72.23,
      "a": 2.99,
      "b": 21.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-verdigris",
    "name": "Verdigris",
    "brand": "AK",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-vermillion",
    "name": "Vermillion",
    "brand": "AK",
    "hex": "#C51726",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 197,
      "g": 23,
      "b": 38
    },
    "lab": {
      "l": 42.2,
      "a": 63.8,
      "b": 39.77
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-violet-red",
    "name": "Violet Red",
    "brand": "AK",
    "hex": "#51213D",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 81,
      "g": 33,
      "b": 61
    },
    "lab": {
      "l": 20.73,
      "a": 26.24,
      "b": -7.2
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-volcanic-yellow",
    "name": "Volcanic Yellow",
    "brand": "AK",
    "hex": "#EB9405",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 235,
      "g": 148,
      "b": 5
    },
    "lab": {
      "l": 68.65,
      "a": 24.5,
      "b": 73.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-warm-grey",
    "name": "Warm Grey",
    "brand": "AK",
    "hex": "#A89C90",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 168,
      "g": 156,
      "b": 144
    },
    "lab": {
      "l": 65.05,
      "a": 2.3,
      "b": 7.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-white",
    "name": "White",
    "brand": "AK",
    "hex": "#F1F8F6",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 241,
      "g": 248,
      "b": 246
    },
    "lab": {
      "l": 97.02,
      "a": -2.66,
      "b": 0.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-white-grey",
    "name": "White Grey",
    "brand": "AK",
    "hex": "#C8C9CD",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 200,
      "g": 201,
      "b": 205
    },
    "lab": {
      "l": 80.99,
      "a": 0.4,
      "b": -2.11
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-wine-red",
    "name": "Wine Red",
    "brand": "AK",
    "hex": "#64041F",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 100,
      "g": 4,
      "b": 31
    },
    "lab": {
      "l": 19.62,
      "a": 40.4,
      "b": 12.81
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-acrylic-wash-woodgrain",
    "name": "Woodgrain",
    "brand": "AK",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "ak-3gen-yellow",
    "name": "Yellow",
    "brand": "AK",
    "hex": "#FDBF12",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 191,
      "b": 18
    },
    "lab": {
      "l": 80.85,
      "a": 9.69,
      "b": 80.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wph-leather-brown",
    "name": "/ WPH Leather Brown",
    "brand": "Army Painter",
    "hex": "#704F42",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 112,
      "g": 79,
      "b": 66
    },
    "lab": {
      "l": 36.8,
      "a": 12.03,
      "b": 13.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wph-matt-black",
    "name": "/ WPH Matt Black",
    "brand": "Army Painter",
    "hex": "#151415",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 21,
      "g": 20,
      "b": 21
    },
    "lab": {
      "l": 6.45,
      "a": 0.66,
      "b": -0.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wph-matt-white",
    "name": "/ WPH Matt White",
    "brand": "Army Painter",
    "hex": "#F4F6F4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 244,
      "g": 246,
      "b": 244
    },
    "lab": {
      "l": 96.69,
      "a": -1.02,
      "b": 0.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wph-paratrooper-tan",
    "name": "/ WPH Paratrooper Tan",
    "brand": "Army Painter",
    "hex": "#A27865",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 162,
      "g": 120,
      "b": 101
    },
    "lab": {
      "l": 54.09,
      "a": 13.79,
      "b": 16.85
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-abyssal-blue",
    "name": "Abyssal Blue",
    "brand": "Army Painter",
    "hex": "#134C61",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 19,
      "g": 76,
      "b": 97
    },
    "lab": {
      "l": 29.84,
      "a": -10.1,
      "b": -17.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-aegis-aqua",
    "name": "Aegis Aqua",
    "brand": "Army Painter",
    "hex": "#7BBDD2",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 123,
      "g": 189,
      "b": 210
    },
    "lab": {
      "l": 73.06,
      "a": -15.56,
      "b": -17.14
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-afterglow",
    "name": "Afterglow",
    "brand": "Army Painter",
    "hex": "#D9D99C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 217,
      "g": 217,
      "b": 156
    },
    "lab": {
      "l": 85.39,
      "a": -9.48,
      "b": 30.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-agate-skin-wph-weathered-skin",
    "name": "Agate Skin (= WPH Weathered Skin)",
    "brand": "Army Painter",
    "hex": "#CF776D",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 207,
      "g": 119,
      "b": 109
    },
    "lab": {
      "l": 59.5,
      "a": 33.28,
      "b": 20.52
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-alien-purple",
    "name": "Alien Purple",
    "brand": "Army Painter",
    "hex": "#644D7E",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 100,
      "g": 77,
      "b": 126
    },
    "lab": {
      "l": 36.97,
      "a": 20.21,
      "b": -24.14
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-alpha-blue",
    "name": "Alpha Blue",
    "brand": "Army Painter",
    "hex": "#5C6EAB",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 92,
      "g": 110,
      "b": 171
    },
    "lab": {
      "l": 47.45,
      "a": 10.07,
      "b": -34.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-amber-skin",
    "name": "Amber Skin",
    "brand": "Army Painter",
    "hex": "#C5A080",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 197,
      "g": 160,
      "b": 128
    },
    "lab": {
      "l": 68.44,
      "a": 9.14,
      "b": 21.85
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-amulet-aqua",
    "name": "Amulet Aqua",
    "brand": "Army Painter",
    "hex": "#73D9C5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 115,
      "g": 217,
      "b": 197
    },
    "lab": {
      "l": 80.35,
      "a": -34.58,
      "b": 0.65
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ancient-stone",
    "name": "Ancient Stone",
    "brand": "Army Painter",
    "hex": "#CDBAA8",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 205,
      "g": 186,
      "b": 168
    },
    "lab": {
      "l": 76.63,
      "a": 3.81,
      "b": 11.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-angel-green",
    "name": "Angel Green",
    "brand": "Army Painter",
    "hex": "#20483F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 32,
      "g": 72,
      "b": 63
    },
    "lab": {
      "l": 27.57,
      "a": -16.7,
      "b": 1.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-angelic-red",
    "name": "Angelic Red",
    "brand": "Army Painter",
    "hex": "#E93E38",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 233,
      "g": 62,
      "b": 56
    },
    "lab": {
      "l": 53.02,
      "a": 64.43,
      "b": 43.28
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-aqua-alchemy",
    "name": "Aqua Alchemy",
    "brand": "Army Painter",
    "hex": "#28BCAA",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 40,
      "g": 188,
      "b": 170
    },
    "lab": {
      "l": 68.98,
      "a": -41.26,
      "b": -1.61
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-aquamarine",
    "name": "Aquamarine",
    "brand": "Army Painter",
    "hex": "#64BFCB",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 100,
      "g": 191,
      "b": 203
    },
    "lab": {
      "l": 72.42,
      "a": -23.88,
      "b": -14.4
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-arctic-gem",
    "name": "Arctic Gem",
    "brand": "Army Painter",
    "hex": "#43A2EC",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 67,
      "g": 162,
      "b": 236
    },
    "lab": {
      "l": 64.23,
      "a": -4,
      "b": -45.19
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-army-green",
    "name": "Army Green",
    "brand": "Army Painter",
    "hex": "#5A664F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 90,
      "g": 102,
      "b": 79
    },
    "lab": {
      "l": 41.6,
      "a": -9.27,
      "b": 11.51
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ash-grey",
    "name": "Ash Grey",
    "brand": "Army Painter",
    "hex": "#959DA0",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 149,
      "g": 157,
      "b": 160
    },
    "lab": {
      "l": 64.19,
      "a": -2.25,
      "b": -2.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-ashroot",
    "name": "Ashroot",
    "brand": "Army Painter",
    "hex": "#5D3B3A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 93,
      "g": 59,
      "b": 58
    },
    "lab": {
      "l": 28.8,
      "a": 14.89,
      "b": 6.82
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-augur-blue",
    "name": "Augur Blue",
    "brand": "Army Painter",
    "hex": "#B6C0E9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 182,
      "g": 192,
      "b": 233
    },
    "lab": {
      "l": 78.18,
      "a": 5.17,
      "b": -21.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-autumn-sage",
    "name": "Autumn Sage",
    "brand": "Army Painter",
    "hex": "#8AA496",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 138,
      "g": 164,
      "b": 150
    },
    "lab": {
      "l": 65.09,
      "a": -11.9,
      "b": 4.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-banshee-brown",
    "name": "Banshee Brown",
    "brand": "Army Painter",
    "hex": "#362221",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 54,
      "g": 34,
      "b": 33
    },
    "lab": {
      "l": 15.69,
      "a": 9.45,
      "b": 4.57
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-barbarian-flesh-wph-rosy-skin",
    "name": "Barbarian Flesh (= WPH Rosy Skin)",
    "brand": "Army Painter",
    "hex": "#D98C74",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 217,
      "g": 140,
      "b": 116
    },
    "lab": {
      "l": 65.57,
      "a": 26.65,
      "b": 24.97
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-baron-blue",
    "name": "Baron Blue",
    "brand": "Army Painter",
    "hex": "#838ECA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 131,
      "g": 142,
      "b": 202
    },
    "lab": {
      "l": 60.28,
      "a": 10.47,
      "b": -32.26
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-barren-dune",
    "name": "Barren Dune",
    "brand": "Army Painter",
    "hex": "#D9B77C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 217,
      "g": 183,
      "b": 124
    },
    "lab": {
      "l": 76.12,
      "a": 4.38,
      "b": 34.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-basilisk-red",
    "name": "Basilisk Red",
    "brand": "Army Painter",
    "hex": "#6E1A2D",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 110,
      "g": 26,
      "b": 45
    },
    "lab": {
      "l": 24.46,
      "a": 37.87,
      "b": 9.91
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-beret-maroon",
    "name": "Beret Maroon",
    "brand": "Army Painter",
    "hex": "#78131E",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 120,
      "g": 19,
      "b": 30
    },
    "lab": {
      "l": 25.42,
      "a": 42.51,
      "b": 21.68
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-blanched-berry",
    "name": "Blanched Berry",
    "brand": "Army Painter",
    "hex": "#4E2128",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 78,
      "g": 33,
      "b": 40
    },
    "lab": {
      "l": 19.48,
      "a": 21.99,
      "b": 5.53
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-blighted-green",
    "name": "Blighted Green",
    "brand": "Army Painter",
    "hex": "#21342E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 33,
      "g": 52,
      "b": 46
    },
    "lab": {
      "l": 19.95,
      "a": -9.33,
      "b": 1.34
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-blood-chalice",
    "name": "Blood Chalice",
    "brand": "Army Painter",
    "hex": "#CD3546",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 205,
      "g": 53,
      "b": 70
    },
    "lab": {
      "l": 46.94,
      "a": 59.65,
      "b": 26.8
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-blood-thorn",
    "name": "Blood Thorn",
    "brand": "Army Painter",
    "hex": "#B50931",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 181,
      "g": 9,
      "b": 49
    },
    "lab": {
      "l": 38.28,
      "a": 62,
      "b": 27.97
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-boney-spikes",
    "name": "Boney Spikes",
    "brand": "Army Painter",
    "hex": "#E0C9B5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 224,
      "g": 201,
      "b": 181
    },
    "lab": {
      "l": 82.36,
      "a": 4.89,
      "b": 12.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-boot-brown",
    "name": "Boot Brown",
    "brand": "Army Painter",
    "hex": "#422117",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 66,
      "g": 33,
      "b": 23
    },
    "lab": {
      "l": 17.03,
      "a": 14.69,
      "b": 13.7
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-bootstrap-brown",
    "name": "Bootstrap Brown",
    "brand": "Army Painter",
    "hex": "#5A4741",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 90,
      "g": 71,
      "b": 65
    },
    "lab": {
      "l": 31.95,
      "a": 7.06,
      "b": 6.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-brainmatter-beige",
    "name": "Brainmatter Beige",
    "brand": "Army Painter",
    "hex": "#E7E7DA",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 231,
      "g": 231,
      "b": 218
    },
    "lab": {
      "l": 91.33,
      "a": -2.26,
      "b": 6.32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-bramble-grove",
    "name": "Bramble Grove",
    "brand": "Army Painter",
    "hex": "#667676",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 102,
      "g": 118,
      "b": 118
    },
    "lab": {
      "l": 48.37,
      "a": -5.91,
      "b": -2
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-brigade-grey",
    "name": "Brigade Grey",
    "brand": "Army Painter",
    "hex": "#CFD5DB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 207,
      "g": 213,
      "b": 219
    },
    "lab": {
      "l": 84.98,
      "a": -0.91,
      "b": -3.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-brigadine-brown",
    "name": "Brigadine Brown",
    "brand": "Army Painter",
    "hex": "#4E4645",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 78,
      "g": 70,
      "b": 69
    },
    "lab": {
      "l": 30.47,
      "a": 3.17,
      "b": 1.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-bright-gold",
    "name": "Bright Gold",
    "brand": "Army Painter",
    "hex": "#C38C2D",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 195,
      "g": 140,
      "b": 45
    },
    "lab": {
      "l": 62.13,
      "a": 12.38,
      "b": 55.84
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-bright-sapphire",
    "name": "Bright Sapphire",
    "brand": "Army Painter",
    "hex": "#88C2E3",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 136,
      "g": 194,
      "b": 227
    },
    "lab": {
      "l": 75.68,
      "a": -10.41,
      "b": -22.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-british-camo-green",
    "name": "British Camo Green",
    "brand": "Army Painter",
    "hex": "#5B754B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 91,
      "g": 117,
      "b": 75
    },
    "lab": {
      "l": 46.25,
      "a": -17.87,
      "b": 20.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-buffed-hide",
    "name": "Buffed Hide",
    "brand": "Army Painter",
    "hex": "#CE7F70",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 206,
      "g": 127,
      "b": 112
    },
    "lab": {
      "l": 61.2,
      "a": 28.91,
      "b": 21.1
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-burning-ore",
    "name": "Burning Ore",
    "brand": "Army Painter",
    "hex": "#F5562C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 245,
      "g": 86,
      "b": 44
    },
    "lab": {
      "l": 58.28,
      "a": 58.98,
      "b": 55.19
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-burnt-turf",
    "name": "Burnt Turf",
    "brand": "Army Painter",
    "hex": "#C4A160",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 196,
      "g": 161,
      "b": 96
    },
    "lab": {
      "l": 68.07,
      "a": 4.73,
      "b": 38.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-camo-brown",
    "name": "Camo Brown",
    "brand": "Army Painter",
    "hex": "#6F2613",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 111,
      "g": 38,
      "b": 19
    },
    "lab": {
      "l": 26.2,
      "a": 31.3,
      "b": 28.78
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-camo-sand",
    "name": "Camo Sand",
    "brand": "Army Painter",
    "hex": "#B4874E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 180,
      "g": 135,
      "b": 78
    },
    "lab": {
      "l": 59.51,
      "a": 10.6,
      "b": 37.01
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-camouflage-green",
    "name": "Camouflage Green",
    "brand": "Army Painter",
    "hex": "#68725A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 104,
      "g": 114,
      "b": 90
    },
    "lab": {
      "l": 46.6,
      "a": -8.49,
      "b": 12.07
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-canvas",
    "name": "Canvas",
    "brand": "Army Painter",
    "hex": "#A3937A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 163,
      "g": 147,
      "b": 122
    },
    "lab": {
      "l": 61.71,
      "a": 1.87,
      "b": 15.42
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-carnelian-skin",
    "name": "Carnelian Skin",
    "brand": "Army Painter",
    "hex": "#562E2F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 86,
      "g": 46,
      "b": 47
    },
    "lab": {
      "l": 24.12,
      "a": 18.42,
      "b": 7.41
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-cobalt-metal",
    "name": "Cobalt Metal",
    "brand": "Army Painter",
    "hex": "#7A92A7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 122,
      "g": 146,
      "b": 167
    },
    "lab": {
      "l": 59.42,
      "a": -3.54,
      "b": -13.83
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-command-khaki",
    "name": "Command Khaki",
    "brand": "Army Painter",
    "hex": "#BB9783",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 151,
      "b": 131
    },
    "lab": {
      "l": 65.23,
      "a": 10.48,
      "b": 15.63
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-company-grey",
    "name": "Company Grey",
    "brand": "Army Painter",
    "hex": "#B9C2CA",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 185,
      "g": 194,
      "b": 202
    },
    "lab": {
      "l": 77.97,
      "a": -1.53,
      "b": -5.07
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-crystal-blue",
    "name": "Crystal Blue",
    "brand": "Army Painter",
    "hex": "#016ECB",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 110,
      "b": 203
    },
    "lab": {
      "l": 46.27,
      "a": 9.76,
      "b": -55.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-cultist-purple",
    "name": "Cultist Purple",
    "brand": "Army Painter",
    "hex": "#85609E",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 133,
      "g": 96,
      "b": 158
    },
    "lab": {
      "l": 46.74,
      "a": 27.1,
      "b": -27.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-daemonic-yellow-wph-life-vest-yellow",
    "name": "Daemonic Yellow (= WPH Life Vest Yellow)",
    "brand": "Army Painter",
    "hex": "#EFB628",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 239,
      "g": 182,
      "b": 40
    },
    "lab": {
      "l": 77.26,
      "a": 8.82,
      "b": 72.84
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-dark-battle-dress",
    "name": "Dark Battle Dress",
    "brand": "Army Painter",
    "hex": "#463420",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 70,
      "g": 52,
      "b": 32
    },
    "lab": {
      "l": 23.21,
      "a": 5.11,
      "b": 15.73
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-dark-drab-dark-feldgrau",
    "name": "Dark Drab / Dark Feldgrau",
    "brand": "Army Painter",
    "hex": "#333F37",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 63,
      "b": 55
    },
    "lab": {
      "l": 25.37,
      "a": -6.85,
      "b": 3.28
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dark-emerald",
    "name": "Dark Emerald",
    "brand": "Army Painter",
    "hex": "#616A4F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 97,
      "g": 106,
      "b": 79
    },
    "lab": {
      "l": 43.38,
      "a": -8.69,
      "b": 14.05
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-dark-olive",
    "name": "Dark Olive",
    "brand": "Army Painter",
    "hex": "#302A29",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 42,
      "b": 41
    },
    "lab": {
      "l": 17.67,
      "a": 2.53,
      "b": 1.66
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-death-metal",
    "name": "Death Metal",
    "brand": "Army Painter",
    "hex": "#281F16",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 40,
      "g": 31,
      "b": 22
    },
    "lab": {
      "l": 12.54,
      "a": 2.68,
      "b": 7.79
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-deep-azure",
    "name": "Deep Azure",
    "brand": "Army Painter",
    "hex": "#00747E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 116,
      "b": 126
    },
    "lab": {
      "l": 44.23,
      "a": -23.48,
      "b": -13.36
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-deep-grey",
    "name": "Deep Grey",
    "brand": "Army Painter",
    "hex": "#454753",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 69,
      "g": 71,
      "b": 83
    },
    "lab": {
      "l": 30.39,
      "a": 2.05,
      "b": -7.41
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-deep-ocean-blue",
    "name": "Deep Ocean Blue",
    "brand": "Army Painter",
    "hex": "#29404F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 41,
      "g": 64,
      "b": 79
    },
    "lab": {
      "l": 25.87,
      "a": -4.29,
      "b": -11.87
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-demigod-flames",
    "name": "Demigod Flames",
    "brand": "Army Painter",
    "hex": "#C67A3C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 198,
      "g": 122,
      "b": 60
    },
    "lab": {
      "l": 58.28,
      "a": 24.26,
      "b": 45.34
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-desert-yellow",
    "name": "Desert Yellow",
    "brand": "Army Painter",
    "hex": "#947644",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 148,
      "g": 118,
      "b": 68
    },
    "lab": {
      "l": 51.46,
      "a": 5.29,
      "b": 31.77
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-dewpath",
    "name": "Dewpath",
    "brand": "Army Painter",
    "hex": "#236B71",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 35,
      "g": 107,
      "b": 113
    },
    "lab": {
      "l": 41.32,
      "a": -19.75,
      "b": -9.87
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-diabolic-plum",
    "name": "Diabolic Plum",
    "brand": "Army Painter",
    "hex": "#5B2F62",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 91,
      "g": 47,
      "b": 98
    },
    "lab": {
      "l": 27.13,
      "a": 28.9,
      "b": -21.92
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-diviner-light",
    "name": "Diviner Light",
    "brand": "Army Painter",
    "hex": "#E49BCC",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 228,
      "g": 155,
      "b": 204
    },
    "lab": {
      "l": 72.43,
      "a": 34.53,
      "b": -14.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-doomfire-drab",
    "name": "Doomfire Drab",
    "brand": "Army Painter",
    "hex": "#DFC3D9",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 223,
      "g": 195,
      "b": 217
    },
    "lab": {
      "l": 81.69,
      "a": 13.64,
      "b": -7.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dorado-skin",
    "name": "Dorado Skin",
    "brand": "Army Painter",
    "hex": "#D8B7A4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 216,
      "g": 183,
      "b": 164
    },
    "lab": {
      "l": 76.77,
      "a": 8.95,
      "b": 14.07
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dragon-red",
    "name": "Dragon Red",
    "brand": "Army Painter",
    "hex": "#A90E25",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 169,
      "g": 14,
      "b": 37
    },
    "lab": {
      "l": 35.76,
      "a": 57.8,
      "b": 31.82
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dryad-brown",
    "name": "Dryad Brown",
    "brand": "Army Painter",
    "hex": "#653F38",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 63,
      "b": 56
    },
    "lab": {
      "l": 30.9,
      "a": 15.68,
      "b": 11.19
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dusty-skull",
    "name": "Dusty Skull",
    "brand": "Army Painter",
    "hex": "#917F67",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 145,
      "g": 127,
      "b": 103
    },
    "lab": {
      "l": 54.22,
      "a": 3.01,
      "b": 15.6
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-elder-flower",
    "name": "Elder Flower",
    "brand": "Army Painter",
    "hex": "#B46084",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 180,
      "g": 96,
      "b": 132
    },
    "lab": {
      "l": 51.54,
      "a": 38.26,
      "b": -4.71
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-electric-lime",
    "name": "Electric Lime",
    "brand": "Army Painter",
    "hex": "#B6CE33",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 182,
      "g": 206,
      "b": 51
    },
    "lab": {
      "l": 78.65,
      "a": -27.26,
      "b": 68.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-emberveil",
    "name": "Emberveil",
    "brand": "Army Painter",
    "hex": "#E53518",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 229,
      "g": 53,
      "b": 24
    },
    "lab": {
      "l": 51.01,
      "a": 65.25,
      "b": 56.45
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-emerald-forest",
    "name": "Emerald Forest",
    "brand": "Army Painter",
    "hex": "#55B152",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 85,
      "g": 177,
      "b": 82
    },
    "lab": {
      "l": 64.95,
      "a": -46.69,
      "b": 40
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-emperor-gold",
    "name": "Emperor Gold",
    "brand": "Army Painter",
    "hex": "#8A4E30",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 138,
      "g": 78,
      "b": 48
    },
    "lab": {
      "l": 39.69,
      "a": 22.36,
      "b": 28.4
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-enchanted-pink",
    "name": "Enchanted Pink",
    "brand": "Army Painter",
    "hex": "#B54E95",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 181,
      "g": 78,
      "b": 149
    },
    "lab": {
      "l": 48.82,
      "a": 50.14,
      "b": -18.91
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-eternal-hunt",
    "name": "Eternal Hunt",
    "brand": "Army Painter",
    "hex": "#3B8A51",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 59,
      "g": 138,
      "b": 81
    },
    "lab": {
      "l": 51.5,
      "a": -37.5,
      "b": 23.41
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-evergreen-fog",
    "name": "Evergreen Fog",
    "brand": "Army Painter",
    "hex": "#3A5853",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 58,
      "g": 88,
      "b": 83
    },
    "lab": {
      "l": 35.01,
      "a": -12.35,
      "b": -0.65
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-evil-chrome",
    "name": "Evil Chrome",
    "brand": "Army Painter",
    "hex": "#B77569",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 183,
      "g": 117,
      "b": 105
    },
    "lab": {
      "l": 55.9,
      "a": 24.52,
      "b": 17.42
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-fair-skin",
    "name": "Fair Skin",
    "brand": "Army Painter",
    "hex": "#DA8F85",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 218,
      "g": 143,
      "b": 133
    },
    "lab": {
      "l": 66.71,
      "a": 27.25,
      "b": 17.08
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ferocious-green",
    "name": "Ferocious Green",
    "brand": "Army Painter",
    "hex": "#92CE97",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 146,
      "g": 206,
      "b": 151
    },
    "lab": {
      "l": 77.57,
      "a": -30.17,
      "b": 21.36
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fiendish-yellow",
    "name": "Fiendish Yellow",
    "brand": "Army Painter",
    "hex": "#DC9634",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 220,
      "g": 150,
      "b": 52
    },
    "lab": {
      "l": 67.49,
      "a": 18.07,
      "b": 59.2
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-fiery-vermilion",
    "name": "Fiery Vermilion",
    "brand": "Army Painter",
    "hex": "#E20A15",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 226,
      "g": 10,
      "b": 21
    },
    "lab": {
      "l": 47.55,
      "a": 72.49,
      "b": 54.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-figgy-pink",
    "name": "Figgy Pink",
    "brand": "Army Painter",
    "hex": "#D8A8BC",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 216,
      "g": 168,
      "b": 188
    },
    "lab": {
      "l": 73.7,
      "a": 20.72,
      "b": -3.45
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-flickering-flame",
    "name": "Flickering Flame",
    "brand": "Army Painter",
    "hex": "#EC762E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 236,
      "g": 118,
      "b": 46
    },
    "lab": {
      "l": 62.5,
      "a": 41.16,
      "b": 57.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-forbidden-fruit",
    "name": "Forbidden Fruit",
    "brand": "Army Painter",
    "hex": "#CD91AC",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 205,
      "g": 145,
      "b": 172
    },
    "lab": {
      "l": 66.68,
      "a": 26.71,
      "b": -5.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-forest-faun",
    "name": "Forest Faun",
    "brand": "Army Painter",
    "hex": "#9DB9A5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 157,
      "g": 185,
      "b": 165
    },
    "lab": {
      "l": 72.62,
      "a": -13.48,
      "b": 6.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-frost-blue",
    "name": "Frost Blue",
    "brand": "Army Painter",
    "hex": "#ABB6D1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 171,
      "g": 182,
      "b": 209
    },
    "lab": {
      "l": 74.01,
      "a": 1.81,
      "b": -14.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-frostveil",
    "name": "Frostveil",
    "brand": "Army Painter",
    "hex": "#015095",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 80,
      "b": 149
    },
    "lab": {
      "l": 33.8,
      "a": 7.21,
      "b": -43.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fur-brown",
    "name": "Fur Brown",
    "brand": "Army Painter",
    "hex": "#894A41",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 137,
      "g": 74,
      "b": 65
    },
    "lab": {
      "l": 38.9,
      "a": 25.67,
      "b": 17.2
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-gargoyle-grey",
    "name": "Gargoyle Grey",
    "brand": "Army Painter",
    "hex": "#A19E8D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 161,
      "g": 158,
      "b": 141
    },
    "lab": {
      "l": 64.93,
      "a": -1.96,
      "b": 9.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-gemstone-red",
    "name": "Gemstone Red",
    "brand": "Army Painter",
    "hex": "#A3383A",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 163,
      "g": 56,
      "b": 58
    },
    "lab": {
      "l": 39.45,
      "a": 44.26,
      "b": 23.04
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-german-camo-green",
    "name": "German Camo Green",
    "brand": "Army Painter",
    "hex": "#1E693E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 30,
      "g": 105,
      "b": 62
    },
    "lab": {
      "l": 39.12,
      "a": -33.56,
      "b": 17.73
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-gladeshard",
    "name": "Gladeshard",
    "brand": "Army Painter",
    "hex": "#65B200",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 101,
      "g": 178,
      "b": 0
    },
    "lab": {
      "l": 65.44,
      "a": -47.4,
      "b": 66.22
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-glittering-green",
    "name": "Glittering Green",
    "brand": "Army Painter",
    "hex": "#53975B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 83,
      "g": 151,
      "b": 91
    },
    "lab": {
      "l": 56.81,
      "a": -34.78,
      "b": 25.07
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-glowing-inferno",
    "name": "Glowing Inferno",
    "brand": "Army Painter",
    "hex": "#F18D29",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 241,
      "g": 141,
      "b": 41
    },
    "lab": {
      "l": 67.96,
      "a": 31.26,
      "b": 64.7
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-gothic-blue",
    "name": "Gothic Blue",
    "brand": "Army Painter",
    "hex": "#323E78",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 50,
      "g": 62,
      "b": 120
    },
    "lab": {
      "l": 28.06,
      "a": 13.8,
      "b": -34.78
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-great-hall-grey",
    "name": "Great Hall Grey",
    "brand": "Army Painter",
    "hex": "#B8B7A7",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 184,
      "g": 183,
      "b": 167
    },
    "lab": {
      "l": 74.09,
      "a": -2.49,
      "b": 8.26
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-greedy-gold",
    "name": "Greedy Gold",
    "brand": "Army Painter",
    "hex": "#A6651C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 166,
      "g": 101,
      "b": 28
    },
    "lab": {
      "l": 48.88,
      "a": 20.62,
      "b": 48.94
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-greenskin",
    "name": "Greenskin",
    "brand": "Army Painter",
    "hex": "#18693E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 24,
      "g": 105,
      "b": 62
    },
    "lab": {
      "l": 38.97,
      "a": -34.64,
      "b": 17.51
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-grey-castle",
    "name": "Grey Castle",
    "brand": "Army Painter",
    "hex": "#909186",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 144,
      "g": 145,
      "b": 134
    },
    "lab": {
      "l": 59.8,
      "a": -2.44,
      "b": 5.71
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-grotesque-green",
    "name": "Grotesque Green",
    "brand": "Army Painter",
    "hex": "#BABA95",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 186,
      "g": 186,
      "b": 149
    },
    "lab": {
      "l": 74.65,
      "a": -6.21,
      "b": 18.82
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-guardian-green",
    "name": "Guardian Green",
    "brand": "Army Painter",
    "hex": "#255240",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 37,
      "g": 82,
      "b": 64
    },
    "lab": {
      "l": 31.34,
      "a": -20.47,
      "b": 5.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-gun-metal-wph-steel",
    "name": "Gun Metal (= WPH Steel)",
    "brand": "Army Painter",
    "hex": "#878990",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 135,
      "g": 137,
      "b": 144
    },
    "lab": {
      "l": 57.13,
      "a": 0.69,
      "b": -3.99
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-hearthborn",
    "name": "Hearthborn",
    "brand": "Army Painter",
    "hex": "#F19C66",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 241,
      "g": 156,
      "b": 102
    },
    "lab": {
      "l": 71.85,
      "a": 26.46,
      "b": 41.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-heavy-metal",
    "name": "Heavy Metal",
    "brand": "Army Painter",
    "hex": "#565151",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 86,
      "g": 81,
      "b": 81
    },
    "lab": {
      "l": 34.92,
      "a": 2.04,
      "b": 0.73
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-hexed-violet",
    "name": "Hexed Violet",
    "brand": "Army Painter",
    "hex": "#AC8DC0",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 172,
      "g": 141,
      "b": 192
    },
    "lab": {
      "l": 63.03,
      "a": 21.27,
      "b": -22.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-hydra-turquoise",
    "name": "Hydra Turquoise",
    "brand": "Army Painter",
    "hex": "#009DAA",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 157,
      "b": 170
    },
    "lab": {
      "l": 58.99,
      "a": -29.29,
      "b": -16.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ice-yellow",
    "name": "Ice Yellow",
    "brand": "Army Painter",
    "hex": "#F0DDA3",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 240,
      "g": 221,
      "b": 163
    },
    "lab": {
      "l": 88.39,
      "a": -1.89,
      "b": 30.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-iceborn",
    "name": "Iceborn",
    "brand": "Army Painter",
    "hex": "#E3BAC8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 227,
      "g": 186,
      "b": 200
    },
    "lab": {
      "l": 79.4,
      "a": 16.92,
      "b": -1.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-imperial-navy-wph-ensign-blue",
    "name": "Imperial Navy (= WPH Ensign Blue)",
    "brand": "Army Painter",
    "hex": "#173C60",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 23,
      "g": 60,
      "b": 96
    },
    "lab": {
      "l": 24.51,
      "a": 0.47,
      "b": -25.17
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-impish-rouge",
    "name": "Impish Rouge",
    "brand": "Army Painter",
    "hex": "#D84596",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 216,
      "g": 69,
      "b": 150
    },
    "lab": {
      "l": 53.02,
      "a": 64.12,
      "b": -12.61
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-inner-light",
    "name": "Inner Light",
    "brand": "Army Painter",
    "hex": "#FBAB38",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 171,
      "b": 56
    },
    "lab": {
      "l": 76.02,
      "a": 20.17,
      "b": 67.01
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-ironclad-grey",
    "name": "Ironclad Grey",
    "brand": "Army Painter",
    "hex": "#302F38",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 47,
      "b": 56
    },
    "lab": {
      "l": 19.83,
      "a": 2.68,
      "b": -5.55
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-ivory-white",
    "name": "Ivory White",
    "brand": "Army Painter",
    "hex": "#F8E2CD",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 248,
      "g": 226,
      "b": 205
    },
    "lab": {
      "l": 91.12,
      "a": 4.22,
      "b": 13
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jasper-skin",
    "name": "Jasper Skin",
    "brand": "Army Painter",
    "hex": "#CB7873",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 203,
      "g": 120,
      "b": 115
    },
    "lab": {
      "l": 59.32,
      "a": 31.83,
      "b": 16.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-kraken-lavender",
    "name": "Kraken Lavender",
    "brand": "Army Painter",
    "hex": "#F1DBFC",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 241,
      "g": 219,
      "b": 252
    },
    "lab": {
      "l": 90.04,
      "a": 13.38,
      "b": -13.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-lava-orange",
    "name": "Lava Orange",
    "brand": "Army Painter",
    "hex": "#EB6832",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 235,
      "g": 104,
      "b": 50
    },
    "lab": {
      "l": 59.71,
      "a": 47.72,
      "b": 53.22
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-leafy-green",
    "name": "Leafy Green",
    "brand": "Army Painter",
    "hex": "#81C047",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 129,
      "g": 192,
      "b": 71
    },
    "lab": {
      "l": 71.43,
      "a": -40.1,
      "b": 53.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-legendary-red",
    "name": "Legendary Red",
    "brand": "Army Painter",
    "hex": "#EF5649",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 239,
      "g": 86,
      "b": 73
    },
    "lab": {
      "l": 57.55,
      "a": 58.07,
      "b": 39.34
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-leopard-stone-skin",
    "name": "Leopard Stone Skin",
    "brand": "Army Painter",
    "hex": "#EAB6B9",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 234,
      "g": 182,
      "b": 185
    },
    "lab": {
      "l": 78.73,
      "a": 19.22,
      "b": 5.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-light-battle-dress",
    "name": "Light Battle Dress",
    "brand": "Army Painter",
    "hex": "#A48D6F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 164,
      "g": 141,
      "b": 111
    },
    "lab": {
      "l": 59.97,
      "a": 4.06,
      "b": 19.22
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-light-feldgrau",
    "name": "Light Feldgrau",
    "brand": "Army Painter",
    "hex": "#737F79",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 115,
      "g": 127,
      "b": 121
    },
    "lab": {
      "l": 52.07,
      "a": -5.68,
      "b": 1.75
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-magecast-magenta",
    "name": "Magecast Magenta",
    "brand": "Army Painter",
    "hex": "#5E2A68",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 94,
      "g": 42,
      "b": 104
    },
    "lab": {
      "l": 26.84,
      "a": 33.96,
      "b": -26.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-marine-mist",
    "name": "Marine Mist",
    "brand": "Army Painter",
    "hex": "#A7D9D5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 167,
      "g": 217,
      "b": 213
    },
    "lab": {
      "l": 83.25,
      "a": -16.91,
      "b": -3.32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-medieval-forest",
    "name": "Medieval Forest",
    "brand": "Army Painter",
    "hex": "#607C6E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 96,
      "g": 124,
      "b": 110
    },
    "lab": {
      "l": 49.53,
      "a": -13.19,
      "b": 4.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-medium-drab",
    "name": "Medium Drab",
    "brand": "Army Painter",
    "hex": "#5D563D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 93,
      "g": 86,
      "b": 61
    },
    "lab": {
      "l": 36.59,
      "a": -1.49,
      "b": 15.62
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-mid-battle-dress",
    "name": "Mid Battle Dress",
    "brand": "Army Painter",
    "hex": "#6B5431",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 107,
      "g": 84,
      "b": 49
    },
    "lab": {
      "l": 37.28,
      "a": 4.72,
      "b": 23.96
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-mid-feldgrau",
    "name": "Mid Feldgrau",
    "brand": "Army Painter",
    "hex": "#515D51",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 81,
      "g": 93,
      "b": 81
    },
    "lab": {
      "l": 38.15,
      "a": -7.27,
      "b": 5.34
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-midnight-olive",
    "name": "Midnight Olive",
    "brand": "Army Painter",
    "hex": "#3D4134",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 61,
      "g": 65,
      "b": 52
    },
    "lab": {
      "l": 26.79,
      "a": -4.45,
      "b": 7.39
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-mithril",
    "name": "Mithril",
    "brand": "Army Painter",
    "hex": "#B4B8BC",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 180,
      "g": 184,
      "b": 188
    },
    "lab": {
      "l": 74.58,
      "a": -0.63,
      "b": -2.51
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-mocca-skin",
    "name": "Mocca Skin",
    "brand": "Army Painter",
    "hex": "#8A6C5F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 138,
      "g": 108,
      "b": 95
    },
    "lab": {
      "l": 48.2,
      "a": 9.91,
      "b": 11.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-moldy-wine",
    "name": "Moldy Wine",
    "brand": "Army Painter",
    "hex": "#753D4A",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 117,
      "g": 61,
      "b": 74
    },
    "lab": {
      "l": 33.17,
      "a": 26,
      "b": 3.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-molten-lava",
    "name": "Molten Lava",
    "brand": "Army Painter",
    "hex": "#EE4528",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 238,
      "g": 69,
      "b": 40
    },
    "lab": {
      "l": 54.65,
      "a": 63.09,
      "b": 53.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-moon-beam-yellow",
    "name": "Moon- beam Yellow",
    "brand": "Army Painter",
    "hex": "#FEA514",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 254,
      "g": 165,
      "b": 20
    },
    "lab": {
      "l": 74.85,
      "a": 23.7,
      "b": 76.26
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-moonpetal",
    "name": "Moonpetal",
    "brand": "Army Painter",
    "hex": "#B7516A",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 183,
      "g": 81,
      "b": 106
    },
    "lab": {
      "l": 48.25,
      "a": 43.72,
      "b": 6.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-moonstone-skin",
    "name": "Moonstone Skin",
    "brand": "Army Painter",
    "hex": "#C56B61",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 197,
      "g": 107,
      "b": 97
    },
    "lab": {
      "l": 55.33,
      "a": 34.64,
      "b": 21.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-mossy-green",
    "name": "Mossy Green",
    "brand": "Army Painter",
    "hex": "#BBCFC3",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 187,
      "g": 207,
      "b": 195
    },
    "lab": {
      "l": 81.36,
      "a": -9.02,
      "b": 3.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-mud-splatter",
    "name": "Mud Splatter",
    "brand": "Army Painter",
    "hex": "#54321C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 84,
      "g": 50,
      "b": 28
    },
    "lab": {
      "l": 24.48,
      "a": 12.94,
      "b": 20.25
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-mulled-berry",
    "name": "Mulled Berry",
    "brand": "Army Painter",
    "hex": "#61313C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 97,
      "g": 49,
      "b": 60
    },
    "lab": {
      "l": 26.92,
      "a": 23.02,
      "b": 2.9
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-necrotic-flesh",
    "name": "Necrotic Flesh",
    "brand": "Army Painter",
    "hex": "#AAA786",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 170,
      "g": 167,
      "b": 134
    },
    "lab": {
      "l": 67.95,
      "a": -4.5,
      "b": 17.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-neptune-glow",
    "name": "Neptune Glow",
    "brand": "Army Painter",
    "hex": "#91D1DA",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 145,
      "g": 209,
      "b": 218
    },
    "lab": {
      "l": 80,
      "a": -18.04,
      "b": -10.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-night-sky",
    "name": "Night Sky",
    "brand": "Army Painter",
    "hex": "#323E4F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 50,
      "g": 62,
      "b": 79
    },
    "lab": {
      "l": 25.83,
      "a": -0.09,
      "b": -11.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-oak-brown",
    "name": "Oak Brown",
    "brand": "Army Painter",
    "hex": "#48332F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 72,
      "g": 51,
      "b": 47
    },
    "lab": {
      "l": 23.51,
      "a": 8.82,
      "b": 6.26
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-obsidian-skin",
    "name": "Obsidian Skin",
    "brand": "Army Painter",
    "hex": "#574C4D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 87,
      "g": 76,
      "b": 77
    },
    "lab": {
      "l": 33.42,
      "a": 4.78,
      "b": 1.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-olive-drab-wph-light-grab",
    "name": "Olive Drab (= WPH Light Grab)",
    "brand": "Army Painter",
    "hex": "#6F7A63",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 111,
      "g": 122,
      "b": 99
    },
    "lab": {
      "l": 49.74,
      "a": -8.62,
      "b": 11.24
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-onyx-skin",
    "name": "Onyx Skin",
    "brand": "Army Painter",
    "hex": "#735855",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 115,
      "g": 88,
      "b": 85
    },
    "lab": {
      "l": 40.05,
      "a": 10.63,
      "b": 6.02
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-opal-skin",
    "name": "Opal Skin",
    "brand": "Army Painter",
    "hex": "#F0C4BE",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 240,
      "g": 196,
      "b": 190
    },
    "lab": {
      "l": 82.77,
      "a": 14.73,
      "b": 8.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pale-sand",
    "name": "Pale Sand",
    "brand": "Army Painter",
    "hex": "#EBDAC9",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 235,
      "g": 218,
      "b": 201
    },
    "lab": {
      "l": 87.98,
      "a": 3.07,
      "b": 10.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-patagon-pine",
    "name": "Patagon Pine",
    "brand": "Army Painter",
    "hex": "#7D9281",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 125,
      "g": 146,
      "b": 129
    },
    "lab": {
      "l": 58.51,
      "a": -10.96,
      "b": 6.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pearl-skin",
    "name": "Pearl Skin",
    "brand": "Army Painter",
    "hex": "#FCDDE0",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 252,
      "g": 221,
      "b": 224
    },
    "lab": {
      "l": 90.68,
      "a": 11.16,
      "b": 2.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-phalanx-blue",
    "name": "Phalanx Blue",
    "brand": "Army Painter",
    "hex": "#328DA7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 50,
      "g": 141,
      "b": 167
    },
    "lab": {
      "l": 54.57,
      "a": -18.05,
      "b": -21.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pharaoh-guard",
    "name": "Pharaoh Guard",
    "brand": "Army Painter",
    "hex": "#238B7C",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 35,
      "g": 139,
      "b": 124
    },
    "lab": {
      "l": 52.15,
      "a": -32.47,
      "b": -0.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pink-potion",
    "name": "Pink Potion",
    "brand": "Army Painter",
    "hex": "#EAA2D1",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 234,
      "g": 162,
      "b": 209
    },
    "lab": {
      "l": 74.79,
      "a": 33.65,
      "b": -13.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pixie-pink",
    "name": "Pixie Pink",
    "brand": "Army Painter",
    "hex": "#E569AF",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 229,
      "g": 105,
      "b": 175
    },
    "lab": {
      "l": 61.53,
      "a": 55.8,
      "b": -14.11
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-plate-mail-metal",
    "name": "Plate Mail Metal",
    "brand": "Army Painter",
    "hex": "#969EA2",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 150,
      "g": 158,
      "b": 162
    },
    "lab": {
      "l": 64.6,
      "a": -2.05,
      "b": -3.07
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-prairie-ochre",
    "name": "Prairie Ochre",
    "brand": "Army Painter",
    "hex": "#7C6A42",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 124,
      "g": 106,
      "b": 66
    },
    "lab": {
      "l": 45.62,
      "a": 1.27,
      "b": 25.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pure-red-wph-flag-red-command-red",
    "name": "Pure Red (= WPH Flag Red / Command Red)",
    "brand": "Army Painter",
    "hex": "#D4041E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 212,
      "g": 4,
      "b": 30
    },
    "lab": {
      "l": 44.49,
      "a": 69.68,
      "b": 47.29
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-quartz-skin",
    "name": "Quartz Skin",
    "brand": "Army Painter",
    "hex": "#DAC5B7",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 218,
      "g": 197,
      "b": 183
    },
    "lab": {
      "l": 80.88,
      "a": 5.1,
      "b": 9.7
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-raging-rose",
    "name": "Raging Rose",
    "brand": "Army Painter",
    "hex": "#E74865",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 231,
      "g": 72,
      "b": 101
    },
    "lab": {
      "l": 54.62,
      "a": 62.71,
      "b": 19.2
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-raging-rouge",
    "name": "Raging Rouge",
    "brand": "Army Painter",
    "hex": "#FB8F80",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 251,
      "g": 143,
      "b": 128
    },
    "lab": {
      "l": 70.68,
      "a": 39.25,
      "b": 25.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-rainforest",
    "name": "Rainforest",
    "brand": "Army Painter",
    "hex": "#A2CC3A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 162,
      "g": 204,
      "b": 58
    },
    "lab": {
      "l": 76.78,
      "a": -34,
      "b": 64.3
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-red-copper",
    "name": "Red Copper",
    "brand": "Army Painter",
    "hex": "#C2727B",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 194,
      "g": 114,
      "b": 123
    },
    "lab": {
      "l": 57.01,
      "a": 32.55,
      "b": 8.76
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-regal-blue",
    "name": "Regal Blue",
    "brand": "Army Painter",
    "hex": "#0D4089",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 13,
      "g": 64,
      "b": 137
    },
    "lab": {
      "l": 28.27,
      "a": 13.8,
      "b": -45.14
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-resplendant-red",
    "name": "Resplendant Red",
    "brand": "Army Painter",
    "hex": "#BC3832",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 188,
      "g": 56,
      "b": 50
    },
    "lab": {
      "l": 43.88,
      "a": 52.27,
      "b": 34.22
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-rifle-brown",
    "name": "Rifle Brown",
    "brand": "Army Painter",
    "hex": "#622319",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 98,
      "g": 35,
      "b": 25
    },
    "lab": {
      "l": 23.24,
      "a": 27.89,
      "b": 21.24
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-rootpath",
    "name": "Rootpath",
    "brand": "Army Painter",
    "hex": "#704E24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 112,
      "g": 78,
      "b": 36
    },
    "lab": {
      "l": 36.03,
      "a": 9.61,
      "b": 29.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-rough-iron",
    "name": "Rough Iron",
    "brand": "Army Painter",
    "hex": "#533432",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 83,
      "g": 52,
      "b": 50
    },
    "lab": {
      "l": 25.34,
      "a": 13.69,
      "b": 7.04
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-royal-blue",
    "name": "Royal Blue",
    "brand": "Army Painter",
    "hex": "#024AA3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 2,
      "g": 74,
      "b": 163
    },
    "lab": {
      "l": 33.04,
      "a": 17.23,
      "b": -53.27
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ruby-skin",
    "name": "Ruby Skin",
    "brand": "Army Painter",
    "hex": "#DF9D96",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 223,
      "g": 157,
      "b": 150
    },
    "lab": {
      "l": 70.88,
      "a": 23.69,
      "b": 13.53
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-ruddy-terra",
    "name": "Ruddy Terra",
    "brand": "Army Painter",
    "hex": "#AF4D36",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 175,
      "g": 77,
      "b": 54
    },
    "lab": {
      "l": 45.21,
      "a": 38.45,
      "b": 32.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ruddy-umber",
    "name": "Ruddy Umber",
    "brand": "Army Painter",
    "hex": "#BA6A58",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 186,
      "g": 106,
      "b": 88
    },
    "lab": {
      "l": 53.44,
      "a": 30.04,
      "b": 24
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-runic-cobalt",
    "name": "Runic Cobalt",
    "brand": "Army Painter",
    "hex": "#8CA0C0",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 140,
      "g": 160,
      "b": 192
    },
    "lab": {
      "l": 65.37,
      "a": 0.31,
      "b": -18.78
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-sacred-scarlet",
    "name": "Sacred Scarlet",
    "brand": "Army Painter",
    "hex": "#FD5C53",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 253,
      "g": 92,
      "b": 83
    },
    "lab": {
      "l": 60.93,
      "a": 60.69,
      "b": 38.39
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-scarab-green-wph-commando-green",
    "name": "Scarab Green (= WPH Commando Green)",
    "brand": "Army Painter",
    "hex": "#214042",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 33,
      "g": 64,
      "b": 66
    },
    "lab": {
      "l": 24.9,
      "a": -10.84,
      "b": -4.81
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-shadow-thorn",
    "name": "Shadow Thorn",
    "brand": "Army Painter",
    "hex": "#00375D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 55,
      "b": 93
    },
    "lab": {
      "l": 22.02,
      "a": -0.11,
      "b": -27.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-shieldwall-blue",
    "name": "Shieldwall Blue",
    "brand": "Army Painter",
    "hex": "#55A5BE",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 85,
      "g": 165,
      "b": 190
    },
    "lab": {
      "l": 63.8,
      "a": -17.36,
      "b": -20.32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-shining-silver",
    "name": "Shining Silver",
    "brand": "Army Painter",
    "hex": "#A5ACAF",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 165,
      "g": 172,
      "b": 175
    },
    "lab": {
      "l": 69.89,
      "a": -1.87,
      "b": -2.39
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-skeleton-bone",
    "name": "Skeleton Bone",
    "brand": "Army Painter",
    "hex": "#C2B498",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 194,
      "g": 180,
      "b": 152
    },
    "lab": {
      "l": 73.79,
      "a": 0.45,
      "b": 16.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-skyshard",
    "name": "Skyshard",
    "brand": "Army Painter",
    "hex": "#CED2D3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 206,
      "g": 210,
      "b": 211
    },
    "lab": {
      "l": 83.92,
      "a": -1.18,
      "b": -0.97
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-space-dust",
    "name": "Space Dust",
    "brand": "Army Painter",
    "hex": "#F9D470",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 249,
      "g": 212,
      "b": 112
    },
    "lab": {
      "l": 86.21,
      "a": 1.18,
      "b": 53.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-spellbound-fuchsia",
    "name": "Spellbound Fuchsia",
    "brand": "Army Painter",
    "hex": "#A53583",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 165,
      "g": 53,
      "b": 131
    },
    "lab": {
      "l": 41.51,
      "a": 53.84,
      "b": -19.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-strap-grey",
    "name": "Strap Grey",
    "brand": "Army Painter",
    "hex": "#222124",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 34,
      "g": 33,
      "b": 36
    },
    "lab": {
      "l": 12.95,
      "a": 1.22,
      "b": -1.85
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-stratos-blue",
    "name": "Stratos Blue",
    "brand": "Army Painter",
    "hex": "#526786",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 82,
      "g": 103,
      "b": 134
    },
    "lab": {
      "l": 43.09,
      "a": 0.48,
      "b": -19.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-sunburst-ochre",
    "name": "Sunburst Ochre",
    "brand": "Army Painter",
    "hex": "#A75626",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 167,
      "g": 86,
      "b": 38
    },
    "lab": {
      "l": 45.65,
      "a": 29.74,
      "b": 41.53
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-sunpetal",
    "name": "Sunpetal",
    "brand": "Army Painter",
    "hex": "#EED70D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 238,
      "g": 215,
      "b": 13
    },
    "lab": {
      "l": 85.41,
      "a": -9.05,
      "b": 84.2
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-tainted-garden",
    "name": "Tainted Garden",
    "brand": "Army Painter",
    "hex": "#564E31",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 86,
      "g": 78,
      "b": 49
    },
    "lab": {
      "l": 33.24,
      "a": -1.51,
      "b": 18.38
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tainted-gold",
    "name": "Tainted Gold",
    "brand": "Army Painter",
    "hex": "#8A835D",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 138,
      "g": 131,
      "b": 93
    },
    "lab": {
      "l": 54.48,
      "a": -3.57,
      "b": 21.54
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-talisman-teal",
    "name": "Talisman Teal",
    "brand": "Army Painter",
    "hex": "#00A28C",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 162,
      "b": 140
    },
    "lab": {
      "l": 59.65,
      "a": -40.79,
      "b": 1.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-tanker-grey",
    "name": "Tanker Grey",
    "brand": "Army Painter",
    "hex": "#748094",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 116,
      "g": 128,
      "b": 148
    },
    "lab": {
      "l": 53.26,
      "a": 0.15,
      "b": -12.23
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-temple-gate-teal",
    "name": "Temple Gate Teal",
    "brand": "Army Painter",
    "hex": "#1B655D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 27,
      "g": 101,
      "b": 93
    },
    "lab": {
      "l": 38.43,
      "a": -24.22,
      "b": -1.98
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-terrestial-titan",
    "name": "Terrestial Titan",
    "brand": "Army Painter",
    "hex": "#352F3A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 53,
      "g": 47,
      "b": 58
    },
    "lab": {
      "l": 20.42,
      "a": 5.27,
      "b": -5.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-the-darkness",
    "name": "The Darkness",
    "brand": "Army Painter",
    "hex": "#272E38",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 39,
      "g": 46,
      "b": 56
    },
    "lab": {
      "l": 18.67,
      "a": -0.22,
      "b": -7.38
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-thicket-grove",
    "name": "Thicket Grove",
    "brand": "Army Painter",
    "hex": "#6F662E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 111,
      "g": 102,
      "b": 46
    },
    "lab": {
      "l": 42.88,
      "a": -4.37,
      "b": 32.44
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-thunderous-blue",
    "name": "Thunderous Blue",
    "brand": "Army Painter",
    "hex": "#43506A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 67,
      "g": 80,
      "b": 106
    },
    "lab": {
      "l": 33.92,
      "a": 1.95,
      "b": -16.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tidal-blue",
    "name": "Tidal Blue",
    "brand": "Army Painter",
    "hex": "#206A83",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 32,
      "g": 106,
      "b": 131
    },
    "lab": {
      "l": 41.61,
      "a": -13.53,
      "b": -20.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tiger-s-eye-skin",
    "name": "Tiger‘s Eye Skin",
    "brand": "Army Painter",
    "hex": "#814749",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 129,
      "g": 71,
      "b": 73
    },
    "lab": {
      "l": 37.22,
      "a": 24.95,
      "b": 9.74
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tomb-king-tan",
    "name": "Tomb King Tan",
    "brand": "Army Painter",
    "hex": "#B0A184",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 176,
      "g": 161,
      "b": 132
    },
    "lab": {
      "l": 66.81,
      "a": 0.79,
      "b": 17.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-topaz-skin",
    "name": "Topaz Skin",
    "brand": "Army Painter",
    "hex": "#BF5C52",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 191,
      "g": 92,
      "b": 82
    },
    "lab": {
      "l": 51.09,
      "a": 38.86,
      "b": 24.53
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tourmaline-skin",
    "name": "Tourmaline Skin",
    "brand": "Army Painter",
    "hex": "#DC938D",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 220,
      "g": 147,
      "b": 141
    },
    "lab": {
      "l": 68.03,
      "a": 26.81,
      "b": 14.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tree-ancient",
    "name": "Tree Ancient",
    "brand": "Army Painter",
    "hex": "#523632",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 82,
      "g": 54,
      "b": 50
    },
    "lab": {
      "l": 25.75,
      "a": 11.95,
      "b": 7.59
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-triumphant-navy",
    "name": "Triumphant Navy",
    "brand": "Army Painter",
    "hex": "#2F395C",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 47,
      "g": 57,
      "b": 92
    },
    "lab": {
      "l": 24.65,
      "a": 6.56,
      "b": -22.25
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-true-brass",
    "name": "True Brass",
    "brand": "Army Painter",
    "hex": "#B1A690",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 177,
      "g": 166,
      "b": 144
    },
    "lab": {
      "l": 68.49,
      "a": 0.27,
      "b": 12.83
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-true-copper",
    "name": "True Copper",
    "brand": "Army Painter",
    "hex": "#A75437",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 167,
      "g": 84,
      "b": 55
    },
    "lab": {
      "l": 45.41,
      "a": 31.71,
      "b": 32.24
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tundra-taupe",
    "name": "Tundra Taupe",
    "brand": "Army Painter",
    "hex": "#645D47",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 100,
      "g": 93,
      "b": 71
    },
    "lab": {
      "l": 39.57,
      "a": -1.09,
      "b": 13.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-turquoise-siren",
    "name": "Turquoise Siren",
    "brand": "Army Painter",
    "hex": "#1BA2B5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 27,
      "g": 162,
      "b": 181
    },
    "lab": {
      "l": 61.14,
      "a": -26.86,
      "b": -19.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ultramarine-blue",
    "name": "Ultramarine Blue",
    "brand": "Army Painter",
    "hex": "#334A8E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 51,
      "g": 74,
      "b": 142
    },
    "lab": {
      "l": 33.04,
      "a": 13.93,
      "b": -40.46
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-jb-umberroot",
    "name": "Umberroot",
    "brand": "Army Painter",
    "hex": "#67352E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 103,
      "g": 53,
      "b": 46
    },
    "lab": {
      "l": 28.45,
      "a": 21.51,
      "b": 14.4
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-uniform-grey",
    "name": "Uniform Grey",
    "brand": "Army Painter",
    "hex": "#687580",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 104,
      "g": 117,
      "b": 128
    },
    "lab": {
      "l": 48.54,
      "a": -2.31,
      "b": -7.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-urban-buff",
    "name": "Urban Buff",
    "brand": "Army Painter",
    "hex": "#CEAB9C",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 206,
      "g": 171,
      "b": 156
    },
    "lab": {
      "l": 72.66,
      "a": 10.46,
      "b": 12.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-violent-coven",
    "name": "Violent Coven",
    "brand": "Army Painter",
    "hex": "#BFA5CF",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 191,
      "g": 165,
      "b": 207
    },
    "lab": {
      "l": 71.21,
      "a": 17.24,
      "b": -17.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-violent-vermillion",
    "name": "Violent Vermillion",
    "brand": "Army Painter",
    "hex": "#FD786A",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 253,
      "g": 120,
      "b": 106
    },
    "lab": {
      "l": 66.03,
      "a": 49.59,
      "b": 32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-vivid-volt",
    "name": "Vivid Volt",
    "brand": "Army Painter",
    "hex": "#DCE153",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 220,
      "g": 225,
      "b": 83
    },
    "lab": {
      "l": 86.85,
      "a": -19.19,
      "b": 66.39
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warlock-magenta",
    "name": "Warlock Magenta",
    "brand": "Army Painter",
    "hex": "#792D78",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 121,
      "g": 45,
      "b": 120
    },
    "lab": {
      "l": 32.48,
      "a": 43.36,
      "b": -27.25
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warped-yellow",
    "name": "Warped Yellow",
    "brand": "Army Painter",
    "hex": "#F4C53F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 244,
      "g": 197,
      "b": 63
    },
    "lab": {
      "l": 81.58,
      "a": 3.92,
      "b": 69.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-blue-tone",
    "name": "Wash Blue Tone",
    "brand": "Army Painter",
    "hex": "#125899",
    "type": "Shade",
    "category": "wash",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 18,
      "g": 88,
      "b": 153
    },
    "lab": {
      "l": 36.76,
      "a": 4.54,
      "b": -41.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-dark-blue-tone",
    "name": "Wash Dark Blue Tone",
    "brand": "Army Painter",
    "hex": "#125899",
    "type": "Shade",
    "category": "wash",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 18,
      "g": 88,
      "b": 153
    },
    "lab": {
      "l": 36.76,
      "a": 4.54,
      "b": -41.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-dark-red-tone",
    "name": "Wash Dark Red Tone",
    "brand": "Army Painter",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-dark-skin-shade",
    "name": "Wash Dark Skin Shade",
    "brand": "Army Painter",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-dark-tone",
    "name": "Wash Dark Tone",
    "brand": "Army Painter",
    "hex": "#14100E",
    "type": "Shade",
    "category": "wash",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 20,
      "g": 16,
      "b": 14
    },
    "lab": {
      "l": 4.98,
      "a": 1.2,
      "b": 1.54
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-green-tone",
    "name": "Wash Green Tone",
    "brand": "Army Painter",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-light-tone",
    "name": "Wash Light Tone",
    "brand": "Army Painter",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-magenta-tone",
    "name": "Wash Magenta Tone",
    "brand": "Army Painter",
    "hex": "#A82A70",
    "type": "Shade",
    "category": "wash",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 168,
      "g": 42,
      "b": 112
    },
    "lab": {
      "l": 39.84,
      "a": 56.23,
      "b": -10.21
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-military-shade",
    "name": "Wash Military Shade",
    "brand": "Army Painter",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-orange-tone",
    "name": "Wash Orange Tone",
    "brand": "Army Painter",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 77
    },
    "lab": {
      "l": 59.53,
      "a": 23.57,
      "b": 38.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-purple-tone",
    "name": "Wash Purple Tone",
    "brand": "Army Painter",
    "hex": "#7A468C",
    "type": "Shade",
    "category": "wash",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 122,
      "g": 70,
      "b": 140
    },
    "lab": {
      "l": 38.57,
      "a": 34.67,
      "b": -30.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-red-tone",
    "name": "Wash Red Tone",
    "brand": "Army Painter",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-rust-tone",
    "name": "Wash Rust Tone",
    "brand": "Army Painter",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 77
    },
    "lab": {
      "l": 59.53,
      "a": 23.57,
      "b": 38.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-sepia-tone",
    "name": "Wash Sepia Tone",
    "brand": "Army Painter",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-soft-tone",
    "name": "Wash Soft Tone",
    "brand": "Army Painter",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-strong-skin-shade",
    "name": "Wash Strong Skin Shade",
    "brand": "Army Painter",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 77
    },
    "lab": {
      "l": 59.53,
      "a": 23.57,
      "b": 38.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-fanatic-wash-strong-tone",
    "name": "Wash Strong Tone",
    "brand": "Army Painter",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wasteland-clay",
    "name": "Wasteland Clay",
    "brand": "Army Painter",
    "hex": "#B58847",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 181,
      "g": 136,
      "b": 71
    },
    "lab": {
      "l": 59.79,
      "a": 9.93,
      "b": 40.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-weapon-bronze",
    "name": "Weapon Bronze",
    "brand": "Army Painter",
    "hex": "#CF7536",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 207,
      "g": 117,
      "b": 54
    },
    "lab": {
      "l": 58.28,
      "a": 30.4,
      "b": 48.6
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-webbing-green",
    "name": "Webbing Green",
    "brand": "Army Painter",
    "hex": "#454C2E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 69,
      "g": 76,
      "b": 46
    },
    "lab": {
      "l": 30.95,
      "a": -8.61,
      "b": 16.92
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-warpaints-webbing-khaki",
    "name": "Webbing Khaki",
    "brand": "Army Painter",
    "hex": "#BC9958",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 188,
      "g": 153,
      "b": 88
    },
    "lab": {
      "l": 65.11,
      "a": 4.97,
      "b": 38.79
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-weird-elixir",
    "name": "Weird Elixir",
    "brand": "Army Painter",
    "hex": "#E68BBF",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 230,
      "g": 139,
      "b": 191
    },
    "lab": {
      "l": 68.79,
      "a": 41.54,
      "b": -12.24
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wicked-pink",
    "name": "Wicked Pink",
    "brand": "Army Painter",
    "hex": "#BA236A",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 186,
      "g": 35,
      "b": 106
    },
    "lab": {
      "l": 42.28,
      "a": 62.39,
      "b": -2.45
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wild-green",
    "name": "Wild Green",
    "brand": "Army Painter",
    "hex": "#5DAD6C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 93,
      "g": 173,
      "b": 108
    },
    "lab": {
      "l": 64.4,
      "a": -38.8,
      "b": 26
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wilted-rose",
    "name": "Wilted Rose",
    "brand": "Army Painter",
    "hex": "#D6ACBA",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 214,
      "g": 172,
      "b": 186
    },
    "lab": {
      "l": 74.41,
      "a": 17.51,
      "b": -1.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wolf-grey",
    "name": "Wolf Grey",
    "brand": "Army Painter",
    "hex": "#6C83A2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 108,
      "g": 131,
      "b": 162
    },
    "lab": {
      "l": 54.06,
      "a": -0.56,
      "b": -19.19
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-woodland-camo",
    "name": "Woodland Camo",
    "brand": "Army Painter",
    "hex": "#525946",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 82,
      "g": 89,
      "b": 70
    },
    "lab": {
      "l": 36.71,
      "a": -6.64,
      "b": 10.1
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-worn-stone",
    "name": "Worn Stone",
    "brand": "Army Painter",
    "hex": "#CFCCBD",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 207,
      "g": 204,
      "b": 189
    },
    "lab": {
      "l": 81.91,
      "a": -1.58,
      "b": 7.84
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wyvern-fury",
    "name": "Wyvern Fury",
    "brand": "Army Painter",
    "hex": "#901A2E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 144,
      "g": 26,
      "b": 46
    },
    "lab": {
      "l": 31.5,
      "a": 48.6,
      "b": 19.81
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-abaddon-black",
    "name": "Abaddon Black",
    "brand": "Citadel",
    "hex": "#151415",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 21,
      "g": 20,
      "b": 21
    },
    "lab": {
      "l": 6.45,
      "a": 0.66,
      "b": -0.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-administra-tum-grey",
    "name": "Administra- tum Grey",
    "brand": "Citadel",
    "hex": "#8A8E91",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 138,
      "g": 142,
      "b": 145
    },
    "lab": {
      "l": 58.78,
      "a": -0.86,
      "b": -2.1
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-agrax-earthshade",
    "name": "Agrax Earthshade",
    "brand": "Citadel",
    "hex": "#5A573F",
    "type": "Shade",
    "category": "shade",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 90,
      "g": 87,
      "b": 63
    },
    "lab": {
      "l": 36.65,
      "a": -3.14,
      "b": 14.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Agrax Earthshade"
    ]
  },
  {
    "paint_id": "citadel-ahriman-blue",
    "name": "Ahriman Blue",
    "brand": "Citadel",
    "hex": "#01667E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 102,
      "b": 126
    },
    "lab": {
      "l": 39.6,
      "a": -15.83,
      "b": -20.43
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-alaitoc-blue",
    "name": "Alaitoc Blue",
    "brand": "Citadel",
    "hex": "#13456F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 19,
      "g": 69,
      "b": 111
    },
    "lab": {
      "l": 28.23,
      "a": -0.03,
      "b": -28.91
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-altdorf-guard-blue",
    "name": "Altdorf Guard Blue",
    "brand": "Citadel",
    "hex": "#253F7E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 37,
      "g": 63,
      "b": 126
    },
    "lab": {
      "l": 27.99,
      "a": 12.79,
      "b": -38.7
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-athonian-camoshade",
    "name": "Athonian Camoshade",
    "brand": "Citadel",
    "hex": "#6D8E44",
    "type": "Shade",
    "category": "shade",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 109,
      "g": 142,
      "b": 68
    },
    "lab": {
      "l": 55.09,
      "a": -24.57,
      "b": 35.4
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Athonian Camoshade"
    ]
  },
  {
    "paint_id": "citadel-auric-armour-gold",
    "name": "Auric Armour Gold",
    "brand": "Citadel",
    "hex": "#C99236",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 201,
      "g": 146,
      "b": 54
    },
    "lab": {
      "l": 64.36,
      "a": 12.13,
      "b": 54.57
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-averland-sunset",
    "name": "Averland Sunset",
    "brand": "Citadel",
    "hex": "#C88637",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 200,
      "g": 134,
      "b": 55
    },
    "lab": {
      "l": 61.31,
      "a": 18.3,
      "b": 50.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-baharroth-blue",
    "name": "Baharroth Blue",
    "brand": "Citadel",
    "hex": "#37B6D0",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 55,
      "g": 182,
      "b": 208
    },
    "lab": {
      "l": 68.62,
      "a": -25.51,
      "b": -23.01
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-balor-brown",
    "name": "Balor Brown",
    "brand": "Citadel",
    "hex": "#976426",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 151,
      "g": 100,
      "b": 38
    },
    "lab": {
      "l": 46.76,
      "a": 14.86,
      "b": 41.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-balthasar-gold",
    "name": "Balthasar Gold",
    "brand": "Citadel",
    "hex": "#774435",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 119,
      "g": 68,
      "b": 53
    },
    "lab": {
      "l": 34.63,
      "a": 20.29,
      "b": 18.51
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-baneblade-brown",
    "name": "Baneblade Brown",
    "brand": "Citadel",
    "hex": "#746254",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 116,
      "g": 98,
      "b": 84
    },
    "lab": {
      "l": 42.9,
      "a": 4.87,
      "b": 10.66
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-barak-nar-burgundy",
    "name": "Barak-nar Burgundy",
    "brand": "Citadel",
    "hex": "#351E28",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 53,
      "g": 30,
      "b": 40
    },
    "lab": {
      "l": 14.62,
      "a": 12.97,
      "b": -2.01
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-berserker-bloodshade",
    "name": "Berserker Bloodshade",
    "brand": "Citadel",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "shade",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-bestigor-flesh",
    "name": "Bestigor Flesh",
    "brand": "Citadel",
    "hex": "#D6793F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 214,
      "g": 121,
      "b": 63
    },
    "lab": {
      "l": 60.19,
      "a": 31.58,
      "b": 46.55
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-biel-tan-green",
    "name": "Biel-Tan Green",
    "brand": "Citadel",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "shade",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Biel-Tan Green"
    ]
  },
  {
    "paint_id": "citadel-bloodreaver-flesh",
    "name": "Bloodreaver Flesh",
    "brand": "Citadel",
    "hex": "#4D2D2A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 45,
      "b": 42
    },
    "lab": {
      "l": 22.38,
      "a": 14.33,
      "b": 8.17
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-blue-horror",
    "name": "Blue Horror",
    "brand": "Citadel",
    "hex": "#92B6D4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 146,
      "g": 182,
      "b": 212
    },
    "lab": {
      "l": 72.44,
      "a": -5.08,
      "b": -19.05
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-brass-scorpion",
    "name": "Brass Scorpion",
    "brand": "Citadel",
    "hex": "#995537",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 153,
      "g": 85,
      "b": 55
    },
    "lab": {
      "l": 43.58,
      "a": 25.34,
      "b": 29.56
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-bugman-s-glow",
    "name": "Bugman‘s Glow",
    "brand": "Citadel",
    "hex": "#885853",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 136,
      "g": 88,
      "b": 83
    },
    "lab": {
      "l": 42.52,
      "a": 19.18,
      "b": 11.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-cadian-fleshtone",
    "name": "Cadian Fleshtone",
    "brand": "Citadel",
    "hex": "#AA6E5C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 170,
      "g": 110,
      "b": 92
    },
    "lab": {
      "l": 52.37,
      "a": 21.72,
      "b": 19.88
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-caledor-sky",
    "name": "Caledor Sky",
    "brand": "Citadel",
    "hex": "#044993",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 4,
      "g": 73,
      "b": 147
    },
    "lab": {
      "l": 31.57,
      "a": 11.28,
      "b": -45.95
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-calgar-blue",
    "name": "Calgar Blue",
    "brand": "Citadel",
    "hex": "#4D6FC2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 77,
      "g": 111,
      "b": 194
    },
    "lab": {
      "l": 48.06,
      "a": 13.55,
      "b": -47.18
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-caliban-green",
    "name": "Caliban Green",
    "brand": "Citadel",
    "hex": "#162C27",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 22,
      "g": 44,
      "b": 39
    },
    "lab": {
      "l": 16.1,
      "a": -10.27,
      "b": 0.51
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-canoptek-alloy",
    "name": "Canoptek Alloy",
    "brand": "Citadel",
    "hex": "#B8A390",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 184,
      "g": 163,
      "b": 144
    },
    "lab": {
      "l": 68.31,
      "a": 4.59,
      "b": 12.68
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-carroburg-crimson",
    "name": "Carroburg Crimson",
    "brand": "Citadel",
    "hex": "#A82A70",
    "type": "Shade",
    "category": "shade",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 168,
      "g": 42,
      "b": 112
    },
    "lab": {
      "l": 39.84,
      "a": 56.23,
      "b": -10.21
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Carroburg Crimson"
    ]
  },
  {
    "paint_id": "citadel-casandora-yellow",
    "name": "Casandora Yellow",
    "brand": "Citadel",
    "hex": "#FECE5A",
    "type": "Shade",
    "category": "shade",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 254,
      "g": 206,
      "b": 90
    },
    "lab": {
      "l": 84.97,
      "a": 4.82,
      "b": 62.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Casandora Yellow"
    ]
  },
  {
    "paint_id": "citadel-castallax-bronze",
    "name": "Castallax Bronze",
    "brand": "Citadel",
    "hex": "#533526",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 83,
      "g": 53,
      "b": 38
    },
    "lab": {
      "l": 25.34,
      "a": 11.52,
      "b": 14.94
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-castellan-green",
    "name": "Castellan Green",
    "brand": "Citadel",
    "hex": "#303223",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 50,
      "b": 35
    },
    "lab": {
      "l": 20.17,
      "a": -4.03,
      "b": 9.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-catachan-flesh",
    "name": "Catachan Flesh",
    "brand": "Citadel",
    "hex": "#392620",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 57,
      "g": 38,
      "b": 32
    },
    "lab": {
      "l": 17.28,
      "a": 8.02,
      "b": 7.55
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-celestra-grey",
    "name": "Celestra Grey",
    "brand": "Citadel",
    "hex": "#94A2A4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 148,
      "g": 162,
      "b": 164
    },
    "lab": {
      "l": 65.61,
      "a": -4.52,
      "b": -2.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ceramite-white",
    "name": "Ceramite White",
    "brand": "Citadel",
    "hex": "#EBEDEF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 235,
      "g": 237,
      "b": 239
    },
    "lab": {
      "l": 93.65,
      "a": -0.31,
      "b": -1.2
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-coelia-greenshade",
    "name": "Coelia Greenshade",
    "brand": "Citadel",
    "hex": "#0E7F78",
    "type": "Shade",
    "category": "shade",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 14,
      "g": 127,
      "b": 120
    },
    "lab": {
      "l": 47.79,
      "a": -30.11,
      "b": -4.44
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Coelia Greenshade"
    ]
  },
  {
    "paint_id": "citadel-corax-white",
    "name": "Corax White",
    "brand": "Citadel",
    "hex": "#B7BCC1",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 183,
      "g": 188,
      "b": 193
    },
    "lab": {
      "l": 76,
      "a": -0.78,
      "b": -3.12
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-corvus-black",
    "name": "Corvus Black",
    "brand": "Citadel",
    "hex": "#181A1F",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 24,
      "g": 26,
      "b": 31
    },
    "lab": {
      "l": 9.25,
      "a": 0.46,
      "b": -3.79
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-daemonette-hide",
    "name": "Daemonette Hide",
    "brand": "Citadel",
    "hex": "#4B435C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 75,
      "g": 67,
      "b": 92
    },
    "lab": {
      "l": 30.12,
      "a": 9.2,
      "b": -13.57
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-dark-reaper",
    "name": "Dark Reaper",
    "brand": "Citadel",
    "hex": "#2A3740",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 42,
      "g": 55,
      "b": 64
    },
    "lab": {
      "l": 22.28,
      "a": -2.79,
      "b": -7.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-dawnstone",
    "name": "Dawnstone",
    "brand": "Citadel",
    "hex": "#596069",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 89,
      "g": 96,
      "b": 105
    },
    "lab": {
      "l": 40.43,
      "a": -0.65,
      "b": -6.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-death-guard-green",
    "name": "Death Guard Green",
    "brand": "Citadel",
    "hex": "#686648",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 104,
      "g": 102,
      "b": 72
    },
    "lab": {
      "l": 42.63,
      "a": -4.5,
      "b": 17.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-death-korps-drab",
    "name": "Death Korps Drab",
    "brand": "Citadel",
    "hex": "#2A2A24",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 42,
      "g": 42,
      "b": 36
    },
    "lab": {
      "l": 16.87,
      "a": -1.36,
      "b": 3.93
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-deathclaw-brown",
    "name": "Deathclaw Brown",
    "brand": "Citadel",
    "hex": "#A25637",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 162,
      "g": 86,
      "b": 55
    },
    "lab": {
      "l": 45.1,
      "a": 28.57,
      "b": 31.69
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-deathworld-forest",
    "name": "Deathworld Forest",
    "brand": "Citadel",
    "hex": "#4E4A2F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 78,
      "g": 74,
      "b": 47
    },
    "lab": {
      "l": 31.17,
      "a": -3.08,
      "b": 16.75
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-dechala-lilac",
    "name": "Dechala Lilac",
    "brand": "Citadel",
    "hex": "#AE9ADB",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 174,
      "g": 154,
      "b": 219
    },
    "lab": {
      "l": 67.44,
      "a": 20.54,
      "b": -30.36
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-deepkin-flesh",
    "name": "Deepkin Flesh",
    "brand": "Citadel",
    "hex": "#B6BBAB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 182,
      "g": 187,
      "b": 171
    },
    "lab": {
      "l": 75.09,
      "a": -4.65,
      "b": 7.5
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-doombull-brown",
    "name": "Doombull Brown",
    "brand": "Citadel",
    "hex": "#461A14",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 70,
      "g": 26,
      "b": 20
    },
    "lab": {
      "l": 15.96,
      "a": 20.63,
      "b": 14.56
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-dorn-yellow",
    "name": "Dorn Yellow",
    "brand": "Citadel",
    "hex": "#F3DA85",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 218,
      "b": 133
    },
    "lab": {
      "l": 87.43,
      "a": -2.47,
      "b": 44.84
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-drakenhof-nightshade",
    "name": "Drakenhof Nightshade",
    "brand": "Citadel",
    "hex": "#125899",
    "type": "Shade",
    "category": "shade",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 18,
      "g": 88,
      "b": 153
    },
    "lab": {
      "l": 36.76,
      "a": 4.54,
      "b": -41.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Drakenhof Nightshade"
    ]
  },
  {
    "paint_id": "citadel-druchii-violet",
    "name": "Druchii Violet",
    "brand": "Citadel",
    "hex": "#7A468C",
    "type": "Shade",
    "category": "shade",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 122,
      "g": 70,
      "b": 140
    },
    "lab": {
      "l": 38.57,
      "a": 34.67,
      "b": -30.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Druchii Violet"
    ]
  },
  {
    "paint_id": "citadel-dryad-bark",
    "name": "Dryad Bark",
    "brand": "Citadel",
    "hex": "#342828",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 52,
      "g": 40,
      "b": 40
    },
    "lab": {
      "l": 17.46,
      "a": 5.59,
      "b": 2.13
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-elysian-green",
    "name": "Elysian Green",
    "brand": "Citadel",
    "hex": "#6C6A32",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 108,
      "g": 106,
      "b": 50
    },
    "lab": {
      "l": 43.84,
      "a": -7.69,
      "b": 31.36
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-emperor-s-children",
    "name": "Emperor‘s Children",
    "brand": "Citadel",
    "hex": "#E4649C",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 228,
      "g": 100,
      "b": 156
    },
    "lab": {
      "l": 59.9,
      "a": 55.35,
      "b": -5.63
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-eshin-grey",
    "name": "Eshin Grey",
    "brand": "Citadel",
    "hex": "#2E3035",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 46,
      "g": 48,
      "b": 53
    },
    "lab": {
      "l": 19.85,
      "a": 0.38,
      "b": -3.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-evil-sunz-scarlet",
    "name": "Evil Sunz Scarlet",
    "brand": "Citadel",
    "hex": "#B7292D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 183,
      "g": 41,
      "b": 45
    },
    "lab": {
      "l": 40.97,
      "a": 55.74,
      "b": 33.6
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-fenrisian-grey",
    "name": "Fenrisian Grey",
    "brand": "Citadel",
    "hex": "#5E7C96",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 94,
      "g": 124,
      "b": 150
    },
    "lab": {
      "l": 50.68,
      "a": -3.92,
      "b": -17.45
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-fire-dragon-bright",
    "name": "Fire Dragon Bright",
    "brand": "Citadel",
    "hex": "#F36B2A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 243,
      "g": 107,
      "b": 42
    },
    "lab": {
      "l": 61.43,
      "a": 49.01,
      "b": 58.75
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-flash-gitz-yellow",
    "name": "Flash Gitz Yellow",
    "brand": "Citadel",
    "hex": "#F6B909",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 246,
      "g": 185,
      "b": 9
    },
    "lab": {
      "l": 78.64,
      "a": 9.73,
      "b": 80.03
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-flayed-one-flesh",
    "name": "Flayed One Flesh",
    "brand": "Citadel",
    "hex": "#D2B99B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 210,
      "g": 185,
      "b": 155
    },
    "lab": {
      "l": 76.54,
      "a": 4.34,
      "b": 18.52
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-fuegan-orange",
    "name": "Fuegan Orange",
    "brand": "Citadel",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "shade",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 77
    },
    "lab": {
      "l": 59.53,
      "a": 23.57,
      "b": 38.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Fuegan Orange"
    ]
  },
  {
    "paint_id": "citadel-fulgrim-pink",
    "name": "Fulgrim Pink",
    "brand": "Citadel",
    "hex": "#F1AEE2",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 241,
      "g": 174,
      "b": 226
    },
    "lab": {
      "l": 78.73,
      "a": 32.5,
      "b": -16.4
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-fulgurite-copper",
    "name": "Fulgurite Copper",
    "brand": "Citadel",
    "hex": "#BE713E",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 190,
      "g": 113,
      "b": 62
    },
    "lab": {
      "l": 55.18,
      "a": 25.92,
      "b": 40.59
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-gal-vorbak-red",
    "name": "Gal Vorbak Red",
    "brand": "Citadel",
    "hex": "#431A1F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 67,
      "g": 26,
      "b": 31
    },
    "lab": {
      "l": 15.65,
      "a": 20.38,
      "b": 6.27
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-gauss-blaster-green",
    "name": "Gauss Blaster Green",
    "brand": "Citadel",
    "hex": "#80D6BD",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 128,
      "g": 214,
      "b": 189
    },
    "lab": {
      "l": 79.81,
      "a": -31.76,
      "b": 4.21
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-gehenna-s-gold",
    "name": "Gehenna‘s Gold",
    "brand": "Citadel",
    "hex": "#A35614",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 163,
      "g": 86,
      "b": 20
    },
    "lab": {
      "l": 44.93,
      "a": 27.43,
      "b": 48.35
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-genestealer-purple",
    "name": "Genestealer Purple",
    "brand": "Citadel",
    "hex": "#734E93",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 115,
      "g": 78,
      "b": 147
    },
    "lab": {
      "l": 39.92,
      "a": 29.54,
      "b": -32.22
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-gorthor-brown",
    "name": "Gorthor Brown",
    "brand": "Citadel",
    "hex": "#5A3E36",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 90,
      "g": 62,
      "b": 54
    },
    "lab": {
      "l": 29.12,
      "a": 11.07,
      "b": 9.81
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-grey-knights-steel",
    "name": "Grey Knights Steel",
    "brand": "Citadel",
    "hex": "#8397A7",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 131,
      "g": 151,
      "b": 167
    },
    "lab": {
      "l": 61.44,
      "a": -3.48,
      "b": -10.74
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-grey-seer",
    "name": "Grey Seer",
    "brand": "Citadel",
    "hex": "#9EA2A3",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 158,
      "g": 162,
      "b": 163
    },
    "lab": {
      "l": 66.33,
      "a": -1.23,
      "b": -1.02
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-hashut-copper",
    "name": "Hashut Copper",
    "brand": "Citadel",
    "hex": "#AD6539",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 173,
      "g": 101,
      "b": 57
    },
    "lab": {
      "l": 50.08,
      "a": 25.04,
      "b": 36.8
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-hobgrot-hide",
    "name": "Hobgrot Hide",
    "brand": "Citadel",
    "hex": "#987848",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 152,
      "g": 120,
      "b": 72
    },
    "lab": {
      "l": 52.48,
      "a": 6.29,
      "b": 30.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-hoeth-blue",
    "name": "Hoeth Blue",
    "brand": "Citadel",
    "hex": "#0B609F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 11,
      "g": 96,
      "b": 159
    },
    "lab": {
      "l": 39.48,
      "a": 1.37,
      "b": -40.5
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-incubi-darkness",
    "name": "Incubi Darkness",
    "brand": "Citadel",
    "hex": "#13262C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 19,
      "g": 38,
      "b": 44
    },
    "lab": {
      "l": 13.86,
      "a": -5.69,
      "b": -6.38
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ionrach-skin",
    "name": "Ionrach Skin",
    "brand": "Citadel",
    "hex": "#A19F84",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 161,
      "g": 159,
      "b": 132
    },
    "lab": {
      "l": 64.99,
      "a": -3.98,
      "b": 14.39
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-iron-hands-steel",
    "name": "Iron Hands Steel",
    "brand": "Citadel",
    "hex": "#8A8886",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 138,
      "g": 136,
      "b": 134
    },
    "lab": {
      "l": 56.81,
      "a": 0.36,
      "b": 1.33
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-iron-warriors",
    "name": "Iron Warriors",
    "brand": "Citadel",
    "hex": "#3B3837",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 59,
      "g": 56,
      "b": 55
    },
    "lab": {
      "l": 23.78,
      "a": 1.08,
      "b": 1.09
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ironbreaker",
    "name": "Ironbreaker",
    "brand": "Citadel",
    "hex": "#97989B",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 151,
      "g": 152,
      "b": 155
    },
    "lab": {
      "l": 62.85,
      "a": 0.22,
      "b": -1.7
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-jokaero-orange",
    "name": "Jokaero Orange",
    "brand": "Citadel",
    "hex": "#BD6240",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 189,
      "g": 98,
      "b": 64
    },
    "lab": {
      "l": 51.75,
      "a": 33.7,
      "b": 35.53
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-kabalite-green",
    "name": "Kabalite Green",
    "brand": "Citadel",
    "hex": "#024A42",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 74,
      "b": 66
    },
    "lab": {
      "l": 27.58,
      "a": -22.2,
      "b": -0.94
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-kakophoni-purple",
    "name": "Kakophoni Purple",
    "brand": "Citadel",
    "hex": "#986DA1",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 152,
      "g": 109,
      "b": 161
    },
    "lab": {
      "l": 52.05,
      "a": 26.41,
      "b": -21.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-kantor-blue",
    "name": "Kantor Blue",
    "brand": "Citadel",
    "hex": "#132035",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 19,
      "g": 32,
      "b": 53
    },
    "lab": {
      "l": 12.15,
      "a": 2.04,
      "b": -15.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-karak-stone",
    "name": "Karak Stone",
    "brand": "Citadel",
    "hex": "#95806A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 149,
      "g": 128,
      "b": 106
    },
    "lab": {
      "l": 54.94,
      "a": 4.52,
      "b": 14.93
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-khorne-red",
    "name": "Khorne Red",
    "brand": "Citadel",
    "hex": "#5E2025",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 94,
      "g": 32,
      "b": 37
    },
    "lab": {
      "l": 22.11,
      "a": 28.73,
      "b": 11.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-kislev-flesh",
    "name": "Kislev Flesh",
    "brand": "Citadel",
    "hex": "#C8936F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 200,
      "g": 147,
      "b": 111
    },
    "lab": {
      "l": 65.2,
      "a": 15.5,
      "b": 26.88
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-knight-questor-flesh",
    "name": "Knight- Questor Flesh",
    "brand": "Citadel",
    "hex": "#6E4840",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 110,
      "g": 72,
      "b": 64
    },
    "lab": {
      "l": 34.64,
      "a": 15.16,
      "b": 11.43
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-krieg-khaki",
    "name": "Krieg Khaki",
    "brand": "Citadel",
    "hex": "#ACA879",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 172,
      "g": 168,
      "b": 121
    },
    "lab": {
      "l": 68.14,
      "a": -6.1,
      "b": 24.87
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-kroak-green",
    "name": "Kroak Green",
    "brand": "Citadel",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "shade",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-leadbelcher",
    "name": "Leadbelcher",
    "brand": "Citadel",
    "hex": "#6D6B69",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 109,
      "g": 107,
      "b": 105
    },
    "lab": {
      "l": 45.34,
      "a": 0.37,
      "b": 1.39
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-liberator-gold",
    "name": "Liberator Gold",
    "brand": "Citadel",
    "hex": "#B4905E",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 180,
      "g": 144,
      "b": 94
    },
    "lab": {
      "l": 62.05,
      "a": 7.08,
      "b": 31.63
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-loren-forest",
    "name": "Loren Forest",
    "brand": "Citadel",
    "hex": "#434D35",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 67,
      "g": 77,
      "b": 53
    },
    "lab": {
      "l": 31.25,
      "a": -8.97,
      "b": 12.96
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-lothern-blue",
    "name": "Lothern Blue",
    "brand": "Citadel",
    "hex": "#3597C6",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 53,
      "g": 151,
      "b": 198
    },
    "lab": {
      "l": 58.94,
      "a": -12.7,
      "b": -32.38
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-lugganath-orange",
    "name": "Lugganath Orange",
    "brand": "Citadel",
    "hex": "#F78F68",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 247,
      "g": 143,
      "b": 104
    },
    "lab": {
      "l": 69.77,
      "a": 35.76,
      "b": 37.65
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-lupercal-green",
    "name": "Lupercal Green",
    "brand": "Citadel",
    "hex": "#122D30",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 18,
      "g": 45,
      "b": 48
    },
    "lab": {
      "l": 16.6,
      "a": -9.2,
      "b": -5.09
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-macragge-blue",
    "name": "Macragge Blue",
    "brand": "Citadel",
    "hex": "#192F66",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 25,
      "g": 47,
      "b": 102
    },
    "lab": {
      "l": 20.82,
      "a": 12.47,
      "b": -34.96
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-mechanicus-standard-grey",
    "name": "Mechanicus Standard Grey",
    "brand": "Citadel",
    "hex": "#424B53",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 66,
      "g": 75,
      "b": 83
    },
    "lab": {
      "l": 31.38,
      "a": -1.63,
      "b": -5.96
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-mephiston-red",
    "name": "Mephiston Red",
    "brand": "Citadel",
    "hex": "#932825",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 147,
      "g": 40,
      "b": 37
    },
    "lab": {
      "l": 33.68,
      "a": 44.31,
      "b": 28.25
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-moot-green",
    "name": "Moot Green",
    "brand": "Citadel",
    "hex": "#5D9C33",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 93,
      "g": 156,
      "b": 51
    },
    "lab": {
      "l": 58.36,
      "a": -38.81,
      "b": 46.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-morghast-bone",
    "name": "Morghast Bone",
    "brand": "Citadel",
    "hex": "#BCA184",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 188,
      "g": 161,
      "b": 132
    },
    "lab": {
      "l": 67.91,
      "a": 5.53,
      "b": 18.79
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-mortarion-grime",
    "name": "Mortarion Grime",
    "brand": "Citadel",
    "hex": "#63493C",
    "type": "Shade",
    "category": "shade",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-mournfang-brown",
    "name": "Mournfang Brown",
    "brand": "Citadel",
    "hex": "#523221",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 82,
      "g": 50,
      "b": 33
    },
    "lab": {
      "l": 24.27,
      "a": 12.43,
      "b": 16.77
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-naggaroth-night",
    "name": "Naggaroth Night",
    "brand": "Citadel",
    "hex": "#201B32",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 32,
      "g": 27,
      "b": 50
    },
    "lab": {
      "l": 11.42,
      "a": 8.95,
      "b": -14.37
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-night-lords-blue",
    "name": "Night Lords Blue",
    "brand": "Citadel",
    "hex": "#0F1826",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 15,
      "g": 24,
      "b": 38
    },
    "lab": {
      "l": 8.08,
      "a": 0.93,
      "b": -10.9
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-nocturne-green",
    "name": "Nocturne Green",
    "brand": "Citadel",
    "hex": "#1B1F1E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 27,
      "g": 31,
      "b": 30
    },
    "lab": {
      "l": 11.32,
      "a": -2.11,
      "b": 0.05
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-nuln-oil",
    "name": "Nuln Oil",
    "brand": "Citadel",
    "hex": "#14100E",
    "type": "Shade",
    "category": "shade",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 20,
      "g": 16,
      "b": 14
    },
    "lab": {
      "l": 4.98,
      "a": 1.2,
      "b": 1.54
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Nuln Oil"
    ]
  },
  {
    "paint_id": "citadel-nurgling-green",
    "name": "Nurgling Green",
    "brand": "Citadel",
    "hex": "#83895B",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 131,
      "g": 137,
      "b": 91
    },
    "lab": {
      "l": 55.56,
      "a": -10.07,
      "b": 23.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ogryn-camo",
    "name": "Ogryn Camo",
    "brand": "Citadel",
    "hex": "#A09258",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 160,
      "g": 146,
      "b": 88
    },
    "lab": {
      "l": 60.55,
      "a": -3.15,
      "b": 32.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-orruk-flesh",
    "name": "Orruk Flesh",
    "brand": "Citadel",
    "hex": "#7D8A4F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 125,
      "g": 138,
      "b": 79
    },
    "lab": {
      "l": 55.18,
      "a": -14.66,
      "b": 29.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-pallid-wych-flesh",
    "name": "Pallid Wych Flesh",
    "brand": "Citadel",
    "hex": "#D4C6BE",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 212,
      "g": 198,
      "b": 190
    },
    "lab": {
      "l": 80.8,
      "a": 3.53,
      "b": 5.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-perisher-pink",
    "name": "Perisher Pink",
    "brand": "Citadel",
    "hex": "#BB4458",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 187,
      "g": 68,
      "b": 88
    },
    "lab": {
      "l": 46.19,
      "a": 49.4,
      "b": 14.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-phalanx-yellow",
    "name": "Phalanx Yellow",
    "brand": "Citadel",
    "hex": "#F8D228",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 248,
      "g": 210,
      "b": 40
    },
    "lab": {
      "l": 85.1,
      "a": -1.81,
      "b": 79.74
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-phoenician-purple",
    "name": "Phoenician Purple",
    "brand": "Citadel",
    "hex": "#312546",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 49,
      "g": 37,
      "b": 70
    },
    "lab": {
      "l": 17.54,
      "a": 14.01,
      "b": -18.69
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-pink-horror",
    "name": "Pink Horror",
    "brand": "Citadel",
    "hex": "#B84755",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 184,
      "g": 71,
      "b": 85
    },
    "lab": {
      "l": 46.12,
      "a": 46.79,
      "b": 15.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-poxwalker",
    "name": "Poxwalker",
    "brand": "Citadel",
    "hex": "#5E5B5C",
    "type": "Shade",
    "category": "shade",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 94,
      "g": 91,
      "b": 92
    },
    "lab": {
      "l": 38.96,
      "a": 1.4,
      "b": -0.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-rakarth-flesh",
    "name": "Rakarth Flesh",
    "brand": "Citadel",
    "hex": "#948278",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 148,
      "g": 130,
      "b": 120
    },
    "lab": {
      "l": 55.7,
      "a": 5.13,
      "b": 7.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ratskin-flesh",
    "name": "Ratskin Flesh",
    "brand": "Citadel",
    "hex": "#B35E3D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 179,
      "g": 94,
      "b": 61
    },
    "lab": {
      "l": 49.41,
      "a": 31.6,
      "b": 34.05
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-reikland-fleshshade",
    "name": "Reikland Fleshshade",
    "brand": "Citadel",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "shade",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Reikland Fleshshade"
    ]
  },
  {
    "paint_id": "citadel-retributor-armour",
    "name": "Retributor Armour",
    "brand": "Citadel",
    "hex": "#BA792F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 186,
      "g": 121,
      "b": 47
    },
    "lab": {
      "l": 56.41,
      "a": 19,
      "b": 49.03
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-rhinox-hide",
    "name": "Rhinox Hide",
    "brand": "Citadel",
    "hex": "#211312",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 33,
      "g": 19,
      "b": 18
    },
    "lab": {
      "l": 7.52,
      "a": 7.04,
      "b": 3.22
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-runefang-steel",
    "name": "Runefang Steel",
    "brand": "Citadel",
    "hex": "#A7ACB1",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 167,
      "g": 172,
      "b": 177
    },
    "lab": {
      "l": 70.1,
      "a": -0.78,
      "b": -3.17
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-runelord-brass",
    "name": "Runelord Brass",
    "brand": "Citadel",
    "hex": "#9C7A65",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 156,
      "g": 122,
      "b": 101
    },
    "lab": {
      "l": 53.95,
      "a": 10.16,
      "b": 16.56
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-russ-grey",
    "name": "Russ Grey",
    "brand": "Citadel",
    "hex": "#4C6580",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 76,
      "g": 101,
      "b": 128
    },
    "lab": {
      "l": 41.85,
      "a": -1.83,
      "b": -17.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-screamer-pink",
    "name": "Screamer Pink",
    "brand": "Citadel",
    "hex": "#5A1B32",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 90,
      "g": 27,
      "b": 50
    },
    "lab": {
      "l": 20.78,
      "a": 31.07,
      "b": 0.69
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-screaming-bell",
    "name": "Screaming Bell",
    "brand": "Citadel",
    "hex": "#88351C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 136,
      "g": 53,
      "b": 28
    },
    "lab": {
      "l": 33.7,
      "a": 34.05,
      "b": 32.89
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-screaming-skull",
    "name": "Screaming Skull",
    "brand": "Citadel",
    "hex": "#D1BF9F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 209,
      "g": 191,
      "b": 159
    },
    "lab": {
      "l": 78.06,
      "a": 1.34,
      "b": 18.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-seraphim-sepia",
    "name": "Seraphim Sepia",
    "brand": "Citadel",
    "hex": "#D7824B",
    "type": "Shade",
    "category": "shade",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 215,
      "g": 130,
      "b": 75
    },
    "lab": {
      "l": 62.44,
      "a": 27.88,
      "b": 43.07
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": [
      "Seraphim Sepia"
    ]
  },
  {
    "paint_id": "citadel-skarsnik-green",
    "name": "Skarsnik Green",
    "brand": "Citadel",
    "hex": "#769459",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 118,
      "g": 148,
      "b": 89
    },
    "lab": {
      "l": 57.8,
      "a": -21.39,
      "b": 27.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-skavenblight-dinge",
    "name": "Skavenblight Dinge",
    "brand": "Citadel",
    "hex": "#363639",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 54,
      "g": 54,
      "b": 57
    },
    "lab": {
      "l": 22.72,
      "a": 0.71,
      "b": -1.88
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-skrag-brown",
    "name": "Skrag Brown",
    "brand": "Citadel",
    "hex": "#894025",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 137,
      "g": 64,
      "b": 37
    },
    "lab": {
      "l": 36.21,
      "a": 29.1,
      "b": 30.62
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-skullcrusher-brass",
    "name": "Skullcrusher Brass",
    "brand": "Citadel",
    "hex": "#CA8638",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 202,
      "g": 134,
      "b": 56
    },
    "lab": {
      "l": 61.56,
      "a": 19.21,
      "b": 50.88
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-slaanesh-grey",
    "name": "Slaanesh Grey",
    "brand": "Citadel",
    "hex": "#887F99",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 136,
      "g": 127,
      "b": 153
    },
    "lab": {
      "l": 54.78,
      "a": 8.71,
      "b": -12.69
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-sons-of-horus-green",
    "name": "Sons of Horus Green",
    "brand": "Citadel",
    "hex": "#305155",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 81,
      "b": 85
    },
    "lab": {
      "l": 32.19,
      "a": -10.85,
      "b": -6.15
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-sotek-green",
    "name": "Sotek Green",
    "brand": "Citadel",
    "hex": "#01556A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 1,
      "g": 85,
      "b": 106
    },
    "lab": {
      "l": 33.01,
      "a": -13.72,
      "b": -18.28
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-soulblight-grey",
    "name": "Soulblight Grey",
    "brand": "Citadel",
    "hex": "#5E5B5C",
    "type": "Shade",
    "category": "shade",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 94,
      "g": 91,
      "b": 92
    },
    "lab": {
      "l": 38.96,
      "a": 1.4,
      "b": -0.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-squig-orange",
    "name": "Squig Orange",
    "brand": "Citadel",
    "hex": "#B6564C",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 182,
      "g": 86,
      "b": 76
    },
    "lab": {
      "l": 48.42,
      "a": 38.04,
      "b": 24.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-steel-legion-drab",
    "name": "Steel Legion Drab",
    "brand": "Citadel",
    "hex": "#675241",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 103,
      "g": 82,
      "b": 65
    },
    "lab": {
      "l": 36.56,
      "a": 6.04,
      "b": 13.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-stegadon-scale-green",
    "name": "Stegadon Scale Green",
    "brand": "Citadel",
    "hex": "#1A2E39",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 26,
      "g": 46,
      "b": 57
    },
    "lab": {
      "l": 17.78,
      "a": -4.38,
      "b": -9.52
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-stormhost-silver",
    "name": "Stormhost Silver",
    "brand": "Citadel",
    "hex": "#B1B4B9",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 177,
      "g": 180,
      "b": 185
    },
    "lab": {
      "l": 73.21,
      "a": -0.09,
      "b": -2.91
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-stormvermin-fur",
    "name": "Stormvermin Fur",
    "brand": "Citadel",
    "hex": "#565551",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 86,
      "g": 85,
      "b": 81
    },
    "lab": {
      "l": 36.12,
      "a": -0.43,
      "b": 2.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-straken-green",
    "name": "Straken Green",
    "brand": "Citadel",
    "hex": "#676D4A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 103,
      "g": 109,
      "b": 74
    },
    "lab": {
      "l": 44.68,
      "a": -8.67,
      "b": 18.84
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-sybarite-green",
    "name": "Sybarite Green",
    "brand": "Citadel",
    "hex": "#269070",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 38,
      "g": 144,
      "b": 112
    },
    "lab": {
      "l": 53.52,
      "a": -37.53,
      "b": 8.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-sycorax-bronze",
    "name": "Sycorax Bronze",
    "brand": "Citadel",
    "hex": "#A57765",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 165,
      "g": 119,
      "b": 101
    },
    "lab": {
      "l": 54.17,
      "a": 15.6,
      "b": 17.02
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-tallarn-sand",
    "name": "Tallarn Sand",
    "brand": "Citadel",
    "hex": "#846B4D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 132,
      "g": 107,
      "b": 77
    },
    "lab": {
      "l": 46.92,
      "a": 5.53,
      "b": 20.56
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-targor-rageshade",
    "name": "Targor Rageshade",
    "brand": "Citadel",
    "hex": "#7A468C",
    "type": "Shade",
    "category": "shade",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 122,
      "g": 70,
      "b": 140
    },
    "lab": {
      "l": 38.57,
      "a": 34.67,
      "b": -30.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-tau-light-ochre",
    "name": "Tau Light Ochre",
    "brand": "Citadel",
    "hex": "#C77E48",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 72
    },
    "lab": {
      "l": 59.47,
      "a": 23.22,
      "b": 40.64
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-teclis-blue",
    "name": "Teclis Blue",
    "brand": "Citadel",
    "hex": "#0472B9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 4,
      "g": 114,
      "b": 185
    },
    "lab": {
      "l": 46.39,
      "a": 0.18,
      "b": -44.76
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-temple-guard-blue",
    "name": "Temple Guard Blue",
    "brand": "Citadel",
    "hex": "#0297B8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 151,
      "b": 184
    },
    "lab": {
      "l": 57.66,
      "a": -21.4,
      "b": -26.52
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-the-fang",
    "name": "The Fang",
    "brand": "Citadel",
    "hex": "#303E58",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 48,
      "g": 62,
      "b": 88
    },
    "lab": {
      "l": 26.09,
      "a": 2.12,
      "b": -17.38
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-thondia-brown",
    "name": "Thondia Brown",
    "brand": "Citadel",
    "hex": "#30231D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 48,
      "g": 35,
      "b": 29
    },
    "lab": {
      "l": 15.06,
      "a": 5.12,
      "b": 6.42
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-thousand-sons-blue",
    "name": "Thousand Sons Blue",
    "brand": "Citadel",
    "hex": "#014C71",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 1,
      "g": 76,
      "b": 113
    },
    "lab": {
      "l": 30.32,
      "a": -5.37,
      "b": -26.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-thunderhawk-blue",
    "name": "Thunderhawk Blue",
    "brand": "Citadel",
    "hex": "#2F4C5A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 76,
      "b": 90
    },
    "lab": {
      "l": 30.67,
      "a": -6.57,
      "b": -11.64
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-troll-slayer-orange",
    "name": "Troll Slayer Orange",
    "brand": "Citadel",
    "hex": "#E6491A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 230,
      "g": 73,
      "b": 26
    },
    "lab": {
      "l": 53.67,
      "a": 58.77,
      "b": 57.73
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-tuskgor-fur",
    "name": "Tuskgor Fur",
    "brand": "Citadel",
    "hex": "#904439",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 144,
      "g": 68,
      "b": 57
    },
    "lab": {
      "l": 38.48,
      "a": 31.15,
      "b": 21.76
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-shade-tyran-blue",
    "name": "Tyran Blue",
    "brand": "Citadel",
    "hex": "#125899",
    "type": "Shade",
    "category": "shade",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 18,
      "g": 88,
      "b": 153
    },
    "lab": {
      "l": 36.76,
      "a": 4.54,
      "b": -41.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ulthuan-grey",
    "name": "Ulthuan Grey",
    "brand": "Citadel",
    "hex": "#C2CACC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 194,
      "g": 202,
      "b": 204
    },
    "lab": {
      "l": 80.78,
      "a": -2.35,
      "b": -1.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ungor-flesh",
    "name": "Ungor Flesh",
    "brand": "Citadel",
    "hex": "#DF9652",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 223,
      "g": 150,
      "b": 82
    },
    "lab": {
      "l": 68.1,
      "a": 20.91,
      "b": 46.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-ushabti-bone",
    "name": "Ushabti Bone",
    "brand": "Citadel",
    "hex": "#C0A982",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 192,
      "g": 169,
      "b": 130
    },
    "lab": {
      "l": 70.31,
      "a": 2.52,
      "b": 23.22
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-vulkan-green",
    "name": "Vulkan Green",
    "brand": "Citadel",
    "hex": "#212E24",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 33,
      "g": 46,
      "b": 36
    },
    "lab": {
      "l": 17.48,
      "a": -8.08,
      "b": 4.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-waaagh-flesh",
    "name": "Waaagh! Flesh",
    "brand": "Citadel",
    "hex": "#2F4638",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 47,
      "g": 70,
      "b": 56
    },
    "lab": {
      "l": 27.49,
      "a": -12.45,
      "b": 5.62
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-warboss-green",
    "name": "Warboss Green",
    "brand": "Citadel",
    "hex": "#476C41",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 71,
      "g": 108,
      "b": 65
    },
    "lab": {
      "l": 41.92,
      "a": -22.46,
      "b": 19.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-warpfiend-grey",
    "name": "Warpfiend Grey",
    "brand": "Citadel",
    "hex": "#645C73",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 100,
      "g": 92,
      "b": 115
    },
    "lab": {
      "l": 40.58,
      "a": 8.2,
      "b": -11.84
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-warplock-bronze",
    "name": "Warplock Bronze",
    "brand": "Citadel",
    "hex": "#261413",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 38,
      "g": 20,
      "b": 19
    },
    "lab": {
      "l": 8.65,
      "a": 9.1,
      "b": 4.33
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-warpstone-glow",
    "name": "Warpstone Glow",
    "brand": "Citadel",
    "hex": "#05602E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 5,
      "g": 96,
      "b": 46
    },
    "lab": {
      "l": 35.19,
      "a": -36.64,
      "b": 21.81
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-wazdakka-red",
    "name": "Wazdakka Red",
    "brand": "Citadel",
    "hex": "#A1353B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 161,
      "g": 53,
      "b": 59
    },
    "lab": {
      "l": 38.62,
      "a": 44.95,
      "b": 21.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-white-scar",
    "name": "White Scar",
    "brand": "Citadel",
    "hex": "#EBEEF0",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 235,
      "g": 238,
      "b": 240
    },
    "lab": {
      "l": 93.93,
      "a": -0.64,
      "b": -1.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-wild-rider-red",
    "name": "Wild Rider Red",
    "brand": "Citadel",
    "hex": "#DE3D37",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 222,
      "g": 61,
      "b": 55
    },
    "lab": {
      "l": 50.86,
      "a": 61.4,
      "b": 40.9
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-word-bearers-red",
    "name": "Word Bearers Red",
    "brand": "Citadel",
    "hex": "#69221F",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 105,
      "g": 34,
      "b": 31
    },
    "lab": {
      "l": 24.47,
      "a": 31.54,
      "b": 19.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-wraithbone",
    "name": "Wraithbone",
    "brand": "Citadel",
    "hex": "#CBBFAF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 203,
      "g": 191,
      "b": 175
    },
    "lab": {
      "l": 77.91,
      "a": 1.52,
      "b": 9.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-xereus-purple",
    "name": "Xereus Purple",
    "brand": "Citadel",
    "hex": "#392445",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 57,
      "g": 36,
      "b": 69
    },
    "lab": {
      "l": 18.19,
      "a": 17.23,
      "b": -16.92
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-xv-88",
    "name": "XV-88",
    "brand": "Citadel",
    "hex": "#77563A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 119,
      "g": 86,
      "b": 58
    },
    "lab": {
      "l": 39.38,
      "a": 10,
      "b": 21.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-yriel-yellow",
    "name": "Yriel Yellow",
    "brand": "Citadel",
    "hex": "#F5A115",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 245,
      "g": 161,
      "b": 21
    },
    "lab": {
      "l": 72.87,
      "a": 22.03,
      "b": 74.16
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-zamesi-desert",
    "name": "Zamesi Desert",
    "brand": "Citadel",
    "hex": "#B38349",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 179,
      "g": 131,
      "b": 73
    },
    "lab": {
      "l": 58.32,
      "a": 11.99,
      "b": 38.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "citadel-zandri-dust",
    "name": "Zandri Dust",
    "brand": "Citadel",
    "hex": "#9B7F62",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 155,
      "g": 127,
      "b": 98
    },
    "lab": {
      "l": 55.1,
      "a": 6.5,
      "b": 19.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-advanced-flesh-tone",
    "name": "Advanced Flesh Tone",
    "brand": "Pro Acryl",
    "hex": "#884F39",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 136,
      "g": 79,
      "b": 57
    },
    "lab": {
      "l": 39.79,
      "a": 21.63,
      "b": 23.18
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-beige-grey",
    "name": "Beige Grey",
    "brand": "Pro Acryl",
    "hex": "#9B806F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 155,
      "g": 128,
      "b": 111
    },
    "lab": {
      "l": 55.64,
      "a": 7.7,
      "b": 13.12
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-beige-red",
    "name": "Beige Red",
    "brand": "Pro Acryl",
    "hex": "#B1817F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 177,
      "g": 129,
      "b": 127
    },
    "lab": {
      "l": 58.58,
      "a": 18.24,
      "b": 8.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bismuth-yellow",
    "name": "Bismuth Yellow",
    "brand": "Pro Acryl",
    "hex": "#FDEF17",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 239,
      "b": 23
    },
    "lab": {
      "l": 92.87,
      "a": -14.48,
      "b": 89.23
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-black-brown",
    "name": "Black Brown",
    "brand": "Pro Acryl",
    "hex": "#3C3432",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 60,
      "g": 52,
      "b": 50
    },
    "lab": {
      "l": 22.47,
      "a": 3.14,
      "b": 2.57
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-black-green",
    "name": "Black Green",
    "brand": "Pro Acryl",
    "hex": "#233329",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 35,
      "g": 51,
      "b": 41
    },
    "lab": {
      "l": 19.58,
      "a": -9.21,
      "b": 4.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-black-red",
    "name": "Black Red",
    "brand": "Pro Acryl",
    "hex": "#5C1717",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 92,
      "g": 23,
      "b": 23
    },
    "lab": {
      "l": 19.85,
      "a": 31.27,
      "b": 18.26
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-blue",
    "name": "Blue",
    "brand": "Pro Acryl",
    "hex": "#005FBE",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 95,
      "b": 190
    },
    "lab": {
      "l": 41.06,
      "a": 14.18,
      "b": -56.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-blue-black",
    "name": "Blue Black",
    "brand": "Pro Acryl",
    "hex": "#2F3943",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 57,
      "b": 67
    },
    "lab": {
      "l": 23.46,
      "a": -1.41,
      "b": -7.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bold-pyrrole-red",
    "name": "Bold Pyrrole Red",
    "brand": "Pro Acryl",
    "hex": "#E10F21",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 225,
      "g": 15,
      "b": 33
    },
    "lab": {
      "l": 47.58,
      "a": 71.97,
      "b": 49.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bold-titanium-white",
    "name": "Bold Titanium White",
    "brand": "Pro Acryl",
    "hex": "#EAEBEC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 234,
      "g": 235,
      "b": 236
    },
    "lab": {
      "l": 93,
      "a": -0.16,
      "b": -0.6
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bone",
    "name": "Bone",
    "brand": "Pro Acryl",
    "hex": "#A79494",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 167,
      "g": 148,
      "b": 148
    },
    "lab": {
      "l": 62.96,
      "a": 7.04,
      "b": 2.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bone-satin",
    "name": "Bone (satin)",
    "brand": "Pro Acryl",
    "hex": "#A79494",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 167,
      "g": 148,
      "b": 148
    },
    "lab": {
      "l": 62.96,
      "a": 7.04,
      "b": 2.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-bright-brown-grey",
    "name": "Bright Brown Grey",
    "brand": "Pro Acryl",
    "hex": "#8C8078",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 140,
      "g": 128,
      "b": 120
    },
    "lab": {
      "l": 54.42,
      "a": 3.12,
      "b": 5.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-gold",
    "name": "Bright Gold",
    "brand": "Pro Acryl",
    "hex": "#DDAD6F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 221,
      "g": 173,
      "b": 111
    },
    "lab": {
      "l": 73.81,
      "a": 10.04,
      "b": 38.41
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-green",
    "name": "Bright Green",
    "brand": "Pro Acryl",
    "hex": "#00A552",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 165,
      "b": 82
    },
    "lab": {
      "l": 59.45,
      "a": -55.16,
      "b": 32.88
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-bright-green-blue",
    "name": "Bright Green Blue",
    "brand": "Pro Acryl",
    "hex": "#97ACB4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 151,
      "g": 172,
      "b": 180
    },
    "lab": {
      "l": 69.02,
      "a": -5.56,
      "b": -6.55
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-ivory",
    "name": "Bright Ivory",
    "brand": "Pro Acryl",
    "hex": "#E9DDC8",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 233,
      "g": 221,
      "b": 200
    },
    "lab": {
      "l": 88.55,
      "a": 0.65,
      "b": 11.78
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-jade",
    "name": "Bright Jade",
    "brand": "Pro Acryl",
    "hex": "#009E94",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 158,
      "b": 148
    },
    "lab": {
      "l": 58.59,
      "a": -36.69,
      "b": -4.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-neutral-grey",
    "name": "Bright Neutral Grey",
    "brand": "Pro Acryl",
    "hex": "#ACAAAD",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 172,
      "g": 170,
      "b": 173
    },
    "lab": {
      "l": 69.85,
      "a": 1.28,
      "b": -1.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-pale-green",
    "name": "Bright Pale Green",
    "brand": "Pro Acryl",
    "hex": "#72EAB8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 114,
      "g": 234,
      "b": 184
    },
    "lab": {
      "l": 84.94,
      "a": -45.34,
      "b": 14.09
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-pale-yellow",
    "name": "Bright Pale Yellow",
    "brand": "Pro Acryl",
    "hex": "#F7EBBF",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 247,
      "g": 235,
      "b": 191
    },
    "lab": {
      "l": 92.99,
      "a": -2.75,
      "b": 22.86
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-shadow-flesh",
    "name": "Bright Shadow Flesh",
    "brand": "Pro Acryl",
    "hex": "#DD7D63",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 221,
      "g": 125,
      "b": 99
    },
    "lab": {
      "l": 62.46,
      "a": 34.64,
      "b": 30.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-warm-grey",
    "name": "Bright Warm Grey",
    "brand": "Pro Acryl",
    "hex": "#ADB2A4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 173,
      "g": 178,
      "b": 164
    },
    "lab": {
      "l": 71.83,
      "a": -4.34,
      "b": 6.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-yellow-green",
    "name": "Bright Yellow Green",
    "brand": "Pro Acryl",
    "hex": "#8EB324",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 142,
      "g": 179,
      "b": 36
    },
    "lab": {
      "l": 68.11,
      "a": -31.46,
      "b": 62.77
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bright-yellow-ochre",
    "name": "Bright Yellow Ochre",
    "brand": "Pro Acryl",
    "hex": "#E9BA5F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 233,
      "g": 186,
      "b": 95
    },
    "lab": {
      "l": 78.03,
      "a": 6.82,
      "b": 51.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-bronze",
    "name": "Bronze",
    "brand": "Pro Acryl",
    "hex": "#5B4029",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 91,
      "g": 64,
      "b": 41
    },
    "lab": {
      "l": 29.54,
      "a": 8.67,
      "b": 18.65
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-brown-grey",
    "name": "Brown Grey",
    "brand": "Pro Acryl",
    "hex": "#433E38",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 67,
      "g": 62,
      "b": 56
    },
    "lab": {
      "l": 26.52,
      "a": 0.92,
      "b": 4.46
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-burgundy",
    "name": "Burgundy",
    "brand": "Pro Acryl",
    "hex": "#722B38",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 114,
      "g": 43,
      "b": 56
    },
    "lab": {
      "l": 28.36,
      "a": 32.55,
      "b": 8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-burnt-orange",
    "name": "Burnt Orange",
    "brand": "Pro Acryl",
    "hex": "#903C2E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 144,
      "g": 60,
      "b": 46
    },
    "lab": {
      "l": 36.67,
      "a": 34.58,
      "b": 26.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-burnt-red",
    "name": "Burnt Red",
    "brand": "Pro Acryl",
    "hex": "#771E15",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 119,
      "g": 30,
      "b": 21
    },
    "lab": {
      "l": 26.46,
      "a": 37.97,
      "b": 28.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-burnt-sienna",
    "name": "Burnt Sienna",
    "brand": "Pro Acryl",
    "hex": "#65281C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 40,
      "b": 28
    },
    "lab": {
      "l": 24.86,
      "a": 26.63,
      "b": 21.37
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-burnt-umber",
    "name": "Burnt Umber",
    "brand": "Pro Acryl",
    "hex": "#713A2A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 58,
      "b": 42
    },
    "lab": {
      "l": 31.13,
      "a": 22.57,
      "b": 20.68
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-camo-green",
    "name": "Camo Green",
    "brand": "Pro Acryl",
    "hex": "#4E5D3A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 78,
      "g": 93,
      "b": 58
    },
    "lab": {
      "l": 37.4,
      "a": -12.69,
      "b": 18.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-caramel-brown",
    "name": "Caramel Brown",
    "brand": "Pro Acryl",
    "hex": "#997451",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 153,
      "g": 116,
      "b": 81
    },
    "lab": {
      "l": 51.68,
      "a": 9.93,
      "b": 24.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-coal-black",
    "name": "Coal Black",
    "brand": "Pro Acryl",
    "hex": "#19191B",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 25,
      "g": 25,
      "b": 27
    },
    "lab": {
      "l": 8.83,
      "a": 0.53,
      "b": -1.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-cool-grey",
    "name": "Cool Grey",
    "brand": "Pro Acryl",
    "hex": "#81858E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 129,
      "g": 133,
      "b": 142
    },
    "lab": {
      "l": 55.48,
      "a": 0.4,
      "b": -5.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-copper",
    "name": "Copper",
    "brand": "Pro Acryl",
    "hex": "#9D5430",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 157,
      "g": 84,
      "b": 48
    },
    "lab": {
      "l": 43.83,
      "a": 27.13,
      "b": 33.93
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-blue",
    "name": "Dark Blue",
    "brand": "Pro Acryl",
    "hex": "#212739",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 33,
      "g": 39,
      "b": 57
    },
    "lab": {
      "l": 15.85,
      "a": 2.82,
      "b": -12.45
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-bronze",
    "name": "Dark Bronze",
    "brand": "Pro Acryl",
    "hex": "#583729",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 88,
      "g": 55,
      "b": 41
    },
    "lab": {
      "l": 26.64,
      "a": 12.95,
      "b": 14.83
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-burgundy",
    "name": "Dark Burgundy",
    "brand": "Pro Acryl",
    "hex": "#412327",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 65,
      "g": 35,
      "b": 39
    },
    "lab": {
      "l": 17.79,
      "a": 14.9,
      "b": 3.54
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-camo-green",
    "name": "Dark Camo Green",
    "brand": "Pro Acryl",
    "hex": "#424733",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 66,
      "g": 71,
      "b": 51
    },
    "lab": {
      "l": 29.17,
      "a": -6.13,
      "b": 11.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-crimson",
    "name": "Dark Crimson",
    "brand": "Pro Acryl",
    "hex": "#491B0E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 73,
      "g": 27,
      "b": 14
    },
    "lab": {
      "l": 16.66,
      "a": 20.99,
      "b": 19.05
    },
    "finish": "glossy",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-emerald",
    "name": "Dark Emerald",
    "brand": "Pro Acryl",
    "hex": "#014442",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 68,
      "b": 66
    },
    "lab": {
      "l": 25.36,
      "a": -19.18,
      "b": -4.23
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-flesh",
    "name": "Dark Flesh",
    "brand": "Pro Acryl",
    "hex": "#5E2F2A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 94,
      "g": 47,
      "b": 42
    },
    "lab": {
      "l": 25.5,
      "a": 20.75,
      "b": 12.84
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-golden-brown",
    "name": "Dark Golden Brown",
    "brand": "Pro Acryl",
    "hex": "#563C24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 86,
      "g": 60,
      "b": 36
    },
    "lab": {
      "l": 27.68,
      "a": 8.27,
      "b": 19.27
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-green-brown",
    "name": "Dark Green Brown",
    "brand": "Pro Acryl",
    "hex": "#56432E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 86,
      "g": 67,
      "b": 46
    },
    "lab": {
      "l": 29.89,
      "a": 4.97,
      "b": 15.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-grey-blue",
    "name": "Dark Grey Blue",
    "brand": "Pro Acryl",
    "hex": "#213B58",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 33,
      "g": 59,
      "b": 88
    },
    "lab": {
      "l": 24.18,
      "a": 0.03,
      "b": -20.43
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-hot-pink",
    "name": "Dark Hot Pink",
    "brand": "Pro Acryl",
    "hex": "#CC1B58",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 204,
      "g": 27,
      "b": 88
    },
    "lab": {
      "l": 44.7,
      "a": 67.27,
      "b": 12.74
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-ivory",
    "name": "Dark Ivory",
    "brand": "Pro Acryl",
    "hex": "#C2BAAD",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 194,
      "g": 186,
      "b": 173
    },
    "lab": {
      "l": 75.83,
      "a": 0.56,
      "b": 7.59
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-jade",
    "name": "Dark Jade",
    "brand": "Pro Acryl",
    "hex": "#12333C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 18,
      "g": 51,
      "b": 60
    },
    "lab": {
      "l": 19.32,
      "a": -8.7,
      "b": -9.27
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-magenta",
    "name": "Dark Magenta",
    "brand": "Pro Acryl",
    "hex": "#701336",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 112,
      "g": 19,
      "b": 54
    },
    "lab": {
      "l": 24.25,
      "a": 41.74,
      "b": 3.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-dark-navy-blue",
    "name": "Dark Navy Blue",
    "brand": "Pro Acryl",
    "hex": "#222B48",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 34,
      "g": 43,
      "b": 72
    },
    "lab": {
      "l": 18.08,
      "a": 5.54,
      "b": -19.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-neutral-grey",
    "name": "Dark Neutral Grey",
    "brand": "Pro Acryl",
    "hex": "#333439",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 52,
      "b": 57
    },
    "lab": {
      "l": 21.78,
      "a": 0.78,
      "b": -3.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-orange-brown",
    "name": "Dark Orange Brown",
    "brand": "Pro Acryl",
    "hex": "#905F31",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 144,
      "g": 95,
      "b": 49
    },
    "lab": {
      "l": 44.71,
      "a": 15.24,
      "b": 33.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-plum",
    "name": "Dark Plum",
    "brand": "Pro Acryl",
    "hex": "#3C1C28",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 60,
      "g": 28,
      "b": 40
    },
    "lab": {
      "l": 15.19,
      "a": 17.38,
      "b": -1.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-purple",
    "name": "Dark Purple",
    "brand": "Pro Acryl",
    "hex": "#312346",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 49,
      "g": 35,
      "b": 70
    },
    "lab": {
      "l": 16.98,
      "a": 15.4,
      "b": -19.59
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-sea-ben",
    "name": "Dark Sea Ben",
    "brand": "Pro Acryl",
    "hex": "#1C2E32",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 28,
      "g": 46,
      "b": 50
    },
    "lab": {
      "l": 17.6,
      "a": -6.09,
      "b": -4.91
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-silver",
    "name": "Dark Silver",
    "brand": "Pro Acryl",
    "hex": "#3D3F44",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 61,
      "g": 63,
      "b": 68
    },
    "lab": {
      "l": 26.63,
      "a": 0.34,
      "b": -3.34
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-turquoise",
    "name": "Dark Turquoise",
    "brand": "Pro Acryl",
    "hex": "#007D9E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 125,
      "b": 158
    },
    "lab": {
      "l": 48.43,
      "a": -16.82,
      "b": -25.84
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-umber",
    "name": "Dark Umber",
    "brand": "Pro Acryl",
    "hex": "#4A3731",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 74,
      "g": 55,
      "b": 49
    },
    "lab": {
      "l": 24.98,
      "a": 7.45,
      "b": 7.03
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-warm-flesh",
    "name": "Dark Warm Flesh",
    "brand": "Pro Acryl",
    "hex": "#E19462",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 225,
      "g": 148,
      "b": 98
    },
    "lab": {
      "l": 68.07,
      "a": 23.96,
      "b": 38.13
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-warm-grey",
    "name": "Dark Warm Grey",
    "brand": "Pro Acryl",
    "hex": "#3C3C3E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 60,
      "g": 60,
      "b": 62
    },
    "lab": {
      "l": 25.38,
      "a": 0.46,
      "b": -1.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-dark-yellow-green",
    "name": "Dark Yellow Green",
    "brand": "Pro Acryl",
    "hex": "#606634",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 96,
      "g": 102,
      "b": 52
    },
    "lab": {
      "l": 41.59,
      "a": -10.67,
      "b": 27.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-drab-brown",
    "name": "Drab Brown",
    "brand": "Pro Acryl",
    "hex": "#5A4F3A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 90,
      "g": 79,
      "b": 58
    },
    "lab": {
      "l": 34.13,
      "a": 0.98,
      "b": 14.1
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-faded-green",
    "name": "Faded Green",
    "brand": "Pro Acryl",
    "hex": "#96A88E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 150,
      "g": 168,
      "b": 142
    },
    "lab": {
      "l": 66.86,
      "a": -11.26,
      "b": 11.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-faded-plum",
    "name": "Faded Plum",
    "brand": "Pro Acryl",
    "hex": "#8F689C",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 143,
      "g": 104,
      "b": 156
    },
    "lab": {
      "l": 49.67,
      "a": 25.24,
      "b": -22.17
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-faded-ultramarine",
    "name": "Faded Ultramarine",
    "brand": "Pro Acryl",
    "hex": "#8595EE",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 133,
      "g": 149,
      "b": 238
    },
    "lab": {
      "l": 63.88,
      "a": 16.95,
      "b": -46.64
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-golden-brown",
    "name": "Golden Brown",
    "brand": "Pro Acryl",
    "hex": "#EBA55D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 235,
      "g": 165,
      "b": 93
    },
    "lab": {
      "l": 73.13,
      "a": 18.61,
      "b": 47.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-golden-yellow",
    "name": "Golden Yellow",
    "brand": "Pro Acryl",
    "hex": "#FAC227",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 250,
      "g": 194,
      "b": 39
    },
    "lab": {
      "l": 81.32,
      "a": 7.23,
      "b": 76.95
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-green",
    "name": "Green",
    "brand": "Pro Acryl",
    "hex": "#007B3E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 123,
      "b": 62
    },
    "lab": {
      "l": 44.96,
      "a": -44.08,
      "b": 25.22
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-green-brown",
    "name": "Green Brown",
    "brand": "Pro Acryl",
    "hex": "#7E6545",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 126,
      "g": 101,
      "b": 69
    },
    "lab": {
      "l": 44.48,
      "a": 5.44,
      "b": 21.89
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-green-oxide",
    "name": "Green Oxide",
    "brand": "Pro Acryl",
    "hex": "#016050",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 96,
      "b": 80
    },
    "lab": {
      "l": 35.89,
      "a": -28.61,
      "b": 2.28
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-grey-blue",
    "name": "Grey Blue",
    "brand": "Pro Acryl",
    "hex": "#609DC5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 96,
      "g": 157,
      "b": 197
    },
    "lab": {
      "l": 62.19,
      "a": -8.54,
      "b": -26.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-grey-green",
    "name": "Grey Green",
    "brand": "Pro Acryl",
    "hex": "#797267",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 121,
      "g": 114,
      "b": 103
    },
    "lab": {
      "l": 48.36,
      "a": 0.67,
      "b": 7.07
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-heavy-titani-um-white",
    "name": "Heavy Titani- um White",
    "brand": "Pro Acryl",
    "hex": "#F1F6F7",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 241,
      "g": 246,
      "b": 247
    },
    "lab": {
      "l": 96.54,
      "a": -1.47,
      "b": -1.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-heavy-warm-white",
    "name": "Heavy Warm White",
    "brand": "Pro Acryl",
    "hex": "#F2D5B0",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 242,
      "g": 213,
      "b": 176
    },
    "lab": {
      "l": 86.8,
      "a": 4.63,
      "b": 22.02
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-ivory",
    "name": "Ivory",
    "brand": "Pro Acryl",
    "hex": "#DEC9B6",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 222,
      "g": 201,
      "b": 182
    },
    "lab": {
      "l": 82.21,
      "a": 4.31,
      "b": 12.17
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-jade",
    "name": "Jade",
    "brand": "Pro Acryl",
    "hex": "#015F5E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 95,
      "b": 94
    },
    "lab": {
      "l": 35.98,
      "a": -23.61,
      "b": -6.27
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-khaki",
    "name": "Khaki",
    "brand": "Pro Acryl",
    "hex": "#B4A377",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 180,
      "g": 163,
      "b": 119
    },
    "lab": {
      "l": 67.45,
      "a": -0.46,
      "b": 25.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-light-bronze",
    "name": "Light Bronze",
    "brand": "Pro Acryl",
    "hex": "#C4A87F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 196,
      "g": 168,
      "b": 127
    },
    "lab": {
      "l": 70.37,
      "a": 4.28,
      "b": 24.99
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-light-umber",
    "name": "Light Umber",
    "brand": "Pro Acryl",
    "hex": "#684A39",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 104,
      "g": 74,
      "b": 57
    },
    "lab": {
      "l": 34.27,
      "a": 10.36,
      "b": 15.18
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-magenta",
    "name": "Magenta",
    "brand": "Pro Acryl",
    "hex": "#C14A7A",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 193,
      "g": 74,
      "b": 122
    },
    "lab": {
      "l": 49.06,
      "a": 52.08,
      "b": -2.16
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-magnesium",
    "name": "Magnesium",
    "brand": "Pro Acryl",
    "hex": "#3D3A2E",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 61,
      "g": 58,
      "b": 46
    },
    "lab": {
      "l": 24.37,
      "a": -1.11,
      "b": 7.94
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-mahogany",
    "name": "Mahogany",
    "brand": "Pro Acryl",
    "hex": "#4C3330",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 76,
      "g": 51,
      "b": 48
    },
    "lab": {
      "l": 24.06,
      "a": 10.84,
      "b": 6.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-neutral-grey",
    "name": "Neutral Grey",
    "brand": "Pro Acryl",
    "hex": "#51555F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 81,
      "g": 85,
      "b": 95
    },
    "lab": {
      "l": 36.12,
      "a": 0.73,
      "b": -6.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-nova-orange",
    "name": "Nova Orange",
    "brand": "Pro Acryl",
    "hex": "#FC743E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 252,
      "g": 116,
      "b": 62
    },
    "lab": {
      "l": 64.6,
      "a": 48.73,
      "b": 53.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-olive-flesh",
    "name": "Olive Flesh",
    "brand": "Pro Acryl",
    "hex": "#D4BAA4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 212,
      "g": 186,
      "b": 164
    },
    "lab": {
      "l": 77.16,
      "a": 5.84,
      "b": 14.57
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-orange",
    "name": "Orange",
    "brand": "Pro Acryl",
    "hex": "#FE6B2A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 254,
      "g": 107,
      "b": 42
    },
    "lab": {
      "l": 63.14,
      "a": 52.99,
      "b": 60.91
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-orange-brown",
    "name": "Orange Brown",
    "brand": "Pro Acryl",
    "hex": "#B97534",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 185,
      "g": 117,
      "b": 52
    },
    "lab": {
      "l": 55.37,
      "a": 21.03,
      "b": 45.6
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-orange-oxide",
    "name": "Orange Oxide",
    "brand": "Pro Acryl",
    "hex": "#9D5134",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 157,
      "g": 81,
      "b": 52
    },
    "lab": {
      "l": 43.22,
      "a": 29.04,
      "b": 30.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-orange-red",
    "name": "Orange Red",
    "brand": "Pro Acryl",
    "hex": "#DE2004",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 222,
      "g": 32,
      "b": 4
    },
    "lab": {
      "l": 47.72,
      "a": 68.27,
      "b": 59.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-orange-yellow",
    "name": "Orange Yellow",
    "brand": "Pro Acryl",
    "hex": "#FF9520",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 255,
      "g": 149,
      "b": 32
    },
    "lab": {
      "l": 71.46,
      "a": 32.6,
      "b": 71.11
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-pale-pink",
    "name": "Pale Pink",
    "brand": "Pro Acryl",
    "hex": "#FBC5C8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 251,
      "g": 197,
      "b": 200
    },
    "lab": {
      "l": 84.28,
      "a": 19.65,
      "b": 5.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-pale-yellow",
    "name": "Pale Yellow",
    "brand": "Pro Acryl",
    "hex": "#E5D49B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 229,
      "g": 212,
      "b": 155
    },
    "lab": {
      "l": 85.05,
      "a": -2.47,
      "b": 30.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-payne-s-grey",
    "name": "Payne’s Grey",
    "brand": "Pro Acryl",
    "hex": "#262832",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 38,
      "g": 40,
      "b": 50
    },
    "lab": {
      "l": 16.3,
      "a": 1.8,
      "b": -6.79
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-peach-flesh",
    "name": "Peach Flesh",
    "brand": "Pro Acryl",
    "hex": "#E5A582",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 229,
      "g": 165,
      "b": 130
    },
    "lab": {
      "l": 73.01,
      "a": 19.41,
      "b": 27.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-petroleum-brown",
    "name": "Petroleum Brown",
    "brand": "Pro Acryl",
    "hex": "#3A260E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 58,
      "g": 38,
      "b": 14
    },
    "lab": {
      "l": 17.07,
      "a": 6.49,
      "b": 18.99
    },
    "finish": "glossy",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-pink",
    "name": "Pink",
    "brand": "Pro Acryl",
    "hex": "#F599B5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 245,
      "g": 153,
      "b": 181
    },
    "lab": {
      "l": 73.24,
      "a": 37.94,
      "b": 0.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-plum",
    "name": "Plum",
    "brand": "Pro Acryl",
    "hex": "#994596",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 153,
      "g": 69,
      "b": 150
    },
    "lab": {
      "l": 43.11,
      "a": 46.38,
      "b": -28.67
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-purple",
    "name": "Purple",
    "brand": "Pro Acryl",
    "hex": "#813E82",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 129,
      "g": 62,
      "b": 130
    },
    "lab": {
      "l": 37.34,
      "a": 39.09,
      "b": -25.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-red-grey",
    "name": "Red Grey",
    "brand": "Pro Acryl",
    "hex": "#66595E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 102,
      "g": 89,
      "b": 94
    },
    "lab": {
      "l": 39.2,
      "a": 6.25,
      "b": -0.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-red-orange",
    "name": "Red Orange",
    "brand": "Pro Acryl",
    "hex": "#EF4705",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 239,
      "g": 71,
      "b": 5
    },
    "lab": {
      "l": 54.94,
      "a": 62.17,
      "b": 64.99
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-red-oxide",
    "name": "Red Oxide",
    "brand": "Pro Acryl",
    "hex": "#921C17",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 146,
      "g": 28,
      "b": 23
    },
    "lab": {
      "l": 31.82,
      "a": 47.65,
      "b": 34.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-rich-gold",
    "name": "Rich Gold",
    "brand": "Pro Acryl",
    "hex": "#C37624",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 195,
      "g": 118,
      "b": 36
    },
    "lab": {
      "l": 56.77,
      "a": 24.11,
      "b": 54.37
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-royal-purple",
    "name": "Royal Purple",
    "brand": "Pro Acryl",
    "hex": "#491F60",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 73,
      "g": 31,
      "b": 96
    },
    "lab": {
      "l": 20.98,
      "a": 32.19,
      "b": -30.52
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-satin-black",
    "name": "Satin Black",
    "brand": "Pro Acryl",
    "hex": "#141416",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 20,
      "g": 20,
      "b": 22
    },
    "lab": {
      "l": 6.39,
      "a": 0.47,
      "b": -1.28
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-shadow-flesh",
    "name": "Shadow Flesh",
    "brand": "Pro Acryl",
    "hex": "#934D47",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 147,
      "g": 77,
      "b": 71
    },
    "lab": {
      "l": 41.16,
      "a": 28.67,
      "b": 16.81
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-silver",
    "name": "Silver",
    "brand": "Pro Acryl",
    "hex": "#C4CDD4",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 196,
      "g": 205,
      "b": 212
    },
    "lab": {
      "l": 81.92,
      "a": -1.72,
      "b": -4.53
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-sky-blue",
    "name": "Sky Blue",
    "brand": "Pro Acryl",
    "hex": "#0093EA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 147,
      "b": 234
    },
    "lab": {
      "l": 58.79,
      "a": -0.84,
      "b": -52.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-slate-grey",
    "name": "Slate Grey",
    "brand": "Pro Acryl",
    "hex": "#3E4D5D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 77,
      "b": 93
    },
    "lab": {
      "l": 32.08,
      "a": -1.58,
      "b": -11.31
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-amp-steel",
    "name": "Steel",
    "brand": "Pro Acryl",
    "hex": "#90939B",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 144,
      "g": 147,
      "b": 155
    },
    "lab": {
      "l": 60.93,
      "a": 0.53,
      "b": -4.59
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-tan-flesh",
    "name": "Tan Flesh",
    "brand": "Pro Acryl",
    "hex": "#D68E7E",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 214,
      "g": 142,
      "b": 126
    },
    "lab": {
      "l": 65.87,
      "a": 25.45,
      "b": 19.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-turquoise",
    "name": "Turquoise",
    "brand": "Pro Acryl",
    "hex": "#01ACC8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 172,
      "b": 200
    },
    "lab": {
      "l": 64.71,
      "a": -26.72,
      "b": -24.64
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-ultramarine",
    "name": "Ultramarine",
    "brand": "Pro Acryl",
    "hex": "#314CD7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 49,
      "g": 76,
      "b": 215
    },
    "lab": {
      "l": 39.12,
      "a": 39.16,
      "b": -73.8
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-warm-brown",
    "name": "Warm Brown",
    "brand": "Pro Acryl",
    "hex": "#583429",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 88,
      "g": 52,
      "b": 41
    },
    "lab": {
      "l": 25.84,
      "a": 14.84,
      "b": 13.77
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-warm-flesh",
    "name": "Warm Flesh",
    "brand": "Pro Acryl",
    "hex": "#E9B98F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 233,
      "g": 185,
      "b": 143
    },
    "lab": {
      "l": 78.47,
      "a": 11.77,
      "b": 27.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-warm-grey",
    "name": "Warm Grey",
    "brand": "Pro Acryl",
    "hex": "#585B60",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 88,
      "g": 91,
      "b": 96
    },
    "lab": {
      "l": 38.55,
      "a": -0.08,
      "b": -3.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-warm-yellow",
    "name": "Warm Yellow",
    "brand": "Pro Acryl",
    "hex": "#FCAA22",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 252,
      "g": 170,
      "b": 34
    },
    "lab": {
      "l": 75.8,
      "a": 20.49,
      "b": 73.84
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-white-blue",
    "name": "White Blue",
    "brand": "Pro Acryl",
    "hex": "#CAF6F9",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 202,
      "g": 246,
      "b": 249
    },
    "lab": {
      "l": 94.01,
      "a": -13.38,
      "b": -6.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-white-gold",
    "name": "White Gold",
    "brand": "Pro Acryl",
    "hex": "#C9BBAB",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 201,
      "g": 187,
      "b": 171
    },
    "lab": {
      "l": 76.62,
      "a": 2.27,
      "b": 9.89
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-yellow-green",
    "name": "Yellow Green",
    "brand": "Pro Acryl",
    "hex": "#758035",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 117,
      "g": 128,
      "b": 53
    },
    "lab": {
      "l": 51.24,
      "a": -15.5,
      "b": 38.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "pro-acryl-yellow-ochre",
    "name": "Yellow Ochre",
    "brand": "Pro Acryl",
    "hex": "#F4AA4C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 244,
      "g": 170,
      "b": 76
    },
    "lab": {
      "l": 75.14,
      "a": 18.66,
      "b": 57.64
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-abhorrent-ochre",
    "name": "Abhorrent Ochre",
    "brand": "Two Thin Coats",
    "hex": "#AA8437",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 170,
      "g": 132,
      "b": 55
    },
    "lab": {
      "l": 57.39,
      "a": 6.22,
      "b": 45.82
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-abyss-blue",
    "name": "Abyss Blue",
    "brand": "Two Thin Coats",
    "hex": "#2C334E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 44,
      "g": 51,
      "b": 78
    },
    "lab": {
      "l": 21.77,
      "a": 5.05,
      "b": -17.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-altar-ivory",
    "name": "Altar Ivory",
    "brand": "Two Thin Coats",
    "hex": "#CABCAB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 202,
      "g": 188,
      "b": 171
    },
    "lab": {
      "l": 76.96,
      "a": 2.11,
      "b": 10.38
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ambush-yellow",
    "name": "Ambush Yellow",
    "brand": "Two Thin Coats",
    "hex": "#D8B982",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 216,
      "g": 185,
      "b": 130
    },
    "lab": {
      "l": 76.62,
      "a": 3.57,
      "b": 32.03
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-amethyst-rayne",
    "name": "Amethyst Rayne",
    "brand": "Two Thin Coats",
    "hex": "#322452",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 50,
      "g": 36,
      "b": 82
    },
    "lab": {
      "l": 18.14,
      "a": 18.7,
      "b": -25.91
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-amphora-red",
    "name": "Amphora Red",
    "brand": "Two Thin Coats",
    "hex": "#4A171E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 74,
      "g": 23,
      "b": 30
    },
    "lab": {
      "l": 16.32,
      "a": 24.87,
      "b": 8.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-amulet-purple",
    "name": "Amulet Purple",
    "brand": "Two Thin Coats",
    "hex": "#AB8CC6",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 171,
      "g": 140,
      "b": 198
    },
    "lab": {
      "l": 62.92,
      "a": 22.8,
      "b": -25.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ancient-forest",
    "name": "Ancient Forest",
    "brand": "Two Thin Coats",
    "hex": "#5D4842",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 93,
      "g": 72,
      "b": 66
    },
    "lab": {
      "l": 32.6,
      "a": 7.92,
      "b": 7.01
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ancient-gold",
    "name": "Ancient Gold",
    "brand": "Two Thin Coats",
    "hex": "#574420",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 87,
      "g": 68,
      "b": 32
    },
    "lab": {
      "l": 30.07,
      "a": 3.32,
      "b": 24.58
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-ancient-iron",
    "name": "Ancient Iron",
    "brand": "Two Thin Coats",
    "hex": "#603F31",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 96,
      "g": 63,
      "b": 49
    },
    "lab": {
      "l": 30.07,
      "a": 12.56,
      "b": 14.43
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-animus-black",
    "name": "Animus Black",
    "brand": "Two Thin Coats",
    "hex": "#191B1F",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 25,
      "g": 27,
      "b": 31
    },
    "lab": {
      "l": 9.72,
      "a": 0.16,
      "b": -3.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-antiquity-green",
    "name": "Antiquity Green",
    "brand": "Two Thin Coats",
    "hex": "#006464",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 100,
      "b": 100
    },
    "lab": {
      "l": 37.9,
      "a": -24.2,
      "b": -7.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-apocalypse-sky",
    "name": "Apocalypse Sky",
    "brand": "Two Thin Coats",
    "hex": "#A73124",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 167,
      "g": 49,
      "b": 36
    },
    "lab": {
      "l": 38.8,
      "a": 47.46,
      "b": 35.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-archaic-sepia",
    "name": "Archaic Sepia Wash",
    "brand": "Two Thin Coats",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-archon-orange",
    "name": "Archon Orange",
    "brand": "Two Thin Coats",
    "hex": "#E85D2B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 232,
      "g": 93,
      "b": 43
    },
    "lab": {
      "l": 57.24,
      "a": 51.49,
      "b": 53.89
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ares-flesh",
    "name": "Ares Flesh",
    "brand": "Two Thin Coats",
    "hex": "#A97D5A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 169,
      "g": 125,
      "b": 90
    },
    "lab": {
      "l": 55.93,
      "a": 12.62,
      "b": 25.72
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-argonaut-skin",
    "name": "Argonaut Skin",
    "brand": "Two Thin Coats",
    "hex": "#795942",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 121,
      "g": 89,
      "b": 66
    },
    "lab": {
      "l": 40.58,
      "a": 9.99,
      "b": 18.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ashen-grey",
    "name": "Ashen Grey",
    "brand": "Two Thin Coats",
    "hex": "#353535",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 53,
      "g": 53,
      "b": 53
    },
    "lab": {
      "l": 22.16,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-asmodeus-red",
    "name": "Asmodeus Red",
    "brand": "Two Thin Coats",
    "hex": "#681B20",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 104,
      "g": 27,
      "b": 32
    },
    "lab": {
      "l": 23.11,
      "a": 34.44,
      "b": 16.76
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-aztec-turquoise",
    "name": "Aztec Turquoise Wash",
    "brand": "Two Thin Coats",
    "hex": "#0E7F78",
    "type": "Shade",
    "category": "wash",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 14,
      "g": 127,
      "b": 120
    },
    "lab": {
      "l": 47.79,
      "a": -30.11,
      "b": -4.44
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-barbarian-brawn",
    "name": "Barbarian Brawn",
    "brand": "Two Thin Coats",
    "hex": "#824D44",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 130,
      "g": 77,
      "b": 68
    },
    "lab": {
      "l": 38.68,
      "a": 21.3,
      "b": 14.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-bard-skin",
    "name": "Bard Skin",
    "brand": "Two Thin Coats",
    "hex": "#764D47",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 118,
      "g": 77,
      "b": 71
    },
    "lab": {
      "l": 37.14,
      "a": 16.53,
      "b": 10.66
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-battle-axe-brass",
    "name": "Battle Axe Brass",
    "brand": "Two Thin Coats",
    "hex": "#AA8371",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 170,
      "g": 131,
      "b": 113
    },
    "lab": {
      "l": 58.01,
      "a": 12.39,
      "b": 15.5
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-battle-mud",
    "name": "Battle Mud Wash",
    "brand": "Two Thin Coats",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-berserker-red",
    "name": "Berserker Red",
    "brand": "Two Thin Coats",
    "hex": "#491C1C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 73,
      "g": 28,
      "b": 28
    },
    "lab": {
      "l": 17.14,
      "a": 21.47,
      "b": 10.61
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-betrayer-green",
    "name": "Betrayer Green",
    "brand": "Two Thin Coats",
    "hex": "#38453B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 56,
      "g": 69,
      "b": 59
    },
    "lab": {
      "l": 27.88,
      "a": -7.61,
      "b": 4.31
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-bitz-otin",
    "name": "Bitz O'Tin",
    "brand": "Two Thin Coats",
    "hex": "#3C261F",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 60,
      "g": 38,
      "b": 31
    },
    "lab": {
      "l": 17.67,
      "a": 9.36,
      "b": 8.86
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-blight-cream",
    "name": "Blight Cream",
    "brand": "Two Thin Coats",
    "hex": "#BDA891",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 189,
      "g": 168,
      "b": 145
    },
    "lab": {
      "l": 70.08,
      "a": 3.95,
      "b": 14.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-blood-red-sky",
    "name": "Blood Red Sky",
    "brand": "Two Thin Coats",
    "hex": "#381C14",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 56,
      "g": 28,
      "b": 20
    },
    "lab": {
      "l": 13.95,
      "a": 12.78,
      "b": 11.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-blue-steel",
    "name": "Blue Steel",
    "brand": "Two Thin Coats",
    "hex": "#687684",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 104,
      "g": 118,
      "b": 132
    },
    "lab": {
      "l": 48.96,
      "a": -1.94,
      "b": -9.4
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-boar-hide",
    "name": "Boar Hide",
    "brand": "Two Thin Coats",
    "hex": "#552014",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 85,
      "g": 32,
      "b": 20
    },
    "lab": {
      "l": 20.11,
      "a": 23.76,
      "b": 20.19
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-bone",
    "name": "Bone Wash",
    "brand": "Two Thin Coats",
    "hex": "#A57962",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 165,
      "g": 121,
      "b": 98
    },
    "lab": {
      "l": 54.61,
      "a": 14.1,
      "b": 19.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-boot-strap-brown",
    "name": "Boot Strap Brown",
    "brand": "Two Thin Coats",
    "hex": "#7C5341",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 124,
      "g": 83,
      "b": 65
    },
    "lab": {
      "l": 39.33,
      "a": 14.81,
      "b": 17.46
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-carapace-green",
    "name": "Carapace Green",
    "brand": "Two Thin Coats",
    "hex": "#329450",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 50,
      "g": 148,
      "b": 80
    },
    "lab": {
      "l": 54.49,
      "a": -43.9,
      "b": 27.78
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-carcharodon-grey",
    "name": "Carcharodon Grey",
    "brand": "Two Thin Coats",
    "hex": "#828583",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 130,
      "g": 133,
      "b": 131
    },
    "lab": {
      "l": 55.24,
      "a": -1.51,
      "b": 0.69
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-celestial-blue",
    "name": "Celestial Blue",
    "brand": "Two Thin Coats",
    "hex": "#6692D4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 102,
      "g": 146,
      "b": 212
    },
    "lab": {
      "l": 60.01,
      "a": 3.63,
      "b": -38.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-centurion-red",
    "name": "Centurion Red",
    "brand": "Two Thin Coats",
    "hex": "#E52221",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 229,
      "g": 34,
      "b": 33
    },
    "lab": {
      "l": 49.4,
      "a": 70.12,
      "b": 51.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-cerberus-brown",
    "name": "Cerberus Brown",
    "brand": "Two Thin Coats",
    "hex": "#D68B4F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 214,
      "g": 139,
      "b": 79
    },
    "lab": {
      "l": 64.43,
      "a": 22.89,
      "b": 43.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-chaos-bronze",
    "name": "Chaos Bronze",
    "brand": "Two Thin Coats",
    "hex": "#7B5745",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 123,
      "g": 87,
      "b": 69
    },
    "lab": {
      "l": 40.34,
      "a": 12.44,
      "b": 16.36
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-cherubic-white",
    "name": "Cherubic White",
    "brand": "Two Thin Coats",
    "hex": "#F4F3F3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 244,
      "g": 243,
      "b": 243
    },
    "lab": {
      "l": 95.92,
      "a": 0.33,
      "b": 0.12
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-cinderborn-brown",
    "name": "Cinderborn Brown",
    "brand": "Two Thin Coats",
    "hex": "#674640",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 103,
      "g": 70,
      "b": 64
    },
    "lab": {
      "l": 33.21,
      "a": 13.3,
      "b": 9.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-cold-corpse-blue",
    "name": "Cold Corpse Blue",
    "brand": "Two Thin Coats",
    "hex": "#323B43",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 50,
      "g": 59,
      "b": 67
    },
    "lab": {
      "l": 24.36,
      "a": -1.61,
      "b": -6.17
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-contagion-green",
    "name": "Contagion Green",
    "brand": "Two Thin Coats",
    "hex": "#809278",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 128,
      "g": 146,
      "b": 120
    },
    "lab": {
      "l": 58.51,
      "a": -11.54,
      "b": 11.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-craven-yellow",
    "name": "Craven Yellow",
    "brand": "Two Thin Coats",
    "hex": "#F7D940",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 247,
      "g": 217,
      "b": 64
    },
    "lab": {
      "l": 86.89,
      "a": -5,
      "b": 74.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-crypt-grey",
    "name": "Crypt Grey",
    "brand": "Two Thin Coats",
    "hex": "#908E7D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 144,
      "g": 142,
      "b": 125
    },
    "lab": {
      "l": 58.75,
      "a": -2.36,
      "b": 9.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-cuirass-leather",
    "name": "Cuirass Leather",
    "brand": "Two Thin Coats",
    "hex": "#331915",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 51,
      "g": 25,
      "b": 21
    },
    "lab": {
      "l": 12.31,
      "a": 12.44,
      "b": 8.46
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-cultmaster-green",
    "name": "Cultmaster Green",
    "brand": "Two Thin Coats",
    "hex": "#1F282E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 31,
      "g": 40,
      "b": 46
    },
    "lab": {
      "l": 15.52,
      "a": -2.17,
      "b": -5.22
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-cursed-blue",
    "name": "Cursed Blue",
    "brand": "Two Thin Coats",
    "hex": "#006D81",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 109,
      "b": 129
    },
    "lab": {
      "l": 42.03,
      "a": -18.68,
      "b": -18.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-cyber-pink",
    "name": "Cyber Pink",
    "brand": "Two Thin Coats",
    "hex": "#CD4A95",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 205,
      "g": 74,
      "b": 149
    },
    "lab": {
      "l": 51.89,
      "a": 58.96,
      "b": -13.88
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-sun-yellow",
    "name": "Dark Sun Yellow",
    "brand": "Two Thin Coats",
    "hex": "#CB8839",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 203,
      "g": 136,
      "b": 57
    },
    "lab": {
      "l": 62.17,
      "a": 18.59,
      "b": 51.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-death-reaper",
    "name": "Death Reaper",
    "brand": "Two Thin Coats",
    "hex": "#29282D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 41,
      "g": 40,
      "b": 45
    },
    "lab": {
      "l": 16.4,
      "a": 1.69,
      "b": -3.1
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-decadent-purple",
    "name": "Decadent Purple",
    "brand": "Two Thin Coats",
    "hex": "#BFB2D5",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 191,
      "g": 178,
      "b": 213
    },
    "lab": {
      "l": 74.65,
      "a": 11.32,
      "b": -15.95
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-demon-red",
    "name": "Demon Red",
    "brand": "Two Thin Coats",
    "hex": "#E6151D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 230,
      "g": 21,
      "b": 29
    },
    "lab": {
      "l": 48.83,
      "a": 72.45,
      "b": 52.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-diablo-red",
    "name": "Diablo Red",
    "brand": "Two Thin Coats",
    "hex": "#E03C20",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 224,
      "g": 60,
      "b": 32
    },
    "lab": {
      "l": 50.91,
      "a": 61.68,
      "b": 52.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-diabolical-green",
    "name": "Diabolical Green",
    "brand": "Two Thin Coats",
    "hex": "#423B29",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 66,
      "g": 59,
      "b": 41
    },
    "lab": {
      "l": 25.1,
      "a": -0.21,
      "b": 12.29
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-divination-white",
    "name": "Divination White",
    "brand": "Two Thin Coats",
    "hex": "#DDDAB5",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 221,
      "g": 218,
      "b": 181
    },
    "lab": {
      "l": 86.43,
      "a": -5.03,
      "b": 18.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-doom-death-black",
    "name": "Doom Death Black",
    "brand": "Two Thin Coats",
    "hex": "#1B1B1B",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 27,
      "g": 27,
      "b": 27
    },
    "lab": {
      "l": 9.77,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-doom-metal",
    "name": "Doom Metal",
    "brand": "Two Thin Coats",
    "hex": "#1F1815",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 31,
      "g": 24,
      "b": 21
    },
    "lab": {
      "l": 8.98,
      "a": 2.86,
      "b": 3.36
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dragon-fang",
    "name": "Dragon Fang",
    "brand": "Two Thin Coats",
    "hex": "#9F8663",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 159,
      "g": 134,
      "b": 99
    },
    "lab": {
      "l": 57.39,
      "a": 4.35,
      "b": 22.4
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dragon-s-gold",
    "name": "Dragon‘s Gold",
    "brand": "Two Thin Coats",
    "hex": "#A5621B",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 165,
      "g": 98,
      "b": 27
    },
    "lab": {
      "l": 48.03,
      "a": 21.83,
      "b": 48.51
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dread-red",
    "name": "Dread Red",
    "brand": "Two Thin Coats",
    "hex": "#532427",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 83,
      "g": 36,
      "b": 39
    },
    "lab": {
      "l": 21.01,
      "a": 22.22,
      "b": 8.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-druid-flesh",
    "name": "Druid Flesh",
    "brand": "Two Thin Coats",
    "hex": "#463631",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 70,
      "g": 54,
      "b": 49
    },
    "lab": {
      "l": 24.2,
      "a": 6.24,
      "b": 5.86
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dry-rust-brown",
    "name": "Dry Rust Brown",
    "brand": "Two Thin Coats",
    "hex": "#8C4828",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 140,
      "g": 72,
      "b": 40
    },
    "lab": {
      "l": 38.49,
      "a": 26.12,
      "b": 31.62
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dungeon-stone-grey",
    "name": "Dungeon Stone Grey",
    "brand": "Two Thin Coats",
    "hex": "#3C4143",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 60,
      "g": 65,
      "b": 67
    },
    "lab": {
      "l": 27.15,
      "a": -1.6,
      "b": -1.93
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dust-bowl",
    "name": "Dust Bowl",
    "brand": "Two Thin Coats",
    "hex": "#745843",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 116,
      "g": 88,
      "b": 67
    },
    "lab": {
      "l": 39.75,
      "a": 8.48,
      "b": 16.63
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dwarven-iron",
    "name": "Dwarven Iron",
    "brand": "Two Thin Coats",
    "hex": "#3F3E3C",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 63,
      "g": 62,
      "b": 60
    },
    "lab": {
      "l": 26.24,
      "a": -0.01,
      "b": 1.38
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dwarven-skin",
    "name": "Dwarven Skin",
    "brand": "Two Thin Coats",
    "hex": "#AB6D51",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 171,
      "g": 109,
      "b": 81
    },
    "lab": {
      "l": 52.05,
      "a": 21.6,
      "b": 25.82
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-dystopian-dust",
    "name": "Dystopian Dust",
    "brand": "Two Thin Coats",
    "hex": "#8A6C67",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 138,
      "g": 108,
      "b": 103
    },
    "lab": {
      "l": 48.4,
      "a": 11.11,
      "b": 7.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-eidolon-grey",
    "name": "Eidolon Grey",
    "brand": "Two Thin Coats",
    "hex": "#413E3A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 65,
      "g": 62,
      "b": 58
    },
    "lab": {
      "l": 26.37,
      "a": 0.43,
      "b": 2.92
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-eldar-robe",
    "name": "Eldar Robe",
    "brand": "Two Thin Coats",
    "hex": "#004089",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 64,
      "b": 137
    },
    "lab": {
      "l": 28.04,
      "a": 13.03,
      "b": -45.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-elixir-green",
    "name": "Elixir Green",
    "brand": "Two Thin Coats",
    "hex": "#69E0AB",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 105,
      "g": 224,
      "b": 171
    },
    "lab": {
      "l": 81.43,
      "a": -45.8,
      "b": 15.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-elven-skin",
    "name": "Elven Skin",
    "brand": "Two Thin Coats",
    "hex": "#BB855F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 133,
      "b": 95
    },
    "lab": {
      "l": 60.04,
      "a": 16.22,
      "b": 28.66
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-elysium-blue",
    "name": "Elysium Blue",
    "brand": "Two Thin Coats",
    "hex": "#4E73B8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 78,
      "g": 115,
      "b": 184
    },
    "lab": {
      "l": 48.69,
      "a": 7.89,
      "b": -40.41
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-emerald-green",
    "name": "Emerald Green",
    "brand": "Two Thin Coats",
    "hex": "#103D25",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 16,
      "g": 61,
      "b": 37
    },
    "lab": {
      "l": 22.23,
      "a": -21.96,
      "b": 10.44
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-emperor-red",
    "name": "Emperor Red",
    "brand": "Two Thin Coats",
    "hex": "#8E121A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 142,
      "g": 18,
      "b": 26
    },
    "lab": {
      "l": 30.06,
      "a": 49.2,
      "b": 30.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-emperors-purple",
    "name": "Emperor's Purple",
    "brand": "Two Thin Coats",
    "hex": "#4E1A51",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 78,
      "g": 26,
      "b": 81
    },
    "lab": {
      "l": 19.85,
      "a": 32.76,
      "b": -22.26
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-enchantment-blue",
    "name": "Enchantment Blue",
    "brand": "Two Thin Coats",
    "hex": "#3466A0",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 52,
      "g": 102,
      "b": 160
    },
    "lab": {
      "l": 42.41,
      "a": 2.56,
      "b": -36.36
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-enchantress-purple",
    "name": "Enchantress Purple",
    "brand": "Two Thin Coats",
    "hex": "#331F3D",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 51,
      "g": 31,
      "b": 61
    },
    "lab": {
      "l": 15.6,
      "a": 16.32,
      "b": -15.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-enticing-purple",
    "name": "Enticing Purple",
    "brand": "Two Thin Coats",
    "hex": "#7E6D8A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 126,
      "g": 109,
      "b": 138
    },
    "lab": {
      "l": 48.52,
      "a": 12.49,
      "b": -13.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ethereal-green",
    "name": "Ethereal Green",
    "brand": "Two Thin Coats",
    "hex": "#348C26",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 52,
      "g": 140,
      "b": 38
    },
    "lab": {
      "l": 51.41,
      "a": -45.85,
      "b": 44.44
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-evil-eye-red",
    "name": "Evil Eye Red",
    "brand": "Two Thin Coats",
    "hex": "#8F322C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 143,
      "g": 50,
      "b": 44
    },
    "lab": {
      "l": 34.61,
      "a": 38.97,
      "b": 24.87
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-fanatic-orange",
    "name": "Fanatic Orange",
    "brand": "Two Thin Coats",
    "hex": "#E84516",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 232,
      "g": 69,
      "b": 22
    },
    "lab": {
      "l": 53.47,
      "a": 60.85,
      "b": 59.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-faust-blue",
    "name": "Faust Blue",
    "brand": "Two Thin Coats",
    "hex": "#27343D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 39,
      "g": 52,
      "b": 61
    },
    "lab": {
      "l": 20.92,
      "a": -2.78,
      "b": -7.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-field-grey",
    "name": "Field Grey",
    "brand": "Two Thin Coats",
    "hex": "#49493E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 73,
      "g": 73,
      "b": 62
    },
    "lab": {
      "l": 30.71,
      "a": -2.26,
      "b": 6.6
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-fire-opal",
    "name": "Fire Opal",
    "brand": "Two Thin Coats",
    "hex": "#AA4616",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 170,
      "g": 70,
      "b": 22
    },
    "lab": {
      "l": 42.74,
      "a": 38.71,
      "b": 46.24
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-flak-gun-yellow",
    "name": "Flak Gun Yellow",
    "brand": "Two Thin Coats",
    "hex": "#BDA060",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 189,
      "g": 160,
      "b": 96
    },
    "lab": {
      "l": 67.13,
      "a": 2.33,
      "b": 37.16
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-flaming-forge-orange",
    "name": "Flaming Forge Orange",
    "brand": "Two Thin Coats",
    "hex": "#FA8135",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 250,
      "g": 129,
      "b": 53
    },
    "lab": {
      "l": 66.74,
      "a": 41.32,
      "b": 59.42
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-flayer-red",
    "name": "Flayer Red",
    "brand": "Two Thin Coats",
    "hex": "#AB2027",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 171,
      "g": 32,
      "b": 39
    },
    "lab": {
      "l": 37.55,
      "a": 54.58,
      "b": 32.69
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-flesh",
    "name": "Flesh Wash",
    "brand": "Two Thin Coats",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 126,
      "b": 77
    },
    "lab": {
      "l": 59.53,
      "a": 23.57,
      "b": 38.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-frost-blue",
    "name": "Frost Blue",
    "brand": "Two Thin Coats",
    "hex": "#6E8C9E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 110,
      "g": 140,
      "b": 158
    },
    "lab": {
      "l": 56.62,
      "a": -6.14,
      "b": -12.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-fur-cloak",
    "name": "Fur Cloak",
    "brand": "Two Thin Coats",
    "hex": "#863930",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 134,
      "g": 57,
      "b": 48
    },
    "lab": {
      "l": 34.42,
      "a": 32.33,
      "b": 21.81
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-fury-green",
    "name": "Fury Green",
    "brand": "Two Thin Coats",
    "hex": "#534C33",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 83,
      "g": 76,
      "b": 51
    },
    "lab": {
      "l": 32.36,
      "a": -1.41,
      "b": 15.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ghoul-green",
    "name": "Ghoul Green",
    "brand": "Two Thin Coats",
    "hex": "#18896D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 24,
      "g": 137,
      "b": 109
    },
    "lab": {
      "l": 50.91,
      "a": -36.99,
      "b": 6.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-gigawatt-blue",
    "name": "Gigawatt Blue",
    "brand": "Two Thin Coats",
    "hex": "#02AAF3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 2,
      "g": 170,
      "b": 243
    },
    "lab": {
      "l": 65.93,
      "a": -10.55,
      "b": -46.42
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-glistening-gold",
    "name": "Glistening Gold",
    "brand": "Two Thin Coats",
    "hex": "#B4823F",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 180,
      "g": 130,
      "b": 63
    },
    "lab": {
      "l": 58.07,
      "a": 12.27,
      "b": 43.01
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-glistening-gums",
    "name": "Glistening Gums",
    "brand": "Two Thin Coats",
    "hex": "#97406A",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 151,
      "g": 64,
      "b": 106
    },
    "lab": {
      "l": 40.06,
      "a": 41.16,
      "b": -6.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-goblinoid-green",
    "name": "Goblinoid Green",
    "brand": "Two Thin Coats",
    "hex": "#689055",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 104,
      "g": 144,
      "b": 85
    },
    "lab": {
      "l": 55.63,
      "a": -25.27,
      "b": 27.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-gravestone-blue",
    "name": "Gravestone Blue",
    "brand": "Two Thin Coats",
    "hex": "#6B7C90",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 107,
      "g": 124,
      "b": 144
    },
    "lab": {
      "l": 51.33,
      "a": -1.47,
      "b": -12.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-green-beret",
    "name": "Green Beret",
    "brand": "Two Thin Coats",
    "hex": "#807248",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 128,
      "g": 114,
      "b": 72
    },
    "lab": {
      "l": 48.38,
      "a": -0.89,
      "b": 25.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-griffon-claw",
    "name": "Griffon Claw",
    "brand": "Two Thin Coats",
    "hex": "#948278",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 148,
      "g": 130,
      "b": 120
    },
    "lab": {
      "l": 55.7,
      "a": 5.13,
      "b": 7.92
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-grindhouse-orange",
    "name": "Grindhouse Orange",
    "brand": "Two Thin Coats",
    "hex": "#944933",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 148,
      "g": 73,
      "b": 51
    },
    "lab": {
      "l": 40.08,
      "a": 29.62,
      "b": 27.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-gung-ho-green",
    "name": "Gung-ho Green",
    "brand": "Two Thin Coats",
    "hex": "#5F5937",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 95,
      "g": 89,
      "b": 55
    },
    "lab": {
      "l": 37.58,
      "a": -3.2,
      "b": 20.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-gyzmo-fur",
    "name": "Gyzmo Fur",
    "brand": "Two Thin Coats",
    "hex": "#87603C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 135,
      "g": 96,
      "b": 60
    },
    "lab": {
      "l": 44.01,
      "a": 11.49,
      "b": 26.7
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-hazard-yellow",
    "name": "Hazard Yellow Wash",
    "brand": "Two Thin Coats",
    "hex": "#DAAC06",
    "type": "Shade",
    "category": "wash",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 218,
      "g": 172,
      "b": 6
    },
    "lab": {
      "l": 72.51,
      "a": 4.39,
      "b": 74.66
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-heirloom-gold",
    "name": "Heirloom Gold",
    "brand": "Two Thin Coats",
    "hex": "#AB733A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 171,
      "g": 115,
      "b": 58
    },
    "lab": {
      "l": 53.2,
      "a": 16.4,
      "b": 39.75
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-hellion-red",
    "name": "Hellion Red Wash",
    "brand": "Two Thin Coats",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 202,
      "g": 108,
      "b": 77
    },
    "lab": {
      "l": 55.91,
      "a": 34.45,
      "b": 33.8
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-hellspawn-red",
    "name": "Hellspawn Red",
    "brand": "Two Thin Coats",
    "hex": "#C91120",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 201,
      "g": 17,
      "b": 32
    },
    "lab": {
      "l": 42.65,
      "a": 65.62,
      "b": 43.77
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-hot-pink",
    "name": "Hot Pink",
    "brand": "Two Thin Coats",
    "hex": "#E0679B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 224,
      "g": 103,
      "b": 155
    },
    "lab": {
      "l": 59.81,
      "a": 52.56,
      "b": -5.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-hydra-green",
    "name": "Hydra Green",
    "brand": "Two Thin Coats",
    "hex": "#1F333B",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 31,
      "g": 51,
      "b": 59
    },
    "lab": {
      "l": 19.94,
      "a": -5.47,
      "b": -7.57
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-incubus-purple",
    "name": "Incubus Purple",
    "brand": "Two Thin Coats",
    "hex": "#544752",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 84,
      "g": 71,
      "b": 82
    },
    "lab": {
      "l": 31.81,
      "a": 7.74,
      "b": -4.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-inferno-orange",
    "name": "Inferno Orange",
    "brand": "Two Thin Coats",
    "hex": "#DC352C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 220,
      "g": 53,
      "b": 44
    },
    "lab": {
      "l": 49.43,
      "a": 63.04,
      "b": 45.23
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ion-blue",
    "name": "Ion Blue",
    "brand": "Two Thin Coats",
    "hex": "#A6C6D8",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 166,
      "g": 198,
      "b": 216
    },
    "lab": {
      "l": 78.14,
      "a": -6.75,
      "b": -12.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-ironclad-silver",
    "name": "Ironclad Silver",
    "brand": "Two Thin Coats",
    "hex": "#8F7D76",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 143,
      "g": 125,
      "b": 118
    },
    "lab": {
      "l": 53.83,
      "a": 5.68,
      "b": 6.35
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ivory-tusk",
    "name": "Ivory Tusk",
    "brand": "Two Thin Coats",
    "hex": "#C1B2AC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 193,
      "g": 178,
      "b": 172
    },
    "lab": {
      "l": 73.65,
      "a": 4.32,
      "b": 4.99
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-jade-green",
    "name": "Jade Green",
    "brand": "Two Thin Coats",
    "hex": "#06473F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 6,
      "g": 71,
      "b": 63
    },
    "lab": {
      "l": 26.46,
      "a": -21.14,
      "b": -0.63
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-kobold-grey",
    "name": "Kobold Grey",
    "brand": "Two Thin Coats",
    "hex": "#928B6F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 146,
      "g": 139,
      "b": 111
    },
    "lab": {
      "l": 57.77,
      "a": -2.16,
      "b": 15.95
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-kronos-flesh",
    "name": "Kronos Flesh",
    "brand": "Two Thin Coats",
    "hex": "#936446",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 147,
      "g": 100,
      "b": 70
    },
    "lab": {
      "l": 46.66,
      "a": 15.42,
      "b": 24.61
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-legion-green",
    "name": "Legion Green",
    "brand": "Two Thin Coats",
    "hex": "#1C5F5E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 28,
      "g": 95,
      "b": 94
    },
    "lab": {
      "l": 36.44,
      "a": -20.62,
      "b": -5.54
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-leviathan-blue",
    "name": "Leviathan Blue",
    "brand": "Two Thin Coats",
    "hex": "#245EB5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 36,
      "g": 94,
      "b": 181
    },
    "lab": {
      "l": 40.76,
      "a": 13.41,
      "b": -51.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-magi-purple",
    "name": "Magi Purple Wash",
    "brand": "Two Thin Coats",
    "hex": "#7A468C",
    "type": "Shade",
    "category": "wash",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 122,
      "g": 70,
      "b": 140
    },
    "lab": {
      "l": 38.57,
      "a": 34.67,
      "b": -30.04
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-malign-yellow",
    "name": "Malign Yellow",
    "brand": "Two Thin Coats",
    "hex": "#B69A3E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 182,
      "g": 154,
      "b": 62
    },
    "lab": {
      "l": 64.49,
      "a": -0.12,
      "b": 50.59
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-mantichore-ochre",
    "name": "Mantichore Ochre",
    "brand": "Two Thin Coats",
    "hex": "#C57433",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 197,
      "g": 116,
      "b": 51
    },
    "lab": {
      "l": 56.69,
      "a": 26.64,
      "b": 47.94
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-marine-blue",
    "name": "Marine Blue",
    "brand": "Two Thin Coats",
    "hex": "#252A5D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 37,
      "g": 42,
      "b": 93
    },
    "lab": {
      "l": 19.39,
      "a": 14.85,
      "b": -31.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-masque-flesh",
    "name": "Masque Flesh",
    "brand": "Two Thin Coats",
    "hex": "#AB675A",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 171,
      "g": 103,
      "b": 90
    },
    "lab": {
      "l": 50.8,
      "a": 25.84,
      "b": 18.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-mythic-turquoise",
    "name": "Mythic Turquoise",
    "brand": "Two Thin Coats",
    "hex": "#4CA6B1",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 76,
      "g": 166,
      "b": 177
    },
    "lab": {
      "l": 63.33,
      "a": -23.5,
      "b": -13.8
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-mythril-blade",
    "name": "Mythril Blade",
    "brand": "Two Thin Coats",
    "hex": "#A5A9AD",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 165,
      "g": 169,
      "b": 173
    },
    "lab": {
      "l": 69.03,
      "a": -0.64,
      "b": -2.55
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-necrosis-green",
    "name": "Necrosis Green Wash",
    "brand": "Two Thin Coats",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-neo-pink",
    "name": "Neo Pink",
    "brand": "Two Thin Coats",
    "hex": "#F494D8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 244,
      "g": 148,
      "b": 216
    },
    "lab": {
      "l": 73.14,
      "a": 45.4,
      "b": -19.37
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-noble-steed-brown",
    "name": "Noble Steed Brown",
    "brand": "Two Thin Coats",
    "hex": "#5B311B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 49,
      "b": 27
    },
    "lab": {
      "l": 25.26,
      "a": 16.84,
      "b": 22.05
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-noir-brown",
    "name": "Noir Brown",
    "brand": "Two Thin Coats",
    "hex": "#382A23",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 56,
      "g": 42,
      "b": 35
    },
    "lab": {
      "l": 18.44,
      "a": 5.26,
      "b": 7.06
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-oblivion-black",
    "name": "Oblivion Black Wash",
    "brand": "Two Thin Coats",
    "hex": "#14100E",
    "type": "Shade",
    "category": "wash",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 20,
      "g": 16,
      "b": 14
    },
    "lab": {
      "l": 4.98,
      "a": 1.2,
      "b": 1.54
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-old-brown-metal",
    "name": "Old Brown Metal",
    "brand": "Two Thin Coats",
    "hex": "#3D3022",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 61,
      "g": 48,
      "b": 34
    },
    "lab": {
      "l": 20.91,
      "a": 3.53,
      "b": 11.2
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-omega-blue",
    "name": "Omega Blue",
    "brand": "Two Thin Coats",
    "hex": "#298893",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 41,
      "g": 136,
      "b": 147
    },
    "lab": {
      "l": 52.05,
      "a": -23.2,
      "b": -13.83
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-orange-flare",
    "name": "Orange Flare",
    "brand": "Two Thin Coats",
    "hex": "#F26B31",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 242,
      "g": 107,
      "b": 49
    },
    "lab": {
      "l": 61.33,
      "a": 48.85,
      "b": 55.61
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-orc-flesh",
    "name": "Orc Flesh Wash",
    "brand": "Two Thin Coats",
    "hex": "#1BA169",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 161,
      "b": 105
    },
    "lab": {
      "l": 58.73,
      "a": -47.52,
      "b": 19.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-orc-hide",
    "name": "Orc Hide",
    "brand": "Two Thin Coats",
    "hex": "#566F4F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 86,
      "g": 111,
      "b": 79
    },
    "lab": {
      "l": 44.11,
      "a": -15.91,
      "b": 14.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-overlord-brass",
    "name": "Overlord Brass",
    "brand": "Two Thin Coats",
    "hex": "#C26545",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 194,
      "g": 101,
      "b": 69
    },
    "lab": {
      "l": 53.18,
      "a": 34.43,
      "b": 34.64
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-oxidation-green",
    "name": "Oxidation Green",
    "brand": "Two Thin Coats",
    "hex": "#132634",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 19,
      "g": 38,
      "b": 52
    },
    "lab": {
      "l": 14.24,
      "a": -2.72,
      "b": -11.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-paladin-flesh",
    "name": "Paladin Flesh",
    "brand": "Two Thin Coats",
    "hex": "#593E3D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 89,
      "g": 62,
      "b": 61
    },
    "lab": {
      "l": 29.18,
      "a": 11.67,
      "b": 5.32
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-pale-skin",
    "name": "Pale Skin",
    "brand": "Two Thin Coats",
    "hex": "#C79B7E",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 199,
      "g": 155,
      "b": 126
    },
    "lab": {
      "l": 67.35,
      "a": 12.42,
      "b": 21.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-panzer-yellow",
    "name": "Panzer Yellow",
    "brand": "Two Thin Coats",
    "hex": "#957835",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 149,
      "g": 120,
      "b": 53
    },
    "lab": {
      "l": 51.93,
      "a": 3.38,
      "b": 40.16
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-perisher-pink",
    "name": "Perisher Pink",
    "brand": "Two Thin Coats",
    "hex": "#BB4458",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 187,
      "g": 68,
      "b": 88
    },
    "lab": {
      "l": 46.19,
      "a": 49.4,
      "b": 14.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-pestilence-green",
    "name": "Pestilence Green",
    "brand": "Two Thin Coats",
    "hex": "#C3CC97",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 195,
      "g": 204,
      "b": 151
    },
    "lab": {
      "l": 80.19,
      "a": -11.85,
      "b": 25.46
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-plate-armour",
    "name": "Plate Armour",
    "brand": "Two Thin Coats",
    "hex": "#7F7D79",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 127,
      "g": 125,
      "b": 121
    },
    "lab": {
      "l": 52.46,
      "a": -0.02,
      "b": 2.44
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-platinum-crown",
    "name": "Platinum Crown",
    "brand": "Two Thin Coats",
    "hex": "#AE9F90",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 174,
      "g": 159,
      "b": 144
    },
    "lab": {
      "l": 66.37,
      "a": 2.94,
      "b": 9.81
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-dark-arts-pustule-ochre",
    "name": "Pustule Ochre",
    "brand": "Two Thin Coats",
    "hex": "#DE9033",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 222,
      "g": 144,
      "b": 51
    },
    "lab": {
      "l": 66.3,
      "a": 22.1,
      "b": 58.55
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ranger-cloak",
    "name": "Ranger Cloak",
    "brand": "Two Thin Coats",
    "hex": "#5B5C52",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 91,
      "g": 92,
      "b": 82
    },
    "lab": {
      "l": 38.7,
      "a": -2.42,
      "b": 5.62
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-ray-gun-glow",
    "name": "Ray Gun Glow",
    "brand": "Two Thin Coats",
    "hex": "#09B8CD",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 9,
      "g": 184,
      "b": 205
    },
    "lab": {
      "l": 68.56,
      "a": -30.75,
      "b": -21.5
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-red-rage",
    "name": "Red Rage",
    "brand": "Two Thin Coats",
    "hex": "#713223",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 50,
      "b": 35
    },
    "lab": {
      "l": 29.2,
      "a": 26.62,
      "b": 22.66
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-relic-blue",
    "name": "Relic Blue",
    "brand": "Two Thin Coats",
    "hex": "#0070BD",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 112,
      "b": 189
    },
    "lab": {
      "l": 45.99,
      "a": 2.86,
      "b": -47.72
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-rodent-grey",
    "name": "Rodent Grey",
    "brand": "Two Thin Coats",
    "hex": "#4C4B47",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 76,
      "g": 75,
      "b": 71
    },
    "lab": {
      "l": 31.86,
      "a": -0.43,
      "b": 2.53
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-royal-cloak",
    "name": "Royal Cloak",
    "brand": "Two Thin Coats",
    "hex": "#351923",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 53,
      "g": 25,
      "b": 35
    },
    "lab": {
      "l": 13.07,
      "a": 15.43,
      "b": -0.66
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-runic-purple",
    "name": "Runic Purple",
    "brand": "Two Thin Coats",
    "hex": "#9378AC",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 147,
      "g": 120,
      "b": 172
    },
    "lab": {
      "l": 54.67,
      "a": 20.75,
      "b": -23.75
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-rust-orange",
    "name": "Rust Orange",
    "brand": "Two Thin Coats",
    "hex": "#C24225",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 194,
      "g": 66,
      "b": 37
    },
    "lab": {
      "l": 46.32,
      "a": 49.75,
      "b": 44.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sandstone",
    "name": "Sandstone",
    "brand": "Two Thin Coats",
    "hex": "#917B66",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 145,
      "g": 123,
      "b": 102
    },
    "lab": {
      "l": 53.11,
      "a": 5.15,
      "b": 14.65
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sanguine-scarlet",
    "name": "Sanguine Scarlet",
    "brand": "Two Thin Coats",
    "hex": "#8A191C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 138,
      "g": 25,
      "b": 28
    },
    "lab": {
      "l": 29.87,
      "a": 46.23,
      "b": 29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-satyr-brown",
    "name": "Satyr Brown",
    "brand": "Two Thin Coats",
    "hex": "#BC653B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 188,
      "g": 101,
      "b": 59
    },
    "lab": {
      "l": 52.19,
      "a": 31.4,
      "b": 38.7
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-scabbard-brown",
    "name": "Scabbard Brown",
    "brand": "Two Thin Coats",
    "hex": "#523527",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 82,
      "g": 53,
      "b": 39
    },
    "lab": {
      "l": 25.22,
      "a": 11.15,
      "b": 14.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-scarab-red",
    "name": "Scarab Red",
    "brand": "Two Thin Coats",
    "hex": "#9D3137",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 157,
      "g": 49,
      "b": 55
    },
    "lab": {
      "l": 37.19,
      "a": 45.02,
      "b": 21.81
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-scorched-earth",
    "name": "Scorched Earth",
    "brand": "Two Thin Coats",
    "hex": "#372D2C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 45,
      "b": 44
    },
    "lab": {
      "l": 19.52,
      "a": 4.36,
      "b": 2.35
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-seafarer-blue",
    "name": "Seafarer Blue",
    "brand": "Two Thin Coats",
    "hex": "#22B3EA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 34,
      "g": 179,
      "b": 234
    },
    "lab": {
      "l": 68.4,
      "a": -17.32,
      "b": -37.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sentient-turquoise",
    "name": "Sentient Turquoise",
    "brand": "Two Thin Coats",
    "hex": "#014D68",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 1,
      "g": 77,
      "b": 104
    },
    "lab": {
      "l": 30.19,
      "a": -9.72,
      "b": -21.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-septic-green",
    "name": "Septic Green",
    "brand": "Two Thin Coats",
    "hex": "#89A01A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 137,
      "g": 160,
      "b": 26
    },
    "lab": {
      "l": 62.11,
      "a": -24.78,
      "b": 60.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-serpent-eye-yellow",
    "name": "Serpent Eye Yellow",
    "brand": "Two Thin Coats",
    "hex": "#F9C10D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 249,
      "g": 193,
      "b": 13
    },
    "lab": {
      "l": 80.91,
      "a": 6.89,
      "b": 81.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-shadow-blue",
    "name": "Shadow Blue",
    "brand": "Two Thin Coats",
    "hex": "#374C5A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 55,
      "g": 76,
      "b": 90
    },
    "lab": {
      "l": 31.16,
      "a": -4.13,
      "b": -10.85
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sir-coates-silver",
    "name": "Sir Coates Silver",
    "brand": "Two Thin Coats",
    "hex": "#70706C",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 112,
      "g": 112,
      "b": 108
    },
    "lab": {
      "l": 47.13,
      "a": -0.8,
      "b": 2.22
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-skeleton-legion",
    "name": "Skeleton Legion",
    "brand": "Two Thin Coats",
    "hex": "#BD9E76",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 189,
      "g": 158,
      "b": 118
    },
    "lab": {
      "l": 66.96,
      "a": 5.78,
      "b": 25.19
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-skulker-yellow",
    "name": "Skulker Yellow",
    "brand": "Two Thin Coats",
    "hex": "#FA971A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 250,
      "g": 151,
      "b": 26
    },
    "lab": {
      "l": 71.24,
      "a": 29.42,
      "b": 72.17
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-smoke-grey",
    "name": "Smoke Grey Wash",
    "brand": "Two Thin Coats",
    "hex": "#5E5B5C",
    "type": "Shade",
    "category": "wash",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 94,
      "g": 91,
      "b": 92
    },
    "lab": {
      "l": 38.96,
      "a": 1.4,
      "b": -0.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-solar-flare",
    "name": "Solar Flare",
    "brand": "Two Thin Coats",
    "hex": "#F67D1A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 246,
      "g": 125,
      "b": 26
    },
    "lab": {
      "l": 65.23,
      "a": 41.09,
      "b": 67.46
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sorceror-s-cloak",
    "name": "Sorceror‘s Cloak",
    "brand": "Two Thin Coats",
    "hex": "#694483",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 105,
      "g": 68,
      "b": 131
    },
    "lab": {
      "l": 35.55,
      "a": 28.56,
      "b": -29.42
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-spartan-bronze",
    "name": "Spartan Bronze",
    "brand": "Two Thin Coats",
    "hex": "#7C3B1A",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 124,
      "g": 59,
      "b": 26
    },
    "lab": {
      "l": 32.89,
      "a": 25.79,
      "b": 32.49
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-spectral-purple",
    "name": "Spectral Purple",
    "brand": "Two Thin Coats",
    "hex": "#79327B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 121,
      "g": 50,
      "b": 123
    },
    "lab": {
      "l": 33.51,
      "a": 41.53,
      "b": -27.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-steampunk-copper",
    "name": "Steampunk Copper",
    "brand": "Two Thin Coats",
    "hex": "#774230",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 119,
      "g": 66,
      "b": 48
    },
    "lab": {
      "l": 34.05,
      "a": 21.01,
      "b": 20.85
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sun-bleach-yellow",
    "name": "Sun Bleach Yellow",
    "brand": "Two Thin Coats",
    "hex": "#F8D464",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 248,
      "g": 212,
      "b": 100
    },
    "lab": {
      "l": 85.99,
      "a": -0.1,
      "b": 58.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-sword-hilt-burgundy",
    "name": "Sword Hilt Burgundy",
    "brand": "Two Thin Coats",
    "hex": "#601832",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 96,
      "g": 24,
      "b": 50
    },
    "lab": {
      "l": 21.47,
      "a": 34.5,
      "b": 1.84
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-talisman-green",
    "name": "Talisman Green",
    "brand": "Two Thin Coats",
    "hex": "#64AA26",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 100,
      "g": 170,
      "b": 38
    },
    "lab": {
      "l": 63.01,
      "a": -43.26,
      "b": 56.56
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wash-tempest-blue",
    "name": "Tempest Blue Wash",
    "brand": "Two Thin Coats",
    "hex": "#125899",
    "type": "Shade",
    "category": "wash",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 18,
      "g": 88,
      "b": 153
    },
    "lab": {
      "l": 36.76,
      "a": 4.54,
      "b": -41.24
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-temple-stone",
    "name": "Temple Stone",
    "brand": "Two Thin Coats",
    "hex": "#A18B72",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 161,
      "g": 139,
      "b": 114
    },
    "lab": {
      "l": 59.21,
      "a": 4.36,
      "b": 16.45
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-top-brass",
    "name": "Top Brass",
    "brand": "Two Thin Coats",
    "hex": "#B28C7A",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 178,
      "g": 140,
      "b": 122
    },
    "lab": {
      "l": 61.33,
      "a": 11.78,
      "b": 15.12
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-traitor-green",
    "name": "Traitor Green",
    "brand": "Two Thin Coats",
    "hex": "#1A3D3D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 26,
      "g": 61,
      "b": 61
    },
    "lab": {
      "l": 23.32,
      "a": -12.57,
      "b": -3.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-troll-snot-green",
    "name": "Troll Snot Green",
    "brand": "Two Thin Coats",
    "hex": "#8FAB62",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 143,
      "g": 171,
      "b": 98
    },
    "lab": {
      "l": 66.4,
      "a": -22.12,
      "b": 34.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-trooper-white",
    "name": "Trooper White",
    "brand": "Two Thin Coats",
    "hex": "#D8D4CB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 216,
      "g": 212,
      "b": 203
    },
    "lab": {
      "l": 85,
      "a": -0.21,
      "b": 4.93
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-twin-suns-yellow",
    "name": "Twin Suns Yellow",
    "brand": "Two Thin Coats",
    "hex": "#EFE0B9",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 239,
      "g": 224,
      "b": 185
    },
    "lab": {
      "l": 89.47,
      "a": -0.92,
      "b": 20.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-vambrace-brown",
    "name": "Vambrace Brown",
    "brand": "Two Thin Coats",
    "hex": "#92644E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 146,
      "g": 100,
      "b": 78
    },
    "lab": {
      "l": 46.68,
      "a": 15.82,
      "b": 19.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-vampire-fang",
    "name": "Vampire Fang",
    "brand": "Two Thin Coats",
    "hex": "#CEB592",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 206,
      "g": 181,
      "b": 146
    },
    "lab": {
      "l": 74.98,
      "a": 3.7,
      "b": 21.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-von-evile-purple",
    "name": "Von Evile Purple",
    "brand": "Two Thin Coats",
    "hex": "#2A1822",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 42,
      "g": 24,
      "b": 34
    },
    "lab": {
      "l": 11,
      "a": 10.96,
      "b": -3.18
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-war-master-green",
    "name": "War Master Green",
    "brand": "Two Thin Coats",
    "hex": "#1E2D32",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 30,
      "g": 45,
      "b": 50
    },
    "lab": {
      "l": 17.38,
      "a": -4.72,
      "b": -5.23
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wasteland-brown",
    "name": "Wasteland Brown",
    "brand": "Two Thin Coats",
    "hex": "#785D48",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 120,
      "g": 93,
      "b": 72
    },
    "lab": {
      "l": 41.67,
      "a": 7.89,
      "b": 16.28
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-white-star",
    "name": "White Star",
    "brand": "Two Thin Coats",
    "hex": "#F1F3EF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 241,
      "g": 243,
      "b": 239
    },
    "lab": {
      "l": 95.59,
      "a": -1.37,
      "b": 1.69
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-witching-hour-blue",
    "name": "Witching Hour Blue",
    "brand": "Two Thin Coats",
    "hex": "#193B80",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 25,
      "g": 59,
      "b": 128
    },
    "lab": {
      "l": 26.43,
      "a": 14.65,
      "b": -42.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wizard-grey",
    "name": "Wizard Grey",
    "brand": "Two Thin Coats",
    "hex": "#545452",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 84,
      "g": 84,
      "b": 82
    },
    "lab": {
      "l": 35.66,
      "a": -0.42,
      "b": 1.17
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wolf-grey",
    "name": "Wolf Grey",
    "brand": "Two Thin Coats",
    "hex": "#485D78",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 72,
      "g": 93,
      "b": 120
    },
    "lab": {
      "l": 38.83,
      "a": -0.49,
      "b": -17.77
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-wyvern-green",
    "name": "Wyvern Green",
    "brand": "Two Thin Coats",
    "hex": "#10241D",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 16,
      "g": 36,
      "b": 29
    },
    "lab": {
      "l": 12.35,
      "a": -10.29,
      "b": 2.17
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-yellow-flame",
    "name": "Yellow Flame",
    "brand": "Two Thin Coats",
    "hex": "#FDAA1D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 253,
      "g": 170,
      "b": 29
    },
    "lab": {
      "l": 75.9,
      "a": 20.81,
      "b": 75.18
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "two-thin-coats-zombie-rot",
    "name": "Zombie Rot",
    "brand": "Two Thin Coats",
    "hex": "#A7AD82",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 167,
      "g": 173,
      "b": 130
    },
    "lab": {
      "l": 69.27,
      "a": -9.45,
      "b": 21.45
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-abyssal-turquoise",
    "name": "Abyssal Turquoise",
    "brand": "Vallejo",
    "hex": "#0C2B38",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 12,
      "g": 43,
      "b": 56
    },
    "lab": {
      "l": 15.96,
      "a": -6.25,
      "b": -11.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-alien-purple",
    "name": "Alien Purple",
    "brand": "Vallejo",
    "hex": "#6458A8",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 100,
      "g": 88,
      "b": 168
    },
    "lab": {
      "l": 42.02,
      "a": 24.88,
      "b": -41.53
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-aluminium",
    "name": "Aluminium",
    "brand": "Vallejo",
    "hex": "#CECBCC",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 206,
      "g": 203,
      "b": 204
    },
    "lab": {
      "l": 81.94,
      "a": 1.21,
      "b": -0.13
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-amaranth-red",
    "name": "Amaranth Red",
    "brand": "Vallejo",
    "hex": "#CF4619",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 207,
      "g": 70,
      "b": 25
    },
    "lab": {
      "l": 49.15,
      "a": 52.25,
      "b": 52.88
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-andrea-blue",
    "name": "Andrea Blue",
    "brand": "Vallejo",
    "hex": "#0497EE",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 4,
      "g": 151,
      "b": 238
    },
    "lab": {
      "l": 60.18,
      "a": -1.56,
      "b": -52.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-angel-green",
    "name": "Angel Green",
    "brand": "Vallejo",
    "hex": "#2B5228",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 43,
      "g": 82,
      "b": 40
    },
    "lab": {
      "l": 31.12,
      "a": -23.61,
      "b": 20.37
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-aquamarine",
    "name": "Aquamarine",
    "brand": "Vallejo",
    "hex": "#019AA6",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 154,
      "b": 166
    },
    "lab": {
      "l": 57.91,
      "a": -29.09,
      "b": -15.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-athena-skin",
    "name": "Athena Skin",
    "brand": "Vallejo",
    "hex": "#DE7367",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 222,
      "g": 115,
      "b": 103
    },
    "lab": {
      "l": 60.58,
      "a": 40.51,
      "b": 25.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-azure",
    "name": "Azure",
    "brand": "Vallejo",
    "hex": "#5677B7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 86,
      "g": 119,
      "b": 183
    },
    "lab": {
      "l": 50.2,
      "a": 6.89,
      "b": -37.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-barbarian-skin",
    "name": "Barbarian Skin",
    "brand": "Vallejo",
    "hex": "#A37D64",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 163,
      "g": 125,
      "b": 100
    },
    "lab": {
      "l": 55.46,
      "a": 11.24,
      "b": 19.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-basalt-grey",
    "name": "Basalt Grey",
    "brand": "Vallejo",
    "hex": "#454B4E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 69,
      "g": 75,
      "b": 78
    },
    "lab": {
      "l": 31.46,
      "a": -1.72,
      "b": -2.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-basic-skin-tone",
    "name": "Basic Skin Tone",
    "brand": "Vallejo",
    "hex": "#F4AA85",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 244,
      "g": 170,
      "b": 133
    },
    "lab": {
      "l": 75.87,
      "a": 22.96,
      "b": 29.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bc-dark-brown",
    "name": "BC Dark Brown",
    "brand": "Vallejo",
    "hex": "#71533A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 83,
      "b": 58
    },
    "lab": {
      "l": 37.85,
      "a": 9.08,
      "b": 19.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-beasty-brown",
    "name": "Beasty Brown",
    "brand": "Vallejo",
    "hex": "#724315",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 114,
      "g": 67,
      "b": 21
    },
    "lab": {
      "l": 33.24,
      "a": 16.37,
      "b": 34.83
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-beige",
    "name": "Beige",
    "brand": "Vallejo",
    "hex": "#E7BA7F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 231,
      "g": 186,
      "b": 127
    },
    "lab": {
      "l": 78.25,
      "a": 8.74,
      "b": 35.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-beige-brown",
    "name": "Beige Brown",
    "brand": "Vallejo",
    "hex": "#79492F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 121,
      "g": 73,
      "b": 47
    },
    "lab": {
      "l": 36.05,
      "a": 17.67,
      "b": 24.02
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-beige-red",
    "name": "Beige Red",
    "brand": "Vallejo",
    "hex": "#BA7359",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 186,
      "g": 115,
      "b": 89
    },
    "lab": {
      "l": 55.51,
      "a": 25.21,
      "b": 26.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bile-green",
    "name": "Bile Green",
    "brand": "Vallejo",
    "hex": "#E8F463",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 232,
      "g": 244,
      "b": 99
    },
    "lab": {
      "l": 92.91,
      "a": -22.5,
      "b": 66.63
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-black",
    "name": "Black",
    "brand": "Vallejo",
    "hex": "#121111",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 18,
      "g": 17,
      "b": 17
    },
    "lab": {
      "l": 5.15,
      "a": 0.38,
      "b": 0.13
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black",
    "name": "Black",
    "brand": "Vallejo",
    "hex": "#131314",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 19,
      "g": 19,
      "b": 20
    },
    "lab": {
      "l": 5.91,
      "a": 0.22,
      "b": -0.6
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-black-2",
    "name": "Black",
    "brand": "Vallejo",
    "hex": "#000000",
    "type": "Shade",
    "category": "ink",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 0,
      "g": 0,
      "b": 0
    },
    "lab": {
      "l": 0,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black-green",
    "name": "Black Green",
    "brand": "Vallejo",
    "hex": "#163A30",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 22,
      "g": 58,
      "b": 48
    },
    "lab": {
      "l": 21.62,
      "a": -15.92,
      "b": 2.32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-black-green",
    "name": "Black Green",
    "brand": "Vallejo",
    "hex": "#173B31",
    "type": "Shade",
    "category": "ink",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 23,
      "g": 59,
      "b": 49
    },
    "lab": {
      "l": 22.06,
      "a": -15.92,
      "b": 2.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black-grey",
    "name": "Black Grey",
    "brand": "Vallejo",
    "hex": "#28292B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 40,
      "g": 41,
      "b": 43
    },
    "lab": {
      "l": 16.56,
      "a": 0.05,
      "b": -1.46
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black-red",
    "name": "Black Red",
    "brand": "Vallejo",
    "hex": "#50211C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 80,
      "g": 33,
      "b": 28
    },
    "lab": {
      "l": 19.55,
      "a": 21.59,
      "b": 13.99
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black-violet",
    "name": "Black Violet",
    "brand": "Vallejo",
    "hex": "#23161F",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 35,
      "g": 22,
      "b": 31
    },
    "lab": {
      "l": 9.24,
      "a": 8.51,
      "b": -3.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bloody-red",
    "name": "Bloody Red",
    "brand": "Vallejo",
    "hex": "#D4201A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 212,
      "g": 32,
      "b": 26
    },
    "lab": {
      "l": 45.78,
      "a": 65.82,
      "b": 50.24
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-blue",
    "name": "Blue",
    "brand": "Vallejo",
    "hex": "#002173",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 33,
      "b": 115
    },
    "lab": {
      "l": 17.11,
      "a": 25.79,
      "b": -49.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-blue",
    "name": "Blue",
    "brand": "Vallejo",
    "hex": "#002275",
    "type": "Shade",
    "category": "ink",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 34,
      "b": 117
    },
    "lab": {
      "l": 17.59,
      "a": 25.91,
      "b": -49.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-blue-green",
    "name": "Blue Green",
    "brand": "Vallejo",
    "hex": "#00A0B0",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 160,
      "b": 176
    },
    "lab": {
      "l": 60.13,
      "a": -28.79,
      "b": -18.2
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-blue-grey",
    "name": "Blue Grey",
    "brand": "Vallejo",
    "hex": "#4A6886",
    "type": "Shade",
    "category": "wash",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 74,
      "g": 104,
      "b": 134
    },
    "lab": {
      "l": 42.88,
      "a": -2.43,
      "b": -20.03
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-blue-grey-pale",
    "name": "Blue Grey Pale",
    "brand": "Vallejo",
    "hex": "#76868D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 118,
      "g": 134,
      "b": 141
    },
    "lab": {
      "l": 54.89,
      "a": -4.24,
      "b": -5.72
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-blue-violet",
    "name": "Blue Violet",
    "brand": "Vallejo",
    "hex": "#634AA5",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 99,
      "g": 74,
      "b": 165
    },
    "lab": {
      "l": 38.32,
      "a": 32.33,
      "b": -45.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bone-white",
    "name": "Bone White",
    "brand": "Vallejo",
    "hex": "#C4B193",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 196,
      "g": 177,
      "b": 147
    },
    "lab": {
      "l": 73.08,
      "a": 2.1,
      "b": 17.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-brass",
    "name": "Brass",
    "brand": "Vallejo",
    "hex": "#99720F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 153,
      "g": 114,
      "b": 15
    },
    "lab": {
      "l": 50.5,
      "a": 6.94,
      "b": 53.75
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-brassy-brass",
    "name": "Brassy Brass",
    "brand": "Vallejo",
    "hex": "#9A5733",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 154,
      "g": 87,
      "b": 51
    },
    "lab": {
      "l": 44.13,
      "a": 24.37,
      "b": 32.5
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bright-bronze",
    "name": "Bright Bronze",
    "brand": "Vallejo",
    "hex": "#A9613C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 169,
      "g": 97,
      "b": 60
    },
    "lab": {
      "l": 48.65,
      "a": 25.76,
      "b": 33.36
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bright-green",
    "name": "Bright Green",
    "brand": "Vallejo",
    "hex": "#729363",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 114,
      "g": 147,
      "b": 99
    },
    "lab": {
      "l": 57.41,
      "a": -20.9,
      "b": 21.78
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bright-orange",
    "name": "Bright Orange",
    "brand": "Vallejo",
    "hex": "#FC4A0F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 252,
      "g": 74,
      "b": 15
    },
    "lab": {
      "l": 57.69,
      "a": 65.28,
      "b": 65.64
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bronze",
    "name": "Bronze",
    "brand": "Vallejo",
    "hex": "#4E410D",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 78,
      "g": 65,
      "b": 13
    },
    "lab": {
      "l": 27.93,
      "a": -0.68,
      "b": 31.73
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bronze-brown",
    "name": "Bronze Brown",
    "brand": "Vallejo",
    "hex": "#D88938",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 216,
      "g": 137,
      "b": 56
    },
    "lab": {
      "l": 63.98,
      "a": 23.53,
      "b": 53.9
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bronze-green",
    "name": "Bronze Green",
    "brand": "Vallejo",
    "hex": "#3F4A44",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 63,
      "g": 74,
      "b": 68
    },
    "lab": {
      "l": 30.33,
      "a": -5.82,
      "b": 2.1
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-brown",
    "name": "Brown",
    "brand": "Vallejo",
    "hex": "#8A3D1D",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 138,
      "g": 61,
      "b": 29
    },
    "lab": {
      "l": 35.66,
      "a": 30.75,
      "b": 34.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-brown-rose",
    "name": "Brown Rose",
    "brand": "Vallejo",
    "hex": "#A25F60",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 162,
      "g": 95,
      "b": 96
    },
    "lab": {
      "l": 47.9,
      "a": 27.36,
      "b": 11.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-brown-sand",
    "name": "Brown Sand",
    "brand": "Vallejo",
    "hex": "#986748",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 152,
      "g": 103,
      "b": 72
    },
    "lab": {
      "l": 48.06,
      "a": 16.06,
      "b": 25.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-buff",
    "name": "Buff",
    "brand": "Vallejo",
    "hex": "#D2AE70",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 210,
      "g": 174,
      "b": 112
    },
    "lab": {
      "l": 72.99,
      "a": 5.09,
      "b": 36.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-burnt-iron",
    "name": "Burnt Iron",
    "brand": "Vallejo",
    "hex": "#605652",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 96,
      "g": 86,
      "b": 82
    },
    "lab": {
      "l": 37.39,
      "a": 3.31,
      "b": 3.81
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-burnt-red",
    "name": "Burnt Red",
    "brand": "Vallejo",
    "hex": "#63271F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 39,
      "b": 31
    },
    "lab": {
      "l": 24.33,
      "a": 26.55,
      "b": 18.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-burnt-umber",
    "name": "Burnt Umber",
    "brand": "Vallejo",
    "hex": "#5A3C2D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 90,
      "g": 60,
      "b": 45
    },
    "lab": {
      "l": 28.37,
      "a": 11.18,
      "b": 14.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-black-brown",
    "name": "Cam. Black Brown",
    "brand": "Vallejo",
    "hex": "#382720",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 56,
      "g": 39,
      "b": 32
    },
    "lab": {
      "l": 17.44,
      "a": 6.84,
      "b": 7.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-black-green",
    "name": "Cam. Black Green",
    "brand": "Vallejo",
    "hex": "#2A2D26",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 42,
      "g": 45,
      "b": 38
    },
    "lab": {
      "l": 17.96,
      "a": -2.96,
      "b": 4.08
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-dark-green",
    "name": "Cam. Dark Green",
    "brand": "Vallejo",
    "hex": "#27342A",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 39,
      "g": 52,
      "b": 42
    },
    "lab": {
      "l": 20.26,
      "a": -7.95,
      "b": 4.57
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-middle-brown",
    "name": "Cam. Middle Brown",
    "brand": "Vallejo",
    "hex": "#665342",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 102,
      "g": 83,
      "b": 66
    },
    "lab": {
      "l": 36.75,
      "a": 5.12,
      "b": 12.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-olive-green",
    "name": "Cam. Olive Green",
    "brand": "Vallejo",
    "hex": "#424530",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 66,
      "g": 69,
      "b": 48
    },
    "lab": {
      "l": 28.45,
      "a": -5.41,
      "b": 12.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-camouflage-green",
    "name": "Camouflage Green",
    "brand": "Vallejo",
    "hex": "#998835",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 153,
      "g": 136,
      "b": 53
    },
    "lab": {
      "l": 56.72,
      "a": -3.76,
      "b": 45.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-canvas",
    "name": "Canvas",
    "brand": "Vallejo",
    "hex": "#645840",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 100,
      "g": 88,
      "b": 64
    },
    "lab": {
      "l": 37.95,
      "a": 0.89,
      "b": 15.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-carmine-red",
    "name": "Carmine Red",
    "brand": "Vallejo",
    "hex": "#92000D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 146,
      "g": 0,
      "b": 13
    },
    "lab": {
      "l": 29.77,
      "a": 53.06,
      "b": 37.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cavalry-brown",
    "name": "Cavalry Brown",
    "brand": "Vallejo",
    "hex": "#793028",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 121,
      "g": 48,
      "b": 40
    },
    "lab": {
      "l": 30.24,
      "a": 31.31,
      "b": 21.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-cayman-green",
    "name": "Cayman Green",
    "brand": "Vallejo",
    "hex": "#4E4A2F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 78,
      "g": 74,
      "b": 47
    },
    "lab": {
      "l": 31.17,
      "a": -3.08,
      "b": 16.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-chainmail",
    "name": "Chainmail",
    "brand": "Vallejo",
    "hex": "#737C85",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 115,
      "g": 124,
      "b": 133
    },
    "lab": {
      "l": 51.56,
      "a": -1.37,
      "b": -6.03
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-charcoal",
    "name": "Charcoal",
    "brand": "Vallejo",
    "hex": "#2D2C2D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 45,
      "g": 44,
      "b": 45
    },
    "lab": {
      "l": 18.14,
      "a": 0.68,
      "b": -0.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-charred-brown",
    "name": "Charred Brown",
    "brand": "Vallejo",
    "hex": "#38261D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 56,
      "g": 38,
      "b": 29
    },
    "lab": {
      "l": 17.06,
      "a": 7.08,
      "b": 9.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-chestnut-brown",
    "name": "Chestnut Brown",
    "brand": "Vallejo",
    "hex": "#6D473A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 109,
      "g": 71,
      "b": 58
    },
    "lab": {
      "l": 34.12,
      "a": 14.58,
      "b": 14.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-chocolate-brown",
    "name": "Chocolate Brown",
    "brand": "Vallejo",
    "hex": "#4E382A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 78,
      "g": 56,
      "b": 42
    },
    "lab": {
      "l": 25.61,
      "a": 7.67,
      "b": 12.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-chrome",
    "name": "Chrome",
    "brand": "Vallejo",
    "hex": "#A8A3A3",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 168,
      "g": 163,
      "b": 163
    },
    "lab": {
      "l": 67.4,
      "a": 1.8,
      "b": 0.64
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-clear-orange",
    "name": "Clear Orange",
    "brand": "Vallejo",
    "hex": "#F13A01",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 241,
      "g": 58,
      "b": 1
    },
    "lab": {
      "l": 53.75,
      "a": 67.07,
      "b": 65.5
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cold-white",
    "name": "Cold White",
    "brand": "Vallejo",
    "hex": "#E2E7E8",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 226,
      "g": 231,
      "b": 232
    },
    "lab": {
      "l": 91.3,
      "a": -1.49,
      "b": -1.07
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-continental-blue",
    "name": "Continental Blue",
    "brand": "Vallejo",
    "hex": "#16151E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 22,
      "g": 21,
      "b": 30
    },
    "lab": {
      "l": 7.23,
      "a": 2.96,
      "b": -6.11
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-copper",
    "name": "Copper",
    "brand": "Vallejo",
    "hex": "#B66D47",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 182,
      "g": 109,
      "b": 71
    },
    "lab": {
      "l": 53.32,
      "a": 25.36,
      "b": 33.32
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-copper",
    "name": "Copper",
    "brand": "Vallejo",
    "hex": "#A33F13",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 163,
      "g": 63,
      "b": 19
    },
    "lab": {
      "l": 40.23,
      "a": 39.34,
      "b": 44.9
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cork-brown",
    "name": "Cork Brown",
    "brand": "Vallejo",
    "hex": "#A37052",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 163,
      "g": 112,
      "b": 82
    },
    "lab": {
      "l": 51.82,
      "a": 16.62,
      "b": 24.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cream-white",
    "name": "Cream White",
    "brand": "Vallejo",
    "hex": "#E0CFBB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 224,
      "g": 207,
      "b": 187
    },
    "lab": {
      "l": 84,
      "a": 2.66,
      "b": 12.07
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-dark-aluminium",
    "name": "Dark Aluminium",
    "brand": "Vallejo",
    "hex": "#706761",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 112,
      "g": 103,
      "b": 97
    },
    "lab": {
      "l": 44.25,
      "a": 2.42,
      "b": 4.66
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-blue",
    "name": "Dark Blue",
    "brand": "Vallejo",
    "hex": "#203CA1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 32,
      "g": 60,
      "b": 161
    },
    "lab": {
      "l": 29.69,
      "a": 27.89,
      "b": -57.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-blue-grey",
    "name": "Dark Blue Grey",
    "brand": "Vallejo",
    "hex": "#454A4E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 69,
      "g": 74,
      "b": 78
    },
    "lab": {
      "l": 31.14,
      "a": -1.09,
      "b": -3.08
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-dark-brown",
    "name": "Dark Brown",
    "brand": "Vallejo",
    "hex": "#A57962",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 165,
      "g": 121,
      "b": 98
    },
    "lab": {
      "l": 54.61,
      "a": 14.1,
      "b": 19.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-flesh",
    "name": "Dark Flesh",
    "brand": "Vallejo",
    "hex": "#C88A4D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 200,
      "g": 138,
      "b": 77
    },
    "lab": {
      "l": 62.5,
      "a": 17.43,
      "b": 41.65
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-fleshtone",
    "name": "Dark Fleshtone",
    "brand": "Vallejo",
    "hex": "#4E241C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 78,
      "g": 36,
      "b": 28
    },
    "lab": {
      "l": 19.91,
      "a": 18.9,
      "b": 14.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-green",
    "name": "Dark Green",
    "brand": "Vallejo",
    "hex": "#173021",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 23,
      "g": 48,
      "b": 33
    },
    "lab": {
      "l": 17.49,
      "a": -13.97,
      "b": 6.65
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-dark-green",
    "name": "Dark Green",
    "brand": "Vallejo",
    "hex": "#787218",
    "type": "Shade",
    "category": "wash",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 120,
      "g": 114,
      "b": 24
    },
    "lab": {
      "l": 47.1,
      "a": -8.37,
      "b": 46.83
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-grey",
    "name": "Dark Grey",
    "brand": "Vallejo",
    "hex": "#2F353B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 53,
      "b": 59
    },
    "lab": {
      "l": 21.82,
      "a": -0.99,
      "b": -4.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-dark-grey",
    "name": "Dark Grey",
    "brand": "Vallejo",
    "hex": "#312D25",
    "type": "Shade",
    "category": "wash",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 49,
      "g": 45,
      "b": 37
    },
    "lab": {
      "l": 18.64,
      "a": 0.15,
      "b": 5.84
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-gunmetal",
    "name": "Dark Gunmetal",
    "brand": "Vallejo",
    "hex": "#2D2C30",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 45,
      "g": 44,
      "b": 48
    },
    "lab": {
      "l": 18.24,
      "a": 1.42,
      "b": -2.42
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-dark-khaki-green",
    "name": "Dark Khaki Green",
    "brand": "Vallejo",
    "hex": "#77532B",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 119,
      "g": 83,
      "b": 43
    },
    "lab": {
      "l": 38.35,
      "a": 10.42,
      "b": 29.02
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-prussian-blue",
    "name": "Dark Prussian Blue",
    "brand": "Vallejo",
    "hex": "#0C1236",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 12,
      "g": 18,
      "b": 54
    },
    "lab": {
      "l": 7.02,
      "a": 11.55,
      "b": -24.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-purple",
    "name": "Dark Purple",
    "brand": "Vallejo",
    "hex": "#300F27",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 48,
      "g": 15,
      "b": 39
    },
    "lab": {
      "l": 9.93,
      "a": 20.42,
      "b": -8.43
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-red",
    "name": "Dark Red",
    "brand": "Vallejo",
    "hex": "#4F110D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 79,
      "g": 17,
      "b": 13
    },
    "lab": {
      "l": 15.97,
      "a": 28.53,
      "b": 18.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-rose",
    "name": "Dark Rose",
    "brand": "Vallejo",
    "hex": "#885659",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 136,
      "g": 86,
      "b": 89
    },
    "lab": {
      "l": 42.17,
      "a": 21.16,
      "b": 6.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-rust",
    "name": "Dark Rust",
    "brand": "Vallejo",
    "hex": "#392725",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 57,
      "g": 39,
      "b": 37
    },
    "lab": {
      "l": 17.71,
      "a": 8.13,
      "b": 4.67
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-dark-rust",
    "name": "Dark Rust",
    "brand": "Vallejo",
    "hex": "#E74E1A",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 231,
      "g": 78,
      "b": 26
    },
    "lab": {
      "l": 54.57,
      "a": 57.14,
      "b": 58.48
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-sand",
    "name": "Dark Sand",
    "brand": "Vallejo",
    "hex": "#CFAA71",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 207,
      "g": 170,
      "b": 113
    },
    "lab": {
      "l": 71.7,
      "a": 6.1,
      "b": 34.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-sea-blue",
    "name": "Dark Sea Blue",
    "brand": "Vallejo",
    "hex": "#0E2429",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 14,
      "g": 36,
      "b": 41
    },
    "lab": {
      "l": 12.7,
      "a": -6.91,
      "b": -6
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-sea-green",
    "name": "Dark Sea Green",
    "brand": "Vallejo",
    "hex": "#354041",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 53,
      "g": 64,
      "b": 65
    },
    "lab": {
      "l": 26.17,
      "a": -4.23,
      "b": -2.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-sea-grey",
    "name": "Dark Sea Grey",
    "brand": "Vallejo",
    "hex": "#65696A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 101,
      "g": 105,
      "b": 106
    },
    "lab": {
      "l": 44.1,
      "a": -1.33,
      "b": -1.1
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-turquoise",
    "name": "Dark Turquoise",
    "brand": "Vallejo",
    "hex": "#0A3A2B",
    "type": "Shade",
    "category": "ink",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 10,
      "g": 58,
      "b": 43
    },
    "lab": {
      "l": 21.07,
      "a": -20.08,
      "b": 4.85
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-vermilion",
    "name": "Dark Vermilion",
    "brand": "Vallejo",
    "hex": "#C91713",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 201,
      "g": 23,
      "b": 19
    },
    "lab": {
      "l": 42.89,
      "a": 64.45,
      "b": 50.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-yellow",
    "name": "Dark Yellow",
    "brand": "Vallejo",
    "hex": "#958631",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 149,
      "g": 134,
      "b": 49
    },
    "lab": {
      "l": 55.75,
      "a": -4.73,
      "b": 46.18
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-dark-yellow",
    "name": "Dark Yellow",
    "brand": "Vallejo",
    "hex": "#DAAC06",
    "type": "Shade",
    "category": "wash",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 218,
      "g": 172,
      "b": 6
    },
    "lab": {
      "l": 72.51,
      "a": 4.39,
      "b": 74.66
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dead-flesh",
    "name": "Dead Flesh",
    "brand": "Vallejo",
    "hex": "#C4B26F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 196,
      "g": 178,
      "b": 111
    },
    "lab": {
      "l": 72.71,
      "a": -2.88,
      "b": 36.52
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dead-white",
    "name": "Dead White",
    "brand": "Vallejo",
    "hex": "#E6E6E5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 230,
      "g": 230,
      "b": 229
    },
    "lab": {
      "l": 91.27,
      "a": -0.18,
      "b": 0.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deck-tan",
    "name": "Deck Tan",
    "brand": "Vallejo",
    "hex": "#BBB9A4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 187,
      "g": 185,
      "b": 164
    },
    "lab": {
      "l": 74.79,
      "a": -2.96,
      "b": 10.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deep-green",
    "name": "Deep Green",
    "brand": "Vallejo",
    "hex": "#035E3D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 3,
      "g": 94,
      "b": 61
    },
    "lab": {
      "l": 34.72,
      "a": -32.78,
      "b": 12.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-deep-magenta",
    "name": "Deep Magenta",
    "brand": "Vallejo",
    "hex": "#581C41",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 88,
      "g": 28,
      "b": 65
    },
    "lab": {
      "l": 21.16,
      "a": 31.97,
      "b": -9.19
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deep-sky-blue",
    "name": "Deep Sky Blue",
    "brand": "Vallejo",
    "hex": "#1BB3F1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 27,
      "g": 179,
      "b": 241
    },
    "lab": {
      "l": 68.62,
      "a": -15.31,
      "b": -41.09
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deep-yellow",
    "name": "Deep Yellow",
    "brand": "Vallejo",
    "hex": "#FABF2C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 250,
      "g": 191,
      "b": 44
    },
    "lab": {
      "l": 80.61,
      "a": 8.92,
      "b": 75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-desert-brown",
    "name": "Desert Brown",
    "brand": "Vallejo",
    "hex": "#BB8760",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 135,
      "b": 96
    },
    "lab": {
      "l": 60.55,
      "a": 15.21,
      "b": 28.77
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-desert-dust",
    "name": "Desert Dust",
    "brand": "Vallejo",
    "hex": "#D2C392",
    "type": "Shade",
    "category": "wash",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 210,
      "g": 195,
      "b": 146
    },
    "lab": {
      "l": 78.93,
      "a": -2.14,
      "b": 26.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-desert-tan",
    "name": "Desert Tan",
    "brand": "Vallejo",
    "hex": "#A98869",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 169,
      "g": 136,
      "b": 105
    },
    "lab": {
      "l": 59.03,
      "a": 8.14,
      "b": 21.41
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-desert-yellow",
    "name": "Desert Yellow",
    "brand": "Vallejo",
    "hex": "#A8823D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 168,
      "g": 130,
      "b": 61
    },
    "lab": {
      "l": 56.71,
      "a": 6.84,
      "b": 42.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-desert-yellow",
    "name": "Desert Yellow",
    "brand": "Vallejo",
    "hex": "#B6874E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 182,
      "g": 135,
      "b": 78
    },
    "lab": {
      "l": 59.73,
      "a": 11.46,
      "b": 37.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dirty-grey",
    "name": "Dirty Grey",
    "brand": "Vallejo",
    "hex": "#5A583A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 90,
      "g": 88,
      "b": 58
    },
    "lab": {
      "l": 36.85,
      "a": -4.48,
      "b": 17.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-dull-aluminium",
    "name": "Dull Aluminium",
    "brand": "Vallejo",
    "hex": "#A09896",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 160,
      "g": 152,
      "b": 150
    },
    "lab": {
      "l": 63.45,
      "a": 2.56,
      "b": 2.1
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-duraluminium",
    "name": "Duraluminium",
    "brand": "Vallejo",
    "hex": "#7D7473",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 125,
      "g": 116,
      "b": 115
    },
    "lab": {
      "l": 49.6,
      "a": 3.27,
      "b": 1.8
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-earth",
    "name": "Earth",
    "brand": "Vallejo",
    "hex": "#6D512B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 109,
      "g": 81,
      "b": 43
    },
    "lab": {
      "l": 36.58,
      "a": 6.92,
      "b": 26.62
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-electric-blue",
    "name": "Electric Blue",
    "brand": "Vallejo",
    "hex": "#129CC7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 18,
      "g": 156,
      "b": 199
    },
    "lab": {
      "l": 59.91,
      "a": -18.17,
      "b": -31.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-elf-skin-tone",
    "name": "Elf Skin Tone",
    "brand": "Vallejo",
    "hex": "#EBA574",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 235,
      "g": 165,
      "b": 116
    },
    "lab": {
      "l": 73.44,
      "a": 20.44,
      "b": 35.64
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-elfic-blue",
    "name": "Elfic Blue",
    "brand": "Vallejo",
    "hex": "#5675C2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 86,
      "g": 117,
      "b": 194
    },
    "lab": {
      "l": 50.21,
      "a": 11.68,
      "b": -43.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-elfic-flesh",
    "name": "Elfic Flesh",
    "brand": "Vallejo",
    "hex": "#EED5B7",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 238,
      "g": 213,
      "b": 183
    },
    "lab": {
      "l": 86.6,
      "a": 4.09,
      "b": 18.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-emerald",
    "name": "Emerald",
    "brand": "Vallejo",
    "hex": "#007B6E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 123,
      "b": 110
    },
    "lab": {
      "l": 46.03,
      "a": -32.15,
      "b": -1.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-engine-manifold",
    "name": "Engine Manifold",
    "brand": "Vallejo",
    "hex": "#433A2C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 67,
      "g": 58,
      "b": 44
    },
    "lab": {
      "l": 24.96,
      "a": 1.38,
      "b": 10.17
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-english-uniform",
    "name": "English Uniform",
    "brand": "Vallejo",
    "hex": "#6B4B1E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 107,
      "g": 75,
      "b": 30
    },
    "lab": {
      "l": 34.5,
      "a": 8.63,
      "b": 31.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-european-dust",
    "name": "European Dust",
    "brand": "Vallejo",
    "hex": "#744827",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 116,
      "g": 72,
      "b": 39
    },
    "lab": {
      "l": 34.99,
      "a": 15.35,
      "b": 27.26
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-evil-red",
    "name": "Evil Red",
    "brand": "Vallejo",
    "hex": "#231113",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 35,
      "g": 17,
      "b": 19
    },
    "lab": {
      "l": 7.27,
      "a": 9.65,
      "b": 2.27
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-exhaust-manifold",
    "name": "Exhaust Manifold",
    "brand": "Vallejo",
    "hex": "#433A2C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 67,
      "g": 58,
      "b": 44
    },
    "lab": {
      "l": 24.96,
      "a": 1.38,
      "b": 10.17
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-extra-dark-green",
    "name": "Extra Dark Green",
    "brand": "Vallejo",
    "hex": "#2B322B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 43,
      "g": 50,
      "b": 43
    },
    "lab": {
      "l": 19.92,
      "a": -4.7,
      "b": 3.45
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-faded-red",
    "name": "Faded Red",
    "brand": "Vallejo",
    "hex": "#E95E5B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 233,
      "g": 94,
      "b": 91
    },
    "lab": {
      "l": 58.12,
      "a": 53.63,
      "b": 29.69
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-fern-green",
    "name": "Fern Green",
    "brand": "Vallejo",
    "hex": "#385F3B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 56,
      "g": 95,
      "b": 59
    },
    "lab": {
      "l": 36.63,
      "a": -22.26,
      "b": 16.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-field-blue",
    "name": "Field Blue",
    "brand": "Vallejo",
    "hex": "#42545D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 66,
      "g": 84,
      "b": 93
    },
    "lab": {
      "l": 34.58,
      "a": -4.58,
      "b": -7.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-blue",
    "name": "Flat Blue",
    "brand": "Vallejo",
    "hex": "#2A4F9F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 42,
      "g": 79,
      "b": 159
    },
    "lab": {
      "l": 35.18,
      "a": 15.51,
      "b": -47.35
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-brown",
    "name": "Flat Brown",
    "brand": "Vallejo",
    "hex": "#502E24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 80,
      "g": 46,
      "b": 36
    },
    "lab": {
      "l": 22.96,
      "a": 14.35,
      "b": 13.05
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-earth",
    "name": "Flat Earth",
    "brand": "Vallejo",
    "hex": "#71481A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 72,
      "b": 26
    },
    "lab": {
      "l": 34.44,
      "a": 13.11,
      "b": 33.56
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-flesh",
    "name": "Flat Flesh",
    "brand": "Vallejo",
    "hex": "#D38B59",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 211,
      "g": 139,
      "b": 89
    },
    "lab": {
      "l": 64.19,
      "a": 22.37,
      "b": 37.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-green",
    "name": "Flat Green",
    "brand": "Vallejo",
    "hex": "#275725",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 39,
      "g": 87,
      "b": 37
    },
    "lab": {
      "l": 32.66,
      "a": -27.81,
      "b": 23.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-red",
    "name": "Flat Red",
    "brand": "Vallejo",
    "hex": "#B50B16",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 181,
      "g": 11,
      "b": 22
    },
    "lab": {
      "l": 38.06,
      "a": 60.96,
      "b": 43.27
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-yellow",
    "name": "Flat Yellow",
    "brand": "Vallejo",
    "hex": "#FCB026",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 252,
      "g": 176,
      "b": 38
    },
    "lab": {
      "l": 77.22,
      "a": 17.44,
      "b": 73.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-foul-green",
    "name": "Foul Green",
    "brand": "Vallejo",
    "hex": "#02A386",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 163,
      "b": 134
    },
    "lab": {
      "l": 59.82,
      "a": -42.79,
      "b": 5.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ger-field-grey-wwii",
    "name": "Ger. Field- grey WWII",
    "brand": "Vallejo",
    "hex": "#585747",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 88,
      "g": 87,
      "b": 71
    },
    "lab": {
      "l": 36.64,
      "a": -2.7,
      "b": 9.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-germ-beige-wwii",
    "name": "Germ. Beige WWII",
    "brand": "Vallejo",
    "hex": "#938264",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 147,
      "g": 130,
      "b": 100
    },
    "lab": {
      "l": 55.16,
      "a": 1.72,
      "b": 18.64
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-grey",
    "name": "German Grey",
    "brand": "Vallejo",
    "hex": "#252C32",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 37,
      "g": 44,
      "b": 50
    },
    "lab": {
      "l": 17.58,
      "a": -1.39,
      "b": -4.89
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-orange",
    "name": "German Orange",
    "brand": "Vallejo",
    "hex": "#D87164",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 216,
      "g": 113,
      "b": 100
    },
    "lab": {
      "l": 59.28,
      "a": 39.03,
      "b": 25.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-tank-crew",
    "name": "German Tank Crew",
    "brand": "Vallejo",
    "hex": "#464940",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 70,
      "g": 73,
      "b": 64
    },
    "lab": {
      "l": 30.49,
      "a": -3.16,
      "b": 4.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-uniform",
    "name": "German Uniform",
    "brand": "Vallejo",
    "hex": "#3E554B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 85,
      "b": 75
    },
    "lab": {
      "l": 34.04,
      "a": -11.18,
      "b": 3
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-yellow",
    "name": "German Yellow",
    "brand": "Vallejo",
    "hex": "#D1B766",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 209,
      "g": 183,
      "b": 102
    },
    "lab": {
      "l": 75.07,
      "a": -1.02,
      "b": 44.27
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-ghost-green",
    "name": "Ghost Green",
    "brand": "Vallejo",
    "hex": "#80C6A8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 128,
      "g": 198,
      "b": 168
    },
    "lab": {
      "l": 74.7,
      "a": -28.65,
      "b": 8.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-glacier-blue",
    "name": "Glacier Blue",
    "brand": "Vallejo",
    "hex": "#BEC8EB",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 190,
      "g": 200,
      "b": 235
    },
    "lab": {
      "l": 80.88,
      "a": 3.77,
      "b": -18.43
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-glorious-gold",
    "name": "Glorious Gold",
    "brand": "Vallejo",
    "hex": "#B66E21",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 182,
      "g": 110,
      "b": 33
    },
    "lab": {
      "l": 53.18,
      "a": 22.79,
      "b": 51.65
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gloss-black",
    "name": "Gloss Black",
    "brand": "Vallejo",
    "hex": "#050505",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 5,
      "g": 5,
      "b": 5
    },
    "lab": {
      "l": 1.37,
      "a": 0,
      "b": 0
    },
    "finish": "satin",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-goblin-green",
    "name": "Goblin Green",
    "brand": "Vallejo",
    "hex": "#637A3E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 99,
      "g": 122,
      "b": 62
    },
    "lab": {
      "l": 48.16,
      "a": -19.1,
      "b": 29.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gold",
    "name": "Gold",
    "brand": "Vallejo",
    "hex": "#9F8024",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 159,
      "g": 128,
      "b": 36
    },
    "lab": {
      "l": 55.01,
      "a": 2.48,
      "b": 51.19
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-gold",
    "name": "Gold",
    "brand": "Vallejo",
    "hex": "#908047",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 144,
      "g": 128,
      "b": 71
    },
    "lab": {
      "l": 53.84,
      "a": -1.87,
      "b": 32.97
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gold-brown",
    "name": "Gold Brown",
    "brand": "Vallejo",
    "hex": "#C78C3C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 140,
      "b": 60
    },
    "lab": {
      "l": 62.7,
      "a": 14.84,
      "b": 50.13
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-gold-yellow",
    "name": "Gold Yellow",
    "brand": "Vallejo",
    "hex": "#FD8D23",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 253,
      "g": 141,
      "b": 35
    },
    "lab": {
      "l": 69.51,
      "a": 35.96,
      "b": 68.59
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-golden-yellow",
    "name": "Golden Yellow",
    "brand": "Vallejo",
    "hex": "#FBAC46",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 172,
      "b": 70
    },
    "lab": {
      "l": 76.35,
      "a": 20.21,
      "b": 61.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-gorgon-brown",
    "name": "Gorgon Brown",
    "brand": "Vallejo",
    "hex": "#5E3A2F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 94,
      "g": 58,
      "b": 47
    },
    "lab": {
      "l": 28.41,
      "a": 14.53,
      "b": 13.45
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-gory-red",
    "name": "Gory Red",
    "brand": "Vallejo",
    "hex": "#65201A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 32,
      "b": 26
    },
    "lab": {
      "l": 23.25,
      "a": 30.66,
      "b": 20.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-green",
    "name": "Green",
    "brand": "Vallejo",
    "hex": "#139300",
    "type": "Shade",
    "category": "ink",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 19,
      "g": 147,
      "b": 0
    },
    "lab": {
      "l": 52.95,
      "a": -55.78,
      "b": 55.35
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-brown",
    "name": "Green Brown",
    "brand": "Vallejo",
    "hex": "#7C612E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 124,
      "g": 97,
      "b": 46
    },
    "lab": {
      "l": 42.81,
      "a": 4.65,
      "b": 32.71
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-grey",
    "name": "Green Grey",
    "brand": "Vallejo",
    "hex": "#70715D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 112,
      "g": 113,
      "b": 93
    },
    "lab": {
      "l": 47.03,
      "a": -4.15,
      "b": 11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-ochre",
    "name": "Green Ochre",
    "brand": "Vallejo",
    "hex": "#B18548",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 177,
      "g": 133,
      "b": 72
    },
    "lab": {
      "l": 58.59,
      "a": 9.93,
      "b": 38.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-sky",
    "name": "Green Sky",
    "brand": "Vallejo",
    "hex": "#77A87F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 119,
      "g": 168,
      "b": 127
    },
    "lab": {
      "l": 64.53,
      "a": -24.89,
      "b": 16.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-yellow",
    "name": "Green Yellow",
    "brand": "Vallejo",
    "hex": "#5B5621",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 91,
      "g": 86,
      "b": 33
    },
    "lab": {
      "l": 35.96,
      "a": -5.62,
      "b": 30.87
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-grey",
    "name": "Grey",
    "brand": "Vallejo",
    "hex": "#5E5B5C",
    "type": "Shade",
    "category": "wash",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 94,
      "g": 91,
      "b": 92
    },
    "lab": {
      "l": 38.96,
      "a": 1.4,
      "b": -0.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-grey-blue",
    "name": "Grey Blue",
    "brand": "Vallejo",
    "hex": "#6581A1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 101,
      "g": 129,
      "b": 161
    },
    "lab": {
      "l": 52.99,
      "a": -1.74,
      "b": -20.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-grey-brown",
    "name": "Grey Brown",
    "brand": "Vallejo",
    "hex": "#7A6038",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 122,
      "g": 96,
      "b": 56
    },
    "lab": {
      "l": 42.44,
      "a": 5.19,
      "b": 26.71
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-grey-green",
    "name": "Grey Green",
    "brand": "Vallejo",
    "hex": "#3D423F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 61,
      "g": 66,
      "b": 63
    },
    "lab": {
      "l": 27.43,
      "a": -2.76,
      "b": 1.11
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-grunge-brown",
    "name": "Grunge Brown",
    "brand": "Vallejo",
    "hex": "#8E452E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 142,
      "g": 69,
      "b": 46
    },
    "lab": {
      "l": 38.21,
      "a": 28.99,
      "b": 27.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gunmetal",
    "name": "Gunmetal",
    "brand": "Vallejo",
    "hex": "#43474A",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 67,
      "g": 71,
      "b": 74
    },
    "lab": {
      "l": 29.9,
      "a": -0.94,
      "b": -2.36
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gunmetal-blue",
    "name": "Gunmetal Blue",
    "brand": "Vallejo",
    "hex": "#083849",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 8,
      "g": 56,
      "b": 73
    },
    "lab": {
      "l": 21.43,
      "a": -8.48,
      "b": -14.84
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-gunmetal-grey",
    "name": "Gunmetal Grey",
    "brand": "Vallejo",
    "hex": "#353233",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 53,
      "g": 50,
      "b": 51
    },
    "lab": {
      "l": 21.12,
      "a": 1.55,
      "b": -0.16
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gunship-green",
    "name": "Gunship Green",
    "brand": "Vallejo",
    "hex": "#365846",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 54,
      "g": 88,
      "b": 70
    },
    "lab": {
      "l": 34.41,
      "a": -16.91,
      "b": 6.58
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-hammered-copper",
    "name": "Hammered Copper",
    "brand": "Vallejo",
    "hex": "#633627",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 99,
      "g": 54,
      "b": 39
    },
    "lab": {
      "l": 27.95,
      "a": 18.46,
      "b": 18.11
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-hexed-lichen",
    "name": "Hexed Lichen",
    "brand": "Vallejo",
    "hex": "#3A2248",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 58,
      "g": 34,
      "b": 72
    },
    "lab": {
      "l": 17.97,
      "a": 19.71,
      "b": -19.32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-hot-orange",
    "name": "Hot Orange",
    "brand": "Vallejo",
    "hex": "#DE371B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 222,
      "g": 55,
      "b": 27
    },
    "lab": {
      "l": 49.91,
      "a": 62.61,
      "b": 53.85
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-hull-red",
    "name": "Hull Red",
    "brand": "Vallejo",
    "hex": "#522B24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 82,
      "g": 43,
      "b": 36
    },
    "lab": {
      "l": 22.48,
      "a": 17.18,
      "b": 12.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ice-yellow",
    "name": "Ice Yellow",
    "brand": "Vallejo",
    "hex": "#F8DC86",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 248,
      "g": 220,
      "b": 134
    },
    "lab": {
      "l": 88.38,
      "a": -1.41,
      "b": 45.63
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-imperial-blue",
    "name": "Imperial Blue",
    "brand": "Vallejo",
    "hex": "#112F54",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 17,
      "g": 47,
      "b": 84
    },
    "lab": {
      "l": 19.19,
      "a": 3.6,
      "b": -25.71
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-infantry-blue",
    "name": "Infantry Blue",
    "brand": "Vallejo",
    "hex": "#161B39",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 22,
      "g": 27,
      "b": 57
    },
    "lab": {
      "l": 10.92,
      "a": 8.29,
      "b": -20.26
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-intermediate-green",
    "name": "Intermediate Green",
    "brand": "Vallejo",
    "hex": "#307946",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 48,
      "g": 121,
      "b": 70
    },
    "lab": {
      "l": 45.28,
      "a": -34.9,
      "b": 21.35
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-iraqi-sand",
    "name": "Iraqi Sand",
    "brand": "Vallejo",
    "hex": "#C3996D",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 195,
      "g": 153,
      "b": 109
    },
    "lab": {
      "l": 66.13,
      "a": 9.95,
      "b": 29.09
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ivory",
    "name": "Ivory",
    "brand": "Vallejo",
    "hex": "#D6CFB2",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 214,
      "g": 207,
      "b": 178
    },
    "lab": {
      "l": 82.99,
      "a": -2.37,
      "b": 15.3
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-jade-green",
    "name": "Jade Green",
    "brand": "Vallejo",
    "hex": "#017E64",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 126,
      "b": 100
    },
    "lab": {
      "l": 46.77,
      "a": -36.34,
      "b": 5.87
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-japan-unif-wwii",
    "name": "Japan. Unif. WWII",
    "brand": "Vallejo",
    "hex": "#997322",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 153,
      "g": 115,
      "b": 34
    },
    "lab": {
      "l": 50.86,
      "a": 6.98,
      "b": 47.82
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-jet-exhaust",
    "name": "Jet Exhaust",
    "brand": "Vallejo",
    "hex": "#3C3129",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 60,
      "g": 49,
      "b": 41
    },
    "lab": {
      "l": 21.27,
      "a": 3.47,
      "b": 6.96
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-khaki",
    "name": "Khaki",
    "brand": "Vallejo",
    "hex": "#887453",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 136,
      "g": 116,
      "b": 83
    },
    "lab": {
      "l": 49.92,
      "a": 2.79,
      "b": 21.14
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-khaki",
    "name": "Khaki",
    "brand": "Vallejo",
    "hex": "#A88261",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 168,
      "g": 130,
      "b": 97
    },
    "lab": {
      "l": 57.23,
      "a": 10.15,
      "b": 23.47
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-khaki-grey",
    "name": "Khaki Grey",
    "brand": "Vallejo",
    "hex": "#85622E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 133,
      "g": 98,
      "b": 46
    },
    "lab": {
      "l": 44.12,
      "a": 8.25,
      "b": 34.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-lavender-grey",
    "name": "Lavender Grey",
    "brand": "Vallejo",
    "hex": "#685A60",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 104,
      "g": 90,
      "b": 96
    },
    "lab": {
      "l": 39.75,
      "a": 6.83,
      "b": -1.35
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-leather-brown",
    "name": "Leather Brown",
    "brand": "Vallejo",
    "hex": "#8F5E25",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 143,
      "g": 94,
      "b": 37
    },
    "lab": {
      "l": 44.2,
      "a": 14.64,
      "b": 39.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-leather-brown",
    "name": "Leather Brown",
    "brand": "Vallejo",
    "hex": "#5B4433",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 68,
      "b": 51
    },
    "lab": {
      "l": 30.87,
      "a": 7.34,
      "b": 14.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-lemon-yellow",
    "name": "Lemon Yellow",
    "brand": "Vallejo",
    "hex": "#F7E441",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 247,
      "g": 228,
      "b": 65
    },
    "lab": {
      "l": 89.69,
      "a": -10.46,
      "b": 76.54
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-blue-green",
    "name": "Light Blue Green",
    "brand": "Vallejo",
    "hex": "#09DBE7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 9,
      "g": 219,
      "b": 231
    },
    "lab": {
      "l": 79.89,
      "a": -39.05,
      "b": -18.39
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-brown",
    "name": "Light Brown",
    "brand": "Vallejo",
    "hex": "#AA6138",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 170,
      "g": 97,
      "b": 56
    },
    "lab": {
      "l": 48.74,
      "a": 25.92,
      "b": 35.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-emerald",
    "name": "Light Emerald",
    "brand": "Vallejo",
    "hex": "#00B3AB",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 179,
      "b": 171
    },
    "lab": {
      "l": 65.89,
      "a": -39.29,
      "b": -6.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-flesh",
    "name": "Light Flesh",
    "brand": "Vallejo",
    "hex": "#EBC0A9",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 235,
      "g": 192,
      "b": 169
    },
    "lab": {
      "l": 80.87,
      "a": 12.04,
      "b": 17.38
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-green-blue",
    "name": "Light Green Blue",
    "brand": "Vallejo",
    "hex": "#95B4AD",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 149,
      "g": 180,
      "b": 173
    },
    "lab": {
      "l": 70.9,
      "a": -11.97,
      "b": 0.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-green-grey",
    "name": "Light Green Grey",
    "brand": "Vallejo",
    "hex": "#B1B9AA",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 177,
      "g": 185,
      "b": 170
    },
    "lab": {
      "l": 74.16,
      "a": -5.56,
      "b": 6.65
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-grey",
    "name": "Light Grey",
    "brand": "Vallejo",
    "hex": "#8D969E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 141,
      "g": 150,
      "b": 158
    },
    "lab": {
      "l": 61.61,
      "a": -1.57,
      "b": -5.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-light-grey",
    "name": "Light Grey",
    "brand": "Vallejo",
    "hex": "#BFBEBB",
    "type": "Shade",
    "category": "wash",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 191,
      "g": 190,
      "b": 187
    },
    "lab": {
      "l": 76.98,
      "a": -0.2,
      "b": 1.63
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-mud",
    "name": "Light Mud",
    "brand": "Vallejo",
    "hex": "#868067",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 134,
      "g": 128,
      "b": 103
    },
    "lab": {
      "l": 53.48,
      "a": -2.08,
      "b": 14.42
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-orange",
    "name": "Light Orange",
    "brand": "Vallejo",
    "hex": "#FA7218",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 250,
      "g": 114,
      "b": 24
    },
    "lab": {
      "l": 63.7,
      "a": 47.93,
      "b": 67.14
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-pink",
    "name": "Light Pink",
    "brand": "Vallejo",
    "hex": "#FDA0D6",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 253,
      "g": 160,
      "b": 214
    },
    "lab": {
      "l": 76.61,
      "a": 41.83,
      "b": -12.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-light-rust",
    "name": "Light Rust",
    "brand": "Vallejo",
    "hex": "#F06B1E",
    "type": "Shade",
    "category": "wash",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 240,
      "g": 107,
      "b": 30
    },
    "lab": {
      "l": 60.9,
      "a": 47.63,
      "b": 62.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-turquoise",
    "name": "Light Turquoise",
    "brand": "Vallejo",
    "hex": "#0088AE",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 136,
      "b": 174
    },
    "lab": {
      "l": 52.58,
      "a": -17,
      "b": -28.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-violet",
    "name": "Light Violet",
    "brand": "Vallejo",
    "hex": "#B593D0",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 181,
      "g": 147,
      "b": 208
    },
    "lab": {
      "l": 65.94,
      "a": 24.21,
      "b": -26.53
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-yellow",
    "name": "Light Yellow",
    "brand": "Vallejo",
    "hex": "#F3CF5C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 207,
      "b": 92
    },
    "lab": {
      "l": 84.2,
      "a": -0.13,
      "b": 60.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-lime-green",
    "name": "Lime Green",
    "brand": "Vallejo",
    "hex": "#768E09",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 118,
      "g": 142,
      "b": 9
    },
    "lab": {
      "l": 55.3,
      "a": -24.53,
      "b": 57.37
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-london-grey",
    "name": "London Grey",
    "brand": "Vallejo",
    "hex": "#455055",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 69,
      "g": 80,
      "b": 85
    },
    "lab": {
      "l": 33.26,
      "a": -3.13,
      "b": -4.4
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-luftwaffe-green",
    "name": "Luftwaffe Green",
    "brand": "Vallejo",
    "hex": "#2D3B1F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 45,
      "g": 59,
      "b": 31
    },
    "lab": {
      "l": 22.95,
      "a": -11.75,
      "b": 15.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-luftwaffe-uniform",
    "name": "Luftwaffe Uniform",
    "brand": "Vallejo",
    "hex": "#334051",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 64,
      "b": 81
    },
    "lab": {
      "l": 26.63,
      "a": -0.46,
      "b": -11.95
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-lustful-purple",
    "name": "Lustful Purple",
    "brand": "Vallejo",
    "hex": "#A283C7",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 162,
      "g": 131,
      "b": 199
    },
    "lab": {
      "l": 59.92,
      "a": 25.31,
      "b": -30.92
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-magenta",
    "name": "Magenta",
    "brand": "Vallejo",
    "hex": "#AA175F",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 170,
      "g": 23,
      "b": 95
    },
    "lab": {
      "l": 37.82,
      "a": 60.12,
      "b": -2.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-magenta",
    "name": "Magenta",
    "brand": "Vallejo",
    "hex": "#AC1961",
    "type": "Shade",
    "category": "ink",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 172,
      "g": 25,
      "b": 97
    },
    "lab": {
      "l": 38.43,
      "a": 60.38,
      "b": -2.76
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-magic-blue",
    "name": "Magic Blue",
    "brand": "Vallejo",
    "hex": "#016DB7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 109,
      "b": 183
    },
    "lab": {
      "l": 44.75,
      "a": 2.38,
      "b": -46.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-magnesium",
    "name": "Magnesium",
    "brand": "Vallejo",
    "hex": "#3B3A3B",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 59,
      "g": 58,
      "b": 59
    },
    "lab": {
      "l": 24.55,
      "a": 0.66,
      "b": -0.47
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-mahogany-brown",
    "name": "Mahogany Brown",
    "brand": "Vallejo",
    "hex": "#773E31",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 119,
      "g": 62,
      "b": 49
    },
    "lab": {
      "l": 33.11,
      "a": 23.44,
      "b": 19.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-med-flesh-tone",
    "name": "Med. Flesh Tone",
    "brand": "Vallejo",
    "hex": "#B97C43",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 185,
      "g": 124,
      "b": 67
    },
    "lab": {
      "l": 57.21,
      "a": 18.05,
      "b": 40.16
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-medium-blue",
    "name": "Medium Blue",
    "brand": "Vallejo",
    "hex": "#005D95",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 93,
      "b": 149
    },
    "lab": {
      "l": 37.84,
      "a": -1.35,
      "b": -37.12
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-medium-brown",
    "name": "Medium Brown",
    "brand": "Vallejo",
    "hex": "#664629",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 102,
      "g": 70,
      "b": 41
    },
    "lab": {
      "l": 32.63,
      "a": 10.17,
      "b": 22.81
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-medium-grey",
    "name": "Medium Grey",
    "brand": "Vallejo",
    "hex": "#928069",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 146,
      "g": 128,
      "b": 105
    },
    "lab": {
      "l": 54.63,
      "a": 3.14,
      "b": 15.03
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-medium-grey-blue",
    "name": "Medium Grey Blue",
    "brand": "Vallejo",
    "hex": "#8AB9B3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 138,
      "g": 185,
      "b": 179
    },
    "lab": {
      "l": 71.79,
      "a": -16.78,
      "b": -2.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-medium-olive",
    "name": "Medium Olive",
    "brand": "Vallejo",
    "hex": "#375422",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 55,
      "g": 84,
      "b": 34
    },
    "lab": {
      "l": 32.41,
      "a": -20.89,
      "b": 25.5
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-medium-sea-grey",
    "name": "Medium Sea Grey",
    "brand": "Vallejo",
    "hex": "#727272",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 114,
      "g": 114,
      "b": 114
    },
    "lab": {
      "l": 48.04,
      "a": 0,
      "b": 0
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-middle-stone",
    "name": "Middle Stone",
    "brand": "Vallejo",
    "hex": "#8A702F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 138,
      "g": 112,
      "b": 47
    },
    "lab": {
      "l": 48.51,
      "a": 2.49,
      "b": 39.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-midnight-purple",
    "name": "Midnight Purple",
    "brand": "Vallejo",
    "hex": "#241721",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 36,
      "g": 23,
      "b": 33
    },
    "lab": {
      "l": 9.78,
      "a": 8.71,
      "b": -4.35
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-military-green",
    "name": "Military Green",
    "brand": "Vallejo",
    "hex": "#353820",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 53,
      "g": 56,
      "b": 32
    },
    "lab": {
      "l": 22.62,
      "a": -5.97,
      "b": 14.59
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-military-yellow",
    "name": "Military Yellow",
    "brand": "Vallejo",
    "hex": "#8E6921",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 142,
      "g": 105,
      "b": 33
    },
    "lab": {
      "l": 46.93,
      "a": 7.58,
      "b": 44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-moon-yellow",
    "name": "Moon Yellow",
    "brand": "Vallejo",
    "hex": "#F5BA24",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 245,
      "g": 186,
      "b": 36
    },
    "lab": {
      "l": 78.85,
      "a": 9.19,
      "b": 75.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-mustard-brown",
    "name": "Mustard Brown",
    "brand": "Vallejo",
    "hex": "#956531",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 149,
      "g": 101,
      "b": 49
    },
    "lab": {
      "l": 46.87,
      "a": 14.02,
      "b": 36.53
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-natural-steel",
    "name": "Natural Steel",
    "brand": "Vallejo",
    "hex": "#6E7073",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 110,
      "g": 112,
      "b": 115
    },
    "lab": {
      "l": 47.16,
      "a": -0.14,
      "b": -1.93
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-neutral-grey",
    "name": "Neutral Grey",
    "brand": "Vallejo",
    "hex": "#7A7E7F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 122,
      "g": 126,
      "b": 127
    },
    "lab": {
      "l": 52.5,
      "a": -1.29,
      "b": -1.06
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-neutral-grey",
    "name": "Neutral Grey",
    "brand": "Vallejo",
    "hex": "#59626B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 89,
      "g": 98,
      "b": 107
    },
    "lab": {
      "l": 41.09,
      "a": -1.38,
      "b": -6.27
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-new-wood",
    "name": "New Wood",
    "brand": "Vallejo",
    "hex": "#8E552B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 142,
      "g": 85,
      "b": 43
    },
    "lab": {
      "l": 41.88,
      "a": 19.75,
      "b": 33.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-night-blue",
    "name": "Night Blue",
    "brand": "Vallejo",
    "hex": "#1E182A",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 30,
      "g": 24,
      "b": 42
    },
    "lab": {
      "l": 9.77,
      "a": 7.88,
      "b": -11.13
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-nocturnal-red",
    "name": "Nocturnal Red",
    "brand": "Vallejo",
    "hex": "#4B1E20",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 75,
      "g": 30,
      "b": 32
    },
    "lab": {
      "l": 18.05,
      "a": 21.57,
      "b": 9.08
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ochre-brown",
    "name": "Ochre Brown",
    "brand": "Vallejo",
    "hex": "#CE8228",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 206,
      "g": 130,
      "b": 40
    },
    "lab": {
      "l": 61,
      "a": 22.44,
      "b": 57.2
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-off-grey",
    "name": "Off-Grey",
    "brand": "Vallejo",
    "hex": "#5E5B5C",
    "type": "Shade",
    "category": "wash",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 94,
      "g": 91,
      "b": 92
    },
    "lab": {
      "l": 38.96,
      "a": 1.4,
      "b": -0.15
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-off-white",
    "name": "Off-White",
    "brand": "Vallejo",
    "hex": "#D1D1C5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 209,
      "g": 209,
      "b": 197
    },
    "lab": {
      "l": 83.54,
      "a": -2.12,
      "b": 5.95
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-off-white",
    "name": "Off-White",
    "brand": "Vallejo",
    "hex": "#EFE5C2",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 239,
      "g": 229,
      "b": 194
    },
    "lab": {
      "l": 90.91,
      "a": -2.19,
      "b": 18.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-oiled-earth",
    "name": "Oiled Earth",
    "brand": "Vallejo",
    "hex": "#63493C",
    "type": "Shade",
    "category": "wash",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 99,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 33.44,
      "a": 9.09,
      "b": 12.09
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-oily-steel",
    "name": "Oily Steel",
    "brand": "Vallejo",
    "hex": "#565C5A",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 86,
      "g": 92,
      "b": 90
    },
    "lab": {
      "l": 38.5,
      "a": -2.79,
      "b": 0.34
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-old-gold",
    "name": "Old Gold",
    "brand": "Vallejo",
    "hex": "#7B6016",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 123,
      "g": 96,
      "b": 22
    },
    "lab": {
      "l": 42.21,
      "a": 3.35,
      "b": 43.22
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-old-rose",
    "name": "Old Rose",
    "brand": "Vallejo",
    "hex": "#D87983",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 216,
      "g": 121,
      "b": 131
    },
    "lab": {
      "l": 61.58,
      "a": 37.95,
      "b": 11.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-old-wood",
    "name": "Old Wood",
    "brand": "Vallejo",
    "hex": "#8F6D52",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 143,
      "g": 109,
      "b": 82
    },
    "lab": {
      "l": 48.74,
      "a": 9.75,
      "b": 20.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-olive-brown",
    "name": "Olive Brown",
    "brand": "Vallejo",
    "hex": "#45342D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 69,
      "g": 52,
      "b": 45
    },
    "lab": {
      "l": 23.37,
      "a": 6.43,
      "b": 7.36
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-olive-green",
    "name": "Olive Green",
    "brand": "Vallejo",
    "hex": "#517625",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 81,
      "g": 118,
      "b": 37
    },
    "lab": {
      "l": 45.41,
      "a": -27.06,
      "b": 38.98
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-olive-green",
    "name": "Olive Green",
    "brand": "Vallejo",
    "hex": "#13281B",
    "type": "Shade",
    "category": "wash",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 19,
      "g": 40,
      "b": 27
    },
    "lab": {
      "l": 14.03,
      "a": -12.21,
      "b": 5.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-olive-grey",
    "name": "Olive Grey",
    "brand": "Vallejo",
    "hex": "#424731",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 66,
      "g": 71,
      "b": 49
    },
    "lab": {
      "l": 29.12,
      "a": -6.48,
      "b": 12.58
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-orange-brown",
    "name": "Orange Brown",
    "brand": "Vallejo",
    "hex": "#B05826",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 176,
      "g": 88,
      "b": 38
    },
    "lab": {
      "l": 47.43,
      "a": 32.39,
      "b": 43.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-orange-fire",
    "name": "Orange Fire",
    "brand": "Vallejo",
    "hex": "#F95E25",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 249,
      "g": 94,
      "b": 37
    },
    "lab": {
      "l": 60.15,
      "a": 56.84,
      "b": 60.03
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-orange-ochre",
    "name": "Orange Ochre",
    "brand": "Vallejo",
    "hex": "#B0803A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 176,
      "g": 128,
      "b": 58
    },
    "lab": {
      "l": 57.05,
      "a": 11.31,
      "b": 44.21
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-oxford-blue",
    "name": "Oxford Blue",
    "brand": "Vallejo",
    "hex": "#2A2758",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 42,
      "g": 39,
      "b": 88
    },
    "lab": {
      "l": 18.57,
      "a": 16.39,
      "b": -29.28
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pacific-green",
    "name": "Pacific Green",
    "brand": "Vallejo",
    "hex": "#5B907E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 91,
      "g": 144,
      "b": 126
    },
    "lab": {
      "l": 55.76,
      "a": -21.91,
      "b": 4.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pale-blue",
    "name": "Pale Blue",
    "brand": "Vallejo",
    "hex": "#A7C1C0",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 167,
      "g": 193,
      "b": 192
    },
    "lab": {
      "l": 76.17,
      "a": -8.97,
      "b": -2.46
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pale-brown",
    "name": "Pale Brown",
    "brand": "Vallejo",
    "hex": "#7F5B48",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 127,
      "g": 91,
      "b": 72
    },
    "lab": {
      "l": 41.94,
      "a": 12.17,
      "b": 16.78
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-pale-burnt-metal",
    "name": "Pale Burnt Metal",
    "brand": "Vallejo",
    "hex": "#ABA59F",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 171,
      "g": 165,
      "b": 159
    },
    "lab": {
      "l": 68.07,
      "a": 1.07,
      "b": 3.87
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-pale-flesh",
    "name": "Pale Flesh",
    "brand": "Vallejo",
    "hex": "#EDB6A2",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 237,
      "g": 182,
      "b": 162
    },
    "lab": {
      "l": 78.5,
      "a": 17.18,
      "b": 17.87
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pale-grey-blue",
    "name": "Pale Grey Blue",
    "brand": "Vallejo",
    "hex": "#B6C3C8",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 182,
      "g": 195,
      "b": 200
    },
    "lab": {
      "l": 77.96,
      "a": -3.46,
      "b": -4.03
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pale-sand",
    "name": "Pale Sand",
    "brand": "Vallejo",
    "hex": "#DFC5A2",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 223,
      "g": 197,
      "b": 162
    },
    "lab": {
      "l": 80.87,
      "a": 3.92,
      "b": 20.94
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-parasite-brown",
    "name": "Parasite Brown",
    "brand": "Vallejo",
    "hex": "#AA572B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 170,
      "g": 87,
      "b": 43
    },
    "lab": {
      "l": 46.36,
      "a": 30.67,
      "b": 39.9
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-park-green-flat",
    "name": "Park Green Flat",
    "brand": "Vallejo",
    "hex": "#008961",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 137,
      "b": 97
    },
    "lab": {
      "l": 50.4,
      "a": -41.78,
      "b": 12.72
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pastel-blue",
    "name": "Pastel Blue",
    "brand": "Vallejo",
    "hex": "#5E86A8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 94,
      "g": 134,
      "b": 168
    },
    "lab": {
      "l": 54.3,
      "a": -4.59,
      "b": -22.36
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pastel-green",
    "name": "Pastel Green",
    "brand": "Vallejo",
    "hex": "#9CA388",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 156,
      "g": 163,
      "b": 136
    },
    "lab": {
      "l": 65.78,
      "a": -7.4,
      "b": 13.21
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pink",
    "name": "Pink",
    "brand": "Vallejo",
    "hex": "#DE61AD",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 222,
      "g": 97,
      "b": 173
    },
    "lab": {
      "l": 59.07,
      "a": 57.1,
      "b": -16.79
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-plague-brown",
    "name": "Plague Brown",
    "brand": "Vallejo",
    "hex": "#D79535",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 215,
      "g": 149,
      "b": 53
    },
    "lab": {
      "l": 66.67,
      "a": 16.51,
      "b": 57.81
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-polished-gold",
    "name": "Polished Gold",
    "brand": "Vallejo",
    "hex": "#C09036",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 192,
      "g": 144,
      "b": 54
    },
    "lab": {
      "l": 62.86,
      "a": 9.28,
      "b": 52.73
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-prussian-blue",
    "name": "Prussian Blue",
    "brand": "Vallejo",
    "hex": "#09375B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 9,
      "g": 55,
      "b": 91
    },
    "lab": {
      "l": 22.11,
      "a": -0.05,
      "b": -25.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-purple",
    "name": "Purple",
    "brand": "Vallejo",
    "hex": "#632E74",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 99,
      "g": 46,
      "b": 116
    },
    "lab": {
      "l": 29.08,
      "a": 35.89,
      "b": -30.32
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-red",
    "name": "Red",
    "brand": "Vallejo",
    "hex": "#74100C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 116,
      "g": 16,
      "b": 12
    },
    "lab": {
      "l": 24.04,
      "a": 41.46,
      "b": 30.73
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-red",
    "name": "Red",
    "brand": "Vallejo",
    "hex": "#76100D",
    "type": "Shade",
    "category": "ink",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 118,
      "g": 16,
      "b": 13
    },
    "lab": {
      "l": 24.49,
      "a": 42.11,
      "b": 30.86
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-red-leather",
    "name": "Red Leather",
    "brand": "Vallejo",
    "hex": "#934024",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 147,
      "g": 64,
      "b": 36
    },
    "lab": {
      "l": 37.84,
      "a": 33.15,
      "b": 33.43
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-refractive-green",
    "name": "Refractive Green",
    "brand": "Vallejo",
    "hex": "#4B4935",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 75,
      "g": 73,
      "b": 53
    },
    "lab": {
      "l": 30.68,
      "a": -2.95,
      "b": 12.31
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-rosy-flesh",
    "name": "Rosy Flesh",
    "brand": "Vallejo",
    "hex": "#F8927F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 248,
      "g": 146,
      "b": 127
    },
    "lab": {
      "l": 70.91,
      "a": 36.49,
      "b": 26.71
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-royal-blue",
    "name": "Royal Blue",
    "brand": "Vallejo",
    "hex": "#013AA5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 58,
      "b": 165
    },
    "lab": {
      "l": 28.77,
      "a": 28.99,
      "b": -61.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-royal-purple",
    "name": "Royal Purple",
    "brand": "Vallejo",
    "hex": "#4B1852",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 75,
      "g": 24,
      "b": 82
    },
    "lab": {
      "l": 19.05,
      "a": 33.11,
      "b": -24.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-royal-purple",
    "name": "Royal Purple",
    "brand": "Vallejo",
    "hex": "#2D214C",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 45,
      "g": 33,
      "b": 76
    },
    "lab": {
      "l": 16.34,
      "a": 17.37,
      "b": -24.74
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-russian-unif-wwii",
    "name": "Russian Unif. WWII",
    "brand": "Vallejo",
    "hex": "#5F5E41",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 95,
      "g": 94,
      "b": 65
    },
    "lab": {
      "l": 39.28,
      "a": -4.79,
      "b": 16.82
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-rust",
    "name": "Rust",
    "brand": "Vallejo",
    "hex": "#CB3F17",
    "type": "Shade",
    "category": "wash",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 203,
      "g": 63,
      "b": 23
    },
    "lab": {
      "l": 47.39,
      "a": 53.68,
      "b": 51.98
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-saddle-brown",
    "name": "Saddle Brown",
    "brand": "Vallejo",
    "hex": "#824A3D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 130,
      "g": 74,
      "b": 61
    },
    "lab": {
      "l": 37.81,
      "a": 22.32,
      "b": 18.03
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-salmon-rose",
    "name": "Salmon Rose",
    "brand": "Vallejo",
    "hex": "#FE9B8B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 254,
      "g": 155,
      "b": 139
    },
    "lab": {
      "l": 73.79,
      "a": 35.24,
      "b": 24.16
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sand-yellow",
    "name": "Sand Yellow",
    "brand": "Vallejo",
    "hex": "#DFAB5F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 223,
      "g": 171,
      "b": 95
    },
    "lab": {
      "l": 73.31,
      "a": 10.59,
      "b": 45.97
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-scarlet",
    "name": "Scarlet",
    "brand": "Vallejo",
    "hex": "#C82E10",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 200,
      "g": 46,
      "b": 16
    },
    "lab": {
      "l": 44.62,
      "a": 58.59,
      "b": 52.34
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scarlet-blood",
    "name": "Scarlet Blood",
    "brand": "Vallejo",
    "hex": "#BF0206",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 191,
      "g": 2,
      "b": 6
    },
    "lab": {
      "l": 39.81,
      "a": 64.3,
      "b": 51.87
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scarlet-red",
    "name": "Scarlet Red",
    "brand": "Vallejo",
    "hex": "#6C151E",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 108,
      "g": 21,
      "b": 30
    },
    "lab": {
      "l": 23.06,
      "a": 38.04,
      "b": 18.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scorpy-green",
    "name": "Scorpy Green",
    "brand": "Vallejo",
    "hex": "#61A431",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 97,
      "g": 164,
      "b": 49
    },
    "lab": {
      "l": 61.06,
      "a": -41.03,
      "b": 50.6
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scrofulous-brown",
    "name": "Scrofulous Brown",
    "brand": "Vallejo",
    "hex": "#CE7528",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 206,
      "g": 117,
      "b": 40
    },
    "lab": {
      "l": 58.04,
      "a": 29.43,
      "b": 54.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scurvy-green",
    "name": "Scurvy Green",
    "brand": "Vallejo",
    "hex": "#024E44",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 78,
      "b": 68
    },
    "lab": {
      "l": 29.1,
      "a": -23.56,
      "b": -0.01
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-semi-matte-alum",
    "name": "Semi Matte Alum.",
    "brand": "Vallejo",
    "hex": "#AEA9A8",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 174,
      "g": 169,
      "b": 168
    },
    "lab": {
      "l": 69.61,
      "a": 1.6,
      "b": 1.15
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sepia",
    "name": "Sepia",
    "brand": "Vallejo",
    "hex": "#181301",
    "type": "Shade",
    "category": "ink",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 24,
      "g": 19,
      "b": 1
    },
    "lab": {
      "l": 5.98,
      "a": -0.59,
      "b": 8.54
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sick-green",
    "name": "Sick Green",
    "brand": "Vallejo",
    "hex": "#387C40",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 56,
      "g": 124,
      "b": 64
    },
    "lab": {
      "l": 46.48,
      "a": -35.14,
      "b": 26.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-silver",
    "name": "Silver",
    "brand": "Vallejo",
    "hex": "#CBCFD1",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 203,
      "g": 207,
      "b": 209
    },
    "lab": {
      "l": 82.87,
      "a": -0.99,
      "b": -1.47
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-silver",
    "name": "Silver",
    "brand": "Vallejo",
    "hex": "#AEB6C2",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 174,
      "g": 182,
      "b": 194
    },
    "lab": {
      "l": 73.77,
      "a": -0.39,
      "b": -7.03
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-silver",
    "name": "Silver",
    "brand": "Vallejo",
    "hex": "#857F7D",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 133,
      "g": 127,
      "b": 125
    },
    "lab": {
      "l": 53.65,
      "a": 1.88,
      "b": 1.89
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-silver-grey",
    "name": "Silver Grey",
    "brand": "Vallejo",
    "hex": "#CBC5B9",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 203,
      "g": 197,
      "b": 185
    },
    "lab": {
      "l": 79.69,
      "a": 0,
      "b": 6.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-skin",
    "name": "Skin",
    "brand": "Vallejo",
    "hex": "#270909",
    "type": "Shade",
    "category": "ink",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 39,
      "g": 9,
      "b": 9
    },
    "lab": {
      "l": 5.84,
      "a": 14.83,
      "b": 5.33
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-skin-tone",
    "name": "Skin Tone",
    "brand": "Vallejo",
    "hex": "#FBB692",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 251,
      "g": 182,
      "b": 146
    },
    "lab": {
      "l": 79.64,
      "a": 20.7,
      "b": 28.21
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sky-blue",
    "name": "Sky Blue",
    "brand": "Vallejo",
    "hex": "#7BCFFE",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 123,
      "g": 207,
      "b": 254
    },
    "lab": {
      "l": 79.61,
      "a": -12.92,
      "b": -30.86
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sky-grey",
    "name": "Sky Grey",
    "brand": "Vallejo",
    "hex": "#A3AAB1",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 163,
      "g": 170,
      "b": 177
    },
    "lab": {
      "l": 69.26,
      "a": -1.07,
      "b": -4.45
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sombre-grey",
    "name": "Sombre Grey",
    "brand": "Vallejo",
    "hex": "#4C5C6E",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 76,
      "g": 92,
      "b": 110
    },
    "lab": {
      "l": 38.4,
      "a": -1.48,
      "b": -12.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-splinter-green",
    "name": "Splinter Green",
    "brand": "Vallejo",
    "hex": "#328355",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 50,
      "g": 131,
      "b": 85
    },
    "lab": {
      "l": 48.96,
      "a": -35.84,
      "b": 17.75
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-squid-pink",
    "name": "Squid Pink",
    "brand": "Vallejo",
    "hex": "#D877BB",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 216,
      "g": 119,
      "b": 187
    },
    "lab": {
      "l": 62.83,
      "a": 46.67,
      "b": -19.15
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-steel",
    "name": "Steel",
    "brand": "Vallejo",
    "hex": "#46403F",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 70,
      "g": 64,
      "b": 63
    },
    "lab": {
      "l": 27.65,
      "a": 2.35,
      "b": 1.54
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-steel-grey",
    "name": "Steel Grey",
    "brand": "Vallejo",
    "hex": "#6388AA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 99,
      "g": 136,
      "b": 170
    },
    "lab": {
      "l": 55.24,
      "a": -3.82,
      "b": -22.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-stone-grey",
    "name": "Stone Grey",
    "brand": "Vallejo",
    "hex": "#A59A7A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 165,
      "g": 154,
      "b": 122
    },
    "lab": {
      "l": 63.77,
      "a": -1.19,
      "b": 18.29
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-stonewall-grey",
    "name": "Stonewall Grey",
    "brand": "Vallejo",
    "hex": "#9A9A9A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 154,
      "g": 154,
      "b": 154
    },
    "lab": {
      "l": 63.6,
      "a": 0,
      "b": 0
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-succubus-skin",
    "name": "Succubus Skin",
    "brand": "Vallejo",
    "hex": "#935353",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 147,
      "g": 83,
      "b": 83
    },
    "lab": {
      "l": 42.79,
      "a": 26.59,
      "b": 11.68
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sun-yellow",
    "name": "Sun Yellow",
    "brand": "Vallejo",
    "hex": "#F6A51B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 246,
      "g": 165,
      "b": 27
    },
    "lab": {
      "l": 73.92,
      "a": 20.45,
      "b": 73.76
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sunny-skin-tone",
    "name": "Sunny Skin Tone",
    "brand": "Vallejo",
    "hex": "#EA9360",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 234,
      "g": 147,
      "b": 96
    },
    "lab": {
      "l": 68.9,
      "a": 27.97,
      "b": 40.44
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sunrise-blue",
    "name": "Sunrise Blue",
    "brand": "Vallejo",
    "hex": "#75C7FB",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 117,
      "g": 199,
      "b": 251
    },
    "lab": {
      "l": 77.03,
      "a": -10.84,
      "b": -33.24
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sunset-orange",
    "name": "Sunset Orange",
    "brand": "Vallejo",
    "hex": "#FB9E5A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 158,
      "b": 90
    },
    "lab": {
      "l": 73.35,
      "a": 28.61,
      "b": 49.28
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sunset-red",
    "name": "Sunset Red",
    "brand": "Vallejo",
    "hex": "#B71A4D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 183,
      "g": 26,
      "b": 77
    },
    "lab": {
      "l": 40.16,
      "a": 61.37,
      "b": 12.74
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-tan",
    "name": "Tan",
    "brand": "Vallejo",
    "hex": "#9C594C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 156,
      "g": 89,
      "b": 76
    },
    "lab": {
      "l": 45.27,
      "a": 26.13,
      "b": 19.49
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-tan-earth",
    "name": "Tan Earth",
    "brand": "Vallejo",
    "hex": "#9A705C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 154,
      "g": 112,
      "b": 92
    },
    "lab": {
      "l": 50.96,
      "a": 13.91,
      "b": 17.66
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-tinny-tin",
    "name": "Tinny Tin",
    "brand": "Vallejo",
    "hex": "#391E12",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 57,
      "g": 30,
      "b": 18
    },
    "lab": {
      "l": 14.64,
      "a": 11.74,
      "b": 13.67
    },
    "finish": "glossy",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-toxic-yellow",
    "name": "Toxic Yellow",
    "brand": "Vallejo",
    "hex": "#F2D878",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 242,
      "g": 216,
      "b": 120
    },
    "lab": {
      "l": 86.68,
      "a": -3.04,
      "b": 50.22
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-turquoise",
    "name": "Turquoise",
    "brand": "Vallejo",
    "hex": "#016A7F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 106,
      "b": 127
    },
    "lab": {
      "l": 40.97,
      "a": -17.7,
      "b": -18.93
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-turquoise",
    "name": "Turquoise",
    "brand": "Vallejo",
    "hex": "#005F77",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 95,
      "b": 119
    },
    "lab": {
      "l": 36.96,
      "a": -14.57,
      "b": -20.25
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-ultramarine-blue",
    "name": "Ultramarine Blue",
    "brand": "Vallejo",
    "hex": "#273E78",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 39,
      "g": 62,
      "b": 120
    },
    "lab": {
      "l": 27.39,
      "a": 11.5,
      "b": -35.89
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-uniform-green",
    "name": "Uniform Green",
    "brand": "Vallejo",
    "hex": "#375F1F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 55,
      "g": 95,
      "b": 31
    },
    "lab": {
      "l": 36.17,
      "a": -26.72,
      "b": 31.34
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-us-dark-green",
    "name": "US Dark Green",
    "brand": "Vallejo",
    "hex": "#434E36",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 67,
      "g": 78,
      "b": 54
    },
    "lab": {
      "l": 31.6,
      "a": -9.39,
      "b": 12.8
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-us-field-drab",
    "name": "US Field Drab",
    "brand": "Vallejo",
    "hex": "#806345",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 128,
      "g": 99,
      "b": 69
    },
    "lab": {
      "l": 44.15,
      "a": 7.51,
      "b": 21.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-us-olive-drab",
    "name": "US Olive Drab",
    "brand": "Vallejo",
    "hex": "#473D1E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 71,
      "g": 61,
      "b": 30
    },
    "lab": {
      "l": 26.07,
      "a": -0.44,
      "b": 20.56
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-verdigris",
    "name": "Verdigris",
    "brand": "Vallejo",
    "hex": "#A2E7E2",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 162,
      "g": 231,
      "b": 226
    },
    "lab": {
      "l": 87.15,
      "a": -22.49,
      "b": -4.48
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-vermilion",
    "name": "Vermilion",
    "brand": "Vallejo",
    "hex": "#E01621",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 224,
      "g": 22,
      "b": 33
    },
    "lab": {
      "l": 47.67,
      "a": 70.86,
      "b": 49.49
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-violet",
    "name": "Violet",
    "brand": "Vallejo",
    "hex": "#2C1D5B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 44,
      "g": 29,
      "b": 91
    },
    "lab": {
      "l": 16.35,
      "a": 24.74,
      "b": -34.87
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-violet",
    "name": "Violet",
    "brand": "Vallejo",
    "hex": "#2E1F5E",
    "type": "Shade",
    "category": "ink",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 46,
      "g": 31,
      "b": 94
    },
    "lab": {
      "l": 17.31,
      "a": 24.88,
      "b": -35.29
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-violet-grey",
    "name": "Violet Grey",
    "brand": "Vallejo",
    "hex": "#515556",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 81,
      "g": 85,
      "b": 86
    },
    "lab": {
      "l": 35.83,
      "a": -1.37,
      "b": -1.14
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-violet-red",
    "name": "Violet Red",
    "brand": "Vallejo",
    "hex": "#4D0B2B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 77,
      "g": 11,
      "b": 43
    },
    "lab": {
      "l": 15.45,
      "a": 32.63,
      "b": -2.47
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-warlord-purple",
    "name": "Warlord Purple",
    "brand": "Vallejo",
    "hex": "#8C1A4C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 140,
      "g": 26,
      "b": 76
    },
    "lab": {
      "l": 31.43,
      "a": 49.74,
      "b": -0.19
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-warm-grey",
    "name": "Warm Grey",
    "brand": "Vallejo",
    "hex": "#A38183",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 163,
      "g": 129,
      "b": 131
    },
    "lab": {
      "l": 57.2,
      "a": 13.38,
      "b": 3.91
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-white",
    "name": "White",
    "brand": "Vallejo",
    "hex": "#F2F5F4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 242,
      "g": 245,
      "b": 244
    },
    "lab": {
      "l": 96.29,
      "a": -1.17,
      "b": 0.13
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-white",
    "name": "White",
    "brand": "Vallejo",
    "hex": "#F6F8F6",
    "type": "Shade",
    "category": "ink",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 246,
      "g": 248,
      "b": 246
    },
    "lab": {
      "l": 97.38,
      "a": -1.01,
      "b": 0.73
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-metal-color-white-aluminium",
    "name": "White Aluminium",
    "brand": "Vallejo",
    "hex": "#CACACD",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 202,
      "g": 202,
      "b": 205
    },
    "lab": {
      "l": 81.4,
      "a": 0.55,
      "b": -1.49
    },
    "finish": "satin",
    "metallic": true,
    "transparency": 0.33333333333333337,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-white-grey",
    "name": "White Grey",
    "brand": "Vallejo",
    "hex": "#CDCDCD",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 205,
      "g": 205,
      "b": 205
    },
    "lab": {
      "l": 82.41,
      "a": 0,
      "b": 0
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-wolf-grey",
    "name": "Wolf Grey",
    "brand": "Vallejo",
    "hex": "#B8CAD9",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 184,
      "g": 202,
      "b": 217
    },
    "lab": {
      "l": 80.43,
      "a": -3.03,
      "b": -9.51
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-yellow",
    "name": "Yellow",
    "brand": "Vallejo",
    "hex": "#ED8F0A",
    "type": "Shade",
    "category": "ink",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 237,
      "g": 143,
      "b": 10
    },
    "lab": {
      "l": 67.78,
      "a": 28.01,
      "b": 71.89
    },
    "finish": "matte",
    "metallic": false,
    "transparency": 1,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-yellow-green",
    "name": "Yellow Green",
    "brand": "Vallejo",
    "hex": "#D3F42E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 211,
      "g": 244,
      "b": 46
    },
    "lab": {
      "l": 91.12,
      "a": -33.5,
      "b": 82.23
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0.6666666666666667,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-yellow-ochre",
    "name": "Yellow Ochre",
    "brand": "Vallejo",
    "hex": "#E3A444",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 227,
      "g": 164,
      "b": 68
    },
    "lab": {
      "l": 71.76,
      "a": 14.29,
      "b": 57.04
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-yellow-olive",
    "name": "Yellow Olive",
    "brand": "Vallejo",
    "hex": "#3E4430",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 62,
      "g": 68,
      "b": 48
    },
    "lab": {
      "l": 27.77,
      "a": -6.62,
      "b": 11.33
    },
    "finish": "flat",
    "metallic": false,
    "transparency": 0,
    "matchable": true,
    "aliases": []
  }
];

// Cached reference
let _paintDatabase: PaintData[] | null = null;

/**
 * Get the paint database (cached)
 */
export function getPaintDatabase(): PaintData[] {
  if (!_paintDatabase) {
    _paintDatabase = PAINT_DATABASE;
  }
  return _paintDatabase;
}

/**
 * Get paints by brand
 */
export function getPaintsByBrand(brand: string): PaintData[] {
  return getPaintDatabase().filter(
    (paint) => paint.brand.toLowerCase() === brand.toLowerCase()
  );
}

/**
 * Get paints by type
 */
export function getPaintsByType(type: string): PaintData[] {
  return getPaintDatabase().filter(
    (paint) => paint.type.toLowerCase() === type.toLowerCase()
  );
}

/**
 * Get paints by colour family
 */
export function getPaintsByFamily(family: string): PaintData[] {
  return getPaintDatabase().filter(
    (paint) => paint.family.toLowerCase() === family.toLowerCase()
  );
}

/**
 * Database statistics
 */
export const PAINT_DATABASE_STATS = {
  totalPaints: 1312,
  brands: ["AK","Army Painter","Citadel","Pro Acryl","Two Thin Coats","Vallejo"],
  types: ["Base","Shade"],
  families: ["Black","Blue","Bone","Bronze","Brown","Cyan","Gold","Green","Grey","Magenta","Orange","Pink","Purple","Red","Silver","White","Yellow"],
  generatedAt: '2026-07-03T10:05:37.961Z',
};
