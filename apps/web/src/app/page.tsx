import React from 'react';

const epics = [
  {
    title: 'Épic 1 — Fondations techniques',
    focus: 'Monorepo Nx, Auth, Docker, seed questions & métiers.',
    deliverables: ['Setup Nx (Next.js + NestJS)', 'Auth JWT + rôles', 'Migrations + seed RIASEC initial'],
  },
  {
    title: 'Épic 2 — Quiz & scoring RIASEC',
    focus: 'Expérience quiz complète, scoring pondéré et workflow n8n.',
    deliverables: ['POST /assessments', 'Questions dynamiques par tranche', 'Workflow n8n “RIASEC Score”'],
  },
  {
    title: 'Épic 3 — Recommandations métiers & ressources',
    focus: 'Matching métiers, emails personnalisés, carte orientation.',
    deliverables: ['Table occupations/resources', 'API recommandations', 'Workflow “Resources Builder”'],
  },
  {
    title: 'Épic 4 — Automatisations utilisateurs',
    focus: 'Workflows n8n (Bienvenue, Relance, Coach Alert) et logging.',
    deliverables: ['Séquences emails', 'Alertes Slack/Teams', 'Webhook logger NestJS'],
  },
  {
    title: 'Épic 5 — Dashboard & analytics',
    focus: 'Vue coach, distribution RIASEC, exports & digest hebdo.',
    deliverables: ['Dashboard coaches', 'Exports CSV', 'Workflow “Weekly Digest”'],
  },
];

const workflows = [
  {
    name: 'RIASEC Score',
    description:
      'Réception des réponses du quiz, calcul du profil via NestJS, stockage des résultats, email PDF & alerte coach.',
  },
  {
    name: 'Welcome & Reminder',
    description: 'Séquence d’emails J0/J+3 pour engager les nouveaux inscrits et rappeler le quiz.',
  },
  {
    name: 'Coach Alert',
    description: 'Détection des profils atypiques (dimension faible/forte) et notification Slack/Teams au coach.',
  },
  {
    name: 'Weekly Digest',
    description: 'Agrégation des stats RIASEC envoyées au staff chaque semaine.',
  },
  {
    name: 'Mentor Matching',
    description: 'Automatisation de la mise en relation mentor/mentoré selon les affinités RIASEC.',
  },
  {
    name: 'Opportunity Alert',
    description: 'Push des offres d’emploi/stage pertinentes vers les étudiants compatibles.',
  },
];

const roadmap = [
  { sprint: 'S1', items: ['Setup Nx monorepo & Docker', 'Auth + seed questions', 'Pipeline CI de base'] },
  { sprint: 'S2', items: ['Quiz complet', 'Workflow “RIASEC Score”', 'Stockage résultats + profil utilisateur'] },
  { sprint: 'S3', items: ['Matching métiers/ressources', 'Emails personnalisés', 'Carte centres orientation'] },
  { sprint: 'S4', items: ['Dashboard coach', 'Alertes & relances', 'Logging n8n → NestJS'] },
  { sprint: 'S5', items: ['Mentorat & analytics historiques', 'Exports BI', 'Digest mensuel personnalisé'] },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 py-20">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-300 blur-3xl" />
          <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-sky-300 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 text-white md:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Plateforme d’orientation RIASEC
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Quiz, scoring et automatisations pour révéler le potentiel professionnel de chaque étudiant.
            </h1>
            <p className="mt-4 text-lg text-indigo-50/90">
              Une solution unifiée : Next.js pour l’expérience utilisateur, NestJS pour les services métier, n8n pour orchestrer
              les workflows, PostgreSQL + Prisma pour sécuriser les données, et des intégrations (Sendgrid, Slack, CRM) pour engager
              étudiants et coachs.
            </p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <dt className="text-sm uppercase tracking-wide text-indigo-100">Technologies clés</dt>
              <dd className="mt-2 text-base">Next.js, NestJS, n8n, PostgreSQL, Prisma, Tailwind</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <dt className="text-sm uppercase tracking-wide text-indigo-100">Intégrations</dt>
              <dd className="mt-2 text-base">Sendgrid (emails), Slack (alertes), CRM partenaires</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <dt className="text-sm uppercase tracking-wide text-indigo-100">KPI cibles</dt>
              <dd className="mt-2 text-base">90&nbsp;% quiz complétés, &lt;5&nbsp;s de latence pour le scoring, NPS &gt; 7</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <dt className="text-sm uppercase tracking-wide text-indigo-100">Vision</dt>
              <dd className="mt-2 text-base">Offrir un parcours personnalisé, du quiz RIASEC au mentorat.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="text-2xl font-semibold text-slate-100">Architecture cible</h2>
          <p className="mt-4 text-slate-400">
            L’écosystème repose sur trois couches principales : une SPA Next.js pour les utilisateurs et coachs, un backend NestJS
            structuré en modules (Auth, Assessments, Recommendations, Users) et un orchestrateur n8n pour les workflows
            automatisés (scoring, emails, notifications). PostgreSQL + Prisma assurent la persistance, tandis que Sendgrid et Slack
            complètent les intégrations métiers.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold text-slate-100">Front Next.js</h3>
              <p className="mt-2 text-sm text-slate-400">
                Expérience quiz, tableau de bord coach, page publique de résultat partageable, mentorat et analytics.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold text-slate-100">Backend NestJS</h3>
              <p className="mt-2 text-sm text-slate-400">
                Modules Auth, Assessments, Recommendations, Users. Calculs pondérés RIASEC, historique multi-tests, APIs publiques et sécurisées.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold text-slate-100">Automatisation n8n</h3>
              <p className="mt-2 text-sm text-slate-400">
                Workflows pour scoring, emails, alertes coach, digest, synchronisation CRM et suivi des offres/opportunités.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-100">Parcours utilisateur</h2>
              <p className="mt-3 text-slate-400">
                De l’inscription au mentorat, chaque étape est orchestrée pour fournir une expérience fluide autant pour l’étudiant que
                pour le coach.
              </p>
            </div>
          </div>
          <ol className="mt-8 grid gap-6 lg:grid-cols-3">
            <li className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-indigo-900/10">
              <span className="text-sm font-semibold uppercase tracking-wide text-indigo-400">1. Inscription & activation</span>
              <p className="mt-3 text-sm text-slate-300">
                Formulaire Next.js → `POST /auth/signup` → email Sendgrid (activation). Capture tranche d’âge, consentements, profil initial.
              </p>
            </li>
            <li className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-indigo-900/10">
              <span className="text-sm font-semibold uppercase tracking-wide text-indigo-400">2. Quiz RIASEC</span>
              <p className="mt-3 text-sm text-slate-300">
                `POST /assessments` crée la session. Questions filtrées selon tranche d’âge. n8n reçoit les réponses, calcule et stocke le profil.
              </p>
            </li>
            <li className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-indigo-900/10">
              <span className="text-sm font-semibold uppercase tracking-wide text-indigo-400">3. Recommandations & suivi</span>
              <p className="mt-3 text-sm text-slate-300">
                Recommandations métiers/ressources, mentorat, analytics, opportunités partenaires et exports BI complètent le parcours.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="text-2xl font-semibold text-slate-100">Backlog épics prioritaires</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {epics.map((epic) => (
              <article key={epic.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-indigo-900/10">
                <h3 className="text-lg font-semibold text-slate-100">{epic.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{epic.focus}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {epic.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="text-2xl font-semibold text-slate-100">Workflows n8n clés</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {workflows.map((flow) => (
              <article key={flow.name} className="rounded-3xl border border-indigo-900/40 bg-indigo-500/10 p-6">
                <h3 className="text-base font-semibold text-indigo-100">{flow.name}</h3>
                <p className="mt-2 text-sm text-indigo-100/80">{flow.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="text-2xl font-semibold text-slate-100">Roadmap indicative (S1 → S5)</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {roadmap.map((entry) => (
              <div key={entry.sprint} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-400">{entry.sprint}</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Plateforme d’orientation RIASEC — automatisations n8n & services NestJS pour accompagner les étudiants.
          </p>
          <nav className="flex gap-6">
            <a className="hover:text-slate-300" href="#">Vision</a>
            <a className="hover:text-slate-300" href="#">Architecture</a>
            <a className="hover:text-slate-300" href="#">Backlog</a>
            <a className="hover:text-slate-300" href="#">Workflows</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
