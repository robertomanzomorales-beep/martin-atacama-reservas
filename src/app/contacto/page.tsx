import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { Reveal } from '@/components/reveal';
import { SiteShell, WhatsAppPill } from '@/components/site-shell';
import { VisualHero } from '@/components/visual-hero';
import { media } from '@/lib/media';

export const metadata: Metadata = { title: 'Contacto' };

export default function Contact() {
  return <SiteShell>
    <VisualHero image={media.city} alt="Vista aérea de Calama y el desierto" eyebrow="CONTACTO" title={<>Conversemos sobre<br/>su próximo viaje.</>} description="Envíenos su consulta y nuestro equipo se comunicará con usted para coordinar los detalles." />
    <section className="section contact-section"><div className="container contact-grid"><Reveal className="contact-aside"><span className="eyebrow">CONTACTO DIRECTO</span><h2>Su ruta empieza aquí.</h2><p>Si ya conoce los detalles del trayecto, puede registrar su solicitud de reserva. Para cualquier otra consulta, escríbanos directamente.</p><Link href="/reservar" className="button button-dark">Solicitar reserva <ArrowUpRight size={17}/></Link><div className="contact-details"><a href="mailto:contacto@transferatacamachile.cl"><Mail size={19}/><span><small>CORREO ELECTRÓNICO</small>contacto@transferatacamachile.cl</span></a><a href="https://wa.me/56997106497" target="_blank" rel="noopener noreferrer"><Phone size={19}/><span><small>WHATSAPP</small>+56 9 9710 6497</span></a><div><MapPin size={19}/><span><small>UBICACIÓN</small>Calama, Región de Antofagasta</span></div></div></Reveal><Reveal className="form-card" delay={110}><span className="eyebrow">ESCRÍBANOS</span><h3>Envíenos un mensaje</h3><ContactForm/></Reveal></div></section>
    <WhatsAppPill />
  </SiteShell>;
}
