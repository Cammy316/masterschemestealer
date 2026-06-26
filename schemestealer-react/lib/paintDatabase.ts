/**
 * Paint Database - Auto-generated
 *
 * Contains 1312 pre-computed paints with RGB and LAB values.
 * Generated from the master paints_groundtruth.json database.
 *
 * DO NOT EDIT MANUALLY - run `node scripts/generatePaintDatabase.js` to regenerate.
 *
 * Last generated: 2026-06-26T09:52:59.822Z
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
    "hex": "#37241D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 36,
      "b": 29
    },
    "lab": {
      "l": 16.32,
      "a": 7.95,
      "b": 8.3
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
    "hex": "#586F32",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 88,
      "g": 111,
      "b": 50
    },
    "lab": {
      "l": 43.76,
      "a": -19.33,
      "b": 30.87
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
    "hex": "#E3DDD7",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 227,
      "g": 221,
      "b": 215
    },
    "lab": {
      "l": 88.42,
      "a": 1,
      "b": 3.66
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
    "hex": "#CB3E2D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 203,
      "g": 62,
      "b": 45
    },
    "lab": {
      "l": 47.41,
      "a": 54.66,
      "b": 41.63
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
    "hex": "#31295E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 49,
      "g": 41,
      "b": 94
    },
    "lab": {
      "l": 20.23,
      "a": 18.89,
      "b": -30.57
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
    "hex": "#8E7AAE",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 142,
      "g": 122,
      "b": 174
    },
    "lab": {
      "l": 54.79,
      "a": 18.42,
      "b": -24.76
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
    "hex": "#2D3B41",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 45,
      "g": 59,
      "b": 65
    },
    "lab": {
      "l": 23.89,
      "a": -4.04,
      "b": -5.58
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
    "hex": "#00859E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 133,
      "b": 158
    },
    "lab": {
      "l": 50.97,
      "a": -21.15,
      "b": -21.92
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
    "hex": "#00647F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 100,
      "b": 127
    },
    "lab": {
      "l": 38.98,
      "a": -14.38,
      "b": -22.01
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
    "hex": "#242325",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 36,
      "g": 35,
      "b": 37
    },
    "lab": {
      "l": 13.89,
      "a": 0.96,
      "b": -1.17
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
    "hex": "#598CA3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 89,
      "g": 140,
      "b": 163
    },
    "lab": {
      "l": 55.61,
      "a": -10.73,
      "b": -17.5
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
    "hex": "#3D4246",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 61,
      "g": 66,
      "b": 70
    },
    "lab": {
      "l": 27.66,
      "a": -1.1,
      "b": -3.13
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
    "hex": "#EEAD87",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 238,
      "g": 173,
      "b": 135
    },
    "lab": {
      "l": 75.96,
      "a": 19.22,
      "b": 28.9
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
    "hex": "#713016",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 48,
      "b": 22
    },
    "lab": {
      "l": 28.6,
      "a": 27,
      "b": 29.67
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
    "hex": "#CFA667",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 207,
      "g": 166,
      "b": 103
    },
    "lab": {
      "l": 70.54,
      "a": 7.28,
      "b": 38.15
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
    "hex": "#CC8267",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 204,
      "g": 130,
      "b": 103
    },
    "lab": {
      "l": 61.47,
      "a": 25.61,
      "b": 26.47
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
    "hex": "#100F14",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 16,
      "g": 15,
      "b": 20
    },
    "lab": {
      "l": 4.54,
      "a": 1.36,
      "b": -2.64
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
    "hex": "#1D3923",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 29,
      "g": 57,
      "b": 35
    },
    "lab": {
      "l": 21.24,
      "a": -16.46,
      "b": 10.5
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
    "family": "Black",
    "colorFamily": "black",
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
    "hex": "#4D1B1A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 77,
      "g": 27,
      "b": 26
    },
    "lab": {
      "l": 17.63,
      "a": 23.57,
      "b": 12.8
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
    "hex": "#CF0E12",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 207,
      "g": 14,
      "b": 18
    },
    "lab": {
      "l": 43.69,
      "a": 67.28,
      "b": 51.66
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
    "hex": "#008EA0",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 142,
      "b": 160
    },
    "lab": {
      "l": 53.9,
      "a": -25.13,
      "b": -18.58
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
    "hex": "#96AAAB",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 150,
      "g": 170,
      "b": 171
    },
    "lab": {
      "l": 68.15,
      "a": -6.73,
      "b": -2.87
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
    "hex": "#8463C4",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 132,
      "g": 99,
      "b": 196
    },
    "lab": {
      "l": 49.27,
      "a": 34.42,
      "b": -46.16
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
    "hex": "#A23A4F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 162,
      "g": 58,
      "b": 79
    },
    "lab": {
      "l": 40.04,
      "a": 44.66,
      "b": 10.7
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
    "hex": "#AE7928",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 174,
      "g": 121,
      "b": 40
    },
    "lab": {
      "l": 54.9,
      "a": 13.39,
      "b": 50.07
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
    "hex": "#8F0B1A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 143,
      "g": 11,
      "b": 26
    },
    "lab": {
      "l": 29.8,
      "a": 50.85,
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
    "hex": "#765427",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 118,
      "g": 84,
      "b": 39
    },
    "lab": {
      "l": 38.45,
      "a": 9.05,
      "b": 31.29
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
    "hex": "#715414",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 113,
      "g": 84,
      "b": 20
    },
    "lab": {
      "l": 37.67,
      "a": 5.56,
      "b": 39.4
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
    "hex": "#BE7066",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 190,
      "g": 112,
      "b": 102
    },
    "lab": {
      "l": 55.58,
      "a": 29.72,
      "b": 18.87
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
    "hex": "#69642D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 105,
      "g": 100,
      "b": 45
    },
    "lab": {
      "l": 41.7,
      "a": -6.11,
      "b": 31.45
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
    "hex": "#CCA773",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 204,
      "g": 167,
      "b": 115
    },
    "lab": {
      "l": 70.67,
      "a": 6.69,
      "b": 31.96
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
    "hex": "#CB3B34",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 203,
      "g": 59,
      "b": 52
    },
    "lab": {
      "l": 47.07,
      "a": 56.06,
      "b": 37.42
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
    "hex": "#671C17",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 103,
      "g": 28,
      "b": 23
    },
    "lab": {
      "l": 22.92,
      "a": 33.13,
      "b": 22.41
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
    "hex": "#3D2A1B",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 61,
      "g": 42,
      "b": 27
    },
    "lab": {
      "l": 18.92,
      "a": 6.63,
      "b": 13.26
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
    "hex": "#E74619",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 231,
      "g": 70,
      "b": 25
    },
    "lab": {
      "l": 53.43,
      "a": 60.21,
      "b": 58
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
    "hex": "#5F5A38",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 95,
      "g": 90,
      "b": 56
    },
    "lab": {
      "l": 37.9,
      "a": -3.67,
      "b": 20.37
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
    "hex": "#B00020",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 176,
      "g": 0,
      "b": 32
    },
    "lab": {
      "l": 36.63,
      "a": 61.18,
      "b": 36.16
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
    "hex": "#083158",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 8,
      "g": 49,
      "b": 88
    },
    "lab": {
      "l": 19.85,
      "a": 2.76,
      "b": -27.34
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
    "hex": "#464B35",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 70,
      "g": 75,
      "b": 53
    },
    "lab": {
      "l": 30.86,
      "a": -6.44,
      "b": 12.47
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
    "hex": "#AC551C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 172,
      "g": 85,
      "b": 28
    },
    "lab": {
      "l": 46.12,
      "a": 31.98,
      "b": 46.8
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
    "hex": "#AD7152",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 173,
      "g": 113,
      "b": 82
    },
    "lab": {
      "l": 53.28,
      "a": 20.28,
      "b": 26.89
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
    "hex": "#09276A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 9,
      "g": 39,
      "b": 106
    },
    "lab": {
      "l": 18.14,
      "a": 18.22,
      "b": -41.95
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
    "hex": "#5C767A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 92,
      "g": 118,
      "b": 122
    },
    "lab": {
      "l": 47.8,
      "a": -8.42,
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
    "hex": "#5A402C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 90,
      "g": 64,
      "b": 44
    },
    "lab": {
      "l": 29.47,
      "a": 8.53,
      "b": 16.66
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
    "hex": "#D18F3E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 209,
      "g": 143,
      "b": 62
    },
    "lab": {
      "l": 64.6,
      "a": 17.61,
      "b": 51.58
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
    "hex": "#03552C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 3,
      "g": 85,
      "b": 44
    },
    "lab": {
      "l": 31.11,
      "a": -32.98,
      "b": 17.76
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
    "hex": "#475B52",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 71,
      "g": 91,
      "b": 82
    },
    "lab": {
      "l": 36.8,
      "a": -9.73,
      "b": 2.68
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
    "hex": "#3F484E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 63,
      "g": 72,
      "b": 78
    },
    "lab": {
      "l": 30.01,
      "a": -2.14,
      "b": -4.81
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
    "hex": "#04244E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 4,
      "g": 36,
      "b": 78
    },
    "lab": {
      "l": 14.61,
      "a": 7.37,
      "b": -29.04
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
    "hex": "#734134",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 115,
      "g": 65,
      "b": 52
    },
    "lab": {
      "l": 33.3,
      "a": 20.22,
      "b": 17.28
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
    "family": "Orange",
    "colorFamily": "orange",
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
    "hex": "#1E323A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 30,
      "g": 50,
      "b": 58
    },
    "lab": {
      "l": 19.48,
      "a": -5.46,
      "b": -7.59
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
    "hex": "#302A2A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 42,
      "b": 42
    },
    "lab": {
      "l": 17.7,
      "a": 2.75,
      "b": 1
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
    "hex": "#F53C57",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 245,
      "g": 60,
      "b": 87
    },
    "lab": {
      "l": 55.42,
      "a": 69.94,
      "b": 28.98
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
    "hex": "#938D81",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 147,
      "g": 141,
      "b": 129
    },
    "lab": {
      "l": 58.82,
      "a": 0.05,
      "b": 7.19
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
    "hex": "#AC8B65",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 172,
      "g": 139,
      "b": 101
    },
    "lab": {
      "l": 60.05,
      "a": 7.24,
      "b": 25.05
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
    "hex": "#07439A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 7,
      "g": 67,
      "b": 154
    },
    "lab": {
      "l": 30.38,
      "a": 18.53,
      "b": -52.15
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
    "hex": "#9C482D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 156,
      "g": 72,
      "b": 45
    },
    "lab": {
      "l": 41.05,
      "a": 33.05,
      "b": 32.38
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
    "hex": "#00873E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 135,
      "b": 62
    },
    "lab": {
      "l": 49.1,
      "a": -48.29,
      "b": 30.38
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
    "hex": "#F94E1B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 249,
      "g": 78,
      "b": 27
    },
    "lab": {
      "l": 57.73,
      "a": 63.03,
      "b": 61.86
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
    "hex": "#88267B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 136,
      "g": 38,
      "b": 123
    },
    "lab": {
      "l": 34.09,
      "a": 50.78,
      "b": -26.43
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
    "hex": "#DB151E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 219,
      "g": 21,
      "b": 30
    },
    "lab": {
      "l": 46.57,
      "a": 69.66,
      "b": 49.61
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
    "hex": "#4DB8F7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 77,
      "g": 184,
      "b": 247
    },
    "lab": {
      "l": 71.26,
      "a": -11.1,
      "b": -40.15
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
    "hex": "#8C46AD",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 140,
      "g": 70,
      "b": 173
    },
    "lab": {
      "l": 42.72,
      "a": 46.96,
      "b": -43.12
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
    "hex": "#F6C000",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 246,
      "g": 192,
      "b": 0
    },
    "lab": {
      "l": 80.35,
      "a": 6.02,
      "b": 82.12
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
    "hex": "#8E0924",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 142,
      "g": 9,
      "b": 36
    },
    "lab": {
      "l": 29.6,
      "a": 51.26,
      "b": 23.89
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
    "hex": "#CE961D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 206,
      "g": 150,
      "b": 29
    },
    "lab": {
      "l": 65.77,
      "a": 11.26,
      "b": 64.89
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
    "hex": "#2E141E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 46,
      "g": 20,
      "b": 30
    },
    "lab": {
      "l": 10.37,
      "a": 14.77,
      "b": -1.05
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
    "hex": "#179CF3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 23,
      "g": 156,
      "b": 243
    },
    "lab": {
      "l": 62.02,
      "a": -1.97,
      "b": -52.59
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
    "hex": "#00806C",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 128,
      "b": 108
    },
    "lab": {
      "l": 47.65,
      "a": -35.01,
      "b": 2.42
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
    "hex": "#017463",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 116,
      "b": 99
    },
    "lab": {
      "l": 43.36,
      "a": -32.17,
      "b": 1.54
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
    "hex": "#5B626A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 91,
      "g": 98,
      "b": 106
    },
    "lab": {
      "l": 41.22,
      "a": -0.89,
      "b": -5.45
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
    "hex": "#343C31",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 52,
      "g": 60,
      "b": 49
    },
    "lab": {
      "l": 24.27,
      "a": -5.87,
      "b": 5.69
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
    "hex": "#6D896B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 109,
      "g": 137,
      "b": 107
    },
    "lab": {
      "l": 54.24,
      "a": -16.14,
      "b": 12.89
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
    "hex": "#9C1A19",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 156,
      "g": 26,
      "b": 25
    },
    "lab": {
      "l": 33.73,
      "a": 51.31,
      "b": 35.86
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
    "hex": "#566472",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 86,
      "g": 100,
      "b": 114
    },
    "lab": {
      "l": 41.7,
      "a": -1.9,
      "b": -9.65
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
    "hex": "#95AC25",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 149,
      "g": 172,
      "b": 37
    },
    "lab": {
      "l": 66.54,
      "a": -25.16,
      "b": 61.23
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
    "hex": "#2B2E34",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 43,
      "g": 46,
      "b": 52
    },
    "lab": {
      "l": 18.87,
      "a": 0.23,
      "b": -4.29
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
    "hex": "#C18530",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 193,
      "g": 133,
      "b": 48
    },
    "lab": {
      "l": 60.18,
      "a": 15.48,
      "b": 52.65
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
    "hex": "#B98027",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 185,
      "g": 128,
      "b": 39
    },
    "lab": {
      "l": 57.94,
      "a": 14.35,
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
    "hex": "#788230",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 120,
      "g": 130,
      "b": 48
    },
    "lab": {
      "l": 52.03,
      "a": -15.66,
      "b": 41.9
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
    "hex": "#FBB35B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 179,
      "b": 91
    },
    "lab": {
      "l": 78.17,
      "a": 17.67,
      "b": 54.3
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
    "hex": "#636564",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 99,
      "g": 101,
      "b": 100
    },
    "lab": {
      "l": 42.58,
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
    "hex": "#5B9324",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 91,
      "g": 147,
      "b": 36
    },
    "lab": {
      "l": 55.3,
      "a": -36.71,
      "b": 49.64
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
    "hex": "#CDC7AC",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 205,
      "g": 199,
      "b": 172
    },
    "lab": {
      "l": 80.07,
      "a": -2.43,
      "b": 14.28
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
    "hex": "#A87F4A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 168,
      "g": 127,
      "b": 74
    },
    "lab": {
      "l": 56.09,
      "a": 9.53,
      "b": 34.68
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
    "hex": "#9BBA8B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 155,
      "g": 186,
      "b": 139
    },
    "lab": {
      "l": 72.19,
      "a": -19.27,
      "b": 20.46
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
    "hex": "#81653A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 129,
      "g": 101,
      "b": 58
    },
    "lab": {
      "l": 44.63,
      "a": 5.64,
      "b": 28.45
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
    "hex": "#D9E9CC",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 217,
      "g": 233,
      "b": 204
    },
    "lab": {
      "l": 90.5,
      "a": -10.44,
      "b": 12.3
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
    "hex": "#015E32",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 1,
      "g": 94,
      "b": 50
    },
    "lab": {
      "l": 34.48,
      "a": -35.5,
      "b": 18.58
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
    "hex": "#7790B1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 119,
      "g": 144,
      "b": 177
    },
    "lab": {
      "l": 59.01,
      "a": -0.79,
      "b": -20.15
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
    "hex": "#66584A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 102,
      "g": 88,
      "b": 74
    },
    "lab": {
      "l": 38.37,
      "a": 3.28,
      "b": 10.23
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
    "hex": "#707362",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 112,
      "g": 115,
      "b": 98
    },
    "lab": {
      "l": 47.74,
      "a": -4.42,
      "b": 9.03
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
    "hex": "#292422",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 41,
      "g": 36,
      "b": 34
    },
    "lab": {
      "l": 14.67,
      "a": 1.9,
      "b": 2.19
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
    "hex": "#C1B197",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 193,
      "g": 177,
      "b": 151
    },
    "lab": {
      "l": 72.9,
      "a": 1.53,
      "b": 15.4
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
    "hex": "#464851",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 70,
      "g": 72,
      "b": 81
    },
    "lab": {
      "l": 30.71,
      "a": 1.3,
      "b": -5.63
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
    "hex": "#3E5843",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 62,
      "g": 88,
      "b": 67
    },
    "lab": {
      "l": 34.82,
      "a": -14.69,
      "b": 9.09
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
    "hex": "#4F2821",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 79,
      "g": 40,
      "b": 33
    },
    "lab": {
      "l": 21.17,
      "a": 17.36,
      "b": 12.68
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
    "hex": "#F3DAA2",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 243,
      "g": 218,
      "b": 162
    },
    "lab": {
      "l": 87.88,
      "a": 0.66,
      "b": 30.76
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
    "hex": "#0D0272",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 13,
      "g": 2,
      "b": 114
    },
    "lab": {
      "l": 11.58,
      "a": 42.99,
      "b": -58.01
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
    "hex": "#D561B5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 213,
      "g": 97,
      "b": 181
    },
    "lab": {
      "l": 58.07,
      "a": 55.6,
      "b": -23.04
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
    "hex": "#C1AB37",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 193,
      "g": 171,
      "b": 55
    },
    "lab": {
      "l": 69.99,
      "a": -4.77,
      "b": 59.51
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
    "hex": "#71808B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 113,
      "g": 128,
      "b": 139
    },
    "lab": {
      "l": 52.74,
      "a": -2.99,
      "b": -7.79
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
    "hex": "#567D48",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 86,
      "g": 125,
      "b": 72
    },
    "lab": {
      "l": 48.4,
      "a": -24.41,
      "b": 24.62
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
    "hex": "#E9E2C6",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 233,
      "g": 226,
      "b": 198
    },
    "lab": {
      "l": 89.76,
      "a": -2.22,
      "b": 14.55
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
    "hex": "#9A7617",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 154,
      "g": 118,
      "b": 23
    },
    "lab": {
      "l": 51.71,
      "a": 5.34,
      "b": 52.56
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
    "family": "Magenta",
    "colorFamily": "magenta",
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
    "hex": "#7B0038",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 123,
      "g": 0,
      "b": 56
    },
    "lab": {
      "l": 25.25,
      "a": 49.09,
      "b": 3.87
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
    "hex": "#E2E32F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 226,
      "g": 227,
      "b": 47
    },
    "lab": {
      "l": 87.64,
      "a": -19.35,
      "b": 79.38
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
    "hex": "#343D44",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 52,
      "g": 61,
      "b": 68
    },
    "lab": {
      "l": 25.21,
      "a": -1.89,
      "b": -5.54
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
    "hex": "#58413B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 88,
      "g": 65,
      "b": 59
    },
    "lab": {
      "l": 29.84,
      "a": 9,
      "b": 7.54
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
    "hex": "#FBE829",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 251,
      "g": 232,
      "b": 41
    },
    "lab": {
      "l": 90.96,
      "a": -11.55,
      "b": 84.45
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
    "hex": "#BD7344",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 189,
      "g": 115,
      "b": 68
    },
    "lab": {
      "l": 55.58,
      "a": 24.78,
      "b": 37.87
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
    "hex": "#BC9A75",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 188,
      "g": 154,
      "b": 117
    },
    "lab": {
      "l": 65.82,
      "a": 7.44,
      "b": 24.19
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
    "hex": "#21A03C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 33,
      "g": 160,
      "b": 60
    },
    "lab": {
      "l": 57.84,
      "a": -54.12,
      "b": 41.78
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
    "hex": "#FC7733",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 252,
      "g": 119,
      "b": 51
    },
    "lab": {
      "l": 65.07,
      "a": 46.91,
      "b": 58.8
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
    "hex": "#14375A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 20,
      "g": 55,
      "b": 90
    },
    "lab": {
      "l": 22.37,
      "a": 0.95,
      "b": -24.63
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
    "hex": "#EC6627",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 236,
      "g": 102,
      "b": 39
    },
    "lab": {
      "l": 59.42,
      "a": 48.7,
      "b": 57.79
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
    "hex": "#7A8EC9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 122,
      "g": 142,
      "b": 201
    },
    "lab": {
      "l": 59.62,
      "a": 7.7,
      "b": -32.78
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
    "hex": "#81951C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 129,
      "g": 149,
      "b": 28
    },
    "lab": {
      "l": 58.27,
      "a": -22.68,
      "b": 55.91
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
    "hex": "#026D47",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 109,
      "b": 71
    },
    "lab": {
      "l": 40.25,
      "a": -36.64,
      "b": 13.88
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
    "hex": "#F4C39C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 244,
      "g": 195,
      "b": 156
    },
    "lab": {
      "l": 82.2,
      "a": 12.28,
      "b": 26.25
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
    "hex": "#D5DC46",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 213,
      "g": 220,
      "b": 70
    },
    "lab": {
      "l": 84.88,
      "a": -20.36,
      "b": 69.2
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
    "hex": "#F46200",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 244,
      "g": 98,
      "b": 0
    },
    "lab": {
      "l": 59.87,
      "a": 52.86,
      "b": 69.05
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
    "hex": "#930A4C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 147,
      "g": 10,
      "b": 76
    },
    "lab": {
      "l": 31.68,
      "a": 55.02,
      "b": 0.34
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
    "hex": "#773C31",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 119,
      "g": 60,
      "b": 49
    },
    "lab": {
      "l": 32.65,
      "a": 24.59,
      "b": 18.44
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
    "hex": "#AD1D0B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 173,
      "g": 29,
      "b": 11
    },
    "lab": {
      "l": 37.46,
      "a": 55.28,
      "b": 46.79
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
    "hex": "#045A89",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 4,
      "g": 90,
      "b": 137
    },
    "lab": {
      "l": 36.26,
      "a": -4.14,
      "b": -32.36
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
    "hex": "#BC7A39",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 188,
      "g": 122,
      "b": 57
    },
    "lab": {
      "l": 56.99,
      "a": 19.83,
      "b": 45.04
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
    "hex": "#ABB0B3",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 171,
      "g": 176,
      "b": 179
    },
    "lab": {
      "l": 71.53,
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
    "hex": "#476234",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 71,
      "g": 98,
      "b": 52
    },
    "lab": {
      "l": 38.42,
      "a": -19.27,
      "b": 22.97
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
    "hex": "#F74D21",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 247,
      "g": 77,
      "b": 33
    },
    "lab": {
      "l": 57.27,
      "a": 62.87,
      "b": 59.14
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
    "hex": "#AF7E3C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 175,
      "g": 126,
      "b": 60
    },
    "lab": {
      "l": 56.45,
      "a": 12.11,
      "b": 42.53
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
    "hex": "#888B7A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 136,
      "g": 139,
      "b": 122
    },
    "lab": {
      "l": 57.18,
      "a": -4.3,
      "b": 8.72
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
    "hex": "#41A4C8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 65,
      "g": 164,
      "b": 200
    },
    "lab": {
      "l": 63.21,
      "a": -17.37,
      "b": -26.86
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
    "hex": "#72AC84",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 114,
      "g": 172,
      "b": 132
    },
    "lab": {
      "l": 65.55,
      "a": -27.54,
      "b": 14.69
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
    "hex": "#8C7139",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 140,
      "g": 113,
      "b": 57
    },
    "lab": {
      "l": 49.11,
      "a": 3.59,
      "b": 34.64
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
    "hex": "#13A37D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 19,
      "g": 163,
      "b": 125
    },
    "lab": {
      "l": 59.72,
      "a": -44.3,
      "b": 9.96
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
    "hex": "#694934",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 105,
      "g": 73,
      "b": 52
    },
    "lab": {
      "l": 34.02,
      "a": 10.84,
      "b": 17.97
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
    "hex": "#8D8D90",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 141,
      "g": 141,
      "b": 144
    },
    "lab": {
      "l": 58.72,
      "a": 0.59,
      "b": -1.59
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
    "hex": "#4B5056",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 75,
      "g": 80,
      "b": 86
    },
    "lab": {
      "l": 33.78,
      "a": -0.61,
      "b": -4.21
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
    "hex": "#194A58",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 25,
      "g": 74,
      "b": 88
    },
    "lab": {
      "l": 28.92,
      "a": -11.29,
      "b": -13.11
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
    "hex": "#E5A26F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 229,
      "g": 162,
      "b": 111
    },
    "lab": {
      "l": 71.99,
      "a": 19.18,
      "b": 36.29
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
    "hex": "#D0993E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 208,
      "g": 153,
      "b": 62
    },
    "lab": {
      "l": 66.93,
      "a": 11.76,
      "b": 53.99
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
    "hex": "#716F6C",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 113,
      "g": 111,
      "b": 108
    },
    "lab": {
      "l": 46.93,
      "a": 0.17,
      "b": 1.94
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
    "hex": "#9C7215",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 156,
      "g": 114,
      "b": 21
    },
    "lab": {
      "l": 50.87,
      "a": 8.48,
      "b": 52.56
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
    "hex": "#DE7E8C",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 222,
      "g": 126,
      "b": 140
    },
    "lab": {
      "l": 63.63,
      "a": 38.57,
      "b": 8.88
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
    "hex": "#5F6A28",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 95,
      "g": 106,
      "b": 40
    },
    "lab": {
      "l": 42.6,
      "a": -14.56,
      "b": 34.8
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
    "family": "Blue",
    "colorFamily": "blue",
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
    "hex": "#ABC8C4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 171,
      "g": 200,
      "b": 196
    },
    "lab": {
      "l": 78.43,
      "a": -10.5,
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
    "hex": "#A2A7AD",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 162,
      "g": 167,
      "b": 173
    },
    "lab": {
      "l": 68.27,
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
    "family": "Bone",
    "colorFamily": "bone",
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
    "hex": "#F3D179",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 209,
      "b": 121
    },
    "lab": {
      "l": 85.02,
      "a": 1.03,
      "b": 47.74
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
    "hex": "#AEE1E5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 174,
      "g": 225,
      "b": 229
    },
    "lab": {
      "l": 86.26,
      "a": -15.41,
      "b": -7.31
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
    "hex": "#A7ECDC",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 167,
      "g": 236,
      "b": 220
    },
    "lab": {
      "l": 88.62,
      "a": -24.82,
      "b": 0.86
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
    "hex": "#FB9C5D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 156,
      "b": 93
    },
    "lab": {
      "l": 72.95,
      "a": 29.84,
      "b": 47.31
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
    "hex": "#E0B7C3",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 224,
      "g": 183,
      "b": 195
    },
    "lab": {
      "l": 78.26,
      "a": 16.64,
      "b": -0.48
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
    "hex": "#D1BBE2",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 209,
      "g": 187,
      "b": 226
    },
    "lab": {
      "l": 78.8,
      "a": 14.95,
      "b": -16.59
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
    "hex": "#F6DE98",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 246,
      "g": 222,
      "b": 152
    },
    "lab": {
      "l": 88.97,
      "a": -1.37,
      "b": 37.36
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
    "hex": "#EAE2DA",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 234,
      "g": 226,
      "b": 218
    },
    "lab": {
      "l": 90.3,
      "a": 1.34,
      "b": 4.87
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
    "hex": "#D0C22A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 208,
      "g": 194,
      "b": 42
    },
    "lab": {
      "l": 77.38,
      "a": -10.71,
      "b": 71.21
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
    "hex": "#6C3868",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 108,
      "g": 56,
      "b": 104
    },
    "lab": {
      "l": 31.84,
      "a": 30.58,
      "b": -18.25
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
    "hex": "#BDA750",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 189,
      "g": 167,
      "b": 80
    },
    "lab": {
      "l": 68.78,
      "a": -2.81,
      "b": 47.15
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
    "hex": "#D89860",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 216,
      "g": 152,
      "b": 96
    },
    "lab": {
      "l": 67.95,
      "a": 17.96,
      "b": 38.79
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
    "hex": "#FCCD0E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 252,
      "g": 205,
      "b": 14
    },
    "lab": {
      "l": 84.17,
      "a": 2,
      "b": 83.77
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
    "hex": "#7B6967",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 123,
      "g": 105,
      "b": 103
    },
    "lab": {
      "l": 46.03,
      "a": 6.77,
      "b": 3.76
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
    "hex": "#4B2814",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 75,
      "g": 40,
      "b": 20
    },
    "lab": {
      "l": 20.3,
      "a": 14.31,
      "b": 19.97
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
    "hex": "#5C5F34",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 92,
      "g": 95,
      "b": 52
    },
    "lab": {
      "l": 39.08,
      "a": -8.48,
      "b": 24.15
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
    "hex": "#7A736B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 122,
      "g": 115,
      "b": 107
    },
    "lab": {
      "l": 48.84,
      "a": 1.2,
      "b": 5.39
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
    "hex": "#171518",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 23,
      "g": 21,
      "b": 24
    },
    "lab": {
      "l": 7.09,
      "a": 1.67,
      "b": -1.71
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
    "hex": "#C72F54",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 199,
      "g": 47,
      "b": 84
    },
    "lab": {
      "l": 45.39,
      "a": 60.7,
      "b": 16
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
    "hex": "#3B432B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 59,
      "g": 67,
      "b": 43
    },
    "lab": {
      "l": 27.07,
      "a": -8.22,
      "b": 13.52
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
    "hex": "#B86E1F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 184,
      "g": 110,
      "b": 31
    },
    "lab": {
      "l": 53.43,
      "a": 23.6,
      "b": 52.74
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
    "hex": "#61471A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 97,
      "g": 71,
      "b": 26
    },
    "lab": {
      "l": 32.09,
      "a": 5.95,
      "b": 30.46
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
    "hex": "#80483C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 128,
      "g": 72,
      "b": 60
    },
    "lab": {
      "l": 37.02,
      "a": 22.53,
      "b": 17.56
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
    "hex": "#B48024",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 180,
      "g": 128,
      "b": 36
    },
    "lab": {
      "l": 57.34,
      "a": 12.01,
      "b": 54.2
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
    "hex": "#E78B7F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 231,
      "g": 139,
      "b": 127
    },
    "lab": {
      "l": 67.27,
      "a": 33.7,
      "b": 21.44
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
    "hex": "#E2B853",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 226,
      "g": 184,
      "b": 83
    },
    "lab": {
      "l": 76.73,
      "a": 4.13,
      "b": 55.66
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
    "hex": "#DC241E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 220,
      "g": 36,
      "b": 30
    },
    "lab": {
      "l": 47.72,
      "a": 67.22,
      "b": 50.64
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
    "hex": "#DB999F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 219,
      "g": 153,
      "b": 159
    },
    "lab": {
      "l": 69.72,
      "a": 25.54,
      "b": 6.84
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
    "hex": "#BAB5B2",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 186,
      "g": 181,
      "b": 178
    },
    "lab": {
      "l": 74,
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
    "hex": "#77C6F5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 119,
      "g": 198,
      "b": 245
    },
    "lab": {
      "l": 76.62,
      "a": -11.61,
      "b": -30.66
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
    "hex": "#4EBD05",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 78,
      "g": 189,
      "b": 5
    },
    "lab": {
      "l": 68.04,
      "a": -58.22,
      "b": 67.31
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
    "hex": "#121315",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 18,
      "g": 19,
      "b": 21
    },
    "lab": {
      "l": 5.86,
      "a": 0.05,
      "b": -1.37
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
    "hex": "#BAD9ED",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 186,
      "g": 217,
      "b": 237
    },
    "lab": {
      "l": 85.09,
      "a": -5.98,
      "b": -13.2
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
    "hex": "#ABC1D8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 171,
      "g": 193,
      "b": 216
    },
    "lab": {
      "l": 77.13,
      "a": -2.56,
      "b": -13.99
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
    "hex": "#00598F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 89,
      "b": 143
    },
    "lab": {
      "l": 36.23,
      "a": -1.27,
      "b": -36.06
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
    "hex": "#313846",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 49,
      "g": 56,
      "b": 70
    },
    "lab": {
      "l": 23.42,
      "a": 0.86,
      "b": -9.6
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
    "hex": "#BC3014",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 188,
      "g": 48,
      "b": 20
    },
    "lab": {
      "l": 42.55,
      "a": 54.27,
      "b": 48.27
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
    "hex": "#F69D60",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 246,
      "g": 157,
      "b": 96
    },
    "lab": {
      "l": 72.6,
      "a": 27.51,
      "b": 45.24
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
    "hex": "#876049",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 135,
      "g": 96,
      "b": 73
    },
    "lab": {
      "l": 44.23,
      "a": 12.83,
      "b": 19.41
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
    "hex": "#CA8F60",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 202,
      "g": 143,
      "b": 96
    },
    "lab": {
      "l": 64.2,
      "a": 17.05,
      "b": 33.78
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
    "hex": "#2C2626",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 44,
      "g": 38,
      "b": 38
    },
    "lab": {
      "l": 15.81,
      "a": 2.79,
      "b": 1.02
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
    "hex": "#00566B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 86,
      "b": 107
    },
    "lab": {
      "l": 33.38,
      "a": -14,
      "b": -18.33
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
    "hex": "#2541AF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 37,
      "g": 65,
      "b": 175
    },
    "lab": {
      "l": 32.41,
      "a": 30.4,
      "b": -61.43
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
    "hex": "#505231",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 80,
      "g": 82,
      "b": 49
    },
    "lab": {
      "l": 33.9,
      "a": -6.72,
      "b": 19.12
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
    "hex": "#C3AD89",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 195,
      "g": 173,
      "b": 137
    },
    "lab": {
      "l": 71.76,
      "a": 2.47,
      "b": 21.44
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
    "hex": "#C51625",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 197,
      "g": 22,
      "b": 37
    },
    "lab": {
      "l": 42.13,
      "a": 63.94,
      "b": 40.26
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
    "hex": "#50203C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 80,
      "g": 32,
      "b": 60
    },
    "lab": {
      "l": 20.3,
      "a": 26.27,
      "b": -7.17
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
    "hex": "#EB9504",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 235,
      "g": 149,
      "b": 4
    },
    "lab": {
      "l": 68.87,
      "a": 23.96,
      "b": 73.29
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
    "hex": "#A69B8F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 166,
      "g": 155,
      "b": 143
    },
    "lab": {
      "l": 64.59,
      "a": 1.92,
      "b": 7.74
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
    "hex": "#F1F7F5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 241,
      "g": 247,
      "b": 245
    },
    "lab": {
      "l": 96.74,
      "a": -2.34,
      "b": 0.27
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
    "hex": "#680723",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 104,
      "g": 7,
      "b": 35
    },
    "lab": {
      "l": 20.89,
      "a": 41.04,
      "b": 11.82
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
    "hex": "#FBBD11",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 251,
      "g": 189,
      "b": 17
    },
    "lab": {
      "l": 80.15,
      "a": 9.86,
      "b": 80.42
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
    "hex": "#715144",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 81,
      "b": 68
    },
    "lab": {
      "l": 37.51,
      "a": 11.52,
      "b": 12.93
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
    "hex": "#161518",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 22,
      "g": 21,
      "b": 24
    },
    "lab": {
      "l": 6.98,
      "a": 1.2,
      "b": -1.88
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
    "hex": "#F4F6F5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 244,
      "g": 246,
      "b": 245
    },
    "lab": {
      "l": 96.71,
      "a": -0.84,
      "b": 0.25
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
    "hex": "#A47A67",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 164,
      "g": 122,
      "b": 103
    },
    "lab": {
      "l": 54.86,
      "a": 13.73,
      "b": 16.79
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
    "hex": "#134B61",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 19,
      "g": 75,
      "b": 97
    },
    "lab": {
      "l": 29.5,
      "a": -9.49,
      "b": -18.01
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
    "hex": "#7BBCD1",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 123,
      "g": 188,
      "b": 209
    },
    "lab": {
      "l": 72.75,
      "a": -15.3,
      "b": -17.08
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
    "hex": "#DAD99C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 218,
      "g": 217,
      "b": 156
    },
    "lab": {
      "l": 85.47,
      "a": -9.1,
      "b": 30.27
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
    "hex": "#CE776C",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 206,
      "g": 119,
      "b": 108
    },
    "lab": {
      "l": 59.34,
      "a": 32.8,
      "b": 20.87
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
    "hex": "#646CB7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 100,
      "g": 108,
      "b": 183
    },
    "lab": {
      "l": 48.07,
      "a": 17.01,
      "b": -40.71
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
    "hex": "#C49F7F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 196,
      "g": 159,
      "b": 127
    },
    "lab": {
      "l": 68.07,
      "a": 9.16,
      "b": 21.88
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
    "hex": "#74DAC5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 116,
      "g": 218,
      "b": 197
    },
    "lab": {
      "l": 80.67,
      "a": -34.81,
      "b": 1.13
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
    "hex": "#CBB8A6",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 203,
      "g": 184,
      "b": 166
    },
    "lab": {
      "l": 75.9,
      "a": 3.83,
      "b": 11.6
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
    "hex": "#214940",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 33,
      "g": 73,
      "b": 64
    },
    "lab": {
      "l": 28,
      "a": -16.7,
      "b": 1.07
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
    "hex": "#E73D37",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 231,
      "g": 61,
      "b": 55
    },
    "lab": {
      "l": 52.52,
      "a": 64.13,
      "b": 43.18
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
    "hex": "#29BBA9",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 41,
      "g": 187,
      "b": 169
    },
    "lab": {
      "l": 68.66,
      "a": -40.99,
      "b": -1.53
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
    "hex": "#66BECA",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 102,
      "g": 190,
      "b": 202
    },
    "lab": {
      "l": 72.17,
      "a": -23.21,
      "b": -14.22
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
    "hex": "#47A4ED",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 71,
      "g": 164,
      "b": 237
    },
    "lab": {
      "l": 64.96,
      "a": -4.24,
      "b": -44.58
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
    "hex": "#59654D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 89,
      "g": 101,
      "b": 77
    },
    "lab": {
      "l": 41.16,
      "a": -9.47,
      "b": 12.1
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
    "hex": "#979FA2",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 151,
      "g": 159,
      "b": 162
    },
    "lab": {
      "l": 64.95,
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
    "hex": "#5C3B3A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 92,
      "g": 59,
      "b": 58
    },
    "lab": {
      "l": 28.67,
      "a": 14.44,
      "b": 6.61
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
    "hex": "#B5BFE7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 181,
      "g": 191,
      "b": 231
    },
    "lab": {
      "l": 77.79,
      "a": 4.96,
      "b": -21.03
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
    "hex": "#8CA698",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 140,
      "g": 166,
      "b": 152
    },
    "lab": {
      "l": 65.84,
      "a": -11.87,
      "b": 4.24
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
    "hex": "#34201E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 52,
      "g": 32,
      "b": 30
    },
    "lab": {
      "l": 14.72,
      "a": 9.38,
      "b": 5.31
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
    "hex": "#DA8F76",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 218,
      "g": 143,
      "b": 118
    },
    "lab": {
      "l": 66.41,
      "a": 25.63,
      "b": 25.01
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
    "hex": "#848FCB",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 132,
      "g": 143,
      "b": 203
    },
    "lab": {
      "l": 60.66,
      "a": 10.44,
      "b": -32.23
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
    "hex": "#D8B57A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 216,
      "g": 181,
      "b": 122
    },
    "lab": {
      "l": 75.48,
      "a": 4.83,
      "b": 34.73
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
    "hex": "#701D30",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 112,
      "g": 29,
      "b": 48
    },
    "lab": {
      "l": 25.38,
      "a": 37.59,
      "b": 9.18
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
    "hex": "#78111E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 120,
      "g": 17,
      "b": 30
    },
    "lab": {
      "l": 25.23,
      "a": 43.07,
      "b": 21.45
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
    "hex": "#4B1E25",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 75,
      "g": 30,
      "b": 37
    },
    "lab": {
      "l": 18.18,
      "a": 22.13,
      "b": 5.74
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
    "hex": "#1E312B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 30,
      "g": 49,
      "b": 43
    },
    "lab": {
      "l": 18.57,
      "a": -9.39,
      "b": 1.38
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
    "hex": "#CB3546",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 203,
      "g": 53,
      "b": 70
    },
    "lab": {
      "l": 46.56,
      "a": 59.05,
      "b": 26.25
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
    "hex": "#B50830",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 181,
      "g": 8,
      "b": 48
    },
    "lab": {
      "l": 38.22,
      "a": 62.07,
      "b": 28.53
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
    "hex": "#DEC7B4",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 222,
      "g": 199,
      "b": 180
    },
    "lab": {
      "l": 81.66,
      "a": 5.06,
      "b": 12.46
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
    "hex": "#442219",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 68,
      "g": 34,
      "b": 25
    },
    "lab": {
      "l": 17.66,
      "a": 15.2,
      "b": 13.21
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
    "hex": "#E6E6DA",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 230,
      "g": 230,
      "b": 218
    },
    "lab": {
      "l": 91,
      "a": -2.09,
      "b": 5.84
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
    "hex": "#677777",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 103,
      "g": 119,
      "b": 119
    },
    "lab": {
      "l": 48.77,
      "a": -5.9,
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
    "hex": "#D1D5DB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 209,
      "g": 213,
      "b": 219
    },
    "lab": {
      "l": 85.13,
      "a": -0.24,
      "b": -3.43
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
    "hex": "#4D4442",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 77,
      "g": 68,
      "b": 66
    },
    "lab": {
      "l": 29.68,
      "a": 3.42,
      "b": 2.6
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
    "hex": "#C58E2C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 197,
      "g": 142,
      "b": 44
    },
    "lab": {
      "l": 62.84,
      "a": 12.13,
      "b": 56.99
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
    "hex": "#89C4E4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 137,
      "g": 196,
      "b": 228
    },
    "lab": {
      "l": 76.31,
      "a": -10.95,
      "b": -21.9
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
    "hex": "#5C764C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 92,
      "g": 118,
      "b": 76
    },
    "lab": {
      "l": 46.65,
      "a": -17.85,
      "b": 20.15
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
    "hex": "#CD7F71",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 205,
      "g": 127,
      "b": 113
    },
    "lab": {
      "l": 61.09,
      "a": 28.63,
      "b": 20.37
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
    "hex": "#F4562B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 244,
      "g": 86,
      "b": 43
    },
    "lab": {
      "l": 58.1,
      "a": 58.62,
      "b": 55.42
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
    "hex": "#C39F5F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 195,
      "g": 159,
      "b": 95
    },
    "lab": {
      "l": 67.45,
      "a": 5.3,
      "b": 38.2
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
    "hex": "#702714",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 112,
      "g": 39,
      "b": 20
    },
    "lab": {
      "l": 26.58,
      "a": 31.24,
      "b": 28.67
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
    "hex": "#B5884F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 181,
      "g": 136,
      "b": 79
    },
    "lab": {
      "l": 59.89,
      "a": 10.56,
      "b": 36.97
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
    "hex": "#A5947B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 165,
      "g": 148,
      "b": 123
    },
    "lab": {
      "l": 62.18,
      "a": 2.26,
      "b": 15.54
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
    "hex": "#542C2D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 84,
      "g": 44,
      "b": 45
    },
    "lab": {
      "l": 23.26,
      "a": 18.52,
      "b": 7.51
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
    "hex": "#829BAF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 130,
      "g": 155,
      "b": 175
    },
    "lab": {
      "l": 62.75,
      "a": -4.12,
      "b": -13.29
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
    "hex": "#BD9885",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 189,
      "g": 152,
      "b": 133
    },
    "lab": {
      "l": 65.73,
      "a": 11,
      "b": 15.23
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
    "hex": "#B6BFC7",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 182,
      "g": 191,
      "b": 199
    },
    "lab": {
      "l": 76.88,
      "a": -1.53,
      "b": -5.09
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
    "hex": "#016FCD",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 111,
      "b": 205
    },
    "lab": {
      "l": 46.69,
      "a": 9.92,
      "b": -55.81
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
    "hex": "#86609E",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 134,
      "g": 96,
      "b": 158
    },
    "lab": {
      "l": 46.85,
      "a": 27.42,
      "b": -27.79
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
    "hex": "#F0B729",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 240,
      "g": 183,
      "b": 41
    },
    "lab": {
      "l": 77.61,
      "a": 8.75,
      "b": 72.89
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
    "hex": "#45331F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 69,
      "g": 51,
      "b": 31
    },
    "lab": {
      "l": 22.76,
      "a": 5.15,
      "b": 15.78
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
    "hex": "#313D35",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 49,
      "g": 61,
      "b": 53
    },
    "lab": {
      "l": 24.47,
      "a": -6.88,
      "b": 3.3
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
    "hex": "#626B50",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 98,
      "g": 107,
      "b": 80
    },
    "lab": {
      "l": 43.79,
      "a": -8.68,
      "b": 14.03
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
    "hex": "#2D2726",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 45,
      "g": 39,
      "b": 38
    },
    "lab": {
      "l": 16.25,
      "a": 2.56,
      "b": 1.68
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
    "hex": "#2B2218",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 43,
      "g": 34,
      "b": 24
    },
    "lab": {
      "l": 13.96,
      "a": 2.45,
      "b": 8.36
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
    "hex": "#2B4251",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 43,
      "g": 66,
      "b": 81
    },
    "lab": {
      "l": 26.75,
      "a": -4.32,
      "b": -11.83
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
    "hex": "#C57A3C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 197,
      "g": 122,
      "b": 60
    },
    "lab": {
      "l": 58.15,
      "a": 23.84,
      "b": 45.16
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
    "hex": "#967846",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 150,
      "g": 120,
      "b": 70
    },
    "lab": {
      "l": 52.24,
      "a": 5.22,
      "b": 31.69
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
    "hex": "#246C72",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 36,
      "g": 108,
      "b": 114
    },
    "lab": {
      "l": 41.71,
      "a": -19.8,
      "b": -9.88
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
    "hex": "#5D3163",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 93,
      "g": 49,
      "b": 99
    },
    "lab": {
      "l": 27.91,
      "a": 28.6,
      "b": -21.32
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
    "hex": "#E39ACB",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 227,
      "g": 154,
      "b": 203
    },
    "lab": {
      "l": 72.07,
      "a": 34.56,
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
    "hex": "#D7B8A4",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 215,
      "g": 184,
      "b": 164
    },
    "lab": {
      "l": 76.93,
      "a": 8.04,
      "b": 14.28
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
    "hex": "#A80C23",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 168,
      "g": 12,
      "b": 35
    },
    "lab": {
      "l": 35.42,
      "a": 57.75,
      "b": 32.6
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
    "hex": "#653E36",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 62,
      "b": 54
    },
    "lab": {
      "l": 30.59,
      "a": 16.05,
      "b": 12.05
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
    "hex": "#907E66",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 144,
      "g": 126,
      "b": 102
    },
    "lab": {
      "l": 53.83,
      "a": 3.02,
      "b": 15.62
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
    "hex": "#B46085",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 180,
      "g": 96,
      "b": 133
    },
    "lab": {
      "l": 51.57,
      "a": 38.4,
      "b": -5.26
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
    "hex": "#B6CD34",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 182,
      "g": 205,
      "b": 52
    },
    "lab": {
      "l": 78.38,
      "a": -26.74,
      "b": 68.33
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
    "hex": "#55B052",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 85,
      "g": 176,
      "b": 82
    },
    "lab": {
      "l": 64.64,
      "a": -46.29,
      "b": 39.62
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
    "hex": "#894E30",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 137,
      "g": 78,
      "b": 48
    },
    "lab": {
      "l": 39.55,
      "a": 21.92,
      "b": 28.2
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
    "hex": "#B54F95",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 181,
      "g": 79,
      "b": 149
    },
    "lab": {
      "l": 48.99,
      "a": 49.67,
      "b": -18.64
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
    "hex": "#3D8C53",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 61,
      "g": 140,
      "b": 83
    },
    "lab": {
      "l": 52.25,
      "a": -37.49,
      "b": 23.32
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
    "hex": "#3B5954",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 59,
      "g": 89,
      "b": 84
    },
    "lab": {
      "l": 35.43,
      "a": -12.33,
      "b": -0.66
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
    "hex": "#C07F72",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 192,
      "g": 127,
      "b": 114
    },
    "lab": {
      "l": 59.53,
      "a": 23.61,
      "b": 17.41
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
    "hex": "#DB9086",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 219,
      "g": 144,
      "b": 134
    },
    "lab": {
      "l": 67.07,
      "a": 27.21,
      "b": 17.04
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
    "hex": "#91CD96",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 145,
      "g": 205,
      "b": 150
    },
    "lab": {
      "l": 77.21,
      "a": -30.19,
      "b": 21.39
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
    "hex": "#DB9635",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 219,
      "g": 150,
      "b": 53
    },
    "lab": {
      "l": 67.38,
      "a": 17.69,
      "b": 58.65
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
    "hex": "#D9A8BD",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 217,
      "g": 168,
      "b": 189
    },
    "lab": {
      "l": 73.83,
      "a": 21.24,
      "b": -3.8
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
    "hex": "#EB752C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 235,
      "g": 117,
      "b": 44
    },
    "lab": {
      "l": 62.14,
      "a": 41.21,
      "b": 58.12
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
    "hex": "#CE93AD",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 206,
      "g": 147,
      "b": 173
    },
    "lab": {
      "l": 67.28,
      "a": 26.13,
      "b": -4.7
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
    "hex": "#9DBAA7",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 157,
      "g": 186,
      "b": 167
    },
    "lab": {
      "l": 72.94,
      "a": -13.62,
      "b": 6.35
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
    "hex": "#AAB5D0",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 170,
      "g": 181,
      "b": 208
    },
    "lab": {
      "l": 73.64,
      "a": 1.82,
      "b": -14.9
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
    "hex": "#015197",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 81,
      "b": 151
    },
    "lab": {
      "l": 34.24,
      "a": 7.38,
      "b": -44.08
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
    "hex": "#8A4A41",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 138,
      "g": 74,
      "b": 65
    },
    "lab": {
      "l": 39.04,
      "a": 26.08,
      "b": 17.42
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
    "hex": "#A29F8E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 162,
      "g": 159,
      "b": 142
    },
    "lab": {
      "l": 65.3,
      "a": -1.96,
      "b": 9.26
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
    "hex": "#A43A3C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 164,
      "g": 58,
      "b": 60
    },
    "lab": {
      "l": 39.99,
      "a": 43.85,
      "b": 22.54
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
    "hex": "#1E693D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 30,
      "g": 105,
      "b": 61
    },
    "lab": {
      "l": 39.1,
      "a": -33.77,
      "b": 18.29
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
    "hex": "#64B100",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 100,
      "g": 177,
      "b": 0
    },
    "lab": {
      "l": 65.08,
      "a": -47.33,
      "b": 65.93
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
    "hex": "#54985B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 84,
      "g": 152,
      "b": 91
    },
    "lab": {
      "l": 57.17,
      "a": -34.93,
      "b": 25.56
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
    "hex": "#F08C28",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 240,
      "g": 140,
      "b": 40
    },
    "lab": {
      "l": 67.61,
      "a": 31.34,
      "b": 64.69
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
    "hex": "#344079",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 52,
      "g": 64,
      "b": 121
    },
    "lab": {
      "l": 28.84,
      "a": 13.26,
      "b": -34.15
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
    "hex": "#AAA895",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 170,
      "g": 168,
      "b": 149
    },
    "lab": {
      "l": 68.55,
      "a": -2.66,
      "b": 10.08
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
    "hex": "#A9681D",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 169,
      "g": 104,
      "b": 29
    },
    "lab": {
      "l": 50.01,
      "a": 20.3,
      "b": 49.71
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
    "hex": "#186B3F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 24,
      "g": 107,
      "b": 63
    },
    "lab": {
      "l": 39.69,
      "a": -35.27,
      "b": 17.88
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
    "hex": "#68675C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 104,
      "g": 103,
      "b": 92
    },
    "lab": {
      "l": 43.38,
      "a": -1.76,
      "b": 6.35
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
    "hex": "#BBBB96",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 187,
      "b": 150
    },
    "lab": {
      "l": 75.02,
      "a": -6.21,
      "b": 18.8
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
    "hex": "#23503F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 35,
      "g": 80,
      "b": 63
    },
    "lab": {
      "l": 30.53,
      "a": -20.23,
      "b": 5.35
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
    "hex": "#211F23",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 33,
      "g": 31,
      "b": 35
    },
    "lab": {
      "l": 12.12,
      "a": 1.95,
      "b": -2.37
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
    "hex": "#F09C66",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 240,
      "g": 156,
      "b": 102
    },
    "lab": {
      "l": 71.74,
      "a": 26.06,
      "b": 40.95
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
    "hex": "#2D2625",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 45,
      "g": 38,
      "b": 37
    },
    "lab": {
      "l": 15.89,
      "a": 3.05,
      "b": 1.86
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
    "hex": "#AD8DC0",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 173,
      "g": 141,
      "b": 192
    },
    "lab": {
      "l": 63.13,
      "a": 21.6,
      "b": -21.96
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
    "hex": "#009CAA",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 156,
      "b": 170
    },
    "lab": {
      "l": 58.67,
      "a": -28.8,
      "b": -17.03
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
    "hex": "#F0DDA4",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 240,
      "g": 221,
      "b": 164
    },
    "lab": {
      "l": 88.41,
      "a": -1.77,
      "b": 30.4
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
    "hex": "#193C61",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 25,
      "g": 60,
      "b": 97
    },
    "lab": {
      "l": 24.64,
      "a": 1.21,
      "b": -25.59
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
    "hex": "#D74494",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 215,
      "g": 68,
      "b": 148
    },
    "lab": {
      "l": 52.65,
      "a": 63.99,
      "b": -12
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
    "hex": "#F9AA36",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 249,
      "g": 170,
      "b": 54
    },
    "lab": {
      "l": 75.55,
      "a": 19.78,
      "b": 67.23
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
    "hex": "#2C2B35",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 44,
      "g": 43,
      "b": 53
    },
    "lab": {
      "l": 18.01,
      "a": 2.99,
      "b": -6.26
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
    "family": "Bone",
    "colorFamily": "bone",
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
    "hex": "#CA7A76",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 202,
      "g": 122,
      "b": 118
    },
    "lab": {
      "l": 59.7,
      "a": 30.7,
      "b": 15.55
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
    "hex": "#F1DCFC",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 241,
      "g": 220,
      "b": 252
    },
    "lab": {
      "l": 90.28,
      "a": 12.86,
      "b": -12.92
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
    "hex": "#E96730",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 233,
      "g": 103,
      "b": 48
    },
    "lab": {
      "l": 59.2,
      "a": 47.39,
      "b": 53.54
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
    "hex": "#81C147",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 129,
      "g": 193,
      "b": 71
    },
    "lab": {
      "l": 71.73,
      "a": -40.54,
      "b": 53.37
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
    "hex": "#EC5549",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 236,
      "g": 85,
      "b": 73
    },
    "lab": {
      "l": 56.9,
      "a": 57.49,
      "b": 38.45
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
    "hex": "#E9B5B7",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 233,
      "g": 181,
      "b": 183
    },
    "lab": {
      "l": 78.34,
      "a": 19.1,
      "b": 6.24
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
    "hex": "#A58E70",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 165,
      "g": 142,
      "b": 112
    },
    "lab": {
      "l": 60.35,
      "a": 4.04,
      "b": 19.2
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
    "hex": "#4F5B54",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 79,
      "g": 91,
      "b": 84
    },
    "lab": {
      "l": 37.45,
      "a": -6.23,
      "b": 2.46
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
    "hex": "#5F2967",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 95,
      "g": 41,
      "b": 103
    },
    "lab": {
      "l": 26.73,
      "a": 34.58,
      "b": -25.75
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
    "hex": "#A6D9D4",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 166,
      "g": 217,
      "b": 212
    },
    "lab": {
      "l": 83.17,
      "a": -17.42,
      "b": -2.91
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
    "hex": "#617D6F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 97,
      "g": 125,
      "b": 111
    },
    "lab": {
      "l": 49.92,
      "a": -13.17,
      "b": 4.34
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
    "hex": "#6A532F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 106,
      "g": 83,
      "b": 47
    },
    "lab": {
      "l": 36.85,
      "a": 4.66,
      "b": 24.57
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
    "hex": "#4E5A4E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 78,
      "g": 90,
      "b": 78
    },
    "lab": {
      "l": 36.9,
      "a": -7.31,
      "b": 5.37
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
    "hex": "#3A3F32",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 58,
      "g": 63,
      "b": 50
    },
    "lab": {
      "l": 25.82,
      "a": -4.92,
      "b": 7.29
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
    "hex": "#B5B9BD",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 181,
      "g": 185,
      "b": 189
    },
    "lab": {
      "l": 74.95,
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
    "hex": "#8C6F61",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 140,
      "g": 111,
      "b": 97
    },
    "lab": {
      "l": 49.26,
      "a": 9.28,
      "b": 12.15
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
    "hex": "#743C49",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 116,
      "g": 60,
      "b": 73
    },
    "lab": {
      "l": 32.76,
      "a": 26.04,
      "b": 3.16
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
    "hex": "#EE4527",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 238,
      "g": 69,
      "b": 39
    },
    "lab": {
      "l": 54.64,
      "a": 63.07,
      "b": 53.74
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
    "hex": "#FFA614",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 255,
      "g": 166,
      "b": 20
    },
    "lab": {
      "l": 75.19,
      "a": 23.59,
      "b": 76.57
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
    "hex": "#B54F68",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 181,
      "g": 79,
      "b": 104
    },
    "lab": {
      "l": 47.52,
      "a": 43.78,
      "b": 6.26
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
    "hex": "#C56C61",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 197,
      "g": 108,
      "b": 97
    },
    "lab": {
      "l": 55.54,
      "a": 34.11,
      "b": 21.87
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
    "hex": "#9EB5A7",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 158,
      "g": 181,
      "b": 167
    },
    "lab": {
      "l": 71.63,
      "a": -10.66,
      "b": 4.47
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
    "hex": "#53301A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 83,
      "g": 48,
      "b": 26
    },
    "lab": {
      "l": 23.76,
      "a": 13.56,
      "b": 20.6
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
    "family": "Red",
    "colorFamily": "red",
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
    "hex": "#91D0D9",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 145,
      "g": 208,
      "b": 217
    },
    "lab": {
      "l": 79.69,
      "a": -17.77,
      "b": -10.86
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
    "hex": "#313D4D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 49,
      "g": 61,
      "b": 77
    },
    "lab": {
      "l": 25.34,
      "a": -0.38,
      "b": -11.32
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
    "hex": "#4A3531",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 74,
      "g": 53,
      "b": 49
    },
    "lab": {
      "l": 24.4,
      "a": 8.76,
      "b": 6.21
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
    "hex": "#4D4141",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 65,
      "b": 65
    },
    "lab": {
      "l": 28.75,
      "a": 5.15,
      "b": 1.91
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
    "hex": "#765B57",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 118,
      "g": 91,
      "b": 87
    },
    "lab": {
      "l": 41.25,
      "a": 10.4,
      "b": 6.55
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
    "hex": "#EDC2BC",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 237,
      "g": 194,
      "b": 188
    },
    "lab": {
      "l": 81.96,
      "a": 14.39,
      "b": 8.79
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
    "hex": "#E9D8C8",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 233,
      "g": 216,
      "b": 200
    },
    "lab": {
      "l": 87.29,
      "a": 3.24,
      "b": 9.99
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
    "hex": "#7E9282",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 126,
      "g": 146,
      "b": 130
    },
    "lab": {
      "l": 58.61,
      "a": -10.4,
      "b": 6.09
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
    "hex": "#F9DADC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 249,
      "g": 218,
      "b": 220
    },
    "lab": {
      "l": 89.6,
      "a": 11.03,
      "b": 2.97
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
    "hex": "#328CA7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 50,
      "g": 140,
      "b": 167
    },
    "lab": {
      "l": 54.26,
      "a": -17.51,
      "b": -21.99
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
    "hex": "#258E7F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 37,
      "g": 142,
      "b": 127
    },
    "lab": {
      "l": 53.24,
      "a": -32.75,
      "b": -0.46
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
    "hex": "#EBA3D2",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 235,
      "g": 163,
      "b": 210
    },
    "lab": {
      "l": 75.15,
      "a": 33.62,
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
    "hex": "#E367AD",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 227,
      "g": 103,
      "b": 173
    },
    "lab": {
      "l": 60.83,
      "a": 55.85,
      "b": -14.06
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
    "hex": "#5A6167",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 90,
      "g": 97,
      "b": 103
    },
    "lab": {
      "l": 40.74,
      "a": -1.35,
      "b": -4.34
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
    "hex": "#D4031D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 212,
      "g": 3,
      "b": 29
    },
    "lab": {
      "l": 44.46,
      "a": 69.75,
      "b": 47.76
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
    "hex": "#DAC6B7",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 218,
      "g": 198,
      "b": 183
    },
    "lab": {
      "l": 81.13,
      "a": 4.57,
      "b": 10.06
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
    "hex": "#E64765",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 230,
      "g": 71,
      "b": 101
    },
    "lab": {
      "l": 54.32,
      "a": 62.78,
      "b": 18.76
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
    "hex": "#F88C7E",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 248,
      "g": 140,
      "b": 126
    },
    "lab": {
      "l": 69.63,
      "a": 39.48,
      "b": 25.55
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
    "hex": "#A2CB39",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 162,
      "g": 203,
      "b": 57
    },
    "lab": {
      "l": 76.49,
      "a": -33.6,
      "b": 64.37
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
    "hex": "#CB7D85",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 203,
      "g": 125,
      "b": 133
    },
    "lab": {
      "l": 60.83,
      "a": 31.24,
      "b": 8.57
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
    "hex": "#10428D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 16,
      "g": 66,
      "b": 141
    },
    "lab": {
      "l": 29.23,
      "a": 14.3,
      "b": -46.05
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
    "hex": "#BB3732",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 187,
      "g": 55,
      "b": 50
    },
    "lab": {
      "l": 43.55,
      "a": 52.33,
      "b": 33.8
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
    "hex": "#5F2117",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 95,
      "g": 33,
      "b": 23
    },
    "lab": {
      "l": 22.24,
      "a": 27.59,
      "b": 21.22
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
    "hex": "#583836",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 88,
      "g": 56,
      "b": 54
    },
    "lab": {
      "l": 27.21,
      "a": 13.97,
      "b": 7.11
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
    "hex": "#004BA6",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 75,
      "b": 166
    },
    "lab": {
      "l": 33.53,
      "a": 17.71,
      "b": -54.27
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
    "hex": "#E09E97",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 224,
      "g": 158,
      "b": 151
    },
    "lab": {
      "l": 71.24,
      "a": 23.66,
      "b": 13.51
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
    "hex": "#AF4C35",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 175,
      "g": 76,
      "b": 53
    },
    "lab": {
      "l": 45,
      "a": 38.89,
      "b": 33.21
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
    "hex": "#B96957",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 185,
      "g": 105,
      "b": 87
    },
    "lab": {
      "l": 53.07,
      "a": 30.09,
      "b": 24.06
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
    "hex": "#FB5D53",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 251,
      "g": 93,
      "b": 83
    },
    "lab": {
      "l": 60.75,
      "a": 59.62,
      "b": 38.1
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
    "hex": "#264445",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 38,
      "g": 68,
      "b": 69
    },
    "lab": {
      "l": 26.67,
      "a": -10.86,
      "b": -4.13
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
    "hex": "#00365C",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 54,
      "b": 92
    },
    "lab": {
      "l": 21.62,
      "a": 0.14,
      "b": -27.17
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
    "hex": "#54A4BD",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 84,
      "g": 164,
      "b": 189
    },
    "lab": {
      "l": 63.43,
      "a": -17.33,
      "b": -20.33
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
    "hex": "#7C868F",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 124,
      "g": 134,
      "b": 143
    },
    "lab": {
      "l": 55.4,
      "a": -1.72,
      "b": -6.07
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
    "hex": "#C4B59A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 196,
      "g": 181,
      "b": 154
    },
    "lab": {
      "l": 74.26,
      "a": 0.98,
      "b": 15.71
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
    "hex": "#CCCFD0",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 204,
      "g": 207,
      "b": 208
    },
    "lab": {
      "l": 82.92,
      "a": -0.84,
      "b": -0.85
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
    "hex": "#F9D672",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 249,
      "g": 214,
      "b": 114
    },
    "lab": {
      "l": 86.73,
      "a": 0.32,
      "b": 53.3
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
    "hex": "#A43483",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 164,
      "g": 52,
      "b": 131
    },
    "lab": {
      "l": 41.2,
      "a": 53.96,
      "b": -19.96
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
    "hex": "#1F1D22",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 31,
      "g": 29,
      "b": 34
    },
    "lab": {
      "l": 11.17,
      "a": 2.23,
      "b": -3.07
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
    "hex": "#516685",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 81,
      "g": 102,
      "b": 133
    },
    "lab": {
      "l": 42.68,
      "a": 0.5,
      "b": -19.69
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
    "hex": "#A85625",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 168,
      "g": 86,
      "b": 37
    },
    "lab": {
      "l": 45.79,
      "a": 30.11,
      "b": 42.2
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
    "hex": "#EBD40B",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 235,
      "g": 212,
      "b": 11
    },
    "lab": {
      "l": 84.37,
      "a": -8.85,
      "b": 83.51
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
    "hex": "#544C30",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 84,
      "g": 76,
      "b": 48
    },
    "lab": {
      "l": 32.41,
      "a": -1.35,
      "b": 17.87
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
    "hex": "#8E865F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 142,
      "g": 134,
      "b": 95
    },
    "lab": {
      "l": 55.71,
      "a": -3.3,
      "b": 22.13
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
    "hex": "#00A38D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 163,
      "b": 141
    },
    "lab": {
      "l": 59.99,
      "a": -40.94,
      "b": 1.35
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
    "hex": "#737F94",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 115,
      "g": 127,
      "b": 148
    },
    "lab": {
      "l": 52.91,
      "a": 0.4,
      "b": -12.77
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
    "hex": "#1F6760",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 31,
      "g": 103,
      "b": 96
    },
    "lab": {
      "l": 39.3,
      "a": -23.67,
      "b": -2.52
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
    "hex": "#332F3A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 47,
      "b": 58
    },
    "lab": {
      "l": 20.21,
      "a": 4.44,
      "b": -6.32
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
    "hex": "#242D36",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 36,
      "g": 45,
      "b": 54
    },
    "lab": {
      "l": 18,
      "a": -1.27,
      "b": -7.04
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
    "hex": "#6D642C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 109,
      "g": 100,
      "b": 44
    },
    "lab": {
      "l": 42.07,
      "a": -4.32,
      "b": 32.51
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
    "hex": "#435069",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 67,
      "g": 80,
      "b": 105
    },
    "lab": {
      "l": 33.88,
      "a": 1.66,
      "b": -16.11
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
    "hex": "#1F6982",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 31,
      "g": 105,
      "b": 130
    },
    "lab": {
      "l": 41.22,
      "a": -13.45,
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
    "hex": "#834A4C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 131,
      "g": 74,
      "b": 76
    },
    "lab": {
      "l": 38.28,
      "a": 24.4,
      "b": 9.39
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
    "hex": "#AFA083",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 175,
      "g": 160,
      "b": 131
    },
    "lab": {
      "l": 66.44,
      "a": 0.8,
      "b": 17.13
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
    "family": "Red",
    "colorFamily": "red",
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
    "hex": "#DB928C",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 219,
      "g": 146,
      "b": 140
    },
    "lab": {
      "l": 67.66,
      "a": 26.85,
      "b": 14.51
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
    "hex": "#513531",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 81,
      "g": 53,
      "b": 49
    },
    "lab": {
      "l": 25.31,
      "a": 11.99,
      "b": 7.63
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
    "hex": "#313A5D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 49,
      "g": 58,
      "b": 93
    },
    "lab": {
      "l": 25.17,
      "a": 6.8,
      "b": -22.08
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
    "hex": "#AEA38D",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 174,
      "g": 163,
      "b": 141
    },
    "lab": {
      "l": 67.36,
      "a": 0.28,
      "b": 12.88
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
    "hex": "#B25B3C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 178,
      "g": 91,
      "b": 60
    },
    "lab": {
      "l": 48.61,
      "a": 32.74,
      "b": 33.62
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
    "hex": "#645C47",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 100,
      "g": 92,
      "b": 71
    },
    "lab": {
      "l": 39.27,
      "a": -0.49,
      "b": 13.28
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
    "hex": "#23A4B7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 35,
      "g": 164,
      "b": 183
    },
    "lab": {
      "l": 61.93,
      "a": -26.56,
      "b": -19.37
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
    "hex": "#364C90",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 54,
      "g": 76,
      "b": 144
    },
    "lab": {
      "l": 33.91,
      "a": 13.92,
      "b": -40.27
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
    "hex": "#66342D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 102,
      "g": 52,
      "b": 45
    },
    "lab": {
      "l": 28.04,
      "a": 21.57,
      "b": 14.46
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
    "hex": "#677480",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 103,
      "g": 116,
      "b": 128
    },
    "lab": {
      "l": 48.17,
      "a": -2.08,
      "b": -8.22
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
    "hex": "#CFAC9C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 207,
      "g": 172,
      "b": 156
    },
    "lab": {
      "l": 73.01,
      "a": 10.3,
      "b": 13
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
    "hex": "#BFA5CE",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 191,
      "g": 165,
      "b": 206
    },
    "lab": {
      "l": 71.18,
      "a": 17.03,
      "b": -17.36
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
    "hex": "#FB7568",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 251,
      "g": 117,
      "b": 104
    },
    "lab": {
      "l": 65.15,
      "a": 50.17,
      "b": 31.92
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
    "hex": "#F4C540",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 244,
      "g": 197,
      "b": 64
    },
    "lab": {
      "l": 81.59,
      "a": 3.96,
      "b": 69.08
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
    "hex": "#B48746",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 180,
      "g": 135,
      "b": 70
    },
    "lab": {
      "l": 59.41,
      "a": 9.98,
      "b": 41.03
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
    "hex": "#D7813E",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 215,
      "g": 129,
      "b": 62
    },
    "lab": {
      "l": 62.08,
      "a": 27.69,
      "b": 49.12
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
    "hex": "#474E2F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 71,
      "g": 78,
      "b": 47
    },
    "lab": {
      "l": 31.79,
      "a": -8.75,
      "b": 17.44
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
    "hex": "#BA9757",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 186,
      "g": 151,
      "b": 87
    },
    "lab": {
      "l": 64.37,
      "a": 5.12,
      "b": 38.37
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
    "hex": "#E68ABE",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 230,
      "g": 138,
      "b": 190
    },
    "lab": {
      "l": 68.55,
      "a": 41.91,
      "b": -12.04
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
    "hex": "#B92269",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 185,
      "g": 34,
      "b": 105
    },
    "lab": {
      "l": 41.97,
      "a": 62.29,
      "b": -2.31
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
    "hex": "#60AF6F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 96,
      "g": 175,
      "b": 111
    },
    "lab": {
      "l": 65.19,
      "a": -38.3,
      "b": 25.47
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
    "hex": "#D3AAB8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 211,
      "g": 170,
      "b": 184
    },
    "lab": {
      "l": 73.58,
      "a": 17.19,
      "b": -1.47
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
    "hex": "#6D83A3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 109,
      "g": 131,
      "b": 163
    },
    "lab": {
      "l": 54.16,
      "a": 0,
      "b": -19.6
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
    "hex": "#535A46",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 83,
      "g": 90,
      "b": 70
    },
    "lab": {
      "l": 37.1,
      "a": -6.81,
      "b": 10.66
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
    "hex": "#BEBCA7",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 190,
      "g": 188,
      "b": 167
    },
    "lab": {
      "l": 75.89,
      "a": -2.95,
      "b": 10.89
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
    "hex": "#8F182D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 143,
      "g": 24,
      "b": 45
    },
    "lab": {
      "l": 31.08,
      "a": 48.81,
      "b": 19.88
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
    "hex": "#100E0F",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 16,
      "g": 14,
      "b": 15
    },
    "lab": {
      "l": 4.14,
      "a": 0.86,
      "b": -0.24
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
    "hex": "#8B8F92",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 139,
      "g": 143,
      "b": 146
    },
    "lab": {
      "l": 59.17,
      "a": -0.85,
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
    "hex": "#00657D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 101,
      "b": 125
    },
    "lab": {
      "l": 39.22,
      "a": -15.71,
      "b": -20.42
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
    "hex": "#11436D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 17,
      "g": 67,
      "b": 109
    },
    "lab": {
      "l": 27.4,
      "a": 0.25,
      "b": -28.95
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
    "hex": "#233D7D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 35,
      "g": 61,
      "b": 125
    },
    "lab": {
      "l": 27.23,
      "a": 13.45,
      "b": -39.31
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
    "family": "Green",
    "colorFamily": "green",
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
    "hex": "#C48D32",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 196,
      "g": 141,
      "b": 50
    },
    "lab": {
      "l": 62.52,
      "a": 12.49,
      "b": 54.24
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
    "hex": "#C68536",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 198,
      "g": 133,
      "b": 54
    },
    "lab": {
      "l": 60.83,
      "a": 17.93,
      "b": 50.87
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
    "hex": "#36B5CF",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 54,
      "g": 181,
      "b": 207
    },
    "lab": {
      "l": 68.27,
      "a": -25.44,
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
    "hex": "#976325",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 151,
      "g": 99,
      "b": 37
    },
    "lab": {
      "l": 46.5,
      "a": 15.39,
      "b": 42.14
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
    "hex": "#7B4535",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 123,
      "g": 69,
      "b": 53
    },
    "lab": {
      "l": 35.45,
      "a": 21.45,
      "b": 19.68
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
    "hex": "#746154",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 116,
      "g": 97,
      "b": 84
    },
    "lab": {
      "l": 42.62,
      "a": 5.47,
      "b": 10.27
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
    "hex": "#341D27",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 52,
      "g": 29,
      "b": 39
    },
    "lab": {
      "l": 14.15,
      "a": 13.02,
      "b": -2
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
    "hex": "#D77A3F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 215,
      "g": 122,
      "b": 63
    },
    "lab": {
      "l": 60.54,
      "a": 31.45,
      "b": 46.97
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
    "hex": "#4D2D29",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 77,
      "g": 45,
      "b": 41
    },
    "lab": {
      "l": 22.36,
      "a": 14.2,
      "b": 8.81
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
    "hex": "#90B5D2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 144,
      "g": 181,
      "b": 210
    },
    "lab": {
      "l": 71.98,
      "a": -5.61,
      "b": -18.67
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
    "hex": "#A0593A",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 160,
      "g": 89,
      "b": 58
    },
    "lab": {
      "l": 45.53,
      "a": 26.28,
      "b": 30.45
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
    "hex": "#875853",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 135,
      "g": 88,
      "b": 83
    },
    "lab": {
      "l": 42.39,
      "a": 18.77,
      "b": 10.89
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
    "hex": "#A96D5B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 169,
      "g": 109,
      "b": 91
    },
    "lab": {
      "l": 51.98,
      "a": 21.77,
      "b": 19.93
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
    "hex": "#034995",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 3,
      "g": 73,
      "b": 149
    },
    "lab": {
      "l": 31.7,
      "a": 12.07,
      "b": -46.96
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
    "hex": "#4B6EC1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 75,
      "g": 110,
      "b": 193
    },
    "lab": {
      "l": 47.62,
      "a": 13.44,
      "b": -47.31
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
    "hex": "#152C27",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 21,
      "g": 44,
      "b": 39
    },
    "lab": {
      "l": 16.04,
      "a": -10.6,
      "b": 0.42
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
    "hex": "#BBA491",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 164,
      "b": 145
    },
    "lab": {
      "l": 68.87,
      "a": 5.35,
      "b": 12.95
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
    "hex": "#513323",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 81,
      "g": 51,
      "b": 35
    },
    "lab": {
      "l": 24.45,
      "a": 11.51,
      "b": 15.67
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
    "hex": "#2F3123",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 49,
      "b": 35
    },
    "lab": {
      "l": 19.73,
      "a": -3.86,
      "b": 8.67
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
    "hex": "#37241F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 36,
      "b": 31
    },
    "lab": {
      "l": 16.37,
      "a": 8.25,
      "b": 6.96
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
    "hex": "#8F9EA3",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 143,
      "g": 158,
      "b": 163
    },
    "lab": {
      "l": 64.11,
      "a": -4.25,
      "b": -4.41
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
    "hex": "#E8EBED",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 232,
      "g": 235,
      "b": 237
    },
    "lab": {
      "l": 92.88,
      "a": -0.64,
      "b": -1.32
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
    "hex": "#B8BCC1",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 184,
      "g": 188,
      "b": 193
    },
    "lab": {
      "l": 76.07,
      "a": -0.43,
      "b": -3
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
    "hex": "#171A1E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 23,
      "g": 26,
      "b": 30
    },
    "lab": {
      "l": 9.11,
      "a": -0.28,
      "b": -3.26
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
    "family": "Purple",
    "colorFamily": "purple",
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
    "hex": "#585F68",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 88,
      "g": 95,
      "b": 104
    },
    "lab": {
      "l": 40.01,
      "a": -0.65,
      "b": -6.05
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
    "hex": "#676648",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 103,
      "g": 102,
      "b": 72
    },
    "lab": {
      "l": 42.54,
      "a": -4.94,
      "b": 17.15
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
    "hex": "#282823",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 40,
      "g": 40,
      "b": 35
    },
    "lab": {
      "l": 15.95,
      "a": -1.15,
      "b": 3.3
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
    "hex": "#A25536",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 162,
      "g": 85,
      "b": 54
    },
    "lab": {
      "l": 44.87,
      "a": 29.05,
      "b": 31.98
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
    "hex": "#4D492E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 77,
      "g": 73,
      "b": 46
    },
    "lab": {
      "l": 30.74,
      "a": -3.07,
      "b": 16.78
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
    "hex": "#AD98DA",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 173,
      "g": 152,
      "b": 218
    },
    "lab": {
      "l": 66.83,
      "a": 21.13,
      "b": -30.77
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
    "hex": "#A1A38E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 161,
      "g": 163,
      "b": 142
    },
    "lab": {
      "l": 66.31,
      "a": -4.51,
      "b": 10.68
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
    "hex": "#461913",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 70,
      "g": 25,
      "b": 19
    },
    "lab": {
      "l": 15.72,
      "a": 21.14,
      "b": 14.9
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
    "hex": "#F0D885",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 240,
      "g": 216,
      "b": 133
    },
    "lab": {
      "l": 86.67,
      "a": -2.64,
      "b": 43.82
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
    "hex": "#332827",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 51,
      "g": 40,
      "b": 39
    },
    "lab": {
      "l": 17.31,
      "a": 4.92,
      "b": 2.59
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
    "hex": "#6A6931",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 106,
      "g": 105,
      "b": 49
    },
    "lab": {
      "l": 43.34,
      "a": -8.14,
      "b": 31.27
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
    "hex": "#E4639B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 228,
      "g": 99,
      "b": 155
    },
    "lab": {
      "l": 59.7,
      "a": 55.69,
      "b": -5.35
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
    "hex": "#282A2F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 40,
      "g": 42,
      "b": 47
    },
    "lab": {
      "l": 17.05,
      "a": 0.39,
      "b": -3.55
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
    "hex": "#B6292C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 182,
      "g": 41,
      "b": 44
    },
    "lab": {
      "l": 40.76,
      "a": 55.39,
      "b": 33.9
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
    "hex": "#5E7D96",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 94,
      "g": 125,
      "b": 150
    },
    "lab": {
      "l": 50.98,
      "a": -4.5,
      "b": -17
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
    "hex": "#F16928",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 241,
      "g": 105,
      "b": 40
    },
    "lab": {
      "l": 60.75,
      "a": 49.16,
      "b": 58.84
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
    "hex": "#F5B808",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 245,
      "g": 184,
      "b": 8
    },
    "lab": {
      "l": 78.3,
      "a": 9.82,
      "b": 79.84
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
    "hex": "#F2AEE3",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 242,
      "g": 174,
      "b": 227
    },
    "lab": {
      "l": 78.87,
      "a": 33,
      "b": -16.73
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
    "hex": "#C1723C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 193,
      "g": 114,
      "b": 60
    },
    "lab": {
      "l": 55.79,
      "a": 26.51,
      "b": 42.41
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
    "hex": "#42191F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 66,
      "g": 25,
      "b": 31
    },
    "lab": {
      "l": 15.24,
      "a": 20.55,
      "b": 5.67
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
    "hex": "#7FD4BC",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 127,
      "g": 212,
      "b": 188
    },
    "lab": {
      "l": 79.17,
      "a": -31.3,
      "b": 3.8
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
    "hex": "#A15513",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 161,
      "g": 85,
      "b": 19
    },
    "lab": {
      "l": 44.41,
      "a": 27.1,
      "b": 48.15
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
    "hex": "#724E92",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 114,
      "g": 78,
      "b": 146
    },
    "lab": {
      "l": 39.75,
      "a": 29,
      "b": -31.89
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
    "hex": "#5B3F37",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 63,
      "b": 55
    },
    "lab": {
      "l": 29.55,
      "a": 11.04,
      "b": 9.77
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
    "hex": "#8195A6",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 129,
      "g": 149,
      "b": 166
    },
    "lab": {
      "l": 60.71,
      "a": -3.24,
      "b": -11.28
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
    "hex": "#AA6235",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 170,
      "g": 98,
      "b": 53
    },
    "lab": {
      "l": 48.93,
      "a": 25.19,
      "b": 37.51
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
    "hex": "#977848",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 151,
      "g": 120,
      "b": 72
    },
    "lab": {
      "l": 52.38,
      "a": 5.85,
      "b": 30.79
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
    "hex": "#055E9D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 5,
      "g": 94,
      "b": 157
    },
    "lab": {
      "l": 38.67,
      "a": 1.54,
      "b": -40.59
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
    "hex": "#12252A",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 18,
      "g": 37,
      "b": 42
    },
    "lab": {
      "l": 13.34,
      "a": -6.03,
      "b": -5.73
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
    "hex": "#A19E83",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 161,
      "g": 158,
      "b": 131
    },
    "lab": {
      "l": 64.7,
      "a": -3.59,
      "b": 14.53
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
    "hex": "#554C49",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 85,
      "g": 76,
      "b": 73
    },
    "lab": {
      "l": 33.1,
      "a": 3.16,
      "b": 3.14
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
    "hex": "#2F2A27",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 47,
      "g": 42,
      "b": 39
    },
    "lab": {
      "l": 17.49,
      "a": 1.64,
      "b": 2.79
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
    "hex": "#98999C",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 152,
      "g": 153,
      "b": 156
    },
    "lab": {
      "l": 63.23,
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
    "hex": "#BB613F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 187,
      "g": 97,
      "b": 63
    },
    "lab": {
      "l": 51.24,
      "a": 33.36,
      "b": 35.4
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
    "hex": "#014942",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 73,
      "b": 66
    },
    "lab": {
      "l": 27.2,
      "a": -21.81,
      "b": -1.51
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
    "hex": "#976CA0",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 151,
      "g": 108,
      "b": 160
    },
    "lab": {
      "l": 51.66,
      "a": 26.44,
      "b": -21.38
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
    "hex": "#111F33",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 17,
      "g": 31,
      "b": 51
    },
    "lab": {
      "l": 11.54,
      "a": 1.44,
      "b": -15
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
    "hex": "#957F6A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 149,
      "g": 127,
      "b": 106
    },
    "lab": {
      "l": 54.67,
      "a": 5.09,
      "b": 14.56
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
    "hex": "#5F2024",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 95,
      "g": 32,
      "b": 36
    },
    "lab": {
      "l": 22.28,
      "a": 29.03,
      "b": 12.62
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
    "hex": "#C99370",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 201,
      "g": 147,
      "b": 112
    },
    "lab": {
      "l": 65.32,
      "a": 16.01,
      "b": 26.52
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
    "hex": "#ABA778",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 171,
      "g": 167,
      "b": 120
    },
    "lab": {
      "l": 67.76,
      "a": -6.1,
      "b": 24.89
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
    "hex": "#383330",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 56,
      "g": 51,
      "b": 48
    },
    "lab": {
      "l": 21.66,
      "a": 1.58,
      "b": 2.7
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
    "hex": "#B38F5D",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 179,
      "g": 143,
      "b": 93
    },
    "lab": {
      "l": 61.67,
      "a": 7.11,
      "b": 31.67
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
    "hex": "#424C34",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 66,
      "g": 76,
      "b": 52
    },
    "lab": {
      "l": 30.82,
      "a": -8.99,
      "b": 12.99
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
    "hex": "#3A98C6",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 58,
      "g": 152,
      "b": 198
    },
    "lab": {
      "l": 59.37,
      "a": -12.57,
      "b": -31.7
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
    "hex": "#F58E68",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 245,
      "g": 142,
      "b": 104
    },
    "lab": {
      "l": 69.3,
      "a": 35.5,
      "b": 37.01
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
    "hex": "#112D31",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 17,
      "g": 45,
      "b": 49
    },
    "lab": {
      "l": 16.59,
      "a": -9.11,
      "b": -5.8
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
    "hex": "#192E66",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 25,
      "g": 46,
      "b": 102
    },
    "lab": {
      "l": 20.52,
      "a": 13.2,
      "b": -35.45
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
    "hex": "#404951",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 64,
      "g": 73,
      "b": 81
    },
    "lab": {
      "l": 30.52,
      "a": -1.63,
      "b": -5.98
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
    "hex": "#952A26",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 149,
      "g": 42,
      "b": 38
    },
    "lab": {
      "l": 34.37,
      "a": 44.24,
      "b": 28.53
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
    "hex": "#5E9C34",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 94,
      "g": 156,
      "b": 52
    },
    "lab": {
      "l": 58.42,
      "a": -38.37,
      "b": 46.53
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
    "hex": "#BBA083",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 160,
      "b": 131
    },
    "lab": {
      "l": 67.54,
      "a": 5.54,
      "b": 18.81
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
    "hex": "#523120",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 82,
      "g": 49,
      "b": 32
    },
    "lab": {
      "l": 23.98,
      "a": 12.97,
      "b": 17.05
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
    "hex": "#1F1930",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 31,
      "g": 25,
      "b": 48
    },
    "lab": {
      "l": 10.56,
      "a": 9.43,
      "b": -14.29
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
    "hex": "#82885A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 130,
      "g": 136,
      "b": 90
    },
    "lab": {
      "l": 55.17,
      "a": -10.08,
      "b": 24.01
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
    "hex": "#A29359",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 162,
      "g": 147,
      "b": 89
    },
    "lab": {
      "l": 61.02,
      "a": -2.74,
      "b": 32.65
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
    "hex": "#7E8A4F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 126,
      "g": 138,
      "b": 79
    },
    "lab": {
      "l": 55.25,
      "a": -14.24,
      "b": 30.09
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
    "hex": "#B6A69F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 182,
      "g": 166,
      "b": 159
    },
    "lab": {
      "l": 69.27,
      "a": 4.59,
      "b": 5.72
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
    "hex": "#BC4559",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 188,
      "g": 69,
      "b": 89
    },
    "lab": {
      "l": 46.54,
      "a": 49.38,
      "b": 14.19
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
    "hex": "#F6D027",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 246,
      "g": 208,
      "b": 39
    },
    "lab": {
      "l": 84.41,
      "a": -1.67,
      "b": 79.33
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
    "hex": "#2E2344",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 46,
      "g": 35,
      "b": 68
    },
    "lab": {
      "l": 16.5,
      "a": 13.78,
      "b": -18.98
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
    "hex": "#B94755",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 185,
      "g": 71,
      "b": 85
    },
    "lab": {
      "l": 46.28,
      "a": 47.13,
      "b": 16.19
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
    "hex": "#928077",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 146,
      "g": 128,
      "b": 119
    },
    "lab": {
      "l": 54.95,
      "a": 5.32,
      "b": 7.4
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
    "hex": "#B15C3C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 177,
      "g": 92,
      "b": 60
    },
    "lab": {
      "l": 48.67,
      "a": 31.8,
      "b": 33.66
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
    "hex": "#BB7A2F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 187,
      "g": 122,
      "b": 47
    },
    "lab": {
      "l": 56.77,
      "a": 18.89,
      "b": 49.44
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
    "hex": "#221413",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 34,
      "g": 20,
      "b": 19
    },
    "lab": {
      "l": 8.02,
      "a": 7.03,
      "b": 3.34
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
    "hex": "#A7ACB2",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 167,
      "g": 172,
      "b": 178
    },
    "lab": {
      "l": 70.13,
      "a": -0.59,
      "b": -3.69
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
    "hex": "#A17E69",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 161,
      "g": 126,
      "b": 105
    },
    "lab": {
      "l": 55.6,
      "a": 10.47,
      "b": 16.61
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
    "hex": "#4B6580",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 75,
      "g": 101,
      "b": 128
    },
    "lab": {
      "l": 41.78,
      "a": -2.13,
      "b": -18.09
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
    "hex": "#5A1B30",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 90,
      "g": 27,
      "b": 48
    },
    "lab": {
      "l": 20.72,
      "a": 30.84,
      "b": 1.99
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
    "hex": "#86331A",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 134,
      "g": 51,
      "b": 26
    },
    "lab": {
      "l": 32.95,
      "a": 34.18,
      "b": 33.09
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
    "hex": "#D0BE9F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 208,
      "g": 190,
      "b": 159
    },
    "lab": {
      "l": 77.72,
      "a": 1.49,
      "b": 17.99
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
    "hex": "#749357",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 116,
      "g": 147,
      "b": 87
    },
    "lab": {
      "l": 57.34,
      "a": -21.93,
      "b": 28.28
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
    "hex": "#252429",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 37,
      "g": 36,
      "b": 41
    },
    "lab": {
      "l": 14.49,
      "a": 1.72,
      "b": -3.15
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
    "hex": "#873E23",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 135,
      "g": 62,
      "b": 35
    },
    "lab": {
      "l": 35.44,
      "a": 29.25,
      "b": 30.8
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
    "hex": "#C98437",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 201,
      "g": 132,
      "b": 55
    },
    "lab": {
      "l": 60.96,
      "a": 19.82,
      "b": 50.66
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
    "hex": "#877E98",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 135,
      "g": 126,
      "b": 152
    },
    "lab": {
      "l": 54.39,
      "a": 8.73,
      "b": -12.71
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
    "family": "Cyan",
    "colorFamily": "cyan",
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
    "hex": "#005469",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 84,
      "b": 105
    },
    "lab": {
      "l": 32.61,
      "a": -13.61,
      "b": -18.27
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
    "hex": "#B4554B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 180,
      "g": 85,
      "b": 75
    },
    "lab": {
      "l": 47.89,
      "a": 37.71,
      "b": 24.18
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
    "hex": "#665141",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 102,
      "g": 81,
      "b": 65
    },
    "lab": {
      "l": 36.16,
      "a": 6.2,
      "b": 12.74
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
    "family": "Grey",
    "colorFamily": "grey",
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
    "hex": "#B0B4B9",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 176,
      "g": 180,
      "b": 185
    },
    "lab": {
      "l": 73.14,
      "a": -0.44,
      "b": -3.03
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
    "hex": "#393431",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 57,
      "g": 52,
      "b": 49
    },
    "lab": {
      "l": 22.12,
      "a": 1.57,
      "b": 2.69
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
    "hex": "#676D49",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 103,
      "g": 109,
      "b": 73
    },
    "lab": {
      "l": 44.66,
      "a": -8.81,
      "b": 19.4
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
    "hex": "#278F70",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 39,
      "g": 143,
      "b": 112
    },
    "lab": {
      "l": 53.22,
      "a": -36.94,
      "b": 8.15
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
    "hex": "#A57763",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 165,
      "g": 119,
      "b": 99
    },
    "lab": {
      "l": 54.13,
      "a": 15.36,
      "b": 18.12
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
    "hex": "#836A4C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 131,
      "g": 106,
      "b": 76
    },
    "lab": {
      "l": 46.52,
      "a": 5.55,
      "b": 20.59
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
    "hex": "#C57D48",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 197,
      "g": 125,
      "b": 72
    },
    "lab": {
      "l": 58.98,
      "a": 22.93,
      "b": 40.01
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
    "hex": "#0373BA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 3,
      "g": 115,
      "b": 186
    },
    "lab": {
      "l": 46.74,
      "a": -0.07,
      "b": -44.78
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
    "hex": "#0096B7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 150,
      "b": 183
    },
    "lab": {
      "l": 57.3,
      "a": -21.3,
      "b": -26.51
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
    "hex": "#2E3C57",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 46,
      "g": 60,
      "b": 87
    },
    "lab": {
      "l": 25.26,
      "a": 2.53,
      "b": -18.03
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
    "hex": "#2E211B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 46,
      "g": 33,
      "b": 27
    },
    "lab": {
      "l": 14.1,
      "a": 5.19,
      "b": 6.48
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
    "hex": "#004B71",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 75,
      "b": 113
    },
    "lab": {
      "l": 29.97,
      "a": -4.8,
      "b": -27.44
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
    "hex": "#2F4B5A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 47,
      "g": 75,
      "b": 90
    },
    "lab": {
      "l": 30.34,
      "a": -5.95,
      "b": -12.14
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
    "hex": "#E34819",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 227,
      "g": 72,
      "b": 25
    },
    "lab": {
      "l": 52.99,
      "a": 58.16,
      "b": 57.36
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
    "hex": "#8D4237",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 141,
      "g": 66,
      "b": 55
    },
    "lab": {
      "l": 37.55,
      "a": 30.86,
      "b": 21.7
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
    "hex": "#C3CBCC",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 195,
      "g": 203,
      "b": 204
    },
    "lab": {
      "l": 81.11,
      "a": -2.54,
      "b": -1.45
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
    "hex": "#DC9450",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 220,
      "g": 148,
      "b": 80
    },
    "lab": {
      "l": 67.26,
      "a": 20.61,
      "b": 46.25
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
    "hex": "#C1AA83",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 193,
      "g": 170,
      "b": 131
    },
    "lab": {
      "l": 70.68,
      "a": 2.51,
      "b": 23.2
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
    "hex": "#202D23",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 32,
      "g": 45,
      "b": 35
    },
    "lab": {
      "l": 17.01,
      "a": -8.11,
      "b": 4.7
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
    "family": "Green",
    "colorFamily": "green",
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
    "hex": "#476C42",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 71,
      "g": 108,
      "b": 66
    },
    "lab": {
      "l": 41.93,
      "a": -22.29,
      "b": 19.44
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
    "hex": "#625A71",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 98,
      "g": 90,
      "b": 113
    },
    "lab": {
      "l": 39.75,
      "a": 8.23,
      "b": -11.88
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
    "hex": "#241211",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 36,
      "g": 18,
      "b": 17
    },
    "lab": {
      "l": 7.66,
      "a": 9.19,
      "b": 4.07
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
    "hex": "#045F2E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 4,
      "g": 95,
      "b": 46
    },
    "lab": {
      "l": 34.82,
      "a": -36.36,
      "b": 21.34
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
    "hex": "#A3363C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 163,
      "g": 54,
      "b": 60
    },
    "lab": {
      "l": 39.16,
      "a": 45.27,
      "b": 21.44
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
    "hex": "#EBEFF0",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 235,
      "g": 239,
      "b": 240
    },
    "lab": {
      "l": 94.18,
      "a": -1.15,
      "b": -0.95
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
    "hex": "#DD3C36",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 221,
      "g": 60,
      "b": 54
    },
    "lab": {
      "l": 50.54,
      "a": 61.4,
      "b": 41.05
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
    "hex": "#69211E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 105,
      "g": 33,
      "b": 30
    },
    "lab": {
      "l": 24.28,
      "a": 31.96,
      "b": 19.57
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
    "hex": "#C9BEAD",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 201,
      "g": 190,
      "b": 173
    },
    "lab": {
      "l": 77.44,
      "a": 1,
      "b": 9.97
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
    "hex": "#372344",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 55,
      "g": 35,
      "b": 68
    },
    "lab": {
      "l": 17.61,
      "a": 16.93,
      "b": -17.17
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
    "hex": "#785639",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 120,
      "g": 86,
      "b": 57
    },
    "lab": {
      "l": 39.49,
      "a": 10.35,
      "b": 22.37
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
    "hex": "#F39F13",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 243,
      "g": 159,
      "b": 19
    },
    "lab": {
      "l": 72.16,
      "a": 22.21,
      "b": 73.9
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
    "hex": "#B28147",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 178,
      "g": 129,
      "b": 71
    },
    "lab": {
      "l": 57.68,
      "a": 12.52,
      "b": 38.43
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
    "hex": "#9B7F61",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 155,
      "g": 127,
      "b": 97
    },
    "lab": {
      "l": 55.08,
      "a": 6.37,
      "b": 20.37
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
    "hex": "#884D37",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 136,
      "g": 77,
      "b": 55
    },
    "lab": {
      "l": 39.27,
      "a": 22.61,
      "b": 23.72
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
    "hex": "#997F6E",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 153,
      "g": 127,
      "b": 110
    },
    "lab": {
      "l": 55.15,
      "a": 7.31,
      "b": 12.99
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
    "hex": "#B38381",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 179,
      "g": 131,
      "b": 129
    },
    "lab": {
      "l": 59.35,
      "a": 18.18,
      "b": 8.36
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
    "hex": "#FAED15",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 250,
      "g": 237,
      "b": 21
    },
    "lab": {
      "l": 92.11,
      "a": -14.78,
      "b": 88.79
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
    "hex": "#3E3634",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 54,
      "b": 52
    },
    "lab": {
      "l": 23.37,
      "a": 3.12,
      "b": 2.55
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
    "hex": "#223329",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 34,
      "g": 51,
      "b": 41
    },
    "lab": {
      "l": 19.51,
      "a": -9.61,
      "b": 4.13
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
    "hex": "#5B1616",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 91,
      "g": 22,
      "b": 22
    },
    "lab": {
      "l": 19.46,
      "a": 31.28,
      "b": 18.43
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
    "hex": "#005EBD",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 94,
      "b": 189
    },
    "lab": {
      "l": 40.7,
      "a": 14.44,
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
    "hex": "#2F3842",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 56,
      "b": 66
    },
    "lab": {
      "l": 23.09,
      "a": -1.04,
      "b": -7.44
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
    "hex": "#E31022",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 227,
      "g": 16,
      "b": 34
    },
    "lab": {
      "l": 48.04,
      "a": 72.39,
      "b": 49.55
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
    "hex": "#ECEEED",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 236,
      "g": 238,
      "b": 237
    },
    "lab": {
      "l": 93.92,
      "a": -0.84,
      "b": 0.25
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
    "hex": "#A59191",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 165,
      "g": 145,
      "b": 145
    },
    "lab": {
      "l": 61.91,
      "a": 7.45,
      "b": 2.74
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
    "hex": "#A59191",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 165,
      "g": 145,
      "b": 145
    },
    "lab": {
      "l": 61.91,
      "a": 7.45,
      "b": 2.74
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
    "hex": "#8C7F77",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 140,
      "g": 127,
      "b": 119
    },
    "lab": {
      "l": 54.12,
      "a": 3.52,
      "b": 6.14
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
    "hex": "#DAA96C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 218,
      "g": 169,
      "b": 108
    },
    "lab": {
      "l": 72.47,
      "a": 10.67,
      "b": 38.22
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
    "hex": "#00A24F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 162,
      "b": 79
    },
    "lab": {
      "l": 58.42,
      "a": -54.65,
      "b": 33.12
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
    "hex": "#96ABB3",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 150,
      "g": 171,
      "b": 179
    },
    "lab": {
      "l": 68.65,
      "a": -5.56,
      "b": -6.56
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
    "hex": "#E7DBC6",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 231,
      "g": 219,
      "b": 198
    },
    "lab": {
      "l": 87.84,
      "a": 0.66,
      "b": 11.8
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
    "hex": "#009F95",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 159,
      "b": 149
    },
    "lab": {
      "l": 58.94,
      "a": -36.85,
      "b": -4.72
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
    "hex": "#ADABAE",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 173,
      "g": 171,
      "b": 174
    },
    "lab": {
      "l": 70.22,
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
    "hex": "#71E8B6",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 113,
      "g": 232,
      "b": 182
    },
    "lab": {
      "l": 84.28,
      "a": -45.12,
      "b": 14.2
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
    "hex": "#F5E9BD",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 245,
      "g": 233,
      "b": 189
    },
    "lab": {
      "l": 92.29,
      "a": -2.74,
      "b": 22.89
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
    "hex": "#DD7E65",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 221,
      "g": 126,
      "b": 101
    },
    "lab": {
      "l": 62.71,
      "a": 34.28,
      "b": 29.61
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
    "hex": "#929B88",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 146,
      "g": 155,
      "b": 136
    },
    "lab": {
      "l": 62.79,
      "a": -6.83,
      "b": 8.87
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
    "hex": "#8FB223",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 143,
      "g": 178,
      "b": 35
    },
    "lab": {
      "l": 67.87,
      "a": -30.62,
      "b": 62.86
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
    "hex": "#E7B85E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 231,
      "g": 184,
      "b": 94
    },
    "lab": {
      "l": 77.33,
      "a": 6.97,
      "b": 51.36
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
    "hex": "#553A23",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 85,
      "g": 58,
      "b": 35
    },
    "lab": {
      "l": 26.96,
      "a": 8.96,
      "b": 18.96
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
    "hex": "#443F39",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 68,
      "g": 63,
      "b": 57
    },
    "lab": {
      "l": 26.96,
      "a": 0.92,
      "b": 4.45
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
    "hex": "#712A37",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 113,
      "g": 42,
      "b": 55
    },
    "lab": {
      "l": 27.96,
      "a": 32.59,
      "b": 8.08
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
    "hex": "#8F3B2E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 143,
      "g": 59,
      "b": 46
    },
    "lab": {
      "l": 36.3,
      "a": 34.7,
      "b": 25.7
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
    "hex": "#761E15",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 118,
      "g": 30,
      "b": 21
    },
    "lab": {
      "l": 26.26,
      "a": 37.62,
      "b": 28.14
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
    "hex": "#703828",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 112,
      "g": 56,
      "b": 40
    },
    "lab": {
      "l": 30.47,
      "a": 23.14,
      "b": 21.07
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
    "hex": "#4E5D3B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 78,
      "g": 93,
      "b": 59
    },
    "lab": {
      "l": 37.42,
      "a": -12.54,
      "b": 17.68
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
    "hex": "#9B7551",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 155,
      "g": 117,
      "b": 81
    },
    "lab": {
      "l": 52.16,
      "a": 10.22,
      "b": 25.59
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
    "hex": "#18171D",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 24,
      "g": 23,
      "b": 29
    },
    "lab": {
      "l": 8.09,
      "a": 2.13,
      "b": -4.03
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
    "hex": "#666874",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 102,
      "g": 104,
      "b": 116
    },
    "lab": {
      "l": 44.21,
      "a": 1.86,
      "b": -6.96
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
    "hex": "#974D29",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 151,
      "g": 77,
      "b": 41
    },
    "lab": {
      "l": 41.29,
      "a": 28.07,
      "b": 34.65
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
    "family": "Blue",
    "colorFamily": "blue",
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
    "hex": "#543426",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 84,
      "g": 52,
      "b": 38
    },
    "lab": {
      "l": 25.2,
      "a": 12.63,
      "b": 14.79
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
    "hex": "#402126",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 64,
      "g": 33,
      "b": 38
    },
    "lab": {
      "l": 17.07,
      "a": 15.6,
      "b": 3.2
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
    "hex": "#434834",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 67,
      "g": 72,
      "b": 52
    },
    "lab": {
      "l": 29.6,
      "a": -6.12,
      "b": 11.35
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
    "hex": "#46170A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 70,
      "g": 23,
      "b": 10
    },
    "lab": {
      "l": 15.15,
      "a": 21.73,
      "b": 18.85
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
    "hex": "#004340",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 67,
      "b": 64
    },
    "lab": {
      "l": 24.9,
      "a": -19.49,
      "b": -3.59
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
    "hex": "#5F2F2A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 95,
      "g": 47,
      "b": 42
    },
    "lab": {
      "l": 25.66,
      "a": 21.19,
      "b": 13.08
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
    "hex": "#553C24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 85,
      "g": 60,
      "b": 36
    },
    "lab": {
      "l": 27.55,
      "a": 7.79,
      "b": 19.08
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
    "hex": "#58452F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 88,
      "g": 69,
      "b": 47
    },
    "lab": {
      "l": 30.73,
      "a": 4.78,
      "b": 16.38
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
    "hex": "#203A57",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 32,
      "g": 58,
      "b": 87
    },
    "lab": {
      "l": 23.74,
      "a": 0.1,
      "b": -20.46
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
    "hex": "#CB1A57",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 203,
      "g": 26,
      "b": 87
    },
    "lab": {
      "l": 44.42,
      "a": 67.14,
      "b": 12.93
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
    "hex": "#948C81",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 148,
      "g": 140,
      "b": 129
    },
    "lab": {
      "l": 58.64,
      "a": 0.99,
      "b": 6.94
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
    "hex": "#11323B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 17,
      "g": 50,
      "b": 59
    },
    "lab": {
      "l": 18.87,
      "a": -8.65,
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
    "hex": "#6E1235",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 110,
      "g": 18,
      "b": 53
    },
    "lab": {
      "l": 23.69,
      "a": 41.36,
      "b": 3.32
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
    "hex": "#232C49",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 35,
      "g": 44,
      "b": 73
    },
    "lab": {
      "l": 18.54,
      "a": 5.48,
      "b": -19.27
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
    "hex": "#25272C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 37,
      "g": 39,
      "b": 44
    },
    "lab": {
      "l": 15.62,
      "a": 0.4,
      "b": -3.59
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
    "hex": "#905F30",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 144,
      "g": 95,
      "b": 48
    },
    "lab": {
      "l": 44.7,
      "a": 15.17,
      "b": 34.44
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
    "hex": "#3E1E2A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 62,
      "g": 30,
      "b": 42
    },
    "lab": {
      "l": 16.11,
      "a": 17.29,
      "b": -1.1
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
    "hex": "#332448",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 51,
      "g": 36,
      "b": 72
    },
    "lab": {
      "l": 17.61,
      "a": 15.98,
      "b": -19.94
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
    "hex": "#1B2D33",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 27,
      "g": 45,
      "b": 51
    },
    "lab": {
      "l": 17.22,
      "a": -5.43,
      "b": -6.19
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
    "hex": "#36393E",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 54,
      "g": 57,
      "b": 62
    },
    "lab": {
      "l": 23.86,
      "a": -0.05,
      "b": -3.54
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
    "hex": "#007C9E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 124,
      "b": 158
    },
    "lab": {
      "l": 48.11,
      "a": -16.26,
      "b": -26.33
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
    "hex": "#4D3833",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 56,
      "b": 51
    },
    "lab": {
      "l": 25.7,
      "a": 8.51,
      "b": 6.76
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
    "hex": "#DF9361",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 223,
      "g": 147,
      "b": 97
    },
    "lab": {
      "l": 67.59,
      "a": 23.6,
      "b": 38.01
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
    "hex": "#201E24",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 32,
      "g": 30,
      "b": 36
    },
    "lab": {
      "l": 11.71,
      "a": 2.49,
      "b": -3.73
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
    "hex": "#606734",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 96,
      "g": 103,
      "b": 52
    },
    "lab": {
      "l": 41.9,
      "a": -11.23,
      "b": 27.7
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
    "hex": "#5B503B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 80,
      "b": 59
    },
    "lab": {
      "l": 34.55,
      "a": 0.97,
      "b": 14.07
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
    "hex": "#95A78D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 149,
      "g": 167,
      "b": 141
    },
    "lab": {
      "l": 66.48,
      "a": -11.28,
      "b": 11.35
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
    "hex": "#8E689C",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 142,
      "g": 104,
      "b": 156
    },
    "lab": {
      "l": 49.56,
      "a": 24.9,
      "b": -22.34
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
    "hex": "#8594EC",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 133,
      "g": 148,
      "b": 236
    },
    "lab": {
      "l": 63.52,
      "a": 16.96,
      "b": -46.1
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
    "hex": "#E9A35B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 233,
      "g": 163,
      "b": 91
    },
    "lab": {
      "l": 72.41,
      "a": 18.71,
      "b": 47.16
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
    "hex": "#F9C126",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 249,
      "g": 193,
      "b": 38
    },
    "lab": {
      "l": 80.97,
      "a": 7.3,
      "b": 76.87
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
    "hex": "#007A3D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 122,
      "b": 61
    },
    "lab": {
      "l": 44.6,
      "a": -43.9,
      "b": 25.3
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
    "hex": "#7D6443",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 125,
      "g": 100,
      "b": 67
    },
    "lab": {
      "l": 44.06,
      "a": 5.35,
      "b": 22.49
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
    "hex": "#005F4F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 95,
      "b": 79
    },
    "lab": {
      "l": 35.49,
      "a": -28.53,
      "b": 2.33
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
    "hex": "#5F9BC3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 95,
      "g": 155,
      "b": 195
    },
    "lab": {
      "l": 61.49,
      "a": -8.26,
      "b": -26.62
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
    "hex": "#787065",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 120,
      "g": 112,
      "b": 101
    },
    "lab": {
      "l": 47.65,
      "a": 1.08,
      "b": 7.23
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
    "hex": "#EFF3F5",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 239,
      "g": 243,
      "b": 245
    },
    "lab": {
      "l": 95.6,
      "a": -0.96,
      "b": -1.42
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
    "hex": "#F1D4AF",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 241,
      "g": 212,
      "b": 175
    },
    "lab": {
      "l": 86.45,
      "a": 4.64,
      "b": 22.04
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
    "hex": "#DBC6B3",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 219,
      "g": 198,
      "b": 179
    },
    "lab": {
      "l": 81.13,
      "a": 4.33,
      "b": 12.2
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
    "hex": "#005F5E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 95,
      "b": 94
    },
    "lab": {
      "l": 35.97,
      "a": -23.69,
      "b": -6.29
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
    "family": "Bone",
    "colorFamily": "bone",
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
    "hex": "#C3A77D",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 195,
      "g": 167,
      "b": 125
    },
    "lab": {
      "l": 69.98,
      "a": 4.17,
      "b": 25.53
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
    "hex": "#6B4C3B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 107,
      "g": 76,
      "b": 59
    },
    "lab": {
      "l": 35.22,
      "a": 10.74,
      "b": 15.28
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
    "hex": "#C24B7B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 194,
      "g": 75,
      "b": 123
    },
    "lab": {
      "l": 49.42,
      "a": 52.07,
      "b": -2.22
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
    "hex": "#3C392D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 60,
      "g": 57,
      "b": 45
    },
    "lab": {
      "l": 23.92,
      "a": -1.11,
      "b": 7.97
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
    "hex": "#4D3431",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 52,
      "b": 49
    },
    "lab": {
      "l": 24.5,
      "a": 10.8,
      "b": 6.41
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
    "hex": "#50545F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 80,
      "g": 84,
      "b": 95
    },
    "lab": {
      "l": 35.74,
      "a": 0.97,
      "b": -6.92
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
    "hex": "#FA733D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 250,
      "g": 115,
      "b": 61
    },
    "lab": {
      "l": 64.1,
      "a": 48.43,
      "b": 53.22
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
    "hex": "#D2B8A3",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 210,
      "g": 184,
      "b": 163
    },
    "lab": {
      "l": 76.45,
      "a": 6.01,
      "b": 14.09
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
    "hex": "#FB6826",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 104,
      "b": 38
    },
    "lab": {
      "l": 62.13,
      "a": 53.18,
      "b": 61.42
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
    "hex": "#B97434",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 185,
      "g": 116,
      "b": 52
    },
    "lab": {
      "l": 55.13,
      "a": 21.58,
      "b": 45.35
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
    "hex": "#9E5235",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 158,
      "g": 82,
      "b": 53
    },
    "lab": {
      "l": 43.6,
      "a": 28.97,
      "b": 30.9
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
    "hex": "#DC1F02",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 220,
      "g": 31,
      "b": 2
    },
    "lab": {
      "l": 47.24,
      "a": 67.91,
      "b": 60
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
    "hex": "#FF9721",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 255,
      "g": 151,
      "b": 33
    },
    "lab": {
      "l": 71.9,
      "a": 31.59,
      "b": 71.17
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
    "hex": "#E3D29A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 227,
      "g": 210,
      "b": 154
    },
    "lab": {
      "l": 84.36,
      "a": -2.34,
      "b": 29.94
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
    "hex": "#252732",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 37,
      "g": 39,
      "b": 50
    },
    "lab": {
      "l": 15.87,
      "a": 2.11,
      "b": -7.46
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
    "hex": "#E3A481",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 227,
      "g": 164,
      "b": 129
    },
    "lab": {
      "l": 72.54,
      "a": 19.05,
      "b": 27.36
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
    "hex": "#352008",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 53,
      "g": 32,
      "b": 8
    },
    "lab": {
      "l": 14.44,
      "a": 7.47,
      "b": 18.15
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
    "hex": "#F49AB5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 244,
      "g": 154,
      "b": 181
    },
    "lab": {
      "l": 73.34,
      "a": 37.07,
      "b": 0.24
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
    "hex": "#984496",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 152,
      "g": 68,
      "b": 150
    },
    "lab": {
      "l": 42.78,
      "a": 46.58,
      "b": -29.19
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
    "hex": "#823F84",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 130,
      "g": 63,
      "b": 132
    },
    "lab": {
      "l": 37.78,
      "a": 39.26,
      "b": -26.3
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
    "hex": "#63565B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 99,
      "g": 86,
      "b": 91
    },
    "lab": {
      "l": 37.96,
      "a": 6.28,
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
    "hex": "#EF4805",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 239,
      "g": 72,
      "b": 5
    },
    "lab": {
      "l": 55.07,
      "a": 61.81,
      "b": 65.06
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
    "hex": "#931C17",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 147,
      "g": 28,
      "b": 23
    },
    "lab": {
      "l": 32.03,
      "a": 47.96,
      "b": 34.68
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
    "hex": "#C17321",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 193,
      "g": 115,
      "b": 33
    },
    "lab": {
      "l": 55.8,
      "a": 24.8,
      "b": 54.54
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
    "hex": "#481E60",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 72,
      "g": 30,
      "b": 96
    },
    "lab": {
      "l": 20.64,
      "a": 32.47,
      "b": -31.08
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
    "hex": "#111015",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 17,
      "g": 16,
      "b": 21
    },
    "lab": {
      "l": 4.91,
      "a": 1.43,
      "b": -2.76
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
    "hex": "#954E48",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 149,
      "g": 78,
      "b": 72
    },
    "lab": {
      "l": 41.7,
      "a": 29.02,
      "b": 16.97
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
    "hex": "#C3CCD3",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 195,
      "g": 204,
      "b": 211
    },
    "lab": {
      "l": 81.56,
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
    "hex": "#0092E8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 146,
      "b": 232
    },
    "lab": {
      "l": 58.4,
      "a": -1.01,
      "b": -52.28
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
    "hex": "#404F5F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 64,
      "g": 79,
      "b": 95
    },
    "lab": {
      "l": 32.94,
      "a": -1.6,
      "b": -11.27
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
    "hex": "#50545D",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 80,
      "g": 84,
      "b": 93
    },
    "lab": {
      "l": 35.67,
      "a": 0.49,
      "b": -5.77
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
    "hex": "#D78F7E",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 215,
      "g": 143,
      "b": 126
    },
    "lab": {
      "l": 66.21,
      "a": 25.3,
      "b": 20.24
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
    "hex": "#00AFCB",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 175,
      "b": 203
    },
    "lab": {
      "l": 65.72,
      "a": -27.25,
      "b": -24.74
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
    "hex": "#324DD8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 50,
      "g": 77,
      "b": 216
    },
    "lab": {
      "l": 39.48,
      "a": 38.98,
      "b": -73.77
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
    "hex": "#573329",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 87,
      "g": 51,
      "b": 41
    },
    "lab": {
      "l": 25.43,
      "a": 15.01,
      "b": 13.2
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
    "hex": "#E7B78E",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 231,
      "g": 183,
      "b": 142
    },
    "lab": {
      "l": 77.76,
      "a": 11.93,
      "b": 27.46
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
    "hex": "#3D4247",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 61,
      "g": 66,
      "b": 71
    },
    "lab": {
      "l": 27.69,
      "a": -0.86,
      "b": -3.74
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
    "hex": "#FBAA22",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 170,
      "b": 34
    },
    "lab": {
      "l": 75.69,
      "a": 20.07,
      "b": 73.7
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
    "hex": "#C8F5F8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 200,
      "g": 245,
      "b": 248
    },
    "lab": {
      "l": 93.61,
      "a": -13.69,
      "b": -6.21
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
    "hex": "#C4B6A6",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 196,
      "g": 182,
      "b": 166
    },
    "lab": {
      "l": 74.79,
      "a": 2.29,
      "b": 9.94
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
    "hex": "#747F34",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 116,
      "g": 127,
      "b": 52
    },
    "lab": {
      "l": 50.85,
      "a": -15.5,
      "b": 38.6
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
    "hex": "#F1A84B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 241,
      "g": 168,
      "b": 75
    },
    "lab": {
      "l": 74.33,
      "a": 18.41,
      "b": 57.12
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
    "hex": "#A88237",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 168,
      "g": 130,
      "b": 55
    },
    "lab": {
      "l": 56.65,
      "a": 6.44,
      "b": 44.96
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
    "hex": "#2D3450",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 45,
      "g": 52,
      "b": 80
    },
    "lab": {
      "l": 22.28,
      "a": 5.35,
      "b": -18.06
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
    "hex": "#C7B8A8",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 199,
      "g": 184,
      "b": 168
    },
    "lab": {
      "l": 75.61,
      "a": 2.65,
      "b": 10.05
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
    "hex": "#D7B881",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 215,
      "g": 184,
      "b": 129
    },
    "lab": {
      "l": 76.26,
      "a": 3.59,
      "b": 32.06
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
    "hex": "#332553",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 51,
      "g": 37,
      "b": 83
    },
    "lab": {
      "l": 18.59,
      "a": 18.63,
      "b": -25.85
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
    "hex": "#47161C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 71,
      "g": 22,
      "b": 28
    },
    "lab": {
      "l": 15.47,
      "a": 24,
      "b": 8.31
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
    "hex": "#AC8DC7",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 172,
      "g": 141,
      "b": 199
    },
    "lab": {
      "l": 63.3,
      "a": 22.78,
      "b": -25.64
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
    "hex": "#5D4841",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 93,
      "g": 72,
      "b": 65
    },
    "lab": {
      "l": 32.58,
      "a": 7.76,
      "b": 7.62
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
    "hex": "#57441F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 87,
      "g": 68,
      "b": 31
    },
    "lab": {
      "l": 30.06,
      "a": 3.23,
      "b": 25.14
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
    "hex": "#613F31",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 97,
      "g": 63,
      "b": 49
    },
    "lab": {
      "l": 30.2,
      "a": 13.02,
      "b": 14.63
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
    "hex": "#181A1E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 24,
      "g": 26,
      "b": 30
    },
    "lab": {
      "l": 9.21,
      "a": 0.17,
      "b": -3.1
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
    "hex": "#006262",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 98,
      "b": 98
    },
    "lab": {
      "l": 37.14,
      "a": -23.86,
      "b": -7.01
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
    "hex": "#A42F23",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 164,
      "g": 47,
      "b": 35
    },
    "lab": {
      "l": 37.93,
      "a": 47.2,
      "b": 35
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
    "hex": "#E35A29",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 227,
      "g": 90,
      "b": 41
    },
    "lab": {
      "l": 55.9,
      "a": 50.99,
      "b": 53.25
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
    "hex": "#AA7E5B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 170,
      "g": 126,
      "b": 91
    },
    "lab": {
      "l": 56.31,
      "a": 12.58,
      "b": 25.68
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
    "hex": "#7A5A43",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 122,
      "g": 90,
      "b": 67
    },
    "lab": {
      "l": 40.99,
      "a": 9.96,
      "b": 18.4
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
    "hex": "#181715",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 24,
      "g": 23,
      "b": 21
    },
    "lab": {
      "l": 7.78,
      "a": 0,
      "b": 1.5
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
    "hex": "#6A1D22",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 106,
      "g": 29,
      "b": 34
    },
    "lab": {
      "l": 23.87,
      "a": 34.42,
      "b": 16.45
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
    "hex": "#834E44",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 131,
      "g": 78,
      "b": 68
    },
    "lab": {
      "l": 39.06,
      "a": 21.14,
      "b": 15.42
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
    "hex": "#784F49",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 120,
      "g": 79,
      "b": 73
    },
    "lab": {
      "l": 37.96,
      "a": 16.45,
      "b": 10.6
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
    "hex": "#AE8675",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 174,
      "g": 134,
      "b": 117
    },
    "lab": {
      "l": 59.28,
      "a": 12.85,
      "b": 15.05
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
    "hex": "#4B1E1D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 75,
      "g": 30,
      "b": 29
    },
    "lab": {
      "l": 17.98,
      "a": 21.26,
      "b": 11.09
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
    "hex": "#39463C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 57,
      "g": 70,
      "b": 60
    },
    "lab": {
      "l": 28.32,
      "a": -7.59,
      "b": 4.3
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
    "hex": "#3B241C",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 59,
      "g": 36,
      "b": 28
    },
    "lab": {
      "l": 16.87,
      "a": 9.82,
      "b": 9.84
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
    "hex": "#BBA68F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 166,
      "b": 143
    },
    "lab": {
      "l": 69.34,
      "a": 3.97,
      "b": 14.71
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
    "hex": "#371B13",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 27,
      "b": 19
    },
    "lab": {
      "l": 13.49,
      "a": 12.85,
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
    "hex": "#677784",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 103,
      "g": 119,
      "b": 132
    },
    "lab": {
      "l": 49.18,
      "a": -2.86,
      "b": -9.08
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
    "hex": "#541F13",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 84,
      "g": 31,
      "b": 19
    },
    "lab": {
      "l": 19.69,
      "a": 23.83,
      "b": 20.31
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
    "family": "Bone",
    "colorFamily": "bone",
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
    "hex": "#7B5240",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 123,
      "g": 82,
      "b": 64
    },
    "lab": {
      "l": 38.93,
      "a": 14.85,
      "b": 17.51
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
    "hex": "#329651",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 50,
      "g": 150,
      "b": 81
    },
    "lab": {
      "l": 55.16,
      "a": -44.52,
      "b": 28.1
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
    "hex": "#838785",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 131,
      "g": 135,
      "b": 133
    },
    "lab": {
      "l": 55.93,
      "a": -1.87,
      "b": 0.56
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
    "hex": "#6793D5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 103,
      "g": 147,
      "b": 213
    },
    "lab": {
      "l": 60.39,
      "a": 3.58,
      "b": -38.39
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
    "hex": "#E1201F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 225,
      "g": 32,
      "b": 31
    },
    "lab": {
      "l": 48.44,
      "a": 69.41,
      "b": 51.17
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
    "hex": "#D88D51",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 216,
      "g": 141,
      "b": 81
    },
    "lab": {
      "l": 65.16,
      "a": 22.78,
      "b": 43.19
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
    "hex": "#795643",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 121,
      "g": 86,
      "b": 67
    },
    "lab": {
      "l": 39.79,
      "a": 11.92,
      "b": 16.8
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
    "hex": "#F0EFEF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 240,
      "g": 239,
      "b": 239
    },
    "lab": {
      "l": 94.52,
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
    "hex": "#65443D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 68,
      "b": 61
    },
    "lab": {
      "l": 32.34,
      "a": 13.24,
      "b": 9.98
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
    "hex": "#333C44",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 60,
      "b": 68
    },
    "lab": {
      "l": 24.8,
      "a": -1.62,
      "b": -6.16
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
    "hex": "#7E9076",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 126,
      "g": 144,
      "b": 118
    },
    "lab": {
      "l": 57.74,
      "a": -11.57,
      "b": 11.69
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
    "hex": "#F3D43D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 212,
      "b": 61
    },
    "lab": {
      "l": 85.24,
      "a": -4.27,
      "b": 73.57
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
    "hex": "#8F8C7B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 143,
      "g": 140,
      "b": 123
    },
    "lab": {
      "l": 58.06,
      "a": -1.98,
      "b": 9.49
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
    "hex": "#311813",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 49,
      "g": 24,
      "b": 19
    },
    "lab": {
      "l": 11.64,
      "a": 11.88,
      "b": 8.82
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
    "hex": "#20282F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 32,
      "g": 40,
      "b": 47
    },
    "lab": {
      "l": 15.64,
      "a": -1.47,
      "b": -5.73
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
    "hex": "#006E82",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 110,
      "b": 130
    },
    "lab": {
      "l": 42.4,
      "a": -18.86,
      "b": -18.54
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
    "hex": "#CE4B97",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 206,
      "g": 75,
      "b": 151
    },
    "lab": {
      "l": 52.28,
      "a": 59.09,
      "b": -14.47
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
    "hex": "#CC893A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 204,
      "g": 137,
      "b": 58
    },
    "lab": {
      "l": 62.54,
      "a": 18.53,
      "b": 51.06
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
    "hex": "#1E1D22",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 30,
      "g": 29,
      "b": 34
    },
    "lab": {
      "l": 11.07,
      "a": 1.78,
      "b": -3.24
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
    "hex": "#BEB0D3",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 190,
      "g": 176,
      "b": 211
    },
    "lab": {
      "l": 74,
      "a": 11.67,
      "b": -15.85
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
    "hex": "#E6161E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 230,
      "g": 22,
      "b": 30
    },
    "lab": {
      "l": 48.88,
      "a": 72.33,
      "b": 52.41
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
    "hex": "#DC3A1E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 220,
      "g": 58,
      "b": 30
    },
    "lab": {
      "l": 49.91,
      "a": 61.08,
      "b": 52.42
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
    "hex": "#433C2A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 67,
      "g": 60,
      "b": 42
    },
    "lab": {
      "l": 25.54,
      "a": -0.22,
      "b": 12.26
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
    "hex": "#D9D5B2",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 217,
      "g": 213,
      "b": 178
    },
    "lab": {
      "l": 84.77,
      "a": -4.37,
      "b": 17.83
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
    "hex": "#0A0A08",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 10,
      "g": 10,
      "b": 8
    },
    "lab": {
      "l": 2.7,
      "a": -0.28,
      "b": 0.76
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
    "hex": "#1F1715",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 31,
      "g": 23,
      "b": 21
    },
    "lab": {
      "l": 8.64,
      "a": 3.61,
      "b": 2.86
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
    "hex": "#9F8563",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 159,
      "g": 133,
      "b": 99
    },
    "lab": {
      "l": 57.12,
      "a": 4.91,
      "b": 22.04
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
    "hex": "#A6621B",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 166,
      "g": 98,
      "b": 27
    },
    "lab": {
      "l": 48.16,
      "a": 22.27,
      "b": 48.69
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
    "hex": "#562729",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 86,
      "g": 39,
      "b": 41
    },
    "lab": {
      "l": 22.27,
      "a": 21.95,
      "b": 8.91
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
    "hex": "#473732",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 71,
      "g": 55,
      "b": 50
    },
    "lab": {
      "l": 24.65,
      "a": 6.22,
      "b": 5.84
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
    "hex": "#8E4B2B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 142,
      "g": 75,
      "b": 43
    },
    "lab": {
      "l": 39.51,
      "a": 25.47,
      "b": 31.18
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
    "hex": "#313539",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 49,
      "g": 53,
      "b": 57
    },
    "lab": {
      "l": 21.92,
      "a": -0.71,
      "b": -3.1
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
    "hex": "#735743",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 115,
      "g": 87,
      "b": 67
    },
    "lab": {
      "l": 39.36,
      "a": 8.64,
      "b": 16.09
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
    "hex": "#23201D",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 35,
      "g": 32,
      "b": 29
    },
    "lab": {
      "l": 12.47,
      "a": 0.74,
      "b": 2.55
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
    "hex": "#AC6E52",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 172,
      "g": 110,
      "b": 82
    },
    "lab": {
      "l": 52.44,
      "a": 21.55,
      "b": 25.77
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
    "hex": "#886A65",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 136,
      "g": 106,
      "b": 101
    },
    "lab": {
      "l": 47.6,
      "a": 11.15,
      "b": 7.38
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
    "hex": "#3D3935",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 61,
      "g": 57,
      "b": 53
    },
    "lab": {
      "l": 24.24,
      "a": 0.89,
      "b": 3.12
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
    "hex": "#003D87",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 61,
      "b": 135
    },
    "lab": {
      "l": 26.98,
      "a": 14.28,
      "b": -46
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
    "hex": "#67DCA8",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 103,
      "g": 220,
      "b": 168
    },
    "lab": {
      "l": 80.12,
      "a": -45.16,
      "b": 15.65
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
    "hex": "#BC8660",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 188,
      "g": 134,
      "b": 96
    },
    "lab": {
      "l": 60.42,
      "a": 16.18,
      "b": 28.62
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
    "hex": "#4F75B9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 79,
      "g": 117,
      "b": 185
    },
    "lab": {
      "l": 49.36,
      "a": 7.21,
      "b": -39.92
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
    "hex": "#113E26",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 17,
      "g": 62,
      "b": 38
    },
    "lab": {
      "l": 22.67,
      "a": -21.98,
      "b": 10.38
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
    "hex": "#8C1119",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 140,
      "g": 17,
      "b": 25
    },
    "lab": {
      "l": 29.53,
      "a": 48.81,
      "b": 30.59
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
    "hex": "#4E1750",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 78,
      "g": 23,
      "b": 80
    },
    "lab": {
      "l": 19.27,
      "a": 34,
      "b": -22.5
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
    "hex": "#3368A4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 51,
      "g": 104,
      "b": 164
    },
    "lab": {
      "l": 43.19,
      "a": 2.59,
      "b": -37.51
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
    "hex": "#311D3A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 49,
      "g": 29,
      "b": 58
    },
    "lab": {
      "l": 14.61,
      "a": 16.16,
      "b": -14.95
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
    "hex": "#7D6D8A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 125,
      "g": 109,
      "b": 138
    },
    "lab": {
      "l": 48.43,
      "a": 12.13,
      "b": -13.59
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
    "hex": "#338A26",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 51,
      "g": 138,
      "b": 38
    },
    "lab": {
      "l": 50.71,
      "a": -45.35,
      "b": 43.71
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
    "hex": "#91332D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 145,
      "g": 51,
      "b": 45
    },
    "lab": {
      "l": 35.16,
      "a": 39.3,
      "b": 25.01
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
    "hex": "#E84616",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 232,
      "g": 70,
      "b": 22
    },
    "lab": {
      "l": 53.6,
      "a": 60.48,
      "b": 59.24
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
    "hex": "#25323B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 37,
      "g": 50,
      "b": 59
    },
    "lab": {
      "l": 20,
      "a": -2.77,
      "b": -7.44
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
    "hex": "#49493F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 73,
      "g": 73,
      "b": 63
    },
    "lab": {
      "l": 30.74,
      "a": -2.07,
      "b": 6
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
    "hex": "#A94414",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 169,
      "g": 68,
      "b": 20
    },
    "lab": {
      "l": 42.19,
      "a": 39.25,
      "b": 46.51
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
    "hex": "#BC9E5E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 188,
      "g": 158,
      "b": 94
    },
    "lab": {
      "l": 66.49,
      "a": 2.8,
      "b": 37.37
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
    "hex": "#F67F34",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 246,
      "g": 127,
      "b": 52
    },
    "lab": {
      "l": 65.77,
      "a": 40.74,
      "b": 58.72
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
    "hex": "#A81E26",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 168,
      "g": 30,
      "b": 38
    },
    "lab": {
      "l": 36.74,
      "a": 54.21,
      "b": 32.22
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
    "hex": "#6C8B9C",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 108,
      "g": 139,
      "b": 156
    },
    "lab": {
      "l": 56.14,
      "a": -6.7,
      "b": -12.57
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
    "hex": "#853830",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 133,
      "g": 56,
      "b": 48
    },
    "lab": {
      "l": 34.04,
      "a": 32.46,
      "b": 21.31
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
    "hex": "#554E36",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 85,
      "g": 78,
      "b": 54
    },
    "lab": {
      "l": 33.24,
      "a": -1.29,
      "b": 15.29
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
    "hex": "#188C6F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 24,
      "g": 140,
      "b": 111
    },
    "lab": {
      "l": 51.95,
      "a": -37.77,
      "b": 6.88
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
    "hex": "#02ABF4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 2,
      "g": 171,
      "b": 244
    },
    "lab": {
      "l": 66.26,
      "a": -10.74,
      "b": -46.43
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
    "hex": "#B3823F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 179,
      "g": 130,
      "b": 63
    },
    "lab": {
      "l": 57.95,
      "a": 11.83,
      "b": 42.85
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
    "hex": "#98416B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 152,
      "g": 65,
      "b": 107
    },
    "lab": {
      "l": 40.44,
      "a": 41.13,
      "b": -6.46
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
    "family": "Green",
    "colorFamily": "green",
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
    "hex": "#6C7D92",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 108,
      "g": 125,
      "b": 146
    },
    "lab": {
      "l": 51.76,
      "a": -1.23,
      "b": -13.39
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
    "hex": "#82744A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 130,
      "g": 116,
      "b": 74
    },
    "lab": {
      "l": 49.17,
      "a": -0.92,
      "b": 25.17
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
    "hex": "#948277",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 148,
      "g": 130,
      "b": 119
    },
    "lab": {
      "l": 55.68,
      "a": 4.97,
      "b": 8.46
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
    "hex": "#924732",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 146,
      "g": 71,
      "b": 50
    },
    "lab": {
      "l": 39.33,
      "a": 29.82,
      "b": 27.08
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
    "hex": "#605A39",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 96,
      "g": 90,
      "b": 57
    },
    "lab": {
      "l": 38.01,
      "a": -3.08,
      "b": 19.95
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
    "hex": "#89623E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 137,
      "g": 98,
      "b": 62
    },
    "lab": {
      "l": 44.8,
      "a": 11.4,
      "b": 26.6
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
    "hex": "#AB7338",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 171,
      "g": 115,
      "b": 56
    },
    "lab": {
      "l": 53.18,
      "a": 16.28,
      "b": 40.75
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
    "hex": "#C91220",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 201,
      "g": 18,
      "b": 32
    },
    "lab": {
      "l": 42.7,
      "a": 65.48,
      "b": 43.81
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
    "hex": "#E2699D",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 226,
      "g": 105,
      "b": 157
    },
    "lab": {
      "l": 60.53,
      "a": 52.5,
      "b": -5.32
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
    "hex": "#21343D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 33,
      "g": 52,
      "b": 61
    },
    "lab": {
      "l": 20.5,
      "a": -4.83,
      "b": -8.07
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
    "hex": "#534651",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 83,
      "g": 70,
      "b": 81
    },
    "lab": {
      "l": 31.38,
      "a": 7.76,
      "b": -4.51
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
    "hex": "#D7342A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 215,
      "g": 52,
      "b": 42
    },
    "lab": {
      "l": 48.35,
      "a": 61.8,
      "b": 44.9
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
    "hex": "#A5C4D6",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 165,
      "g": 196,
      "b": 214
    },
    "lab": {
      "l": 77.48,
      "a": -6.45,
      "b": -12.43
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
    "hex": "#8B7A73",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 139,
      "g": 122,
      "b": 115
    },
    "lab": {
      "l": 52.56,
      "a": 5.31,
      "b": 6.23
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
    "hex": "#BFAEA8",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 191,
      "g": 174,
      "b": 168
    },
    "lab": {
      "l": 72.35,
      "a": 5.07,
      "b": 5.29
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
    "hex": "#074840",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 7,
      "g": 72,
      "b": 64
    },
    "lab": {
      "l": 26.88,
      "a": -21.2,
      "b": -0.67
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
    "hex": "#938C70",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 147,
      "g": 140,
      "b": 112
    },
    "lab": {
      "l": 58.16,
      "a": -2.16,
      "b": 15.93
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
    "hex": "#936546",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 147,
      "g": 101,
      "b": 70
    },
    "lab": {
      "l": 46.91,
      "a": 14.84,
      "b": 24.93
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
    "hex": "#1B5E5D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 27,
      "g": 94,
      "b": 93
    },
    "lab": {
      "l": 36.04,
      "a": -20.57,
      "b": -5.52
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
    "hex": "#235FB7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 35,
      "g": 95,
      "b": 183
    },
    "lab": {
      "l": 41.15,
      "a": 13.43,
      "b": -51.96
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
    "hex": "#B79B3E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 183,
      "g": 155,
      "b": 62
    },
    "lab": {
      "l": 64.85,
      "a": -0.22,
      "b": 51
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
    "hex": "#C77635",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 118,
      "b": 53
    },
    "lab": {
      "l": 57.42,
      "a": 26.49,
      "b": 47.84
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
    "hex": "#272C5E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 39,
      "g": 44,
      "b": 94
    },
    "lab": {
      "l": 20.21,
      "a": 14.26,
      "b": -30.66
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
    "hex": "#A86557",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 168,
      "g": 101,
      "b": 87
    },
    "lab": {
      "l": 49.88,
      "a": 25.43,
      "b": 19.43
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
    "hex": "#4EA7B2",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 78,
      "g": 167,
      "b": 178
    },
    "lab": {
      "l": 63.73,
      "a": -23.33,
      "b": -13.75
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
    "hex": "#A5AAAD",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 165,
      "g": 170,
      "b": 173
    },
    "lab": {
      "l": 69.3,
      "a": -1.18,
      "b": -2.16
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
    "hex": "#F595D9",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 245,
      "g": 149,
      "b": 217
    },
    "lab": {
      "l": 73.49,
      "a": 45.37,
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
    "hex": "#5C321D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 92,
      "g": 50,
      "b": 29
    },
    "lab": {
      "l": 25.7,
      "a": 16.84,
      "b": 21.38
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
    "hex": "#372922",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 41,
      "b": 34
    },
    "lab": {
      "l": 17.98,
      "a": 5.28,
      "b": 7.09
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
    "hex": "#3E3223",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 62,
      "g": 50,
      "b": 35
    },
    "lab": {
      "l": 21.68,
      "a": 2.83,
      "b": 11.58
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
    "hex": "#2A8893",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 42,
      "g": 136,
      "b": 147
    },
    "lab": {
      "l": 52.07,
      "a": -23.06,
      "b": -13.8
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
    "hex": "#F36D32",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 243,
      "g": 109,
      "b": 50
    },
    "lab": {
      "l": 61.85,
      "a": 48.31,
      "b": 55.71
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
    "hex": "#556E4E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 85,
      "g": 110,
      "b": 78
    },
    "lab": {
      "l": 43.7,
      "a": -15.93,
      "b": 14.94
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
    "hex": "#CD6B48",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 205,
      "g": 107,
      "b": 72
    },
    "lab": {
      "l": 56.05,
      "a": 35.83,
      "b": 36.82
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
    "hex": "#112432",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 17,
      "g": 36,
      "b": 50
    },
    "lab": {
      "l": 13.3,
      "a": -2.63,
      "b": -11.54
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
    "hex": "#5B3F3E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 63,
      "b": 62
    },
    "lab": {
      "l": 29.73,
      "a": 12.08,
      "b": 5.49
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
    "hex": "#C5997D",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 197,
      "g": 153,
      "b": 125
    },
    "lab": {
      "l": 66.62,
      "a": 12.59,
      "b": 21.03
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
    "family": "Yellow",
    "colorFamily": "yellow",
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
    "hex": "#BC4559",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 188,
      "g": 69,
      "b": 89
    },
    "lab": {
      "l": 46.54,
      "a": 49.38,
      "b": 14.19
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
    "hex": "#BFC894",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 191,
      "g": 200,
      "b": 148
    },
    "lab": {
      "l": 78.77,
      "a": -11.73,
      "b": 25.05
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
    "hex": "#423E3A",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 66,
      "g": 62,
      "b": 58
    },
    "lab": {
      "l": 26.47,
      "a": 0.87,
      "b": 3.07
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
    "hex": "#AD9D8F",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 173,
      "g": 157,
      "b": 143
    },
    "lab": {
      "l": 65.73,
      "a": 3.49,
      "b": 9.45
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
    "hex": "#DA8D32",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 218,
      "g": 141,
      "b": 50
    },
    "lab": {
      "l": 65.11,
      "a": 21.98,
      "b": 57.64
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
    "hex": "#57594D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 87,
      "g": 89,
      "b": 77
    },
    "lab": {
      "l": 37.31,
      "a": -3.23,
      "b": 6.68
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
    "hex": "#0EB9CE",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 14,
      "g": 185,
      "b": 206
    },
    "lab": {
      "l": 68.93,
      "a": -30.76,
      "b": -21.49
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
    "hex": "#6F3022",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 111,
      "g": 48,
      "b": 34
    },
    "lab": {
      "l": 28.41,
      "a": 26.82,
      "b": 22.26
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
    "hex": "#006EBA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 110,
      "b": 186
    },
    "lab": {
      "l": 45.21,
      "a": 2.92,
      "b": -47.22
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
    "hex": "#34302C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 52,
      "g": 48,
      "b": 44
    },
    "lab": {
      "l": 20.15,
      "a": 0.93,
      "b": 3.2
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
    "hex": "#361B24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 54,
      "g": 27,
      "b": 36
    },
    "lab": {
      "l": 13.8,
      "a": 14.72,
      "b": -0.3
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
    "hex": "#957AAD",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 149,
      "g": 122,
      "b": 173
    },
    "lab": {
      "l": 55.41,
      "a": 20.47,
      "b": -23.18
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
    "hex": "#907A66",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 144,
      "g": 122,
      "b": 102
    },
    "lab": {
      "l": 52.74,
      "a": 5.31,
      "b": 14.12
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
    "hex": "#8C1B1E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 140,
      "g": 27,
      "b": 30
    },
    "lab": {
      "l": 30.53,
      "a": 46.32,
      "b": 28.61
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
    "hex": "#BD683F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 189,
      "g": 104,
      "b": 63
    },
    "lab": {
      "l": 53.04,
      "a": 30.44,
      "b": 37.57
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
    "hex": "#513426",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 81,
      "g": 52,
      "b": 38
    },
    "lab": {
      "l": 24.78,
      "a": 11.2,
      "b": 14.16
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
    "hex": "#9C3036",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 156,
      "g": 48,
      "b": 54
    },
    "lab": {
      "l": 36.84,
      "a": 45.04,
      "b": 21.95
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
    "hex": "#362C2C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 54,
      "g": 44,
      "b": 44
    },
    "lab": {
      "l": 19.09,
      "a": 4.58,
      "b": 1.71
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
    "hex": "#20B1E6",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 32,
      "g": 177,
      "b": 230
    },
    "lab": {
      "l": 67.62,
      "a": -17.77,
      "b": -36.65
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
    "hex": "#014E69",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 78,
      "b": 105
    },
    "lab": {
      "l": 30.58,
      "a": -9.92,
      "b": -21.43
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
    "hex": "#879D19",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 135,
      "g": 157,
      "b": 25
    },
    "lab": {
      "l": 61.08,
      "a": -24.19,
      "b": 59.36
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
    "hex": "#F4BD0B",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 244,
      "g": 189,
      "b": 11
    },
    "lab": {
      "l": 79.42,
      "a": 6.81,
      "b": 80.29
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
    "hex": "#354A59",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 53,
      "g": 74,
      "b": 89
    },
    "lab": {
      "l": 30.34,
      "a": -3.81,
      "b": -11.46
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
    "hex": "#393532",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 57,
      "g": 53,
      "b": 50
    },
    "lab": {
      "l": 22.47,
      "a": 1.11,
      "b": 2.52
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
    "hex": "#BC9E76",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 188,
      "g": 158,
      "b": 118
    },
    "lab": {
      "l": 66.87,
      "a": 5.37,
      "b": 25.05
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
    "hex": "#F27A18",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 242,
      "g": 122,
      "b": 24
    },
    "lab": {
      "l": 64.05,
      "a": 40.99,
      "b": 66.86
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
    "hex": "#6B4786",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 107,
      "g": 71,
      "b": 134
    },
    "lab": {
      "l": 36.66,
      "a": 28.11,
      "b": -29.5
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
    "hex": "#7B3917",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 123,
      "g": 57,
      "b": 23
    },
    "lab": {
      "l": 32.26,
      "a": 26.34,
      "b": 33.37
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
    "hex": "#79347B",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 121,
      "g": 52,
      "b": 123
    },
    "lab": {
      "l": 33.88,
      "a": 40.53,
      "b": -26.93
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
    "hex": "#7E4532",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 126,
      "g": 69,
      "b": 50
    },
    "lab": {
      "l": 35.84,
      "a": 22.49,
      "b": 22.1
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
    "hex": "#F4D060",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 244,
      "g": 208,
      "b": 96
    },
    "lab": {
      "l": 84.58,
      "a": 0.03,
      "b": 59.01
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
    "hex": "#611A33",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 97,
      "g": 26,
      "b": 51
    },
    "lab": {
      "l": 22.02,
      "a": 34.08,
      "b": 1.95
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
    "hex": "#66AC28",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 102,
      "g": 172,
      "b": 40
    },
    "lab": {
      "l": 63.74,
      "a": -43.29,
      "b": 56.64
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
    "hex": "#A08A71",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 160,
      "g": 138,
      "b": 113
    },
    "lab": {
      "l": 58.83,
      "a": 4.38,
      "b": 16.47
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
    "hex": "#B38D7B",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 179,
      "g": 141,
      "b": 123
    },
    "lab": {
      "l": 61.71,
      "a": 11.75,
      "b": 15.1
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
    "hex": "#183B3B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 24,
      "g": 59,
      "b": 59
    },
    "lab": {
      "l": 22.44,
      "a": -12.55,
      "b": -3.87
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
    "hex": "#90AC64",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 144,
      "g": 172,
      "b": 100
    },
    "lab": {
      "l": 66.79,
      "a": -21.98,
      "b": 33.86
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
    "hex": "#D6D2C9",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 214,
      "g": 210,
      "b": 201
    },
    "lab": {
      "l": 84.28,
      "a": -0.21,
      "b": 4.94
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
    "hex": "#EBDCB5",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 235,
      "g": 220,
      "b": 181
    },
    "lab": {
      "l": 88.06,
      "a": -0.91,
      "b": 21.05
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
    "hex": "#91634C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 145,
      "g": 99,
      "b": 76
    },
    "lab": {
      "l": 46.27,
      "a": 15.76,
      "b": 20.55
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
    "hex": "#CCB591",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 204,
      "g": 181,
      "b": 145
    },
    "lab": {
      "l": 74.78,
      "a": 2.79,
      "b": 21.39
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
    "hex": "#281721",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 40,
      "g": 23,
      "b": 33
    },
    "lab": {
      "l": 10.36,
      "a": 10.55,
      "b": -3.42
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
    "hex": "#1D2C31",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 29,
      "g": 44,
      "b": 49
    },
    "lab": {
      "l": 16.91,
      "a": -4.72,
      "b": -5.25
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
    "hex": "#1A3C81",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 26,
      "g": 60,
      "b": 129
    },
    "lab": {
      "l": 26.84,
      "a": 14.48,
      "b": -42.46
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
    "hex": "#302D29",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 45,
      "b": 41
    },
    "lab": {
      "l": 18.65,
      "a": 0.47,
      "b": 3.07
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
    "hex": "#4A5F7B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 74,
      "g": 95,
      "b": 123
    },
    "lab": {
      "l": 39.7,
      "a": -0.24,
      "b": -18.26
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
    "hex": "#12261F",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 18,
      "g": 38,
      "b": 31
    },
    "lab": {
      "l": 13.31,
      "a": -10.25,
      "b": 2.12
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
    "hex": "#FDAB1E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 253,
      "g": 171,
      "b": 30
    },
    "lab": {
      "l": 76.14,
      "a": 20.3,
      "b": 75.13
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
    "hex": "#A5AB7F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 165,
      "g": 171,
      "b": 127
    },
    "lab": {
      "l": 68.5,
      "a": -9.61,
      "b": 22.01
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
    "hex": "#0D2C38",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 13,
      "g": 44,
      "b": 56
    },
    "lab": {
      "l": 16.37,
      "a": -6.73,
      "b": -11.05
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
    "hex": "#6559A9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 101,
      "g": 89,
      "b": 169
    },
    "lab": {
      "l": 42.42,
      "a": 24.82,
      "b": -41.48
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
    "hex": "#CECBCB",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 206,
      "g": 203,
      "b": 203
    },
    "lab": {
      "l": 81.92,
      "a": 1.03,
      "b": 0.37
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
    "hex": "#CD4417",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 205,
      "g": 68,
      "b": 23
    },
    "lab": {
      "l": 48.49,
      "a": 52.35,
      "b": 52.98
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
    "hex": "#0397ED",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 3,
      "g": 151,
      "b": 237
    },
    "lab": {
      "l": 60.13,
      "a": -1.96,
      "b": -52.3
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
    "hex": "#2B5329",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 43,
      "g": 83,
      "b": 41
    },
    "lab": {
      "l": 31.49,
      "a": -23.94,
      "b": 20.25
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
    "hex": "#019CA8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 156,
      "b": 168
    },
    "lab": {
      "l": 58.61,
      "a": -29.42,
      "b": -15.99
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
    "hex": "#DF7468",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 223,
      "g": 116,
      "b": 104
    },
    "lab": {
      "l": 60.94,
      "a": 40.46,
      "b": 25.68
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
    "hex": "#A37C63",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 163,
      "g": 124,
      "b": 99
    },
    "lab": {
      "l": 55.18,
      "a": 11.68,
      "b": 19.5
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
    "hex": "#3E4547",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 69,
      "b": 71
    },
    "lab": {
      "l": 28.73,
      "a": -2.38,
      "b": -2.18
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
    "hex": "#F2A883",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 242,
      "g": 168,
      "b": 131
    },
    "lab": {
      "l": 75.16,
      "a": 23.04,
      "b": 30.05
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
    "hex": "#705239",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 112,
      "g": 82,
      "b": 57
    },
    "lab": {
      "l": 37.44,
      "a": 9.11,
      "b": 19.54
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
    "hex": "#734516",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 115,
      "g": 69,
      "b": 22
    },
    "lab": {
      "l": 33.9,
      "a": 15.68,
      "b": 35.05
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
    "hex": "#E5B87E",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 229,
      "g": 184,
      "b": 126
    },
    "lab": {
      "l": 77.55,
      "a": 8.89,
      "b": 35.55
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
    "hex": "#79482F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 121,
      "g": 72,
      "b": 47
    },
    "lab": {
      "l": 35.8,
      "a": 18.26,
      "b": 23.71
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
    "hex": "#B97259",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 185,
      "g": 114,
      "b": 89
    },
    "lab": {
      "l": 55.15,
      "a": 25.35,
      "b": 25.63
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
    "hex": "#E9F565",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 233,
      "g": 245,
      "b": 101
    },
    "lab": {
      "l": 93.26,
      "a": -22.44,
      "b": 66.2
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
    "hex": "#0F0D0E",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 15,
      "g": 13,
      "b": 14
    },
    "lab": {
      "l": 3.8,
      "a": 0.82,
      "b": -0.23
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
    "hex": "#0A0A0C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 10,
      "g": 10,
      "b": 12
    },
    "lab": {
      "l": 2.78,
      "a": 0.29,
      "b": -0.8
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
    "hex": "#1F1E23",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 31,
      "g": 30,
      "b": 35
    },
    "lab": {
      "l": 11.56,
      "a": 1.77,
      "b": -3.23
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
    "hex": "#51211B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 81,
      "g": 33,
      "b": 27
    },
    "lab": {
      "l": 19.71,
      "a": 21.95,
      "b": 14.91
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
    "hex": "#241720",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 36,
      "g": 23,
      "b": 32
    },
    "lab": {
      "l": 9.74,
      "a": 8.47,
      "b": -3.66
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
    "hex": "#D4211B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 212,
      "g": 33,
      "b": 27
    },
    "lab": {
      "l": 45.86,
      "a": 65.63,
      "b": 49.85
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
    "hex": "#002074",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 32,
      "b": 116
    },
    "lab": {
      "l": 16.96,
      "a": 26.9,
      "b": -50.38
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
    "family": "Blue",
    "colorFamily": "blue",
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
    "hex": "#76858C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 118,
      "g": 133,
      "b": 140
    },
    "lab": {
      "l": 54.57,
      "a": -3.9,
      "b": -5.61
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
    "hex": "#C4B194",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 196,
      "g": 177,
      "b": 148
    },
    "lab": {
      "l": 73.1,
      "a": 2.24,
      "b": 17.34
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
    "hex": "#9D760E",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 157,
      "g": 118,
      "b": 14
    },
    "lab": {
      "l": 52.02,
      "a": 6.51,
      "b": 55.37
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
    "hex": "#995732",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 153,
      "g": 87,
      "b": 50
    },
    "lab": {
      "l": 43.97,
      "a": 23.87,
      "b": 32.84
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
    "hex": "#A85F3B",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 168,
      "g": 95,
      "b": 59
    },
    "lab": {
      "l": 48.04,
      "a": 26.38,
      "b": 33.15
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
    "hex": "#719362",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 113,
      "g": 147,
      "b": 98
    },
    "lab": {
      "l": 57.33,
      "a": -21.43,
      "b": 22.21
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
    "hex": "#FA490F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 250,
      "g": 73,
      "b": 15
    },
    "lab": {
      "l": 57.2,
      "a": 65,
      "b": 65.16
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
    "hex": "#4A3B09",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 74,
      "g": 59,
      "b": 9
    },
    "lab": {
      "l": 25.57,
      "a": 0.84,
      "b": 31.03
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
    "hex": "#404B45",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 64,
      "g": 75,
      "b": 69
    },
    "lab": {
      "l": 30.76,
      "a": -5.81,
      "b": 2.09
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
    "family": "Orange",
    "colorFamily": "orange",
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
    "hex": "#A25E5F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 162,
      "g": 94,
      "b": 95
    },
    "lab": {
      "l": 47.64,
      "a": 27.8,
      "b": 11.48
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
    "hex": "#9A6849",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 154,
      "g": 104,
      "b": 73
    },
    "lab": {
      "l": 48.58,
      "a": 16.45,
      "b": 25.51
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
    "hex": "#D1AD6F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 209,
      "g": 173,
      "b": 111
    },
    "lab": {
      "l": 72.62,
      "a": 5.11,
      "b": 36.66
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
    "hex": "#5A4F4C",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 90,
      "g": 79,
      "b": 76
    },
    "lab": {
      "l": 34.57,
      "a": 3.98,
      "b": 3.44
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
    "hex": "#64271F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 100,
      "g": 39,
      "b": 31
    },
    "lab": {
      "l": 24.51,
      "a": 26.96,
      "b": 18.99
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
    "hex": "#5B3D2E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 61,
      "b": 46
    },
    "lab": {
      "l": 28.8,
      "a": 11.13,
      "b": 14.54
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
    "hex": "#37261F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 38,
      "b": 31
    },
    "lab": {
      "l": 16.98,
      "a": 6.87,
      "b": 7.8
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
    "hex": "#2B2E27",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 43,
      "g": 46,
      "b": 39
    },
    "lab": {
      "l": 18.43,
      "a": -2.95,
      "b": 4.07
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
    "family": "Grey",
    "colorFamily": "grey",
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
    "hex": "#645140",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 100,
      "g": 81,
      "b": 64
    },
    "lab": {
      "l": 35.92,
      "a": 5.16,
      "b": 12.99
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
    "hex": "#444732",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 68,
      "g": 71,
      "b": 50
    },
    "lab": {
      "l": 29.33,
      "a": -5.4,
      "b": 12.26
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
    "hex": "#9B8935",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 155,
      "g": 137,
      "b": 53
    },
    "lab": {
      "l": 57.19,
      "a": -3.42,
      "b": 46.08
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
    "hex": "#63573F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 99,
      "g": 87,
      "b": 63
    },
    "lab": {
      "l": 37.53,
      "a": 0.9,
      "b": 15.77
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
    "hex": "#91000D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 145,
      "g": 0,
      "b": 13
    },
    "lab": {
      "l": 29.54,
      "a": 52.79,
      "b": 37.63
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
    "hex": "#7A2F28",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 122,
      "g": 47,
      "b": 40
    },
    "lab": {
      "l": 30.22,
      "a": 32.22,
      "b": 21.14
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
    "hex": "#4F4B30",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 79,
      "g": 75,
      "b": 48
    },
    "lab": {
      "l": 31.6,
      "a": -3.08,
      "b": 16.71
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
    "hex": "#131114",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 19,
      "g": 17,
      "b": 20
    },
    "lab": {
      "l": 5.33,
      "a": 1.42,
      "b": -1.46
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
    "hex": "#39261E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 57,
      "g": 38,
      "b": 30
    },
    "lab": {
      "l": 17.23,
      "a": 7.73,
      "b": 8.88
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
    "hex": "#6F493C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 111,
      "g": 73,
      "b": 60
    },
    "lab": {
      "l": 34.95,
      "a": 14.5,
      "b": 14.38
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
    "hex": "#4D382A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 56,
      "b": 42
    },
    "lab": {
      "l": 25.48,
      "a": 7.19,
      "b": 12.38
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
    "hex": "#A49F9F",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 164,
      "g": 159,
      "b": 159
    },
    "lab": {
      "l": 65.9,
      "a": 1.81,
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
    "hex": "#F13900",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 241,
      "g": 57,
      "b": 0
    },
    "lab": {
      "l": 53.64,
      "a": 67.36,
      "b": 65.68
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
    "hex": "#E0E4E6",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 224,
      "g": 228,
      "b": 230
    },
    "lab": {
      "l": 90.34,
      "a": -0.98,
      "b": -1.44
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
    "hex": "#15141D",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 21,
      "g": 20,
      "b": 29
    },
    "lab": {
      "l": 6.76,
      "a": 2.86,
      "b": -6.06
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
    "hex": "#B86F49",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 184,
      "g": 111,
      "b": 73
    },
    "lab": {
      "l": 54.07,
      "a": 25.25,
      "b": 33.2
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
    "hex": "#A03B0E",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 160,
      "g": 59,
      "b": 14
    },
    "lab": {
      "l": 38.96,
      "a": 40,
      "b": 45.59
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
    "hex": "#A26F52",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 162,
      "g": 111,
      "b": 82
    },
    "lab": {
      "l": 51.45,
      "a": 16.76,
      "b": 24.26
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
    "hex": "#DECDB9",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 222,
      "g": 205,
      "b": 185
    },
    "lab": {
      "l": 83.28,
      "a": 2.67,
      "b": 12.1
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
    "hex": "#6A625C",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 106,
      "g": 98,
      "b": 92
    },
    "lab": {
      "l": 42.11,
      "a": 2.03,
      "b": 4.56
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
    "hex": "#213EA4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 33,
      "g": 62,
      "b": 164
    },
    "lab": {
      "l": 30.52,
      "a": 27.81,
      "b": -57.95
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
    "hex": "#3A3F43",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 58,
      "g": 63,
      "b": 67
    },
    "lab": {
      "l": 26.33,
      "a": -1.11,
      "b": -3.16
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
    "family": "Bone",
    "colorFamily": "bone",
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
    "hex": "#C7894C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 199,
      "g": 137,
      "b": 76
    },
    "lab": {
      "l": 62.13,
      "a": 17.48,
      "b": 41.69
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
    "hex": "#4F241D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 79,
      "g": 36,
      "b": 29
    },
    "lab": {
      "l": 20.1,
      "a": 19.44,
      "b": 13.98
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
    "hex": "#1A3224",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 26,
      "g": 50,
      "b": 36
    },
    "lab": {
      "l": 18.49,
      "a": -13.32,
      "b": 6.03
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
    "family": "Yellow",
    "colorFamily": "yellow",
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
    "hex": "#2F363B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 47,
      "g": 54,
      "b": 59
    },
    "lab": {
      "l": 22.15,
      "a": -1.66,
      "b": -4.13
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
    "hex": "#212025",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 33,
      "g": 32,
      "b": 37
    },
    "lab": {
      "l": 12.54,
      "a": 1.75,
      "b": -3.2
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
    "hex": "#0C1337",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 12,
      "g": 19,
      "b": 55
    },
    "lab": {
      "l": 7.4,
      "a": 11.32,
      "b": -24.52
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
    "hex": "#300E26",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 48,
      "g": 14,
      "b": 38
    },
    "lab": {
      "l": 9.66,
      "a": 20.81,
      "b": -8.1
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
    "hex": "#4F100E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 79,
      "g": 16,
      "b": 14
    },
    "lab": {
      "l": 15.83,
      "a": 29,
      "b": 18.27
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
    "hex": "#875659",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 135,
      "g": 86,
      "b": 89
    },
    "lab": {
      "l": 42.04,
      "a": 20.75,
      "b": 6.73
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
    "hex": "#382624",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 56,
      "g": 38,
      "b": 36
    },
    "lab": {
      "l": 17.25,
      "a": 8.16,
      "b": 4.69
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
    "hex": "#CEA971",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 206,
      "g": 169,
      "b": 113
    },
    "lab": {
      "l": 71.35,
      "a": 6.22,
      "b": 33.93
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
    "hex": "#0F2429",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 15,
      "g": 36,
      "b": 41
    },
    "lab": {
      "l": 12.76,
      "a": -6.62,
      "b": -5.92
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
    "hex": "#353E40",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 53,
      "g": 62,
      "b": 64
    },
    "lab": {
      "l": 25.48,
      "a": -3.21,
      "b": -2.48
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
    "hex": "#373D40",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 55,
      "g": 61,
      "b": 64
    },
    "lab": {
      "l": 25.32,
      "a": -1.76,
      "b": -2.7
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
    "hex": "#C91813",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 201,
      "g": 24,
      "b": 19
    },
    "lab": {
      "l": 42.95,
      "a": 64.28,
      "b": 50.15
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
    "hex": "#958532",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 149,
      "g": 133,
      "b": 50
    },
    "lab": {
      "l": 55.48,
      "a": -4.11,
      "b": 45.44
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
    "hex": "#C3B16F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 195,
      "g": 177,
      "b": 111
    },
    "lab": {
      "l": 72.36,
      "a": -2.77,
      "b": 36.06
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
    "hex": "#E4E4E3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 228,
      "g": 228,
      "b": 227
    },
    "lab": {
      "l": 90.56,
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
    "hex": "#B8B6A1",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 184,
      "g": 182,
      "b": 161
    },
    "lab": {
      "l": 73.69,
      "a": -2.96,
      "b": 10.95
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
    "hex": "#015E40",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 94,
      "b": 64
    },
    "lab": {
      "l": 34.76,
      "a": -32.22,
      "b": 10.55
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
    "hex": "#5A1E42",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 90,
      "g": 30,
      "b": 66
    },
    "lab": {
      "l": 21.93,
      "a": 31.81,
      "b": -8.67
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
    "hex": "#1BB2EF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 27,
      "g": 178,
      "b": 239
    },
    "lab": {
      "l": 68.24,
      "a": -15.47,
      "b": -40.59
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
    "hex": "#F9BE2B",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 249,
      "g": 190,
      "b": 43
    },
    "lab": {
      "l": 80.26,
      "a": 8.98,
      "b": 74.94
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
    "family": "Orange",
    "colorFamily": "orange",
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
    "family": "Yellow",
    "colorFamily": "yellow",
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
    "hex": "#A78667",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 167,
      "g": 134,
      "b": 103
    },
    "lab": {
      "l": 58.27,
      "a": 8.19,
      "b": 21.47
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
    "hex": "#A9833E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 169,
      "g": 131,
      "b": 62
    },
    "lab": {
      "l": 57.09,
      "a": 6.79,
      "b": 42.08
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
    "hex": "#B5864E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 181,
      "g": 134,
      "b": 78
    },
    "lab": {
      "l": 59.37,
      "a": 11.59,
      "b": 36.87
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
    "hex": "#5B593C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 91,
      "g": 89,
      "b": 60
    },
    "lab": {
      "l": 37.29,
      "a": -4.34,
      "b": 17.12
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
    "hex": "#584D4B",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 88,
      "g": 77,
      "b": 75
    },
    "lab": {
      "l": 33.75,
      "a": 4.19,
      "b": 2.86
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
    "hex": "#413837",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 65,
      "g": 56,
      "b": 55
    },
    "lab": {
      "l": 24.41,
      "a": 3.75,
      "b": 2.08
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
    "hex": "#6F522B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 111,
      "g": 82,
      "b": 43
    },
    "lab": {
      "l": 37.09,
      "a": 7.26,
      "b": 27.3
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
    "hex": "#159DC8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 21,
      "g": 157,
      "b": 200
    },
    "lab": {
      "l": 60.28,
      "a": -18.2,
      "b": -31.45
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
    "hex": "#ECA675",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 236,
      "g": 166,
      "b": 117
    },
    "lab": {
      "l": 73.8,
      "a": 20.4,
      "b": 35.59
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
    "hex": "#5776C4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 87,
      "g": 118,
      "b": 196
    },
    "lab": {
      "l": 50.65,
      "a": 11.94,
      "b": -44.18
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
    "hex": "#EFD6B8",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 239,
      "g": 214,
      "b": 184
    },
    "lab": {
      "l": 86.95,
      "a": 4.08,
      "b": 18
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
    "hex": "#007A6E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 122,
      "b": 110
    },
    "lab": {
      "l": 45.69,
      "a": -31.68,
      "b": -1.62
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
    "hex": "#41392A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 65,
      "g": 57,
      "b": 42
    },
    "lab": {
      "l": 24.38,
      "a": 0.76,
      "b": 10.65
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
    "hex": "#6A4A1D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 106,
      "g": 74,
      "b": 29
    },
    "lab": {
      "l": 34.09,
      "a": 8.7,
      "b": 31.38
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
    "hex": "#231114",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 35,
      "g": 17,
      "b": 20
    },
    "lab": {
      "l": 7.31,
      "a": 9.83,
      "b": 1.67
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
    "hex": "#41392A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 65,
      "g": 57,
      "b": 42
    },
    "lab": {
      "l": 24.38,
      "a": 0.76,
      "b": 10.65
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
    "hex": "#2A312A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 42,
      "g": 49,
      "b": 42
    },
    "lab": {
      "l": 19.46,
      "a": -4.71,
      "b": 3.46
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
    "hex": "#E75D5A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 231,
      "g": 93,
      "b": 90
    },
    "lab": {
      "l": 57.62,
      "a": 53.33,
      "b": 29.55
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
    "family": "Green",
    "colorFamily": "green",
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
    "hex": "#42545C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 66,
      "g": 84,
      "b": 92
    },
    "lab": {
      "l": 34.54,
      "a": -4.85,
      "b": -6.94
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
    "hex": "#294E9E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 41,
      "g": 78,
      "b": 158
    },
    "lab": {
      "l": 34.78,
      "a": 15.65,
      "b": -47.39
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
    "hex": "#71481B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 113,
      "g": 72,
      "b": 27
    },
    "lab": {
      "l": 34.45,
      "a": 13.17,
      "b": 33.06
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
    "hex": "#D28A58",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 210,
      "g": 138,
      "b": 88
    },
    "lab": {
      "l": 63.82,
      "a": 22.42,
      "b": 37.78
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
    "hex": "#275724",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 39,
      "g": 87,
      "b": 36
    },
    "lab": {
      "l": 32.65,
      "a": -27.95,
      "b": 24.48
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
    "hex": "#B40A16",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 180,
      "g": 10,
      "b": 22
    },
    "lab": {
      "l": 37.81,
      "a": 60.82,
      "b": 42.97
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
    "hex": "#F9AD24",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 249,
      "g": 173,
      "b": 36
    },
    "lab": {
      "l": 76.17,
      "a": 17.69,
      "b": 73.47
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
    "hex": "#02A588",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 2,
      "g": 165,
      "b": 136
    },
    "lab": {
      "l": 60.51,
      "a": -43.09,
      "b": 4.92
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
    "family": "Grey",
    "colorFamily": "grey",
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
    "hex": "#938265",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 147,
      "g": 130,
      "b": 101
    },
    "lab": {
      "l": 55.18,
      "a": 1.85,
      "b": 18.1
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
    "hex": "#242B31",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 36,
      "g": 43,
      "b": 49
    },
    "lab": {
      "l": 17.11,
      "a": -1.39,
      "b": -4.9
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
    "hex": "#D77063",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 215,
      "g": 112,
      "b": 99
    },
    "lab": {
      "l": 58.92,
      "a": 39.08,
      "b": 25.64
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
    "hex": "#42453C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 66,
      "g": 69,
      "b": 60
    },
    "lab": {
      "l": 28.75,
      "a": -3.19,
      "b": 5.02
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
    "hex": "#40564C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 64,
      "g": 86,
      "b": 76
    },
    "lab": {
      "l": 34.53,
      "a": -10.8,
      "b": 3.09
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
    "hex": "#CFB566",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 207,
      "g": 181,
      "b": 102
    },
    "lab": {
      "l": 74.36,
      "a": -0.8,
      "b": 43.38
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
    "hex": "#82C7AA",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 130,
      "g": 199,
      "b": 170
    },
    "lab": {
      "l": 75.13,
      "a": -28.13,
      "b": 7.67
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
    "hex": "#C0CAED",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 192,
      "g": 202,
      "b": 237
    },
    "lab": {
      "l": 81.6,
      "a": 3.76,
      "b": -18.4
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
    "hex": "#B76E21",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 183,
      "g": 110,
      "b": 33
    },
    "lab": {
      "l": 53.31,
      "a": 23.23,
      "b": 51.82
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
    "hex": "#060608",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 6,
      "g": 6,
      "b": 8
    },
    "lab": {
      "l": 1.68,
      "a": 0.28,
      "b": -0.76
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
    "hex": "#647C40",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 100,
      "g": 124,
      "b": 64
    },
    "lab": {
      "l": 48.88,
      "a": -19.49,
      "b": 29.8
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
    "hex": "#9C7D22",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 156,
      "g": 125,
      "b": 34
    },
    "lab": {
      "l": 53.87,
      "a": 2.7,
      "b": 50.77
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
    "hex": "#93824A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 147,
      "g": 130,
      "b": 74
    },
    "lab": {
      "l": 54.72,
      "a": -1.37,
      "b": 32.52
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
    "hex": "#C68B3B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 198,
      "g": 139,
      "b": 59
    },
    "lab": {
      "l": 62.33,
      "a": 14.9,
      "b": 50.16
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
    "hex": "#FD8E23",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 253,
      "g": 142,
      "b": 35
    },
    "lab": {
      "l": 69.72,
      "a": 35.45,
      "b": 68.76
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
    "hex": "#F9AA44",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 249,
      "g": 170,
      "b": 68
    },
    "lab": {
      "l": 75.64,
      "a": 20.34,
      "b": 61.81
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
    "hex": "#5F3C30",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 95,
      "g": 60,
      "b": 48
    },
    "lab": {
      "l": 29.1,
      "a": 13.85,
      "b": 13.76
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
    "hex": "#66211B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 102,
      "g": 33,
      "b": 27
    },
    "lab": {
      "l": 23.65,
      "a": 30.62,
      "b": 20.63
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
    "family": "Brown",
    "colorFamily": "brown",
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
    "hex": "#6E705B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 110,
      "g": 112,
      "b": 91
    },
    "lab": {
      "l": 46.52,
      "a": -4.73,
      "b": 11.45
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
    "hex": "#B08347",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 176,
      "g": 131,
      "b": 71
    },
    "lab": {
      "l": 57.96,
      "a": 10.53,
      "b": 38.71
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
    "hex": "#5B5622",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 91,
      "g": 86,
      "b": 34
    },
    "lab": {
      "l": 35.98,
      "a": -5.54,
      "b": 30.36
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
    "hex": "#6481A0",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 100,
      "g": 129,
      "b": 160
    },
    "lab": {
      "l": 52.89,
      "a": -2.31,
      "b": -19.86
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
    "hex": "#795F38",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 121,
      "g": 95,
      "b": 56
    },
    "lab": {
      "l": 42.06,
      "a": 5.33,
      "b": 26.2
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
    "hex": "#3B4540",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 59,
      "g": 69,
      "b": 64
    },
    "lab": {
      "l": 28.26,
      "a": -5.25,
      "b": 1.65
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
    "hex": "#924730",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 146,
      "g": 71,
      "b": 48
    },
    "lab": {
      "l": 39.3,
      "a": 29.69,
      "b": 28.22
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
    "hex": "#2D3134",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 45,
      "g": 49,
      "b": 52
    },
    "lab": {
      "l": 20.05,
      "a": -0.98,
      "b": -2.5
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
    "hex": "#063546",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 6,
      "g": 53,
      "b": 70
    },
    "lab": {
      "l": 20.15,
      "a": -8.06,
      "b": -14.81
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
    "hex": "#0E0B0C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 14,
      "g": 11,
      "b": 12
    },
    "lab": {
      "l": 3.25,
      "a": 1.05,
      "b": -0.09
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
    "family": "Green",
    "colorFamily": "green",
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
    "hex": "#643526",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 100,
      "g": 53,
      "b": 38
    },
    "lab": {
      "l": 27.83,
      "a": 19.42,
      "b": 18.64
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
    "hex": "#3B234A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 59,
      "g": 35,
      "b": 74
    },
    "lab": {
      "l": 18.48,
      "a": 19.92,
      "b": -19.87
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
    "hex": "#DD371B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 221,
      "g": 55,
      "b": 27
    },
    "lab": {
      "l": 49.72,
      "a": 62.31,
      "b": 53.63
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
    "hex": "#F7DA86",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 247,
      "g": 218,
      "b": 134
    },
    "lab": {
      "l": 87.8,
      "a": -0.79,
      "b": 44.87
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
    "hex": "#133056",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 19,
      "g": 48,
      "b": 86
    },
    "lab": {
      "l": 19.74,
      "a": 4.06,
      "b": -26.17
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
    "hex": "#161A38",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 22,
      "g": 26,
      "b": 56
    },
    "lab": {
      "l": 10.52,
      "a": 8.66,
      "b": -20.19
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
    "hex": "#317947",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 49,
      "g": 121,
      "b": 71
    },
    "lab": {
      "l": 45.33,
      "a": -34.46,
      "b": 20.86
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
    "hex": "#C2986C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 194,
      "g": 152,
      "b": 108
    },
    "lab": {
      "l": 65.76,
      "a": 9.98,
      "b": 29.13
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
    "hex": "#D4CDB0",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 212,
      "g": 205,
      "b": 176
    },
    "lab": {
      "l": 82.27,
      "a": -2.37,
      "b": 15.33
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
    "hex": "#018066",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 128,
      "b": 102
    },
    "lab": {
      "l": 47.5,
      "a": -36.65,
      "b": 5.73
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
    "family": "Yellow",
    "colorFamily": "yellow",
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
    "hex": "#3D332A",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 61,
      "g": 51,
      "b": 42
    },
    "lab": {
      "l": 22.04,
      "a": 2.79,
      "b": 7.38
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
    "hex": "#877453",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 135,
      "g": 116,
      "b": 83
    },
    "lab": {
      "l": 49.82,
      "a": 2.36,
      "b": 20.98
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
    "hex": "#A98462",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 169,
      "g": 132,
      "b": 98
    },
    "lab": {
      "l": 57.87,
      "a": 9.56,
      "b": 23.78
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
    "hex": "#84612D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 132,
      "g": 97,
      "b": 45
    },
    "lab": {
      "l": 43.72,
      "a": 8.3,
      "b": 34.52
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
    "hex": "#67595F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 103,
      "g": 89,
      "b": 95
    },
    "lab": {
      "l": 39.33,
      "a": 6.85,
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
    "hex": "#905F26",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 144,
      "g": 95,
      "b": 38
    },
    "lab": {
      "l": 44.6,
      "a": 14.57,
      "b": 39.43
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
    "hex": "#5A4332",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 90,
      "g": 67,
      "b": 50
    },
    "lab": {
      "l": 30.45,
      "a": 7.37,
      "b": 14.16
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
    "hex": "#07D9E6",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 7,
      "g": 217,
      "b": 230
    },
    "lab": {
      "l": 79.26,
      "a": -38.49,
      "b": -18.8
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
    "hex": "#A96037",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 169,
      "g": 96,
      "b": 55
    },
    "lab": {
      "l": 48.36,
      "a": 25.99,
      "b": 35.75
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
    "hex": "#00B6AE",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 182,
      "b": 174
    },
    "lab": {
      "l": 66.91,
      "a": -39.74,
      "b": -6.91
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
    "hex": "#E8BEA8",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 232,
      "g": 190,
      "b": 168
    },
    "lab": {
      "l": 80.07,
      "a": 11.83,
      "b": 16.77
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
    "hex": "#95B5AD",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 149,
      "g": 181,
      "b": 173
    },
    "lab": {
      "l": 71.18,
      "a": -12.49,
      "b": 0.46
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
    "hex": "#8A9381",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 138,
      "g": 147,
      "b": 129
    },
    "lab": {
      "l": 59.76,
      "a": -6.71,
      "b": 8.43
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
    "hex": "#818B95",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 129,
      "g": 139,
      "b": 149
    },
    "lab": {
      "l": 57.37,
      "a": -1.49,
      "b": -6.56
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
    "hex": "#867F66",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 134,
      "g": 127,
      "b": 102
    },
    "lab": {
      "l": 53.18,
      "a": -1.67,
      "b": 14.58
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
    "hex": "#F87118",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 248,
      "g": 113,
      "b": 24
    },
    "lab": {
      "l": 63.21,
      "a": 47.66,
      "b": 66.65
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
    "hex": "#FBA0D5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 251,
      "g": 160,
      "b": 213
    },
    "lab": {
      "l": 76.35,
      "a": 41.02,
      "b": -12.8
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
    "hex": "#0087AD",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 135,
      "b": 173
    },
    "lab": {
      "l": 52.22,
      "a": -16.82,
      "b": -28.65
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
    "hex": "#B491CF",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 180,
      "g": 145,
      "b": 207
    },
    "lab": {
      "l": 65.33,
      "a": 24.8,
      "b": -26.93
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
    "hex": "#F3D05D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 208,
      "b": 93
    },
    "lab": {
      "l": 84.46,
      "a": -0.58,
      "b": 60.18
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
    "hex": "#768E08",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 118,
      "g": 142,
      "b": 8
    },
    "lab": {
      "l": 55.29,
      "a": -24.55,
      "b": 57.53
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
    "hex": "#2C3B1F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 44,
      "g": 59,
      "b": 31
    },
    "lab": {
      "l": 22.87,
      "a": -12.21,
      "b": 15.4
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
    "hex": "#344052",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 52,
      "g": 64,
      "b": 82
    },
    "lab": {
      "l": 26.75,
      "a": 0.18,
      "b": -12.42
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
    "hex": "#A384C8",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 163,
      "g": 132,
      "b": 200
    },
    "lab": {
      "l": 60.3,
      "a": 25.28,
      "b": -30.89
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
    "hex": "#AC1960",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 172,
      "g": 25,
      "b": 96
    },
    "lab": {
      "l": 38.4,
      "a": 60.29,
      "b": -2.18
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
    "hex": "#016EB8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 110,
      "b": 184
    },
    "lab": {
      "l": 45.11,
      "a": 2.15,
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
    "hex": "#060405",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 6,
      "g": 4,
      "b": 5
    },
    "lab": {
      "l": 1.23,
      "a": 0.66,
      "b": -0.19
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
    "hex": "#763C30",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 118,
      "g": 60,
      "b": 48
    },
    "lab": {
      "l": 32.48,
      "a": 24.08,
      "b": 18.81
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
    "hex": "#B87A42",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 184,
      "g": 122,
      "b": 66
    },
    "lab": {
      "l": 56.59,
      "a": 18.66,
      "b": 39.93
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
    "hex": "#654529",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 69,
      "b": 41
    },
    "lab": {
      "l": 32.22,
      "a": 10.31,
      "b": 22.28
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
    "hex": "#917F69",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 145,
      "g": 127,
      "b": 105
    },
    "lab": {
      "l": 54.26,
      "a": 3.3,
      "b": 14.5
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
    "hex": "#89B8B2",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 137,
      "g": 184,
      "b": 178
    },
    "lab": {
      "l": 71.43,
      "a": -16.79,
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
    "hex": "#717171",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 113,
      "g": 113,
      "b": 113
    },
    "lab": {
      "l": 47.64,
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
    "hex": "#8B712F",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 139,
      "g": 113,
      "b": 47
    },
    "lab": {
      "l": 48.89,
      "a": 2.38,
      "b": 39.46
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
    "hex": "#251822",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 37,
      "g": 24,
      "b": 34
    },
    "lab": {
      "l": 10.27,
      "a": 8.67,
      "b": -4.34
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
    "hex": "#373B22",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 55,
      "g": 59,
      "b": 34
    },
    "lab": {
      "l": 23.85,
      "a": -6.59,
      "b": 14.95
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
    "hex": "#8E6922",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 142,
      "g": 105,
      "b": 34
    },
    "lab": {
      "l": 46.94,
      "a": 7.63,
      "b": 43.57
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
    "hex": "#F3B923",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 185,
      "b": 35
    },
    "lab": {
      "l": 78.39,
      "a": 8.83,
      "b": 75.26
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
    "hex": "#966531",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 150,
      "g": 101,
      "b": 49
    },
    "lab": {
      "l": 46.99,
      "a": 14.47,
      "b": 36.71
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
    "hex": "#35393D",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 53,
      "g": 57,
      "b": 61
    },
    "lab": {
      "l": 23.74,
      "a": -0.71,
      "b": -3.06
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
    "hex": "#5A636C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 90,
      "g": 99,
      "b": 108
    },
    "lab": {
      "l": 41.5,
      "a": -1.38,
      "b": -6.26
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
    "family": "Orange",
    "colorFamily": "orange",
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
    "family": "Purple",
    "colorFamily": "purple",
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
    "hex": "#4C1F21",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 76,
      "g": 31,
      "b": 33
    },
    "lab": {
      "l": 18.48,
      "a": 21.51,
      "b": 9
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
    "hex": "#CC8127",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 204,
      "g": 129,
      "b": 39
    },
    "lab": {
      "l": 60.5,
      "a": 22.09,
      "b": 57.04
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
    "hex": "#CECFC3",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 206,
      "g": 207,
      "b": 195
    },
    "lab": {
      "l": 82.75,
      "a": -2.48,
      "b": 5.84
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
    "hex": "#EEE4C2",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 238,
      "g": 228,
      "b": 194
    },
    "lab": {
      "l": 90.58,
      "a": -2.04,
      "b": 17.84
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
    "hex": "#38403E",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 56,
      "g": 64,
      "b": 62
    },
    "lab": {
      "l": 26.32,
      "a": -3.78,
      "b": 0.1
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
    "hex": "#7C6015",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 124,
      "g": 96,
      "b": 21
    },
    "lab": {
      "l": 42.32,
      "a": 3.79,
      "b": 43.73
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
    "hex": "#D67882",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 214,
      "g": 120,
      "b": 130
    },
    "lab": {
      "l": 61.08,
      "a": 37.62,
      "b": 10.84
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
    "hex": "#8F6D51",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 143,
      "g": 109,
      "b": 81
    },
    "lab": {
      "l": 48.73,
      "a": 9.64,
      "b": 20.84
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
    "hex": "#517725",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 81,
      "g": 119,
      "b": 37
    },
    "lab": {
      "l": 45.74,
      "a": -27.55,
      "b": 39.32
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
    "family": "Green",
    "colorFamily": "green",
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
    "hex": "#434833",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 67,
      "g": 72,
      "b": 51
    },
    "lab": {
      "l": 29.58,
      "a": -6.3,
      "b": 11.95
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
    "hex": "#F85E25",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 248,
      "g": 94,
      "b": 37
    },
    "lab": {
      "l": 59.98,
      "a": 56.49,
      "b": 59.83
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
    "hex": "#B07F3B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 176,
      "g": 127,
      "b": 59
    },
    "lab": {
      "l": 56.81,
      "a": 11.93,
      "b": 43.46
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
    "hex": "#2B2859",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 43,
      "g": 40,
      "b": 89
    },
    "lab": {
      "l": 19.02,
      "a": 16.29,
      "b": -29.22
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
    "hex": "#5A8F7D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 90,
      "g": 143,
      "b": 125
    },
    "lab": {
      "l": 55.38,
      "a": -21.93,
      "b": 4.02
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
    "hex": "#A6C0BF",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 166,
      "g": 192,
      "b": 191
    },
    "lab": {
      "l": 75.8,
      "a": -8.98,
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
    "hex": "#6A6159",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 106,
      "g": 97,
      "b": 89
    },
    "lab": {
      "l": 41.74,
      "a": 2.09,
      "b": 5.86
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
    "hex": "#EEB7A3",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 238,
      "g": 183,
      "b": 163
    },
    "lab": {
      "l": 78.86,
      "a": 17.16,
      "b": 17.85
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
    "hex": "#9BA9B1",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 155,
      "g": 169,
      "b": 177
    },
    "lab": {
      "l": 68.4,
      "a": -3.24,
      "b": -5.79
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
    "hex": "#DDC3A0",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 221,
      "g": 195,
      "b": 160
    },
    "lab": {
      "l": 80.15,
      "a": 3.94,
      "b": 20.99
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
    "hex": "#AC592D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 172,
      "g": 89,
      "b": 45
    },
    "lab": {
      "l": 47.12,
      "a": 30.52,
      "b": 39.76
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
    "hex": "#5D85A7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 93,
      "g": 133,
      "b": 167
    },
    "lab": {
      "l": 53.91,
      "a": -4.57,
      "b": -22.38
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
    "hex": "#9EA48A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 158,
      "g": 164,
      "b": 138
    },
    "lab": {
      "l": 66.26,
      "a": -6.85,
      "b": 12.79
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
    "family": "Magenta",
    "colorFamily": "magenta",
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
    "hex": "#D89636",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 216,
      "g": 150,
      "b": 54
    },
    "lab": {
      "l": 67.04,
      "a": 16.44,
      "b": 57.8
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
    "hex": "#C19238",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 193,
      "g": 146,
      "b": 56
    },
    "lab": {
      "l": 63.49,
      "a": 8.73,
      "b": 52.55
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
    "hex": "#09395D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 9,
      "g": 57,
      "b": 93
    },
    "lab": {
      "l": 22.91,
      "a": -0.57,
      "b": -25.76
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
    "hex": "#642F75",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 100,
      "g": 47,
      "b": 117
    },
    "lab": {
      "l": 29.48,
      "a": 35.86,
      "b": -30.3
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
    "hex": "#740E0A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 116,
      "g": 14,
      "b": 10
    },
    "lab": {
      "l": 23.84,
      "a": 41.94,
      "b": 31.39
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
    "hex": "#943F24",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 148,
      "g": 63,
      "b": 36
    },
    "lab": {
      "l": 37.81,
      "a": 34.07,
      "b": 33.45
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
    "hex": "#4B4A35",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 75,
      "g": 74,
      "b": 53
    },
    "lab": {
      "l": 31,
      "a": -3.57,
      "b": 12.74
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
    "hex": "#F89480",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 248,
      "g": 148,
      "b": 128
    },
    "lab": {
      "l": 71.35,
      "a": 35.55,
      "b": 26.75
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
    "hex": "#0039A4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 57,
      "b": 164
    },
    "lab": {
      "l": 28.39,
      "a": 29.23,
      "b": -61.45
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
    "hex": "#4B1853",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 75,
      "g": 24,
      "b": 83
    },
    "lab": {
      "l": 19.11,
      "a": 33.32,
      "b": -24.82
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
    "hex": "#2F244E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 47,
      "g": 36,
      "b": 78
    },
    "lab": {
      "l": 17.53,
      "a": 16.53,
      "b": -24.18
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
    "hex": "#5E5E41",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 94,
      "g": 94,
      "b": 65
    },
    "lab": {
      "l": 39.19,
      "a": -5.23,
      "b": 16.69
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
    "hex": "#834A3D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 131,
      "g": 74,
      "b": 61
    },
    "lab": {
      "l": 37.95,
      "a": 22.75,
      "b": 18.25
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
    "hex": "#FC998A",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 252,
      "g": 153,
      "b": 138
    },
    "lab": {
      "l": 73.1,
      "a": 35.43,
      "b": 23.72
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
    "hex": "#DDAA5D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 221,
      "g": 170,
      "b": 93
    },
    "lab": {
      "l": 72.84,
      "a": 10.14,
      "b": 46.34
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
    "hex": "#BE0206",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 190,
      "g": 2,
      "b": 6
    },
    "lab": {
      "l": 39.59,
      "a": 64.04,
      "b": 51.64
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
    "hex": "#6D161F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 109,
      "g": 22,
      "b": 31
    },
    "lab": {
      "l": 23.42,
      "a": 38.07,
      "b": 18.05
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
    "hex": "#62A633",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 98,
      "g": 166,
      "b": 51
    },
    "lab": {
      "l": 61.75,
      "a": -41.38,
      "b": 50.53
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
    "hex": "#CF7629",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 207,
      "g": 118,
      "b": 41
    },
    "lab": {
      "l": 58.4,
      "a": 29.35,
      "b": 54.47
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
    "hex": "#034F46",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 3,
      "g": 79,
      "b": 70
    },
    "lab": {
      "l": 29.55,
      "a": -23.3,
      "b": -0.64
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
    "hex": "#524845",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 82,
      "g": 72,
      "b": 69
    },
    "lab": {
      "l": 31.48,
      "a": 3.62,
      "b": 3.34
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
    "hex": "#397D41",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 57,
      "g": 125,
      "b": 65
    },
    "lab": {
      "l": 46.87,
      "a": -35.13,
      "b": 26.24
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
    "hex": "#CACDD0",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 202,
      "g": 205,
      "b": 208
    },
    "lab": {
      "l": 82.26,
      "a": -0.47,
      "b": -1.85
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
    "hex": "#9098A5",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 144,
      "g": 152,
      "b": 165
    },
    "lab": {
      "l": 62.59,
      "a": -0.16,
      "b": -7.78
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
    "hex": "#4B4240",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 75,
      "g": 66,
      "b": 64
    },
    "lab": {
      "l": 28.81,
      "a": 3.44,
      "b": 2.62
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
    "hex": "#CDC6B4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 205,
      "g": 198,
      "b": 180
    },
    "lab": {
      "l": 79.99,
      "a": -0.64,
      "b": 9.89
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
    "family": "Brown",
    "colorFamily": "brown",
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
    "hex": "#FBB592",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 251,
      "g": 181,
      "b": 146
    },
    "lab": {
      "l": 79.41,
      "a": 21.22,
      "b": 27.9
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
    "hex": "#7BD0FE",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 123,
      "g": 208,
      "b": 254
    },
    "lab": {
      "l": 79.88,
      "a": -13.45,
      "b": -30.43
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
    "hex": "#A2A9B0",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 162,
      "g": 169,
      "b": 176
    },
    "lab": {
      "l": 68.89,
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
    "hex": "#4D5D70",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 77,
      "g": 93,
      "b": 112
    },
    "lab": {
      "l": 38.86,
      "a": -1.21,
      "b": -12.79
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
    "hex": "#358456",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 53,
      "g": 132,
      "b": 86
    },
    "lab": {
      "l": 49.41,
      "a": -35.38,
      "b": 17.8
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
    "hex": "#D979BD",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 217,
      "g": 121,
      "b": 189
    },
    "lab": {
      "l": 63.43,
      "a": 46.29,
      "b": -19.37
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
    "hex": "#2F2828",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 47,
      "g": 40,
      "b": 40
    },
    "lab": {
      "l": 16.87,
      "a": 3.24,
      "b": 1.19
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
    "hex": "#648AAD",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 100,
      "g": 138,
      "b": 173
    },
    "lab": {
      "l": 55.99,
      "a": -3.84,
      "b": -22.6
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
    "hex": "#A4997A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 164,
      "g": 153,
      "b": 122
    },
    "lab": {
      "l": 63.41,
      "a": -1.04,
      "b": 17.79
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
    "hex": "#999999",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 153,
      "g": 153,
      "b": 153
    },
    "lab": {
      "l": 63.22,
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
    "hex": "#945453",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 148,
      "g": 84,
      "b": 83
    },
    "lab": {
      "l": 43.16,
      "a": 26.43,
      "b": 12.21
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
    "hex": "#F6A61B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 246,
      "g": 166,
      "b": 27
    },
    "lab": {
      "l": 74.16,
      "a": 19.92,
      "b": 73.94
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
    "hex": "#E9915F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 233,
      "g": 145,
      "b": 95
    },
    "lab": {
      "l": 68.32,
      "a": 28.55,
      "b": 40.22
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
    "hex": "#77C8FB",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 119,
      "g": 200,
      "b": 251
    },
    "lab": {
      "l": 77.4,
      "a": -10.95,
      "b": -32.67
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
    "hex": "#FB9F5B",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 159,
      "b": 91
    },
    "lab": {
      "l": 73.59,
      "a": 28.15,
      "b": 49.06
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
    "hex": "#B81B4E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 184,
      "g": 27,
      "b": 78
    },
    "lab": {
      "l": 40.46,
      "a": 61.48,
      "b": 12.54
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
    "hex": "#9E5A4D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 158,
      "g": 90,
      "b": 77
    },
    "lab": {
      "l": 45.8,
      "a": 26.49,
      "b": 19.64
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
    "hex": "#9A705B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 154,
      "g": 112,
      "b": 91
    },
    "lab": {
      "l": 50.94,
      "a": 13.79,
      "b": 18.21
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
    "hex": "#381D11",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 56,
      "g": 29,
      "b": 17
    },
    "lab": {
      "l": 14.17,
      "a": 11.82,
      "b": 13.63
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
    "hex": "#F2D979",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 242,
      "g": 217,
      "b": 121
    },
    "lab": {
      "l": 86.94,
      "a": -3.46,
      "b": 50.06
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
    "hex": "#016B7F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 107,
      "b": 127
    },
    "lab": {
      "l": 41.3,
      "a": -18.25,
      "b": -18.43
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
    "hex": "#005F78",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 95,
      "b": 120
    },
    "lab": {
      "l": 37,
      "a": -14.18,
      "b": -20.79
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
    "hex": "#29407A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 41,
      "g": 64,
      "b": 122
    },
    "lab": {
      "l": 28.23,
      "a": 11.28,
      "b": -35.8
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
    "hex": "#375F20",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 55,
      "g": 95,
      "b": 32
    },
    "lab": {
      "l": 36.18,
      "a": -26.61,
      "b": 30.85
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
    "hex": "#454E37",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 69,
      "g": 78,
      "b": 55
    },
    "lab": {
      "l": 31.78,
      "a": -8.35,
      "b": 12.46
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
    "hex": "#473C1D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 71,
      "g": 60,
      "b": 29
    },
    "lab": {
      "l": 25.74,
      "a": 0.09,
      "b": 20.76
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
    "hex": "#A3E8E3",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 163,
      "g": 232,
      "b": 227
    },
    "lab": {
      "l": 87.51,
      "a": -22.48,
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
    "hex": "#E01520",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 224,
      "g": 21,
      "b": 32
    },
    "lab": {
      "l": 47.62,
      "a": 70.98,
      "b": 49.93
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
    "hex": "#2C1D5C",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 44,
      "g": 29,
      "b": 92
    },
    "lab": {
      "l": 16.44,
      "a": 25.08,
      "b": -35.39
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
    "hex": "#33373A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 55,
      "b": 58
    },
    "lab": {
      "l": 22.8,
      "a": -0.97,
      "b": -2.46
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
    "hex": "#4F0B2D",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 79,
      "g": 11,
      "b": 45
    },
    "lab": {
      "l": 15.96,
      "a": 33.48,
      "b": -3.11
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
    "hex": "#8E1C4E",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 142,
      "g": 28,
      "b": 78
    },
    "lab": {
      "l": 32.11,
      "a": 49.9,
      "b": -0.48
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
    "hex": "#A48184",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 164,
      "g": 129,
      "b": 132
    },
    "lab": {
      "l": 57.33,
      "a": 13.93,
      "b": 3.53
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
    "hex": "#F2F4F3",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 242,
      "g": 244,
      "b": 243
    },
    "lab": {
      "l": 96.02,
      "a": -0.84,
      "b": 0.25
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
    "hex": "#CCCBCE",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 204,
      "g": 203,
      "b": 206
    },
    "lab": {
      "l": 81.84,
      "a": 0.89,
      "b": -1.37
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
    "hex": "#CBCBCB",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 203,
      "g": 203,
      "b": 203
    },
    "lab": {
      "l": 81.69,
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
    "hex": "#B9CBDA",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 185,
      "g": 203,
      "b": 218
    },
    "lab": {
      "l": 80.79,
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
    "hex": "#D1F12E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 209,
      "g": 241,
      "b": 46
    },
    "lab": {
      "l": 90.17,
      "a": -32.92,
      "b": 81.35
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
    "hex": "#E2A344",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 226,
      "g": 163,
      "b": 68
    },
    "lab": {
      "l": 71.41,
      "a": 14.4,
      "b": 56.64
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
    "hex": "#3E4331",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 62,
      "g": 67,
      "b": 49
    },
    "lab": {
      "l": 27.46,
      "a": -5.82,
      "b": 10.27
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
  generatedAt: '2026-06-26T09:52:59.825Z',
};
