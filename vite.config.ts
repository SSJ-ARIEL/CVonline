import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: 'onnxruntime-web/webgpu', replacement: 'onnxruntime-web/wasm' }],
    conditions: ['onnxruntime-web-use-extern-wasm','module','browser','development|production'],
  },
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
