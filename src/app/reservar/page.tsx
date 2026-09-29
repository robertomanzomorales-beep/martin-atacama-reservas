import type { Metadata } from 'next';
import Image from 'next/image';
import { CalendarDays, CheckCircle2, Clock3, Headphones, MapPin } from 'lucide-react';
import { BookingForm } from '@/components/booking-form';
import { Reveal } from '@/components/reveal';
import { SiteShell, WhatsAppPill } from '@/components/site-shell';
import { media } from '@/lib/media';

export const metadata: Metadata = { title: 'Solicitar reserva' };

export default function BookingPage() {
  return <SiteShell>
    <section className="booking-title"><div className="container booking-title-grid">
      <Reveal className="booking-heading"><span className="eyebrow eyebrow-gold">RESERVAS EN LÍNEA</span><h1>Planifiquemos<br/>su traslado.</h1><p>Comparta los datos de su viaje. Revisaremos la disponibilidad y nos comunicaremos con usted para confirmar el servicio.</p></Reveal>
      <Reveal className="booking-title-photo" delay={100}><Image src={media.desert} alt="Camino del desierto de Atacama" fill sizes="(max-width: 820px) 100vw, 50vw" unoptimized priority /></Reveal>
    </div>
    </section>
    <section className="booking-section"><div className="container booking-layout">
      <Reveal className="booking-card"><div className="booking-card-title"><span className="eyebrow">SOLICITUD DE TRASLADO</span><h2>Detalles de su viaje</h2><p>Los campos marcados con * son obligatorios.</p></div><BookingForm/></Reveal>
      <Reveal className="booking-aside" delay={120}><div className="aside-label">ASÍ FUNCIONA</div>
        <div className="step"><span>01</span><div><h3>Solicite su traslado</h3><p>Ingrese la ruta, fecha, horario y sus datos de contacto.</p></div></div>
        <div className="step"><span>02</span><div><h3>Revisamos los detalles</h3><p>Verificamos disponibilidad y, si corresponde, preparamos su cotización.</p></div></div>
        <div className="step"><span>03</span><div><h3>Confirmamos con usted</h3><p>Nuestro equipo le informa las condiciones y confirma el viaje.</p></div></div>
        <div className="aside-note"><CheckCircle2 size={20}/><p>Enviar este formulario registra una <strong>solicitud</strong>. El traslado queda confirmado cuando nuestro equipo se lo comunique.</p></div>
        <div className="aside-contact"><Headphones size={19}/><span>¿Necesita ayuda?<a href="https://wa.me/56997106497" target="_blank" rel="noopener noreferrer">Escríbanos por WhatsApp →</a></span></div>
      </Reveal>
    </div></section>
    <div className="booking-benefits"><Reveal className="container"><span><MapPin size={17}/> Conductores locales</span><span><CalendarDays size={17}/> Planificación de cada viaje</span><span><Clock3 size={17}/> Coordinación directa</span></Reveal></div>
    <WhatsAppPill />
  </SiteShell>;
}
