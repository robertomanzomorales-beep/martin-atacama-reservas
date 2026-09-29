import { copyFile, mkdir, stat } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { assets } from './assets-config.mjs';
import { destination, saveManifest, targetName, walk } from './assets-helpers.mjs';

const source = resolve(process.argv[2] || 'assets-originales');
let files;
try { files = await walk(source); }
catch { console.error(`No se encontró la carpeta ${source}. Copie allí las imágenes originales o indique su ruta como argumento.`); process.exit(1); }

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
