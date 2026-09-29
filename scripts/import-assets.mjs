import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { assets } from './assets-config.mjs';
import { destination, saveManifest, targetName, walk } from './assets-helpers.mjs';

let source = resolve(process.argv[2] || 'assets-originales');
let files;
try { files = await walk(source); }
catch {
  files = [];
  if (!process.argv[2]) {
    const ignored = new Set(['node_modules', '.next', '.git', '.vercel', 'src', 'public', 'scripts', 'data']);
    const knownNames = new Set(assets.flatMap(asset => asset.names.map(name => name.toLowerCase())));
    let best = { directory: '', files: [], matches: 0 };
    for (const entry of await readdir(process.cwd(), { withFileTypes: true })) {
      if (!entry.isDirectory() || ignored.has(entry.name)) continue;
      const candidate = resolve(entry.name);
      const candidateFiles = await walk(candidate);
      const matches = candidateFiles.filter(path => knownNames.has(basename(path).toLowerCase())).length;
      if (matches > best.matches) best = { directory: candidate, files: candidateFiles, matches };
    }
    if (best.matches) {
      source = best.directory;
      files = best.files;
      console.log(`Imágenes originales encontradas en ${source} (${best.matches} coincidencias).`);
    }
  }
  if (!files.length) console.log('No hay carpeta de imágenes originales; se conservarán las imágenes ya importadas en public/images.');
}

await mkdir(destination, { recursive: true });
let copied = 0;
for (const { key, names } of assets) {
  const original = names.map(name => files.find(path => basename(path).toLowerCase() === name.toLowerCase())).find(Boolean);
  if (!original) { console.log(`Pendiente: ${key} (${names.join(' o ')})`); continue; }
  if ((await stat(original)).size < 500) { console.log(`Archivo vacío o incompleto: ${original}`); continue; }
  await copyFile(original, resolve(destination, targetName(key, original)));
  console.log(`Copiada ${key}: ${basename(original)}`);
  copied++;
}
const local = await saveManifest();
console.log(`Listo: ${copied} imágenes importadas; ${Object.keys(local).length} disponibles localmente. Las restantes conservan temporalmente la URL anterior.`);
