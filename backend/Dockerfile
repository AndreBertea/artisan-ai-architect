#######################################
# 1)  -----  STAGE BUILDER  -----     #
#######################################
FROM node:18-alpine AS builder

WORKDIR /app

# — Dépendances + typescript config
COPY package*.json ./
COPY tsconfig*.json ./

# — Installe TOUTES les dépendances (dev + prod)
RUN npm ci

# — Code source & schéma Prisma
COPY src ./src
COPY prisma ./prisma

# — OpenSSL requis par le moteur Prisma
RUN apk add --no-cache openssl

# — Génère le client Prisma
RUN npx prisma generate

# — Compile le projet NestJS (sans Webpack)
RUN npm run build

#########################################
# 2)  -----  STAGE PRODUCTION  -------- #
#########################################
FROM node:18-alpine AS production

WORKDIR /app

# — Bibliothèque OpenSSL pour Prisma en runtime
RUN apk add --no-cache openssl

# — Copie du code compilé et du Prisma client
COPY --from=builder /app/dist            ./dist
COPY --from=builder /app/prisma          ./prisma

# — Copie des dépendances de production
COPY --from=builder /app/node_modules    ./node_modules

# — User non root (sécurité)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs
USER nestjs

EXPOSE 3010

# — Démarrage "plain Node", sans CLI Nest
CMD ["node", "dist/main.js"]
