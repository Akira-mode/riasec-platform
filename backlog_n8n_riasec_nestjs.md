# Backlog — Plateforme d’orientation RIASEC (n8n + NestJS)

## Vision produit

Proposer une application d’orientation professionnelle basée sur le modèle RIASEC (Holland) où les utilisateurs réalisent des quiz, reçoivent des recommandations de métiers, et peuvent déclencher des automatisations n8n (envoi de bilans personnalisés, mise en relation avec un conseiller, suivi des progrès).

## Architecture cible

- **Front web** : SPA Next.js / React (ou Vue) consommant l’API NestJS.
- **Backend** : NestJS (TypeScript) avec modules `Auth`, `Assessment`, `Recommendations`, `Users`.
- **Automatisation** : n8n orchestrant les workflows (analyse résultats, emails, suivi).
- **Base de données** : PostgreSQL (optionnel : Prisma ORM) avec tables utilisateurs, réponses, scores RIASEC, parcours recommandés.
- **Intégrations** : Email (Sendgrid), Slack/Teams (alertes coach), CRM (HubSpot) possible.

## Backlog épics

### Épic 1 — Fondations techniques (tickets Jira)

- Initialiser monorepo (Nx conseillé) avec NestJS + front Next.js.
- Configurer Docker Compose (NestJS, PostgreSQL, n8n, pgAdmin).
- Mettre en place l’authentification (JWT, OAuth optionnel) et gestion des rôles (`etudiant`, `coach`, `admin`).
- Ajouter l’inscription utilisateur (formulaire, validation, emails de confirmation).
- Mettre en place les migrations DB et un script de seed RIASEC (questions, métiers).

### Épic 2 — Quiz & scoring RIASEC (tickets Jira)

- Endpoint `POST /assessments` pour initier un quiz.
- Modèle de données questions (indexées par dimension R,I,A,S,E,C).
- Banque de questions : **60 items par dimension** (360 au total) avec versioning et tags de difficulté/intérêt.
- Système de scoring : calcul pondéré, normalisation.
- Workflow n8n “RIASEC Score” : reçoit les réponses, calcule via fonction (ou appelle NestJS), stocke résultat.
- Génération du profil utilisateur (top 3 dimensions + description).
- Segmenter les utilisateurs par tranche d’âge (collégien, lycéen, universitaire, adulte+).
- Adapter dynamiquement les questions RIASEC selon la tranche d’âge.

### Épic 3 — Recommandations métiers & ressources (tickets Jira)

- Base métiers/formation (table `occupations`, `resources`).
- Matchmaking : règles statiques + moteur de règles (dimension dominante).
- API `GET /recommendations` (filtre par RIASEC, localisation).
- Workflow n8n “Resources Builder” : assemble email PDF avec top métiers + liens.
- Intégration d’une carte (ex. Leaflet) pour centres d’orientation proches.
- Générer des recommandations d’orientation professionnelle, formations et ressources supplémentaires à partir du profil RIASEC.

### Épic 4 — Automatisations utilisateurs (n8n) — tickets Jira

- Workflow “Bienvenue” : envoi email de bienvenue, rappel frameworks orientation.
- Workflow “Suivi coach” : si score spécifique (ex. réaliste très faible), notification Slack/Teams au coach.
- Workflow “Relance” : si quiz démarré mais non complété → rappel via email/SMS.
- Webhook NestJS pour enregistrer les actions n8n dans la DB (`agent_logs`).

### Épic 5 — Tableau de bord & analytics (tickets Jira)

- Dashboard coach (front) : liste utilisateurs, scores, progression.
- Graphiques : distribution RIASEC par cohorte.
- Exports CSV/Excel.
- Workflow n8n “Weekly Digest” : statistiques hebdomadaires envoyées au staff.
- Permissions : coach voit uniquement ses membres, admin accès complet.

### Épic 6 — Personnalisation & IA (tickets Jira)

- Utilisation LLM via n8n pour générer conseils personnalisés (prompting).
- Recommandations dynamiques (plan d’action, compétences à développer).
- Analyse sentiment des retours utilisateurs pour améliorer le parcours.
- Chatbot d’accompagnement (Option : Next.js chat → n8n).

### Épic 7 — Communautés & mentorat (tickets Jira)

- Mise en relation mentor/mentoré selon affinités RIASEC et objectifs.
- Système de messagerie ou commentaires modérés.
- Gestion des disponibilités mentors (synchronisation calendrier).
- Workflow n8n “Mentor Matching” : propose un binôme + envoie notifications.
- Tableau de bord coach : suivi des sessions mentoring programmées/réalisées.

### Épic 8 — Parcours longitudinal & analytics avancés (tickets Jira)

- Historique des tests (multi-passages) avec visualisation des évolutions.
- Analyse des écarts RIASEC entre tests (stabilité, dérive).
- Suivi des actions post-recommandations (inscription formation, entretien).
- Export vers outils BI (Metabase, Superset) via vues dédiées.
- Workflow n8n “Progress Digest” : synthèse mensuelle envoyée à l’étudiant.

### Épic 9 — Intégrations entreprises & offres (tickets Jira)

- Module `Opportunities` : offres d’emploi/stage synchronisées (API partenaires, RSS).
- Match automatique profil RIASEC ↔ offre (scores de compatibilité).
- Workflow n8n “Opportunity Alert” : envoi d’offres pertinentes aux étudiants.
- CRM sync (HubSpot/Zoho) pour transmettre les candidats intéressés.
- Administration : validation manuelle des offres avant diffusion.

### Épic 10 — Gouvernance & conformité (tickets Jira)

- Audit trail complet (qui modifie quoi, quand).
- Gestion consentement RGPD (opt-in communication, suppression).
- Plan de sauvegarde/restauration (exports automatisés).
- Monitoring des workflows (Grafana + alertes).
- Tests automatisés (unitaires, end-to-end) déclenchés CI/CD.

## User stories MVP

1. _En tant qu’étudiant_, je complète un quiz RIASEC et reçois immédiatement mon profil et trois métiers compatibles.
2. _En tant que coach_, je reçois une notification quand un nouvel étudiant termine son quiz avec un profil atypique.
3. _En tant qu’administrateur_, je consulte un tableau de bord affichant la répartition des profils RIASEC sur les 30 derniers jours.
4. _En tant qu’étudiant_, je reçois par email un résumé de mon profil RIASEC et des ressources recommandées.

### User stories avancées

1. _En tant qu’étudiant_, je bénéficie d’un mentor proposé automatiquement selon mon profil et mes objectifs.
2. _En tant que coach_, je visualise l’évolution du profil RIASEC d’un étudiant sur 12 mois et ses actions associées.
3. _En tant que responsable partenariats_, je publie des offres d’emploi qui se distribuent aux étudiants les plus compatibles.
4. _En tant que DPO_, je télécharge l’audit complet des actions réalisées sur un compte étudiant.

## Workflows n8n clés

- **RIASEC Score** : ingestion réponses → calcul → storage → renvoi profil.
- **Welcome & Reminder** : séquence emails (J0, J+3).
- **Coach Alert** : filtrage profils (scores extrêmes) → Slack/Email.
- **Weekly Digest** : agrégation stats → email staff.
- **Webhook Logger** : enregistre chaque exécution dans `agent_logs`.

## Roadmap indicative

| Sprint | Livrables                                                              |
| ------ | ---------------------------------------------------------------------- |
| S1     | Setup infra, auth, base questions RIASEC                               |
| S2     | Quiz complet + workflow scoring + stockage résultats                   |
| S3     | Recommandations métiers + emails automatiques                          |
| S4     | Tableau de bord coach + analytics + alertes avancées                   |
| S5     | Mentorat & communauté, historique multi-tests, exports BI              |
| S6     | Intégrations offres partenaires, matching avancé, conformité renforcée |

## Indicateurs de succès

- 90 % des utilisateurs terminent le quiz.
- Temps de traitement < 5s entre fin quiz et recommandation.
- NPS des utilisateurs > 7.
- 100 % des workflows n8n essentiels monitorés (alertes en cas d’échec).
- 70 % des étudiants engagés dans un parcours mentoré sur 6 mois.
- ≥ 50 offres pertinentes diffusées mensuellement via le module opportunités.
- 0 incident critique non détecté (logs/audits) sur la période de référence.

## Backlog détaillé (tickets Jira)

### Épic 1 — Fondations techniques

- **RIASEC-1 — Initialisation monorepo Nx**  
  _Description_ : Créer le monorepo Nx avec `apps/web` (Next.js) et `apps/api` (NestJS) ainsi que les configurations de base (lint, test, format).  
  _Critères d’acceptation_ : Lancer `nx test` et `nx lint` sans erreur ; README de setup présent ; pipeline CI de base opérationnelle.

- **RIASEC-2 — Docker Compose environnement local**  
  _Description_ : Déclarer les services `api`, `web`, `postgres`, `n8n`, `pgadmin` dans un `docker-compose.yml` avec gestion des volumes.  
  _Critères d’acceptation_ : `docker compose up` lance l’ensemble des services ; données PostgreSQL persistées ; documentation des variables d’environnement.

- **RIASEC-3 — Authentification & rôles**  
  _Description_ : Mettre en place le module NestJS `Auth` avec JWT, rafraîchissement de token et rôles (`etudiant`, `coach`, `admin`).  
  _Critères d’acceptation_ : Endpoints login/refresh fonctionnels ; guards de rôles appliqués ; tests unitaires couvrant le module ; doc sécurité mise à jour.

- **RIASEC-4 — Migrations DB + seed RIASEC**  
  _Description_ : Définir le schéma des tables principales et implémenter un script de seed contenant les questions et métiers RIASEC.  
  _Critères d’acceptation_ : Migrations reproductibles ; seed idempotent ; commandes documentées.

- **RIASEC-5 — Inscription utilisateur**  
  _Description_ : Permettre à un utilisateur de s’inscrire via email/mot de passe (ou SSO futur), avec validation et double opt-in.  
  _Critères d’acceptation_ : Endpoint `POST /auth/signup` sécurisé ; email de confirmation envoyé ; état du compte mis à jour après validation.

### Épic 2 — Quiz & scoring RIASEC

- **RIASEC-10 — Modélisation questions/réponses**  
  _Description_ : Créer les entités questions, dimensions RIASEC, options et versioning des items.  
  _Critères d’acceptation_ : CRUD questions exposé via API protégée ; validations mises en place.

- **RIASEC-11 — Endpoint `POST /assessments`**  
  _Description_ : Démarrer un quiz, générer une session et associer l’utilisateur.  
  _Critères d’acceptation_ : Payload validé ; réponses partielles enregistrées ; tests end-to-end.

- **RIASEC-12 — Système de scoring pondéré**  
  _Description_ : Calculer les scores RIASEC normalisés et extraire le top 3.  
  _Critères d’acceptation_ : Fonction de calcul testée ; tables de scores MAJ ; documentation des formules.

- **RIASEC-13 — Workflow n8n “RIASEC Score”**  
  _Description_ : Recevoir les réponses, déclencher calcul (via fonction n8n ou appel API) et stocker le résultat.  
  _Critères d’acceptation_ : Webhook sécurisé ; logs d’exécution ; gestion des erreurs et relances.

- **RIASEC-14 — Génération profil utilisateur**  
  _Description_ : Persister le profil final et exposer une API de consultation.  
  _Critères d’acceptation_ : Profil comprenant top 3 + descriptions ; historisation activée ; audit conforme.

- **RIASEC-15 — Gestion des tranches d’âge**  
  _Description_ : Ajouter au profil utilisateur une tranche d’âge (collégien, lycéen, universitaire, adulte+) et gérer les validations associées.  
  _Critères d’acceptation_ : Tranche d’âge obligatoire à l’inscription ; stockage normalisé ; exposé dans les APIs utilisateurs et quiz.

- **RIASEC-16 — Questions RIASEC dynamiques par tranche**  
  _Description_ : Adapter la sélection des questions du quiz selon la tranche d’âge de l’utilisateur.  
  _Critères d’acceptation_ : Pool de questions filtré côté backend ; interface front affichant les questions adaptées ; tests pour chaque tranche.

### Épic 3 — Recommandations métiers & ressources

- **RIASEC-20 — Modèles `occupations` et `resources`**  
  _Description_ : Concevoir les tables métiers/ressources et importer un dataset initial.  
  _Critères d’acceptation_ : Migrations livrées ; seed disponible ; API de lecture sécurisée.

- **RIASEC-21 — Moteur de matchmaking statique**  
  _Description_ : Implémenter des règles de matching basées sur la dimension dominante.  
  _Critères d’acceptation_ : Service de scoring métiers ; tests unitaires couvrant les règles.

- **RIASEC-22 — API `GET /recommendations`**  
  _Description_ : Fournir des recommandations filtrées par RIASEC et localisation.  
  _Critères d’acceptation_ : Pagination, authentification et tests end-to-end.

- **RIASEC-23 — Workflow n8n “Resources Builder”**  
  _Description_ : Générer un email/PDF listant les métiers priorisés et les ressources associées.  
  _Critères d’acceptation_ : Templates validés ; stockage des PDFs ; journalisation des envois.

- **RIASEC-24 — Intégration carte centres d’orientation**  
  _Description_ : Afficher sur le front une carte Leaflet des centres d’orientation filtrables.  
  _Critères d’acceptation_ : Données synchronisées ; tests UX ; performance acceptable.

- **RIASEC-25 — Recommandations orientation & formations**  
  _Description_ : Générer des recommandations ciblées (orientation professionnelle, formations, ressources complémentaires) à partir du profil RIASEC et de la tranche d’âge.  
  _Critères d’acceptation_ : Algorithme prenant en compte score RIASEC + tranche d’âge ; API retournant métiers, formations, ressources ; tests de pertinence validés par l’équipe produit.

### Épic 4 — Automatisations utilisateurs (n8n)

- **RIASEC-30 — Workflow “Bienvenue”**  
  _Description_ : Envoyer une séquence d’emails d’accueil (J0, J+3).  
  _Critères d’acceptation_ : Templates validés ; logs et monitoring configurés.

- **RIASEC-31 — Workflow “Suivi coach”**  
  _Description_ : Notifier Slack/Teams pour les profils présentant des scores extrêmes.  
  _Critères d’acceptation_ : Règles de filtrage testées ; alertes reçues par le channel cible.

- **RIASEC-32 — Workflow “Relance quiz”**  
  _Description_ : Détecter les quiz non complétés et relancer par email/SMS.  
  _Critères d’acceptation_ : Déclencheur fiable ; gestion opt-out ; rapport de succès.

- **RIASEC-33 — Webhook logger NestJS**  
  _Description_ : Enregistrer chaque exécution n8n dans `agent_logs` via un webhook NestJS.  
  _Critères d’acceptation_ : Données horodatées ; récupération via API ; alertes en cas d’échec.

### Épic 5 — Tableau de bord & analytics

- **RIASEC-40 — Dashboard coach**  
  _Description_ : Interface front listant utilisateurs, scores et progression.  
  _Critères d’acceptation_ : Filtres par coach ; design responsive ; tests d’accessibilité.

- **RIASEC-41 — Graphiques distribution RIASEC**  
  _Description_ : Ajouter des visualisations de distribution par cohorte.  
  _Critères d’acceptation_ : Agrégations performantes ; chartes validées par produit.

- **RIASEC-42 — Export CSV/Excel**  
  _Description_ : Permettre l’export des listes filtrées.  
  _Critères d’acceptation_ : Fichiers horodatés ; colonnes conformes ; tests backend/frontend.

- **RIASEC-43 — Workflow n8n “Weekly Digest”**  
  _Description_ : Envoyer un récap hebdomadaire des métriques aux parties prenantes.  
  _Critères d’acceptation_ : Cron paramétré ; contenu validé ; logs disponibles.

- **RIASEC-44 — Permissions coach/admin**  
  _Description_ : Renforcer les permissions sur le dashboard et les API.  
  _Critères d’acceptation_ : Tests automatisés des rôles ; revues de sécurité.

### Épic 6 — Personnalisation & IA

- **RIASEC-50 — Intégration LLM via n8n**  
  _Description_ : Configurer un workflow n8n appelant un LLM pour générer des conseils personnalisés.  
  _Critères d’acceptation_ : Prompt versionné ; monitoring des coûts ; sauvegarde des réponses.

- **RIASEC-51 — Recommandations d’actions dynamiques**  
  _Description_ : Générer un plan d’action et des compétences à développer selon le profil.  
  _Critères d’acceptation_ : API personnalisée ; tests QA ; feedback utilisateurs collecté.

- **RIASEC-52 — Analyse de sentiment des retours**  
  _Description_ : Mettre en place une pipeline d’analyse sentimentale sur les feedbacks.  
  _Critères d’acceptation_ : Scores stockés ; dashboard de suivi ; alertes sur sentiments négatifs.

- **RIASEC-53 — Chatbot d’accompagnement**  
  _Description_ : Déployer un chatbot Next.js orchestré par n8n pour répondre aux questions des étudiants.  
  _Critères d’acceptation_ : Historique conversations ; escalade vers humain ; conformité RGPD.

### Épic 7 — Communautés & mentorat

- **RIASEC-60 — Matching mentor/mentoré**  
  _Description_ : Construire l’algorithme de matching basé sur les affinités RIASEC et objectifs.  
  _Critères d’acceptation_ : Service de matching ; tests sur cas métiers ; indicateurs de qualité.

- **RIASEC-61 — Messagerie ou commentaires**  
  _Description_ : Permettre les échanges entre mentors et mentorés avec modération.  
  _Critères d’acceptation_ : Modération configurable ; notifications ; RGPD respecté.

- **RIASEC-62 — Gestion disponibilités mentors**  
  _Description_ : Planifier les créneaux mentors et synchroniser les calendriers.  
  _Critères d’acceptation_ : Création/édition de disponibilités ; intégration calendrier externe.

- **RIASEC-63 — Workflow n8n “Mentor Matching”**  
  _Description_ : Automatiser la proposition de binômes et l’envoi des notifications.  
  _Critères d’acceptation_ : Logs complet ; feedback mentor/mentoré capturé.

- **RIASEC-64 — Dashboard suivi mentoring**  
  _Description_ : Offrir aux coachs un suivi des sessions programmées/réalisées.  
  _Critères d’acceptation_ : Filtres par statut ; export disponible ; indicateurs de succès.

### Épic 8 — Parcours longitudinal & analytics avancés

- **RIASEC-70 — Historique multi-tests**  
  _Description_ : Visualiser l’historique des tests et les évolutions.  
  _Critères d’acceptation_ : Timeline interactive ; comparaisons ; données exportables.

- **RIASEC-71 — Analyse dérive RIASEC**  
  _Description_ : Calculer les écarts entre tests pour détecter la stabilité.  
  _Critères d’acceptation_ : Rapports générés ; alertes pour dérives ; documentation.

- **RIASEC-72 — Suivi actions post-recommandations**  
  _Description_ : Journaliser les actions (inscriptions, entretiens) après recommandations.  
  _Critères d’acceptation_ : Table dédiée ; API de saisie ; visualisation dashboard.

- **RIASEC-73 — Exports BI (Metabase/Superset)**  
  _Description_ : Créer des vues dédiées pour outils BI.  
  _Critères d’acceptation_ : Vues documentées ; accès sécurisé ; tests de performance.

- **RIASEC-74 — Workflow n8n “Progress Digest”**  
  _Description_ : Envoyer un digest mensuel personnalisable à chaque étudiant.  
  _Critères d’acceptation_ : Personnalisation dynamique ; logs ; gestion des échecs.

### Épic 9 — Intégrations entreprises & offres

- **RIASEC-80 — Module `Opportunities`**  
  _Description_ : Synchroniser les offres d’emploi/stage depuis APIs partenaires et flux RSS.  
  _Critères d’acceptation_ : Scheduler en place ; déduplication ; audit synchronisations.

- **RIASEC-81 — Matching profil ↔ offre**  
  _Description_ : Calculer un score de compatibilité entre profil RIASEC et offres.  
  _Critères d’acceptation_ : Endpoint de tri ; tests UX ; explication du score.

- **RIASEC-82 — Workflow n8n “Opportunity Alert”**  
  _Description_ : Envoyer automatiquement les offres pertinentes aux étudiants ciblés.  
  _Critères d’acceptation_ : Fréquence configurable ; suivi des envois ; gestion désabonnement.

- **RIASEC-83 — Synchronisation CRM (HubSpot/Zoho)**  
  _Description_ : Transmettre les candidats intéressés vers le CRM partenaires.  
  _Critères d’acceptation_ : Logs synchronisation ; respect consentements ; documentation API.

- **RIASEC-84 — Validation manuelle des offres**  
  _Description_ : Mettre en place un workflow d’approbation avant diffusion.  
  _Critères d’acceptation_ : États brouillon/revu/publié ; audit trail ; notifications.

### Épic 10 — Gouvernance & conformité

- **RIASEC-90 — Audit trail complet**  
  _Description_ : Journaliser toutes les actions sensibles avec immuabilité.  
  _Critères d’acceptation_ : API export ; rétention configurée ; conformité audit.

- **RIASEC-91 — Gestion consentement RGPD**  
  _Description_ : Gérer les opt-in communication et demandes de suppression.  
  _Critères d’acceptation_ : Interface utilisateur ; trace des consentements ; notifications automatiques.

- **RIASEC-92 — Plan sauvegarde/restauration**  
  _Description_ : Automatiser les backups et documenter la restauration.  
  _Critères d’acceptation_ : Backups récurrents ; test de restauration réussi ; runbook publié.

- **RIASEC-93 — Monitoring workflows n8n**  
  _Description_ : Mettre en place Grafana + alertes sur l’exécution des workflows.  
  _Critères d’acceptation_ : Dashboards actifs ; alertes sur échecs ; documentation.

- **RIASEC-94 — Automatisation tests CI/CD**  
  _Description_ : Configurer la pipeline CI/CD avec déclenchement des tests unitaires et end-to-end.  
  _Critères d’acceptation_ : Pipelines bloquant les merges en cas d’échec ; badges de statut ; reporting.

## Plan d’implémentation des nouvelles fonctionnalités

### Inscription utilisateur (RIASEC-5)

- **Backend NestJS** : créer endpoint `POST /auth/signup`, schéma DTO, validation, service d’envoi email (Sendgrid). Ajouter token d’activation et expiration.
- **Base de données** : table `users` enrichie (colonnes `age_bracket`, `is_active`, `activation_token`). Migration + seed de comptes démo.
- **Front Next.js** : page `/signup` avec formulaire, validation client, messages d’erreur, redirection vers page de confirmation.
- **n8n** : workflow `Signup Confirmation` pour envoyer email de validation et gérer relances.
- **Tests** : unitaires sur service Auth, e2e sur parcours d’inscription, tests UI Cypress pour page frontend.

### Gestion des tranches d’âge (RIASEC-15)

- **Backend** : enum `AgeBracket` partagé, validation dans DTOs utilisateurs et assessments, exposition dans `GET /users/me`.
- **Front** : ajout sélecteur de tranche d’âge dans inscription et profil, affichage dans dashboard coach.
- **Data** : script de migration mettant à jour comptes existants avec tranche par défaut, vérification via migration SQL.
- **Analytique** : adapter agrégations RIASEC pour inclure filtre par tranche dans dashboards.

### Questions dynamiques par tranche (RIASEC-16)

- **Modélisation** : attribut `age_brackets` (array enum) sur entité `Question`, migrations + seed ajusté.
- **API Quiz** : adapter service de sélection pour filtrer sur tranche, inclure fallback si peu de questions.
- **Front** : charger questions dynamiques en fonction de l’utilisateur connecté, UI pour variations éventuelles (langage, contexte).
- **Tests** : scénarios unitaires sur service de sélection, tests e2e pour chaque tranche avec dataset mock.

### Recommandations orientation & formations (RIASEC-25)

- **Données** : enrichir tables `occupations`, `resources`, nouvelle table `educational_tracks` si besoin, associer tags tranche d’âge.
- **Moteur de recommandations** : combiner score RIASEC + tranche d’âge, pondération configurable, mise en cache des résultats.
- **API** : étendre `GET /recommendations` pour renvoyer métiers, formations, ressources personnalisées.
- **Front** : mettre à jour page résultats du quiz pour afficher catégories (orientation pro, formations, autres ressources) avec CTA.
- **Workflows n8n** : générer email/rapport incluant ces nouvelles recommandations, logs dans `agent_logs`.
- **Validation** : tests unitaires sur règles de matching, tests produit avec scénarios réels, collecte feedback via feature flag initial.
