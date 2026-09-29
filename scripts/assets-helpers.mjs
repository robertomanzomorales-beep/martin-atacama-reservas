import { access, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { assets } from './assets-config.mjs';

export const destination = join(process.cwd(), 'public', 'images');

export async function walk(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) files.push(...await walk(path));
    else if (item.isFile()) files.push(path);
  }
  return files;
}

export async function saveManifest() {
  const found = {};
  for (const { key } of assets) {
    for (const ext of ['.webp', '.png', '.jpg', '.jpeg']) {
      const filename = `${key}${ext}`;
      try { await access(join(destination, filename)); found[key] = `/images/${filename}`; break; } catch { /* La imagen original aún no está copiada. */ }
    }
  }
  const output = `// Generado por npm run assets:import / assets:pull.\nexport const localAssets: Record<string, string> = ${JSON.stringify(found, null, 2)};\n`;
  await writeFile(join(process.cwd(), 'src', 'lib', 'local-assets.ts'), output);
  return found;
}

export function targetName(key, sourceName) { return `${key}${extname(sourceName).toLowerCase()}`; }
