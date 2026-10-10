import type { Locale, ResumeData } from './model';

export interface TranslationProgress {
  stage: 'download' | 'translate';
  percent: number;
  message?: string;
}

export type TranslationErrorCode =
  | 'TRANSLATION_ABORTED'
  | 'TRANSLATION_UNSUPPORTED'
  | 'TRANSLATION_DOWNLOAD_FAILED'
  | 'TRANSLATION_FAILED';

export class TranslationError extends Error {
  readonly code: TranslationErrorCode;
  constructor(code: TranslationErrorCode) {
    super(code);
    this.name = 'TranslationError';
    this.code = code;
  }
}

type NativeTranslator = {
  translate(text: string, options?: { signal?: AbortSignal }): Promise<string>;
  destroy(): void;
};
type NativeTranslatorAPI = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(options: {
    sourceLanguage: string;
    targetLanguage: string;
    signal?: AbortSignal;
    monitor?: (monitor: EventTarget) => void;
  }): Promise<NativeTranslator>;
};
type NativeTranslationGlobal = typeof globalThis & { Translator?: NativeTranslatorAPI };
type Field = { source: string; set: (value: string) => void };

function nativeOnDeviceTranslator(): NativeTranslatorAPI | undefined {
  // The web proposal permits cloud-backed implementations. Only use the current
  // Chrome implementation, which documents local inference. Other browsers use
  // our own WASM engine so a future native API cannot silently send CV data away.
  if (typeof navigator === 'undefined') return undefined;
  const browser = navigator as Navigator & {
    userAgentData?: { brands: { brand: string; version: string }[] };
  };
  if (!browser.userAgentData?.brands.some(item => item.brand === 'Google Chrome')) return undefined;
  return (globalThis as NativeTranslationGlobal).Translator;
}

/** Only descriptive text is translated. Names, identifiers and contact data stay intact. */
function translationPlan(data: ResumeData): { result: ResumeData; fields: Field[] } {
  const result = structuredClone(data);
  const fields: Field[] = [];
  const add = (source: string, set: Field['set']) => {
    if (source.trim()) fields.push({ source, set });
  };
  add(result.personal.headline, value => { result.personal.headline = value; });
  add(result.summary, value => { result.summary = value; });
  result.experiences.forEach(item => {
    add(item.role, value => { item.role = value; });
    add(item.description, value => { item.description = value; });
    add(item.achievements, value => { item.achievements = value; });
  });
  result.education.forEach(item => {
    add(item.degree, value => { item.degree = value; });
    add(item.description, value => { item.description = value; });
  });
  result.projects.forEach(item => {
    add(item.description, value => { item.description = value; });
  });
  result.skills.forEach((text, index) => add(text, value => { result.skills[index] = value; }));
  result.languages.forEach(item => {
    add(item.name, value => { item.name = value; });
    // CEFR labels and native language proficiency need no machine translation.
    if (!/^(?:[ABC][12]|[1-5])$/i.test(item.level.trim())) {
      add(item.level, value => { item.level = value; });
    }
  });
  result.interests.forEach((text, index) => add(text, value => { result.interests[index] = value; }));
  result.customSections.forEach(item => {
    add(item.title, value => { item.title = value; });
    add(item.body, value => { item.body = value; });
  });
  return { result, fields };
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new TranslationError('TRANSLATION_ABORTED');
}

/** Native translation is optional; WASM inference covers browsers without that API. */
export function isTranslationSupported(): boolean {
  return Boolean(nativeOnDeviceTranslator()) ||
    (typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined');
}

async function translateNatively(
  texts: string[], from: Locale, to: Locale,
  onProgress?: (progress: TranslationProgress) => void,
  signal?: AbortSignal,
): Promise<string[] | null> {
  const api = nativeOnDeviceTranslator();
  if (!api) return null;
  let translator: NativeTranslator | undefined;
  const destroy = () => { translator?.destroy(); };
  signal?.addEventListener('abort', destroy, { once: true });
  try {
    const options = { sourceLanguage: from, targetLanguage: to };
    if (await api.availability(options) === 'unavailable') return null;
    throwIfAborted(signal);
    onProgress?.({ stage: 'download', percent: 0 });
    translator = await api.create({
      ...options,
      signal,
      monitor(monitor) {
        monitor.addEventListener('downloadprogress', event => {
          const loaded = (event as Event & { loaded?: number }).loaded;
          if (typeof loaded === 'number') {
            onProgress?.({ stage: 'download', percent: Math.round(loaded * 100) });
          }
        });
      },
    });
    throwIfAborted(signal);
    const output: string[] = [];
    for (const text of texts) {
      throwIfAborted(signal);
      const translated = await translator.translate(text, { signal });
      if (!translated.trim()) throw new TranslationError('TRANSLATION_FAILED');
      output.push(translated);
      onProgress?.({ stage: 'translate', percent: Math.round(output.length / texts.length * 100) });
    }
    return output;
  } catch {
    throwIfAborted(signal);
    // Native language support is inconsistent. Retry with the verified local model.
    return null;
  } finally {
    destroy();
    signal?.removeEventListener('abort', destroy);
  }
}

function translateInWorker(
  texts: string[], from: Locale, to: Locale,
  onProgress?: (progress: TranslationProgress) => void,
  signal?: AbortSignal,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
      reject(new TranslationError('TRANSLATION_UNSUPPORTED'));
      return;
    }
    const worker = new Worker(new URL('./translation.worker.ts', import.meta.url), { type: 'module' });
    let settled = false;
    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener('abort', abort);
      // Releases all text, downloaded model weights, and WASM runtime memory.
      worker.terminate();
      action();
    };
    const abort = () => finish(() => reject(new TranslationError('TRANSLATION_ABORTED')));
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) { abort(); return; }
    worker.onmessage = (event: MessageEvent<{
      type: 'progress' | 'result' | 'error';
      progress?: TranslationProgress;
      texts?: string[];
      code?: TranslationErrorCode;
    }>) => {
      if (event.data.type === 'progress' && event.data.progress) onProgress?.(event.data.progress);
      if (event.data.type === 'result' && event.data.texts) {
        const result = event.data.texts;
        if (result.length !== texts.length) {
          finish(() => reject(new TranslationError('TRANSLATION_FAILED')));
        } else finish(() => resolve(result));
      }
      if (event.data.type === 'error') {
        finish(() => reject(new TranslationError(event.data.code ?? 'TRANSLATION_FAILED')));
      }
    };
    worker.onerror = () => finish(() => reject(new TranslationError('TRANSLATION_FAILED')));
    worker.postMessage({ texts, from, to });
  });
}

/**
 * Translate in memory on this device. There is no remote text translation endpoint,
 * browser storage, analytics payload or persistence of the original/result.
 * Only public model assets are downloaded by the fallback worker, over HTTPS.
 */
export async function translateResume(
  data: ResumeData,
  from: Locale,
  to: Locale,
  onProgress?: (progress: TranslationProgress) => void,
  signal?: AbortSignal,
): Promise<ResumeData> {
  throwIfAborted(signal);
  const { result, fields } = translationPlan(data);
  if (from === to || fields.length === 0) return result;
  const texts = fields.map(field => field.source);
  const translated = await translateNatively(texts, from, to, onProgress, signal)
    ?? await translateInWorker(texts, from, to, onProgress, signal);
  throwIfAborted(signal);
  fields.forEach((field, index) => field.set(translated[index]));
  return result;
}
