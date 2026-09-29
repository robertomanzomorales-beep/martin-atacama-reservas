import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Compass, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { SiteShell, WhatsAppPill } from '@/components/site-shell';
import { VisualHero } from '@/components/visual-hero';
import { media } from '@/lib/media';

export const metadata: Metadata = { title: 'Nosotros' };

const fleet = [
  { src: media.taxi, alt: 'Taxi de traslado en el aeropuerto de Calama' },
  { src: media.vanMine, alt: 'Van de Martín Atacama Transfers en ruta a faena' },
  { src: media.vanDesert, alt: 'Vehículo de Martín Atacama Transfers en el desierto' },
];

export default function About() {
  return <SiteShell>
    <VisualHero image={media.entrance} alt="Acceso monumental a Calama" eyebrow="NUESTRA HISTORIA" title={<>Una trayectoria que<br/>inspira confianza.</>} description="Transporte privado entre Calama, el aeropuerto y San Pedro de Atacama, operado por un equipo que conoce el territorio." />
    <section className="section about-intro"><div className="container intro-grid"><Reveal><span className="eyebrow">QUIÉNES SOMOS</span><h2>Experiencia local en<br/><span>cada recorrido.</span></h2></Reveal><Reveal className="intro-text" delay={120}><p>Somos una empresa de traslados privados con más de 10 años de experiencia en la Región de Antofagasta. Conocemos los tiempos, el clima y las condiciones de las rutas entre Calama, el aeropuerto y San Pedro de Atacama.</p><p>Atendemos a pasajeros, turistas y empresas con puntualidad, comunicación clara y un servicio adaptado a cada viaje.</p></Reveal></div></section>
    <section className="section values-section"><div className="container values-grid"><Reveal><article><HeartHandshake size={28} strokeWidth={1.6}/><span className="eyebrow">MISIÓN</span><h3>Cuidar cada trayecto.</h3><p>Ofrecer transporte privado seguro y oportuno, con atención cercana y viajes cómodos para cada pasajero.</p></article></Reveal><Reveal delay={90}><article><Compass size={28} strokeWidth={1.6}/><span className="eyebrow">VISIÓN</span><h3>Seguir avanzando.</h3><p>Ser una referencia regional por nuestra experiencia local, capacidad de respuesta y calidad del servicio.</p></article></Reveal><Reveal delay={180}><article><ShieldCheck size={28} strokeWidth={1.6}/><span className="eyebrow">COMPROMISO</span><h3>Viajar con confianza.</h3><p>Conductores locales, vehículos preparados y una coordinación atenta a las necesidades de cada servicio.</p></article></Reveal></div></section>
    <section className="fleet-section"><div className="container fleet-grid"><Reveal className="fleet-copy"><span className="eyebrow eyebrow-gold">NUESTRA FLOTA</span><h2>Vehículos preparados para las rutas del norte.</h2><p>Contamos con vehículos modernos y confortables, con aire acondicionado y mantención al día. Cada viaje se coordina para ofrecer una experiencia cómoda y puntual.</p><Link href="/reservar" className="button button-yellow">Coordinar traslado <ArrowUpRight size={18}/></Link></Reveal><Reveal className="fleet-gallery" delay={120}>{fleet.map((photo, index) => <div key={photo.src} className={`fleet-photo fleet-photo-${index + 1}`} style={{ backgroundImage: `url("${photo.src}")` }}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 100vw, 25vw" unoptimized /></div>)}</Reveal></div></section>
    <WhatsAppPill />
  </SiteShell>;
}
