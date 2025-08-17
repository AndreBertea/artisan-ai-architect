// API fonctionnelle pour les interventions
// Gestion des modifications de prix et calculs de marge

import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';

export interface Intervention {
  id: string;
  client: string;
  artisan: string;
  artisan_metier?: string;
  artisan_status?: ARTISAN_STATUS; // Nouveau champ pour le statut d'artisan
  artisan_dossier_status?: ARTISAN_DOSSIER_STATUS; // Nouveau champ pour le statut de dossier
  agence?: string;
  utilisateur_assigné?: string;
  reference?: string;
  statut: 'demande' | 'devis_envoye' | 'accepte' | 'en_cours' | 'annule' | 'termine' | 'visite_technique' | 'refuse' | 'stand_by' | 'sav' | 'bloque';
  cree: string;
  echeance: string;
  description: string;
  montant?: number;
  adresse?: string;
  notes?: string;
  coutSST?: number;
  coutMateriaux?: number;
  coutInterventions?: number;
}

// Stockage local simulé (en production, ce serait une base de données)
let interventionsData: Intervention[] = [
  {
    id: 'INT-2024-001',
    client: 'Entreprise ABC',
    artisan: 'Jean Dupont',
    artisan_metier: 'Electricite',
    artisan_status: ARTISAN_STATUS.EXPERT,
    artisan_dossier_status: ARTISAN_DOSSIER_STATUS.COMPLET,
    agence: 'Paris Nord',
    utilisateur_assigné: 'admin',
    reference: 'REF-2024-001',
    statut: 'en_cours',
    cree: '2024-01-15',
    echeance: '2024-01-20',
    description: 'Réparation tableau électrique',
    adresse: 'Rue de la Paix, 75001 Paris',
    montant: 1200,
    coutSST: 350,
    coutMateriaux: 269.88,
    coutInterventions: 1534.13
  },
  {
    id: 'INT-2024-002',
    client: 'Résidence Les Jardins',
    artisan: 'Marie Martin',
    artisan_metier: 'Plomberie',
    artisan_status: ARTISAN_STATUS.CONFIRME,
    artisan_dossier_status: ARTISAN_DOSSIER_STATUS.A_FINALISER,
    agence: 'Boulogne',
    utilisateur_assigné: 'Morin',
    reference: 'REF-2024-002',
    statut: 'termine',
    cree: '2024-01-16',
    echeance: '2024-01-22',
    description: 'Fuite d\'eau',
    adresse: 'Avenue Victor Hugo, 75016 Paris',
    montant: 850,
    coutSST: 100,
    coutMateriaux: 0,
    coutInterventions: 265
  },
  {
    id: 'INT-2024-003',
    client: 'Restaurant Le Gourmet',
    artisan: 'Pierre Durand',
    artisan_metier: 'Menuiserie',
    artisan_status: ARTISAN_STATUS.NOVICE,
    artisan_dossier_status: ARTISAN_DOSSIER_STATUS.INCOMPLET,
    agence: 'Paris Centre',
    utilisateur_assigné: 'admin',
    reference: 'REF-2024-003',
    statut: 'en_cours',
    cree: '2024-01-10',
    echeance: '2024-01-18',
    description: 'Installation cuisine',
    adresse: 'Boulevard Central, 75008 Paris',
    montant: 2100,
    coutSST: 200,
    coutMateriaux: 800,
    coutInterventions: 600
  },
  {
    id: 'INT-2024-004',
    client: 'Boutique Mode & Co',
    artisan: 'Sophie Bernard',
    artisan_metier: 'Peinture',
    artisan_status: ARTISAN_STATUS.POTENTIEL,
    artisan_dossier_status: ARTISAN_DOSSIER_STATUS.INCOMPLET,
    agence: 'Paris Est',
    utilisateur_assigné: 'Morin',
    reference: 'REF-2024-004',
    statut: 'demande',
    cree: '2024-01-12',
    echeance: '2024-01-19',
    description: 'Peinture salon',
    adresse: 'Place du Marché, 75001 Paris',
    montant: 650,
    coutSST: 80,
    coutMateriaux: 150,
    coutInterventions: 200
  },
  {
    id: 'INT-2024-005',
    client: 'Hôtel Le Luxe',
    artisan: 'Marc Dubois',
    artisan_metier: 'Climatisation',
    artisan_status: ARTISAN_STATUS.FORMATION,
    artisan_dossier_status: ARTISAN_DOSSIER_STATUS.A_FINALISER,
    agence: 'Paris Ouest',
    utilisateur_assigné: 'admin',
    reference: 'REF-2024-005',
    statut: 'devis_envoye',
    cree: '2024-01-14',
    echeance: '2024-01-25',
    description: 'Maintenance système climatisation',
    adresse: 'Champs-Élysées, 75008 Paris',
    montant: 1800,
    coutSST: 250,
    coutMateriaux: 400,
    coutInterventions: 800
  },
  {
    id: 'INT-2024-006',
    client: 'Bureau Central',
    artisan: 'Luc Moreau',
    artisan_metier: 'Electricite',
    artisan_status: ARTISAN_STATUS.ONE_SHOT,
    artisan_dossier_status: ARTISAN_DOSSIER_STATUS.COMPLET,
    agence: 'Paris Sud',
    utilisateur_assigné: 'Morin',
    reference: 'REF-2024-006',
    statut: 'accepte',
    cree: '2024-01-13',
    echeance: '2024-01-21',
    description: 'Installation éclairage LED',
    adresse: 'Rue de Rivoli, 75001 Paris',
    montant: 950,
    coutSST: 120,
    coutMateriaux: 300,
    coutInterventions: 400
  }
];

// Fonctions utilitaires
export const calculateMarge = (intervention: Intervention): number => {
  const montant = intervention.montant || 0;
  const coutSST = intervention.coutSST || 0;
  const coutMateriaux = intervention.coutMateriaux || 0;
  const coutInterventions = intervention.coutInterventions || 0;
  return montant - coutSST - coutMateriaux - coutInterventions;
};

// Calculer la marge avec un pourcentage cible (ex: 20% de marge)
export const calculateMargeWithTarget = (intervention: Intervention, targetMarginPercentage: number = 20): number => {
  const coutSST = intervention.coutSST || 0;
  const coutMateriaux = intervention.coutMateriaux || 0;
  const coutInterventions = intervention.coutInterventions || 0;
  const totalCosts = coutSST + coutMateriaux + coutInterventions;
  
  if (totalCosts === 0) return 0;
  
  // Calculer le prix cible avec la marge souhaitée
  const targetPrice = totalCosts / (1 - targetMarginPercentage / 100);
  const targetMargin = targetPrice - totalCosts;
  
  return targetMargin;
};

// Calculer le prix recommandé avec marge
export const calculateRecommendedPrice = (intervention: Intervention, targetMarginPercentage: number = 20): number => {
  const coutSST = intervention.coutSST || 0;
  const coutMateriaux = intervention.coutMateriaux || 0;
  const coutInterventions = intervention.coutInterventions || 0;
  const totalCosts = coutSST + coutMateriaux + coutInterventions;
  
  if (totalCosts === 0) return 0;
  
  return totalCosts / (1 - targetMarginPercentage / 100);
};

export const formatCurrency = (amount?: number): string => {
  if (!amount) return '€0';
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount);
};

// API principale
export const InterventionAPI = {
  // Récupérer toutes les interventions
  async getAll(): Promise<Intervention[]> {
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...interventionsData];
  },

  // Récupérer les interventions avec pagination et filtres
  async getPaginated(params: {
    page: number;
    pageSize: number;
    user?: string;
    status?: string;
    artisanStatuses?: ARTISAN_STATUS[];
    dossierStatuses?: ARTISAN_DOSSIER_STATUS[];
    dateRange?: { from: Date | null; to: Date | null };
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
  }): Promise<{
    data: Intervention[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredData = [...interventionsData];
    
    // Appliquer les filtres
    if (params.user) {
      filteredData = filteredData.filter(i => i.utilisateur_assigné === params.user);
    }
    
    if (params.status) {
      filteredData = filteredData.filter(i => i.statut === params.status);
    }
    
    if (params.artisanStatuses && params.artisanStatuses.length > 0) {
      filteredData = filteredData.filter(i => i.artisan_status && params.artisanStatuses!.includes(i.artisan_status));
    }
    
    if (params.dossierStatuses && params.dossierStatuses.length > 0) {
      filteredData = filteredData.filter(i => i.artisan_dossier_status && params.dossierStatuses!.includes(i.artisan_dossier_status));
    }
    
    if (params.dateRange) {
      if (params.dateRange.from) {
        filteredData = filteredData.filter(i => new Date(i.echeance) >= params.dateRange.from!);
      }
      if (params.dateRange.to) {
        filteredData = filteredData.filter(i => new Date(i.echeance) <= params.dateRange.to!);
      }
    }
    
    // Appliquer le tri
    if (params.sortField) {
      filteredData.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (params.sortField) {
          case 'cree':
            aValue = new Date(a.cree).getTime();
            bValue = new Date(b.cree).getTime();
            break;
          case 'echeance':
            aValue = new Date(a.echeance).getTime();
            bValue = new Date(b.echeance).getTime();
            break;
          case 'marge':
            aValue = (a.montant || 0) - (a.coutSST || 0) - (a.coutMateriaux || 0) - (a.coutInterventions || 0);
            bValue = (b.montant || 0) - (b.coutSST || 0) - (b.coutMateriaux || 0) - (b.coutInterventions || 0);
            break;
          default:
            return 0;
        }

        if (params.sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }
    
    const total = filteredData.length;
    const totalPages = Math.ceil(total / params.pageSize);
    const startIndex = (params.page - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total,
      totalPages,
      currentPage: params.page,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1
    };
  },

  // Récupérer une intervention par ID
  async getById(id: string): Promise<Intervention | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return interventionsData.find(i => i.id === id) || null;
  },

  // Mettre à jour le statut
  async updateStatus(id: string, newStatus: Intervention['statut']): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.statut = newStatus;
    return { ...intervention };
  },

  // Mettre à jour le montant principal
  async updateMontant(id: string, newMontant: number): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.montant = Math.max(0, newMontant);
    return { ...intervention };
  },

  // Mettre à jour le coût SST
  async updateCoutSST(id: string, newCout: number): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.coutSST = Math.max(0, newCout);
    return { ...intervention };
  },

  // Mettre à jour le coût matériaux
  async updateCoutMateriaux(id: string, newCout: number): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.coutMateriaux = Math.max(0, newCout);
    return { ...intervention };
  },

  // Mettre à jour le coût interventions
  async updateCoutInterventions(id: string, newCout: number): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.coutInterventions = Math.max(0, newCout);
    return { ...intervention };
  },

  // Mettre à jour l'artisan
  async updateArtisan(id: string, newArtisan: string): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.artisan = newArtisan;
    return { ...intervention };
  },

  // Mettre à jour le statut d'artisan
  async updateArtisanStatus(id: string, newStatus: ARTISAN_STATUS): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.artisan_status = newStatus;
    return { ...intervention };
  },

  // Mettre à jour le statut de dossier
  async updateArtisanDossierStatus(id: string, newStatus: ARTISAN_DOSSIER_STATUS): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.artisan_dossier_status = newStatus;
    return { ...intervention };
  },

  // Mettre à jour le client
  async updateClient(id: string, newClient: string): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.client = newClient;
    return { ...intervention };
  },

  // Mettre à jour la description
  async updateDescription(id: string, newDescription: string): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.description = newDescription;
    return { ...intervention };
  },

  // Mettre à jour l'adresse
  async updateAddress(id: string, newAddress: string): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.adresse = newAddress;
    return { ...intervention };
  },

  // Mettre à jour les notes
  async updateNotes(id: string, newNotes: string): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.notes = newNotes;
    return { ...intervention };
  },

  // Mettre à jour la date d'échéance
  async updateEcheance(id: string, newEcheance: string): Promise<Intervention> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.echeance = newEcheance;
    return { ...intervention };
  },

  // Calculer et retourner les statistiques financières
  async getFinancialStats(id: string): Promise<{
    coutSST: number;
    coutMateriaux: number;
    coutInterventions: number;
    marge: number;
    margePourcentage: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const intervention = interventionsData.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    const coutSST = intervention.coutSST || 0;
    const coutMateriaux = intervention.coutMateriaux || 0;
    const coutInterventions = intervention.coutInterventions || 0;
    const marge = coutInterventions - coutSST - coutMateriaux;
    const margePourcentage = coutInterventions > 0 ? (marge / coutInterventions) * 100 : 0;

    return {
      coutSST,
      coutMateriaux,
      coutInterventions,
      marge,
      margePourcentage
    };
  },

  // Réinitialiser les données (pour les tests)
  resetData(): void {
    interventionsData = [
      {
        id: 'INT-2024-001',
        client: 'Entreprise ABC',
        artisan: 'Jean Dupont',
        artisan_metier: 'Electricite',
        artisan_status: ARTISAN_STATUS.EXPERT,
        artisan_dossier_status: ARTISAN_DOSSIER_STATUS.COMPLET,
        agence: 'Paris Nord',
        utilisateur_assigné: 'admin',
        reference: 'REF-2024-001',
        statut: 'en_cours',
        cree: '2024-01-15',
        echeance: '2024-01-20',
        description: 'Réparation tableau électrique',
        adresse: 'Rue de la Paix, 75001 Paris',
        montant: 1200,
        coutSST: 150,
        coutMateriaux: 300,
        coutInterventions: 400
      },
      {
        id: 'INT-2024-002',
        client: 'Résidence Les Jardins',
        artisan: 'Marie Martin',
        artisan_metier: 'Plomberie',
        artisan_status: ARTISAN_STATUS.CONFIRME,
        artisan_dossier_status: ARTISAN_DOSSIER_STATUS.A_FINALISER,
        agence: 'Boulogne',
        utilisateur_assigné: 'Morin',
        reference: 'REF-2024-002',
        statut: 'termine',
        cree: '2024-01-16',
        echeance: '2024-01-22',
        description: 'Fuite d\'eau',
        adresse: 'Avenue Victor Hugo, 75016 Paris',
        montant: 850,
        coutSST: 100,
        coutMateriaux: 200,
        coutInterventions: 250
      },
      {
        id: 'INT-2024-003',
        client: 'Restaurant Le Gourmet',
        artisan: 'Pierre Durand',
        artisan_metier: 'Menuiserie',
        artisan_status: ARTISAN_STATUS.NOVICE,
        artisan_dossier_status: ARTISAN_DOSSIER_STATUS.INCOMPLET,
        agence: 'Paris Centre',
        utilisateur_assigné: 'admin',
        reference: 'REF-2024-003',
        statut: 'en_cours',
        cree: '2024-01-10',
        echeance: '2024-01-18',
        description: 'Installation cuisine',
        adresse: 'Boulevard Central, 75008 Paris',
        montant: 2100,
        coutSST: 200,
        coutMateriaux: 800,
        coutInterventions: 600
      },
      {
        id: 'INT-2024-004',
        client: 'Boutique Mode & Co',
        artisan: 'Sophie Bernard',
        artisan_metier: 'Peinture',
        artisan_status: ARTISAN_STATUS.POTENTIEL,
        artisan_dossier_status: ARTISAN_DOSSIER_STATUS.INCOMPLET,
        agence: 'Paris Est',
        utilisateur_assigné: 'Morin',
        reference: 'REF-2024-004',
        statut: 'demande',
        cree: '2024-01-12',
        echeance: '2024-01-19',
        description: 'Peinture salon',
        adresse: 'Place du Marché, 75001 Paris',
        montant: 650,
        coutSST: 80,
        coutMateriaux: 150,
        coutInterventions: 200
      }
    ];
  }
};
