"""Dataslate content emitter — fully curated, deterministic, offline.

Generates schemestealer-react/lib/data/dataslate_content.json (committed, never
hand-edited). Every quote carries a structured attribution the UI renders as its
own line. No scraping, no template permutations: the previous version padded 52
real tips with 350 clones of one sentence template, which is exactly the
repetition players noticed.
"""

import json
import os

OUTPUT_FILE = os.path.join(
    os.path.dirname(__file__), '../../schemestealer-react/lib/data/dataslate_content.json'
)

MAX_TEXT_LEN = 220
MIN_TIPS = 80
MIN_QUOTES = 60


PAINTING_TIPS: list[str] = [
    # --- Fundamentals ---
    "Thin your paints to the consistency of melted ice cream.",
    "Two thin coats beat one thick coat every single time — detail survives, brushstrokes vanish.",
    "Always let washes dry completely. Moving wet wash around will create nasty tide marks.",
    "Use a wet palette to keep your paints workable for hours and naturally thin them.",
    "When edge highlighting, use the side of your brush rather than the tip for a much cleaner, consistent line.",
    "A zenithal prime (black all over, white from above) helps you visualise light volumes before you even apply colour.",
    "Clean your mould lines before priming. A great paint job on a miniature with prominent mould lines will always look unfinished.",
    "Don't overload your brush. The belly of the brush should hold the paint, but the ferrule (metal part) should stay clean.",
    "When applying washes, use a clean, damp brush to wick away excess wash from flat surfaces where it shouldn't pool.",
    "Paint from the inside out — start with skin or recessed areas, then move outward to clothing, and finally armour.",
    "Always drag your brush towards the area where you want the most pigment to settle.",
    "If you make a mistake, don't try to wipe it off. Let it dry, then paint over it. Smudging wet paint ruins a larger area.",
    "When mixing paints, pull from the edges of your paint drops rather than mixing the whole puddle. This gives you a gradient to work with.",
    "Prime in thin passes from several angles. One heavy blast of primer fills the detail you paid for.",
    "Shake your paints properly — an agitator ball (or a clean nut) in the pot mixes medium and pigment far better than a quick rattle.",
    "Paint what the light touches. Decide where your light source is before the first highlight, and every choice afterwards gets easier.",
    # --- Steady hands & ergonomics ---
    "Keep your elbows planted on the table to stabilise your hands when painting fine details.",
    "Bracing your wrists together helps eliminate hand tremors while painting fine details like eyes.",
    "Breathe out slowly as you paint a fine line — the steadiest moment is the bottom of your exhale.",
    "Keep your posture in mind while painting to avoid back pain. Raise your miniature to your eye level, not your head to the miniature.",
    "Paint in daylight-balanced light (around 5000K). Warm bulbs shift every colour you mix and you'll only see it the next morning.",
    "A piece of blu-tack on top of an old pill bottle makes a perfectly functional painting handle.",
    "Take a break every 45 minutes. Your eyes flatten out contrast as they tire, and your highlights creep brighter to compensate.",
    # --- Washes, shades & recesses ---
    "A simple black wash over silver metallics instantly gives them depth and a battle-worn look.",
    "Pin washing (applying wash only to the recesses) keeps flat panels clean while still adding depth.",
    "Washes darken your base colour. If you want a specific final shade, start with a base colour one shade lighter.",
    "Adding a tiny amount of dish soap to your water makes washes flow into recesses better.",
    "Gloss varnish before an oil or enamel wash — the smooth surface pulls the wash into recesses and cleans up flawlessly.",
    "A targeted second wash in only the deepest recesses doubles the depth without dirtying the whole model.",
    # --- Highlights & blending ---
    "For smooth power sword blends, try wet blending directly on the model or glazing thin layers.",
    "Drybrushing isn't just for beginners. Using a soft makeup brush instead of a stiff drybrush gives incredible, smooth blends.",
    "When glazing, wipe most of the paint off your brush on a paper towel first so it doesn't flood the model.",
    "Layer towards a warm off-white rather than pure white — pure white highlights look chalky on almost every colour.",
    "Where two edges meet, place a tiny brighter dot. Corner highlights sell the light more than the lines themselves.",
    "Glazes fix chalky blends: a thin layer of the mid-tone melts rough transitions back together.",
    "Stipple the transition zone between two colours with a sponge for effortless texture blending on large armour panels.",
    "Highlight cloth along the folds, not the edges — cloth catches light on ridges, armour catches it on rims.",
    # --- Colour theory ---
    "Use a colour wheel to find contrasting colours (opposites) to make your models pop.",
    "Pick one saturated focal colour and keep everything else muted — the eye goes exactly where you want it.",
    "Shadows aren't just darker: shift them cooler (add blue or purple) and your shading gains instant realism.",
    "Warm colours advance, cool colours recede. Put warmth on the focal point and coolness on the supporting areas.",
    "Add the tiniest touch of your armour colour into the skin mix (and vice versa) — shared pigment ties a scheme together.",
    "Desaturate distant details on display bases. High saturation everywhere flattens the whole composition.",
    # --- Metallics & NMM ---
    "When using metallic paints, dedicated metallic brushes are a good idea as metallic flakes can ruin your best sable brushes.",
    "Keep a separate water pot for metallic paints so you don't get glitter on your non-metallic surfaces.",
    "Use contrast paints or speedpaints over a metallic basecoat for an amazing coloured metallic effect (candy coating).",
    "For rusty metal, try sponging on orange and brown over a dark metallic base.",
    "Starting NMM? Paint the metal as if it were grey cloth first, then push the contrast twice as far as feels comfortable.",
    "NMM gold is browns and yellows with an almost-white spark — if it reads as yellow paint, deepen the shadows, don't brighten the light.",
    "Thin metallics with metallic medium instead of water — the flakes stay in suspension and coverage stays even.",
    # --- Faces & details ---
    "When painting eyes, paint the eye socket black, add two dots of white on either side of the centre, rather than painting white and adding a dot.",
    "When painting faces, remember that men's faces generally have more angular highlights, while women's are softer.",
    "If eyes keep going wrong, paint a dark recess shadow and leave them — a clean shadow reads better than a wonky pupil at arm's length.",
    "Paint the face first. It's the focal point, and a mistake is far easier to fix before the rest of the model is finished.",
    "Lips are never red — mix a touch of the skin tone into any lip colour to keep faces natural.",
    "To paint realistic bone, start with a dark brown, layer up to a bone colour, wash with sepia, then highlight with white.",
    "For glowing plasma coils, start with white in the recesses and glaze your glowing colour over top.",
    "For OSL (object-source lighting), the glow must be the brightest thing on the model — dim everything nearby or the effect dies.",
    "Freehand starts with a pencil: sketch the design lightly on the painted surface first, then trace it with thinned paint.",
    "Micro-set and Micro-sol are essential for getting decals to sit perfectly flat on curved shoulder pads.",
    "Paint gems dark-to-light towards one corner, then a white dot in the opposite corner — instant convincing gemstone.",
    # --- Weathering & effects ---
    "Stippling is a great way to add texture to leather, cloaks, and rusty armour.",
    "If you want realistic blood effects, mix some black or brown into your red paint to simulate oxidised blood.",
    "Sponge chipping looks best in two layers: a light scratch colour, then a smaller dark centre inside the biggest chips.",
    "Weather from the ground up — dust and mud belong on boots and hems, not shoulders. Gravity tells the story.",
    "A brown pin wash around rivets and bolts suggests years of grime with thirty seconds of work.",
    "Chipped edges read as battle-worn; chipped flat panels read as sloppy. Keep damage where wear would really happen.",
    # --- Basing ---
    "Painting the rim of your bases black or a dark neutral colour frames the miniature perfectly.",
    "Using cork sheets broken into pieces makes excellent, realistic rocky bases.",
    "Texture paste for bases should be applied before priming to help it stick better.",
    "Finish the base before you call the model done — an unpainted base makes a masterpiece look like a test model.",
    "Tufts and flock go on AFTER varnish, or the matte coat will grey them out.",
    "Base colours should contrast the model: mud under bright armour, pale stone under dark schemes.",
    # --- Brush care & tools ---
    "Don't lick your brush to point it. Use a damp sponge or your palette instead.",
    "Save your old, ruined brushes for drybrushing, stippling, and applying messy basing materials.",
    "Brush soap once a week keeps a sable brush pointing for years. Rinse until the water runs clean, then reshape the tip.",
    "Never leave a brush standing in the water pot — bent bristles never fully recover.",
    "Drill your gun barrels! A tiny pin vise hole makes weapons look 100x better.",
    "Use a hair dryer on a low, cool setting to speed up the drying time of washes and basecoats.",
    "If your paint is chalky, you might be over-thinning it with water. Try using a flow improver or lahmian medium.",
    "Keep a scrap of textured plasticard by the palette to test each loaded brush before it touches the model.",
    # --- Varnish & finishing ---
    "Varnish your finished miniatures. Matte varnish for cloth and armour, gloss varnish for gems, lenses, and blood.",
    "If matte varnish frosts, don't panic: a coat of gloss varnish usually clears it, then re-matte in a drier room.",
    "Varnish in thin coats in low humidity — moisture trapped under varnish is what causes clouding.",
    "Satin varnish is the secret all-rounder: tougher than matte, subtler than gloss, great for gaming pieces.",
    # --- Workflow & mindset ---
    "Always test your colour schemes on a spare bit or a cheap model before committing to a whole unit.",
    "Take photos of your miniatures. The camera will reveal flaws your eyes missed, helping you improve.",
    "Batch paint in threes — enough to build momentum, not enough to feel like a production line.",
    "Do every step on every model in the batch before moving on — switching colours less often is where batch speed comes from.",
    "If you get burnt out, switch to a completely different model or a piece of terrain to refresh your motivation.",
    "Paint bravely. You can always strip a model if you truly hate the result.",
    "If you drop a part, don't look at the floor. Listen to where it lands, then search in a grid pattern.",
    "Three feet or three inches: decide whether a model is for the tabletop or the cabinet before you start, and paint to that standard.",
    "Finished beats perfect. A completed squad on the table teaches you more than a year-old half-painted hero in a drawer.",
    "Compare your work to your own last model, not to a professional's — progress is the only fair benchmark.",
    "Keep a painting log of the recipes you used. Future you, adding one more squad in eight months, will be grateful.",
    "Set a 20-minute timer when motivation is low. Starting is the hard part; the timer usually loses.",
    "Remember, painted models roll better.",
]


# Every quote is attributed — either a named character or a canonical in-universe
# source. Rendered by the UI as: "text" / — attribution
QUOTES_40K: list[dict] = [
    {"text": "Only in death does duty end.", "attribution": "Imperial Thought for the Day"},
    {"text": "Blessed is the mind too small for doubt.", "attribution": "Imperial Thought for the Day"},
    {"text": "Hope is the first step on the road to disappointment.", "attribution": "Librarian Isador Akios"},
    {"text": "Innocence proves nothing.", "attribution": "Imperial Thought for the Day"},
    {"text": "A suspicious mind is a healthy mind.", "attribution": "Imperial Thought for the Day"},
    {"text": "An open mind is like a fortress with its gates unbarred and unguarded.", "attribution": "Imperial Thought for the Day"},
    {"text": "Knowledge is power, guard it well.", "attribution": "Motto of the Blood Ravens"},
    {"text": "Burn the heretic. Kill the mutant. Purge the unclean.", "attribution": "Imperial Thought for the Day"},
    {"text": "Success is commemorated; failure merely remembered.", "attribution": "Imperial Thought for the Day"},
    {"text": "Pain is an illusion of the senses, despair an illusion of the mind.", "attribution": "Cato Sicarius"},
    {"text": "To admit defeat is to blaspheme against the Emperor.", "attribution": "Imperial Thought for the Day"},
    {"text": "Even a man who has nothing can still offer his life.", "attribution": "Imperial Thought for the Day"},
    {"text": "It is better to die for the Emperor than to live for yourself.", "attribution": "Imperial Thought for the Day"},
    {"text": "Courage is the Emperor's gift: repay him with victory.", "attribution": "Imperial Thought for the Day"},
    {"text": "Walk softly, and carry a big gun.", "attribution": "Imperial Guard proverb"},
    {"text": "The Emperor protects, but a loaded bolter never hurts.", "attribution": "Imperial Guard proverb"},
    {"text": "Heresy grows from idleness.", "attribution": "Imperial Thought for the Day"},
    {"text": "A small mind is easily filled with faith.", "attribution": "Imperial Thought for the Day"},
    {"text": "Faith without deeds is worthless.", "attribution": "Ecclesiarchy catechism"},
    {"text": "Ruthlessness is the kindness of the wise.", "attribution": "Imperial Thought for the Day"},
    {"text": "There is no such thing as innocence, only degrees of guilt.", "attribution": "Imperial Thought for the Day"},
    {"text": "Serve the Emperor today, for tomorrow you may be dead.", "attribution": "Imperial Thought for the Day"},
    {"text": "Into the fires of battle, unto the anvil of war!", "attribution": "Battle-cry of the Salamanders"},
    {"text": "By the blood of Sanguinius!", "attribution": "Battle-cry of the Blood Angels"},
    {"text": "For Russ and the Allfather!", "attribution": "Battle-cry of the Space Wolves"},
    {"text": "Iron within, iron without!", "attribution": "Battle-cry of the Iron Warriors"},
    {"text": "Victorus aut Mortis!", "attribution": "Battle-cry of the Ultramarines"},
    {"text": "We are the hammer!", "attribution": "Battle-cry of the Grey Knights"},
    {"text": "No pity! No remorse! No fear!", "attribution": "Battle-cry of the Black Templars"},
    {"text": "For the Greater Good.", "attribution": "Creed of the T'au Empire"},
    {"text": "Death to the False Emperor!", "attribution": "War-cry of the Traitor Legions"},
    {"text": "Let the galaxy burn!", "attribution": "Horus Lupercal"},
    {"text": "All is dust.", "attribution": "Ahzek Ahriman"},
    {"text": "Blood for the Blood God! Skulls for the Skull Throne!", "attribution": "Chant of the Khorne Berzerkers"},
    {"text": "We have come for you.", "attribution": "Night Lords vox-broadcast"},
    {"text": "Hydra Dominatus.", "attribution": "Motto of the Alpha Legion"},
    {"text": "The flesh is weak.", "attribution": "Credo of the Adeptus Mechanicus"},
    {"text": "From the moment I understood the weakness of my flesh, it disgusted me.", "attribution": "Magos Dominus Faustinius"},
    {"text": "There is no truth in flesh, only betrayal.", "attribution": "Credo of the Adeptus Mechanicus"},
    {"text": "Knowledge is power. Hide it well.", "attribution": "Credo of the Alpha Legion"},
    {"text": "WAAAGH!", "attribution": "Every Ork, everywhere"},
    {"text": "Orks is never beaten in battle. If we win, we win. If we die, we die fightin' so it don't count.", "attribution": "Ork philosophy"},
    {"text": "I have dug my grave in this place and I will either triumph or I will die!", "attribution": "Commissar Yarrick"},
    {"text": "Fear denies faith.", "attribution": "Motto of the Black Templars"},
    {"text": "The dead know only one thing: it is better to be alive... they are wrong.", "attribution": "Necron epigram"},
]

QUOTES_FANTASY: list[dict] = [
    {"text": "Summon the Elector Counts!", "attribution": "Emperor Karl Franz"},
    {"text": "I am Franz, they will obey.", "attribution": "Emperor Karl Franz"},
    {"text": "This action does not have my consent!", "attribution": "Emperor Karl Franz"},
    {"text": "Sigmar protects.", "attribution": "Creed of the Empire"},
    {"text": "Welcome to Estalia, gentlemen. I will not lie: the chances of your survival are small.", "attribution": "Balthasar Gelt"},
    {"text": "Taste gold magic!", "attribution": "Balthasar Gelt"},
    {"text": "The End Times approach.", "attribution": "Archaon the Everchosen"},
    {"text": "No peace, just war!", "attribution": "Archaon the Everchosen"},
    {"text": "That's going in the Great Book of Grudges!", "attribution": "Thorgrim Grudgebearer"},
    {"text": "They have wronged us!", "attribution": "Thorgrim Grudgebearer"},
    {"text": "The Dawi do not forget, and the Dawi do not forgive.", "attribution": "Dwarfen proverb"},
    {"text": "Khazalid will never die, so long as there is one Dwarf left to speak it.", "attribution": "Dwarfen proverb"},
    {"text": "A grudge unavenged is a grudge doubled.", "attribution": "Book of Grudges"},
    {"text": "Manling, you talk too much.", "attribution": "Gotrek Gurnisson"},
    {"text": "A mighty doom awaits us!", "attribution": "Gotrek Gurnisson"},
    {"text": "Slay everything without a beard!", "attribution": "Gotrek Gurnisson"},
    {"text": "Charge, for Bretonnia and the Lady!", "attribution": "Louen Leoncoeur"},
    {"text": "For the Lady of the Lake!", "attribution": "Vow of the Grail Knights"},
    {"text": "The Green Knight protects Bretonnia.", "attribution": "Bretonnian legend"},
    {"text": "WAAAGH! Stomp 'em flat!", "attribution": "Grimgor Ironhide"},
    {"text": "We'z gonna stomp 'em!", "attribution": "Orc Warboss"},
    {"text": "More warpstone, yes-yes!", "attribution": "Warlock Engineer of Clan Skryre"},
    {"text": "Kill-kill the man-things!", "attribution": "Skaven Warlord"},
    {"text": "For the Horned Rat!", "attribution": "Grey Seer of the Council of Thirteen"},
    {"text": "Queek wants more heads for his trophy rack!", "attribution": "Queek Headtaker"},
    {"text": "The greatest inventor-genius of all Skavendom, yes-yes!", "attribution": "Ikit Claw"},
    {"text": "Settra does not serve... Settra RULES!", "attribution": "Settra the Imperishable"},
    {"text": "Death is only the beginning.", "attribution": "Settra the Imperishable"},
    {"text": "The Tomb Kings awaken, and the desert marches with them.", "attribution": "Liber Necris"},
    {"text": "Vampires are the true lords of this world.", "attribution": "Vlad von Carstein"},
    {"text": "Nagash was weak! Witness true power!", "attribution": "Mannfred von Carstein"},
    {"text": "Such is the power of Nagash!", "attribution": "Nagash, Supreme Lord of the Undead"},
    {"text": "The dead shall rise, and the world will fall.", "attribution": "Liber Necris"},
    {"text": "Ulthuan shall never fall!", "attribution": "Tyrion, Defender of Ulthuan"},
    {"text": "Magic is the true power of this world.", "attribution": "Teclis, High Loremaster"},
    {"text": "The Phoenix King commands.", "attribution": "Finubar the Seafarer"},
    {"text": "Malekith is the true Phoenix King!", "attribution": "Creed of the Druchii"},
    {"text": "Pleasure in all things.", "attribution": "Champion of Slaanesh"},
    {"text": "Change is the only constant.", "attribution": "Sorcerer of Tzeentch"},
    {"text": "Disease and decay are the only certainties.", "attribution": "Champion of Nurgle"},
    {"text": "Blood for the Blood God!", "attribution": "Champion of Khorne"},
    {"text": "The White Dwarf watches over us all.", "attribution": "Dwarfen legend of Grombrindal"},
]


def validate(tips: list[str], quotes: list[dict]) -> None:
    all_texts = tips + [q["text"] for q in quotes]
    dupes = {t for t in all_texts if all_texts.count(t) > 1}
    if dupes:
        raise SystemExit(f"FATAL: duplicate texts: {sorted(dupes)[:5]}")
    too_long = [t for t in all_texts if len(t) > MAX_TEXT_LEN]
    if too_long:
        raise SystemExit(f"FATAL: {len(too_long)} entries over {MAX_TEXT_LEN} chars: {too_long[:3]}")
    unattributed = [q["text"] for q in quotes if not q.get("attribution", "").strip()]
    if unattributed:
        raise SystemExit(f"FATAL: unattributed quotes: {unattributed[:5]}")
    if len(tips) < MIN_TIPS:
        raise SystemExit(f"FATAL: only {len(tips)} tips (need >= {MIN_TIPS})")
    if len(quotes) < MIN_QUOTES:
        raise SystemExit(f"FATAL: only {len(quotes)} quotes (need >= {MIN_QUOTES})")


def main() -> None:
    quotes = QUOTES_40K + QUOTES_FANTASY
    validate(PAINTING_TIPS, quotes)

    data = {
        "painting_tips": PAINTING_TIPS,
        "lore_quotes": quotes,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"Wrote {len(PAINTING_TIPS)} painting tips and {len(quotes)} attributed quotes")
    print(f"({len(QUOTES_40K)} W40K + {len(QUOTES_FANTASY)} Fantasy) to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
