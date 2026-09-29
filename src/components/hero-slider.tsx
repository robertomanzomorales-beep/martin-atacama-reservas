'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { media } from '@/lib/media';

const slides = [
  {
    image: media.airport,
    alt: 'Acceso al aeropuerto de Calama',
    eyebrow: 'TRASLADOS CALAMA · SAN PEDRO',
    title: <>Transporte seguro<br /><em>y puntual.</em></>,
    description: 'Viajes privados entre Calama, el aeropuerto y San Pedro de Atacama, coordinados con experiencia local.',
  },
  {
    image: media.entrance,
    alt: 'Acceso monumental a la ciudad de Calama',
    eyebrow: 'CALAMA · SERVICIOS A EMPRESAS',
    title: <>Su equipo llega<br />a tiempo, siempre.</>,
    description: 'Rutas a faenas y transporte para empresas, coordinados según sus turnos y necesidades.',
  },
  {
    image: media.desert,
    alt: 'Camino entre las montañas del desierto de Atacama',
    eyebrow: 'MÁS DE 10 AÑOS EN LA REGIÓN',
    title: <>El desierto se vive<br />con confianza.</>,
    description: 'Viajes a San Pedro de Atacama y otros destinos con la experiencia de conductores locales.',
  },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => setActive(current => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(interval);
  }, [paused]);

  const move = (direction: number) => setActive(current => (current + direction + slides.length) % slides.length);

  return <section className="home-slider" aria-label="Destinos y servicios destacados" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    {slides.map((slide, index) => <div className={`hero-slide ${index === active ? 'is-active' : ''}`} key={slide.image} aria-hidden={index !== active} inert={index !== active}>
      <div className="hero-visual">
        <Image src={slide.image} alt={slide.alt} fill sizes="100vw" unoptimized priority={index === 0} className="hero-photo" />
      </div>
      <div className="hero-shade" />
      <div className="container hero-slide-inner">
        <div className="hero-slide-content">
          <span className="hero-kicker"><span />{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          <p>{slide.description}</p>
          <div className="hero-slide-actions">
            <a className="button button-yellow" href="#reservar">Planificar traslado <ArrowUpRight size={17} /></a>
            <Link href="/nosotros" className="hero-secondary">Conozca nuestro servicio <ArrowRight size={17} /></Link>
          </div>
        </div>
      </div>
    </div>)}
    <div className="hero-controls">
      <button className="hero-arrow hero-prev" type="button" onClick={() => move(-1)} aria-label="Diapositiva anterior"><ChevronLeft size={23}/></button>
      <div className="hero-dots" aria-label="Seleccionar diapositiva">{slides.map((slide, index) => <button type="button" key={slide.eyebrow} onClick={() => setActive(index)} className={index === active ? 'active' : ''} aria-label={`Mostrar diapositiva ${index + 1}`} aria-current={index === active ? 'true' : undefined}><span /></button>)}</div>
      <button className="hero-arrow hero-next" type="button" onClick={() => move(1)} aria-label="Diapositiva siguiente"><ChevronRight size={23}/></button>
    </div>
  </section>;
}
