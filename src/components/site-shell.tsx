import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpToLine, MapPin, Phone } from 'lucide-react';
import { DesktopNav, MobileMenu } from './mobile-menu';
import { Reveal } from './reveal';
import { FloatingWhatsApp } from './floating-whatsapp';
import { media } from '@/lib/media';

const whatsapp = 'https://wa.me/56997106497';

export function Header() {
  return <>
    <div id="top" className="topline"><div className="container topline-inner"><span><MapPin size={15}/> Calama · San Pedro de Atacama · Aeropuerto</span><a href="tel:+56997106497"><Phone size={15}/> +56 9 9710 6497</a></div></div>
    <header className="site-header"><div className="container nav-inner">
      <Link href="/" className="brand brand-image-only" aria-label="Martín Atacama Transfers — Inicio"><Image src={media.logo} alt="Martín Atacama Transfers" width={112} height={112} unoptimized priority /></Link>
      <DesktopNav />
      <MobileMenu />
    </div></header>
    <div className="site-header-spacer" aria-hidden="true" />
  </>;
}

const services = [
  'Traslados Aeropuerto – San Pedro',
  'Transporte turístico y privado',
  'Viajes corporativos y para empresas',
  'Rutas y traslados en el desierto',
  'Traslado a faenas mineras',
];

export function Footer() {
  return <footer className="footer"><Reveal className="container footer-main">
    <div className="footer-about">
      <Link href="/" className="footer-logo" aria-label="Martín Atacama Transfers — Inicio"><Image src={media.logo} alt="Martín Atacama Transfers" width={242} height={242} unoptimized /></Link>
      <p><strong>Martín Atacama Transfers</strong> ofrece servicios de transporte confiable entre <strong>Calama — Aeropuerto — San Pedro de Atacama</strong>, con enfoque en puntualidad, seguridad y experiencia local.</p>
    </div>
    <div className="footer-services"><h3>Servicios</h3><ul>{services.map(service => <li key={service}>{service}</li>)}</ul><Link href="/reservar" className="footer-reserve">Solicitar traslado <span aria-hidden="true">↗</span></Link></div>
    <div className="footer-contact"><h3>Contacto</h3>
      <dl><div><dt>Correo</dt><dd><a href="mailto:contacto@transferatacamachile.cl">contacto@transferatacamachile.cl</a></dd></div>
      <div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">+56 9 9710 6497</a></dd></div>
      <div><dt>Ubicación</dt><dd>Calama, Región de Antofagasta</dd></div>
      <div><dt>Atención</dt><dd>Solicitudes de traslado en línea, todos los días</dd></div></dl>
    </div>
  </Reveal><div className="container footer-bottom"><span>© {new Date().getFullYear()} Martín Atacama Transfers. Todos los derechos reservados.</span><span>Diseñado por <a href="https://vialoop.cl" target="_blank" rel="noopener noreferrer">vialoop.cl</a></span></div><a href="#top" className="back-to-top" aria-label="Volver al inicio"><ArrowUpToLine size={20} strokeWidth={1.8}/></a></footer>;
}
export function SiteShell({ children }: { children: React.ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }
export function WhatsAppPill() { return <FloatingWhatsApp />; }
