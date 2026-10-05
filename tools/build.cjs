// Publish only customer-facing assets. The offline gift helper stays in the repository.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
fs.mkdirSync(output, { recursive: true });
const files = fs.readdirSync(root).filter(name => /\.(html|css|js)$/.test(name) && name !== 'gift-admin.html');
files.push('robots.txt', 'sitemap.xml', 'ads.txt', '_redirects');
for (const file of files) fs.copyFileSync(path.join(root, file), path.join(output, file));
fs.cpSync(path.join(root, 'images'), path.join(output, 'images'), { recursive: true });
console.log(`Built ${files.length} public files and images into dist.`);
