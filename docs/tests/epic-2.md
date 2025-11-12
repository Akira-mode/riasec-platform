# Plan de tests – Épic 2 (Profils RIASEC & page publique)

## 1. Préparation

- [ ] Base Postgres locale accessible (`DATABASE_URL`)
- [ ] `npm install` + migrations `make migrate` + seeds `make seed`
- [ ] Lancer API `make dev-api`
- [ ] Lancer front `make dev-web`
- [ ] Créer au moins deux comptes utilisateurs et générer des résultats RIASEC (via `/assessments` + `/assessments/:id/result`)

## 2. API – Profils utilisateur

### 2.1 GET /users/me/profile

1. Authentifier un utilisateur (Bearer token)
2. Appeler GET `http://localhost:3000/api/users/me/profile`
3. Attendus :
   - `200 OK`
   - `latest.profileCode` non vide
   - `history` triée décroissant
   - `evolution` présent si ≥ 2 résultats

### 2.2 GET /users/me/profile sans token

- Requête sans Authorization => **401**

### 2.3 Historique multiple

1. Générer deux évaluations pour le même user
2. Re-vérifier `/me/profile` => `history` longueur 2, `evolution` ≠ null

## 3. API – Résultat public

### 3.1 GET /assessments/:id/result (OK)

1. Utiliser un `assessmentId` existant
2. Vérifier : `profileCode`, `top3`, `scores`, `normalized`, `user.email`

### 3.2 GET /assessments/:id/result (404)

- Tester un ID inexistant ⇒ **404**

## 4. Front – Page publique `/result/[assessmentId]`

### 4.1 Chargement réussi

1. Naviguer vers `http://localhost:3001/result/{assessmentId}`
2. Vérifier :
   - Header avec code Holland + top3
   - Radar chart animée (Recharts)
   - 5 métiers listés
   - Bouton « Recevoir mon rapport »

### 4.2 Cas introuvable

- Visiting route avec mauvais ID ⇒ page 404 Next

### 4.3 Accessibilité / responsive

- Tester sur viewport mobile (<768px) : layout empilé, radar accessible

### 4.4 Bouton « Recevoir mon rapport »

- Cliquer => état `Rapport envoyé !` (mock) après spinner

## 5. Workflow n8n – « RIASEC Score »

### 5.1 Trigger & API

1. POST sur `/webhook/riasec-score` avec `{ assessmentId, answers[] }`
2. Vérifier :
   - HTTP Request vers `GET /assessments/:id/score`
   - Insertion `RiasecResult`

### 5.2 Email & PDF

- Log n8n → nœud `Send Result Email` OK ; pièce jointe `riasec-profile-*.pdf`

### 5.3 Slack coach

- Si dimension < 30 ⇒ message dans `#coaching-alerts`

### 5.4 Retry & Catch Error

- Simuler échec (API off) ⇒ 3 retries + notification finale

## 6. Résultats

| ID  | Scenario | Attendu | Résultat | Commentaire |
| --- | -------- | ------- | -------- | ----------- |
|     |          |         |          |             |

## 7. Bugs / Suivi

- [ ] …
