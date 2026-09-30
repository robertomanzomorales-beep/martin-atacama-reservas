import { localAssets } from './local-assets';

// Servir las fotos desde el proyecto evita depender del WordPress al migrar el dominio.
export const media = {
  logo: '/images/martin-logo-transparente.webp',
  airport: localAssets.airport,
  entrance: localAssets.entrance,
  desert: localAssets.desert,
  city: localAssets.city,
  taxi: localAssets.taxi,
  mine: localAssets.mine,
  workers: localAssets.workers,
  vanMine: localAssets.vanMine,
  vanDesert: localAssets.vanDesert,
  sanPedro: localAssets.sanPedro,
};
