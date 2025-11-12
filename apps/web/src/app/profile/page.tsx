'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ProfileRadar,
  RiasecHistoryEntry,
} from '../../components/ProfileRadar';
import { ApiEndpoints } from '../../lib/api/endpoints';
import { ApiClientError, webApiClient } from '../../lib/api/http-client';

interface ProfileResponse {
  latest: RiasecHistoryEntry | null;
  previous: RiasecHistoryEntry | null;
  evolution: Record<string, number> | null;
  history: RiasecHistoryEntry[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'unauthorized'
  >('loading');
  const [message, setMessage] = useState<string>('');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await webApiClient.get<ProfileResponse>(
          ApiEndpoints.web.profile,
          {
            headers: {
              'Cache-Control': 'no-store',
            },
          }
        );

        setProfile(response.data);
        setStatus('success');
      } catch (unknownError: unknown) {
        if (unknownError instanceof ApiClientError) {
          const error: ApiClientError = unknownError;

          if (error.status === 401) {
            setStatus('unauthorized');
            setMessage(
              'Vous devez être connecté pour consulter votre profil RIASEC.'
            );
            return;
          }

          setMessage(error.message || 'Profil indisponible.');
          setStatus('error');
          return;
        }

        console.error('Profile fetch error', unknownError);
        setMessage('Impossible de charger votre profil. Réessayez plus tard.');
        setStatus('error');
      }
    };

    fetchProfile().catch((unknownError: unknown) => {
      console.error('Unexpected profile error', unknownError);
      setStatus('error');
      setMessage('Erreur inattendue.');
    });
  }, []);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-3xl bg-slate-900/90 px-6 py-4 text-slate-300 shadow shadow-indigo-900/30">
          Chargement du profil…
        </div>
      </main>
    );
  }

  if (status === 'unauthorized') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="max-w-lg rounded-3xl bg-slate-900/90 p-8 text-center text-slate-300 shadow shadow-indigo-900/30">
          <h1 className="text-2xl font-semibold text-slate-100">
            Accès restreint
          </h1>
          <p className="mt-3 text-sm text-slate-400">{message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow shadow-indigo-900/30 transition hover:bg-indigo-700"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-200"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="max-w-lg rounded-3xl bg-rose-600/10 p-8 text-center text-rose-200 shadow shadow-rose-900/20">
          <h1 className="text-2xl font-semibold">Profil indisponible</h1>
          <p className="mt-3 text-sm text-rose-100">{message}</p>
        </div>
      </main>
    );
  }

  if (!profile || !profile.latest) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="max-w-lg rounded-3xl bg-slate-900/80 p-8 text-center text-slate-300 shadow shadow-indigo-900/30">
          <h1 className="text-2xl font-semibold text-slate-100">
            Aucun résultat enregistré
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Vous n’avez pas encore réalisé de test RIASEC. Lancez-vous pour
            obtenir votre profil personnalisé.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow shadow-indigo-900/30 transition hover:bg-indigo-700"
          >
            Voir les étapes du parcours
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">
              Mon profil RIASEC
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">
              {profile.latest.profileCode} — {profile.latest.top3.join(' - ')}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Visualisez l’évolution de vos dimensions et vos forces
              principales.
            </p>
          </div>
          <div className="rounded-full bg-indigo-500/10 px-5 py-2 text-sm font-medium text-indigo-100 shadow shadow-indigo-900/20">
            Dernier test :{' '}
            {new Intl.DateTimeFormat('fr-FR').format(
              new Date(profile.latest.createdAt)
            )}
          </div>
        </header>

        <ProfileRadar history={profile.history} evolution={profile.evolution} />
      </div>
    </main>
  );
}
