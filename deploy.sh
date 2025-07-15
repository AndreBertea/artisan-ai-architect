#!/bin/bash

echo "🚀 Déploiement Artisan AI Architect"

# Variables
ENVIRONMENT=${1:-development}
DOCKER_COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "📦 Construction des images Docker..."
docker compose -f $DOCKER_COMPOSE_FILE build

echo "🛑 Arrêt des services existants..."
docker compose -f $DOCKER_COMPOSE_FILE down

echo "🚀 Démarrage des services..."
docker compose -f $DOCKER_COMPOSE_FILE up -d

echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 15

echo "🗄️ Exécution des migrations Prisma..."
docker compose -f $DOCKER_COMPOSE_FILE exec backend npx prisma migrate deploy

echo "🔧 Génération du client Prisma..."
docker compose -f $DOCKER_COMPOSE_FILE exec backend npx prisma generate

echo "✅ Déploiement terminé !"
echo "🌐 Frontend: http://localhost:3001"
echo "🔧 Backend: http://localhost:3000"
echo "📊 Base de données: localhost:5432"
echo "🔑 Admin: admin@artisan-ai.com / admin123" 