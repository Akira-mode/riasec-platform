'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';

type AgeBracket = '15-18' | '19-25' | '26-35' | '36+';
type Role = 'etudiant' | 'coach' | 'admin';

type SignupState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
};

const ageBracketOptions: Array<{ value: AgeBracket; label: string }> = [
  { value: '15-18', label: '15 – 18 ans' },
  { value: '19-25', label: '19 – 25 ans' },
  { value: '26-35', label: '26 – 35 ans' },
  { value: '36+', label: '36 ans et +' },
];

const roleOptions: Array<{ value: Role; label: string }> = [
  { value: 'etudiant', label: 'Étudiant' },
  { value: 'coach', label: 'Coach' },
  { value: 'admin', label: 'Administrateur' },
];

const initialState: SignupState = {
  status: 'idle',
  message: null,
};

export default function SignupPage() {
  const [state, setState] = useState<SignupState>(initialState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageBracket, setAgeBracket] = useState<AgeBracket>('19-25');
  const [role, setRole] = useState<Role>('etudiant');

  const apiBase = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const trimmed = raw.replace(/\/$/, '');
    const base = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    return base;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: 'loading', message: null });

    try {
      const response = await fetch(`${apiBase}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, ageBracket, role }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message =
          typeof payload.message === 'string'
            ? payload.message
            : Array.isArray(payload.message)
            ? payload.message.join(', ')
            : "L'inscription a échoué. Réessayez.";
        setState({ status: 'error', message });
        return;
      }

      const { message } = await response.json();
      setState({ status: 'success', message });
      setPassword('');
    } catch (error) {
      setState({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <section className="mx-auto w-full max-w-xl rounded-2xl bg-white p-10 shadow-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Créer un compte SAINA
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Renseignez vos informations pour recevoir un email
            d&apos;activation.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="vous@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500">8 caractères minimum.</p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="ageBracket"
              className="text-sm font-medium text-slate-700"
            >
              Tranche d&apos;âge
            </label>
            <select
              id="ageBracket"
              value={ageBracket}
              onChange={(event) =>
                setAgeBracket(event.target.value as AgeBracket)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {ageBracketOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="text-sm font-medium text-slate-700"
            >
              Rôle
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {roleOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {state.message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                state.status === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={state.status === 'loading'}
            className="w-full rounded-lg bg-indigo-600 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {state.status === 'loading'
              ? 'Inscription en cours…'
              : "S'inscrire"}
          </button>
        </form>

        <footer className="mt-8 text-center text-sm text-slate-500">
          Déjà inscrit ?{' '}
          <Link
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Retour à l&apos;accueil
          </Link>
        </footer>
      </section>
    </main>
  );
}
