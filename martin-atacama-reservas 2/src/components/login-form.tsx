'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setError(''); const form = e.currentTarget; try { const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: new FormData(form).get('password') }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); router.push('/admin'); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.'); setLoading(false); } }
  return <form onSubmit={submit}><label>Contraseña<input type="password" name="password" autoComplete="current-password" required/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar al panel →'}</button></form>;
}
