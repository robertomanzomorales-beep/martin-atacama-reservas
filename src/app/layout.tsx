import type { Metadata } from 'next';
import './globals.css';
import './premium.css';
import './refinement.css';
import './studio-v5.css';

export const metadata: Metadata = {
  title: { default: 'Martín Atacama Transfers | Traslados en Calama y San Pedro', template: '%s | Martín Atacama Transfers' },
  description: 'Traslados privados entre Calama, aeropuerto, San Pedro de Atacama y faenas mineras. Solicite su reserva en línea.',
  metadataBase: new URL('https://transferatacamachile.cl'),
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-CL"><body>{children}</body></html>;
}
