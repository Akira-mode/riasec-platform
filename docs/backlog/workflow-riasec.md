# Workflow global RIASEC (Résumé détaillé)

Ce document synthétise et explique les processus décrits dans `backlog_n8n_riasec_nestjs.md`. Il présente la vision produit, l’architecture cible, les épics majeurs et la place de n8n dans l’écosystème.

---

## 1. Vision produit

L’objectif est de proposer une plateforme d’orientation professionnelle centrée sur le modèle RIASEC (Holland). Les utilisateurs réalisent un quiz, obtiennent un profil personnalisé et reçoivent des recommandations automatisées. L’écosystème se compose de :

- **Front Next.js** : interface utilisateur SPA.
- **Backend NestJS** : services Auth, Assessments, Recommendations, Users.
- **n8n** : moteur d’orchestration (emails, notifications, calculs automatisés).
- **PostgreSQL + Prisma** : stockage des données (users, questions, résultats, métiers, logs).
- **Intégrations** : Sendgrid (emails), Slack (alertes coach), CRM/HubSpot (candidatures).

---

## 2. Architecture cible & flux principaux

1. **Utilisateur** → réalise le quiz via Next.js.
2. **Backend NestJS** → gère l’authentification, la sélection dynamique des questions, la persistance des réponses.
3. **Workflow n8n “RIASEC Score”** :
   - reçoit les réponses via webhook,
   - appelle l’API NestJS pour calculer/valider le score,
   - stocke les résultats (table `RiasecResult`),
   - déclenche emails, alertes Slack, etc.
4. **Données métiers** → tables `occupations`, `resources` alimentent les recommandations.
5. **Dashboards** → Next.js (coach) + analytics externes (Metabase/Superset).

---

## 3. Parcours utilisateur (haute-niveau)

1. **Inscription** :
   - Formulaire `/signup` (Next.js) → API `POST /auth/signup` (NestJS) → email d’activation (Sendgrid).
   - Variables capturées : email, mot de passe, tranche d’âge (`COLLEGIAN`, `LYCEEN`, `UNIVERSITAIRE`, `ADULTE`).
2. **Quiz RIASEC** :
   - `POST /assessments` crée une session ; les questions sont filtrées selon la tranche d’âge.
   - Réponses envoyées à n8n (webhook) pour scoring.
3. **Scoring / profil** :
   - n8n appelle `GET /assessments/:id/score` (NestJS) ou exécute la fonction de calcul.
   - Résultat stocké (`RiasecResult`), exposé via `GET /users/me/profile` + `GET /assessments/:id/result`.
4. **Recommandations & suivi** :
   - Épique 3+ : recommandations métiers/ressources, envoyées par email, affichées sur le front, notifications coach.
5. **Analyse & mentorat** :
   - Épics 5 à 7 : dashboards, analytics, matching mentors, workflows de suivi.

---

## 4. Vue d’ensemble des épics

| Épic | Objectif | Deliverables principaux |
| ---- | -------- | ----------------------- |
| 1 – Fondations | Monorepo Nx, Docker Compose, Auth, migrations & seed | Nx + Nest + Next + n8n alignés ; auth JWT ; base de questions RIASEC |
| 2 – Quiz & scoring | Banque questions, scoring pondéré, workflow “RIASEC Score”, profils dynamiques par tranche d’âge | `POST /assessments`, calcul normalisé, segmentation age bracket, n8n scoring |
| 3 – Recommandations | Table métiers/ressources, règles de matching, workflow Resources Builder, carte orientation | `GET /recommendations`, matching par dimension, email PDF ressources |
| 4 – Automatisations | Workflows n8n (Bienvenue, Suivi coach, Relance), logging webhooks | Séquences emails, alertes Slack, logs `agent_logs` |
| 5 – Tableau de bord | Dashboard coach, analytics, exports, workflow Weekly Digest | Visualisation progression, distribution RIASEC, export CSV |
| 6 – Personnalisation & IA | Intégration LLM, plan d’action, analyse sentiment, chatbot | Conseils IA, plan action, pipeline sentiment, chatbot accompagné |
| 7 – Mentorat | Matching mentor/mentoré, messagerie, gestion disponibilités, workflow mentor | Binômes automatiques, suivi sessions, notifications |
| 8 – Parcours longitudinal | Historique multi-tests, dérive RIASEC, suivis post reco, exports BI, digest mensuel | Timeline tests, vues BI, digest perso |
| 9 – Offres entreprises | Module `Opportunities`, matching opportunités, alertes, sync CRM | Alertes offres, scoring compatibilité, validation offres |
| 10 – Gouvernance | Audit trail, consentement RGPD, sauvegardes, monitoring, CI/CD | Audit complet, consentement, backups, Grafana, pipelines tests |

Chaque épic est décliné en tickets (RIASEC-XX) avec description + critères d’acceptation.

---

## 5. Workflows n8n clés

1. **RIASEC Score** *(S2)* : réception réponses → calcul (n8n ou API) → enregistrement résultats → email + Slack.
2. **Welcome & Reminder** *(S4)* : séquence d’emails post-inscription.
3. **Coach Alert** *(S4)* : Slack/Teams pour profils atypiques.
4. **Weekly Digest** *(S5)* : stats hebdomadaires staff.
5. **Webhook Logger** *(S4)* : journaliser exécutions dans `agent_logs`.
6. **Resources Builder** *(S3)* : PDF métiers/ressources.
7. **Mentor Matching** *(S7)* : suggestion binômes.
8. **Progress Digest** *(S8)* : résumé mensuel aux étudiants.
9. **Opportunity Alert** *(S9)* : offres pertinentes.

Chaque workflow inclut monitoring (Grafana) et gestion des erreurs/retry.

---

## 6. Roadmap suggérée (Sprints S1 → S6)

| Sprint | Focus | Résultats |
| ------ | ----- | --------- |
| S1 | Setup infra + Auth + seed | Monorepo opérationnel, pipeline CI de base, DB prête |
| S2 | Quiz + scoring + workflow n8n | Quiz complet, calcul RIASEC en chaîne, stockage résultats |
| S3 | Recommandations métiers + emails | Matching statique, ressources envoyées |
| S4 | Dashboard coach, alertes, relances | UI coach, notifications, logs automatisations |
| S5 | Mentorat + analytics historiques | Matching mentors, historiques multi-tests |
| S6 | Offres partenaires + conformité | Opportunités, CRM sync, monitoring & RGPD |

---

## 7. KPIs & succès

- 90 % des utilisateurs terminent le quiz.
- Temps < 5s entre fin quiz et recommandation.
- NPS > 7 ; 100 % workflows monitorés.
- 70 % des étudiants engagés dans mentorat.
- ≥ 50 offres pertinentes diffusées/mois.
- 0 incident critique non détecté.

---

## 8. Synthèse finale

Le backlog définit une solution modulaire et automatisée : un backend NestJS structuré, un front Next.js riche, et une couche n8n orchestrant tous les flux (scoring, emails, alertes, suivis). Les épics assurent une montée en puissance progressive : fondations techniques, scoring intelligent, recommandations ciblées, automatisations métier, analytics approfondis, intégrations entreprises et conformité.

Ce workflow global garantit :
- une expérience utilisateur fluide (quiz → profil → actions),
- des outils de supervision pour coachs/administrateurs,
- des automatisations robustes pour le suivi et la personnalisation,
- une évolutivité vers l’IA, le mentorat, les intégrations partenaires et la gouvernance.
