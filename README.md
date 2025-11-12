# riasec-platform

Monorepo Nx pour la plateforme RIASEC réunissant un front Next.js 15 et une API NestJS 11.

## Prérequis

- Node.js 20+
- npm (par défaut avec Node)

## Installation

```sh
npm install
```

## Commandes principales

| Commande | Description |
| --- | --- |
| `npm run dev:web` | Lance l’application Next.js (`apps/web`) en mode développement. |
| `npm run dev:api` | Démarre l’API NestJS (`apps/api`). |
| `npm run build` | Construit l’ensemble des applications. |
| `npm run test` | Exécute les tests unitaires avec Jest. |
| `npm run lint` | Analyse les projets avec ESLint. |
| `npm run format` | Formate le code selon Prettier. |

## Structure

- `apps/web` : SPA Next.js 15 avec App Router, TypeScript et Tailwind CSS.
- `apps/api` : API NestJS 11 (bootstrap standalone) avec Jest et ESLint.
- `apps/*-e2e` : Projets Playwright / Jest pour les tests end-to-end.
- `tools` / `libs` : emplacements réservés pour les bibliothèques internes et scripts Nx.

## Ressources

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
