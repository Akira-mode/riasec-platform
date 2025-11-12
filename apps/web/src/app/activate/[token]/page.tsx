import Link from 'next/link';
import { ApiEndpoints } from '../../../lib/api/endpoints';
import {
  ApiClientError,
  backendApiClient,
} from '../../../lib/api/http-client';

async function activateAccount(token: string) {
  try {
    const response = await backendApiClient.get(
      ApiEndpoints.backend.auth.activate(token),
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw new Error(error.message || 'Activation impossible.');
    }

    throw error;
  }
}

type ActivatePageProps = {
  params: Promise<{ token: string }>;
};

export default async function ActivatePage({ params }: ActivatePageProps) {
  const resolvedParams = await params;
  const successMessage = 'Compte activé !';
  let error: string | null = null;

  try {
    await activateAccount(resolvedParams.token);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Activation impossible.';
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <section
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '48px',
          maxWidth: '440px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '16px',
            color: '#111827',
          }}
        >
          {error ? 'Activation refusée' : 'Compte activé !'}
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#4b5563',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          {error ?? successMessage}
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </section>
    </main>
  );
}
