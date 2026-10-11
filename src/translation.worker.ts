import type { Locale } from './model';
import type { TranslationErrorCode, TranslationProgress } from './translation';
import { loadLocalWasmBinary } from './wasm-runtime';

// Model cards, supported languages and licenses:
// https://huggingface.co/Helsinki-NLP/opus-mt-ROMANCE-en (Apache-2.0)
// https://huggingface.co/Helsinki-NLP/opus-mt-en-ROMANCE (Apache-2.0)
// ONNX conversions are published by the Transformers.js author Xenova.
// Pin revisions so a remote model update cannot silently change the implementation.
const MODELS = {
  toEnglish: { id: 'Xenova/opus-mt-ROMANCE-en', revision: 'f60feaabe8bb435a5871e7702b25f53a01e770f8', graphBytes: 113112544 },
  fromEnglish: { id: 'Xenova/opus-mt-en-ROMANCE', revision: '9d2ba69ac80c8e8453c3d9a1e2323a0e7b8ca3cd', graphBytes: 113112546 },
};
// Verified against the model tokenizer; this Marian model uses ISO 639-1 tags.
const TARGET_TAG: Record<Exclude<Locale, 'en'>, string> = {
  es: '>>es<<', it: '>>it<<', pt: '>>pt<<',
};

const scope = self as unknown as DedicatedWorkerGlobalScope;
const progress = (value: TranslationProgress) => scope.postMessage({ type: 'progress', progress: value });
const fail = (code: TranslationErrorCode) => scope.postMessage({ type: 'error', code });

/** Short chunks keep every sentence below Marian's 512-token context window. */
function chunks(text: string): string[] {
  const words = text.trim().split(/\s+/);
  const result: string[] = [];
  let current = '';
  for (const word of words) {
    if (current.length + word.length + 1 > 320 && current) {
      result.push(current);
      current = '';
    }
    if (word.length > 320) {
      if (current) { result.push(current); current = ''; }
      for (let start = 0; start < word.length; start += 320) result.push(word.slice(start, start + 320));
    } else current += (current ? ' ' : '') + word;
  }
  if (current) result.push(current);
  return result;
}

scope.onmessage = async (event: MessageEvent<{ texts: string[]; from: Locale; to: Locale }>) => {
  const { from, to } = event.data;
  let texts = event.data.texts;
  let phase: 'download' | 'translate' = 'download';
  try {
    const { env, pipeline, LogLevel, Tensor } = await import('@huggingface/transformers');
    // CV text is never cached. Models are also RAM-only to avoid persistent storage.
    env.useBrowserCache = false;
    env.useFSCache = false;
    env.useWasmCache = false;
    env.useCustomCache = false;
    env.experimental_useCrossOriginStorage = false;
    env.logLevel = LogLevel.NONE;
    env.allowLocalModels = false;
    env.allowRemoteModels = true;
    env.remoteHost = 'https://huggingface.co/';
    env.remotePathTemplate = '{model}/resolve/{revision}/';
    if (env.backends.onnx.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
      // The build compresses the dependency's unchanged binary for smaller uploads.
      const runtime = `${scope.location.origin}${import.meta.env.BASE_URL}onnx/`;
      env.backends.onnx.wasm.wasmPaths = {
        mjs: `${runtime}ort-wasm-simd-threaded.mjs`,
      };
      // wasmBinary is ONNX Runtime's public override. Decompression stays in RAM;
      // the browser never needs an uncompressed runtime asset or a third-party URL.
      env.backends.onnx.wasm.wasmBinary = await loadLocalWasmBinary(`${runtime}ort-wasm-simd-threaded.wasm.gz`);
      env.backends.onnx.wasm.proxy = false;
    }

    // Downloads contain model names only. The user's text is never part of a URL
    // or request. Referrers, credentials and browser HTTP cache are disabled.
    const originalFetch = scope.fetch.bind(scope);
    env.fetch = (input: string | URL, init?: RequestInit) => originalFetch(input, {
      ...init, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
    });

    const legs = [
      ...(from !== 'en' ? [{ model: MODELS.toEnglish, prefix: '' }] : []),
      ...(to !== 'en' ? [{ model: MODELS.fromEnglish, prefix: `${TARGET_TAG[to]} ` }] : []),
    ];
    let completed = 0;
    for (const leg of legs) {
      phase = 'download';
      progress({ stage: 'download', percent: 0 });
      const files = new Map<string, number>();
      const translator = await pipeline('translation', leg.model.id, {
        revision: leg.model.revision,
        device: 'wasm',
        dtype: 'q8',
        progress_callback: update => {
          if (update.status === 'progress' && update.file.startsWith('onnx/')) {
            files.set(update.file, update.loaded);
            const loaded = [...files.values()].reduce((sum, bytes) => sum + bytes, 0);
            progress({ stage: 'download', percent: Math.min(99, Math.round(loaded / leg.model.graphBytes * 100)) });
          }
        },
      });
      progress({ stage: 'download', percent: 100 });
      phase = 'translate';
      try {
        const output: string[] = [];
        for (const text of texts) {
          const lines: string[] = [];
          // Preserve the paragraph and bullet layout of achievements/descriptions.
          for (const line of text.split('\n')) {
            if (!line.trim()) { lines.push(line); continue; }
            const match = /^(\s*(?:[-•*]\s+)?)(.*?)(\s*)$/.exec(line);
            const prefix = match?.[1] ?? '';
            const content = match?.[2] ?? line;
            const suffix = match?.[3] ?? '';
            const translated: string[] = [];
            for (const chunk of chunks(content)) {
              const inputs = await translator.tokenizer(chunk, { padding: true, truncation: false });
              if (leg.prefix) {
                const languageId = translator.tokenizer.get_vocab().get(leg.prefix.trim());
                if (typeof languageId !== 'number') throw new Error('Unsupported model language token');
                // Transformers.js 4.3.1's public tokenizer currently bypasses
                // Marian's language-prefix override. Tokenize normal English and
                // prepend its existing language ID directly, using public Tensor
                // and model.generate APIs. No model/vocabulary files are modified.
                const originalIds = inputs.input_ids.data as BigInt64Array;
                const length = originalIds.length + 1;
                inputs.input_ids = new Tensor('int64', [BigInt(languageId), ...originalIds], [1, length]);
                inputs.attention_mask = new Tensor('int64', new BigInt64Array(length).fill(1n), [1, length]);
              }
              const generated = await translator.model.generate({
                ...inputs, max_new_tokens: 256, num_beams: 1, do_sample: false,
              });
              if (!(generated instanceof Tensor)) throw new Error('Unexpected model output');
              const translation = translator.tokenizer.batch_decode(generated, { skip_special_tokens: true })[0] ?? '';
              if (!translation.trim()) throw new Error('Empty local translation');
              translated.push(translation.trim());
            }
            lines.push(prefix + translated.join(' ') + suffix);
          }
          output.push(lines.join('\n'));
          completed += 1;
          progress({ stage: 'translate', percent: Math.round(completed / (texts.length * legs.length) * 100) });
        }
        texts = output;
      } finally {
        // Dispose before the second model is loaded, reducing peak device memory.
        await translator.dispose();
      }
    }
    scope.postMessage({ type: 'result', texts });
  } catch {
    // Do not include raw engine errors: they could contain fragments of CV text.
    fail(phase === 'download' ? 'TRANSLATION_DOWNLOAD_FAILED' : 'TRANSLATION_FAILED');
  }
};
