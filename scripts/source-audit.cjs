const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../src');
const seen = new Set();
function visit(file) {
  if (seen.has(file)) return;
  seen.add(file);
  for (const imported of ts.preProcessFile(fs.readFileSync(file, 'utf8')).importedFiles.filter(i => i.fileName.startsWith('.'))) {
    const base = path.resolve(path.dirname(file), imported.fileName);
    const found = [base, base + '.tsx', base + '.ts', base + '.js', base + '.css', path.join(base, 'index.tsx'), path.join(base, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (found) visit(found);
  }
}
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
visit(path.join(root, 'index.tsx'));
console.log(JSON.stringify({ reachable: [...seen].map(p => path.relative(root, p)), unused: walk(root).filter(p => !seen.has(p)).map(p => path.relative(root, p)) }, null, 2));
