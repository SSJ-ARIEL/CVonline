import { mkdir, readFile, readdir, copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const target='dist/licenses';await mkdir(target,{recursive:true});
const packages=[];
for(const [path,metadata] of Object.entries(lock.packages)){
  if(!path.startsWith('node_modules/')||metadata.dev)continue;
  let names;try{names=await readdir(path);}catch{continue;}
  const info=JSON.parse(await readFile(join(path,'package.json'),'utf8'));
  const licenses=names.filter(name=>/^(?:licen[cs]e|copying|notice|ofl|copyright)(?:[._-].*)?$/i.test(name));
  const slug=path.replace(/[^a-z0-9._-]/gi,'_');
  for(const name of licenses){try{await copyFile(join(path,name),join(target,`${slug}__${name}`));}catch{/* Some packages use a license directory instead of a file. */}}
  packages.push(`${info.name}@${info.version} — ${typeof info.license==='string'?info.license:JSON.stringify(info.license||'see package')} — ${licenses.join(', ')}`);
}
await writeFile(join(target,'DEPENDENCIES.txt'),`${packages.sort().join('\n')}\n`);
await copyFile('THIRD_PARTY_NOTICES.md',join(target,'THIRD_PARTY_NOTICES.md'));
await copyFile('LICENSE',join(target,'CVonline-LICENSE.txt'));
console.log(`Preserved license notices for ${packages.length} production dependencies.`);
