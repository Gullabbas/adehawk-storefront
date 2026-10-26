const fs = require('fs');
const path = require('path');

const targetPhrases = [
  'British workshop',
  'Guaranteed quality',
  'Timeless British silhouette',
  'English Bridle',
  'Full-grain pull-up leather',
  'Solid 4mm hide',
  'Develops rich patina and amber tones',
  'Great Britain',
  'English bridle',
  'English Belts'
];

const findings = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'docs'].includes(entry.name)) continue;
      scanDir(fullPath);
    } else if (/\.(tsx|ts|json)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const phrase of targetPhrases) {
        if (content.toLowerCase().includes(phrase.toLowerCase())) {
          findings.push({ phrase, file: fullPath });
        }
      }
    }
  }
}

scanDir('.');
console.table(findings);
