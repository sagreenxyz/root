import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE || 'https://sagreenxyz.github.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
});
