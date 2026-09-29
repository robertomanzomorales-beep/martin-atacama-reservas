'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return <div className="mobile-wrap"><button type="button" className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X/> : <Menu/>}</button>{open && <nav className="mobile-menu" aria-label="Navegación móvil" onClick={() => setOpen(false)}><Link href="/">Inicio</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link><Link href="/reservar">Reservar traslado →</Link></nav>}</div>;
}
