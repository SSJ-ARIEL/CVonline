import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'private-editor-document',
    transformIndexHtml(html, context) {
      // Match the production Pages rewrites during local development.
      if (context.server && /^\/(?:language|cv-type|profile|review|builder)(?:\/|\?|$)/.test(context.originalUrl || context.path)) {
        return html.replace(/<script\b(?=[^>]*\bid="adsense-verification")[^>]*>[\s\S]*?<\/script>/, '');
      }
      return html;
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (/^\/(?:language|cv-type|profile|review|builder)(?:\/|\?|$)/.test(request.url || '')) request.url = '/editor.html';
        next();
      });
    },
  }],
  resolve: {
    alias: [{ find: 'onnxruntime-web/webgpu', replacement: 'onnxruntime-web/wasm' }],
    conditions: ['onnxruntime-web-use-extern-wasm','module','browser','development|production'],
  },
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
