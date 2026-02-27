// Prisma 7 generates client source as TypeScript (client.ts) which contains
// `import.meta.url` references. When tsc compiles this to CommonJS, Node.js 22+
// throws "exports is not defined in ES module scope" because `import.meta` is
// ESM-only syntax and is illegal in CJS output. This script strips those lines
// from the compiled client.js after tsc runs so the package can be consumed as CJS.
const fs = require('fs');
const path = require('path');

const clientPath = path.join(__dirname, '..', 'dist', 'generated', 'prisma', 'client.js');
const content = fs.readFileSync(clientPath, 'utf8');
fs.writeFileSync(clientPath, content.replace(/.*import\.meta\.url.*/g, ''));
