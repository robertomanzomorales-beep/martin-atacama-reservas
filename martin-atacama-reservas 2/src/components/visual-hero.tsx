import Image from 'next/image';
import type { ReactNode } from 'react';

export function VisualHero({ image, alt, eyebrow, title, description }: { image: string; alt: string; eyebrow: string; title: ReactNode; description: string }) {
  return <section className="hero inner-hero visual-page-hero">
    <div className="inner-hero-ambient" style={{ backgroundImage: `url("${image}")` }}/>
    <div className="inner-hero-photo"><Image src={image} alt={alt} fill sizes="100vw" unoptimized priority /></div>
    <div className="inner-hero-shade" />
    <div className="container inner-hero-content"><span className="eyebrow eyebrow-gold">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
  </section>;
}
