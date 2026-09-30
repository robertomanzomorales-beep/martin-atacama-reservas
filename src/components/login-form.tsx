'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: new FormData(event.currentTarget).get('password') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="admin-password">Contraseña</label>
      <div className="login-password-field">
        <input id="admin-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Ingrese su contraseña" required />
        <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          {showPassword ? <EyeOff size={19} strokeWidth={1.8} /> : <Eye size={19} strokeWidth={1.8} />}
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="login-submit" type="submit" disabled={loading}>
        <span>{loading ? 'Ingresando…' : 'Ingresar al panel'}</span>
        <ArrowRight size={18} strokeWidth={1.8} />
      </button>
    </form>
  );
}
