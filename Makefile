.PHONY: install migrate generate seed dev-env dev-api dev-web start-all

# Installe toutes les dépendances du projet
install:
	npm install

# Applique les migrations Prisma et régénère le client
migrate:
	npx prisma migrate dev --schema apps/api/prisma/schema.prisma
	npx prisma generate --schema apps/api/prisma/schema.prisma

# Régénère uniquement le client Prisma
generate:
	npx prisma generate --schema apps/api/prisma/schema.prisma

# Insère les données d’exemple (questions + métiers)
seed:
	npm run seed

# Prépare l’environnement complet (install + migrate + seed)
dev-env: install migrate seed

# Lance l’API NestJS en mode développement
dev-api:
	npm run dev:api

# Lance le front Next.js en mode développement
dev-web:
	npm run dev:web

# Démarre API et front en parallèle
start-all:
	npm run dev:api & npm run dev:web
