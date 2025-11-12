# Plan de tests – Épic 1

## 1. Préparation

- [ ] Définir la variable d’environnement `DATABASE_URL` vers la base Postgres locale.
- [ ] Démarrer le serveur Postgres local.
- [ ] Appliquer les migrations : `make migrate`
- [ ] Insérer les données seed : `make seed`
- [ ] Lancer l’API : `make dev-api`
- [ ] Lancer le front : `make dev-web`

## 2. Scénarios Back‑End Auth

### 2.1 Inscription nouvel utilisateur
1. Requête `POST /api/auth/signup` avec un email inédit
2. Vérifier la réponse : statut **201** + message *Compte créé…*
3. Vérifier en base : `isActive = false`, token généré

### 2.2 Token d’activation manquant ou expiré
1. Requête `GET /api/auth/activate/{token-invalide}`
2. Attendu : statut **400** + message d’erreur

### 2.3 Activation réussie
1. Requête `GET /api/auth/activate/{token-valide}`
2. Vérifier la réponse : statut **200** + *Compte activé*
3. Vérifier en base : `isActive = true`, columns d’activation nulles

### 2.4 Login refusé si compte inactif
1. Sans activer le compte, tenter `POST /api/auth/login`
2. Attendu : statut **403** + message *Compte non activé*

### 2.5 Login OK + Refresh Token
1. Après activation : `POST /api/auth/login`
2. Vérifier la réponse : `accessToken`, `refreshToken`, `user.isActive = true`
3. Requête `POST /api/auth/refresh` avec le `refreshToken`
4. Vérifier la réponse : nouveaux tokens

### 2.6 Guard Rôles
1. Protéger un endpoint avec `@Roles(Role.admin)`
2. Appeler avec un utilisateur rôle différent → attendu **403**
3. Changer le rôle en base, relancer → accès OK

## 3. Front Next.js – Page d’activation

1. Ouvrir `http://localhost:4200/activate/{token}` après inscription
2. Vérifier l’affichage : **Compte activé !**
3. Tester avec token invalide → message d’erreur

## 4. Vérifications supplémentaires

- [ ] Comptage seed : `SELECT COUNT(*) FROM "Question"` = 30
- [ ] Comptage seed : `SELECT COUNT(*) FROM "Occupation"` = 20
- [ ] Logs Sendgrid (si clés définies) : email envoyé sans erreur

## 5. Résultats

| Scénario | Résultat | Observations |
|----------|----------|--------------|
|          |          |              |

## 6. Bugs / Actions

- [ ] …
