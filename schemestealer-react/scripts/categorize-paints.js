const fs = require('fs');
const path = require('path');

// Load current paints
const paintsPath = path.join(__dirname, '../public/data/paints.json');
const paints = JSON.parse(fs.readFileSync(paintsPath, 'utf8'));

// Categorization logic
function categorizePaint(paint) {
  const name = paint.name.toLowerCase();

  // If already a wash, mark as shade
  if (paint.type === 'wash') {
    return { ...paint, type: 'shade', category: 'shade' };
  }

  // Base paint patterns (darkest colors)
  const basePatterns = [
    'abaddon', 'black', 'rhinox', 'dryad bark', 'caliban', 'naggaroth',
    'kantor', 'khorne', 'doombull', 'the fang', 'xereus', 'incubi',
    'dark reaper', 'death guard', 'catachan', 'castellan', 'corax',
    'death world', 'balthasar', 'leadbelcher', 'retributor',
    'dark', 'deep', 'charred', 'chaotic', 'base',
    // Vallejo patterns
    'black grey', 'german grey', 'dark sea', 'dark prussian',
    // Army Painter patterns
    'matt black', 'monster brown', 'crusted sore'
  ];

  // Highlight patterns (brightest colors)
  const highlightPatterns = [
    'white', 'flash gitz', 'fenrisian', 'ulthuan', 'administratum',
    'runefang', 'stormhost', 'kislev', 'ushabti', 'pallid',
    'screaming', 'dorn', 'yriel', 'fire dragon',
    'light', 'bright', 'shining', 'crystal', 'angel', 'babe',
    'blazing', 'wild rider', 'dechala', 'lugganath',
    // Vallejo patterns
    'white', 'sky', 'ice', 'light grey',
    // Army Painter patterns
    'matte white', 'ash grey', 'electric blue', 'pure red'
  ];

  // Shade patterns (washes and inks)
  const shadePatterns = [
    'shade', 'wash', 'oil', 'ink', 'gloss', 'glaze',
    'nuln', 'agrax', 'seraphim', 'reikland', 'carroburg',
    'druchii', 'biel-tan', 'athonian', 'casandora', 'fuegan',
    'coelia', 'drakenhof', 'earthshade'
  ];

  // Check for shade first (highest priority)
  if (shadePatterns.some(pattern => name.includes(pattern))) {
    return { ...paint, type: 'shade', category: 'shade' };
  }

  // Check for base
  if (basePatterns.some(pattern => name.includes(pattern))) {
    return { ...paint, type: 'base', category: 'paint' };
  }

  // Check for highlight
  if (highlightPatterns.some(pattern => name.includes(pattern))) {
    return { ...paint, type: 'highlight', category: 'paint' };
  }

  // Everything else is layer (mid-tone)
  return { ...paint, type: 'layer', category: 'paint' };
}

// Categorize all paints
const categorized = paints.map(categorizePaint);

// Save updated paints.json
fs.writeFileSync(
  paintsPath,
  JSON.stringify(categorized, null, 2)
);

// Print statistics
const stats = {
  base: categorized.filter(p => p.type === 'base').length,
  layer: categorized.filter(p => p.type === 'layer').length,
  shade: categorized.filter(p => p.type === 'shade').length,
  highlight: categorized.filter(p => p.type === 'highlight').length,
};

console.log('✓ Paints categorized successfully!');
console.log('=================================');
console.log(`Base:      ${stats.base} paints`);
console.log(`Layer:     ${stats.layer} paints`);
console.log(`Highlight: ${stats.highlight} paints`);
console.log(`Shade:     ${stats.shade} paints`);
console.log(`Total:     ${categorized.length} paints`);
console.log('=================================');

// Show some examples from each category
console.log('\nExample categorizations:');
console.log('\nBase paints:');
categorized.filter(p => p.type === 'base').slice(0, 5).forEach(p => {
  console.log(`  - ${p.name} (${p.brand})`);
});

console.log('\nLayer paints:');
categorized.filter(p => p.type === 'layer').slice(0, 5).forEach(p => {
  console.log(`  - ${p.name} (${p.brand})`);
});

console.log('\nHighlight paints:');
categorized.filter(p => p.type === 'highlight').slice(0, 5).forEach(p => {
  console.log(`  - ${p.name} (${p.brand})`);
});

console.log('\nShade paints:');
categorized.filter(p => p.type === 'shade').slice(0, 5).forEach(p => {
  console.log(`  - ${p.name} (${p.brand})`);
});
