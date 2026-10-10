import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
const limit=25*1024*1024;
async function visit(root){for(const entry of await readdir(root,{withFileTypes:true})){const path=join(root,entry.name);if(entry.isDirectory())await visit(path);else if((await stat(path)).size>limit)throw new Error(`Cloudflare Pages file limit exceeded: ${path}`);}}
await visit('dist');
console.log('Cloudflare Pages check passed: every deployment file is within 25 MiB.');
