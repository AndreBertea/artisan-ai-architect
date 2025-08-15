
// API Mock pour CRM GMBS
// En production, remplacer par de vraies requêtes HTTP

// Données cohérentes partagées
type ArtisansStatut = 'expert' | 'confirme' | 'novice' | 'potentiel';

const ARTISANS_DATA: Array<{
  id: string;
  nom: string;
  specialite: string;
  statut: ArtisansStatut;
  zone: string;
  activite_badge: 'actif' | 'moyen' | 'inactif';
  ca_mois: number;
  note_moyenne: number;
  derniere_intervention: string;
  disponible: boolean;
}> = [
  {
    id: 'ART-001',
    nom: 'Jean Dupont',
    specialite: 'Électricien',
    statut: 'expert',
    zone: 'Paris 15e',
    activite_badge: 'actif',
    ca_mois: 8500,
    note_moyenne: 4.8,
    derniere_intervention: '2024-01-17',
    disponible: true
  },
  {
    id: 'ART-002',
    nom: 'Marie Martin',
    specialite: 'Plombier',
    statut: 'confirme',
    zone: 'Boulogne',
    activite_badge: 'actif',
    ca_mois: 6200,
    note_moyenne: 4.3,
    derniere_intervention: '2024-01-16',
    disponible: false
  },
  {
    id: 'ART-003',
    nom: 'Pierre Durand',
    specialite: 'Menuisier',
    statut: 'novice',
    zone: 'Issy-les-Moulineaux',
    activite_badge: 'moyen',
    ca_mois: 3800,
    note_moyenne: 4.1,
    derniere_intervention: '2024-01-10',
    disponible: true
  },
  {
    id: 'ART-004',
    nom: 'Sophie Bernard',
    specialite: 'Peintre',
    statut: 'potentiel',
    zone: 'Vanves',
    activite_badge: 'inactif',
    ca_mois: 1200,
    note_moyenne: 3.9,
    derniere_intervention: '2023-12-28',
    disponible: false
  }
];

const CLIENTS_DATA = [
  {
    id: 'CLI-001',
    nom: 'Entreprise ABC',
    type: 'Client premium',
    adresse: '15 Rue de la République, 75011 Paris',
    evaluation: 4.5,
    interventions_count: 15,
    contact: 'contact@abc.fr',
    evaluations: [
      { intervention: 'INT-2024-001', note: 4.5, date: '2024-01-15' },
      { intervention: 'INT-2024-015', note: 4.8, date: '2024-01-10' }
    ],
    lat: 48.8566,
    lng: 2.3522,
    interventions: ['INT-2024-001', 'INT-2024-015']
  },
  {
    id: 'CLI-002', 
    nom: 'Résidence Les Jardins',
    type: 'Syndic',
    adresse: '28 Boulevard Saint-Germain, 75005 Paris',
    evaluation: 4.2,
    interventions_count: 8,
    contact: 'syndic@jardins.fr',
    evaluations: [
      { intervention: 'INT-2024-002', note: 4.2, date: '2024-01-16' }
    ],
    lat: 48.8534,
    lng: 2.3488,
    interventions: ['INT-2024-002']
  },
  {
    id: 'CLI-003',
    nom: 'Restaurant Le Gourmet',
    type: 'Client régulier',
    adresse: '42 Avenue des Champs-Élysées, 75008 Paris',
    evaluation: 4.7,
    interventions_count: 12,
    contact: 'chef@gourmet.fr',
    evaluations: [
      { intervention: 'INT-2024-003', note: 4.7, date: '2024-01-10' }
    ],
    lat: 48.8698,
    lng: 2.3075,
    interventions: ['INT-2024-003']
  },
  {
    id: 'CLI-004',
    nom: 'Boutique Mode & Co',
    type: 'Nouveau client',
    adresse: '8 Rue Montmartre, 75001 Paris', 
    evaluation: 3.9,
    interventions_count: 2,
    contact: 'info@modeco.fr',
    evaluations: [
      { intervention: 'INT-2024-004', note: 3.9, date: '2024-01-12' }
    ],
    lat: 48.8647,
    lng: 2.3421,
    interventions: ['INT-2024-004']
  }
];

const INTERVENTIONS_DATA = [
  {
    id: 'INT-2024-001',
    client: 'Entreprise ABC',
    client_id: 'CLI-001',
    artisan: 'Jean Dupont',
    artisan_id: 'ART-001',
    artisan_metier: 'Electricite' as const,
    agence: 'Paris Nord',
    utilisateur_assigné: 'admin',
    reference: 'REF-2024-001',
    statut: 'en_cours' as const,
    cree: '2024-01-15',
    echeance: '2024-01-20',
    description: 'Réparation tableau électrique',
    adresse: 'Rue de la Paix, 75001 Paris',
    montant: 1200
  },
  {
    id: 'INT-2024-002',
    client: 'Résidence Les Jardins',
    client_id: 'CLI-002',
    artisan: 'Marie Martin',
    artisan_id: 'ART-002',
    artisan_metier: 'Plomberie' as const,
    agence: 'Boulogne',
    utilisateur_assigné: 'Morin',
    reference: 'REF-2024-002',
    statut: 'termine' as const,
    cree: '2024-01-16',
    echeance: '2024-01-22',
    description: 'Fuite d\'eau',
    adresse: 'Avenue Victor Hugo, 75016 Paris',
    montant: 850
  },
  {
    id: 'INT-2024-003',
    client: 'Restaurant Le Gourmet',
    client_id: 'CLI-003',
    artisan: 'Pierre Durand',
    artisan_id: 'ART-003',
    artisan_metier: 'Menuiserie' as const,
    agence: 'Paris Centre',
    utilisateur_assigné: 'admin',
    reference: 'REF-2024-003',
    statut: 'en_cours' as const,
    cree: '2024-01-10',
    echeance: '2024-01-18',
    description: 'Installation cuisine',
    adresse: 'Boulevard Central, 75008 Paris',
    montant: 2100
  },
  {
    id: 'INT-2024-004',
    client: 'Boutique Mode & Co',
    client_id: 'CLI-004',
    artisan: 'Sophie Bernard',
    artisan_id: 'ART-004',
    artisan_metier: 'Peinture' as const,
    agence: 'Paris Est',
    utilisateur_assigné: 'Morin',
    reference: 'REF-2024-004',
    statut: 'demande' as const,
    cree: '2024-01-12',
    echeance: '2024-01-19',
    description: 'Peinture salon',
    adresse: 'Place du Marché, 75001 Paris',
    montant: 650
  }
];

export const DashboardAPI = {
  async getStats() {
    // Simulation latence réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const interventionsEnCours = INTERVENTIONS_DATA.filter(i => i.statut === 'en_cours').length;
    const interventionsTerminees = INTERVENTIONS_DATA.filter(i => i.statut === 'termine').length;
    const caTotal = INTERVENTIONS_DATA.reduce((sum, i) => sum + i.montant, 0);
    const satisfactionMoyenne = CLIENTS_DATA.reduce((sum, c) => sum + c.evaluation, 0) / CLIENTS_DATA.length;
    
    return {
      interventions_ouvertes: interventionsEnCours,
      interventions_terminees: interventionsTerminees,
      ca_mois: caTotal,
      satisfaction_moyenne: Math.round(satisfactionMoyenne * 10) / 10,
      retards_count: 1,
      artisans_disponibles: ARTISANS_DATA.filter(a => a.disponible).length,
      clients_actifs: CLIENTS_DATA.length
    };
  },

  async getAlerts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        type: 'retard' as const,
        message: 'Intervention INT-2024-001 en retard de 3 jours',
        severity: 'high' as const,
        intervention_id: 'INT-2024-001'
      },
      {
        id: '2',
        type: 'devis_manquant' as const,
        message: 'Devis non uploadé pour INT-2024-004',
        severity: 'medium' as const,
        intervention_id: 'INT-2024-004'
      },
      {
        id: '3',
        type: 'artisan_indisponible' as const,
        message: 'Sophie Bernard en congé jusqu\'au 15/12',
        severity: 'low' as const,
        artisan_id: 'ART-004'
      }
    ];
  }
};

export const InterventionsAPI = {
  async getList(params: { page: number; filters?: any }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      data: INTERVENTIONS_DATA,
      total: INTERVENTIONS_DATA.length,
      has_next: false
    };
  },

  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const intervention = INTERVENTIONS_DATA.find(i => i.id === id);
    if (!intervention) throw new Error('Intervention non trouvée');
    
    return {
      ...intervention,
      timeline: [
        { step: 'Demandé', date: intervention.cree, completed: true },
        { step: 'Assigné', date: intervention.cree, completed: true },
        { step: 'En cours', date: intervention.statut === 'en_cours' ? intervention.cree : null, completed: intervention.statut === 'en_cours' || intervention.statut === 'termine' },
        { step: 'Terminé', date: intervention.statut === 'termine' ? intervention.echeance : null, completed: intervention.statut === 'termine' }
      ],
      comments: [
        { id: '1', user: 'GM', message: 'Intervention planifiée', date: intervention.cree },
        { id: '2', user: intervention.artisan, message: 'Début des travaux', date: intervention.cree }
      ],
      attachments: [
        { id: '1', name: 'devis.pdf', type: 'pdf', size: '245 KB' },
        { id: '2', name: 'photos_avant.jpg', type: 'image', size: '1.2 MB' }
      ]
    };
  }
};

export const ArtisansAPI = {
  async getList(filters: any) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: ARTISANS_DATA,
      markers_geo: ARTISANS_DATA.map(artisan => ({
        id: artisan.id,
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
        nom: artisan.nom,
        specialite: artisan.specialite
      }))
    };
  },

  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ARTISANS_DATA.find(artisan => artisan.id === id);
  }
};

export const ClientsAPI = {
  async getList() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { data: CLIENTS_DATA };
  },

  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return CLIENTS_DATA.find(client => client.id === id);
  }
};

export const NotificationsAPI = {
  async getUrgent() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      count: 3, 
      items: [
        { id: '1', type: 'retard', message: 'Intervention INT-2024-001 en retard', date: '2024-01-17' },
        { id: '2', type: 'devis', message: 'Devis manquant pour INT-2024-004', date: '2024-01-16' },
        { id: '3', type: 'artisan', message: 'Sophie Bernard indisponible', date: '2024-01-15' }
      ] 
    };
  },

  async getInternal() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      count: 10, 
      items: [
        { id: '1', type: 'info', message: 'Nouveau client Boutique Mode & Co', date: '2024-01-17' },
        { id: '2', type: 'success', message: 'Intervention INT-2024-002 terminée', date: '2024-01-16' },
        { id: '3', type: 'warning', message: 'Maintenance préventive programmée', date: '2024-01-15' }
      ] 
    };
  },

  async getReminders() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { 
      count: 5, 
      items: [
        { id: '1', type: 'reminder', message: 'Facturation mensuelle à effectuer', date: '2024-01-20' },
        { id: '2', type: 'reminder', message: 'Révision contrat Entreprise ABC', date: '2024-01-25' },
        { id: '3', type: 'reminder', message: 'Formation sécurité artisans', date: '2024-01-30' }
      ] 
    };
  }
};
