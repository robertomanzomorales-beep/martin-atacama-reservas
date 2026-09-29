'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/reservar', label: 'Reservar traslado' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      const focusable = Array.from(document.querySelectorAll<HTMLElement>('.mobile-panel a, .mobile-panel button')).filter(item => item.getClientRects().length);
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); trigger?.focus(); };
  }, [open]);

  return <div className="mobile-wrap">
    <button ref={triggerRef} type="button" className="menu-button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Abrir menú"><Menu size={25}/><span>Menú</span></button>
    <div className={`mobile-overlay ${open ? 'open' : ''}`} aria-hidden={!open} onClick={() => setOpen(false)} />
    <div id="mobile-navigation" className={`mobile-panel ${open ? 'open' : ''}`} role="dialog" aria-modal={open} aria-label="Navegación" aria-hidden={!open} inert={!open}>
      <div className="mobile-panel-top"><span>Martín Atacama Transfers</span><button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X size={23}/></button></div>
      <nav aria-label="Navegación móvil">{links.map((link, index) => <Link href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? 'page' : undefined} key={link.href}><span>0{index + 1}</span>{link.label}<ArrowUpRight size={19}/></Link>)}</nav>
      <div className="mobile-panel-footer"><span>PLANIFIQUE SU PRÓXIMO VIAJE</span><a href="tel:+56997106497">+56 9 9710 6497</a><a href="mailto:contacto@transferatacamachile.cl">contacto@transferatacamachile.cl</a></div>
    </div>
  </div>;
}
