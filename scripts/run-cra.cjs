// CRA 4 usa Webpack 4: compatibilidad con Node moderno, limitada al proceso hijo.
const { spawn } = require('child_process');
const major = Number(process.versions.node.split('.')[0]);
const env = { ...process.env };
if (major >= 17 && !(env.NODE_OPTIONS || '').includes('--openssl-legacy-provider')) env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --openssl-legacy-provider`.trim();
const child = spawn(process.execPath, [require.resolve('react-scripts/bin/react-scripts.js'), ...process.argv.slice(2)], { env, stdio: 'inherit' });
child.on('exit', code => process.exit(code === null ? 1 : code));
child.on('error', error => { console.error(error.message); process.exit(1); });
