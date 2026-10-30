import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Rewrites root-relative links ("/team/", "/img/...") into relative ones after the build,
// so the same files work at https://www.ilrog.org/ and at a test address such as
// https://<account>.github.io/<repository>/.
function relativeLinks() {
  return {
    name: 'relative-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const walk = async (d) => {
          const entries = await readdir(d, { withFileTypes: true });
          const nested = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)])));
          return nested.flat();
        };
        for (const file of await walk(root)) {
          if (!/\.(html|css)$/.test(file)) continue;
          const up = relative(dirname(file), root).split('\\').join('/');
          const pre = up ? up + '/' : './';
          let s = await readFile(file, 'utf8');
          const fix = (url) => (url.startsWith('//') ? url : pre + url.slice(1));
          s = s.replace(/(href|src)="(\/[^"]*)"/g, (m, a, u) => `${a}="${fix(u)}"`);
          s = s.replace(/url\((\/[^)]*)\)/g, (m, u) => `url(${fix(u)})`);
          await writeFile(file, s);
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://www.ilrog.org',
  trailingSlash: 'always',
  build: { format: process.env.PREVIEW ? 'file' : 'directory', assets: 'assets' },
  vite: { build: { rollupOptions: { output: { assetFileNames: 'assets/[name][extname]' } } } },
  integrations: process.env.PREVIEW ? [] : [relativeLinks()],
});
