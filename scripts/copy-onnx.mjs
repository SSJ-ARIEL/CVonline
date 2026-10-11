import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { copyFile, mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { gzipSync, gunzipSync } from 'node:zlib';

// Use the runtime installed from the dependency lockfile, retaining its exact
// version instead of downloading WASM from a third-party CDN at runtime.
const require = createRequire(import.meta.url);
const transformersRequire = createRequire(require.resolve('@huggingface/transformers'));
const runtime = dirname(transformersRequire.resolve('onnxruntime-web'));
const target = new URL('../public/onnx/', import.meta.url);
await mkdir(target, { recursive: true });
const files = ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm'];
const deployedFiles = ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm.gz'];
const available = await readdir(runtime);
if (!files.every(name => available.includes(name))) {
  throw new Error('Installed ONNX runtime does not contain the required WASM assets.');
}
// Remove only previously generated ONNX runtime assets. New runtime releases can
// include optional >25 MB GPU/asyncify binaries that Pages cannot deploy.
for (const file of await readdir(target)) {
  if (/^ort-wasm.*\.(?:wasm(?:\.gz)?|mjs)$/.test(file) && !deployedFiles.includes(file)) {
    await unlink(new URL(file, target));
  }
}
await copyFile(join(runtime, files[0]), new URL(files[0], target));
// Ship the exact locked runtime in a smaller standard gzip file. The browser
// decompresses it in RAM and supplies ONNX Runtime's public wasmBinary option.
// No special hosting headers, remote runtime, or modified WASM are needed.
const binary = await readFile(join(runtime, files[1]));
const compressed = gzipSync(binary, { level: 9 });
if (!gunzipSync(compressed).equals(binary)) {
  throw new Error('Compressed ONNX runtime failed byte-for-byte verification.');
}
await writeFile(new URL(deployedFiles[1], target), compressed);
console.log(`Prepared ${deployedFiles.length} local ONNX assets; verified WASM ${binary.length} → ${compressed.length} bytes.`);
