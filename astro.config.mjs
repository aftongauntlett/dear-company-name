// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://hire.aftongauntlett.com',
  build: {
    // Inline all CSS into the HTML document to eliminate render-blocking stylesheet requests.
    inlineStylesheets: 'always',
  },
});
