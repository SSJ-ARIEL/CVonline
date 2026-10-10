import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { copyFile, mkdir, readdir, unlink } from 'node:fs/promises';

// Use the runtime installed from the dependency lockfile, retaining its exact
// version instead of downloading WASM from a third-party CDN at runtime.
const require = createRequire(import.meta.url);
const transformersRequire = createRequire(require.resolve('@huggingface/transformers'));
const runtime = dirname(transformersRequire.resolve('onnxruntime-web'));
const target = new URL('../public/onnx/', import.meta.url);
await mkdir(target, { recursive: true });
const files = ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm'];
const available = await readdir(runtime);
if (!files.every(name => available.includes(name))) {
  throw new Error('Installed ONNX runtime does not contain the required WASM assets.');
}
// Remove only previously generated ONNX runtime assets. New runtime releases can
// include optional >25 MB GPU/asyncify binaries that Pages cannot deploy.
for (const file of await readdir(target)) {
  if (/^ort-wasm.*\.(?:wasm|mjs)$/.test(file) && !files.includes(file)) {
    await unlink(new URL(file, target));
  }
}
for (const file of files) await copyFile(join(runtime, file), new URL(file, target));
console.log(`Copied ${files.length} ONNX runtime assets for local translation.`);
