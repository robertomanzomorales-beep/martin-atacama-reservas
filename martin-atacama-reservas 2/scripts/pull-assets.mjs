import { mkdir, writeFile } from 'node:fs/promises';
import { assets } from './assets-config.mjs';
import { destination, saveManifest, targetName } from './assets-helpers.mjs';

const root = 'https://transferatacamachile.cl/wp-content/uploads/';
await mkdir(destination, { recursive: true });
let downloaded = 0;
for (const asset of assets) {
  try {
    const response = await fetch(root + asset.remote, { signal: AbortSignal.timeout(12000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 500) throw new Error('Archivo incompleto');
    await writeFile(`${destination}/${targetName(asset.key, asset.remote)}`, bytes);
    console.log(`Descargada ${asset.key}`); downloaded++;
  } catch (error) { console.log(`Pendiente ${asset.key}: ${error instanceof Error ? error.message : String(error)}`); }
}
const local = await saveManifest();
console.log(`Listo: ${downloaded} descargadas; ${Object.keys(local).length} imágenes disponibles localmente. Las restantes siguen usando el sitio anterior.`);
