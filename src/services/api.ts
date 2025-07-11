
// API Mock pour CRM GMBS
// En production, remplacer par de vraies requêtes HTTP

export const DashboardAPI = {
  async getStats() {
    // Simulation latence réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      interventions_ouvertes: 24,
      ca_mois: 125000,
      satisfaction_moyenne: 4.2,
      retards_count: 3
    };
  },

  async getAlerts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        type: 'retard' as const,
        message: 'Intervention en retard de 3 jours',
        severity: 'high' as const,
        intervention_id: 'INT-2024-001'
      },
      {
        id: '2',
        type: 'devis_manquant' as const,
        message: 'Devis non uploadé depuis 2 jours',
        severity: 'medium' as const,
        intervention_id: 'INT-2024-015'
      }
    ];
  }
};

export const InterventionsAPI = {
  async getList(params: { page: number; filters?: any }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockData = [
      {
        id: 'INT-2024-001',
        client: 'Dupont SARL',
        artisan: 'Martin Électricité',
        statut: 'en_cours' as const,
        cree: '2024-01-15',
        echeance: '2024-01-20',
        description: 'Réparation tableau électrique'
      },
      {
        id: 'INT-2024-002',
        client: 'Restaurant Le Gourmet',
        artisan: 'Pro Plomberie',
        statut: 'demande' as const,
        cree: '2024-01-16',
        echeance: '2024-01-22',
        description: 'Fuite canalisations cuisine'
      },
      {
        id: 'INT-2024-003',
        client: 'Cabinet Médical Centre',
        artisan: 'Chauffage Plus',
        statut: 'termine' as const,
        cree: '2024-01-10',
        echeance: '2024-01-18',
        description: 'Maintenance chaudière'
      },
      {
        id: 'INT-2024-004',
        client: 'Boulangerie Tradition',
        artisan: 'Électro Service',
        statut: 'bloque' as const,
        cree: '2024-01-12',
        echeance: '2024-01-19',
        description: 'Installation four professionnel'
      }
    ];

    return {
      data: mockData,
      total: mockData.length,
      has_next: false
    };
  },

  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      id,
      // ... détails complets intervention
      timeline: [
        { step: 'Demandé', date: '2024-01-15', completed: true },
        { step: 'Assigné', date: '2024-01-16', completed: true },
        { step: 'En cours', date: '2024-01-17', completed: false },
        { step: 'Terminé', date: null, completed: false }
      ],
      comments: [],
      attachments: []
    };
  }
};

export const ArtisansAPI = {
  async getList(filters: any) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockData = [
      {
        id: 'ART-001',
        nom: 'Martin Électricité',
        statut: 'expert' as const,
        zone: 'Paris 15e',
        activite_badge: 'actif' as const,
        ca_mois: 8500,
        note_moyenne: 4.8,
        derniere_intervention: '2024-01-17'
      },
      {
        id: 'ART-002',
        nom: 'Pro Plomberie',
        statut: 'confirme' as const,
        zone: 'Boulogne',
        activite_badge: 'actif' as const,
        ca_mois: 6200,
        note_moyenne: 4.3,
        derniere_intervention: '2024-01-16'
      },
      {
        id: 'ART-003',
        nom: 'Chauffage Plus',
        statut: 'novice' as const,
        zone: 'Issy-les-Moulineaux',
        activite_badge: 'moyen' as const,
        ca_mois: 3800,
        note_moyenne: 4.1,
        derniere_intervention: '2024-01-10'
      },
      {
        id: 'ART-004',
        nom: 'Électro Service',
        statut: 'potentiel' as const,
        zone: 'Vanves',
        activite_badge: 'inactif' as const,
        ca_mois: 1200,
        note_moyenne: 3.9,
        derniere_intervention: '2023-12-28'
      }
    ];

    return {
      data: mockData,
      markers_geo: mockData.map(artisan => ({
        id: artisan.id,
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
        nom: artisan.nom
      }))
    };
  }
};

// Notifications endpoints
export const NotificationsAPI = {
  async getUrgent() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { count: 3, items: [] };
  },

  async getInternal() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { count: 10, items: [] };
  },

  async getReminders() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { count: 5, items: [] };
  }
};
