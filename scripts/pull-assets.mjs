import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'https://transferatacamachile.cl/wp-content/uploads/';
const assets = [
  '2025/12/Logotipo_sanmartin.webp',
  '2025/12/Aeropuerto.webp',
  '2025/12/Caminoo-desierto.webp',
  '2025/12/Calama_EntradaMonumental_Vialoop_2025.webp',
  '2025/11/DJI_0171_optimized.webp',
  '2025/12/Aero.webp',
  '2025/12/miner.webp',
  '2025/12/SPA-1.webp',
];
const target = join(process.cwd(), 'public', 'images');
await mkdir(target, { recursive: true });
try {
  const downloads = await Promise.all(assets.map(async path => {
    const response = await fetch(root + path, { signal: AbortSignal.timeout(25000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`No se pudo descargar ${path} (${response.status})`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1000) throw new Error(`Imagen incompleta: ${path}`);
    return { path, bytes };
  }));
  for (const { path, bytes } of downloads) await writeFile(join(target, path.split('/').at(-1)), bytes);
  for (const file of ['src/app/globals.css', 'src/components/site-shell.tsx']) {
    const original = await readFile(file, 'utf8');
    let next = original;
    for (const path of assets) next = next.replaceAll(root + path, `/images/${path.split('/').at(-1)}`);
    await writeFile(file, next);
  }
  console.log(`Listo: ${downloads.length} imágenes locales en public/images.`);
} catch (error) { console.error(error); process.exitCode = 1; }
