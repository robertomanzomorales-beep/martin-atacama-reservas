import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin, Plane, ShieldCheck } from 'lucide-react';
import { HeroSlider } from '@/components/hero-slider';
import { HomeBooking } from '@/components/home-booking';
import { Reveal } from '@/components/reveal';
import { SiteShell, WhatsAppPill } from '@/components/site-shell';
import { media } from '@/lib/media';

const services = [
  { number: '01', tag: 'CALAMA · SAN PEDRO', title: 'De la ciudad al desierto', text: 'Un traslado privado para recorrer la ruta a San Pedro con comodidad y puntualidad.', image: media.sanPedro, alt: 'Calles de San Pedro de Atacama', icon: MapPin },
  { number: '02', tag: 'FAENAS MINERAS', title: 'Movilidad para su equipo', text: 'Servicios para empresas y contratistas, coordinados según sus turnos y necesidades.', image: media.workers, alt: 'Personal trabajando en faena minera', icon: ShieldCheck },
  { number: '03', tag: 'AEROPUERTO EL LOA', title: 'Llegue sin contratiempos', text: 'Traslados desde y hacia el aeropuerto de Calama, ajustados al horario de su vuelo.', image: media.taxi, alt: 'Vehículo de traslado frente al aeropuerto de Calama', icon: Plane },
];

export default function Home() {
  return <SiteShell>
    <HeroSlider />
    <HomeBooking />

    <section className="intro-section section"><div className="container intro-grid">
      <Reveal><span className="eyebrow">NOSOTROS / EXPERIENCIA LOCAL</span><h2>Conocemos cada ruta.<br/><span>Usted disfruta el viaje.</span></h2></Reveal>
      <Reveal className="intro-text" delay={120}><p>Martín Atacama Transfers conecta Calama, el aeropuerto, San Pedro de Atacama y las rutas de la región con un servicio de transporte privado pensado para cada pasajero.</p><p>Más de 10 años de experiencia, un equipo local y una flota confortable nos permiten coordinar cada traslado con atención a los horarios y a las condiciones del desierto.</p><Link href="/nosotros" className="text-link">Conozca nuestra historia <ArrowUpRight size={17}/></Link></Reveal>
    </div></section>

    <section className="services-section section"><div className="container">
      <Reveal className="section-heading"><div><span className="eyebrow">NUESTROS SERVICIOS</span><h2>Un traslado para<br/><span>cada destino.</span></h2></div><p>Viajes particulares y corporativos, organizados con la tranquilidad de contar con conductores que conocen la zona.</p></Reveal>
      <div className="service-grid">{services.map((service, index) => <Reveal key={service.number} delay={index * 90}><article className="service-card premium-service-card"><div className="service-photo"><Image src={service.image} alt={service.alt} fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /><span className="service-photo-shade" /></div><div className="service-card-body"><div className="service-card-label"><service.icon size={19} strokeWidth={1.7}/><span>{service.tag}</span></div><h3>{service.title}</h3><p>{service.text}</p><Link href="/reservar" aria-label={`Reservar traslado: ${service.title}`} className="service-card-link">Planificar traslado <ArrowUpRight size={17}/></Link></div></article></Reveal>)}</div>
    </div></section>

    <section className="feature-section"><Reveal className="feature-image"><Image src={media.desert} alt="Camino del desierto de Atacama" fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></Reveal><div className="feature-content"><Reveal><span className="eyebrow eyebrow-gold">EL VALOR DE CONOCER EL CAMINO</span><h2>El desierto se disfruta más cuando está en buenas manos.</h2><p>Con más de una década recorriendo la Región de Antofagasta, planificamos traslados para pasajeros, turistas y empresas con conocimiento real del territorio.</p><div className="feature-stats"><div><strong>10+</strong><span>años de experiencia</span></div><div><strong>24/7</strong><span>solicitudes en línea</span></div></div><Link href="/nosotros" className="button button-outline">Conozca nuestro servicio <ArrowRight size={17}/></Link></Reveal></div></section>

    <section className="reservation-promo" aria-labelledby="reservation-promo-title">
      <Image src="/images/spa3.webp" alt="Géiseres y paisaje del desierto de Atacama" fill sizes="100vw" unoptimized className="reservation-promo-photo" />
      <div className="reservation-promo-shade" aria-hidden="true" />
      <div className="container reservation-promo-inner"><Reveal className="reservation-promo-copy">
        <span className="reservation-promo-eyebrow">NUEVO · RESERVAS EN LÍNEA</span>
        <h2 id="reservation-promo-title">Solicite su traslado y pague en linea</h2>
        <p>Indíquenos origen, destino, fecha y pasajeros. Revisaremos la disponibilidad y le enviaremos los detalles para confirmar el servicio.</p>
        <a href="#reservar" className="button button-yellow">Ir a reservas en línea <ArrowUpRight size={18}/></a>
      </Reveal></div>
    </section>
    <WhatsAppPill />
  </SiteShell>;
}
