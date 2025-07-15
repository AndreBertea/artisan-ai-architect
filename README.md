# Artisan AI Architect - CRM Multi-tenant

Application CRM moderne pour la gestion d'artisans et d'interventions, avec architecture multi-tenant et IA intégrée.

## 🏗️ Architecture

### Frontend
- **React 18** + **TypeScript 5** + **Vite**
- **shadcn/ui** + **Tailwind CSS**
- **React Query** + **Zustand**
- **React Router DOM**

### Backend
- **NestJS 11** + **TypeScript**
- **Prisma 5** + **PostgreSQL 16**
- **JWT Authentication** + **Multi-tenant RLS**
- **Redis** + **Kafka** (CDC)
- **OpenAI** (Embeddings)

## 🚀 Déploiement Rapide

### Prérequis
- Docker et Docker Compose
- Node.js 18+
- PostgreSQL 16 (avec extensions pgvector, pgcrypto)

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/AndreBertea/artisan-ai-architect.git
cd artisan-ai-architect
```

2. **Configurer l'environnement**
```bash
cp backend/env.example backend/.env
# Éditer backend/.env avec vos configurations
```

3. **Déployer avec Docker**
```bash
./deploy.sh
```

4. **Accéder à l'application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Base de données: localhost:5432

### Compte par défaut
- **Email**: admin@artisan-ai.com
- **Mot de passe**: admin123

## 📁 Structure du Projet

```
artisan-ai-architect/
├── src/                    # Frontend React
│   ├── components/         # Composants UI
│   ├── features/          # Fonctionnalités (AI, Messaging, Search)
│   ├── services/          # API mockées
│   └── ...
├── backend/               # Backend NestJS
│   ├── src/
│   │   ├── modules/       # Modules métier
│   │   ├── common/        # Services partagés
│   │   └── config/        # Configuration
│   ├── prisma/           # Schéma et migrations
│   └── ...
├── docker-compose.yml    # Orchestration Docker
└── deploy.sh            # Script de déploiement
```

## 🔧 Développement

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
npm install
npm run dev
```

### Base de données
```bash
cd backend
npx prisma migrate dev
npx prisma studio
```

## 🏢 Fonctionnalités Multi-tenant

- **Isolation des données** par tenant
- **Row-Level Security** (RLS) PostgreSQL
- **Middleware tenant** automatique
- **Authentification JWT** avec tenant_id

## 🤖 IA Intégrée

- **Recherche sémantique** avec embeddings
- **Assistant IA** pour les questions
- **Vector store** PostgreSQL (pgvector)
- **CDC** avec Debezium/Kafka

## 📊 API Endpoints

### Authentification
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/register` - Inscription
- `GET /api/v1/auth/profile` - Profil utilisateur

### Interventions
- `GET /api/v1/interventions` - Liste des interventions
- `POST /api/v1/interventions` - Créer une intervention
- `GET /api/v1/interventions/:id` - Détails intervention
- `PATCH /api/v1/interventions/:id` - Modifier intervention
- `DELETE /api/v1/interventions/:id` - Supprimer intervention

## 🔒 Sécurité

- **JWT** avec expiration
- **bcrypt** pour les mots de passe
- **CORS** configuré
- **Rate limiting**
- **Validation** des entrées
- **Soft delete** pour les données

## 📈 Monitoring

- **Prometheus** métriques
- **Grafana** dashboards
- **Loki** logs centralisés
- **Health checks** Docker

## 🚀 Production

```bash
# Déploiement production
./deploy.sh production

# Variables d'environnement requises
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
```

## 📝 Licence

MIT License - Voir LICENSE pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

---

**Artisan AI Architect** - CRM moderne pour artisans et interventions 🛠️
