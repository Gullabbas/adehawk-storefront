const fs = require('fs');

let content = fs.readFileSync('data/products.json', 'utf8');

content = content.replace(/English Bridle/g, 'Genuine');
content = content.replace(/English bridle/g, 'genuine');
content = content.replace(/Handcrafted in UK Workshop/g, 'Handcrafted');
content = content.replace(/Handcrafted in UK/g, 'Handcrafted');
content = content.replace(/British/g, 'Artisan');

fs.writeFileSync('data/products.json', content);
console.log('Cleaned products.json of unverified claims!');
