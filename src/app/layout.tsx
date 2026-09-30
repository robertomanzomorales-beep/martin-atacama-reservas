import type { Metadata } from 'next';
import './globals.css';
import './premium.css';
import './refinement.css';
import './studio-v6.css';

export const metadata: Metadata = {
  title: { default: 'Martín Atacama Transfers | Traslados en Calama y San Pedro', template: '%s | Martín Atacama Transfers' },
  description: 'Traslados privados entre Calama, aeropuerto, San Pedro de Atacama y faenas mineras. Solicite su reserva en línea.',
  metadataBase: new URL('https://transferatacamachile.cl'),
  icons: { icon: [
    { url: '/images/martin-logo-transparente.webp', type: 'image/webp', sizes: '512x512' },
    { url: '/icon.svg?v=2', type: 'image/svg+xml' },
  ] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-CL"><body>{children}</body></html>;
}
