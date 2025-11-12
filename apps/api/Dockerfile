# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS development
WORKDIR /app
ENV PATH="/app/node_modules/.bin:$PATH"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev:api", "--", "--host=0.0.0.0"]
