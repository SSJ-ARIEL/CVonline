/** Load the unchanged ONNX binary from a smaller, locally hosted gzip asset. */
export async function loadLocalWasmBinary(url: string): Promise<Uint8Array> {
  const response = await fetch(url, {
    cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
  });
  if (!response.ok || !response.body) {
    throw new Error('The local translation runtime could not be downloaded.');
  }
  // Reject an HTML fallback or a damaged asset before passing it to ONNX Runtime.
  const header = [0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00];
  const isWasm = (bytes: Uint8Array) => header.every((value, index) => bytes[index] === value);
  let binary = new Uint8Array(await response.arrayBuffer());
  // Some static hosts mark .gz assets with Content-Encoding: gzip, so fetch has
  // already decoded them. Others deliver the compressed file as ordinary bytes.
  if (!isWasm(binary)) {
    if (binary[0] !== 0x1f || binary[1] !== 0x8b) {
      throw new Error('The local translation runtime is not a valid gzip asset.');
    }
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('This browser cannot decompress the local translation runtime.');
    }
    const stream = new Blob([binary]).stream().pipeThrough(new DecompressionStream('gzip'));
    binary = new Uint8Array(await new Response(stream).arrayBuffer());
  }
  if (!isWasm(binary)) {
    throw new Error('The local translation runtime is not a valid WebAssembly binary.');
  }
  return binary;
}
