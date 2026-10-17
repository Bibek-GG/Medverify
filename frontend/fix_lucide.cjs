const fs = require('fs');
const cjs = require('./node_modules/lucide-react/dist/cjs/lucide-react.js');

const keys = Object.keys(cjs).filter(k => k !== 'default' && !k.startsWith('__'));
const code = `import cjs from "../cjs/lucide-react.js";\nexport const {\n  ${keys.join(',\n  ')}\n} = cjs;\nexport default cjs;\n`;

fs.writeFileSync('./node_modules/lucide-react/dist/esm/lucide-react.mjs', code);
console.log('Successfully wrote', keys.length, 'named exports to dist/esm/lucide-react.mjs');
