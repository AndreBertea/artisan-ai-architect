CRM GMBS - Page dédiée au CRM du client

Application CRM moderne pour la gestion d'artisans et d'interventions.

🏗️ Architecture
Frontend

    React 18 + TypeScript 5 + Vite
    shadcn/ui + Tailwind CSS
    React Query + Zustand
    React Router DOM

🚀 Déploiement Rapide
Prérequis

    Node.js 18+

Installation

    Cloner le projet

git clone https://github.com/AndreBertea/artisan-ai-architect.git
cd artisan-ai-architect

    Installer les dépendances

npm install

    Lancer l'application

npm run dev

    Accéder à l'application

    Frontend: http://localhost:3001

Compte par défaut

    Email: admin@artisan-ai.com
    Mot de passe: admin123

📁 Structure du Projet

artisan-ai-architect/
├── src/                    # Frontend React
│   ├── components/         # Composants UI
│   ├── features/           # Fonctionnalités (AI, Messaging, Search)
│   ├── services/           # API mockées
│   └── ...
└── ...

🔧 Développement

npm install
npm run dev

🏢 Fonctionnalités principales

    Gestion des artisans et interventions
    Recherche sémantique avec IA
    Authentification JWT (mockée)

🤖 IA Intégrée

    Recherche sémantique avec embeddings
    Assistant IA pour les questions

📊 API Endpoints (mockés)

    POST /api/v1/auth/login - Connexion
    POST /api/v1/auth/register - Inscription
    GET /api/v1/auth/profile - Profil utilisateur
    GET /api/v1/interventions - Liste des interventions
    POST /api/v1/interventions - Créer une intervention
    GET /api/v1/interventions/:id - Détails intervention
    PATCH /api/v1/interventions/:id - Modifier intervention
    DELETE /api/v1/interventions/:id - Supprimer intervention

🔒 Sécurité (mockée)

    JWT avec expiration
    bcrypt pour les mots de passe
    CORS configuré
    Rate limiting
    Validation des entrées
    Soft delete pour les données

📝 Licence

MIT License - Voir LICENSE pour plus de détails.

🤝 Contribution

    Fork le projet
    Créer une branche feature
    Commit vos changements
    Push vers la branche
    Ouvrir une Pull Request

CRM GMBS - Page dédiée au CRM du client 🛠️