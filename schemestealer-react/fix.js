const fs = require('fs');
const files = [
  'components/ForgeBackground.tsx',
  'components/shared/AdMechBackground.tsx',
  'components/shared/CosmicBackground.tsx',
  'components/miniscan/ScanReveal.tsx'
];

files.forEach(f => {
  let data = fs.readFileSync(f, 'utf8');
  // replace \` with `
  data = data.replace(/\\`/g, '`');
  // replace \$ with $
  data = data.replace(/\\\$/g, '$');
  fs.writeFileSync(f, data);
  console.log('Fixed', f);
});
