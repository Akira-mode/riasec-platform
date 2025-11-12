'use client';

import { useState } from 'react';

type SendReportButtonProps = {
  assessmentId: string;
};

export function SendReportButton({ assessmentId }: SendReportButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = async () => {
    if (status === 'loading') return;
    setStatus('loading');

    try {
      // Placeholder implementation. Replace with real endpoint when available.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
    } catch (error) {
      console.error('Unable to queue report email', error);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-400"
      disabled={status === 'loading'}
    >
      {status === 'loading' && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {status === 'success'
        ? 'Rapport envoyé !'
        : status === 'error'
        ? 'Réessayer'
        : 'Recevoir mon rapport PDF par email'}
    </button>
  );
}
