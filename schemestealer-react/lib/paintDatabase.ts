/**
 * Paint Database - Auto-generated
 *
 * Contains 780 pre-computed paints with RGB and LAB values.
 * Generated from the master paints.json database.
 *
 * DO NOT EDIT MANUALLY - run `node scripts/generatePaintDatabase.js` to regenerate.
 *
 * Last generated: 2026-06-17T20:14:03.276Z
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
  finish: string;
  transparency: number;
  matchable: boolean;
  aliases: string[];     // alt names (old Warpaints names, GW names) for search
}

/**
 * Pre-computed paint database with LAB values
 * Optimized subset of ~780 paints for fast offline matching
 */
export const PAINT_DATABASE: PaintData[] = [
  {
    "paint_id": "army-painter-abyssal-blue",
    "name": "Abyssal Blue",
    "brand": "Army Painter",
    "hex": "#004F6B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 79,
      "b": 107
    },
    "lab": {
      "l": 31,
      "a": -9.81,
      "b": -22.03
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Twilight Sky"
    ]
  },
  {
    "paint_id": "army-painter-aegis-aqua",
    "name": "Aegis Aqua",
    "brand": "Army Painter",
    "hex": "#41AFD1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 65,
      "g": 175,
      "b": 209
    },
    "lab": {
      "l": 66.81,
      "a": -20.29,
      "b": -26.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Voidshield Blue"
    ]
  },
  {
    "paint_id": "army-painter-afterglow",
    "name": "Afterglow",
    "brand": "Army Painter",
    "hex": "#E7EA89",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 231,
      "g": 234,
      "b": 137
    },
    "lab": {
      "l": 90.62,
      "a": -14.8,
      "b": 46.66
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-agate-skin",
    "name": "Agate Skin",
    "brand": "Army Painter",
    "hex": "#D88779",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 216,
      "g": 135,
      "b": 121
    },
    "lab": {
      "l": 64.41,
      "a": 29.45,
      "b": 20.6
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Cadian Fleshtone"
    ]
  },
  {
    "paint_id": "army-painter-alien-purple",
    "name": "Alien Purple",
    "brand": "Army Painter",
    "hex": "#5F4796",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 95,
      "g": 71,
      "b": 150
    },
    "lab": {
      "l": 36.25,
      "a": 28.87,
      "b": -39.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-alpha-blue",
    "name": "Alpha Blue",
    "brand": "Army Painter",
    "hex": "#697BB9",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 105,
      "g": 123,
      "b": 185
    },
    "lab": {
      "l": 52.59,
      "a": 9.78,
      "b": -34.74
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Calgar Blue"
    ]
  },
  {
    "paint_id": "army-painter-amber-skin",
    "name": "Amber Skin",
    "brand": "Army Painter",
    "hex": "#C7A482",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 199,
      "g": 164,
      "b": 130
    },
    "lab": {
      "l": 69.69,
      "a": 8.02,
      "b": 22.49
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Charred Bone"
    ]
  },
  {
    "paint_id": "army-painter-amulet-aqua",
    "name": "Amulet Aqua",
    "brand": "Army Painter",
    "hex": "#6BC1AF",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 107,
      "g": 193,
      "b": 175
    },
    "lab": {
      "l": 72.47,
      "a": -30.37,
      "b": 0.97
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hazardous Smog"
    ]
  },
  {
    "paint_id": "army-painter-ancient-stone",
    "name": "Ancient Stone",
    "brand": "Army Painter",
    "hex": "#D4CAA9",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 212,
      "g": 202,
      "b": 169
    },
    "lab": {
      "l": 81.35,
      "a": -1.86,
      "b": 17.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-angel-green",
    "name": "Angel Green",
    "brand": "Army Painter",
    "hex": "#1F3E2B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 31,
      "g": 62,
      "b": 43
    },
    "lab": {
      "l": 23.37,
      "a": -16.71,
      "b": 8.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Caliban Green"
    ]
  },
  {
    "paint_id": "army-painter-angelic-red",
    "name": "Angelic Red",
    "brand": "Army Painter",
    "hex": "#D2212C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 210,
      "g": 33,
      "b": 44
    },
    "lab": {
      "l": 45.6,
      "a": 65.5,
      "b": 40.73
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mars Red"
    ]
  },
  {
    "paint_id": "army-painter-aqua-alchemy",
    "name": "Aqua Alchemy",
    "brand": "Army Painter",
    "hex": "#2EB39B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 46,
      "g": 179,
      "b": 155
    },
    "lab": {
      "l": 65.89,
      "a": -40.68,
      "b": 2.17
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-aquamarine",
    "name": "Aquamarine",
    "brand": "Army Painter",
    "hex": "#5CC1C7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 92,
      "g": 193,
      "b": 199
    },
    "lab": {
      "l": 72.59,
      "a": -27.63,
      "b": -11.99
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Phantasmal Blue"
    ]
  },
  {
    "paint_id": "army-painter-arctic-gem",
    "name": "Arctic Gem",
    "brand": "Army Painter",
    "hex": "#0190CE",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 144,
      "b": 206
    },
    "lab": {
      "l": 56.49,
      "a": -9.61,
      "b": -40.76
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Electric Blue"
    ]
  },
  {
    "paint_id": "army-painter-army-green",
    "name": "Army Green",
    "brand": "Army Painter",
    "hex": "#4E6038",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 78,
      "g": 96,
      "b": 56
    },
    "lab": {
      "l": 38.32,
      "a": -14.68,
      "b": 20.64
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Loren Forest"
    ]
  },
  {
    "paint_id": "army-painter-ash-grey",
    "name": "Ash Grey",
    "brand": "Army Painter",
    "hex": "#8F9294",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 143,
      "g": 146,
      "b": 148
    },
    "lab": {
      "l": 60.37,
      "a": -0.69,
      "b": -1.44
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Administratum Grey"
    ]
  },
  {
    "paint_id": "army-painter-augur-blue",
    "name": "Augur Blue",
    "brand": "Army Painter",
    "hex": "#B6C3E3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 182,
      "g": 195,
      "b": 227
    },
    "lab": {
      "l": 78.76,
      "a": 2.22,
      "b": -17.39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Gorgon Hide"
    ]
  },
  {
    "paint_id": "army-painter-autumn-sage",
    "name": "Autumn Sage",
    "brand": "Army Painter",
    "hex": "#78AC95",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 120,
      "g": 172,
      "b": 149
    },
    "lab": {
      "l": 66.26,
      "a": -22.21,
      "b": 6.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-baron-blue",
    "name": "Baron Blue",
    "brand": "Army Painter",
    "hex": "#8497CA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 132,
      "g": 151,
      "b": 202
    },
    "lab": {
      "l": 62.76,
      "a": 5.57,
      "b": -28.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Consul Blue"
    ]
  },
  {
    "paint_id": "army-painter-barren-dune",
    "name": "Barren Dune",
    "brand": "Army Painter",
    "hex": "#DEBC6C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 222,
      "g": 188,
      "b": 108
    },
    "lab": {
      "l": 77.63,
      "a": 2.25,
      "b": 44.68
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Troll Claws"
    ]
  },
  {
    "paint_id": "army-painter-basilisk-red",
    "name": "Basilisk Red",
    "brand": "Army Painter",
    "hex": "#712836",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 113,
      "g": 40,
      "b": 54
    },
    "lab": {
      "l": 27.56,
      "a": 33.49,
      "b": 8.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Crusted Sore"
    ]
  },
  {
    "paint_id": "army-painter-blood-chalice",
    "name": "Blood Chalice",
    "brand": "Army Painter",
    "hex": "#D63E43",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 214,
      "g": 62,
      "b": 67
    },
    "lab": {
      "l": 49.68,
      "a": 59.1,
      "b": 32.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-blue-tone",
    "name": "Blue Tone",
    "brand": "Army Painter",
    "hex": "#1F4268",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 31,
      "g": 66,
      "b": 104
    },
    "lab": {
      "l": 27.26,
      "a": 1.02,
      "b": -25.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Tyran Blue"
    ]
  },
  {
    "paint_id": "army-painter-bony-spikes",
    "name": "Bony Spikes",
    "brand": "Army Painter",
    "hex": "#E9D9C1",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 233,
      "g": 217,
      "b": 193
    },
    "lab": {
      "l": 87.39,
      "a": 1.65,
      "b": 13.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Bleached Bone"
    ]
  },
  {
    "paint_id": "army-painter-bootstrap-brown",
    "name": "Bootstrap Brown",
    "brand": "Army Painter",
    "hex": "#4C332C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 76,
      "g": 51,
      "b": 44
    },
    "lab": {
      "l": 23.95,
      "a": 10.25,
      "b": 8.97
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Werewolf Fur"
    ]
  },
  {
    "paint_id": "army-painter-brainmatter-beige",
    "name": "Brainmatter Beige",
    "brand": "Army Painter",
    "hex": "#E4E2D8",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 228,
      "g": 226,
      "b": 216
    },
    "lab": {
      "l": 89.79,
      "a": -1.07,
      "b": 5.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Pallid Wych Flesh"
    ]
  },
  {
    "paint_id": "army-painter-brigade-grey",
    "name": "Brigade Grey",
    "brand": "Army Painter",
    "hex": "#D8D8DA",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 216,
      "g": 216,
      "b": 218
    },
    "lab": {
      "l": 86.39,
      "a": 0.36,
      "b": -0.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Spaceship Exterior"
    ]
  },
  {
    "paint_id": "army-painter-brigandine-brown",
    "name": "Brigandine Brown",
    "brand": "Army Painter",
    "hex": "#2C241F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 44,
      "g": 36,
      "b": 31
    },
    "lab": {
      "l": 14.93,
      "a": 2.77,
      "b": 4.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hardened Carapace"
    ]
  },
  {
    "paint_id": "army-painter-bright-gold",
    "name": "Bright Gold",
    "brand": "Army Painter",
    "hex": "#937702",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 147,
      "g": 119,
      "b": 2
    },
    "lab": {
      "l": 51.15,
      "a": 1.04,
      "b": 56.61
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Auric Armour Gold"
    ]
  },
  {
    "paint_id": "army-painter-bright-sapphire",
    "name": "Bright Sapphire",
    "brand": "Army Painter",
    "hex": "#94CFF0",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 148,
      "g": 207,
      "b": 240
    },
    "lab": {
      "l": 80.3,
      "a": -10.78,
      "b": -22.23
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-buffed-hide",
    "name": "Buffed Hide",
    "brand": "Army Painter",
    "hex": "#B77867",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 183,
      "g": 120,
      "b": 103
    },
    "lab": {
      "l": 56.57,
      "a": 22.63,
      "b": 19.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Deathclaw Brown"
    ]
  },
  {
    "paint_id": "army-painter-burning-ore",
    "name": "Burning Ore",
    "brand": "Army Painter",
    "hex": "#ED5717",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 237,
      "g": 87,
      "b": 23
    },
    "lab": {
      "l": 56.97,
      "a": 55.42,
      "b": 61.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mythical Orange"
    ]
  },
  {
    "paint_id": "army-painter-burnt-turf",
    "name": "Burnt Turf",
    "brand": "Army Painter",
    "hex": "#C19C50",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 193,
      "g": 156,
      "b": 80
    },
    "lab": {
      "l": 66.29,
      "a": 4.82,
      "b": 44.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hemp Rope"
    ]
  },
  {
    "paint_id": "army-painter-camouflage-green",
    "name": "Camouflage Green",
    "brand": "Army Painter",
    "hex": "#627247",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 98,
      "g": 114,
      "b": 71
    },
    "lab": {
      "l": 45.75,
      "a": -14.01,
      "b": 21.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Commando Green"
    ]
  },
  {
    "paint_id": "army-painter-carnelian-skin",
    "name": "Carnelian Skin",
    "brand": "Army Painter",
    "hex": "#644245",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 100,
      "g": 66,
      "b": 69
    },
    "lab": {
      "l": 31.89,
      "a": 15.22,
      "b": 4.2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Chaotic Red"
    ]
  },
  {
    "paint_id": "army-painter-cobalt-metal",
    "name": "Cobalt Metal",
    "brand": "Army Painter",
    "hex": "#2C3F3F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 44,
      "g": 63,
      "b": 63
    },
    "lab": {
      "l": 25.1,
      "a": -7.52,
      "b": -2.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Grey Knights Steel"
    ]
  },
  {
    "paint_id": "army-painter-command-khaki",
    "name": "Command Khaki",
    "brand": "Army Painter",
    "hex": "#B99889",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 185,
      "g": 152,
      "b": 137
    },
    "lab": {
      "l": 65.42,
      "a": 9.99,
      "b": 12.51
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Gnome Cheecks"
    ]
  },
  {
    "paint_id": "army-painter-company-grey",
    "name": "Company Grey",
    "brand": "Army Painter",
    "hex": "#C5C6C9",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 197,
      "g": 198,
      "b": 201
    },
    "lab": {
      "l": 79.88,
      "a": 0.21,
      "b": -1.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Grey Seer"
    ]
  },
  {
    "paint_id": "army-painter-crystal-blue",
    "name": "Crystal Blue",
    "brand": "Army Painter",
    "hex": "#006CB4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 108,
      "b": 180
    },
    "lab": {
      "l": 44.26,
      "a": 1.76,
      "b": -45.26
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Teclis Blue"
    ]
  },
  {
    "paint_id": "army-painter-cultist-purple",
    "name": "Cultist Purple",
    "brand": "Army Painter",
    "hex": "#6C5AA1",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 108,
      "g": 90,
      "b": 161
    },
    "lab": {
      "l": 42.87,
      "a": 23.87,
      "b": -35.99
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Genestealer Purple"
    ]
  },
  {
    "paint_id": "army-painter-daemonic-yellow",
    "name": "Daemonic Yellow",
    "brand": "Army Painter",
    "hex": "#FECB00",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 254,
      "g": 203,
      "b": 0
    },
    "lab": {
      "l": 83.85,
      "a": 3.77,
      "b": 84.93
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dark-blue-tone",
    "name": "Dark Blue Tone",
    "brand": "Army Painter",
    "hex": "#29323F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 41,
      "g": 50,
      "b": 63
    },
    "lab": {
      "l": 20.48,
      "a": -0.09,
      "b": -9.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Drakenhof Nightshade"
    ]
  },
  {
    "paint_id": "army-painter-dark-emerald",
    "name": "Dark Emerald",
    "brand": "Army Painter",
    "hex": "#35441B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 53,
      "g": 68,
      "b": 27
    },
    "lab": {
      "l": 26.65,
      "a": -13.87,
      "b": 22.59
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dark-skin-shade",
    "name": "Dark Skin Shade",
    "brand": "Army Painter",
    "hex": "#4D3A37",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 77,
      "g": 58,
      "b": 55
    },
    "lab": {
      "l": 26.39,
      "a": 7.86,
      "b": 5.09
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dark Skin Wash"
    ]
  },
  {
    "paint_id": "army-painter-dark-tone",
    "name": "Dark Tone",
    "brand": "Army Painter",
    "hex": "#2E2C28",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 46,
      "g": 44,
      "b": 40
    },
    "lab": {
      "l": 18.08,
      "a": 0.01,
      "b": 2.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Nuln Oil"
    ]
  },
  {
    "paint_id": "army-painter-death-metal",
    "name": "Death Metal",
    "brand": "Army Painter",
    "hex": "#27241D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 39,
      "g": 36,
      "b": 29
    },
    "lab": {
      "l": 14.3,
      "a": -0.11,
      "b": 5.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-deep-azure",
    "name": "Deep Azure",
    "brand": "Army Painter",
    "hex": "#006A78",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 106,
      "b": 120
    },
    "lab": {
      "l": 40.68,
      "a": -20.32,
      "b": -15.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ocean Depths"
    ]
  },
  {
    "paint_id": "army-painter-deep-grey",
    "name": "Deep Grey",
    "brand": "Army Painter",
    "hex": "#535663",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 83,
      "g": 86,
      "b": 99
    },
    "lab": {
      "l": 36.73,
      "a": 1.82,
      "b": -7.9
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Necromancer Cloak"
    ]
  },
  {
    "paint_id": "army-painter-deep-ocean-blue",
    "name": "Deep Ocean Blue",
    "brand": "Army Painter",
    "hex": "#223242",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 34,
      "g": 50,
      "b": 66
    },
    "lab": {
      "l": 20.1,
      "a": -1.5,
      "b": -12.08
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Thunder Storm"
    ]
  },
  {
    "paint_id": "army-painter-demigod-flames",
    "name": "Demigod Flames",
    "brand": "Army Painter",
    "hex": "#D37933",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 211,
      "g": 121,
      "b": 51
    },
    "lab": {
      "l": 59.68,
      "a": 29.79,
      "b": 51.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Tau Light Ochre"
    ]
  },
  {
    "paint_id": "army-painter-desert-yellow",
    "name": "Desert Yellow",
    "brand": "Army Painter",
    "hex": "#897440",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 137,
      "g": 116,
      "b": 64
    },
    "lab": {
      "l": 49.71,
      "a": 1.13,
      "b": 31.54
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hobgrot Hide"
    ]
  },
  {
    "paint_id": "army-painter-diabolic-plum",
    "name": "Diabolic Plum",
    "brand": "Army Painter",
    "hex": "#56286A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 86,
      "g": 40,
      "b": 106
    },
    "lab": {
      "l": 25.37,
      "a": 33.21,
      "b": -29.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Phoenician Purple"
    ]
  },
  {
    "paint_id": "army-painter-diviner-light",
    "name": "Diviner Light",
    "brand": "Army Painter",
    "hex": "#D8A2C8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 216,
      "g": 162,
      "b": 200
    },
    "lab": {
      "l": 72.64,
      "a": 26.01,
      "b": -11.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-doomfire-drab",
    "name": "Doomfire Drab",
    "brand": "Army Painter",
    "hex": "#FBDCEA",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 251,
      "g": 220,
      "b": 234
    },
    "lab": {
      "l": 90.61,
      "a": 12.99,
      "b": -2.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-dorado-skin",
    "name": "Dorado Skin",
    "brand": "Army Painter",
    "hex": "#EECA9F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 238,
      "g": 202,
      "b": 159
    },
    "lab": {
      "l": 83.4,
      "a": 6.66,
      "b": 26.21
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Corpse Pale"
    ]
  },
  {
    "paint_id": "army-painter-dragon-red",
    "name": "Dragon Red",
    "brand": "Army Painter",
    "hex": "#BE2131",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 190,
      "g": 33,
      "b": 49
    },
    "lab": {
      "l": 41.63,
      "a": 60.16,
      "b": 32.35
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mephiston Red"
    ]
  },
  {
    "paint_id": "army-painter-dryad-brown",
    "name": "Dryad Brown",
    "brand": "Army Painter",
    "hex": "#643B2E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 100,
      "g": 59,
      "b": 46
    },
    "lab": {
      "l": 29.5,
      "a": 16.54,
      "b": 15.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Cypress Brown"
    ]
  },
  {
    "paint_id": "army-painter-dusty-skull",
    "name": "Dusty Skull",
    "brand": "Army Painter",
    "hex": "#91856E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 145,
      "g": 133,
      "b": 110
    },
    "lab": {
      "l": 56.01,
      "a": 0.65,
      "b": 14.06
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stormvermin Fur"
    ]
  },
  {
    "paint_id": "army-painter-elder-flower",
    "name": "Elder Flower",
    "brand": "Army Painter",
    "hex": "#AB5578",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 171,
      "g": 85,
      "b": 120
    },
    "lab": {
      "l": 47.64,
      "a": 39.21,
      "b": -3.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fairy Pink"
    ]
  },
  {
    "paint_id": "army-painter-electric-lime",
    "name": "Electric Lime",
    "brand": "Army Painter",
    "hex": "#BDD000",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 189,
      "g": 208,
      "b": 0
    },
    "lab": {
      "l": 79.57,
      "a": -26.51,
      "b": 79.3
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Canopy Green"
    ]
  },
  {
    "paint_id": "army-painter-emerald-forest",
    "name": "Emerald Forest",
    "brand": "Army Painter",
    "hex": "#55AF30",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 85,
      "g": 175,
      "b": 48
    },
    "lab": {
      "l": 64,
      "a": -49.39,
      "b": 53.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Snake Scales"
    ]
  },
  {
    "paint_id": "army-painter-enchanted-pink",
    "name": "Enchanted Pink",
    "brand": "Army Painter",
    "hex": "#B867A4",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 184,
      "g": 103,
      "b": 164
    },
    "lab": {
      "l": 54.63,
      "a": 40.91,
      "b": -18.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-eternal-hunt",
    "name": "Eternal Hunt",
    "brand": "Army Painter",
    "hex": "#179239",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 23,
      "g": 146,
      "b": 57
    },
    "lab": {
      "l": 52.99,
      "a": -50.99,
      "b": 37.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Goblin Green"
    ]
  },
  {
    "paint_id": "army-painter-evergreen-fog",
    "name": "Evergreen Fog",
    "brand": "Army Painter",
    "hex": "#3D665E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 61,
      "g": 102,
      "b": 94
    },
    "lab": {
      "l": 40.09,
      "a": -16.45,
      "b": -0.01
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Sons of Horus Green"
    ]
  },
  {
    "paint_id": "army-painter-ferocious-green",
    "name": "Ferocious Green",
    "brand": "Army Painter",
    "hex": "#75BC69",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 117,
      "g": 188,
      "b": 105
    },
    "lab": {
      "l": 70.01,
      "a": -38.57,
      "b": 35.06
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Kraken Skin"
    ]
  },
  {
    "paint_id": "army-painter-fiendish-yellow",
    "name": "Fiendish Yellow",
    "brand": "Army Painter",
    "hex": "#E49D0E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 228,
      "g": 157,
      "b": 14
    },
    "lab": {
      "l": 69.93,
      "a": 16.82,
      "b": 72.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fire Lizard"
    ]
  },
  {
    "paint_id": "army-painter-figgy-pink",
    "name": "Figgy Pink",
    "brand": "Army Painter",
    "hex": "#E6B3C8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 230,
      "g": 179,
      "b": 200
    },
    "lab": {
      "l": 78.01,
      "a": 21.72,
      "b": -3.49
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Coven Purple"
    ]
  },
  {
    "paint_id": "army-painter-flickering-flame",
    "name": "Flickering Flame",
    "brand": "Army Painter",
    "hex": "#F28629",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 242,
      "g": 134,
      "b": 41
    },
    "lab": {
      "l": 66.59,
      "a": 35.28,
      "b": 63.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Orange Magma"
    ]
  },
  {
    "paint_id": "army-painter-forbidden-fruit",
    "name": "Forbidden Fruit",
    "brand": "Army Painter",
    "hex": "#D18DA8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 209,
      "g": 141,
      "b": 168
    },
    "lab": {
      "l": 66.09,
      "a": 29.69,
      "b": -3.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Toxic Boils"
    ]
  },
  {
    "paint_id": "army-painter-forest-faun",
    "name": "Forest Faun",
    "brand": "Army Painter",
    "hex": "#A7C9AB",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 167,
      "g": 201,
      "b": 171
    },
    "lab": {
      "l": 77.83,
      "a": -17.16,
      "b": 11.27
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Scaly Hide"
    ]
  },
  {
    "paint_id": "army-painter-frost-blue",
    "name": "Frost Blue",
    "brand": "Army Painter",
    "hex": "#A5C2DE",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 165,
      "g": 194,
      "b": 222
    },
    "lab": {
      "l": 77.19,
      "a": -3.55,
      "b": -17.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ice Storm"
    ]
  },
  {
    "paint_id": "army-painter-fur-brown",
    "name": "Fur Brown",
    "brand": "Army Painter",
    "hex": "#7D4742",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 125,
      "g": 71,
      "b": 66
    },
    "lab": {
      "l": 36.48,
      "a": 22.47,
      "b": 13.03
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-gargoyle-grey",
    "name": "Gargoyle Grey",
    "brand": "Army Painter",
    "hex": "#B1AC9C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 177,
      "g": 172,
      "b": 156
    },
    "lab": {
      "l": 70.35,
      "a": -1.03,
      "b": 8.87
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ionrach Skin"
    ]
  },
  {
    "paint_id": "army-painter-gemstone-red",
    "name": "Gemstone Red",
    "brand": "Army Painter",
    "hex": "#72161A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 114,
      "g": 22,
      "b": 26
    },
    "lab": {
      "l": 24.41,
      "a": 39.46,
      "b": 22.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Gemstone"
    ]
  },
  {
    "paint_id": "army-painter-glittering-green",
    "name": "Glittering Green",
    "brand": "Army Painter",
    "hex": "#216232",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 33,
      "g": 98,
      "b": 50
    },
    "lab": {
      "l": 36.53,
      "a": -32.22,
      "b": 21.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Glitter Green"
    ]
  },
  {
    "paint_id": "army-painter-glowing-inferno",
    "name": "Glowing Inferno",
    "brand": "Army Painter",
    "hex": "#F59829",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 245,
      "g": 152,
      "b": 41
    },
    "lab": {
      "l": 70.89,
      "a": 27.16,
      "b": 67.42
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Incursion Orange"
    ]
  },
  {
    "paint_id": "army-painter-gothic-blue",
    "name": "Gothic Blue",
    "brand": "Army Painter",
    "hex": "#2A3971",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 42,
      "g": 57,
      "b": 113
    },
    "lab": {
      "l": 25.59,
      "a": 12.9,
      "b": -34.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Macragge Blue"
    ]
  },
  {
    "paint_id": "army-painter-great-hall-grey",
    "name": "Great Hall Grey",
    "brand": "Army Painter",
    "hex": "#C4BDAF",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 196,
      "g": 189,
      "b": 175
    },
    "lab": {
      "l": 76.82,
      "a": 0.03,
      "b": 7.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stone Golem"
    ]
  },
  {
    "paint_id": "army-painter-greedy-gold",
    "name": "Greedy Gold",
    "brand": "Army Painter",
    "hex": "#90640D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 144,
      "g": 100,
      "b": 13
    },
    "lab": {
      "l": 45.74,
      "a": 10.74,
      "b": 50.05
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Retributor Armour"
    ]
  },
  {
    "paint_id": "army-painter-green-tone",
    "name": "Green Tone",
    "brand": "Army Painter",
    "hex": "#2B492A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 43,
      "g": 73,
      "b": 42
    },
    "lab": {
      "l": 27.97,
      "a": -18.6,
      "b": 15.13
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Biel-Tan Green"
    ]
  },
  {
    "paint_id": "army-painter-greenskin",
    "name": "Greenskin",
    "brand": "Army Painter",
    "hex": "#066D2C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 6,
      "g": 109,
      "b": 44
    },
    "lab": {
      "l": 39.84,
      "a": -41.64,
      "b": 28.6
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Warpstone Glow"
    ]
  },
  {
    "paint_id": "army-painter-grey-castle",
    "name": "Grey Castle",
    "brand": "Army Painter",
    "hex": "#9B9A8F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 155,
      "g": 154,
      "b": 143
    },
    "lab": {
      "l": 63.39,
      "a": -1.67,
      "b": 5.9
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Combat Fatigues"
    ]
  },
  {
    "paint_id": "army-painter-grotesque-green",
    "name": "Grotesque Green",
    "brand": "Army Painter",
    "hex": "#B8C89F",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 184,
      "g": 200,
      "b": 159
    },
    "lab": {
      "l": 78.46,
      "a": -12.68,
      "b": 18.73
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Zombie Flesh"
    ]
  },
  {
    "paint_id": "army-painter-guardian-green",
    "name": "Guardian Green",
    "brand": "Army Painter",
    "hex": "#216143",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 33,
      "g": 97,
      "b": 67
    },
    "lab": {
      "l": 36.51,
      "a": -28.21,
      "b": 11.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Savage Green"
    ]
  },
  {
    "paint_id": "army-painter-gun-metal",
    "name": "Gun Metal",
    "brand": "Army Painter",
    "hex": "#4B4D4C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 75,
      "g": 77,
      "b": 76
    },
    "lab": {
      "l": 32.54,
      "a": -1.03,
      "b": 0.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Leadbelcher"
    ]
  },
  {
    "paint_id": "army-painter-hexed-violet",
    "name": "Hexed Violet",
    "brand": "Army Painter",
    "hex": "#9482BA",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 148,
      "g": 130,
      "b": 186
    },
    "lab": {
      "l": 57.85,
      "a": 18.49,
      "b": -26.86
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Daemonette Hide"
    ]
  },
  {
    "paint_id": "army-painter-hydra-turquoise",
    "name": "Hydra Turquoise",
    "brand": "Army Painter",
    "hex": "#008F94",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 143,
      "b": 148
    },
    "lab": {
      "l": 53.79,
      "a": -29.65,
      "b": -11.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Temple Guard Blue"
    ]
  },
  {
    "paint_id": "army-painter-ice-yellow",
    "name": "Ice Yellow",
    "brand": "Army Painter",
    "hex": "#FFEFAE",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 239,
      "b": 174
    },
    "lab": {
      "l": 94.33,
      "a": -3.99,
      "b": 33.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Arid Earth"
    ]
  },
  {
    "paint_id": "army-painter-imperial-navy",
    "name": "Imperial Navy",
    "brand": "Army Painter",
    "hex": "#003560",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 53,
      "b": 96
    },
    "lab": {
      "l": 21.54,
      "a": 2.66,
      "b": -29.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Deep Blue"
    ]
  },
  {
    "paint_id": "army-painter-impish-rouge",
    "name": "Impish Rouge",
    "brand": "Army Painter",
    "hex": "#D94C95",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 217,
      "g": 76,
      "b": 149
    },
    "lab": {
      "l": 54.13,
      "a": 61.58,
      "b": -10.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-inner-light",
    "name": "Inner Light",
    "brand": "Army Painter",
    "hex": "#FDCA53",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 202,
      "b": 83
    },
    "lab": {
      "l": 83.84,
      "a": 6.07,
      "b": 64.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Phoenix Flames"
    ]
  },
  {
    "paint_id": "army-painter-jasper-skin",
    "name": "Jasper Skin",
    "brand": "Army Painter",
    "hex": "#BE7772",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 190,
      "g": 119,
      "b": 114
    },
    "lab": {
      "l": 57.42,
      "a": 27.22,
      "b": 14.47
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dorado Skin"
    ]
  },
  {
    "paint_id": "army-painter-kraken-lavender",
    "name": "Kraken Lavender",
    "brand": "Army Painter",
    "hex": "#DCCFE6",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 220,
      "g": 207,
      "b": 230
    },
    "lab": {
      "l": 84.77,
      "a": 8.66,
      "b": -9.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Orc Blood"
    ]
  },
  {
    "paint_id": "army-painter-lava-orange",
    "name": "Lava Orange",
    "brand": "Army Painter",
    "hex": "#F07500",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 240,
      "g": 117,
      "b": 0
    },
    "lab": {
      "l": 62.72,
      "a": 42.43,
      "b": 70.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fire Dragon Bright"
    ]
  },
  {
    "paint_id": "army-painter-leafy-green",
    "name": "Leafy Green",
    "brand": "Army Painter",
    "hex": "#72B61C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 114,
      "g": 182,
      "b": 28
    },
    "lab": {
      "l": 67.36,
      "a": -43.84,
      "b": 63.59
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Moot Green"
    ]
  },
  {
    "paint_id": "army-painter-leather-brown",
    "name": "Leather Brown",
    "brand": "Army Painter",
    "hex": "#694433",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 105,
      "g": 68,
      "b": 51
    },
    "lab": {
      "l": 32.65,
      "a": 13.81,
      "b": 16.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mournfang Brown"
    ]
  },
  {
    "paint_id": "army-painter-legendary-red",
    "name": "Legendary Red",
    "brand": "Army Painter",
    "hex": "#EA3A30",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 234,
      "g": 58,
      "b": 48
    },
    "lab": {
      "l": 52.66,
      "a": 65.75,
      "b": 47.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Squig Orange"
    ]
  },
  {
    "paint_id": "army-painter-leopard-stone-skin",
    "name": "Leopard Stone Skin",
    "brand": "Army Painter",
    "hex": "#E9B9B3",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 233,
      "g": 185,
      "b": 179
    },
    "lab": {
      "l": 79.2,
      "a": 16.39,
      "b": 9.64
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Centaur Skin"
    ]
  },
  {
    "paint_id": "army-painter-light-tone",
    "name": "Light Tone",
    "brand": "Army Painter",
    "hex": "#AA6C00",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 170,
      "g": 108,
      "b": 0
    },
    "lab": {
      "l": 51.01,
      "a": 17.91,
      "b": 58.2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-magecast-magenta",
    "name": "Magecast Magenta",
    "brand": "Army Painter",
    "hex": "#6F328A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 111,
      "g": 50,
      "b": 138
    },
    "lab": {
      "l": 32.91,
      "a": 41.97,
      "b": -37.88
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-magenta-tone",
    "name": "Magenta Tone",
    "brand": "Army Painter",
    "hex": "#94004F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 148,
      "g": 0,
      "b": 79
    },
    "lab": {
      "l": 31.49,
      "a": 56.98,
      "b": -1.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Carroburg Crimson"
    ]
  },
  {
    "paint_id": "army-painter-marine-mist",
    "name": "Marine Mist",
    "brand": "Army Painter",
    "hex": "#9ED5D3",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 158,
      "g": 213,
      "b": 211
    },
    "lab": {
      "l": 81.6,
      "a": -18,
      "b": -4.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Toxic Mist"
    ]
  },
  {
    "paint_id": "army-painter-matt-black",
    "name": "Matt Black",
    "brand": "Army Painter",
    "hex": "#000000",
    "type": "Base",
    "category": "base",
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
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Abaddon Black"
    ]
  },
  {
    "paint_id": "army-painter-matt-white",
    "name": "Matt White",
    "brand": "Army Painter",
    "hex": "#F4F4F2",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 244,
      "g": 244,
      "b": 242
    },
    "lab": {
      "l": 96.14,
      "a": -0.35,
      "b": 0.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "White Scar"
    ]
  },
  {
    "paint_id": "army-painter-medieval-forest",
    "name": "Medieval Forest",
    "brand": "Army Painter",
    "hex": "#447B6B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 68,
      "g": 123,
      "b": 107
    },
    "lab": {
      "l": 47.57,
      "a": -22.33,
      "b": 3.09
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-military-shade",
    "name": "Military Shade",
    "brand": "Army Painter",
    "hex": "#444618",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 68,
      "g": 70,
      "b": 24
    },
    "lab": {
      "l": 28.58,
      "a": -8.12,
      "b": 26.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Military Shader"
    ]
  },
  {
    "paint_id": "army-painter-mithril",
    "name": "Mithril",
    "brand": "Army Painter",
    "hex": "#8F908F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 143,
      "g": 144,
      "b": 143
    },
    "lab": {
      "l": 59.68,
      "a": -0.56,
      "b": 0.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stormhost Silver"
    ]
  },
  {
    "paint_id": "army-painter-moldy-wine",
    "name": "Moldy Wine",
    "brand": "Army Painter",
    "hex": "#81344E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 129,
      "g": 52,
      "b": 78
    },
    "lab": {
      "l": 33.3,
      "a": 35.94,
      "b": 0.97
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Wasteland Soil"
    ]
  },
  {
    "paint_id": "army-painter-molten-lava",
    "name": "Molten Lava",
    "brand": "Army Painter",
    "hex": "#EA4326",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 234,
      "g": 67,
      "b": 38
    },
    "lab": {
      "l": 53.66,
      "a": 62.5,
      "b": 53.05
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Molten Orange"
    ]
  },
  {
    "paint_id": "army-painter-moonstone-skin",
    "name": "Moonstone Skin",
    "brand": "Army Painter",
    "hex": "#C87B71",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 200,
      "g": 123,
      "b": 113
    },
    "lab": {
      "l": 59.56,
      "a": 28.83,
      "b": 18.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Scar Tissue"
    ]
  },
  {
    "paint_id": "army-painter-mossy-green",
    "name": "Mossy Green",
    "brand": "Army Painter",
    "hex": "#B7DCBE",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 183,
      "g": 220,
      "b": 190
    },
    "lab": {
      "l": 84.47,
      "a": -17.88,
      "b": 10.74
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Leviathan Light"
    ]
  },
  {
    "paint_id": "army-painter-mulled-berry",
    "name": "Mulled Berry",
    "brand": "Army Painter",
    "hex": "#663746",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 102,
      "g": 55,
      "b": 70
    },
    "lab": {
      "l": 29.41,
      "a": 22.94,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Grimoire Purple"
    ]
  },
  {
    "paint_id": "army-painter-necrotic-flesh",
    "name": "Necrotic Flesh",
    "brand": "Army Painter",
    "hex": "#A1AC82",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 161,
      "g": 172,
      "b": 130
    },
    "lab": {
      "l": 68.53,
      "a": -11.23,
      "b": 20.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Nurgling Green"
    ]
  },
  {
    "paint_id": "army-painter-neptune-glow",
    "name": "Neptune Glow",
    "brand": "Army Painter",
    "hex": "#80CBD1",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 128,
      "g": 203,
      "b": 209
    },
    "lab": {
      "l": 77.22,
      "a": -21.7,
      "b": -10.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-night-sky",
    "name": "Night Sky",
    "brand": "Army Painter",
    "hex": "#394858",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 57,
      "g": 72,
      "b": 88
    },
    "lab": {
      "l": 29.93,
      "a": -1.53,
      "b": -11.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dark Reaper"
    ]
  },
  {
    "paint_id": "army-painter-oak-brown",
    "name": "Oak Brown",
    "brand": "Army Painter",
    "hex": "#3C2C29",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 60,
      "g": 44,
      "b": 41
    },
    "lab": {
      "l": 19.73,
      "a": 6.84,
      "b": 4.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-obsidian-skin",
    "name": "Obsidian Skin",
    "brand": "Army Painter",
    "hex": "#4B4344",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 75,
      "g": 67,
      "b": 68
    },
    "lab": {
      "l": 29.23,
      "a": 3.6,
      "b": 0.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Onyx Skin"
    ]
  },
  {
    "paint_id": "army-painter-olive-drab",
    "name": "Olive Drab",
    "brand": "Army Painter",
    "hex": "#728552",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 114,
      "g": 133,
      "b": 82
    },
    "lab": {
      "l": 52.91,
      "a": -16.13,
      "b": 25.27
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Witch Brew"
    ]
  },
  {
    "paint_id": "army-painter-opal-skin",
    "name": "Opal Skin",
    "brand": "Army Painter",
    "hex": "#FBD5C7",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 251,
      "g": 213,
      "b": 199
    },
    "lab": {
      "l": 88.08,
      "a": 11.14,
      "b": 11.85
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pale-sand",
    "name": "Pale Sand",
    "brand": "Army Painter",
    "hex": "#F2ECD7",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 242,
      "g": 236,
      "b": 215
    },
    "lab": {
      "l": 93.35,
      "a": -1.48,
      "b": 10.9
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hobgoblin Hue"
    ]
  },
  {
    "paint_id": "army-painter-paratrooper-tan",
    "name": "Paratrooper Tan",
    "brand": "Army Painter",
    "hex": "#9E7B6C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 158,
      "g": 123,
      "b": 108
    },
    "lab": {
      "l": 54.57,
      "a": 11.35,
      "b": 13.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Monster Brown"
    ]
  },
  {
    "paint_id": "army-painter-patagon-pine",
    "name": "Patagon Pine",
    "brand": "Army Painter",
    "hex": "#64937D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 100,
      "g": 147,
      "b": 125
    },
    "lab": {
      "l": 57.13,
      "a": -20.88,
      "b": 6.61
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Skarsnik Green"
    ]
  },
  {
    "paint_id": "army-painter-pearl-skin",
    "name": "Pearl Skin",
    "brand": "Army Painter",
    "hex": "#FDE6DC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 253,
      "g": 230,
      "b": 220
    },
    "lab": {
      "l": 92.86,
      "a": 6.23,
      "b": 7.71
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mummy Robes"
    ]
  },
  {
    "paint_id": "army-painter-phalanx-blue",
    "name": "Phalanx Blue",
    "brand": "Army Painter",
    "hex": "#0086AD",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 134,
      "b": 173
    },
    "lab": {
      "l": 51.91,
      "a": -16.27,
      "b": -29.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Troglodyte Blue"
    ]
  },
  {
    "paint_id": "army-painter-pharaoh-guard",
    "name": "Pharaoh Guard",
    "brand": "Army Painter",
    "hex": "#00765C",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 118,
      "b": 92
    },
    "lab": {
      "l": 43.84,
      "a": -35.14,
      "b": 6.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Wizards Orb"
    ]
  },
  {
    "paint_id": "army-painter-pink-potion",
    "name": "Pink Potion",
    "brand": "Army Painter",
    "hex": "#F7BCD5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 247,
      "g": 188,
      "b": 213
    },
    "lab": {
      "l": 82.13,
      "a": 24.96,
      "b": -4.25
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-pixie-pink",
    "name": "Pixie Pink",
    "brand": "Army Painter",
    "hex": "#D96AA5",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 217,
      "g": 106,
      "b": 165
    },
    "lab": {
      "l": 59.69,
      "a": 50.19,
      "b": -11.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Emperor’s Children"
    ]
  },
  {
    "paint_id": "army-painter-plate-mail-metal",
    "name": "Plate Mail Metal",
    "brand": "Army Painter",
    "hex": "#606362",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 96,
      "g": 99,
      "b": 98
    },
    "lab": {
      "l": 41.68,
      "a": -1.38,
      "b": 0.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Iron Hands Steel"
    ]
  },
  {
    "paint_id": "army-painter-prairie-ochre",
    "name": "Prairie Ochre",
    "brand": "Army Painter",
    "hex": "#6F683E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 111,
      "g": 104,
      "b": 62
    },
    "lab": {
      "l": 43.7,
      "a": -3.88,
      "b": 24.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Sulfide Ochre"
    ]
  },
  {
    "paint_id": "army-painter-pure-red",
    "name": "Pure Red",
    "brand": "Army Painter",
    "hex": "#B90119",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 185,
      "g": 1,
      "b": 25
    },
    "lab": {
      "l": 38.57,
      "a": 63.16,
      "b": 42.52
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-purple-tone",
    "name": "Purple Tone",
    "brand": "Army Painter",
    "hex": "#4A3255",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 74,
      "g": 50,
      "b": 85
    },
    "lab": {
      "l": 24.93,
      "a": 18.18,
      "b": -17.02
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Druchii Violet"
    ]
  },
  {
    "paint_id": "army-painter-quartz-skin",
    "name": "Quartz Skin",
    "brand": "Army Painter",
    "hex": "#F1D4B5",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 241,
      "g": 212,
      "b": 181
    },
    "lab": {
      "l": 86.57,
      "a": 5.45,
      "b": 19.06
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-raging-rose",
    "name": "Raging Rose",
    "brand": "Army Painter",
    "hex": "#E55D5A",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 229,
      "g": 93,
      "b": 90
    },
    "lab": {
      "l": 57.3,
      "a": 52.65,
      "b": 29.08
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Wyrmling Red"
    ]
  },
  {
    "paint_id": "army-painter-raging-rouge",
    "name": "Raging Rouge",
    "brand": "Army Painter",
    "hex": "#F28E7F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 242,
      "g": 142,
      "b": 127
    },
    "lab": {
      "l": 69.3,
      "a": 36.3,
      "b": 24.42
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ratskin Flesh"
    ]
  },
  {
    "paint_id": "army-painter-rainforest",
    "name": "Rainforest",
    "brand": "Army Painter",
    "hex": "#8BBD0D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 139,
      "g": 189,
      "b": 13
    },
    "lab": {
      "l": 70.81,
      "a": -37.89,
      "b": 69.76
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Jungle Green"
    ]
  },
  {
    "paint_id": "army-painter-red-tone",
    "name": "Red Tone",
    "brand": "Army Painter",
    "hex": "#74252C",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 116,
      "g": 37,
      "b": 44
    },
    "lab": {
      "l": 27.35,
      "a": 35.15,
      "b": 14.66
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-regal-blue",
    "name": "Regal Blue",
    "brand": "Army Painter",
    "hex": "#004A84",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 74,
      "b": 132
    },
    "lab": {
      "l": 30.79,
      "a": 3.96,
      "b": -37.99
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Caledor Sky"
    ]
  },
  {
    "paint_id": "army-painter-resplendent-red",
    "name": "Resplendent Red",
    "brand": "Army Painter",
    "hex": "#992426",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 153,
      "g": 36,
      "b": 38
    },
    "lab": {
      "l": 34.35,
      "a": 47.79,
      "b": 28.71
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Abomination Gore"
    ]
  },
  {
    "paint_id": "army-painter-royal-blue",
    "name": "Royal Blue",
    "brand": "Army Painter",
    "hex": "#0057A5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 87,
      "b": 165
    },
    "lab": {
      "l": 36.99,
      "a": 9.19,
      "b": -48.07
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Viking Blue"
    ]
  },
  {
    "paint_id": "army-painter-ruby-skin",
    "name": "Ruby Skin",
    "brand": "Army Painter",
    "hex": "#F8BCA8",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 248,
      "g": 188,
      "b": 168
    },
    "lab": {
      "l": 81.16,
      "a": 18.93,
      "b": 18.51
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-ruddy-umber",
    "name": "Ruddy Umber",
    "brand": "Army Painter",
    "hex": "#9B5B4D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 155,
      "g": 91,
      "b": 77
    },
    "lab": {
      "l": 45.62,
      "a": 24.69,
      "b": 19.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Tanned Flesh"
    ]
  },
  {
    "paint_id": "army-painter-runic-cobalt",
    "name": "Runic Cobalt",
    "brand": "Army Painter",
    "hex": "#7B97B3",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 123,
      "g": 151,
      "b": 179
    },
    "lab": {
      "l": 61.31,
      "a": -3.04,
      "b": -17.77
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fog Grey"
    ]
  },
  {
    "paint_id": "army-painter-sacred-scarlet",
    "name": "Sacred Scarlet",
    "brand": "Army Painter",
    "hex": "#EC563E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 236,
      "g": 86,
      "b": 62
    },
    "lab": {
      "l": 56.92,
      "a": 56.57,
      "b": 44.44
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-scarab-green",
    "name": "Scarab Green",
    "brand": "Army Painter",
    "hex": "#1F3C42",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 31,
      "g": 60,
      "b": 66
    },
    "lab": {
      "l": 23.39,
      "a": -8.95,
      "b": -7.08
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Obsidian Pigment Toner"
    ]
  },
  {
    "paint_id": "army-painter-sepia-tone",
    "name": "Sepia Tone",
    "brand": "Army Painter",
    "hex": "#9D5602",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 157,
      "g": 86,
      "b": 2
    },
    "lab": {
      "l": 43.99,
      "a": 24.49,
      "b": 52.3
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mid Brown"
    ]
  },
  {
    "paint_id": "army-painter-shieldwall-blue",
    "name": "Shieldwall Blue",
    "brand": "Army Painter",
    "hex": "#009FC7",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 159,
      "b": 199
    },
    "lab": {
      "l": 60.71,
      "a": -20.41,
      "b": -30.25
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Lothern Blue"
    ]
  },
  {
    "paint_id": "army-painter-shining-silver",
    "name": "Shining Silver",
    "brand": "Army Painter",
    "hex": "#7D7F7F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 125,
      "g": 127,
      "b": 127
    },
    "lab": {
      "l": 53.03,
      "a": -0.75,
      "b": -0.26
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Runefang Steel"
    ]
  },
  {
    "paint_id": "army-painter-skeleton-bone",
    "name": "Skeleton Bone",
    "brand": "Army Painter",
    "hex": "#C6BA98",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 198,
      "g": 186,
      "b": 152
    },
    "lab": {
      "l": 75.69,
      "a": -1.21,
      "b": 18.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ushabti Bone"
    ]
  },
  {
    "paint_id": "army-painter-space-dust",
    "name": "Space Dust",
    "brand": "Army Painter",
    "hex": "#FFE481",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 228,
      "b": 129
    },
    "lab": {
      "l": 90.93,
      "a": -3.13,
      "b": 51.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Moon Dust"
    ]
  },
  {
    "paint_id": "army-painter-spellbound-fuchsia",
    "name": "Spellbound Fuchsia",
    "brand": "Army Painter",
    "hex": "#B04492",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 176,
      "g": 68,
      "b": 146
    },
    "lab": {
      "l": 46.23,
      "a": 52.8,
      "b": -21.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Witchbane Plum"
    ]
  },
  {
    "paint_id": "army-painter-stratos-blue",
    "name": "Stratos Blue",
    "brand": "Army Painter",
    "hex": "#32628E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 50,
      "g": 98,
      "b": 142
    },
    "lab": {
      "l": 40.19,
      "a": -1.8,
      "b": -29.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Griffon Blue"
    ]
  },
  {
    "paint_id": "army-painter-strong-skin-shade",
    "name": "Strong Skin Shade",
    "brand": "Army Painter",
    "hex": "#492C21",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 73,
      "g": 44,
      "b": 33
    },
    "lab": {
      "l": 21.31,
      "a": 11.97,
      "b": 12.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Strong Skin Wash"
    ]
  },
  {
    "paint_id": "army-painter-talisman-teal",
    "name": "Talisman Teal",
    "brand": "Army Painter",
    "hex": "#00A485",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 164,
      "b": 133
    },
    "lab": {
      "l": 60.11,
      "a": -43.56,
      "b": 6.01
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Elemental Bolt"
    ]
  },
  {
    "paint_id": "army-painter-temple-gate-teal",
    "name": "Temple Gate Teal",
    "brand": "Army Painter",
    "hex": "#005E4F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 94,
      "b": 79
    },
    "lab": {
      "l": 35.14,
      "a": -28.06,
      "b": 1.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ruinous Spell"
    ]
  },
  {
    "paint_id": "army-painter-terrestrial-titan",
    "name": "Terrestrial Titan",
    "brand": "Army Painter",
    "hex": "#363246",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 54,
      "g": 50,
      "b": 70
    },
    "lab": {
      "l": 21.97,
      "a": 6.8,
      "b": -11.77
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Broodmother Purple"
    ]
  },
  {
    "paint_id": "army-painter-thunderous-blue",
    "name": "Thunderous Blue",
    "brand": "Army Painter",
    "hex": "#355577",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 53,
      "g": 85,
      "b": 119
    },
    "lab": {
      "l": 35.17,
      "a": -1.04,
      "b": -22.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "The Fang"
    ]
  },
  {
    "paint_id": "army-painter-tidal-blue",
    "name": "Tidal Blue",
    "brand": "Army Painter",
    "hex": "#006A93",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 106,
      "b": 147
    },
    "lab": {
      "l": 41.87,
      "a": -10.13,
      "b": -29.57
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ahriman Blue"
    ]
  },
  {
    "paint_id": "army-painter-tigers-eye-skin",
    "name": "Tiger’s Eye Skin",
    "brand": "Army Painter",
    "hex": "#944E4E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 148,
      "g": 78,
      "b": 78
    },
    "lab": {
      "l": 41.68,
      "a": 29.23,
      "b": 13.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Husk Brown"
    ]
  },
  {
    "paint_id": "army-painter-tomb-king-tan",
    "name": "Tomb King Tan",
    "brand": "Army Painter",
    "hex": "#AB9C7E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 171,
      "g": 156,
      "b": 126
    },
    "lab": {
      "l": 64.92,
      "a": 0.68,
      "b": 17.74
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Banshee Brown"
    ]
  },
  {
    "paint_id": "army-painter-topaz-skin",
    "name": "Topaz Skin",
    "brand": "Army Painter",
    "hex": "#B5564D",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 181,
      "g": 86,
      "b": 77
    },
    "lab": {
      "l": 48.28,
      "a": 37.74,
      "b": 23.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tourmaline-skin",
    "name": "Tourmaline Skin",
    "brand": "Army Painter",
    "hex": "#E39D8B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 227,
      "g": 157,
      "b": 139
    },
    "lab": {
      "l": 71.09,
      "a": 23.9,
      "b": 19.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-tree-ancient",
    "name": "Tree Ancient",
    "brand": "Army Painter",
    "hex": "#513930",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 81,
      "g": 57,
      "b": 48
    },
    "lab": {
      "l": 26.42,
      "a": 9.27,
      "b": 9.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dirt Spatter"
    ]
  },
  {
    "paint_id": "army-painter-triumphant-navy",
    "name": "Triumphant Navy",
    "brand": "Army Painter",
    "hex": "#1B2B52",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 27,
      "g": 43,
      "b": 82
    },
    "lab": {
      "l": 18.23,
      "a": 7.58,
      "b": -25.88
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dark Sky"
    ]
  },
  {
    "paint_id": "army-painter-true-brass",
    "name": "True Brass",
    "brand": "Army Painter",
    "hex": "#736D5F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 115,
      "g": 109,
      "b": 95
    },
    "lab": {
      "l": 46.19,
      "a": -0.25,
      "b": 8.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Canoptek Alloy"
    ]
  },
  {
    "paint_id": "army-painter-true-copper",
    "name": "True Copper",
    "brand": "Army Painter",
    "hex": "#774C30",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 119,
      "g": 76,
      "b": 48
    },
    "lab": {
      "l": 36.57,
      "a": 15.05,
      "b": 24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Balthasar Gold"
    ]
  },
  {
    "paint_id": "army-painter-tundra-taupe",
    "name": "Tundra Taupe",
    "brand": "Army Painter",
    "hex": "#52533B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 82,
      "g": 83,
      "b": 59
    },
    "lab": {
      "l": 34.59,
      "a": -4.93,
      "b": 13.97
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Venom Wyrm"
    ]
  },
  {
    "paint_id": "army-painter-turquoise-siren",
    "name": "Turquoise Siren",
    "brand": "Army Painter",
    "hex": "#28ADB4",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 40,
      "g": 173,
      "b": 180
    },
    "lab": {
      "l": 64.67,
      "a": -31.45,
      "b": -13.55
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Royal Cloak"
    ]
  },
  {
    "paint_id": "army-painter-ultramarine-blue",
    "name": "Ultramarine Blue",
    "brand": "Army Painter",
    "hex": "#264587",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 38,
      "g": 69,
      "b": 135
    },
    "lab": {
      "l": 30.44,
      "a": 12.35,
      "b": -40.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Altdorf Guard Blue"
    ]
  },
  {
    "paint_id": "army-painter-uniform-grey",
    "name": "Uniform Grey",
    "brand": "Army Painter",
    "hex": "#727880",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 114,
      "g": 120,
      "b": 128
    },
    "lab": {
      "l": 50.18,
      "a": -0.53,
      "b": -5.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dawnstone"
    ]
  },
  {
    "paint_id": "army-painter-urban-buff",
    "name": "Urban Buff",
    "brand": "Army Painter",
    "hex": "#DEBCAB",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 222,
      "g": 188,
      "b": 171
    },
    "lab": {
      "l": 78.72,
      "a": 9.55,
      "b": 13.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Kobold Skin"
    ]
  },
  {
    "paint_id": "army-painter-violent-vermillion",
    "name": "Violent Vermillion",
    "brand": "Army Painter",
    "hex": "#EF735A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 239,
      "g": 115,
      "b": 90
    },
    "lab": {
      "l": 62.81,
      "a": 45.86,
      "b": 36.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Nomad Flesh"
    ]
  },
  {
    "paint_id": "army-painter-violet-coven",
    "name": "Violet Coven",
    "brand": "Army Painter",
    "hex": "#B19CC8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 177,
      "g": 156,
      "b": 200
    },
    "lab": {
      "l": 67.5,
      "a": 16.17,
      "b": -19.73
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Oozing Purple"
    ]
  },
  {
    "paint_id": "army-painter-vivid-volt",
    "name": "Vivid Volt",
    "brand": "Army Painter",
    "hex": "#D2DB39",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 210,
      "g": 219,
      "b": 57
    },
    "lab": {
      "l": 84.31,
      "a": -21.73,
      "b": 73.03
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Poisonous Cloud"
    ]
  },
  {
    "paint_id": "army-painter-warlock-magenta",
    "name": "Warlock Magenta",
    "brand": "Army Painter",
    "hex": "#843F90",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 132,
      "g": 63,
      "b": 144
    },
    "lab": {
      "l": 38.68,
      "a": 42.25,
      "b": -32.21
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Xereus Purple"
    ]
  },
  {
    "paint_id": "army-painter-warped-yellow",
    "name": "Warped Yellow",
    "brand": "Army Painter",
    "hex": "#FFD434",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 212,
      "b": 52
    },
    "lab": {
      "l": 86.31,
      "a": 0.46,
      "b": 77.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Babe Blonde"
    ]
  },
  {
    "paint_id": "army-painter-wasteland-clay",
    "name": "Wasteland Clay",
    "brand": "Army Painter",
    "hex": "#A98C4E",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 169,
      "g": 140,
      "b": 78
    },
    "lab": {
      "l": 59.66,
      "a": 3.05,
      "b": 36.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Basilisk Brown"
    ]
  },
  {
    "paint_id": "army-painter-weapon-bronze",
    "name": "Weapon Bronze",
    "brand": "Army Painter",
    "hex": "#8D5100",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 141,
      "g": 81,
      "b": 0
    },
    "lab": {
      "l": 40.49,
      "a": 20.11,
      "b": 49.5
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Brass Scorpion"
    ]
  },
  {
    "paint_id": "army-painter-weird-elixir",
    "name": "Weird Elixir",
    "brand": "Army Painter",
    "hex": "#E395BE",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 227,
      "g": 149,
      "b": 190
    },
    "lab": {
      "l": 70.56,
      "a": 35.11,
      "b": -9.07
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fey Pink"
    ]
  },
  {
    "paint_id": "army-painter-wicked-pink",
    "name": "Wicked Pink",
    "brand": "Army Painter",
    "hex": "#CD0079",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 205,
      "g": 0,
      "b": 121
    },
    "lab": {
      "l": 44.75,
      "a": 73.32,
      "b": -7.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Warlock Purple"
    ]
  },
  {
    "paint_id": "army-painter-wild-green",
    "name": "Wild Green",
    "brand": "Army Painter",
    "hex": "#3BAB41",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 59,
      "g": 171,
      "b": 65
    },
    "lab": {
      "l": 62.03,
      "a": -52.86,
      "b": 44.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "army-painter-wilted-rose",
    "name": "Wilted Rose",
    "brand": "Army Painter",
    "hex": "#EEC8DA",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 238,
      "g": 200,
      "b": 218
    },
    "lab": {
      "l": 84.25,
      "a": 16.32,
      "b": -3.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mutant Hue"
    ]
  },
  {
    "paint_id": "army-painter-wolf-grey",
    "name": "Wolf Grey",
    "brand": "Army Painter",
    "hex": "#577CA4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 87,
      "g": 124,
      "b": 164
    },
    "lab": {
      "l": 50.83,
      "a": -1.79,
      "b": -25.42
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Russ Grey"
    ]
  },
  {
    "paint_id": "army-painter-woodland-camo",
    "name": "Woodland Camo",
    "brand": "Army Painter",
    "hex": "#3F4C34",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 63,
      "g": 76,
      "b": 52
    },
    "lab": {
      "l": 30.58,
      "a": -10.29,
      "b": 12.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Elf Green"
    ]
  },
  {
    "paint_id": "army-painter-worn-stone",
    "name": "Worn Stone",
    "brand": "Army Painter",
    "hex": "#CBC8B8",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 203,
      "g": 200,
      "b": 184
    },
    "lab": {
      "l": 80.44,
      "a": -1.75,
      "b": 8.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Drake Tooth"
    ]
  },
  {
    "paint_id": "army-painter-wyvern-fury",
    "name": "Wyvern Fury",
    "brand": "Army Painter",
    "hex": "#9C2E3D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 156,
      "g": 46,
      "b": 61
    },
    "lab": {
      "l": 36.67,
      "a": 46.33,
      "b": 17.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Vampire Red"
    ]
  },
  {
    "paint_id": "citadel-abaddon-black",
    "name": "Abaddon Black",
    "brand": "Citadel",
    "hex": "#231F20",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 35,
      "g": 31,
      "b": 32
    },
    "lab": {
      "l": 12.23,
      "a": 2.14,
      "b": 0.01
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Abaddon Black"
    ]
  },
  {
    "paint_id": "citadel-administratum-grey",
    "name": "Administratum Grey",
    "brand": "Citadel",
    "hex": "#949B95",
    "type": "Layer",
    "category": "layer",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 148,
      "g": 155,
      "b": 149
    },
    "lab": {
      "l": 63.27,
      "a": -3.68,
      "b": 2.27
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Administratum Grey"
    ]
  },
  {
    "paint_id": "citadel-agrax-earthshade",
    "name": "Agrax Earthshade",
    "brand": "Citadel",
    "hex": "#5A573F",
    "type": "Shade",
    "category": "shade",
    "family": "Bone",
    "colorFamily": "bone",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Agrax Earthshade"
    ]
  },
  {
    "paint_id": "citadel-ahriman-blue",
    "name": "Ahriman Blue",
    "brand": "Citadel",
    "hex": "#1F8C9C",
    "type": "Layer",
    "category": "layer",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 31,
      "g": 140,
      "b": 156
    },
    "lab": {
      "l": 53.43,
      "a": -23.55,
      "b": -16.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ahriman Blue"
    ]
  },
  {
    "paint_id": "citadel-alaitoc-blue",
    "name": "Alaitoc Blue",
    "brand": "Citadel",
    "hex": "#295788",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 41,
      "g": 87,
      "b": 136
    },
    "lab": {
      "l": 36.11,
      "a": 1.29,
      "b": -31.93
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Alaitoc Blue"
    ]
  },
  {
    "paint_id": "citadel-altdorf-guard-blue",
    "name": "Altdorf Guard Blue",
    "brand": "Citadel",
    "hex": "#1F56A7",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 31,
      "g": 86,
      "b": 167
    },
    "lab": {
      "l": 37.36,
      "a": 12.65,
      "b": -48.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Altdorf Guard Blue"
    ]
  },
  {
    "paint_id": "citadel-armageddon-dust",
    "name": "Armageddon Dust",
    "brand": "Citadel",
    "hex": "#D3A907",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 211,
      "g": 169,
      "b": 7
    },
    "lab": {
      "l": 71.04,
      "a": 2.91,
      "b": 73.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Armageddon Dust"
    ]
  },
  {
    "paint_id": "citadel-astrogranite",
    "name": "Astrogranite",
    "brand": "Citadel",
    "hex": "#757679",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 117,
      "g": 118,
      "b": 121
    },
    "lab": {
      "l": 49.64,
      "a": 0.24,
      "b": -1.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Astrogranite"
    ]
  },
  {
    "paint_id": "citadel-athonian-camoshade",
    "name": "Athonian Camoshade",
    "brand": "Citadel",
    "hex": "#6D8E44",
    "type": "Shade",
    "category": "shade",
    "family": "Bone",
    "colorFamily": "bone",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Athonian Camoshade"
    ]
  },
  {
    "paint_id": "citadel-auric-armour-gold",
    "name": "Auric Armour Gold",
    "brand": "Citadel",
    "hex": "#E8BC6D",
    "type": "Layer",
    "category": "layer",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 232,
      "g": 188,
      "b": 109
    },
    "lab": {
      "l": 78.6,
      "a": 6.44,
      "b": 45.58
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Auric Armour Gold"
    ]
  },
  {
    "paint_id": "citadel-averland-sunset",
    "name": "Averland Sunset",
    "brand": "Citadel",
    "hex": "#FDB825",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 184,
      "b": 37
    },
    "lab": {
      "l": 79.21,
      "a": 13.66,
      "b": 75.86
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Averland Sunset"
    ]
  },
  {
    "paint_id": "citadel-baharroth-blue",
    "name": "Baharroth Blue",
    "brand": "Citadel",
    "hex": "#58C1CD",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 88,
      "g": 193,
      "b": 205
    },
    "lab": {
      "l": 72.64,
      "a": -26.75,
      "b": -15.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Baharroth Blue"
    ]
  },
  {
    "paint_id": "citadel-balor-brown",
    "name": "Balor Brown",
    "brand": "Citadel",
    "hex": "#8B5910",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 139,
      "g": 89,
      "b": 16
    },
    "lab": {
      "l": 42.27,
      "a": 14.88,
      "b": 46.13
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Balor Brown"
    ]
  },
  {
    "paint_id": "citadel-balthasar-gold",
    "name": "Balthasar Gold",
    "brand": "Citadel",
    "hex": "#A47552",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 164,
      "g": 117,
      "b": 82
    },
    "lab": {
      "l": 53.2,
      "a": 14.2,
      "b": 26.56
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Balthasar Gold"
    ]
  },
  {
    "paint_id": "citadel-baneblade-brown",
    "name": "Baneblade Brown",
    "brand": "Citadel",
    "hex": "#937F6D",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 147,
      "g": 127,
      "b": 109
    },
    "lab": {
      "l": 54.54,
      "a": 4.71,
      "b": 12.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Baneblade Brown"
    ]
  },
  {
    "paint_id": "citadel-bestigor-flesh",
    "name": "Bestigor Flesh",
    "brand": "Citadel",
    "hex": "#D38A57",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 211,
      "g": 138,
      "b": 87
    },
    "lab": {
      "l": 63.93,
      "a": 22.76,
      "b": 38.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Bestigor Flesh"
    ]
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Biel-Tan Green"
    ]
  },
  {
    "paint_id": "citadel-blackfire-earth",
    "name": "Blackfire Earth",
    "brand": "Citadel",
    "hex": "#A75820",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 167,
      "g": 88,
      "b": 32
    },
    "lab": {
      "l": 46.04,
      "a": 28.41,
      "b": 44.72
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Blackfire Earth"
    ]
  },
  {
    "paint_id": "citadel-blue-horror",
    "name": "Blue Horror",
    "brand": "Citadel",
    "hex": "#A2BAD2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 162,
      "g": 186,
      "b": 210
    },
    "lab": {
      "l": 74.48,
      "a": -2.94,
      "b": -14.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Blue Horror"
    ]
  },
  {
    "paint_id": "citadel-brass-scorpion",
    "name": "Brass Scorpion",
    "brand": "Citadel",
    "hex": "#B7885F",
    "type": "Layer",
    "category": "layer",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 183,
      "g": 136,
      "b": 95
    },
    "lab": {
      "l": 60.34,
      "a": 12.88,
      "b": 28.96
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Brass Scorpion"
    ]
  },
  {
    "paint_id": "citadel-bugmans-glow",
    "name": "Bugmans Glow",
    "brand": "Citadel",
    "hex": "#834F44",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 131,
      "g": 79,
      "b": 68
    },
    "lab": {
      "l": 39.3,
      "a": 20.56,
      "b": 15.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Bugmans Glow"
    ]
  },
  {
    "paint_id": "citadel-cadian-fleshtone",
    "name": "Cadian Fleshtone",
    "brand": "Citadel",
    "hex": "#C77958",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 199,
      "g": 121,
      "b": 88
    },
    "lab": {
      "l": 58.53,
      "a": 27.14,
      "b": 30.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Cadian Fleshtone"
    ]
  },
  {
    "paint_id": "citadel-caledor-sky",
    "name": "Caledor Sky",
    "brand": "Citadel",
    "hex": "#396E9E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 57,
      "g": 110,
      "b": 158
    },
    "lab": {
      "l": 44.93,
      "a": -2.17,
      "b": -31.21
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Caledor Sky"
    ]
  },
  {
    "paint_id": "citadel-calgar-blue",
    "name": "Calgar Blue",
    "brand": "Citadel",
    "hex": "#4272B8",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 66,
      "g": 114,
      "b": 184
    },
    "lab": {
      "l": 47.82,
      "a": 6.15,
      "b": -41.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Calgar Blue"
    ]
  },
  {
    "paint_id": "citadel-caliban-green",
    "name": "Caliban Green",
    "brand": "Citadel",
    "hex": "#00401F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 64,
      "b": 31
    },
    "lab": {
      "l": 22.88,
      "a": -27.72,
      "b": 15.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Caliban Green"
    ]
  },
  {
    "paint_id": "citadel-carroburg-crimson",
    "name": "Carroburg Crimson",
    "brand": "Citadel",
    "hex": "#A82A70",
    "type": "Shade",
    "category": "shade",
    "family": "Pink",
    "colorFamily": "pink",
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
    "transparency": 0.85,
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Casandora Yellow"
    ]
  },
  {
    "paint_id": "citadel-castellan-green",
    "name": "Castellan Green",
    "brand": "Citadel",
    "hex": "#314821",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 49,
      "g": 72,
      "b": 33
    },
    "lab": {
      "l": 27.84,
      "a": -17.12,
      "b": 20.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Castellan Green"
    ]
  },
  {
    "paint_id": "citadel-celestra-grey",
    "name": "Celestra Grey",
    "brand": "Citadel",
    "hex": "#90A8A8",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 144,
      "g": 168,
      "b": 168
    },
    "lab": {
      "l": 67.1,
      "a": -8.29,
      "b": -2.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Celestra Grey"
    ]
  },
  {
    "paint_id": "citadel-ceramite-white",
    "name": "Ceramite White",
    "brand": "Citadel",
    "hex": "#FFFFFF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "lab": {
      "l": 100,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ceramite White"
    ]
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Coelia Greenshade"
    ]
  },
  {
    "paint_id": "citadel-daemonette-hide",
    "name": "Daemonette Hide",
    "brand": "Citadel",
    "hex": "#696684",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 105,
      "g": 102,
      "b": 132
    },
    "lab": {
      "l": 44.48,
      "a": 7.95,
      "b": -16.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Daemonette Hide"
    ]
  },
  {
    "paint_id": "citadel-dark-reaper",
    "name": "Dark Reaper",
    "brand": "Citadel",
    "hex": "#3B5150",
    "type": "Layer",
    "category": "layer",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 59,
      "g": 81,
      "b": 80
    },
    "lab": {
      "l": 32.69,
      "a": -8.65,
      "b": -2.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dark Reaper"
    ]
  },
  {
    "paint_id": "citadel-dawnstone",
    "name": "Dawnstone",
    "brand": "Citadel",
    "hex": "#70756E",
    "type": "Layer",
    "category": "layer",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 112,
      "g": 117,
      "b": 110
    },
    "lab": {
      "l": 48.63,
      "a": -3.31,
      "b": 3.2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dawnstone"
    ]
  },
  {
    "paint_id": "citadel-death-guard-green",
    "name": "Death Guard Green",
    "brand": "Citadel",
    "hex": "#848A66",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 132,
      "g": 138,
      "b": 102
    },
    "lab": {
      "l": 56.13,
      "a": -8.62,
      "b": 18.6
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Death Guard Green"
    ]
  },
  {
    "paint_id": "citadel-deathclaw-brown",
    "name": "Deathclaw Brown",
    "brand": "Citadel",
    "hex": "#B36853",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 179,
      "g": 104,
      "b": 83
    },
    "lab": {
      "l": 51.96,
      "a": 27.86,
      "b": 24.76
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Deathclaw Brown"
    ]
  },
  {
    "paint_id": "citadel-deathworld-forest",
    "name": "Deathworld Forest",
    "brand": "Citadel",
    "hex": "#5C6730",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 92,
      "g": 103,
      "b": 48
    },
    "lab": {
      "l": 41.52,
      "a": -13.47,
      "b": 29.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Deathworld Forest"
    ]
  },
  {
    "paint_id": "citadel-dechala-lilac",
    "name": "Dechala Lilac",
    "brand": "Citadel",
    "hex": "#B69FCC",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 182,
      "g": 159,
      "b": 204
    },
    "lab": {
      "l": 68.82,
      "a": 16.98,
      "b": -19.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dechala Lilac"
    ]
  },
  {
    "paint_id": "citadel-doombull-brown",
    "name": "Doombull Brown",
    "brand": "Citadel",
    "hex": "#5D0009",
    "type": "Layer",
    "category": "layer",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 93,
      "g": 0,
      "b": 9
    },
    "lab": {
      "l": 17.22,
      "a": 38.57,
      "b": 22.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Doombull Brown"
    ]
  },
  {
    "paint_id": "citadel-dorn-yellow",
    "name": "Dorn Yellow",
    "brand": "Citadel",
    "hex": "#FFF200",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 242,
      "b": 0
    },
    "lab": {
      "l": 93.78,
      "a": -15.32,
      "b": 92.03
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dorn Yellow"
    ]
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
    "transparency": 0.85,
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Druchii Violet"
    ]
  },
  {
    "paint_id": "citadel-dryad-bark",
    "name": "Dryad Bark",
    "brand": "Citadel",
    "hex": "#33312D",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 51,
      "g": 49,
      "b": 45
    },
    "lab": {
      "l": 20.4,
      "a": 0,
      "b": 2.87
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Dryad Bark"
    ]
  },
  {
    "paint_id": "citadel-elysian-green",
    "name": "Elysian Green",
    "brand": "Citadel",
    "hex": "#748F39",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 116,
      "g": 143,
      "b": 57
    },
    "lab": {
      "l": 55.74,
      "a": -23.35,
      "b": 41.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Elysian Green"
    ]
  },
  {
    "paint_id": "citadel-emperors-children",
    "name": "Emperors Children",
    "brand": "Citadel",
    "hex": "#B94278",
    "type": "Layer",
    "category": "layer",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 185,
      "g": 66,
      "b": 120
    },
    "lab": {
      "l": 46.4,
      "a": 52.85,
      "b": -5.02
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Emperors Children"
    ]
  },
  {
    "paint_id": "citadel-eshin-grey",
    "name": "Eshin Grey",
    "brand": "Citadel",
    "hex": "#4A4F52",
    "type": "Layer",
    "category": "layer",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 74,
      "g": 79,
      "b": 82
    },
    "lab": {
      "l": 33.26,
      "a": -1.32,
      "b": -2.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Eshin Grey"
    ]
  },
  {
    "paint_id": "citadel-evil-sunz-scarlet",
    "name": "Evil Sunz Scarlet",
    "brand": "Citadel",
    "hex": "#C2191F",
    "type": "Layer",
    "category": "layer",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 194,
      "g": 25,
      "b": 31
    },
    "lab": {
      "l": 41.64,
      "a": 62.44,
      "b": 42.83
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Evil Sunz Scarlet"
    ]
  },
  {
    "paint_id": "citadel-fenrisian-grey",
    "name": "Fenrisian Grey",
    "brand": "Citadel",
    "hex": "#719BB7",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 113,
      "g": 155,
      "b": 183
    },
    "lab": {
      "l": 61.97,
      "a": -7.1,
      "b": -19.06
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fenrisian Grey"
    ]
  },
  {
    "paint_id": "citadel-fire-dragon-bright",
    "name": "Fire Dragon Bright",
    "brand": "Citadel",
    "hex": "#F58652",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 245,
      "g": 134,
      "b": 82
    },
    "lab": {
      "l": 67.33,
      "a": 38.16,
      "b": 46.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fire Dragon Bright"
    ]
  },
  {
    "paint_id": "citadel-flash-gitz-yellow",
    "name": "Flash Gitz Yellow",
    "brand": "Citadel",
    "hex": "#FFF200",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 242,
      "b": 0
    },
    "lab": {
      "l": 93.78,
      "a": -15.32,
      "b": 92.03
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Flash Gitz Yellow"
    ]
  },
  {
    "paint_id": "citadel-flayed-one-flesh",
    "name": "Flayed One Flesh",
    "brand": "Citadel",
    "hex": "#F0D9B8",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 240,
      "g": 217,
      "b": 184
    },
    "lab": {
      "l": 87.78,
      "a": 2.9,
      "b": 19.17
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Flayed One Flesh"
    ]
  },
  {
    "paint_id": "citadel-fuegan-orange",
    "name": "Fuegan Orange",
    "brand": "Citadel",
    "hex": "#C77E4D",
    "type": "Shade",
    "category": "shade",
    "family": "Brown",
    "colorFamily": "brown",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Fuegan Orange"
    ]
  },
  {
    "paint_id": "citadel-fulgrim-pink",
    "name": "Fulgrim Pink",
    "brand": "Citadel",
    "hex": "#F4AFCD",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 244,
      "g": 175,
      "b": 205
    },
    "lab": {
      "l": 78.64,
      "a": 29.54,
      "b": -5.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fulgrim Pink"
    ]
  },
  {
    "paint_id": "citadel-fulgurite-copper",
    "name": "Fulgurite Copper",
    "brand": "Citadel",
    "hex": "#FCFCDE",
    "type": "Layer",
    "category": "layer",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 252,
      "g": 252,
      "b": 222
    },
    "lab": {
      "l": 98.27,
      "a": -4.96,
      "b": 14.39
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Fulgurite Copper"
    ]
  },
  {
    "paint_id": "citadel-gauss-blaster-green",
    "name": "Gauss Blaster Green",
    "brand": "Citadel",
    "hex": "#84C3AA",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 132,
      "g": 195,
      "b": 170
    },
    "lab": {
      "l": 74.08,
      "a": -25.58,
      "b": 6.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Gauss Blaster Green"
    ]
  },
  {
    "paint_id": "citadel-gehenna-s-gold",
    "name": "Gehenna's Gold",
    "brand": "Citadel",
    "hex": "#DBA674",
    "type": "Layer",
    "category": "layer",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 219,
      "g": 166,
      "b": 116
    },
    "lab": {
      "l": 71.96,
      "a": 13.45,
      "b": 33.39
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Gehenna's Gold"
    ]
  },
  {
    "paint_id": "citadel-genestealer-purple",
    "name": "Genestealer Purple",
    "brand": "Citadel",
    "hex": "#7761AB",
    "type": "Layer",
    "category": "layer",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 119,
      "g": 97,
      "b": 171
    },
    "lab": {
      "l": 46.19,
      "a": 25.46,
      "b": -36.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Genestealer Purple"
    ]
  },
  {
    "paint_id": "citadel-gorthor-brown",
    "name": "Gorthor Brown",
    "brand": "Citadel",
    "hex": "#654741",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 101,
      "g": 71,
      "b": 65
    },
    "lab": {
      "l": 33.25,
      "a": 11.94,
      "b": 8.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Gorthor Brown"
    ]
  },
  {
    "paint_id": "citadel-hashut-copper",
    "name": "Hashut Copper",
    "brand": "Citadel",
    "hex": "#B77647",
    "type": "Layer",
    "category": "layer",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 183,
      "g": 118,
      "b": 71
    },
    "lab": {
      "l": 55.56,
      "a": 20.81,
      "b": 36.06
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hashut Copper"
    ]
  },
  {
    "paint_id": "citadel-hoeth-blue",
    "name": "Hoeth Blue",
    "brand": "Citadel",
    "hex": "#4C7FB4",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 76,
      "g": 127,
      "b": 180
    },
    "lab": {
      "l": 51.85,
      "a": -1.09,
      "b": -33.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Hoeth Blue"
    ]
  },
  {
    "paint_id": "citadel-incubi-darkness",
    "name": "Incubi Darkness",
    "brand": "Citadel",
    "hex": "#0B474A",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 11,
      "g": 71,
      "b": 74
    },
    "lab": {
      "l": 26.94,
      "a": -16.75,
      "b": -7.09
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Incubi Darkness"
    ]
  },
  {
    "paint_id": "citadel-ironbreaker",
    "name": "Ironbreaker",
    "brand": "Citadel",
    "hex": "#A1A6A9",
    "type": "Layer",
    "category": "layer",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 161,
      "g": 166,
      "b": 169
    },
    "lab": {
      "l": 67.81,
      "a": -1.19,
      "b": -2.17
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ironbreaker"
    ]
  },
  {
    "paint_id": "citadel-jokaero-orange",
    "name": "Jokaero Orange",
    "brand": "Citadel",
    "hex": "#EE3823",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 238,
      "g": 56,
      "b": 35
    },
    "lab": {
      "l": 53.09,
      "a": 67.2,
      "b": 54.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Jokaero Orange"
    ]
  },
  {
    "paint_id": "citadel-kabalite-green",
    "name": "Kabalite Green",
    "brand": "Citadel",
    "hex": "#038C67",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 3,
      "g": 140,
      "b": 103
    },
    "lab": {
      "l": 51.56,
      "a": -41.32,
      "b": 10.9
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Kabalite Green"
    ]
  },
  {
    "paint_id": "citadel-kantor-blue",
    "name": "Kantor Blue",
    "brand": "Citadel",
    "hex": "#002151",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 33,
      "b": 81
    },
    "lab": {
      "l": 13.72,
      "a": 10.59,
      "b": -32.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Kantor Blue"
    ]
  },
  {
    "paint_id": "citadel-karak-stone",
    "name": "Karak Stone",
    "brand": "Citadel",
    "hex": "#BB9662",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 187,
      "g": 150,
      "b": 98
    },
    "lab": {
      "l": 64.37,
      "a": 7.13,
      "b": 32.59
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Karak Stone"
    ]
  },
  {
    "paint_id": "citadel-khorne-red",
    "name": "Khorne Red",
    "brand": "Citadel",
    "hex": "#6A0001",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 106,
      "g": 0,
      "b": 1
    },
    "lab": {
      "l": 20.31,
      "a": 42.02,
      "b": 30.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Khorne Red"
    ]
  },
  {
    "paint_id": "citadel-kislev-flesh",
    "name": "Kislev Flesh",
    "brand": "Citadel",
    "hex": "#D6A875",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 214,
      "g": 168,
      "b": 117
    },
    "lab": {
      "l": 71.95,
      "a": 10.44,
      "b": 32.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Kislev Flesh"
    ]
  },
  {
    "paint_id": "citadel-krieg-khaki",
    "name": "Krieg Khaki",
    "brand": "Citadel",
    "hex": "#C0BD81",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 192,
      "g": 189,
      "b": 129
    },
    "lab": {
      "l": 75.57,
      "a": -8.2,
      "b": 30.77
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Krieg Khaki"
    ]
  },
  {
    "paint_id": "citadel-leadbelcher",
    "name": "Leadbelcher",
    "brand": "Citadel",
    "hex": "#888D8F",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 136,
      "g": 141,
      "b": 143
    },
    "lab": {
      "l": 58.29,
      "a": -1.42,
      "b": -1.7
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Leadbelcher"
    ]
  },
  {
    "paint_id": "citadel-liberator-gold",
    "name": "Liberator Gold",
    "brand": "Citadel",
    "hex": "#D3B587",
    "type": "Layer",
    "category": "layer",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 211,
      "g": 181,
      "b": 135
    },
    "lab": {
      "l": 75.23,
      "a": 4.27,
      "b": 27.46
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Liberator Gold"
    ]
  },
  {
    "paint_id": "citadel-loren-forest",
    "name": "Loren Forest",
    "brand": "Citadel",
    "hex": "#50702D",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 80,
      "g": 112,
      "b": 45
    },
    "lab": {
      "l": 43.48,
      "a": -23.73,
      "b": 33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Loren Forest"
    ]
  },
  {
    "paint_id": "citadel-lothern-blue",
    "name": "Lothern Blue",
    "brand": "Citadel",
    "hex": "#34A2CF",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 52,
      "g": 162,
      "b": 207
    },
    "lab": {
      "l": 62.57,
      "a": -15.78,
      "b": -31.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Lothern Blue"
    ]
  },
  {
    "paint_id": "citadel-lugganath-orange",
    "name": "Lugganath Orange",
    "brand": "Citadel",
    "hex": "#F79E86",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 247,
      "g": 158,
      "b": 134
    },
    "lab": {
      "l": 73.52,
      "a": 30.54,
      "b": 26.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Lugganath Orange"
    ]
  },
  {
    "paint_id": "citadel-lustrian-undergrowth",
    "name": "Lustrian Undergrowth",
    "brand": "Citadel",
    "hex": "#415A09",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 65,
      "g": 90,
      "b": 9
    },
    "lab": {
      "l": 34.91,
      "a": -21.65,
      "b": 39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Lustrian Undergrowth"
    ]
  },
  {
    "paint_id": "citadel-macragge-blue",
    "name": "Macragge Blue",
    "brand": "Citadel",
    "hex": "#0D407F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 13,
      "g": 64,
      "b": 127
    },
    "lab": {
      "l": 27.53,
      "a": 9.55,
      "b": -40.11
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Macragge Blue"
    ]
  },
  {
    "paint_id": "citadel-mechanicus-standard-grey",
    "name": "Mechanicus Standard Grey",
    "brand": "Citadel",
    "hex": "#3D4B4D",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 61,
      "g": 75,
      "b": 77
    },
    "lab": {
      "l": 30.78,
      "a": -5.03,
      "b": -3.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mechanicus Standard Grey"
    ]
  },
  {
    "paint_id": "citadel-mephiston-red",
    "name": "Mephiston Red",
    "brand": "Citadel",
    "hex": "#9A1115",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 154,
      "g": 17,
      "b": 21
    },
    "lab": {
      "l": 32.54,
      "a": 52.7,
      "b": 36.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mephiston Red"
    ]
  },
  {
    "paint_id": "citadel-moot-green",
    "name": "Moot Green",
    "brand": "Citadel",
    "hex": "#52B244",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 82,
      "g": 178,
      "b": 68
    },
    "lab": {
      "l": 65,
      "a": -49.58,
      "b": 46.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Moot Green"
    ]
  },
  {
    "paint_id": "citadel-mourn-mountain-snow",
    "name": "Mourn Mountain Snow",
    "brand": "Citadel",
    "hex": "#E9EAEB",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 233,
      "g": 234,
      "b": 235
    },
    "lab": {
      "l": 92.65,
      "a": -0.16,
      "b": -0.6
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mourn Mountain Snow"
    ]
  },
  {
    "paint_id": "citadel-mournfang-brown",
    "name": "Mournfang Brown",
    "brand": "Citadel",
    "hex": "#640909",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 100,
      "g": 9,
      "b": 9
    },
    "lab": {
      "l": 19.74,
      "a": 38.19,
      "b": 26.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Mournfang Brown"
    ]
  },
  {
    "paint_id": "citadel-naggaroth-night",
    "name": "Naggaroth Night",
    "brand": "Citadel",
    "hex": "#3D3354",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 61,
      "g": 51,
      "b": 84
    },
    "lab": {
      "l": 23.67,
      "a": 12.63,
      "b": -18.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Naggaroth Night"
    ]
  },
  {
    "paint_id": "citadel-nuln-oil",
    "name": "Nuln Oil",
    "brand": "Citadel",
    "hex": "#14100E",
    "type": "Shade",
    "category": "shade",
    "family": "Brown",
    "colorFamily": "brown",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Nuln Oil"
    ]
  },
  {
    "paint_id": "citadel-nurgling-green",
    "name": "Nurgling Green",
    "brand": "Citadel",
    "hex": "#849C63",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 132,
      "g": 156,
      "b": 99
    },
    "lab": {
      "l": 61.29,
      "a": -18.65,
      "b": 27.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Nurgling Green"
    ]
  },
  {
    "paint_id": "citadel-ogryn-camo",
    "name": "Ogryn Camo",
    "brand": "Citadel",
    "hex": "#9DA94B",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 157,
      "g": 169,
      "b": 75
    },
    "lab": {
      "l": 66.56,
      "a": -17.86,
      "b": 46.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ogryn Camo"
    ]
  },
  {
    "paint_id": "citadel-pallid-wych-flesh",
    "name": "Pallid Wych Flesh",
    "brand": "Citadel",
    "hex": "#CDCEBE",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 205,
      "g": 206,
      "b": 190
    },
    "lab": {
      "l": 82.29,
      "a": -3.16,
      "b": 7.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Pallid Wych Flesh"
    ]
  },
  {
    "paint_id": "citadel-pink-horror",
    "name": "Pink Horror",
    "brand": "Citadel",
    "hex": "#90305D",
    "type": "Layer",
    "category": "layer",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 144,
      "g": 48,
      "b": 93
    },
    "lab": {
      "l": 35.66,
      "a": 44.69,
      "b": -4.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Pink Horror"
    ]
  },
  {
    "paint_id": "citadel-rakarth-flesh",
    "name": "Rakarth Flesh",
    "brand": "Citadel",
    "hex": "#A29E91",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 162,
      "g": 158,
      "b": 145
    },
    "lab": {
      "l": 65.1,
      "a": -0.9,
      "b": 7.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Rakarth Flesh"
    ]
  },
  {
    "paint_id": "citadel-ratskin-flesh",
    "name": "Ratskin Flesh",
    "brand": "Citadel",
    "hex": "#AD6B4C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 173,
      "g": 107,
      "b": 76
    },
    "lab": {
      "l": 51.75,
      "a": 23.11,
      "b": 28.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ratskin Flesh"
    ]
  },
  {
    "paint_id": "citadel-reikland-fleshshade",
    "name": "Reikland Fleshshade",
    "brand": "Citadel",
    "hex": "#CA6C4D",
    "type": "Shade",
    "category": "shade",
    "family": "Brown",
    "colorFamily": "brown",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Reikland Fleshshade"
    ]
  },
  {
    "paint_id": "citadel-retributor-armour",
    "name": "Retributor Armour",
    "brand": "Citadel",
    "hex": "#C39E81",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 195,
      "g": 158,
      "b": 129
    },
    "lab": {
      "l": 67.76,
      "a": 9.56,
      "b": 20.34
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Retributor Armour"
    ]
  },
  {
    "paint_id": "citadel-rhinox-hide",
    "name": "Rhinox Hide",
    "brand": "Citadel",
    "hex": "#493435",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 73,
      "g": 52,
      "b": 53
    },
    "lab": {
      "l": 24.1,
      "a": 9.63,
      "b": 3.08
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Rhinox Hide"
    ]
  },
  {
    "paint_id": "citadel-runefang-steel",
    "name": "Runefang Steel",
    "brand": "Citadel",
    "hex": "#C3CACE",
    "type": "Layer",
    "category": "layer",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 195,
      "g": 202,
      "b": 206
    },
    "lab": {
      "l": 80.9,
      "a": -1.63,
      "b": -2.82
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Runefang Steel"
    ]
  },
  {
    "paint_id": "citadel-runelord-brass",
    "name": "Runelord Brass",
    "brand": "Citadel",
    "hex": "#B6A89A",
    "type": "Layer",
    "category": "layer",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 182,
      "g": 168,
      "b": 154
    },
    "lab": {
      "l": 69.67,
      "a": 2.67,
      "b": 9.06
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Runelord Brass"
    ]
  },
  {
    "paint_id": "citadel-russ-grey",
    "name": "Russ Grey",
    "brand": "Citadel",
    "hex": "#547588",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 84,
      "g": 117,
      "b": 136
    },
    "lab": {
      "l": 47.47,
      "a": -6.68,
      "b": -14.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Russ Grey"
    ]
  },
  {
    "paint_id": "citadel-screamer-pink",
    "name": "Screamer Pink",
    "brand": "Citadel",
    "hex": "#7C1645",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 124,
      "g": 22,
      "b": 69
    },
    "lab": {
      "l": 27.55,
      "a": 45.75,
      "b": -1.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Screamer Pink"
    ]
  },
  {
    "paint_id": "citadel-screaming-bell",
    "name": "Screaming Bell",
    "brand": "Citadel",
    "hex": "#C16F45",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 193,
      "g": 111,
      "b": 69
    },
    "lab": {
      "l": 55.22,
      "a": 28.69,
      "b": 37.04
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Screaming Bell"
    ]
  },
  {
    "paint_id": "citadel-screaming-skull",
    "name": "Screaming Skull",
    "brand": "Citadel",
    "hex": "#D2D4A2",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 210,
      "g": 212,
      "b": 162
    },
    "lab": {
      "l": 83.65,
      "a": -8.77,
      "b": 24.59
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Screaming Skull"
    ]
  },
  {
    "paint_id": "citadel-seraphim-sepia",
    "name": "Seraphim Sepia",
    "brand": "Citadel",
    "hex": "#D7824B",
    "type": "Shade",
    "category": "shade",
    "family": "Brown",
    "colorFamily": "brown",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": [
      "Seraphim Sepia"
    ]
  },
  {
    "paint_id": "citadel-skarsnik-green",
    "name": "Skarsnik Green",
    "brand": "Citadel",
    "hex": "#5F9370",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 95,
      "g": 147,
      "b": 112
    },
    "lab": {
      "l": 56.55,
      "a": -25.2,
      "b": 13.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Skarsnik Green"
    ]
  },
  {
    "paint_id": "citadel-skavenblight-dinge",
    "name": "Skavenblight Dinge",
    "brand": "Citadel",
    "hex": "#47413B",
    "type": "Layer",
    "category": "layer",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 71,
      "g": 65,
      "b": 59
    },
    "lab": {
      "l": 27.94,
      "a": 1.35,
      "b": 4.59
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Skavenblight Dinge"
    ]
  },
  {
    "paint_id": "citadel-skrag-brown",
    "name": "Skrag Brown",
    "brand": "Citadel",
    "hex": "#90490F",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 144,
      "g": 73,
      "b": 15
    },
    "lab": {
      "l": 39.12,
      "a": 26.28,
      "b": 44.21
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Skrag Brown"
    ]
  },
  {
    "paint_id": "citadel-skullcrusher-brass",
    "name": "Skullcrusher Brass",
    "brand": "Citadel",
    "hex": "#F1C78E",
    "type": "Layer",
    "category": "layer",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 241,
      "g": 199,
      "b": 142
    },
    "lab": {
      "l": 82.65,
      "a": 7.45,
      "b": 34.11
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Skullcrusher Brass"
    ]
  },
  {
    "paint_id": "citadel-slaanesh-grey",
    "name": "Slaanesh Grey",
    "brand": "Citadel",
    "hex": "#8E8C97",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 142,
      "g": 140,
      "b": 151
    },
    "lab": {
      "l": 58.73,
      "a": 2.94,
      "b": -5.57
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Slaanesh Grey"
    ]
  },
  {
    "paint_id": "citadel-sotek-green",
    "name": "Sotek Green",
    "brand": "Citadel",
    "hex": "#0B6974",
    "type": "Layer",
    "category": "layer",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 11,
      "g": 105,
      "b": 116
    },
    "lab": {
      "l": 40.3,
      "a": -20.49,
      "b": -13.27
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Sotek Green"
    ]
  },
  {
    "paint_id": "citadel-squig-orange",
    "name": "Squig Orange",
    "brand": "Citadel",
    "hex": "#AA4F44",
    "type": "Layer",
    "category": "layer",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 170,
      "g": 79,
      "b": 68
    },
    "lab": {
      "l": 45.02,
      "a": 36.43,
      "b": 24.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Squig Orange"
    ]
  },
  {
    "paint_id": "citadel-steel-legion-drab",
    "name": "Steel Legion Drab",
    "brand": "Citadel",
    "hex": "#5E5134",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 94,
      "g": 81,
      "b": 52
    },
    "lab": {
      "l": 35.03,
      "a": 0.79,
      "b": 19.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Steel Legion Drab"
    ]
  },
  {
    "paint_id": "citadel-stegadon-scale-green",
    "name": "Stegadon Scale Green",
    "brand": "Citadel",
    "hex": "#074863",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 7,
      "g": 72,
      "b": 99
    },
    "lab": {
      "l": 28.33,
      "a": -8.12,
      "b": -21.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stegadon Scale Green"
    ]
  },
  {
    "paint_id": "citadel-stirland-mud",
    "name": "Stirland Mud",
    "brand": "Citadel",
    "hex": "#492B00",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 73,
      "g": 43,
      "b": 0
    },
    "lab": {
      "l": 20.61,
      "a": 10.28,
      "b": 29.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stirland Mud"
    ]
  },
  {
    "paint_id": "citadel-stormhost-silver",
    "name": "Stormhost Silver",
    "brand": "Citadel",
    "hex": "#BBC6C9",
    "type": "Layer",
    "category": "layer",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 187,
      "g": 198,
      "b": 201
    },
    "lab": {
      "l": 79.14,
      "a": -3.18,
      "b": -2.8
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stormhost Silver"
    ]
  },
  {
    "paint_id": "citadel-stormvermin-fur",
    "name": "Stormvermin Fur",
    "brand": "Citadel",
    "hex": "#736B65",
    "type": "Layer",
    "category": "layer",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 115,
      "g": 107,
      "b": 101
    },
    "lab": {
      "l": 45.77,
      "a": 1.99,
      "b": 4.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Stormvermin Fur"
    ]
  },
  {
    "paint_id": "citadel-straken-green",
    "name": "Straken Green",
    "brand": "Citadel",
    "hex": "#628126",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 98,
      "g": 129,
      "b": 38
    },
    "lab": {
      "l": 50.02,
      "a": -25.4,
      "b": 43.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Straken Green"
    ]
  },
  {
    "paint_id": "citadel-sybarite-green",
    "name": "Sybarite Green",
    "brand": "Citadel",
    "hex": "#30A56C",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 48,
      "g": 165,
      "b": 108
    },
    "lab": {
      "l": 60.44,
      "a": -45.71,
      "b": 20.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Sybarite Green"
    ]
  },
  {
    "paint_id": "citadel-sycorax-bronze",
    "name": "Sycorax Bronze",
    "brand": "Citadel",
    "hex": "#CBB394",
    "type": "Layer",
    "category": "layer",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 203,
      "g": 179,
      "b": 148
    },
    "lab": {
      "l": 74.24,
      "a": 3.87,
      "b": 19.01
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Sycorax Bronze"
    ]
  },
  {
    "paint_id": "citadel-tallarn-sand",
    "name": "Tallarn Sand",
    "brand": "Citadel",
    "hex": "#A67610",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 166,
      "g": 118,
      "b": 16
    },
    "lab": {
      "l": 53.06,
      "a": 10.7,
      "b": 56.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Tallarn Sand"
    ]
  },
  {
    "paint_id": "citadel-tau-light-ochre",
    "name": "Tau Light Ochre",
    "brand": "Citadel",
    "hex": "#BF6E1D",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 191,
      "g": 110,
      "b": 29
    },
    "lab": {
      "l": 54.36,
      "a": 26.54,
      "b": 54.65
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Tau Light Ochre"
    ]
  },
  {
    "paint_id": "citadel-teclis-blue",
    "name": "Teclis Blue",
    "brand": "Citadel",
    "hex": "#317EC1",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 49,
      "g": 126,
      "b": 193
    },
    "lab": {
      "l": 51.18,
      "a": -0.58,
      "b": -41.72
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Teclis Blue"
    ]
  },
  {
    "paint_id": "citadel-temple-guard-blue",
    "name": "Temple Guard Blue",
    "brand": "Citadel",
    "hex": "#339A8D",
    "type": "Layer",
    "category": "layer",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 51,
      "g": 154,
      "b": 141
    },
    "lab": {
      "l": 57.79,
      "a": -32.37,
      "b": -1.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Temple Guard Blue"
    ]
  },
  {
    "paint_id": "citadel-the-fang-grey",
    "name": "The Fang Grey",
    "brand": "Citadel",
    "hex": "#436174",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 67,
      "g": 97,
      "b": 116
    },
    "lab": {
      "l": 39.59,
      "a": -5.61,
      "b": -14.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "The Fang Grey"
    ]
  },
  {
    "paint_id": "citadel-thousand-sons-blue",
    "name": "Thousand Sons Blue",
    "brand": "Citadel",
    "hex": "#18ABCC",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 24,
      "g": 171,
      "b": 204
    },
    "lab": {
      "l": 64.7,
      "a": -23.98,
      "b": -26.85
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Thousand Sons Blue"
    ]
  },
  {
    "paint_id": "citadel-thunderhawk-blue",
    "name": "Thunderhawk Blue",
    "brand": "Citadel",
    "hex": "#417074",
    "type": "Layer",
    "category": "layer",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 65,
      "g": 112,
      "b": 116
    },
    "lab": {
      "l": 44.19,
      "a": -14.87,
      "b": -7.25
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Thunderhawk Blue"
    ]
  },
  {
    "paint_id": "citadel-troll-slayer-orange",
    "name": "Troll Slayer Orange",
    "brand": "Citadel",
    "hex": "#F36D2D",
    "type": "Layer",
    "category": "layer",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 243,
      "g": 109,
      "b": 45
    },
    "lab": {
      "l": 61.82,
      "a": 48.15,
      "b": 57.85
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Troll Slayer Orange"
    ]
  },
  {
    "paint_id": "citadel-tuskgor-fur",
    "name": "Tuskgor Fur",
    "brand": "Citadel",
    "hex": "#883636",
    "type": "Layer",
    "category": "layer",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 136,
      "g": 54,
      "b": 54
    },
    "lab": {
      "l": 34.27,
      "a": 35.1,
      "b": 17.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Tuskgor Fur"
    ]
  },
  {
    "paint_id": "citadel-ulthuan-grey",
    "name": "Ulthuan Grey",
    "brand": "Citadel",
    "hex": "#C7E0D9",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 199,
      "g": 224,
      "b": 217
    },
    "lab": {
      "l": 87.22,
      "a": -9.6,
      "b": 0.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ulthuan Grey"
    ]
  },
  {
    "paint_id": "citadel-ungor-flesh",
    "name": "Ungor Flesh",
    "brand": "Citadel",
    "hex": "#D6A766",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 214,
      "g": 167,
      "b": 102
    },
    "lab": {
      "l": 71.48,
      "a": 9.56,
      "b": 40
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ungor Flesh"
    ]
  },
  {
    "paint_id": "citadel-ushabti-bone",
    "name": "Ushabti Bone",
    "brand": "Citadel",
    "hex": "#BBBB7F",
    "type": "Layer",
    "category": "layer",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 187,
      "g": 187,
      "b": 127
    },
    "lab": {
      "l": 74.6,
      "a": -9.38,
      "b": 30.47
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Ushabti Bone"
    ]
  },
  {
    "paint_id": "citadel-waaagh-flesh",
    "name": "Waaagh! Flesh",
    "brand": "Citadel",
    "hex": "#1F5429",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 31,
      "g": 84,
      "b": 41
    },
    "lab": {
      "l": 31.33,
      "a": -28.14,
      "b": 19.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Waaagh! Flesh"
    ]
  },
  {
    "paint_id": "citadel-warboss-green",
    "name": "Warboss Green",
    "brand": "Citadel",
    "hex": "#3E805D",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 62,
      "g": 128,
      "b": 93
    },
    "lab": {
      "l": 48.58,
      "a": -29.76,
      "b": 12.68
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Warboss Green"
    ]
  },
  {
    "paint_id": "citadel-warpfiend-grey",
    "name": "Warpfiend Grey",
    "brand": "Citadel",
    "hex": "#6B6A74",
    "type": "Layer",
    "category": "layer",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 107,
      "g": 106,
      "b": 116
    },
    "lab": {
      "l": 45.21,
      "a": 2.51,
      "b": -5.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Warpfiend Grey"
    ]
  },
  {
    "paint_id": "citadel-warplock-bronze",
    "name": "Warplock Bronze",
    "brand": "Citadel",
    "hex": "#927D7B",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 146,
      "g": 125,
      "b": 123
    },
    "lab": {
      "l": 54.25,
      "a": 7.71,
      "b": 4.07
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Warplock Bronze"
    ]
  },
  {
    "paint_id": "citadel-warpstone-glow",
    "name": "Warpstone Glow",
    "brand": "Citadel",
    "hex": "#1E7331",
    "type": "Layer",
    "category": "layer",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 30,
      "g": 115,
      "b": 49
    },
    "lab": {
      "l": 42.4,
      "a": -39.95,
      "b": 29.13
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Warpstone Glow"
    ]
  },
  {
    "paint_id": "citadel-wazdakka-red",
    "name": "Wazdakka Red",
    "brand": "Citadel",
    "hex": "#8C0A0C",
    "type": "Layer",
    "category": "layer",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 140,
      "g": 10,
      "b": 12
    },
    "lab": {
      "l": 28.96,
      "a": 49.82,
      "b": 37.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Wazdakka Red"
    ]
  },
  {
    "paint_id": "citadel-white-scar",
    "name": "White Scar",
    "brand": "Citadel",
    "hex": "#FFFFFF",
    "type": "Layer",
    "category": "layer",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "lab": {
      "l": 100,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "White Scar"
    ]
  },
  {
    "paint_id": "citadel-wild-rider-red",
    "name": "Wild Rider Red",
    "brand": "Citadel",
    "hex": "#EA2F28",
    "type": "Layer",
    "category": "layer",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 234,
      "g": 47,
      "b": 40
    },
    "lab": {
      "l": 51.48,
      "a": 68.67,
      "b": 50.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Wild Rider Red"
    ]
  },
  {
    "paint_id": "citadel-xereus-purple",
    "name": "Xereus Purple",
    "brand": "Citadel",
    "hex": "#471F5F",
    "type": "Layer",
    "category": "layer",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 71,
      "g": 31,
      "b": 95
    },
    "lab": {
      "l": 20.62,
      "a": 31.41,
      "b": -30.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Xereus Purple"
    ]
  },
  {
    "paint_id": "citadel-xv-88",
    "name": "XV-88",
    "brand": "Citadel",
    "hex": "#72491E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 114,
      "g": 73,
      "b": 30
    },
    "lab": {
      "l": 34.88,
      "a": 13.21,
      "b": 32.01
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "XV-88"
    ]
  },
  {
    "paint_id": "citadel-yriel-yellow",
    "name": "Yriel Yellow",
    "brand": "Citadel",
    "hex": "#FFDA00",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 218,
      "b": 0
    },
    "lab": {
      "l": 87.68,
      "a": -3.44,
      "b": 87.66
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Yriel Yellow"
    ]
  },
  {
    "paint_id": "citadel-zamesi-desert",
    "name": "Zamesi Desert",
    "brand": "Citadel",
    "hex": "#DDA026",
    "type": "Layer",
    "category": "layer",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 221,
      "g": 160,
      "b": 38
    },
    "lab": {
      "l": 69.94,
      "a": 12.66,
      "b": 66.44
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Zamesi Desert"
    ]
  },
  {
    "paint_id": "citadel-zandri-dust",
    "name": "Zandri Dust",
    "brand": "Citadel",
    "hex": "#9E915C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 158,
      "g": 145,
      "b": 92
    },
    "lab": {
      "l": 60.15,
      "a": -3.01,
      "b": 29.86
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": [
      "Zandri Dust"
    ]
  },
  {
    "paint_id": "scale75-abyssal-blue",
    "name": "Abyssal Blue",
    "brand": "Scale75",
    "hex": "#292A2F",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 41,
      "g": 42,
      "b": 47
    },
    "lab": {
      "l": 17.14,
      "a": 0.82,
      "b": -3.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-acid-green",
    "name": "Acid Green",
    "brand": "Scale75",
    "hex": "#C4D964",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 196,
      "g": 217,
      "b": 100
    },
    "lab": {
      "l": 83.06,
      "a": -23.7,
      "b": 54.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-adriatic-blue",
    "name": "Adriatic Blue",
    "brand": "Scale75",
    "hex": "#128A9B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 18,
      "g": 138,
      "b": 155
    },
    "lab": {
      "l": 52.59,
      "a": -23.93,
      "b": -17.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-african-shadow",
    "name": "African Shadow",
    "brand": "Scale75",
    "hex": "#56424B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 86,
      "g": 66,
      "b": 75
    },
    "lab": {
      "l": 30.36,
      "a": 10.32,
      "b": -2.11
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-airnrhod-blue",
    "name": "Airnrhod Blue",
    "brand": "Scale75",
    "hex": "#39398F",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 57,
      "g": 57,
      "b": 143
    },
    "lab": {
      "l": 28.85,
      "a": 26.79,
      "b": -47.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-aldebaran-red",
    "name": "Aldebaran Red",
    "brand": "Scale75",
    "hex": "#BE331E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 190,
      "g": 51,
      "b": 30
    },
    "lab": {
      "l": 43.38,
      "a": 54.08,
      "b": 44.61
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-alizarin-green",
    "name": "Alizarin Green",
    "brand": "Scale75",
    "hex": "#26944B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 38,
      "g": 148,
      "b": 75
    },
    "lab": {
      "l": 54.13,
      "a": -46.95,
      "b": 29.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-amarth-blue",
    "name": "Amarth Blue",
    "brand": "Scale75",
    "hex": "#0582C5",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 5,
      "g": 130,
      "b": 197
    },
    "lab": {
      "l": 51.87,
      "a": -4.77,
      "b": -42.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-amber-alchemy",
    "name": "Amber Alchemy",
    "brand": "Scale75",
    "hex": "#B89E85",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 184,
      "g": 158,
      "b": 133
    },
    "lab": {
      "l": 66.78,
      "a": 5.72,
      "b": 16.62
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-american-olive",
    "name": "American Olive",
    "brand": "Scale75",
    "hex": "#736737",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 115,
      "g": 103,
      "b": 55
    },
    "lab": {
      "l": 43.69,
      "a": -2.25,
      "b": 28.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-amethyst-alchemy",
    "name": "Amethyst Alchemy",
    "brand": "Scale75",
    "hex": "#9F8EB0",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 159,
      "g": 142,
      "b": 176
    },
    "lab": {
      "l": 61.53,
      "a": 12.97,
      "b": -15.48
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ancestral-blue",
    "name": "Ancestral Blue",
    "brand": "Scale75",
    "hex": "#61ABC4",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 97,
      "g": 171,
      "b": 196
    },
    "lab": {
      "l": 66.25,
      "a": -16.18,
      "b": -19.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-antares-red",
    "name": "Antares Red",
    "brand": "Scale75",
    "hex": "#C11E21",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 193,
      "g": 30,
      "b": 33
    },
    "lab": {
      "l": 41.81,
      "a": 61.18,
      "b": 41.86
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-anthartic-grey",
    "name": "Anthartic Grey",
    "brand": "Scale75",
    "hex": "#42424C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 66,
      "g": 66,
      "b": 76
    },
    "lab": {
      "l": 28.32,
      "a": 2.36,
      "b": -6.02
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-arabic-shadow",
    "name": "Arabic Shadow",
    "brand": "Scale75",
    "hex": "#7C6833",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 124,
      "g": 104,
      "b": 51
    },
    "lab": {
      "l": 44.84,
      "a": 0.95,
      "b": 32.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-arcane-purple",
    "name": "Arcane Purple",
    "brand": "Scale75",
    "hex": "#350D4C",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 53,
      "g": 13,
      "b": 76
    },
    "lab": {
      "l": 13.03,
      "a": 31.42,
      "b": -30.02
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ardenes-green",
    "name": "Ardenes Green",
    "brand": "Scale75",
    "hex": "#566345",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 86,
      "g": 99,
      "b": 69
    },
    "lab": {
      "l": 40.13,
      "a": -10.95,
      "b": 15.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-arphen-jade",
    "name": "Arphen Jade",
    "brand": "Scale75",
    "hex": "#035D53",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 3,
      "g": 93,
      "b": 83
    },
    "lab": {
      "l": 34.95,
      "a": -26.06,
      "b": -0.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-art-black",
    "name": "Art Black",
    "brand": "Scale75",
    "hex": "#101010",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 16,
      "g": 16,
      "b": 16
    },
    "lab": {
      "l": 4.68,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-art-white",
    "name": "Art White",
    "brand": "Scale75",
    "hex": "#FEFEFE",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 254,
      "g": 254,
      "b": 254
    },
    "lab": {
      "l": 99.65,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-artic-blue",
    "name": "Artic Blue",
    "brand": "Scale75",
    "hex": "#888FA1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 136,
      "g": 143,
      "b": 161
    },
    "lab": {
      "l": 59.39,
      "a": 1.3,
      "b": -10.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-baal-crimson",
    "name": "Baal Crimson",
    "brand": "Scale75",
    "hex": "#E11A39",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 225,
      "g": 26,
      "b": 57
    },
    "lab": {
      "l": 48.32,
      "a": 71.19,
      "b": 37.11
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-basic-flesh",
    "name": "Basic Flesh",
    "brand": "Scale75",
    "hex": "#D0B393",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 208,
      "g": 179,
      "b": 147
    },
    "lab": {
      "l": 74.67,
      "a": 5.68,
      "b": 20.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-basilisk-green",
    "name": "Basilisk Green",
    "brand": "Scale75",
    "hex": "#3D5152",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 61,
      "g": 81,
      "b": 82
    },
    "lab": {
      "l": 32.89,
      "a": -7.42,
      "b": -3.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-beherit-red",
    "name": "Beherit Red",
    "brand": "Scale75",
    "hex": "#E2390E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 226,
      "g": 57,
      "b": 14
    },
    "lab": {
      "l": 50.84,
      "a": 62.99,
      "b": 59.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-belladonna-green",
    "name": "Belladonna Green",
    "brand": "Scale75",
    "hex": "#4CA579",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 76,
      "g": 165,
      "b": 121
    },
    "lab": {
      "l": 61.5,
      "a": -37.24,
      "b": 14.87
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-bering-blue",
    "name": "Bering Blue",
    "brand": "Scale75",
    "hex": "#6C8997",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 108,
      "g": 137,
      "b": 151
    },
    "lab": {
      "l": 55.39,
      "a": -6.84,
      "b": -10.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-black",
    "name": "Black",
    "brand": "Scale75",
    "hex": "#2C2C2C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 44,
      "g": 44,
      "b": 44
    },
    "lab": {
      "l": 18,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-black-forest-green",
    "name": "Black Forest Green",
    "brand": "Scale75",
    "hex": "#004834",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 72,
      "b": 52
    },
    "lab": {
      "l": 26.4,
      "a": -25.85,
      "b": 6.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-black-leather",
    "name": "Black Leather",
    "brand": "Scale75",
    "hex": "#422A2A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 66,
      "g": 42,
      "b": 42
    },
    "lab": {
      "l": 19.97,
      "a": 11.19,
      "b": 4.56
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-black-metal",
    "name": "Black Metal",
    "brand": "Scale75",
    "hex": "#484848",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 72,
      "g": 72,
      "b": 72
    },
    "lab": {
      "l": 30.59,
      "a": 0,
      "b": 0
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-blackert-brown",
    "name": "Blackert Brown",
    "brand": "Scale75",
    "hex": "#B8825C",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 184,
      "g": 130,
      "b": 92
    },
    "lab": {
      "l": 58.91,
      "a": 16.34,
      "b": 28.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-blood-red",
    "name": "Blood Red",
    "brand": "Scale75",
    "hex": "#912727",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 145,
      "g": 39,
      "b": 39
    },
    "lab": {
      "l": 33.18,
      "a": 44.12,
      "b": 26.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-bloodfest-crimson",
    "name": "Bloodfest Crimson",
    "brand": "Scale75",
    "hex": "#6A033B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 106,
      "g": 3,
      "b": 59
    },
    "lab": {
      "l": 21.75,
      "a": 44.52,
      "b": -3.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-boreal-green",
    "name": "Boreal Green",
    "brand": "Scale75",
    "hex": "#00563E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 86,
      "b": 62
    },
    "lab": {
      "l": 31.81,
      "a": -29.37,
      "b": 7.68
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-braineater-azure",
    "name": "Braineater Azure",
    "brand": "Scale75",
    "hex": "#676AAF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 103,
      "g": 106,
      "b": 175
    },
    "lab": {
      "l": 47.35,
      "a": 16.63,
      "b": -37.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-brilli-white",
    "name": "Brilli White",
    "brand": "Scale75",
    "hex": "#FEFEFE",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 254,
      "g": 254,
      "b": 254
    },
    "lab": {
      "l": 99.65,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-brown-gray",
    "name": "Brown Gray",
    "brand": "Scale75",
    "hex": "#7B7170",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 123,
      "g": 113,
      "b": 112
    },
    "lab": {
      "l": 48.5,
      "a": 3.68,
      "b": 1.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-burnt-skin",
    "name": "Burnt Skin",
    "brand": "Scale75",
    "hex": "#654023",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 101,
      "g": 64,
      "b": 35
    },
    "lab": {
      "l": 30.77,
      "a": 12.89,
      "b": 24.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-cantabric-blue",
    "name": "Cantabric Blue",
    "brand": "Scale75",
    "hex": "#164765",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 22,
      "g": 71,
      "b": 101
    },
    "lab": {
      "l": 28.42,
      "a": -4.98,
      "b": -22.23
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-caribbean-blue",
    "name": "Caribbean Blue",
    "brand": "Scale75",
    "hex": "#75B6B0",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 117,
      "g": 182,
      "b": 176
    },
    "lab": {
      "l": 69.73,
      "a": -22.07,
      "b": -3.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-caspian-blue",
    "name": "Caspian Blue",
    "brand": "Scale75",
    "hex": "#2A4F58",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 42,
      "g": 79,
      "b": 88
    },
    "lab": {
      "l": 31.32,
      "a": -10.44,
      "b": -9.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-citrine-alchemy",
    "name": "Citrine Alchemy",
    "brand": "Scale75",
    "hex": "#EFE1C7",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 239,
      "g": 225,
      "b": 199
    },
    "lab": {
      "l": 90.01,
      "a": 0.6,
      "b": 14.45
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-city-dust",
    "name": "City Dust",
    "brand": "Scale75",
    "hex": "#C6C1BD",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 198,
      "g": 193,
      "b": 189
    },
    "lab": {
      "l": 78.36,
      "a": 1.03,
      "b": 2.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-cobalt-blue",
    "name": "Cobalt Blue",
    "brand": "Scale75",
    "hex": "#005E91",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 94,
      "b": 145
    },
    "lab": {
      "l": 37.93,
      "a": -3.62,
      "b": -34.57
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-cobalt-metal",
    "name": "Cobalt Metal",
    "brand": "Scale75",
    "hex": "#7FA2B5",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 127,
      "g": 162,
      "b": 181
    },
    "lab": {
      "l": 64.71,
      "a": -7.43,
      "b": -13.71
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-cobalt-violet-grey",
    "name": "Cobalt Violet Grey",
    "brand": "Scale75",
    "hex": "#73768B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 115,
      "g": 118,
      "b": 139
    },
    "lab": {
      "l": 50.06,
      "a": 3.51,
      "b": -11.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-cokum-copper",
    "name": "Cokum Copper",
    "brand": "Scale75",
    "hex": "#A37021",
    "type": "Base",
    "category": "base",
    "family": "Copper",
    "colorFamily": "copper",
    "rgb": {
      "r": 163,
      "g": 112,
      "b": 33
    },
    "lab": {
      "l": 51.25,
      "a": 13.23,
      "b": 49
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-coral-red",
    "name": "Coral Red",
    "brand": "Scale75",
    "hex": "#F73724",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 247,
      "g": 55,
      "b": 36
    },
    "lab": {
      "l": 54.7,
      "a": 70.1,
      "b": 55.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-corrupted-stamina",
    "name": "Corrupted Stamina",
    "brand": "Scale75",
    "hex": "#699D0C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 105,
      "g": 157,
      "b": 12
    },
    "lab": {
      "l": 59.11,
      "a": -36.87,
      "b": 59.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-cremeweiss",
    "name": "Cremeweiss",
    "brand": "Scale75",
    "hex": "#FCFCE0",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 252,
      "g": 252,
      "b": 224
    },
    "lab": {
      "l": 98.31,
      "a": -4.65,
      "b": 13.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-crimsom",
    "name": "Crimsom",
    "brand": "Scale75",
    "hex": "#C22335",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 194,
      "g": 35,
      "b": 53
    },
    "lab": {
      "l": 42.66,
      "a": 60.95,
      "b": 31.35
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dark-brown-ochre",
    "name": "Dark Brown Ochre",
    "brand": "Scale75",
    "hex": "#1E1317",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 30,
      "g": 19,
      "b": 23
    },
    "lab": {
      "l": 7.26,
      "a": 6.42,
      "b": -0.6
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dark-kraken",
    "name": "Dark Kraken",
    "brand": "Scale75",
    "hex": "#194A5B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 25,
      "g": 74,
      "b": 91
    },
    "lab": {
      "l": 29.05,
      "a": -10.19,
      "b": -14.83
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dark-mud",
    "name": "Dark Mud",
    "brand": "Scale75",
    "hex": "#210200",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 33,
      "g": 2,
      "b": 0
    },
    "lab": {
      "l": 3.31,
      "a": 12.3,
      "b": 5.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dark-prussian-blue",
    "name": "Dark Prussian Blue",
    "brand": "Scale75",
    "hex": "#252430",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 37,
      "g": 36,
      "b": 48
    },
    "lab": {
      "l": 14.78,
      "a": 3.67,
      "b": -7.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dark-ultramarine",
    "name": "Dark Ultramarine",
    "brand": "Scale75",
    "hex": "#32297A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 50,
      "g": 41,
      "b": 122
    },
    "lab": {
      "l": 22.54,
      "a": 28.65,
      "b": -44.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dark-violet",
    "name": "Dark Violet",
    "brand": "Scale75",
    "hex": "#481A3F",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 72,
      "g": 26,
      "b": 63
    },
    "lab": {
      "l": 17.81,
      "a": 27.31,
      "b": -13.2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dead-flesh",
    "name": "Dead Flesh",
    "brand": "Scale75",
    "hex": "#7F6662",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 127,
      "g": 102,
      "b": 98
    },
    "lab": {
      "l": 45.49,
      "a": 9.33,
      "b": 6.05
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-decay-black",
    "name": "Decay Black",
    "brand": "Scale75",
    "hex": "#1C1C1C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 28,
      "g": 28,
      "b": 28
    },
    "lab": {
      "l": 10.27,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-decayed-metal",
    "name": "Decayed Metal",
    "brand": "Scale75",
    "hex": "#5D4038",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 93,
      "g": 64,
      "b": 56
    },
    "lab": {
      "l": 30.11,
      "a": 11.46,
      "b": 9.94
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-deep-red",
    "name": "Deep Red",
    "brand": "Scale75",
    "hex": "#701B20",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 112,
      "g": 27,
      "b": 32
    },
    "lab": {
      "l": 24.75,
      "a": 37.25,
      "b": 19.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-demon-brown",
    "name": "Demon Brown",
    "brand": "Scale75",
    "hex": "#66271E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 102,
      "g": 39,
      "b": 30
    },
    "lab": {
      "l": 24.86,
      "a": 27.72,
      "b": 20.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-despair-green",
    "name": "Despair Green",
    "brand": "Scale75",
    "hex": "#17383D",
    "type": "Air",
    "category": "air",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 23,
      "g": 56,
      "b": 61
    },
    "lab": {
      "l": 21.38,
      "a": -10.3,
      "b": -6.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dragon-blood",
    "name": "Dragon Blood",
    "brand": "Scale75",
    "hex": "#810622",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 129,
      "g": 6,
      "b": 34
    },
    "lab": {
      "l": 26.49,
      "a": 48.15,
      "b": 20.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-drain-life",
    "name": "Drain Life",
    "brand": "Scale75",
    "hex": "#E69464",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 230,
      "g": 148,
      "b": 100
    },
    "lab": {
      "l": 68.7,
      "a": 26.13,
      "b": 37.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dunkelgelb-yellow",
    "name": "Dunkelgelb Yellow",
    "brand": "Scale75",
    "hex": "#CBB550",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 203,
      "g": 181,
      "b": 80
    },
    "lab": {
      "l": 73.76,
      "a": -4.23,
      "b": 53.13
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dunkelgrau-gray",
    "name": "Dunkelgrau Gray",
    "brand": "Scale75",
    "hex": "#57585A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 87,
      "g": 88,
      "b": 90
    },
    "lab": {
      "l": 37.38,
      "a": 0.03,
      "b": -1.29
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dust-in-summertime",
    "name": "Dust In Summertime",
    "brand": "Scale75",
    "hex": "#727556",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 114,
      "g": 117,
      "b": 86
    },
    "lab": {
      "l": 48.22,
      "a": -6.75,
      "b": 16.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-dwarven-gold",
    "name": "Dwarven Gold",
    "brand": "Scale75",
    "hex": "#D68D2F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 214,
      "g": 141,
      "b": 47
    },
    "lab": {
      "l": 64.61,
      "a": 20.16,
      "b": 58.19
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-eclipse-grey",
    "name": "Eclipse Grey",
    "brand": "Scale75",
    "hex": "#363636",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 54,
      "g": 54,
      "b": 54
    },
    "lab": {
      "l": 22.62,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-eldandil-violet",
    "name": "Eldandil Violet",
    "brand": "Scale75",
    "hex": "#2B1A3C",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 43,
      "g": 26,
      "b": 60
    },
    "lab": {
      "l": 13.1,
      "a": 16.66,
      "b": -18.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-elixir-green",
    "name": "Elixir Green",
    "brand": "Scale75",
    "hex": "#005C4D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 92,
      "b": 77
    },
    "lab": {
      "l": 34.37,
      "a": -27.73,
      "b": 1.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-elven-gold",
    "name": "Elven Gold",
    "brand": "Scale75",
    "hex": "#CDAB47",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 205,
      "g": 171,
      "b": 71
    },
    "lab": {
      "l": 71.26,
      "a": 1.31,
      "b": 54.49
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-emerald-alchemy",
    "name": "Emerald Alchemy",
    "brand": "Scale75",
    "hex": "#78A098",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 120,
      "g": 160,
      "b": 152
    },
    "lab": {
      "l": 62.84,
      "a": -15.35,
      "b": -0.27
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-emerald-green",
    "name": "Emerald Green",
    "brand": "Scale75",
    "hex": "#165341",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 22,
      "g": 83,
      "b": 65
    },
    "lab": {
      "l": 31.2,
      "a": -24.23,
      "b": 4.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-estus-yellow",
    "name": "Estus Yellow",
    "brand": "Scale75",
    "hex": "#FEE459",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 254,
      "g": 228,
      "b": 89
    },
    "lab": {
      "l": 90.45,
      "a": -6.4,
      "b": 68.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-evil-root",
    "name": "Evil Root",
    "brand": "Scale75",
    "hex": "#F07E4A",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 240,
      "g": 126,
      "b": 74
    },
    "lab": {
      "l": 64.92,
      "a": 39.85,
      "b": 47.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-fall-green",
    "name": "Fall Green",
    "brand": "Scale75",
    "hex": "#C9D161",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 201,
      "g": 209,
      "b": 97
    },
    "lab": {
      "l": 81.23,
      "a": -18.04,
      "b": 53.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-field-gray",
    "name": "Field Gray",
    "brand": "Scale75",
    "hex": "#66736C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 102,
      "g": 115,
      "b": 108
    },
    "lab": {
      "l": 47.2,
      "a": -6.36,
      "b": 2.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-field-grey-1",
    "name": "Field Grey 1",
    "brand": "Scale75",
    "hex": "#39553C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 57,
      "g": 85,
      "b": 60
    },
    "lab": {
      "l": 33.33,
      "a": -16.36,
      "b": 11.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-field-grey-2",
    "name": "Field Grey 2",
    "brand": "Scale75",
    "hex": "#3F4C45",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 63,
      "g": 76,
      "b": 69
    },
    "lab": {
      "l": 31.01,
      "a": -6.82,
      "b": 2.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-flat-black",
    "name": "Flat Black",
    "brand": "Scale75",
    "hex": "#1C1C1C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 28,
      "g": 28,
      "b": 28
    },
    "lab": {
      "l": 10.27,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-flight-blue",
    "name": "Flight Blue",
    "brand": "Scale75",
    "hex": "#01688B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 1,
      "g": 104,
      "b": 139
    },
    "lab": {
      "l": 40.85,
      "a": -12.01,
      "b": -26.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-frenzy-orange",
    "name": "Frenzy Orange",
    "brand": "Scale75",
    "hex": "#EC6001",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 236,
      "g": 96,
      "b": 1
    },
    "lab": {
      "l": 58.23,
      "a": 50.89,
      "b": 67.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-fuchsia",
    "name": "Fuchsia",
    "brand": "Scale75",
    "hex": "#AA336B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 170,
      "g": 51,
      "b": 107
    },
    "lab": {
      "l": 41.18,
      "a": 52.98,
      "b": -5.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-fuel-and-grease",
    "name": "Fuel And Grease",
    "brand": "Scale75",
    "hex": "#EEEAE9",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 238,
      "g": 234,
      "b": 233
    },
    "lab": {
      "l": 92.97,
      "a": 1.17,
      "b": 0.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-full-healing",
    "name": "Full Healing",
    "brand": "Scale75",
    "hex": "#FEEF00",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 254,
      "g": 239,
      "b": 0
    },
    "lab": {
      "l": 92.93,
      "a": -14.27,
      "b": 91.38
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-garnet-alchemy",
    "name": "Garnet Alchemy",
    "brand": "Scale75",
    "hex": "#88424D",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 136,
      "g": 66,
      "b": 77
    },
    "lab": {
      "l": 37.24,
      "a": 31.02,
      "b": 7.41
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-goblin-flesh",
    "name": "Goblin Flesh",
    "brand": "Scale75",
    "hex": "#77B840",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 119,
      "g": 184,
      "b": 64
    },
    "lab": {
      "l": 68.44,
      "a": -40.76,
      "b": 52.6
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-golden-flesh",
    "name": "Golden Flesh",
    "brand": "Scale75",
    "hex": "#E2A76D",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 226,
      "g": 167,
      "b": 109
    },
    "lab": {
      "l": 72.83,
      "a": 15.11,
      "b": 38.33
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-golden-skin",
    "name": "Golden Skin",
    "brand": "Scale75",
    "hex": "#EDC89C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 237,
      "g": 200,
      "b": 156
    },
    "lab": {
      "l": 82.76,
      "a": 6.95,
      "b": 26.9
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-golem-grey",
    "name": "Golem Grey",
    "brand": "Scale75",
    "hex": "#2C3031",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 44,
      "g": 48,
      "b": 49
    },
    "lab": {
      "l": 19.52,
      "a": -1.49,
      "b": -1.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-graphite",
    "name": "Graphite",
    "brand": "Scale75",
    "hex": "#8B8C87",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 139,
      "g": 140,
      "b": 135
    },
    "lab": {
      "l": 58.03,
      "a": -1.34,
      "b": 2.54
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-grau",
    "name": "Grau",
    "brand": "Scale75",
    "hex": "#E8D5C4",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 232,
      "g": 213,
      "b": 196
    },
    "lab": {
      "l": 86.37,
      "a": 3.82,
      "b": 10.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-graugrun-gray",
    "name": "Graugrun Gray",
    "brand": "Scale75",
    "hex": "#A08848",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 160,
      "g": 136,
      "b": 72
    },
    "lab": {
      "l": 57.61,
      "a": 0.81,
      "b": 37.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-green-grey",
    "name": "Green Grey",
    "brand": "Scale75",
    "hex": "#2C3033",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 44,
      "g": 48,
      "b": 51
    },
    "lab": {
      "l": 19.59,
      "a": -0.98,
      "b": -2.51
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-green-moss",
    "name": "Green Moss",
    "brand": "Scale75",
    "hex": "#1C7C23",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 28,
      "g": 124,
      "b": 35
    },
    "lab": {
      "l": 45.33,
      "a": -45.35,
      "b": 39.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-green-ochre",
    "name": "Green Ochre",
    "brand": "Scale75",
    "hex": "#948123",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 148,
      "g": 129,
      "b": 35
    },
    "lab": {
      "l": 54.15,
      "a": -3.18,
      "b": 50.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-greenskin-flesh",
    "name": "Greenskin Flesh",
    "brand": "Scale75",
    "hex": "#006F34",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 0,
      "g": 111,
      "b": 52
    },
    "lab": {
      "l": 40.6,
      "a": -41.57,
      "b": 25.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-grizzly-brown",
    "name": "Grizzly Brown",
    "brand": "Scale75",
    "hex": "#50181B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 80,
      "g": 24,
      "b": 27
    },
    "lab": {
      "l": 17.64,
      "a": 26.47,
      "b": 12.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-harvester-flesh",
    "name": "Harvester Flesh",
    "brand": "Scale75",
    "hex": "#D0A791",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 208,
      "g": 167,
      "b": 145
    },
    "lab": {
      "l": 71.62,
      "a": 11.87,
      "b": 17.09
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-hastur-purple",
    "name": "Hastur Purple",
    "brand": "Scale75",
    "hex": "#740331",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 116,
      "g": 3,
      "b": 49
    },
    "lab": {
      "l": 23.67,
      "a": 46.18,
      "b": 6.26
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-health-red",
    "name": "Health Red",
    "brand": "Scale75",
    "hex": "#C31610",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 195,
      "g": 22,
      "b": 16
    },
    "lab": {
      "l": 41.56,
      "a": 62.98,
      "b": 49.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-heavy-metal",
    "name": "Heavy Metal",
    "brand": "Scale75",
    "hex": "#9C9DA1",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 156,
      "g": 157,
      "b": 161
    },
    "lab": {
      "l": 64.77,
      "a": 0.42,
      "b": -2.21
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-hellbound-flesh",
    "name": "Hellbound Flesh",
    "brand": "Scale75",
    "hex": "#9CB1AC",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 156,
      "g": 177,
      "b": 172
    },
    "lab": {
      "l": 70.52,
      "a": -8.24,
      "b": 0.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-hiril-blue",
    "name": "Hiril Blue",
    "brand": "Scale75",
    "hex": "#4AA9BF",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 74,
      "g": 169,
      "b": 191
    },
    "lab": {
      "l": 64.64,
      "a": -21.29,
      "b": -19.64
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-human-flesh",
    "name": "Human Flesh",
    "brand": "Scale75",
    "hex": "#DAAB97",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 218,
      "g": 171,
      "b": 151
    },
    "lab": {
      "l": 73.72,
      "a": 14.37,
      "b": 16.88
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-indian-shadow",
    "name": "Indian Shadow",
    "brand": "Scale75",
    "hex": "#673D3F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 103,
      "g": 61,
      "b": 63
    },
    "lab": {
      "l": 30.83,
      "a": 18.71,
      "b": 6.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-innsmouth-blue",
    "name": "Innsmouth Blue",
    "brand": "Scale75",
    "hex": "#00596B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 89,
      "b": 107
    },
    "lab": {
      "l": 34.41,
      "a": -15.73,
      "b": -16.76
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-intense-yellow",
    "name": "Intense Yellow",
    "brand": "Scale75",
    "hex": "#F2CB02",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 242,
      "g": 203,
      "b": 2
    },
    "lab": {
      "l": 82.7,
      "a": -1.36,
      "b": 83.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-irati-green",
    "name": "Irati Green",
    "brand": "Scale75",
    "hex": "#008721",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 135,
      "b": 33
    },
    "lab": {
      "l": 48.81,
      "a": -51.96,
      "b": 43.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-iroko",
    "name": "Iroko",
    "brand": "Scale75",
    "hex": "#B28F4D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 178,
      "g": 143,
      "b": 77
    },
    "lab": {
      "l": 61.35,
      "a": 5.22,
      "b": 39.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-jade-green",
    "name": "Jade Green",
    "brand": "Scale75",
    "hex": "#2FBEAF",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 47,
      "g": 190,
      "b": 175
    },
    "lab": {
      "l": 69.84,
      "a": -40.03,
      "b": -3.08
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-jorildyn-turquoise",
    "name": "Jorildyn Turquoise",
    "brand": "Scale75",
    "hex": "#067DA7",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 6,
      "g": 125,
      "b": 167
    },
    "lab": {
      "l": 48.88,
      "a": -13.21,
      "b": -30.39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-kalahari-orange",
    "name": "Kalahari Orange",
    "brand": "Scale75",
    "hex": "#A3563C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 163,
      "g": 86,
      "b": 60
    },
    "lab": {
      "l": 45.32,
      "a": 29.32,
      "b": 29.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-kunzite-alchemy",
    "name": "Kunzite Alchemy",
    "brand": "Scale75",
    "hex": "#CA9FBB",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 202,
      "g": 159,
      "b": 187
    },
    "lab": {
      "l": 70.14,
      "a": 20.5,
      "b": -8.32
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-lemon-yellow",
    "name": "Lemon Yellow",
    "brand": "Scale75",
    "hex": "#EBEA52",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 235,
      "g": 234,
      "b": 82
    },
    "lab": {
      "l": 90.38,
      "a": -17.53,
      "b": 70.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-leviathan-blue",
    "name": "Leviathan Blue",
    "brand": "Scale75",
    "hex": "#005E70",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 94,
      "b": 112
    },
    "lab": {
      "l": 36.32,
      "a": -16.67,
      "b": -16.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-life-red",
    "name": "Life Red",
    "brand": "Scale75",
    "hex": "#E63217",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 230,
      "g": 50,
      "b": 23
    },
    "lab": {
      "l": 50.89,
      "a": 66.39,
      "b": 56.83
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-light-moss-green",
    "name": "Light Moss Green",
    "brand": "Scale75",
    "hex": "#61701B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 97,
      "g": 112,
      "b": 27
    },
    "lab": {
      "l": 44.53,
      "a": -17.83,
      "b": 42.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-light-rust",
    "name": "Light Rust",
    "brand": "Scale75",
    "hex": "#C1682C",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 193,
      "g": 104,
      "b": 44
    },
    "lab": {
      "l": 53.41,
      "a": 31.12,
      "b": 47.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-light-skin",
    "name": "Light Skin",
    "brand": "Scale75",
    "hex": "#E2B890",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 226,
      "g": 184,
      "b": 144
    },
    "lab": {
      "l": 77.56,
      "a": 9.67,
      "b": 26.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-lilith-yellow",
    "name": "Lilith Yellow",
    "brand": "Scale75",
    "hex": "#FDEA83",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 253,
      "g": 234,
      "b": 131
    },
    "lab": {
      "l": 92.3,
      "a": -6.76,
      "b": 52
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-lime-green",
    "name": "Lime Green",
    "brand": "Scale75",
    "hex": "#ACE44A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 172,
      "g": 228,
      "b": 74
    },
    "lab": {
      "l": 84.36,
      "a": -40.02,
      "b": 66.29
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-love-affair",
    "name": "Love Affair",
    "brand": "Scale75",
    "hex": "#E92B37",
    "type": "Air",
    "category": "air",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 233,
      "g": 43,
      "b": 55
    },
    "lab": {
      "l": 51.07,
      "a": 69.82,
      "b": 41.74
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-magenta",
    "name": "Magenta",
    "brand": "Scale75",
    "hex": "#C60A85",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 198,
      "g": 10,
      "b": 133
    },
    "lab": {
      "l": 44.12,
      "a": 72.1,
      "b": -16.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-magic-blue",
    "name": "Magic Blue",
    "brand": "Scale75",
    "hex": "#147797",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 20,
      "g": 119,
      "b": 151
    },
    "lab": {
      "l": 46.41,
      "a": -14.96,
      "b": -24.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-marduk-yellow",
    "name": "Marduk Yellow",
    "brand": "Scale75",
    "hex": "#FFEF00",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 239,
      "b": 0
    },
    "lab": {
      "l": 93.01,
      "a": -13.86,
      "b": 91.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-mars-orange",
    "name": "Mars Orange",
    "brand": "Scale75",
    "hex": "#AF6631",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 175,
      "g": 102,
      "b": 49
    },
    "lab": {
      "l": 50.5,
      "a": 24.88,
      "b": 41.49
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-mayhem-red",
    "name": "Mayhem Red",
    "brand": "Scale75",
    "hex": "#9F0D20",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 159,
      "g": 13,
      "b": 32
    },
    "lab": {
      "l": 33.49,
      "a": 55.1,
      "b": 31.77
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-merm-green",
    "name": "Merm Green",
    "brand": "Scale75",
    "hex": "#455236",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 69,
      "g": 82,
      "b": 54
    },
    "lab": {
      "l": 33.06,
      "a": -10.88,
      "b": 14.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-misfits-green",
    "name": "Misfits Green",
    "brand": "Scale75",
    "hex": "#004B31",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 75,
      "b": 49
    },
    "lab": {
      "l": 27.45,
      "a": -28.03,
      "b": 9.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-miskatonic-grey",
    "name": "Miskatonic Grey",
    "brand": "Scale75",
    "hex": "#BBB7B4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 187,
      "g": 183,
      "b": 180
    },
    "lab": {
      "l": 74.65,
      "a": 0.86,
      "b": 2.02
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-mojave-white",
    "name": "Mojave White",
    "brand": "Scale75",
    "hex": "#D2CEB5",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 210,
      "g": 206,
      "b": 181
    },
    "lab": {
      "l": 82.48,
      "a": -2.84,
      "b": 12.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-moonray-flesh",
    "name": "Moonray Flesh",
    "brand": "Scale75",
    "hex": "#F0D7A1",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 240,
      "g": 215,
      "b": 161
    },
    "lab": {
      "l": 86.85,
      "a": 0.94,
      "b": 29.85
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-moonstone-alchemy",
    "name": "Moonstone Alchemy",
    "brand": "Scale75",
    "hex": "#BC937F",
    "type": "Shade",
    "category": "wash",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 188,
      "g": 147,
      "b": 127
    },
    "lab": {
      "l": 64.24,
      "a": 12.55,
      "b": 16.5
    },
    "finish": "metallic",
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-moss-green",
    "name": "Moss Green",
    "brand": "Scale75",
    "hex": "#43492F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 67,
      "g": 73,
      "b": 47
    },
    "lab": {
      "l": 29.82,
      "a": -7.57,
      "b": 14.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-nacar",
    "name": "Nacar",
    "brand": "Scale75",
    "hex": "#9B9F90",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 155,
      "g": 159,
      "b": 144
    },
    "lab": {
      "l": 64.79,
      "a": -4.23,
      "b": 7.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-naples-yellow",
    "name": "Naples Yellow",
    "brand": "Scale75",
    "hex": "#DAAC22",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 218,
      "g": 172,
      "b": 34
    },
    "lab": {
      "l": 72.58,
      "a": 4.85,
      "b": 69.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-necro-gold",
    "name": "Necro Gold",
    "brand": "Scale75",
    "hex": "#574E31",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 87,
      "g": 78,
      "b": 49
    },
    "lab": {
      "l": 33.34,
      "a": -1.04,
      "b": 18.53
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-necro-grey",
    "name": "Necro Grey",
    "brand": "Scale75",
    "hex": "#303038",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 48,
      "g": 48,
      "b": 56
    },
    "lab": {
      "l": 20.15,
      "a": 1.99,
      "b": -5.07
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-neon-green",
    "name": "Neon Green",
    "brand": "Scale75",
    "hex": "#62F687",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 98,
      "g": 246,
      "b": 135
    },
    "lab": {
      "l": 87.12,
      "a": -62.56,
      "b": 41.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-neon-orange",
    "name": "Neon Orange",
    "brand": "Scale75",
    "hex": "#FF9E0E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 255,
      "g": 158,
      "b": 14
    },
    "lab": {
      "l": 73.38,
      "a": 27.69,
      "b": 76.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-neon-red",
    "name": "Neon Red",
    "brand": "Scale75",
    "hex": "#EF321D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 239,
      "g": 50,
      "b": 29
    },
    "lab": {
      "l": 52.65,
      "a": 69.06,
      "b": 56.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-neon-yellow",
    "name": "Neon Yellow",
    "brand": "Scale75",
    "hex": "#EDFE5A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 237,
      "g": 254,
      "b": 90
    },
    "lab": {
      "l": 95.84,
      "a": -25.83,
      "b": 73.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-off-white",
    "name": "Off White",
    "brand": "Scale75",
    "hex": "#DFD3B9",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 223,
      "g": 211,
      "b": 185
    },
    "lab": {
      "l": 84.88,
      "a": -0.09,
      "b": 14.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ogre-brown",
    "name": "Ogre Brown",
    "brand": "Scale75",
    "hex": "#C07704",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 192,
      "g": 119,
      "b": 4
    },
    "lab": {
      "l": 56.5,
      "a": 21.62,
      "b": 62.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-old-copper",
    "name": "Old Copper",
    "brand": "Scale75",
    "hex": "#97604C",
    "type": "Base",
    "category": "base",
    "family": "Copper",
    "colorFamily": "copper",
    "rgb": {
      "r": 151,
      "g": 96,
      "b": 76
    },
    "lab": {
      "l": 46.27,
      "a": 20.06,
      "b": 20.69
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-olive-brown",
    "name": "Olive Brown",
    "brand": "Scale75",
    "hex": "#434631",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 67,
      "g": 70,
      "b": 49
    },
    "lab": {
      "l": 28.89,
      "a": -5.41,
      "b": 12.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-olive-green",
    "name": "Olive Green",
    "brand": "Scale75",
    "hex": "#585135",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 88,
      "g": 81,
      "b": 53
    },
    "lab": {
      "l": 34.43,
      "a": -1.87,
      "b": 17.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-olivegrun-44",
    "name": "Olivegrun 44",
    "brand": "Scale75",
    "hex": "#93A45D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 147,
      "g": 164,
      "b": 93
    },
    "lab": {
      "l": 64.6,
      "a": -17.58,
      "b": 34.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-olivegrun-green",
    "name": "Olivegrun Green",
    "brand": "Scale75",
    "hex": "#5A6432",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 90,
      "g": 100,
      "b": 50
    },
    "lab": {
      "l": 40.44,
      "a": -12.47,
      "b": 26.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-orange",
    "name": "Orange",
    "brand": "Scale75",
    "hex": "#E9670F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 233,
      "g": 103,
      "b": 15
    },
    "lab": {
      "l": 59.03,
      "a": 46.67,
      "b": 64.9
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-orange-leather",
    "name": "Orange Leather",
    "brand": "Scale75",
    "hex": "#A06337",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 160,
      "g": 99,
      "b": 55
    },
    "lab": {
      "l": 47.85,
      "a": 20.44,
      "b": 34.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-orange-neon",
    "name": "Orange Neon",
    "brand": "Scale75",
    "hex": "#F96401",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 249,
      "g": 100,
      "b": 1
    },
    "lab": {
      "l": 61.01,
      "a": 53.76,
      "b": 69.93
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-orcish-dermis",
    "name": "Orcish Dermis",
    "brand": "Scale75",
    "hex": "#DB7D73",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 219,
      "g": 125,
      "b": 115
    },
    "lab": {
      "l": 62.48,
      "a": 35.3,
      "b": 21.42
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-pale-skin",
    "name": "Pale Skin",
    "brand": "Scale75",
    "hex": "#F1D9CF",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 241,
      "g": 217,
      "b": 207
    },
    "lab": {
      "l": 88.37,
      "a": 6.67,
      "b": 7.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-panzer-grey",
    "name": "Panzer Grey",
    "brand": "Scale75",
    "hex": "#30383B",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 48,
      "g": 56,
      "b": 59
    },
    "lab": {
      "l": 22.9,
      "a": -2.58,
      "b": -3.01
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-panzer-yellow",
    "name": "Panzer Yellow",
    "brand": "Scale75",
    "hex": "#D6C78C",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 214,
      "g": 199,
      "b": 140
    },
    "lab": {
      "l": 80.2,
      "a": -3.4,
      "b": 31.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-pastel-blue",
    "name": "Pastel Blue",
    "brand": "Scale75",
    "hex": "#44646F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 68,
      "g": 100,
      "b": 111
    },
    "lab": {
      "l": 40.39,
      "a": -8.55,
      "b": -9.9
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-pastel-green",
    "name": "Pastel Green",
    "brand": "Scale75",
    "hex": "#929D97",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 146,
      "g": 157,
      "b": 151
    },
    "lab": {
      "l": 63.72,
      "a": -5.11,
      "b": 1.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-pastel-violet",
    "name": "Pastel Violet",
    "brand": "Scale75",
    "hex": "#804A95",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 128,
      "g": 74,
      "b": 149
    },
    "lab": {
      "l": 40.67,
      "a": 36.21,
      "b": -32.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-peanut-butter",
    "name": "Peanut Butter",
    "brand": "Scale75",
    "hex": "#BB8103",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 187,
      "g": 129,
      "b": 3
    },
    "lab": {
      "l": 58.3,
      "a": 13.88,
      "b": 63.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-pearl-grey",
    "name": "Pearl Grey",
    "brand": "Scale75",
    "hex": "#867980",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 134,
      "g": 121,
      "b": 128
    },
    "lab": {
      "l": 52.18,
      "a": 6.3,
      "b": -2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-peridot-alchemy",
    "name": "Peridot Alchemy",
    "brand": "Scale75",
    "hex": "#8A8D78",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 138,
      "g": 141,
      "b": 120
    },
    "lab": {
      "l": 57.86,
      "a": -4.99,
      "b": 10.85
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-permanent-orange",
    "name": "Permanent Orange",
    "brand": "Scale75",
    "hex": "#FF6B0D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 255,
      "g": 107,
      "b": 13
    },
    "lab": {
      "l": 63.19,
      "a": 52.87,
      "b": 69.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-petroleum-gray",
    "name": "Petroleum Gray",
    "brand": "Scale75",
    "hex": "#554D4B",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 85,
      "g": 77,
      "b": 75
    },
    "lab": {
      "l": 33.45,
      "a": 2.92,
      "b": 2.39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-phoenix-feather",
    "name": "Phoenix Feather",
    "brand": "Scale75",
    "hex": "#D18A5C",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 209,
      "g": 138,
      "b": 92
    },
    "lab": {
      "l": 63.76,
      "a": 22.33,
      "b": 35.54
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-primary-red",
    "name": "Primary Red",
    "brand": "Scale75",
    "hex": "#D53036",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 213,
      "g": 48,
      "b": 54
    },
    "lab": {
      "l": 47.66,
      "a": 62.84,
      "b": 37.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-primary-yellow",
    "name": "Primary Yellow",
    "brand": "Scale75",
    "hex": "#F4E915",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 244,
      "g": 233,
      "b": 21
    },
    "lab": {
      "l": 90.58,
      "a": -15.34,
      "b": 87.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-psychedelic-purple",
    "name": "Psychedelic Purple",
    "brand": "Scale75",
    "hex": "#BB1CFF",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 187,
      "g": 28,
      "b": 255
    },
    "lab": {
      "l": 50.24,
      "a": 85.91,
      "b": -77.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-pure-copper",
    "name": "Pure Copper",
    "brand": "Scale75",
    "hex": "#CC744C",
    "type": "Base",
    "category": "base",
    "family": "Copper",
    "colorFamily": "copper",
    "rgb": {
      "r": 204,
      "g": 116,
      "b": 76
    },
    "lab": {
      "l": 57.9,
      "a": 30.95,
      "b": 36.82
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-purity-white",
    "name": "Purity White",
    "brand": "Scale75",
    "hex": "#FFFFFF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "lab": {
      "l": 100,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-purple",
    "name": "Purple",
    "brand": "Scale75",
    "hex": "#912360",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 145,
      "g": 35,
      "b": 96
    },
    "lab": {
      "l": 34.12,
      "a": 50.44,
      "b": -9.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ragweed-orange",
    "name": "Ragweed Orange",
    "brand": "Scale75",
    "hex": "#DF6A27",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 223,
      "g": 106,
      "b": 39
    },
    "lab": {
      "l": 58.18,
      "a": 41.89,
      "b": 55.93
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-rainy-gray",
    "name": "Rainy Gray",
    "brand": "Scale75",
    "hex": "#8B8683",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 139,
      "g": 134,
      "b": 131
    },
    "lab": {
      "l": 56.27,
      "a": 1.3,
      "b": 2.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-red-ecstasy",
    "name": "Red Ecstasy",
    "brand": "Scale75",
    "hex": "#F81803",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 248,
      "g": 24,
      "b": 3
    },
    "lab": {
      "l": 52.53,
      "a": 76.33,
      "b": 65.3
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-red-label",
    "name": "Red Label",
    "brand": "Scale75",
    "hex": "#DF0617",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 223,
      "g": 6,
      "b": 23
    },
    "lab": {
      "l": 46.82,
      "a": 72.1,
      "b": 53.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-red-leather",
    "name": "Red Leather",
    "brand": "Scale75",
    "hex": "#5F3634",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 95,
      "g": 54,
      "b": 52
    },
    "lab": {
      "l": 27.63,
      "a": 18.07,
      "b": 9.16
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-red-ochre",
    "name": "Red Ochre",
    "brand": "Scale75",
    "hex": "#80362D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 128,
      "g": 54,
      "b": 45
    },
    "lab": {
      "l": 32.74,
      "a": 31.31,
      "b": 21.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-resurrection-flesh",
    "name": "Resurrection Flesh",
    "brand": "Scale75",
    "hex": "#BB8B65",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 187,
      "g": 139,
      "b": 101
    },
    "lab": {
      "l": 61.63,
      "a": 13.5,
      "b": 27.42
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-riff-green",
    "name": "Riff Green",
    "brand": "Scale75",
    "hex": "#1A2D29",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 26,
      "g": 45,
      "b": 41
    },
    "lab": {
      "l": 16.78,
      "a": -8.9,
      "b": 0.13
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-rlyeh-grey",
    "name": "Rlyeh Grey",
    "brand": "Scale75",
    "hex": "#464B4E",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 70,
      "g": 75,
      "b": 78
    },
    "lab": {
      "l": 31.54,
      "a": -1.33,
      "b": -2.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-rotbraun-44",
    "name": "Rotbraun 44",
    "brand": "Scale75",
    "hex": "#905024",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 144,
      "g": 80,
      "b": 36
    },
    "lab": {
      "l": 40.89,
      "a": 23.11,
      "b": 36.55
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-rotten-pus",
    "name": "Rotten Pus",
    "brand": "Scale75",
    "hex": "#FBB400",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 251,
      "g": 180,
      "b": 0
    },
    "lab": {
      "l": 77.97,
      "a": 14.41,
      "b": 80.74
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ruby-alchemy",
    "name": "Ruby Alchemy",
    "brand": "Scale75",
    "hex": "#D37887",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 211,
      "g": 120,
      "b": 135
    },
    "lab": {
      "l": 60.81,
      "a": 37.11,
      "b": 7.53
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-russian-green",
    "name": "Russian Green",
    "brand": "Scale75",
    "hex": "#584F26",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 88,
      "g": 79,
      "b": 38
    },
    "lab": {
      "l": 33.58,
      "a": -2.42,
      "b": 25.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-russian-light-green",
    "name": "Russian Light Green",
    "brand": "Scale75",
    "hex": "#635111",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 99,
      "g": 81,
      "b": 17
    },
    "lab": {
      "l": 35.16,
      "a": 0.32,
      "b": 37.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-russian-uniform",
    "name": "Russian Uniform",
    "brand": "Scale75",
    "hex": "#695928",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 105,
      "g": 89,
      "b": 40
    },
    "lab": {
      "l": 38.38,
      "a": -0.08,
      "b": 30.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sahara-sand",
    "name": "Sahara Sand",
    "brand": "Scale75",
    "hex": "#EFD066",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 239,
      "g": 208,
      "b": 102
    },
    "lab": {
      "l": 84.19,
      "a": -1.61,
      "b": 55.71
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sahara-yellow",
    "name": "Sahara Yellow",
    "brand": "Scale75",
    "hex": "#AA852D",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 170,
      "g": 133,
      "b": 45
    },
    "lab": {
      "l": 57.57,
      "a": 5.11,
      "b": 50.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-salmon-fury",
    "name": "Salmon Fury",
    "brand": "Scale75",
    "hex": "#EB5650",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 235,
      "g": 86,
      "b": 80
    },
    "lab": {
      "l": 56.98,
      "a": 57.11,
      "b": 34.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sap-green",
    "name": "Sap Green",
    "brand": "Scale75",
    "hex": "#033417",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 3,
      "g": 52,
      "b": 23
    },
    "lab": {
      "l": 18.09,
      "a": -23.77,
      "b": 13.95
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-savage-beige",
    "name": "Savage Beige",
    "brand": "Scale75",
    "hex": "#F3D783",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 243,
      "g": 215,
      "b": 131
    },
    "lab": {
      "l": 86.65,
      "a": -1.13,
      "b": 44.85
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-shadow-black",
    "name": "Shadow Black",
    "brand": "Scale75",
    "hex": "#1D1F1C",
    "type": "Base",
    "category": "base",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 29,
      "g": 31,
      "b": 28
    },
    "lab": {
      "l": 11.45,
      "a": -1.69,
      "b": 1.73
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sherwood-green",
    "name": "Sherwood Green",
    "brand": "Scale75",
    "hex": "#7D853A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 125,
      "g": 133,
      "b": 58
    },
    "lab": {
      "l": 53.43,
      "a": -14.22,
      "b": 38.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sky-blue",
    "name": "Sky Blue",
    "brand": "Scale75",
    "hex": "#2496C8",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 36,
      "g": 150,
      "b": 200
    },
    "lab": {
      "l": 58.37,
      "a": -13.32,
      "b": -34.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-slimer-green",
    "name": "Slimer Green",
    "brand": "Scale75",
    "hex": "#5A9032",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 90,
      "g": 144,
      "b": 50
    },
    "lab": {
      "l": 54.4,
      "a": -34.65,
      "b": 43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-smoke-gray",
    "name": "Smoke Gray",
    "brand": "Scale75",
    "hex": "#886859",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 136,
      "g": 104,
      "b": 89
    },
    "lab": {
      "l": 46.79,
      "a": 10.57,
      "b": 13.39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sol-yellow",
    "name": "Sol Yellow",
    "brand": "Scale75",
    "hex": "#ECCB00",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 236,
      "g": 203,
      "b": 0
    },
    "lab": {
      "l": 82.14,
      "a": -3.95,
      "b": 82.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-spectral-wolf",
    "name": "Spectral Wolf",
    "brand": "Scale75",
    "hex": "#AB9FA1",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 171,
      "g": 159,
      "b": 161
    },
    "lab": {
      "l": 66.54,
      "a": 4.72,
      "b": 0.53
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-speed-metal",
    "name": "Speed Metal",
    "brand": "Scale75",
    "hex": "#D4D4D6",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 212,
      "g": 212,
      "b": 214
    },
    "lab": {
      "l": 84.97,
      "a": 0.36,
      "b": -0.99
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-speed-yellow",
    "name": "Speed Yellow",
    "brand": "Scale75",
    "hex": "#FFFE00",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 254,
      "b": 0
    },
    "lab": {
      "l": 96.88,
      "a": -21.08,
      "b": 94.29
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-spring-green",
    "name": "Spring Green",
    "brand": "Scale75",
    "hex": "#5D9F35",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 93,
      "g": 159,
      "b": 53
    },
    "lab": {
      "l": 59.32,
      "a": -39.93,
      "b": 47.06
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-dark-green",
    "name": "Ss Camo Dark Green",
    "brand": "Scale75",
    "hex": "#2A331E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 42,
      "g": 51,
      "b": 30
    },
    "lab": {
      "l": 19.86,
      "a": -8.42,
      "b": 12.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-golden-brown",
    "name": "SS Camo Golden Brown",
    "brand": "Scale75",
    "hex": "#F0A001",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 240,
      "g": 160,
      "b": 1
    },
    "lab": {
      "l": 72.01,
      "a": 20.24,
      "b": 76.04
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-highlights",
    "name": "Ss Camo Highlights",
    "brand": "Scale75",
    "hex": "#FAB861",
    "type": "Layer",
    "category": "layer",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 250,
      "g": 184,
      "b": 97
    },
    "lab": {
      "l": 79.31,
      "a": 15.03,
      "b": 52.72
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-italian-green",
    "name": "Ss Camo Italian Green",
    "brand": "Scale75",
    "hex": "#3F5232",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 63,
      "g": 82,
      "b": 50
    },
    "lab": {
      "l": 32.53,
      "a": -14.12,
      "b": 16.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-light-green",
    "name": "Ss Camo Light Green",
    "brand": "Scale75",
    "hex": "#7E8126",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 126,
      "g": 129,
      "b": 38
    },
    "lab": {
      "l": 52.15,
      "a": -13.11,
      "b": 46.54
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-ocher-brown",
    "name": "Ss Camo Ocher Brown",
    "brand": "Scale75",
    "hex": "#CFAE5F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 207,
      "g": 174,
      "b": 95
    },
    "lab": {
      "l": 72.47,
      "a": 2.3,
      "b": 44.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-ss-camo-top-shadows",
    "name": "Ss Camo Top Shadows",
    "brand": "Scale75",
    "hex": "#343428",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 52,
      "g": 52,
      "b": 40
    },
    "lab": {
      "l": 21.35,
      "a": -2.52,
      "b": 7.62
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sulfur-yellow",
    "name": "Sulfur Yellow",
    "brand": "Scale75",
    "hex": "#FED500",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 254,
      "g": 213,
      "b": 0
    },
    "lab": {
      "l": 86.34,
      "a": -1.34,
      "b": 86.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-sunset-purple",
    "name": "Sunset Purple",
    "brand": "Scale75",
    "hex": "#622E54",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 98,
      "g": 46,
      "b": 84
    },
    "lab": {
      "l": 27.27,
      "a": 29.02,
      "b": -12.47
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-surfer-orc-flesh",
    "name": "Surfer Orc Flesh",
    "brand": "Scale75",
    "hex": "#00A58B",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 0,
      "g": 165,
      "b": 139
    },
    "lab": {
      "l": 60.58,
      "a": -42.35,
      "b": 3.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-techno-green",
    "name": "Techno Green",
    "brand": "Scale75",
    "hex": "#44FA05",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 68,
      "g": 250,
      "b": 5
    },
    "lab": {
      "l": 86.8,
      "a": -79.37,
      "b": 82.3
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-tenere-yellow",
    "name": "Tenere Yellow",
    "brand": "Scale75",
    "hex": "#E5C76F",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 229,
      "g": 199,
      "b": 111
    },
    "lab": {
      "l": 81.1,
      "a": -0.36,
      "b": 47.57
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-thrash-metal",
    "name": "Thrash Metal",
    "brand": "Scale75",
    "hex": "#544943",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 84,
      "g": 73,
      "b": 67
    },
    "lab": {
      "l": 31.93,
      "a": 3.49,
      "b": 5.29
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-tiamat-orange",
    "name": "Tiamat Orange",
    "brand": "Scale75",
    "hex": "#E97329",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 233,
      "g": 115,
      "b": 41
    },
    "lab": {
      "l": 61.44,
      "a": 41.34,
      "b": 58.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-tindalos-red",
    "name": "Tindalos Red",
    "brand": "Scale75",
    "hex": "#5B2922",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 91,
      "g": 41,
      "b": 34
    },
    "lab": {
      "l": 23.43,
      "a": 22.24,
      "b": 15.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-titanium-grey",
    "name": "Titanium Grey",
    "brand": "Scale75",
    "hex": "#404445",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 64,
      "g": 68,
      "b": 69
    },
    "lab": {
      "l": 28.52,
      "a": -1.42,
      "b": -1.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-toad-green",
    "name": "Toad Green",
    "brand": "Scale75",
    "hex": "#475139",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 71,
      "g": 81,
      "b": 57
    },
    "lab": {
      "l": 32.96,
      "a": -8.91,
      "b": 12.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-tourmaline-alchemy",
    "name": "Tourmaline Alchemy",
    "brand": "Scale75",
    "hex": "#E7A8B3",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 231,
      "g": 168,
      "b": 179
    },
    "lab": {
      "l": 74.98,
      "a": 24.73,
      "b": 3.55
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-toxic-waste-green",
    "name": "Toxic Waste Green",
    "brand": "Scale75",
    "hex": "#C7D538",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 199,
      "g": 213,
      "b": 56
    },
    "lab": {
      "l": 81.85,
      "a": -23.41,
      "b": 70.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-turquoise",
    "name": "Turquoise",
    "brand": "Scale75",
    "hex": "#03435F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 3,
      "g": 67,
      "b": 95
    },
    "lab": {
      "l": 26.33,
      "a": -6.97,
      "b": -21.68
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-turquoise-blue",
    "name": "Turquoise Blue",
    "brand": "Scale75",
    "hex": "#15998E",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 21,
      "g": 153,
      "b": 142
    },
    "lab": {
      "l": 56.97,
      "a": -35.15,
      "b": -3.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-undead-dragon",
    "name": "Undead Dragon",
    "brand": "Scale75",
    "hex": "#B6C8BC",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 182,
      "g": 200,
      "b": 188
    },
    "lab": {
      "l": 78.97,
      "a": -8.4,
      "b": 3.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-undead-flesh",
    "name": "Undead Flesh",
    "brand": "Scale75",
    "hex": "#A8B170",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 168,
      "g": 177,
      "b": 112
    },
    "lab": {
      "l": 70.13,
      "a": -13.58,
      "b": 32.23
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-us-dark-brown",
    "name": "Us Dark Brown",
    "brand": "Scale75",
    "hex": "#AE8A72",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 174,
      "g": 138,
      "b": 114
    },
    "lab": {
      "l": 60.24,
      "a": 10.22,
      "b": 18.07
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-us-green",
    "name": "Us Green",
    "brand": "Scale75",
    "hex": "#474632",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 71,
      "g": 70,
      "b": 50
    },
    "lab": {
      "l": 29.29,
      "a": -3.41,
      "b": 12.25
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-vanilla-white",
    "name": "Vanilla White",
    "brand": "Scale75",
    "hex": "#EDE8D4",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 237,
      "g": 232,
      "b": 212
    },
    "lab": {
      "l": 91.9,
      "a": -1.67,
      "b": 10.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-vanilla-yellow",
    "name": "Vanilla Yellow",
    "brand": "Scale75",
    "hex": "#D8CC68",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 216,
      "g": 204,
      "b": 104
    },
    "lab": {
      "l": 81.17,
      "a": -8.84,
      "b": 50.75
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-victorian-brass",
    "name": "Victorian Brass",
    "brand": "Scale75",
    "hex": "#B6843B",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 182,
      "g": 132,
      "b": 59
    },
    "lab": {
      "l": 58.76,
      "a": 11.78,
      "b": 45.79
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-viking-gold",
    "name": "Viking Gold",
    "brand": "Scale75",
    "hex": "#8D591F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 141,
      "g": 89,
      "b": 31
    },
    "lab": {
      "l": 42.62,
      "a": 16.34,
      "b": 40.62
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-violet-blue",
    "name": "Violet Blue",
    "brand": "Scale75",
    "hex": "#604673",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 96,
      "g": 70,
      "b": 115
    },
    "lab": {
      "l": 34.2,
      "a": 20.51,
      "b": -21.66
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-violet-grey",
    "name": "Violet Grey",
    "brand": "Scale75",
    "hex": "#72727C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 114,
      "g": 114,
      "b": 124
    },
    "lab": {
      "l": 48.34,
      "a": 2.11,
      "b": -5.5
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-white",
    "name": "White",
    "brand": "Scale75",
    "hex": "#FFFFFF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "lab": {
      "l": 100,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-white-metal",
    "name": "White Metal",
    "brand": "Scale75",
    "hex": "#F1F1F1",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 241,
      "g": 241,
      "b": 241
    },
    "lab": {
      "l": 95.15,
      "a": 0,
      "b": 0
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-white-sands",
    "name": "White Sands",
    "brand": "Scale75",
    "hex": "#F6E1C6",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 246,
      "g": 225,
      "b": 198
    },
    "lab": {
      "l": 90.56,
      "a": 2.98,
      "b": 15.83
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-wild-beast",
    "name": "Wild Beast",
    "brand": "Scale75",
    "hex": "#CA854E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 202,
      "g": 133,
      "b": 78
    },
    "lab": {
      "l": 61.55,
      "a": 21.07,
      "b": 40.07
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-winter-grey",
    "name": "Winter Grey",
    "brand": "Scale75",
    "hex": "#6E6E70",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 110,
      "g": 110,
      "b": 112
    },
    "lab": {
      "l": 46.49,
      "a": 0.41,
      "b": -1.11
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-winter-shadow",
    "name": "Winter Shadow",
    "brand": "Scale75",
    "hex": "#3A3C39",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 58,
      "g": 60,
      "b": 57
    },
    "lab": {
      "l": 25.03,
      "a": -1.53,
      "b": 1.56
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-yellow-code",
    "name": "Yellow Code",
    "brand": "Scale75",
    "hex": "#FFCB06",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 255,
      "g": 203,
      "b": 6
    },
    "lab": {
      "l": 83.96,
      "a": 4.24,
      "b": 84.51
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-yellow-ocre",
    "name": "Yellow Ocre",
    "brand": "Scale75",
    "hex": "#A0702E",
    "type": "Base",
    "category": "base",
    "family": "Orange",
    "colorFamily": "orange",
    "rgb": {
      "r": 160,
      "g": 112,
      "b": 46
    },
    "lab": {
      "l": 50.99,
      "a": 12.49,
      "b": 42.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-zombie-skin",
    "name": "Zombie Skin",
    "brand": "Scale75",
    "hex": "#A6A869",
    "type": "Base",
    "category": "base",
    "family": "Flesh",
    "colorFamily": "flesh",
    "rgb": {
      "r": 166,
      "g": 168,
      "b": 105
    },
    "lab": {
      "l": 67.38,
      "a": -10.54,
      "b": 32.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "scale75-zucchini-green",
    "name": "Zucchini Green",
    "brand": "Scale75",
    "hex": "#405B32",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 64,
      "g": 91,
      "b": 50
    },
    "lab": {
      "l": 35.6,
      "a": -18.67,
      "b": 20.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-abyssal-turquoise",
    "name": "Abyssal Turquoise",
    "brand": "Vallejo",
    "hex": "#00132E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 19,
      "b": 46
    },
    "lab": {
      "l": 5.99,
      "a": 3.92,
      "b": -20.22
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-aged-metal",
    "name": "Aged Metal",
    "brand": "Vallejo",
    "hex": "#736F4F",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 115,
      "g": 111,
      "b": 79
    },
    "lab": {
      "l": 46.42,
      "a": -3.94,
      "b": 18.43
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-alien-purple",
    "name": "Alien Purple",
    "brand": "Vallejo",
    "hex": "#362EB2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 54,
      "g": 46,
      "b": 178
    },
    "lab": {
      "l": 29.29,
      "a": 44.94,
      "b": -68.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-amaranth-red-scarlet",
    "name": "Amaranth Red Scarlet",
    "brand": "Vallejo",
    "hex": "#D93326",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 217,
      "g": 51,
      "b": 38
    },
    "lab": {
      "l": 48.59,
      "a": 62.6,
      "b": 47.3
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-amber-green",
    "name": "Amber Green",
    "brand": "Vallejo",
    "hex": "#82A267",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 130,
      "g": 162,
      "b": 103
    },
    "lab": {
      "l": 62.98,
      "a": -21.91,
      "b": 27.17
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-amethyst-purple",
    "name": "Amethyst Purple",
    "brand": "Vallejo",
    "hex": "#AA76BD",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 170,
      "g": 118,
      "b": 189
    },
    "lab": {
      "l": 57.25,
      "a": 32.98,
      "b": -29.33
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-ancient-copper",
    "name": "Ancient Copper",
    "brand": "Vallejo",
    "hex": "#DE9F78",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 222,
      "g": 159,
      "b": 120
    },
    "lab": {
      "l": 70.65,
      "a": 18.81,
      "b": 29.62
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-angel-green",
    "name": "Angel Green",
    "brand": "Vallejo",
    "hex": "#0B2A01",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 11,
      "g": 42,
      "b": 1
    },
    "lab": {
      "l": 14,
      "a": -20.79,
      "b": 19.68
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-aquamarine",
    "name": "Aquamarine",
    "brand": "Vallejo",
    "hex": "#167C7D",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 22,
      "g": 124,
      "b": 125
    },
    "lab": {
      "l": 47.06,
      "a": -26.4,
      "b": -8.47
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-arcane-gold",
    "name": "Arcane Gold",
    "brand": "Vallejo",
    "hex": "#BA8F6D",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 186,
      "g": 143,
      "b": 109
    },
    "lab": {
      "l": 62.67,
      "a": 11.75,
      "b": 24.35
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-athena-skin",
    "name": "Athena Skin",
    "brand": "Vallejo",
    "hex": "#A84C55",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 168,
      "g": 76,
      "b": 85
    },
    "lab": {
      "l": 44.45,
      "a": 38.68,
      "b": 13.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-azure-prussian",
    "name": "Azure Prussian",
    "brand": "Vallejo",
    "hex": "#456BD4",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 69,
      "g": 107,
      "b": 212
    },
    "lab": {
      "l": 47.67,
      "a": 20.94,
      "b": -58.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-barbarian-skin",
    "name": "Barbarian Skin",
    "brand": "Vallejo",
    "hex": "#5B4C2F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 76,
      "b": 47
    },
    "lab": {
      "l": 33.13,
      "a": 1.84,
      "b": 19.55
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-basic-skin-tone-salmon",
    "name": "Basic Skin Tone Salmon",
    "brand": "Vallejo",
    "hex": "#EB9C8C",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 235,
      "g": 156,
      "b": 140
    },
    "lab": {
      "l": 71.78,
      "a": 27.62,
      "b": 20.5
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-beasty-brown",
    "name": "Beasty Brown",
    "brand": "Vallejo",
    "hex": "#372406",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 36,
      "b": 6
    },
    "lab": {
      "l": 15.94,
      "a": 5.67,
      "b": 20.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-beetle-green",
    "name": "Beetle Green",
    "brand": "Vallejo",
    "hex": "#87C3A5",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 135,
      "g": 195,
      "b": 165
    },
    "lab": {
      "l": 74.12,
      "a": -25.71,
      "b": 8.96
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-beige-red-cork",
    "name": "Beige Red Cork",
    "brand": "Vallejo",
    "hex": "#A25F3E",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 162,
      "g": 95,
      "b": 62
    },
    "lab": {
      "l": 47.26,
      "a": 24.06,
      "b": 30.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-black",
    "name": "Black",
    "brand": "Vallejo",
    "hex": "#000000",
    "type": "Base",
    "category": "base",
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
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-black",
    "name": "Black",
    "brand": "Vallejo",
    "hex": "#231F20",
    "type": "Shade",
    "category": "wash",
    "family": "Black",
    "colorFamily": "black",
    "rgb": {
      "r": 35,
      "g": 31,
      "b": 32
    },
    "lab": {
      "l": 12.23,
      "a": 2.14,
      "b": 0.01
    },
    "finish": "matte",
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black-green",
    "name": "Black Green",
    "brand": "Vallejo",
    "hex": "#0E2615",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 14,
      "g": 38,
      "b": 21
    },
    "lab": {
      "l": 12.82,
      "a": -14.32,
      "b": 8.49
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-black-violet-azure",
    "name": "Black Violet Azure",
    "brand": "Vallejo",
    "hex": "#1B162B",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 27,
      "g": 22,
      "b": 43
    },
    "lab": {
      "l": 8.83,
      "a": 8.56,
      "b": -13.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-blue-green-light",
    "name": "Blue Green Light",
    "brand": "Vallejo",
    "hex": "#19998C",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 25,
      "g": 153,
      "b": 140
    },
    "lab": {
      "l": 56.96,
      "a": -35.42,
      "b": -2.5
    },
    "finish": "matte",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-blue-infantry",
    "name": "Blue Infantry",
    "brand": "Vallejo",
    "hex": "#0E0A5C",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 14,
      "g": 10,
      "b": 92
    },
    "lab": {
      "l": 9.66,
      "a": 32.32,
      "b": -46.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bone-white",
    "name": "Bone White",
    "brand": "Vallejo",
    "hex": "#C9D19E",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 201,
      "g": 209,
      "b": 158
    },
    "lab": {
      "l": 82.1,
      "a": -11.16,
      "b": 24.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-brassy-brass",
    "name": "Brassy Brass",
    "brand": "Vallejo",
    "hex": "#9E5426",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 158,
      "g": 84,
      "b": 38
    },
    "lab": {
      "l": 43.87,
      "a": 27.03,
      "b": 39.28
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-bright-bronze",
    "name": "Bright Bronze",
    "brand": "Vallejo",
    "hex": "#974203",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 151,
      "g": 66,
      "b": 3
    },
    "lab": {
      "l": 38.7,
      "a": 32.8,
      "b": 48.2
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bright-green-intermediate",
    "name": "Bright Green Intermediate",
    "brand": "Vallejo",
    "hex": "#579629",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 87,
      "g": 150,
      "b": 41
    },
    "lab": {
      "l": 56.09,
      "a": -39.1,
      "b": 48.49
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bright-orange",
    "name": "Bright Orange",
    "brand": "Vallejo",
    "hex": "#EB400F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 235,
      "g": 64,
      "b": 15
    },
    "lab": {
      "l": 53.35,
      "a": 63.45,
      "b": 61.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-bronze-green-bright",
    "name": "Bronze Green Bright",
    "brand": "Vallejo",
    "hex": "#1B2D16",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 45,
      "b": 22
    },
    "lab": {
      "l": 16.34,
      "a": -13.02,
      "b": 12.58
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-brown-rose",
    "name": "Brown Rose",
    "brand": "Vallejo",
    "hex": "#885763",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 136,
      "g": 87,
      "b": 99
    },
    "lab": {
      "l": 42.69,
      "a": 22.02,
      "b": 1.54
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-brown-sand-chestnut",
    "name": "Brown Sand Chestnut",
    "brand": "Vallejo",
    "hex": "#7A5234",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 122,
      "g": 82,
      "b": 52
    },
    "lab": {
      "l": 38.59,
      "a": 13.18,
      "b": 24.23
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-black-green",
    "name": "Cam. Black Green",
    "brand": "Vallejo",
    "hex": "#161F18",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 22,
      "g": 31,
      "b": 24
    },
    "lab": {
      "l": 10.68,
      "a": -5.96,
      "b": 3.47
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-dark-green-yellow",
    "name": "Cam. Dark Green Yellow",
    "brand": "Vallejo",
    "hex": "#122412",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 18,
      "g": 36,
      "b": 18
    },
    "lab": {
      "l": 12.18,
      "a": -12.3,
      "b": 9.61
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-middle-brownburnt",
    "name": "Cam. Middle BrownBurnt",
    "brand": "Vallejo",
    "hex": "#332D0D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 51,
      "g": 45,
      "b": 13
    },
    "lab": {
      "l": 18.41,
      "a": -2.1,
      "b": 20.88
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cam-olive-green",
    "name": "Cam. Olive Green",
    "brand": "Vallejo",
    "hex": "#212D1D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 33,
      "g": 45,
      "b": 29
    },
    "lab": {
      "l": 16.94,
      "a": -9,
      "b": 8.74
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-canvas-cam",
    "name": "Canvas Cam.",
    "brand": "Vallejo",
    "hex": "#2E2E0B",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 46,
      "g": 46,
      "b": 11
    },
    "lab": {
      "l": 18.18,
      "a": -5.63,
      "b": 21.39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-carmine-red-red",
    "name": "Carmine Red Red",
    "brand": "Vallejo",
    "hex": "#870000",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 135,
      "g": 0,
      "b": 0
    },
    "lab": {
      "l": 27.17,
      "a": 49.93,
      "b": 40.14
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-celestial-violet",
    "name": "Celestial Violet",
    "brand": "Vallejo",
    "hex": "#9D8DCA",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 157,
      "g": 141,
      "b": 202
    },
    "lab": {
      "l": 62.07,
      "a": 18.74,
      "b": -29.33
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-chainmail",
    "name": "Chainmail",
    "brand": "Vallejo",
    "hex": "#839EA4",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 131,
      "g": 158,
      "b": 164
    },
    "lab": {
      "l": 63.31,
      "a": -8.03,
      "b": -6.25
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-charcoal",
    "name": "Charcoal",
    "brand": "Vallejo",
    "hex": "#070A08",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 7,
      "g": 10,
      "b": 8
    },
    "lab": {
      "l": 2.53,
      "a": -1.06,
      "b": 0.48
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-charred-brown",
    "name": "Charred Brown",
    "brand": "Vallejo",
    "hex": "#110C0D",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 17,
      "g": 12,
      "b": 13
    },
    "lab": {
      "l": 3.71,
      "a": 1.82,
      "b": 0.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-chestnut-brown-flat",
    "name": "Chestnut Brown Flat",
    "brand": "Vallejo",
    "hex": "#422B2F",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 66,
      "g": 43,
      "b": 47
    },
    "lab": {
      "l": 20.41,
      "a": 11.36,
      "b": 1.73
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cold-white-off-white",
    "name": "Cold White Off-White",
    "brand": "Vallejo",
    "hex": "#F5F5FC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 245,
      "g": 245,
      "b": 252
    },
    "lab": {
      "l": 96.72,
      "a": 1.25,
      "b": -3.35
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-continental-blue-light",
    "name": "Continental Blue Light",
    "brand": "Vallejo",
    "hex": "#0C1223",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 12,
      "g": 18,
      "b": 35
    },
    "lab": {
      "l": 5.71,
      "a": 2.88,
      "b": -12.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-cork-brown-brown",
    "name": "Cork Brown Brown",
    "brand": "Vallejo",
    "hex": "#8C6640",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 140,
      "g": 102,
      "b": 64
    },
    "lab": {
      "l": 46.24,
      "a": 10.59,
      "b": 27.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-crimson-magenta",
    "name": "Crimson Magenta",
    "brand": "Vallejo",
    "hex": "#E178B7",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 225,
      "g": 120,
      "b": 183
    },
    "lab": {
      "l": 64.05,
      "a": 48.42,
      "b": -14.93
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-flesh-med",
    "name": "Dark Flesh Med.",
    "brand": "Vallejo",
    "hex": "#CC8A26",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 204,
      "g": 138,
      "b": 38
    },
    "lab": {
      "l": 62.64,
      "a": 17.16,
      "b": 59.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-flesh-tone",
    "name": "Dark Flesh Tone",
    "brand": "Vallejo",
    "hex": "#240C0A",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 36,
      "g": 12,
      "b": 10
    },
    "lab": {
      "l": 5.96,
      "a": 11.66,
      "b": 5.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-green",
    "name": "Dark Green",
    "brand": "Vallejo",
    "hex": "#05170A",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 5,
      "g": 23,
      "b": 10
    },
    "lab": {
      "l": 6.02,
      "a": -8.61,
      "b": 4.76
    },
    "finish": "matte",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dark-gunmetal",
    "name": "Dark Gunmetal",
    "brand": "Vallejo",
    "hex": "#566E76",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 86,
      "g": 110,
      "b": 118
    },
    "lab": {
      "l": 44.85,
      "a": -6.8,
      "b": -7.34
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-prussian-blue-pastel",
    "name": "Dark Prussian Blue Pastel",
    "brand": "Vallejo",
    "hex": "#130847",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 19,
      "g": 8,
      "b": 71
    },
    "lab": {
      "l": 6.93,
      "a": 26.38,
      "b": -36.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-purple",
    "name": "Dark Purple",
    "brand": "Vallejo",
    "hex": "#261233",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 38,
      "g": 18,
      "b": 51
    },
    "lab": {
      "l": 9.67,
      "a": 17.84,
      "b": -17.82
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-red",
    "name": "Dark Red",
    "brand": "Vallejo",
    "hex": "#4C1718",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 76,
      "g": 23,
      "b": 24
    },
    "lab": {
      "l": 16.58,
      "a": 25.15,
      "b": 12.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-sea-blue-continental",
    "name": "Dark Sea Blue Continental",
    "brand": "Vallejo",
    "hex": "#0D1C33",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 13,
      "g": 28,
      "b": 51
    },
    "lab": {
      "l": 10.22,
      "a": 2.71,
      "b": -17.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-vermilion-flat",
    "name": "Dark Vermilion Flat",
    "brand": "Vallejo",
    "hex": "#B20C18",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 178,
      "g": 12,
      "b": 24
    },
    "lab": {
      "l": 37.48,
      "a": 60.09,
      "b": 41.51
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-dark-yellow",
    "name": "Dark Yellow",
    "brand": "Vallejo",
    "hex": "#799118",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 121,
      "g": 145,
      "b": 24
    },
    "lab": {
      "l": 56.47,
      "a": -24.3,
      "b": 55.22
    },
    "finish": "matte",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dead-flesh",
    "name": "Dead Flesh",
    "brand": "Vallejo",
    "hex": "#797424",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 121,
      "g": 116,
      "b": 36
    },
    "lab": {
      "l": 47.86,
      "a": -8.4,
      "b": 42.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dead-white",
    "name": "Dead White",
    "brand": "Vallejo",
    "hex": "#FFFFFF",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "lab": {
      "l": 100,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deck-tan",
    "name": "Deck Tan",
    "brand": "Vallejo",
    "hex": "#99AB8C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 153,
      "g": 171,
      "b": 140
    },
    "lab": {
      "l": 67.87,
      "a": -12.1,
      "b": 13.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deep-green-black",
    "name": "Deep Green Black",
    "brand": "Vallejo",
    "hex": "#0F4C0F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 15,
      "g": 76,
      "b": 15
    },
    "lab": {
      "l": 27.59,
      "a": -32.22,
      "b": 29.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-deep-magenta",
    "name": "Deep Magenta",
    "brand": "Vallejo",
    "hex": "#3F172E",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 63,
      "g": 23,
      "b": 46
    },
    "lab": {
      "l": 14.77,
      "a": 22.68,
      "b": -5.94
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deep-sky-blue-andrea",
    "name": "Deep Sky Blue Andrea",
    "brand": "Vallejo",
    "hex": "#4DB2E6",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 77,
      "g": 178,
      "b": 230
    },
    "lab": {
      "l": 68.84,
      "a": -13.37,
      "b": -34.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-deep-yellow-flat",
    "name": "Deep Yellow Flat",
    "brand": "Vallejo",
    "hex": "#EBCC0D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 235,
      "g": 204,
      "b": 13
    },
    "lab": {
      "l": 82.31,
      "a": -4.78,
      "b": 81.79
    },
    "finish": "matte",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-dirty-grey",
    "name": "Dirty Grey",
    "brand": "Vallejo",
    "hex": "#2C2D08",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 44,
      "g": 45,
      "b": 8
    },
    "lab": {
      "l": 17.6,
      "a": -6.3,
      "b": 21.87
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-dusken-green",
    "name": "Dusken Green",
    "brand": "Vallejo",
    "hex": "#64957B",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 100,
      "g": 149,
      "b": 123
    },
    "lab": {
      "l": 57.69,
      "a": -22.33,
      "b": 8.54
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-earth",
    "name": "Earth",
    "brand": "Vallejo",
    "hex": "#372A10",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 55,
      "g": 42,
      "b": 16
    },
    "lab": {
      "l": 17.94,
      "a": 2.33,
      "b": 18.89
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-electric-blue",
    "name": "Electric Blue",
    "brand": "Vallejo",
    "hex": "#108494",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 16,
      "g": 132,
      "b": 148
    },
    "lab": {
      "l": 50.39,
      "a": -23.33,
      "b": -16.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-elf-skin-tone",
    "name": "Elf Skin Tone",
    "brand": "Vallejo",
    "hex": "#BC6B48",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 188,
      "g": 107,
      "b": 72
    },
    "lab": {
      "l": 53.68,
      "a": 29.01,
      "b": 33.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-elfic-blue",
    "name": "Elfic Blue",
    "brand": "Vallejo",
    "hex": "#214E90",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 33,
      "g": 78,
      "b": 144
    },
    "lab": {
      "l": 33.53,
      "a": 9.08,
      "b": -40.93
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-elfic-flesh",
    "name": "Elfic Flesh",
    "brand": "Vallejo",
    "hex": "#EDD494",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 237,
      "g": 212,
      "b": 148
    },
    "lab": {
      "l": 85.62,
      "a": -0.2,
      "b": 34.86
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-emerald-green",
    "name": "Emerald Green",
    "brand": "Vallejo",
    "hex": "#007A2B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 0,
      "g": 122,
      "b": 43
    },
    "lab": {
      "l": 44.37,
      "a": -46.74,
      "b": 34.34
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-evil-red",
    "name": "Evil Red",
    "brand": "Vallejo",
    "hex": "#291621",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 41,
      "g": 22,
      "b": 33
    },
    "lab": {
      "l": 10.22,
      "a": 11.71,
      "b": -3.61
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-extra-dark-green",
    "name": "Extra Dark Green",
    "brand": "Vallejo",
    "hex": "#14190A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 20,
      "g": 25,
      "b": 10
    },
    "lab": {
      "l": 7.82,
      "a": -5.41,
      "b": 7.51
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-faded-red-amaranth",
    "name": "Faded Red Amaranth",
    "brand": "Vallejo",
    "hex": "#B24052",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 178,
      "g": 64,
      "b": 82
    },
    "lab": {
      "l": 43.86,
      "a": 47.65,
      "b": 14.54
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-fern-green-flat",
    "name": "Fern Green Flat",
    "brand": "Vallejo",
    "hex": "#295511",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 41,
      "g": 85,
      "b": 17
    },
    "lab": {
      "l": 31.83,
      "a": -28.49,
      "b": 32.88
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-blue-royal",
    "name": "Flat Blue Royal",
    "brand": "Vallejo",
    "hex": "#1C38A1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 28,
      "g": 56,
      "b": 161
    },
    "lab": {
      "l": 28.5,
      "a": 30.21,
      "b": -59.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-flesh-dark",
    "name": "Flat Flesh Dark",
    "brand": "Vallejo",
    "hex": "#DE8C4D",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 222,
      "g": 140,
      "b": 77
    },
    "lab": {
      "l": 65.61,
      "a": 25.54,
      "b": 45.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-green-cam",
    "name": "Flat Green Cam.",
    "brand": "Vallejo",
    "hex": "#1B4609",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 27,
      "g": 70,
      "b": 9
    },
    "lab": {
      "l": 25.66,
      "a": -27.18,
      "b": 29.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-red-dark",
    "name": "Flat Red Dark",
    "brand": "Vallejo",
    "hex": "#950B17",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 149,
      "g": 11,
      "b": 23
    },
    "lab": {
      "l": 31.1,
      "a": 52.41,
      "b": 33.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-flat-yellow-golden",
    "name": "Flat Yellow Golden",
    "brand": "Vallejo",
    "hex": "#F7B226",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 247,
      "g": 178,
      "b": 38
    },
    "lab": {
      "l": 77.14,
      "a": 14.27,
      "b": 73.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-forged-red",
    "name": "Forged Red",
    "brand": "Vallejo",
    "hex": "#E28F73",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 226,
      "g": 143,
      "b": 115
    },
    "lab": {
      "l": 67.32,
      "a": 28.49,
      "b": 28.03
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-foul-green",
    "name": "Foul Green",
    "brand": "Vallejo",
    "hex": "#208134",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 32,
      "g": 129,
      "b": 52
    },
    "lab": {
      "l": 47.31,
      "a": -44.43,
      "b": 33.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ger-fieldgrey-wwiigerman",
    "name": "Ger. Fieldgrey WWIIGerman",
    "brand": "Vallejo",
    "hex": "#394724",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 57,
      "g": 71,
      "b": 36
    },
    "lab": {
      "l": 28.12,
      "a": -12.6,
      "b": 19.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-germ-beige-wwii-khaki",
    "name": "Germ. Beige WWII Khaki",
    "brand": "Vallejo",
    "hex": "#5D6641",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 93,
      "g": 102,
      "b": 65
    },
    "lab": {
      "l": 41.55,
      "a": -10.3,
      "b": 19.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-orange-old",
    "name": "German Orange Old",
    "brand": "Vallejo",
    "hex": "#B34C58",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 179,
      "g": 76,
      "b": 88
    },
    "lab": {
      "l": 46.26,
      "a": 42.95,
      "b": 14.17
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-uniform-bronze",
    "name": "German Uniform Bronze",
    "brand": "Vallejo",
    "hex": "#264730",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 38,
      "g": 71,
      "b": 48
    },
    "lab": {
      "l": 27.11,
      "a": -18.11,
      "b": 10.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-german-yellow-dark",
    "name": "German Yellow Dark",
    "brand": "Vallejo",
    "hex": "#BFBF47",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 191,
      "g": 191,
      "b": 71
    },
    "lab": {
      "l": 75.32,
      "a": -15.06,
      "b": 58.46
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-glacier-blue",
    "name": "Glacier Blue",
    "brand": "Vallejo",
    "hex": "#ACDEFA",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 172,
      "g": 222,
      "b": 250
    },
    "lab": {
      "l": 85.96,
      "a": -9.66,
      "b": -18.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-glorious-gold",
    "name": "Glorious Gold",
    "brand": "Vallejo",
    "hex": "#D37417",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 211,
      "g": 116,
      "b": 23
    },
    "lab": {
      "l": 58.42,
      "a": 31.59,
      "b": 60.97
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-gold-yellow",
    "name": "Gold Yellow",
    "brand": "Vallejo",
    "hex": "#F26105",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 242,
      "g": 97,
      "b": 5
    },
    "lab": {
      "l": 59.38,
      "a": 52.63,
      "b": 67.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-golden-yellow-light",
    "name": "Golden Yellow Light",
    "brand": "Vallejo",
    "hex": "#FF9926",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 255,
      "g": 153,
      "b": 38
    },
    "lab": {
      "l": 72.35,
      "a": 30.67,
      "b": 70.09
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-gorgon-brown",
    "name": "Gorgon Brown",
    "brand": "Vallejo",
    "hex": "#21100B",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 33,
      "g": 16,
      "b": 11
    },
    "lab": {
      "l": 6.49,
      "a": 7.78,
      "b": 5.33
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-gory-red",
    "name": "Gory Red",
    "brand": "Vallejo",
    "hex": "#46000A",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 70,
      "g": 0,
      "b": 10
    },
    "lab": {
      "l": 11.45,
      "a": 31.99,
      "b": 13.91
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-grey-ger",
    "name": "Green Grey Ger.",
    "brand": "Vallejo",
    "hex": "#49613D",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 73,
      "g": 97,
      "b": 61
    },
    "lab": {
      "l": 38.38,
      "a": -16.52,
      "b": 17.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-green-sky-splinter",
    "name": "Green Sky Splinter",
    "brand": "Vallejo",
    "hex": "#62A34C",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 98,
      "g": 163,
      "b": 76
    },
    "lab": {
      "l": 61.06,
      "a": -37.55,
      "b": 38.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-greenish-gold",
    "name": "Greenish Gold",
    "brand": "Vallejo",
    "hex": "#B0B464",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 176,
      "g": 180,
      "b": 100
    },
    "lab": {
      "l": 71.41,
      "a": -13.27,
      "b": 40.16
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-grey-brown-canvas",
    "name": "Grey Brown Canvas",
    "brand": "Vallejo",
    "hex": "#3D3A08",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 61,
      "g": 58,
      "b": 8
    },
    "lab": {
      "l": 23.79,
      "a": -5.45,
      "b": 29.21
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-grunge-brown",
    "name": "Grunge Brown",
    "brand": "Vallejo",
    "hex": "#4C1F05",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 76,
      "g": 31,
      "b": 5
    },
    "lab": {
      "l": 18.04,
      "a": 19.58,
      "b": 24.71
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-gunship-green-german",
    "name": "Gunship Green German",
    "brand": "Vallejo",
    "hex": "#32532B",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 50,
      "g": 83,
      "b": 43
    },
    "lab": {
      "l": 31.9,
      "a": -21.06,
      "b": 19.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-hammered-copper",
    "name": "Hammered Copper",
    "brand": "Vallejo",
    "hex": "#5A3823",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 90,
      "g": 56,
      "b": 35
    },
    "lab": {
      "l": 27.08,
      "a": 12.65,
      "b": 19.27
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-hot-orange",
    "name": "Hot Orange",
    "brand": "Vallejo",
    "hex": "#EB1713",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 235,
      "g": 23,
      "b": 19
    },
    "lab": {
      "l": 49.89,
      "a": 73.3,
      "b": 58.1
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-hydra-turquoise",
    "name": "Hydra Turquoise",
    "brand": "Vallejo",
    "hex": "#57A9C5",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 87,
      "g": 169,
      "b": 197
    },
    "lab": {
      "l": 65.3,
      "a": -16.99,
      "b": -21.92
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ice-yellow-light",
    "name": "Ice Yellow Light",
    "brand": "Vallejo",
    "hex": "#E6D459",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 230,
      "g": 212,
      "b": 89
    },
    "lab": {
      "l": 84.29,
      "a": -8.25,
      "b": 61.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-imperial-blue",
    "name": "Imperial Blue",
    "brand": "Vallejo",
    "hex": "#011130",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 1,
      "g": 17,
      "b": 48
    },
    "lab": {
      "l": 5.61,
      "a": 6.41,
      "b": -22.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-imperial-gold",
    "name": "Imperial Gold",
    "brand": "Vallejo",
    "hex": "#DEAB6C",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 222,
      "g": 171,
      "b": 108
    },
    "lab": {
      "l": 73.38,
      "a": 11.25,
      "b": 39.44
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-infantry-blue-sky",
    "name": "Infantry Blue Sky",
    "brand": "Vallejo",
    "hex": "#0B0E27",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 11,
      "g": 14,
      "b": 39
    },
    "lab": {
      "l": 4.8,
      "a": 6.38,
      "b": -16.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-intermediate-green-fern",
    "name": "Intermediate Green Fern",
    "brand": "Vallejo",
    "hex": "#366C25",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 54,
      "g": 108,
      "b": 37
    },
    "lab": {
      "l": 40.64,
      "a": -32.41,
      "b": 33.37
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-ivory-light",
    "name": "Ivory Light",
    "brand": "Vallejo",
    "hex": "#E6E6CC",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 230,
      "g": 230,
      "b": 204
    },
    "lab": {
      "l": 90.68,
      "a": -4.39,
      "b": 12.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-khaki",
    "name": "Khaki",
    "brand": "Vallejo",
    "hex": "#5B5336",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 91,
      "g": 83,
      "b": 54
    },
    "lab": {
      "l": 35.36,
      "a": -1.57,
      "b": 18.19
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-khaki-grey",
    "name": "Khaki Grey",
    "brand": "Vallejo",
    "hex": "#525721",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 82,
      "g": 87,
      "b": 33
    },
    "lab": {
      "l": 35.44,
      "a": -10.53,
      "b": 30.05
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-leather-brown",
    "name": "Leather Brown",
    "brand": "Vallejo",
    "hex": "#312104",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 49,
      "g": 33,
      "b": 4
    },
    "lab": {
      "l": 14.11,
      "a": 4.27,
      "b": 19.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-lemon-yellow-deep",
    "name": "Lemon Yellow Deep",
    "brand": "Vallejo",
    "hex": "#D9E60D",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 217,
      "g": 230,
      "b": 13
    },
    "lab": {
      "l": 87.67,
      "a": -25.23,
      "b": 85.15
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-blue-green-blue",
    "name": "Light Blue Green Blue",
    "brand": "Vallejo",
    "hex": "#33CCA6",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 51,
      "g": 204,
      "b": 166
    },
    "lab": {
      "l": 73.96,
      "a": -47.94,
      "b": 7.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-brown",
    "name": "Light Brown",
    "brand": "Vallejo",
    "hex": "#8F4918",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 143,
      "g": 73,
      "b": 24
    },
    "lab": {
      "l": 39.02,
      "a": 26.11,
      "b": 40.45
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-emerald-emerald",
    "name": "Light Emerald Emerald",
    "brand": "Vallejo",
    "hex": "#1CA265",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 28,
      "g": 162,
      "b": 101
    },
    "lab": {
      "l": 59,
      "a": -48.65,
      "b": 22.26
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-flesh-basic",
    "name": "Light Flesh Basic",
    "brand": "Vallejo",
    "hex": "#F2CCB2",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 242,
      "g": 204,
      "b": 178
    },
    "lab": {
      "l": 84.63,
      "a": 9.58,
      "b": 17.95
    },
    "finish": "matte",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-mud",
    "name": "Light Mud",
    "brand": "Vallejo",
    "hex": "#617A4A",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 97,
      "g": 122,
      "b": 74
    },
    "lab": {
      "l": 48.2,
      "a": -18.3,
      "b": 23.39
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-orange-bright",
    "name": "Light Orange Bright",
    "brand": "Vallejo",
    "hex": "#FF5919",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 255,
      "g": 89,
      "b": 25
    },
    "lab": {
      "l": 60.32,
      "a": 60.71,
      "b": 64.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-pink",
    "name": "Light Pink",
    "brand": "Vallejo",
    "hex": "#E673CC",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 230,
      "g": 115,
      "b": 204
    },
    "lab": {
      "l": 64.52,
      "a": 55.64,
      "b": -26
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-turquoise",
    "name": "Light Turquoise",
    "brand": "Vallejo",
    "hex": "#00868F",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 134,
      "b": 143
    },
    "lab": {
      "l": 50.72,
      "a": -26.85,
      "b": -13.56
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-violet",
    "name": "Light Violet",
    "brand": "Vallejo",
    "hex": "#998CE8",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 153,
      "g": 140,
      "b": 232
    },
    "lab": {
      "l": 62.81,
      "a": 25.66,
      "b": -44.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-light-yellow-lemon",
    "name": "Light Yellow Lemon",
    "brand": "Vallejo",
    "hex": "#F2D933",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 242,
      "g": 217,
      "b": 51
    },
    "lab": {
      "l": 86.38,
      "a": -7.58,
      "b": 77.7
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-luftwaffe-green-military",
    "name": "Luftwaffe Green Military",
    "brand": "Vallejo",
    "hex": "#1D330D",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 29,
      "g": 51,
      "b": 13
    },
    "lab": {
      "l": 18.62,
      "a": -16.86,
      "b": 20.65
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-lustful-purple",
    "name": "Lustful Purple",
    "brand": "Vallejo",
    "hex": "#644DC2",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 100,
      "g": 77,
      "b": 194
    },
    "lab": {
      "l": 41.07,
      "a": 39.21,
      "b": -58.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-magenta",
    "name": "Magenta",
    "brand": "Vallejo",
    "hex": "#790F74",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 121,
      "g": 15,
      "b": 116
    },
    "lab": {
      "l": 28.56,
      "a": 53.12,
      "b": -30.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-med-flesh-tone-light",
    "name": "Med. Flesh Tone Light",
    "brand": "Vallejo",
    "hex": "#A16F2A",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 161,
      "g": 111,
      "b": 42
    },
    "lab": {
      "l": 50.82,
      "a": 13.29,
      "b": 44.64
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-midnight-purple",
    "name": "Midnight Purple",
    "brand": "Vallejo",
    "hex": "#090338",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 9,
      "g": 3,
      "b": 56
    },
    "lab": {
      "l": 3.69,
      "a": 19.26,
      "b": -31.26
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-military-green-pastel",
    "name": "Military Green Pastel",
    "brand": "Vallejo",
    "hex": "#283422",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 40,
      "g": 52,
      "b": 34
    },
    "lab": {
      "l": 20.13,
      "a": -9.23,
      "b": 9.79
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-moon-yellow",
    "name": "Moon Yellow",
    "brand": "Vallejo",
    "hex": "#EDB505",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 237,
      "g": 181,
      "b": 5
    },
    "lab": {
      "l": 76.72,
      "a": 7.92,
      "b": 78.65
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-neutral-grey",
    "name": "Neutral Grey",
    "brand": "Vallejo",
    "hex": "#2D3937",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 45,
      "g": 57,
      "b": 55
    },
    "lab": {
      "l": 22.86,
      "a": -5.47,
      "b": -0.41
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-night-blue",
    "name": "Night Blue",
    "brand": "Vallejo",
    "hex": "#020718",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 2,
      "g": 7,
      "b": 24
    },
    "lab": {
      "l": 2.08,
      "a": 1.9,
      "b": -9.2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-nocturnal-red",
    "name": "Nocturnal Red",
    "brand": "Vallejo",
    "hex": "#2E141B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 46,
      "g": 20,
      "b": 27
    },
    "lab": {
      "l": 10.26,
      "a": 14.27,
      "b": 1.05
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-obsidian-black",
    "name": "Obsidian Black",
    "brand": "Vallejo",
    "hex": "#676465",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 103,
      "g": 100,
      "b": 101
    },
    "lab": {
      "l": 42.67,
      "a": 1.38,
      "b": -0.15
    },
    "finish": "metallic",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-off-white",
    "name": "Off-White",
    "brand": "Vallejo",
    "hex": "#FCF2A3",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 252,
      "g": 242,
      "b": 163
    },
    "lab": {
      "l": 94.67,
      "a": -7.9,
      "b": 39.38
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-off-white-ivory",
    "name": "Off-White Ivory",
    "brand": "Vallejo",
    "hex": "#F2EDE6",
    "type": "Base",
    "category": "base",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 242,
      "g": 237,
      "b": 230
    },
    "lab": {
      "l": 93.95,
      "a": 0.47,
      "b": 3.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-old-rose-brown",
    "name": "Old Rose Brown",
    "brand": "Vallejo",
    "hex": "#B25980",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 178,
      "g": 89,
      "b": 128
    },
    "lab": {
      "l": 49.7,
      "a": 40.67,
      "b": -5.08
    },
    "finish": "matte",
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
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-olive-green-uniform",
    "name": "Olive Green Uniform",
    "brand": "Vallejo",
    "hex": "#356614",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 53,
      "g": 102,
      "b": 20
    },
    "lab": {
      "l": 38.39,
      "a": -31.61,
      "b": 38.36
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-olive-grey",
    "name": "Olive Grey",
    "brand": "Vallejo",
    "hex": "#263319",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 38,
      "g": 51,
      "b": 25
    },
    "lab": {
      "l": 19.43,
      "a": -11.13,
      "b": 14.73
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-orange-fire",
    "name": "Orange Fire",
    "brand": "Vallejo",
    "hex": "#FF380F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 255,
      "g": 56,
      "b": 15
    },
    "lab": {
      "l": 56.22,
      "a": 71.8,
      "b": 65.07
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-oxford-blue-violet",
    "name": "Oxford Blue Violet",
    "brand": "Vallejo",
    "hex": "#182164",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 24,
      "g": 33,
      "b": 100
    },
    "lab": {
      "l": 16.51,
      "a": 21.65,
      "b": -40.65
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-pale-flesh",
    "name": "Pale Flesh",
    "brand": "Vallejo",
    "hex": "#C78F78",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 199,
      "g": 143,
      "b": 120
    },
    "lab": {
      "l": 64.28,
      "a": 18.29,
      "b": 20.65
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pale-sand-ice",
    "name": "Pale Sand Ice",
    "brand": "Vallejo",
    "hex": "#DEBF80",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 222,
      "g": 191,
      "b": 128
    },
    "lab": {
      "l": 78.67,
      "a": 2.6,
      "b": 35.83
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-parasite-brown",
    "name": "Parasite Brown",
    "brand": "Vallejo",
    "hex": "#532600",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 83,
      "g": 38,
      "b": 0
    },
    "lab": {
      "l": 20.93,
      "a": 18.45,
      "b": 30.38
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-park-green-flat-deep",
    "name": "Park Green Flat Deep",
    "brand": "Vallejo",
    "hex": "#15732E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 21,
      "g": 115,
      "b": 46
    },
    "lab": {
      "l": 42.18,
      "a": -41.87,
      "b": 30.38
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pastel-blue-flat",
    "name": "Pastel Blue Flat",
    "brand": "Vallejo",
    "hex": "#4D85A6",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 77,
      "g": 133,
      "b": 166
    },
    "lab": {
      "l": 53.06,
      "a": -8.82,
      "b": -23.17
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pastel-green-green",
    "name": "Pastel Green Green",
    "brand": "Vallejo",
    "hex": "#7EA15C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 126,
      "g": 161,
      "b": 92
    },
    "lab": {
      "l": 62.25,
      "a": -24.45,
      "b": 32.03
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-pink",
    "name": "Pink",
    "brand": "Vallejo",
    "hex": "#A633B8",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 166,
      "g": 51,
      "b": 184
    },
    "lab": {
      "l": 44.14,
      "a": 63.5,
      "b": -47.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-plague-brown",
    "name": "Plague Brown",
    "brand": "Vallejo",
    "hex": "#774B0F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 119,
      "g": 75,
      "b": 15
    },
    "lab": {
      "l": 35.96,
      "a": 13.71,
      "b": 40.11
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-polished-gold",
    "name": "Polished Gold",
    "brand": "Vallejo",
    "hex": "#E1B218",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 225,
      "g": 178,
      "b": 24
    },
    "lab": {
      "l": 74.77,
      "a": 4.52,
      "b": 74.05
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-prussian-blue-dark",
    "name": "Prussian Blue Dark",
    "brand": "Vallejo",
    "hex": "#152E70",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 21,
      "g": 46,
      "b": 112
    },
    "lab": {
      "l": 21.14,
      "a": 16.81,
      "b": -40.92
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-purple",
    "name": "Purple",
    "brand": "Vallejo",
    "hex": "#2E116A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 46,
      "g": 17,
      "b": 106
    },
    "lab": {
      "l": 15.6,
      "a": 36.65,
      "b": -46.01
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-radiant-yellow",
    "name": "Radiant Yellow",
    "brand": "Vallejo",
    "hex": "#F4DE70",
    "type": "Base",
    "category": "base",
    "family": "Gold",
    "colorFamily": "gold",
    "rgb": {
      "r": 244,
      "g": 222,
      "b": 112
    },
    "lab": {
      "l": 88.28,
      "a": -5.92,
      "b": 55.95
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-red-faded",
    "name": "Red Faded",
    "brand": "Vallejo",
    "hex": "#620B19",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 98,
      "g": 11,
      "b": 25
    },
    "lab": {
      "l": 19.67,
      "a": 37.67,
      "b": 16.99
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-refractive-green",
    "name": "Refractive Green",
    "brand": "Vallejo",
    "hex": "#293D1F",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 41,
      "g": 61,
      "b": 31
    },
    "lab": {
      "l": 23.36,
      "a": -14.69,
      "b": 15.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-rosy-flesh",
    "name": "Rosy Flesh",
    "brand": "Vallejo",
    "hex": "#EB576B",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 235,
      "g": 87,
      "b": 107
    },
    "lab": {
      "l": 57.6,
      "a": 58.46,
      "b": 19.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-royal-blue",
    "name": "Royal Blue",
    "brand": "Vallejo",
    "hex": "#0033BF",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 0,
      "g": 51,
      "b": 191
    },
    "lab": {
      "l": 29.73,
      "a": 43.43,
      "b": -75.35
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-royal-purple",
    "name": "Royal Purple",
    "brand": "Vallejo",
    "hex": "#0A0732",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 10,
      "g": 7,
      "b": 50
    },
    "lab": {
      "l": 4.04,
      "a": 14.42,
      "b": -26.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-royal-purple",
    "name": "Royal Purple",
    "brand": "Vallejo",
    "hex": "#280A4A",
    "type": "Base",
    "category": "base",
    "family": "Purple",
    "colorFamily": "purple",
    "rgb": {
      "r": 40,
      "g": 10,
      "b": 74
    },
    "lab": {
      "l": 10.28,
      "a": 29.64,
      "b": -33.2
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-ruby-red",
    "name": "Ruby Red",
    "brand": "Vallejo",
    "hex": "#D17A6F",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 209,
      "g": 122,
      "b": 111
    },
    "lab": {
      "l": 60.45,
      "a": 32.66,
      "b": 20.72
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-russian-unif-wwii",
    "name": "Russian Unif. WWII",
    "brand": "Vallejo",
    "hex": "#37491C",
    "type": "Base",
    "category": "base",
    "family": "Bone",
    "colorFamily": "bone",
    "rgb": {
      "r": 55,
      "g": 73,
      "b": 28
    },
    "lab": {
      "l": 28.54,
      "a": -15.67,
      "b": 24.28
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-rusty-metal",
    "name": "Rusty Metal",
    "brand": "Vallejo",
    "hex": "#9B7E68",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 155,
      "g": 126,
      "b": 104
    },
    "lab": {
      "l": 54.96,
      "a": 7.86,
      "b": 16.2
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-salmon-rose-german",
    "name": "Salmon Rose German",
    "brand": "Vallejo",
    "hex": "#E67885",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 230,
      "g": 120,
      "b": 133
    },
    "lab": {
      "l": 63.3,
      "a": 43.74,
      "b": 12.56
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-sapphire-blue",
    "name": "Sapphire Blue",
    "brand": "Vallejo",
    "hex": "#4E92C1",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 78,
      "g": 146,
      "b": 193
    },
    "lab": {
      "l": 58.06,
      "a": -7.46,
      "b": -30.86
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scarlet-blood",
    "name": "Scarlet Blood",
    "brand": "Vallejo",
    "hex": "#A7040B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 167,
      "g": 4,
      "b": 11
    },
    "lab": {
      "l": 34.66,
      "a": 57.96,
      "b": 44.38
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-scarlet-dark",
    "name": "Scarlet Dark",
    "brand": "Vallejo",
    "hex": "#C22224",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 194,
      "g": 34,
      "b": 36
    },
    "lab": {
      "l": 42.38,
      "a": 60.6,
      "b": 40.85
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scarlet-red",
    "name": "Scarlet Red",
    "brand": "Vallejo",
    "hex": "#3A001C",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 58,
      "g": 0,
      "b": 28
    },
    "lab": {
      "l": 8.85,
      "a": 29.86,
      "b": -1.47
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scorpy-green",
    "name": "Scorpy Green",
    "brand": "Vallejo",
    "hex": "#319900",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 49,
      "g": 153,
      "b": 0
    },
    "lab": {
      "l": 55.52,
      "a": -52.93,
      "b": 57.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scrofulous-brown",
    "name": "Scrofulous Brown",
    "brand": "Vallejo",
    "hex": "#994902",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 153,
      "g": 73,
      "b": 2
    },
    "lab": {
      "l": 40.48,
      "a": 29.9,
      "b": 49.78
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-scurvy-green",
    "name": "Scurvy Green",
    "brand": "Vallejo",
    "hex": "#062D13",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 6,
      "g": 45,
      "b": 19
    },
    "lab": {
      "l": 15.29,
      "a": -20.72,
      "b": 12.98
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sick-green",
    "name": "Sick Green",
    "brand": "Vallejo",
    "hex": "#235F0E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 35,
      "g": 95,
      "b": 14
    },
    "lab": {
      "l": 35.15,
      "a": -34.83,
      "b": 37.11
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-silver",
    "name": "Silver",
    "brand": "Vallejo",
    "hex": "#A6C4BF",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 166,
      "g": 196,
      "b": 191
    },
    "lab": {
      "l": 76.89,
      "a": -11.07,
      "b": -0.87
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-skin-tone",
    "name": "Skin Tone",
    "brand": "Vallejo",
    "hex": "#F89F6F",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 248,
      "g": 159,
      "b": 111
    },
    "lab": {
      "l": 73.48,
      "a": 28.36,
      "b": 38.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sky-blue-deep",
    "name": "Sky Blue Deep",
    "brand": "Vallejo",
    "hex": "#6DDCD5",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 109,
      "g": 220,
      "b": 213
    },
    "lab": {
      "l": 81.42,
      "a": -33.41,
      "b": -6.32
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sombre-grey",
    "name": "Sombre Grey",
    "brand": "Vallejo",
    "hex": "#1D313E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 29,
      "g": 49,
      "b": 62
    },
    "lab": {
      "l": 19.25,
      "a": -3.74,
      "b": -10.69
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-splinter-green-park",
    "name": "Splinter Green Park",
    "brand": "Vallejo",
    "hex": "#2C6E21",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 44,
      "g": 110,
      "b": 33
    },
    "lab": {
      "l": 40.89,
      "a": -36.75,
      "b": 35.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-squid-pink",
    "name": "Squid Pink",
    "brand": "Vallejo",
    "hex": "#C954E3",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 201,
      "g": 84,
      "b": 227
    },
    "lab": {
      "l": 56.39,
      "a": 66.12,
      "b": -51.96
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-steel-grey",
    "name": "Steel Grey",
    "brand": "Vallejo",
    "hex": "#324E54",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 50,
      "g": 78,
      "b": 84
    },
    "lab": {
      "l": 31.27,
      "a": -8.73,
      "b": -6.88
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-sterling-silver",
    "name": "Sterling Silver",
    "brand": "Vallejo",
    "hex": "#CCD7D5",
    "type": "Base",
    "category": "base",
    "family": "Silver",
    "colorFamily": "silver",
    "rgb": {
      "r": 204,
      "g": 215,
      "b": 213
    },
    "lab": {
      "l": 85.12,
      "a": -4.08,
      "b": -0.3
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-stonewall-grey",
    "name": "Stonewall Grey",
    "brand": "Vallejo",
    "hex": "#454C4C",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 69,
      "g": 76,
      "b": 76
    },
    "lab": {
      "l": 31.71,
      "a": -2.82,
      "b": -0.97
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-succubus-skin",
    "name": "Succubus Skin",
    "brand": "Vallejo",
    "hex": "#562A2E",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 86,
      "g": 42,
      "b": 46
    },
    "lab": {
      "l": 23.11,
      "a": 20.74,
      "b": 6.67
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sun-yellow",
    "name": "Sun Yellow",
    "brand": "Vallejo",
    "hex": "#FF8208",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 255,
      "g": 130,
      "b": 8
    },
    "lab": {
      "l": 67.46,
      "a": 41.9,
      "b": 73.13
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sunny-skin-tone-beige",
    "name": "Sunny Skin Tone Beige",
    "brand": "Vallejo",
    "hex": "#F28538",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 242,
      "g": 133,
      "b": 56
    },
    "lab": {
      "l": 66.48,
      "a": 36.27,
      "b": 57.5
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sunrise-blue",
    "name": "Sunrise Blue",
    "brand": "Vallejo",
    "hex": "#65BDE1",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 101,
      "g": 189,
      "b": 225
    },
    "lab": {
      "l": 72.62,
      "a": -16.43,
      "b": -26.05
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-sunset-orange",
    "name": "Sunset Orange",
    "brand": "Vallejo",
    "hex": "#FF6B26",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 255,
      "g": 107,
      "b": 38
    },
    "lab": {
      "l": 63.28,
      "a": 53.26,
      "b": 62.63
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-sunset-red",
    "name": "Sunset Red",
    "brand": "Vallejo",
    "hex": "#BD0D62",
    "type": "Base",
    "category": "base",
    "family": "Pink",
    "colorFamily": "pink",
    "rgb": {
      "r": 189,
      "g": 13,
      "b": 98
    },
    "lab": {
      "l": 41.2,
      "a": 66.53,
      "b": 1.06
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-tan",
    "name": "Tan",
    "brand": "Vallejo",
    "hex": "#623733",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 98,
      "g": 55,
      "b": 51
    },
    "lab": {
      "l": 28.3,
      "a": 18.66,
      "b": 10.8
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-tank-crew",
    "name": "Tank Crew",
    "brand": "Vallejo",
    "hex": "#363D2E",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 54,
      "g": 61,
      "b": 46
    },
    "lab": {
      "l": 24.7,
      "a": -6.23,
      "b": 8.3
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-tinny-tin",
    "name": "Tinny Tin",
    "brand": "Vallejo",
    "hex": "#361905",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 54,
      "g": 25,
      "b": 5
    },
    "lab": {
      "l": 12.55,
      "a": 12.56,
      "b": 16.9
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-toxic-yellow",
    "name": "Toxic Yellow",
    "brand": "Vallejo",
    "hex": "#D9CC26",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 217,
      "g": 204,
      "b": 38
    },
    "lab": {
      "l": 80.78,
      "a": -12.04,
      "b": 75.5
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-turquoise",
    "name": "Turquoise",
    "brand": "Vallejo",
    "hex": "#003D3A",
    "type": "Base",
    "category": "base",
    "family": "Cyan",
    "colorFamily": "cyan",
    "rgb": {
      "r": 0,
      "g": 61,
      "b": 58
    },
    "lab": {
      "l": 22.45,
      "a": -18.41,
      "b": -3.24
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-true-metallic-ultramarine-blue",
    "name": "Ultramarine Blue",
    "brand": "Vallejo",
    "hex": "#657EA0",
    "type": "Base",
    "category": "base",
    "family": "Bronze",
    "colorFamily": "bronze",
    "rgb": {
      "r": 101,
      "g": 126,
      "b": 160
    },
    "lab": {
      "l": 52.09,
      "a": -0.27,
      "b": -21.08
    },
    "finish": "metallic",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-ultramarine-blue",
    "name": "Ultramarine Blue",
    "brand": "Vallejo",
    "hex": "#07165A",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 7,
      "g": 22,
      "b": 90
    },
    "lab": {
      "l": 11.67,
      "a": 23.65,
      "b": -41.97
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-umber-german",
    "name": "Umber German",
    "brand": "Vallejo",
    "hex": "#332724",
    "type": "Base",
    "category": "base",
    "family": "Brown",
    "colorFamily": "brown",
    "rgb": {
      "r": 51,
      "g": 39,
      "b": 36
    },
    "lab": {
      "l": 16.9,
      "a": 5.05,
      "b": 4.12
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-us-dark-green",
    "name": "US Dark Green",
    "brand": "Vallejo",
    "hex": "#2E3D25",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 46,
      "g": 61,
      "b": 37
    },
    "lab": {
      "l": 23.84,
      "a": -11.48,
      "b": 12.87
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-verdigris",
    "name": "Verdigris",
    "brand": "Vallejo",
    "hex": "#7AFF94",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 122,
      "g": 255,
      "b": 148
    },
    "lab": {
      "l": 90.68,
      "a": -58.58,
      "b": 40.18
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-vermilion-carmine",
    "name": "Vermilion Carmine",
    "brand": "Vallejo",
    "hex": "#C80C1B",
    "type": "Base",
    "category": "base",
    "family": "Red",
    "colorFamily": "red",
    "rgb": {
      "r": 200,
      "g": 12,
      "b": 27
    },
    "lab": {
      "l": 42.19,
      "a": 65.86,
      "b": 45.84
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-violet-black",
    "name": "Violet Black",
    "brand": "Vallejo",
    "hex": "#150D5E",
    "type": "Base",
    "category": "base",
    "family": "Blue",
    "colorFamily": "blue",
    "rgb": {
      "r": 21,
      "g": 13,
      "b": 94
    },
    "lab": {
      "l": 10.96,
      "a": 31.96,
      "b": -45.81
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-violet-red",
    "name": "Violet Red",
    "brand": "Vallejo",
    "hex": "#441D3F",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 68,
      "g": 29,
      "b": 63
    },
    "lab": {
      "l": 17.77,
      "a": 24.22,
      "b": -13.31
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-warlord-purple",
    "name": "Warlord Purple",
    "brand": "Vallejo",
    "hex": "#630049",
    "type": "Base",
    "category": "base",
    "family": "Magenta",
    "colorFamily": "magenta",
    "rgb": {
      "r": 99,
      "g": 0,
      "b": 73
    },
    "lab": {
      "l": 20.57,
      "a": 45.22,
      "b": -15.4
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-warm-grey",
    "name": "Warm Grey",
    "brand": "Vallejo",
    "hex": "#65565A",
    "type": "Base",
    "category": "base",
    "family": "Grey",
    "colorFamily": "grey",
    "rgb": {
      "r": 101,
      "g": 86,
      "b": 90
    },
    "lab": {
      "l": 38.13,
      "a": 6.9,
      "b": -0.04
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-wash-white",
    "name": "White",
    "brand": "Vallejo",
    "hex": "#FFFFFF",
    "type": "Shade",
    "category": "wash",
    "family": "White",
    "colorFamily": "white",
    "rgb": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "lab": {
      "l": 100,
      "a": 0,
      "b": 0
    },
    "finish": "matte",
    "transparency": 0.85,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-game-color-wolf-grey",
    "name": "Wolf Grey",
    "brand": "Vallejo",
    "hex": "#87CCBF",
    "type": "Base",
    "category": "base",
    "family": "Green",
    "colorFamily": "green",
    "rgb": {
      "r": 135,
      "g": 204,
      "b": 191
    },
    "lab": {
      "l": 77.34,
      "a": -24.57,
      "b": -0.43
    },
    "finish": "matte",
    "transparency": 0,
    "matchable": true,
    "aliases": []
  },
  {
    "paint_id": "vallejo-model-color-yellow-green",
    "name": "Yellow Green",
    "brand": "Vallejo",
    "hex": "#CCFF19",
    "type": "Base",
    "category": "base",
    "family": "Yellow",
    "colorFamily": "yellow",
    "rgb": {
      "r": 204,
      "g": 255,
      "b": 25
    },
    "lab": {
      "l": 93.64,
      "a": -41.66,
      "b": 88.06
    },
    "finish": "matte",
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
  totalPaints: 780,
  brands: ["Army Painter","Citadel","Scale75","Vallejo"],
  types: ["Air","Base","Layer","Shade"],
  families: ["Black","Blue","Bone","Bronze","Brown","Copper","Cyan","Flesh","Gold","Green","Grey","Magenta","Orange","Pink","Purple","Red","Silver","White","Yellow"],
  generatedAt: '2026-06-17T20:14:03.278Z',
};
