import { localAssets } from './local-assets';

const uploads = 'https://transferatacamachile.cl/wp-content/uploads';

// Las fotografías incluidas en public/images tienen prioridad. La URL anterior
// sirve como respaldo si se elimina accidentalmente algún archivo local.
export const media = {
  logo: '/images/martin-logo-transparente.webp',
  airport: localAssets.airport || `${uploads}/2025/12/Aeropuerto.webp`,
  entrance: localAssets.entrance || `${uploads}/2025/12/Calama_EntradaMonumental_Vialoop_2025.webp`,
  desert: localAssets.desert || `${uploads}/2025/12/Caminoo-desierto.webp`,
  city: localAssets.city || `${uploads}/2025/11/DJI_0171_optimized.webp`,
  taxi: localAssets.taxi || `${uploads}/2025/12/Aero.webp`,
  mine: localAssets.mine || `${uploads}/2025/12/miner.webp`,
  workers: localAssets.workers || `${uploads}/2025/12/minero2.webp`,
  vanMine: localAssets.vanMine || `${uploads}/2025/12/SPA-1.webp`,
  vanDesert: localAssets.vanDesert || `${uploads}/2025/12/SPA.webp`,
  sanPedro: localAssets.sanPedro || `${uploads}/2025/12/SPA4.webp`,
};
