import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { MobileMenu } from './mobile-menu';
import { media } from '@/lib/media';

const whatsapp = 'https://wa.me/56997106497';

export function Header() {
  return <>
    <div className="topline"><div className="container topline-inner"><span><MapPin size={15}/> Calama · San Pedro de Atacama · Aeropuerto</span><a href="tel:+56997106497"><Phone size={15}/> +56 9 9710 6497</a></div></div>
    <header className="site-header"><div className="container nav-inner">
      <Link href="/" className="brand brand-image-only" aria-label="Martín Atacama Transfers — Inicio"><Image src={media.logo} alt="Martín Atacama Transfers" width={72} height={72} unoptimized priority /></Link>
      <nav className="nav-links" aria-label="Navegación principal"><Link href="/">Inicio</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link><Link className="nav-book" href="/reservar">Reservar traslado <ArrowUpRight size={17}/></Link></nav>
      <MobileMenu/>
    </div></header>
  </>;
}

export function Footer() {
  return <footer className="footer"><div className="container footer-main"><div className="footer-about"><Link href="/" className="footer-logo" aria-label="Martín Atacama Transfers — Inicio"><Image src={media.logo} alt="Martín Atacama Transfers" width={124} height={124} unoptimized /></Link><p>Traslados seguros y puntuales entre Calama, el aeropuerto, San Pedro de Atacama y las rutas del desierto.</p></div><div><h3>Explorar</h3><Link href="/">Inicio</Link><Link href="/nosotros">Nosotros</Link><Link href="/reservar">Reservar traslado</Link><Link href="/contacto">Contacto</Link></div><div><h3>Contacto</h3><a href="mailto:contacto@transferatacamachile.cl"><Mail size={16}/> contacto@transferatacamachile.cl</a><a href={whatsapp} target="_blank" rel="noopener noreferrer"><Phone size={16}/> +56 9 9710 6497</a><span><MapPin size={16}/> Calama, Región de Antofagasta</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Martín Atacama Transfers</span><span>Diseñado por <a href="https://vialoop.cl" target="_blank" rel="noopener noreferrer">Vialoop</a></span></div></footer>;
}
export function SiteShell({ children }: { children: React.ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }
export function WhatsAppPill() { return <a className="whatsapp-pill" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp"><Phone size={18}/><span>¿Necesita ayuda?</span></a>; }
