import Image from 'next/image';
import type { ReactNode } from 'react';
import { Reveal } from './reveal';

export function VisualHero({ image, alt, eyebrow, title, description }: { image: string; alt: string; eyebrow: string; title: ReactNode; description: string }) {
  return <section className="hero inner-hero visual-page-hero">
    <div className="inner-hero-photo"><Image src={image} alt={alt} fill sizes="100vw" unoptimized priority /></div>
    <div className="inner-hero-shade" />
    <Reveal className="container inner-hero-content"><span className="eyebrow eyebrow-gold">{eyebrow}</span><h1>{title}</h1><p>{description}</p></Reveal>
  </section>;
}
