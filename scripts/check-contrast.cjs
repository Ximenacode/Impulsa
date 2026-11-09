// Auditoría numérica de contraste: valores leídos de los tokens CSS actuales.
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.resolve(__dirname, '../src/impulsa/impulsa.css'), 'utf8');
const colors = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[a-f\d]{6}|#[a-f\d]{3})\b/gi)].map(m => [m[1], m[2]]));
const luminance = hex => {
  const normalized = hex.length === 4 ? '#' + hex.slice(1).split('').map(c => c + c).join('') : hex;
  const rgb = normalized.slice(1).match(/../g).map(s => parseInt(s, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const pairs = [
  ['Texto principal / superficie', colors.ink, colors.surface, 4.5],
  ['Texto secundario / fondo', colors.muted, colors.canvas, 4.5],
  ['Texto secundario / superficie', colors.muted, colors.surface, 4.5],
  ['Texto de acción / carbón', colors['action-ink'], colors.primary, 4.5],
  ['Texto de acción hover / carbón suave', colors.surface, colors['primary-hover'], 4.5],
  ['Texto de navegación activa / carbón', colors.surface, colors.nav, 4.5],
  ['Texto activo / salvia suave', colors.focus, colors.soft, 4.5],
  ['Error / fondo de error', colors.danger, colors['danger-soft'], 4.5],
  ['Foco / fondo', colors.focus, colors.canvas, 3],
  ['Borde de campo / superficie', colors['control-border'], colors.surface, 3],
  ['Barras / superficie', colors.bar, colors.surface, 3],
];
const results = pairs.map(([label, foreground, background, minimum]) => {
  const a = luminance(foreground), b = luminance(background);
  const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  return { label, foreground, background, ratio: Number(ratio.toFixed(2)), minimum, passed: ratio >= minimum };
});
const report = { method: 'Luminancia relativa sRGB; texto 4.5:1 y elementos gráficos/foco 3:1', results, passed: results.every(r => r.passed) };
fs.writeFileSync(path.resolve(__dirname, '../docs/contraste.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
