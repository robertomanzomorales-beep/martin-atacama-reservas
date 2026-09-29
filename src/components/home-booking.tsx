'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, MapPin, Plane, Route, UsersRound } from 'lucide-react';
import { Reveal } from './reveal';

type Service = 'aeropuerto' | 'san-pedro' | 'empresa' | 'otro';
const services: { value: Service; label: string; icon: typeof Plane }[] = [
  { value: 'aeropuerto', label: 'Aeropuerto', icon: Plane },
  { value: 'san-pedro', label: 'San Pedro', icon: MapPin },
  { value: 'empresa', label: 'Empresa / faena', icon: UsersRound },
  { value: 'otro', label: 'Otro traslado', icon: Route },
];
const places = ['Aeropuerto El Loa, Calama', 'Calama, centro', 'San Pedro de Atacama', 'Hotel / alojamiento', 'Faena minera', 'Otro punto'];
const dateInChile = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export function HomeBooking() {
  const [service, setService] = useState<Service>('aeropuerto');
  const [step, setStep] = useState(1);
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (step === 2) nameRef.current?.focus(); }, [step]);

  function advance() {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-route-field]');
    for (const field of fields || []) if (!field.reportValidity()) return;
    const origin = (formRef.current?.elements.namedItem('origin') as HTMLInputElement | null)?.value.trim();
    const destination = (formRef.current?.elements.namedItem('destination') as HTMLInputElement | null)?.value.trim();
    if (origin && destination && origin.toLocaleLowerCase('es') === destination.toLocaleLowerCase('es')) {
      setError('El origen y el destino deben ser distintos.'); return;
    }
    setError(''); setStep(2);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) { advance(); return; }
    setError(''); setState('sending');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { ...data, service, consent: data.consent === 'on', passengers: Number(data.passengers) };
    try {
      const response = await fetch('/api/reservas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No pudimos registrar la solicitud.');
      setReference(result.reference); setState('sent'); form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos registrar la solicitud.');
      setState('idle');
    }
  }

  return <section className="home-booking-section" id="reservar" aria-labelledby="home-booking-heading"><div className="container">
    <Reveal className="home-booking-shell">
      <div className="home-booking-heading">
        <div><span className="eyebrow">RESERVAS EN LÍNEA</span><h2 id="home-booking-heading">{step === 1 ? 'Planifique su traslado' : 'Sus datos de contacto'}</h2></div>
        <div className="home-booking-progress" aria-label={`Paso ${step} de 2`}><span className={step === 1 ? 'current' : ''}>01 <b>Trayecto</b></span><i/><span className={step === 2 ? 'current' : ''}>02 <b>Contacto</b></span></div>
      </div>
      {state === 'sent' ? <div className="home-booking-success" role="status"><span className="success-icon"><Check size={28}/></span><div><h3>Solicitud recibida</h3><p>Guardamos los datos de su viaje. Nuestro equipo revisará la disponibilidad y se comunicará con usted.</p><strong>Referencia: {reference}</strong></div><button type="button" className="text-link" onClick={() => { setState('idle'); setStep(1); setReference(''); }}>Nueva solicitud <ArrowRight size={16}/></button></div> :
      <form ref={formRef} onSubmit={submit} className="home-booking-form">
        <fieldset className="home-booking-step" hidden={step !== 1}>
          <legend className="sr-only">Detalles del traslado</legend>
          <div className="booking-service-tabs" role="group" aria-label="Tipo de traslado">
            {services.map(option => <button key={option.value} type="button" className={service === option.value ? 'selected' : ''} aria-pressed={service === option.value} onClick={() => setService(option.value)}><option.icon size={18} strokeWidth={1.8}/>{option.label}</button>)}
          </div>
          <div className="home-booking-fields">
            <label className="route-field"><span className="field-label">Origen <span>*</span></span><input data-route-field name="origin" list="home-places" placeholder="Punto de partida" minLength={2} maxLength={120} required autoComplete="off" /></label>
            <label className="route-field"><span className="field-label">Destino <span>*</span></span><input data-route-field name="destination" list="home-places" placeholder="¿A dónde viaja?" minLength={2} maxLength={120} required autoComplete="off" /></label>
            <datalist id="home-places">{places.map(place => <option key={place} value={place}/>)}</datalist>
            <label className="date-field"><span className="field-label">Fecha <span>*</span></span><input data-route-field type="date" name="travelDate" min={dateInChile()} required /></label>
            <label className="time-field"><span className="field-label">Hora <span>*</span></span><input data-route-field type="time" name="travelTime" required /></label>
            <label className="passengers-field"><span className="field-label">Pasajeros <span>*</span></span><input data-route-field type="number" name="passengers" min={1} max={30} defaultValue={1} required /></label>
            <button type="button" className="button button-dark home-booking-next" onClick={advance}>Continuar <ArrowRight size={17}/></button>
          </div>
          <div className="home-booking-bottom route-disclaimer"><p><Check size={15}/> Solicitud sujeta a confirmación de disponibilidad.</p></div>
        </fieldset>
        <fieldset className="home-booking-step home-booking-contact" hidden={step !== 2}>
          <legend className="sr-only">Datos del pasajero</legend>
          <div className="booking-step-heading"><button type="button" onClick={() => { setError(''); setStep(1); }}><ArrowLeft size={17}/> Modificar trayecto</button><span>PASO 02 / DATOS DE CONTACTO</span></div>
          <div className="home-contact-fields"><label><span className="field-label">Nombre completo <span>*</span></span><input ref={nameRef} name="passengerName" placeholder="Nombre y apellido" minLength={2} maxLength={100} autoComplete="name" required={step === 2}/></label><label><span className="field-label">Teléfono / WhatsApp <span>*</span></span><input name="phone" type="tel" placeholder="+56 9 ..." minLength={8} maxLength={30} autoComplete="tel" required={step === 2}/></label><label><span className="field-label">Correo electrónico <span>*</span></span><input name="email" type="email" placeholder="nombre@correo.cl" maxLength={160} autoComplete="email" required={step === 2}/></label><label><span className="field-label">Detalles adicionales</span><input name="notes" placeholder="Vuelo, equipaje u otra indicación" maxLength={1000}/></label></div>
          <label className="home-consent"><input type="checkbox" name="consent" required={step === 2}/><span>Acepto el uso de mis datos para gestionar esta solicitud y contactarme sobre el traslado.</span></label>
          <div className="home-booking-bottom"><p>El envío de la solicitud no confirma automáticamente el viaje.</p><button type="submit" className="button button-dark" disabled={state === 'sending'}>{state === 'sending' ? 'Registrando...' : 'Solicitar reserva'} <ArrowRight size={18}/></button></div>
        </fieldset>
        <label className="honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off"/></label>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>}
    </Reveal>
  </div></section>;
}
