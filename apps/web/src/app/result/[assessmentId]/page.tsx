import { notFound } from 'next/navigation';
import { RiasecRadarChart, RiasecRadarPoint } from '../../../components/RiasecRadarChart';
import { SendReportButton } from '../../../components/SendReportButton';
import { ApiEndpoints } from '../../../lib/api/endpoints';
import { ApiClientError, backendApiClient } from '../../../lib/api/http-client';

const DIMENSION_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

const MOCK_OCCUPATIONS: Record<string, string[]> = {
  R: ['Technicien en maintenance', 'Ingénieur civil', 'Charpentier', 'Mécanicien naval', 'Agriculteur biologique'],
  I: ['Chercheur en data science', 'Biologiste marin', 'Statisticien', 'Ingénieur R&D', 'Analyste climatique'],
  A: ['Designer UX/UI', 'Réalisateur multimédia', 'Illustrateur', 'Musicien compositeur', 'Architecte d’intérieur'],
  S: ['Coach carrière', 'Psychologue scolaire', 'Infirmier coordinateur', 'Animateur socio-culturel', 'Conseiller insertion'],
  E: ['Entrepreneur social', 'Consultant innovation', 'Directeur commercial', 'Chef de produit digital', 'Manager incubateur'],
  C: ['Responsable conformité', 'Gestionnaire administratif', 'Contrôleur de gestion', 'Archiviste numérique', 'Coordinateur logistique'],
};

type AssessmentResultResponse = {
  assessmentId: string;
  profileCode: string;
  top3: string[];
  scores: Record<string, number>;
  normalized: Record<string, number>;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
    ageBracket: string | null;
  };
};

async function fetchAssessmentResult(assessmentId: string): Promise<AssessmentResultResponse | null> {
  try {
    const response = await backendApiClient.get<AssessmentResultResponse>(
      ApiEndpoints.backend.assessments.result(assessmentId),
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      if (error.status === 404) {
        return null;
      }

      throw new Error(error.message || 'Impossible de récupérer le résultat RIASEC');
    }

    throw error;
  }
}

function buildRadarData(normalized: Record<string, number>): RiasecRadarPoint[] {
  return DIMENSION_ORDER.map((dimension) => ({
    dimension,
    value: Number((normalized[dimension] ?? 0).toFixed(2)),
  }));
}

function buildOccupationSuggestions(top3: string[]): string[] {
  const suggestions = new Set<string>();

  top3.forEach((dimension) => {
    const entries = MOCK_OCCUPATIONS[dimension] ?? [];
    entries.slice(0, 2).forEach((job) => suggestions.add(job));
  });

  if (suggestions.size < 5) {
    DIMENSION_ORDER.forEach((dimension) => {
      if (suggestions.size >= 5) return;
      (MOCK_OCCUPATIONS[dimension] ?? []).forEach((job) => {
        if (suggestions.size < 5) {
          suggestions.add(job);
        }
      });
    });
  }

  return Array.from(suggestions).slice(0, 5);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export const revalidate = 60;

type PageProps = {
  params: Promise<{ assessmentId: string }>;
};

export default async function AssessmentResultPage({ params }: PageProps) {
  const { assessmentId } = await params;
  const result = await fetchAssessmentResult(assessmentId);

  if (!result) {
    notFound();
  }

  const radarData = buildRadarData(result.normalized);
  const occupations = buildOccupationSuggestions(result.top3);
  const profileCode = result.profileCode || 'RIASEC';

  return (
    <main className="min-h-screen bg-slate-950 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="flex flex-col gap-4 rounded-3xl bg-slate-900/80 p-8 shadow-2xl shadow-indigo-900/20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-widest text-indigo-400">Profil RIASEC</p>
              <h1 className="text-4xl font-bold text-slate-50 sm:text-5xl">{profileCode}</h1>
              <p className="text-sm text-slate-400">
                Évaluation réalisée le {formatDate(result.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-indigo-500/10 px-5 py-3 text-indigo-100">
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-300">Top 3</span>
              <span className="text-2xl font-semibold text-indigo-100">{result.top3.join(' - ')}</span>
            </div>
          </div>
          {result.user?.email && (
            <p className="text-sm text-slate-400">Rapport destiné à : {result.user.email}</p>
          )}
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-6">
            <RiasecRadarChart data={radarData} profileCode={profileCode} />
            <div className="rounded-2xl bg-slate-900/80 p-6 shadow-lg shadow-indigo-900/10">
              <h2 className="text-xl font-semibold text-slate-100">Votre dynamique RIASEC</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Chaque dimension est normalisée de 0 à 100. Les zones les plus lumineuses du radar soulignent vos domaines
                d&apos;excellence actuels. Explorez les ressources suggérées pour développer davantage vos forces.
              </p>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl bg-slate-900/80 p-6 shadow-lg shadow-indigo-900/10">
              <h2 className="text-lg font-semibold text-slate-100">5 métiers compatibles</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {occupations.map((job) => (
                  <li key={job} className="flex items-center gap-3 rounded-lg bg-slate-800/60 px-4 py-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400" aria-hidden />
                    {job}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-400 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-white">Recevez votre rapport complet</h2>
              <p className="mt-2 text-sm text-indigo-100">
                Un PDF personnalisé avec vos résultats détaillés et des recommandations supplémentaires peut vous être envoyé en un clic.
              </p>
              <div className="mt-4">
                <SendReportButton assessmentId={assessmentId} />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
