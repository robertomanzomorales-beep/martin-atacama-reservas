'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function FloatingWhatsApp() {
  const [footerCreditVisible, setFooterCreditVisible] = useState(false);

  useEffect(() => {
    const footerCredit = document.querySelector('.footer-bottom');
    if (!footerCredit) return;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterCreditVisible(entry.isIntersecting);
    });
    observer.observe(footerCredit);
    return () => observer.disconnect();
  }, []);

  return <a
    className={`whatsapp-pill${footerCreditVisible ? ' is-footer-visible' : ''}`}
    href="https://wa.me/56997106497"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Consultar traslado por WhatsApp"
  >
    <span>¿Necesita transporte?</span>
    <span className="whatsapp-icon"><Image src="/images/whatsapp-white.webp" width={24} height={24} alt="" unoptimized /></span>
  </a>;
}
