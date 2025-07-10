// HTTP client with mock interceptor for development
class HttpClient {
  private mockData: Record<string, any> = {};

  constructor() {
    this.setupMocks();
  }

  private setupMocks() {
    // Dashboard mocks
    this.mockData['/dashboard/stats'] = {
      interventions_ouvertes: 23,
      ca_mois: 127500,
      satisfaction_moyenne: 4.3,
      retards_count: 3
    };

    this.mockData['/dashboard/alerts'] = [
      { type: 'retard', message: 'Intervention #1234 en retard de 3 jours', severity: 'high', intervention_id: '1234' },
      { type: 'devis', message: 'Devis manquant pour intervention #5678', severity: 'medium', intervention_id: '5678' }
    ];

    // Interventions mocks
    this.mockData['/interventions'] = {
      data: [
        {
          id: 'INT-001',
          client: 'Martin Dupont',
          artisan: 'Jean Durand',
          statut: 'En cours',
          date_creation: '2024-01-15',
          date_echeance: '2024-01-25',
          description: 'Réparation plomberie'
        },
        {
          id: 'INT-002',
          client: 'Sophie Martin',
          artisan: 'Pierre Moreau',
          statut: 'Demandé',
          date_creation: '2024-01-16',
          date_echeance: '2024-01-26',
          description: 'Installation électrique'
        },
        {
          id: 'INT-003',
          client: 'Paul Bernard',
          artisan: 'Marie Leroy',
          statut: 'Terminé',
          date_creation: '2024-01-10',
          date_echeance: '2024-01-20',
          description: 'Peinture salon'
        }
      ],
      total: 3,
      has_next: false
    };

    // Artisans mocks
    this.mockData['/artisans'] = {
      data: [
        {
          id: 'ART-001',
          nom: 'Jean Durand',
          statut: 'Confirmé',
          zone: '75001-75010',
          activite: 'Actif',
          ca_mois: 4500,
          specialites: 'Plomberie, Chauffage',
          nb_interventions: 28,
          note_moyenne: 4.6
        },
        {
          id: 'ART-002',
          nom: 'Pierre Moreau',
          statut: 'Expert',
          zone: '75011-75020',
          activite: 'Actif',
          ca_mois: 6200,
          specialites: 'Électricité',
          nb_interventions: 45,
          note_moyenne: 4.8
        },
        {
          id: 'ART-003',
          nom: 'Marie Leroy',
          statut: 'Novice',
          zone: '92001-92999',
          activite: 'Moyen',
          ca_mois: 2800,
          specialites: 'Peinture, Décoration',
          nb_interventions: 12,
          note_moyenne: 4.2
        }
      ]
    };
  }

  async get(url: string): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const mockKey = url.split('?')[0]; // Remove query params for mock lookup
    
    if (this.mockData[mockKey]) {
      return this.mockData[mockKey];
    }
    
    throw new Error(`No mock data found for ${url}`);
  }

  async post(url: string, data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true, data };
  }

  async put(url: string, data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true, data };
  }

  async delete(url: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  }
}

export const httpClient = new HttpClient();