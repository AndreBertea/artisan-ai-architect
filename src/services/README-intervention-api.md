# API Endpoints pour les Interventions

Ce dossier contient les endpoints API complets pour la gestion des interventions, prêts à être intégrés avec un backend.

## 📁 Structure des fichiers

```
src/services/
├── interventionEndpoints.ts    # Endpoints API principaux
├── interventionMock.ts         # Mock API pour le développement
├── interventionUsageExample.ts # Exemples d'utilisation
└── README-intervention-api.md  # Documentation (ce fichier)
```

## 🚀 Utilisation rapide

### Import et configuration

```typescript
// Pour le développement avec mock
import { interventionMockAPI } from './interventionMock';

// Pour la production avec vrai backend
import { interventionAPI } from './interventionEndpoints';

// Instance avec configuration personnalisée
import { createInterventionAPI } from './interventionEndpoints';
const api = createInterventionAPI('/api/v1/interventions', 'your-api-key');
```

### Exemple basique

```typescript
// Récupérer la liste des interventions
const response = await interventionMockAPI.getList({
  page: 1,
  limit: 10,
  filters: {
    statut: ['en_cours', 'demande']
  }
});

console.log('Interventions:', response.data);
console.log('Total:', response.pagination.total);
```

## 📋 Types et Interfaces

### Intervention

```typescript
interface Intervention {
  id: string;
  client: string;
  client_id: string;
  artisan: string;
  artisan_id: string;
  artisan_metier?: string;
  artisan_status?: ARTISAN_STATUS;
  artisan_dossier_status?: ARTISAN_DOSSIER_STATUS;
  agence?: string;
  utilisateur_assigné?: string;
  reference?: string;
  statut: InterventionStatus;
  cree: string;
  echeance: string;
  description: string;
  montant?: number;
  adresse?: string;
  notes?: string;
  coutSST?: number;
  coutMateriaux?: number;
  coutInterventions?: number;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
  tags?: string[];
  documents?: InterventionDocument[];
  historique?: InterventionHistory[];
  created_at: string;
  updated_at: string;
}
```

### Statuts disponibles

```typescript
type InterventionStatus = 
  | 'demande' 
  | 'devis_envoye' 
  | 'accepte' 
  | 'en_cours' 
  | 'annule' 
  | 'termine' 
  | 'visite_technique' 
  | 'refuse' 
  | 'stand_by' 
  | 'sav' 
  | 'bloque';
```

## 🔧 Méthodes disponibles

### CRUD Operations

#### `getList(params)`
Récupère la liste des interventions avec filtres, tri et pagination.

```typescript
const response = await api.getList({
  page: 1,
  limit: 20,
  filters: {
    statut: ['en_cours'],
    priorite: ['haute', 'urgente'],
    montant_min: 500,
    montant_max: 2000
  },
  sort: {
    field: 'created_at',
    direction: 'desc'
  }
});
```

#### `getById(id)`
Récupère une intervention par son ID.

```typescript
const intervention = await api.getById('INT-2024-001');
```

#### `create(data)`
Crée une nouvelle intervention.

```typescript
const newIntervention = await api.create({
  client_id: 'CLI-001',
  artisan_id: 'ART-001',
  description: 'Installation système de sécurité',
  adresse: '123 Rue de la Sécurité, 75001 Paris',
  echeance: '2024-02-15',
  montant: 2500,
  priorite: 'haute'
});
```

#### `update(id, data)`
Met à jour une intervention existante.

```typescript
const updatedIntervention = await api.update('INT-2024-001', {
  description: 'Description mise à jour',
  montant: 2800,
  priorite: 'urgente'
});
```

#### `delete(id)`
Supprime une intervention.

```typescript
const result = await api.delete('INT-2024-001');
```

### Opérations spécifiques

#### `updateStatus(id, statut)`
Change le statut d'une intervention.

```typescript
const intervention = await api.updateStatus('INT-2024-001', 'en_cours');
```

#### `updateMontant(id, montant)`
Met à jour le montant d'une intervention.

```typescript
const intervention = await api.updateMontant('INT-2024-001', 1500);
```

#### `updateCouts(id, couts)`
Met à jour les coûts d'une intervention.

```typescript
const intervention = await api.updateCouts('INT-2024-001', {
  coutSST: 300,
  coutMateriaux: 500,
  coutInterventions: 800
});
```

#### `assignArtisan(id, artisan_id)`
Assigne un artisan à une intervention.

```typescript
const intervention = await api.assignArtisan('INT-2024-001', 'ART-002');
```

### Documents

#### `getDocuments(id)`
Récupère les documents d'une intervention.

```typescript
const documents = await api.getDocuments('INT-2024-001');
```

#### `uploadDocument(id, file, type)`
Upload un document pour une intervention.

```typescript
const file = new File(['content'], 'devis.pdf', { type: 'application/pdf' });
const document = await api.uploadDocument('INT-2024-001', file, 'devis');
```

### Statistiques et rapports

#### `getStats(filters?)`
Récupère les statistiques des interventions.

```typescript
const stats = await api.getStats({
  statut: ['en_cours', 'termine']
});

console.log('Total:', stats.total);
console.log('En cours:', stats.en_cours);
console.log('Retards:', stats.retards);
```

#### `getFinancialData(id)`
Récupère les données financières d'une intervention.

```typescript
const financialData = await api.getFinancialData('INT-2024-001');
console.log('Marge:', financialData.marge);
console.log('Marge %:', financialData.margePourcentage);
```

### Opérations en lot

#### `bulkUpdate(ids, data)`
Met à jour plusieurs interventions en lot.

```typescript
const result = await api.bulkUpdate(
  ['INT-2024-001', 'INT-2024-002'],
  { priorite: 'normale' }
);
```

#### `bulkDelete(ids)`
Supprime plusieurs interventions en lot.

```typescript
const result = await api.bulkDelete(['INT-2024-001', 'INT-2024-002']);
```

## 🎯 Filtres disponibles

### InterventionFilters

```typescript
interface InterventionFilters {
  statut?: InterventionStatus[];
  artisan_id?: string[];
  client_id?: string[];
  agence?: string[];
  utilisateur_assigné?: string[];
  artisan_status?: ARTISAN_STATUS[];
  artisan_dossier_status?: ARTISAN_DOSSIER_STATUS[];
  date_debut?: string;
  date_fin?: string;
  montant_min?: number;
  montant_max?: number;
  priorite?: string[];
  tags?: string[];
}
```

### Exemples de filtres

```typescript
// Interventions en cours avec priorité haute
const filters = {
  statut: ['en_cours'],
  priorite: ['haute', 'urgente']
};

// Interventions d'un artisan spécifique
const filters = {
  artisan_id: ['ART-001']
};

// Interventions dans une fourchette de prix
const filters = {
  montant_min: 500,
  montant_max: 2000
};

// Interventions avec certains tags
const filters = {
  tags: ['électricité', 'urgent']
};
```

## 🔄 Tri et pagination

### Tri

```typescript
const sort: InterventionSort = {
  field: 'created_at', // ou 'montant', 'echeance', 'statut', etc.
  direction: 'desc'    // 'asc' ou 'desc'
};
```

### Pagination

```typescript
const response = await api.getList({
  page: 1,      // Page actuelle (commence à 1)
  limit: 20     // Nombre d'éléments par page
});

// Réponse avec pagination
{
  data: Intervention[],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    total_pages: 8
  }
}
```

## 🎨 Constantes et utilitaires

### Labels et couleurs

```typescript
import { 
  INTERVENTION_STATUS_LABELS, 
  INTERVENTION_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS 
} from './interventionEndpoints';

// Utilisation
const statusLabel = INTERVENTION_STATUS_LABELS['en_cours']; // "En cours"
const statusColor = INTERVENTION_STATUS_COLORS['en_cours']; // "bg-orange-100 text-orange-700"
```

## 🛠️ Gestion des erreurs

### Types d'erreurs

```typescript
import { InterventionAPIError } from './interventionEndpoints';

try {
  const intervention = await api.getById('INT-INEXISTANT');
} catch (error) {
  if (error instanceof InterventionAPIError) {
    console.log('Erreur API:', error.message);
    console.log('Status:', error.status);
    console.log('Code:', error.code);
  }
}
```

### Gestion d'erreur complète

```typescript
const loadInterventions = async () => {
  try {
    const response = await api.getList();
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API Error: 401')) {
        // Erreur d'authentification
        console.log('Redirection vers la page de connexion...');
      } else if (error.message.includes('API Error: 404')) {
        // Ressource non trouvée
        console.log('Intervention introuvable');
      } else if (error.message.includes('API Error: 500')) {
        // Erreur serveur
        console.log('Erreur serveur, réessayer plus tard...');
      }
    }
    throw error;
  }
};
```

## 🔧 Configuration pour différents environnements

### Développement (Mock)

```typescript
import { interventionMockAPI } from './interventionMock';

// Utilisation directe
const interventions = await interventionMockAPI.getList();

// Ou avec configuration personnalisée
const mockAPI = new InterventionMockAPI();
mockAPI.resetMockData(); // Réinitialiser les données mock
```

### Production (Vrai backend)

```typescript
import { createInterventionAPI } from './interventionEndpoints';

const api = createInterventionAPI(
  process.env.REACT_APP_API_BASE_URL + '/interventions',
  process.env.REACT_APP_API_KEY
);
```

### Test

```typescript
// Dans vos tests
import { InterventionMockAPI } from './interventionMock';

describe('Intervention API', () => {
  let mockAPI: InterventionMockAPI;

  beforeEach(() => {
    mockAPI = new InterventionMockAPI();
    mockAPI.resetMockData();
  });

  test('should create intervention', async () => {
    const result = await mockAPI.create({
      client_id: 'CLI-001',
      artisan_id: 'ART-001',
      description: 'Test',
      adresse: 'Test Address',
      echeance: '2024-02-15'
    });

    expect(result.id).toBeDefined();
    expect(result.statut).toBe('demande');
  });
});
```

## 📊 Exemples d'utilisation avancée

### Dashboard avec statistiques

```typescript
const loadDashboardData = async () => {
  const [interventions, stats] = await Promise.all([
    api.getList({ page: 1, limit: 10 }),
    api.getStats()
  ]);

  return {
    recentInterventions: interventions.data,
    stats: {
      total: stats.total,
      enCours: stats.en_cours,
      retards: stats.retards,
      montantTotal: stats.montant_total
    }
  };
};
```

### Recherche avancée

```typescript
const searchInterventions = async (searchTerm: string) => {
  const filters: InterventionFilters = {
    statut: ['en_cours', 'demande'],
    tags: [searchTerm]
  };

  const response = await api.getList({
    page: 1,
    limit: 50,
    filters,
    sort: { field: 'created_at', direction: 'desc' }
  });

  return response.data;
};
```

### Gestion des interventions en retard

```typescript
const getOverdueInterventions = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const response = await api.getList({
    filters: {
      statut: ['en_cours'],
      date_fin: today
    },
    sort: { field: 'echeance', direction: 'asc' }
  });

  return response.data;
};
```

## 🚀 Migration vers le vrai backend

Pour migrer du mock vers le vrai backend :

1. **Remplacer l'import**
   ```typescript
   // Avant (mock)
   import { interventionMockAPI } from './interventionMock';
   
   // Après (vrai backend)
   import { interventionAPI } from './interventionEndpoints';
   ```

2. **Configurer l'URL et l'authentification**
   ```typescript
   const api = createInterventionAPI(
     'https://api.votrebackend.com/interventions',
     'votre-api-key'
   );
   ```

3. **Adapter les types si nécessaire**
   - Les interfaces sont conçues pour être compatibles avec la plupart des backends
   - Ajustez les types selon votre API spécifique

4. **Tester la migration**
   ```typescript
   // Test de connectivité
   try {
     const test = await api.getList({ page: 1, limit: 1 });
     console.log('Connexion API réussie');
   } catch (error) {
     console.error('Erreur de connexion API:', error);
   }
   ```

## 📝 Notes importantes

- Toutes les méthodes sont asynchrones et retournent des Promises
- Les erreurs sont gérées avec des try/catch
- Les données mock sont persistées en mémoire pendant la session
- Les types TypeScript sont stricts pour éviter les erreurs
- L'API est conçue pour être RESTful et compatible avec la plupart des backends

## 🤝 Contribution

Pour ajouter de nouvelles fonctionnalités :

1. Ajoutez les types dans `interventionEndpoints.ts`
2. Implémentez la méthode dans la classe `InterventionEndpoints`
3. Ajoutez la logique mock dans `InterventionMockAPI`
4. Documentez l'utilisation dans ce README
5. Ajoutez des exemples dans `interventionUsageExample.ts`
