'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ApiEndpoints } from '../../lib/api/endpoints';
import {
  ApiClientError,
  webApiClient,
} from '../../lib/api/http-client';

interface LoginFormState {
  email: string;
  password: string;
}

const initialState: LoginFormState = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: keyof LoginFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === 'loading') return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      await webApiClient.post(ApiEndpoints.web.auth.login, form);

      setStatus('success');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 800);
    } catch (error: unknown) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message || 'Identifiants invalides');
        setStatus('error');
        return;
      }

      console.error('Login error', error);
      setErrorMessage(
        "Impossible de se connecter. Réessayez plus tard."
      );
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl bg-slate-900/90 p-10 shadow-2xl shadow-indigo-900/30">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-50">Connexion</h1>
          <p className="mt-2 text-sm text-slate-400">
            Accédez à votre espace pour poursuivre votre parcours RIASEC.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="vous@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange('password')}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {status === 'loading' ? 'Connexion en cours…' : status === 'success' ? 'Connexion réussie !' : 'Se connecter'}
          </button>
        </form>

        <footer className="mt-8 text-center text-sm text-slate-400">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="font-semibold text-indigo-300 hover:text-indigo-200">
            Créer mon compte
          </Link>
        </footer>
      </section>
    </main>
  );
}
