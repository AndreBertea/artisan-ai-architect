// Mock API pour les interventions - Simulation des réponses backend
// Utilisé pendant le développement avant l'intégration du vrai backend

import { 
  InterventionEndpoints, 
  Intervention, 
  InterventionStatus, 
  InterventionListResponse,
  InterventionFilters,
  InterventionSort,
  InterventionStats,
  InterventionFinancialData,
  InterventionDocument,
  InterventionHistory,
  InterventionCreateRequest,
  InterventionUpdateRequest
} from './interventionEndpoints';
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';

// ============================================================================
// DONNÉES MOCK
// ============================================================================

const mockInterventions: Intervention[] = [
  {
    id: 'INT-2024-001',
    client: 'Entreprise ABC',
    client_id: 'CLI-001',
    artisan: 'Jean Dupont',
    artisan_id: 'ART-001',
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
    coutInterventions: 1534.13,
    priorite: 'haute',
    tags: ['électricité', 'urgent'],
    documents: [
      {
        id: 'DOC-001',
        nom: 'devis_electrique.pdf',
        type: 'devis',
        url: '/documents/devis_electrique.pdf',
        taille: 1024000,
        uploaded_at: '2024-01-15T10:30:00Z',
        uploaded_by: 'admin'
      }
    ],
    historique: [
      {
        id: 'HIST-001',
        action: 'Création',
        description: 'Intervention créée',
        user_id: 'admin',
        user_name: 'Administrateur',
        timestamp: '2024-01-15T09:00:00Z'
      },
      {
        id: 'HIST-002',
        action: 'Statut modifié',
        description: 'Statut changé de "demande" à "en_cours"',
        user_id: 'admin',
        user_name: 'Administrateur',
        timestamp: '2024-01-15T14:30:00Z',
        changes: {
          statut: { old: 'demande', new: 'en_cours' }
        }
      }
    ],
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'INT-2024-002',
    client: 'Résidence Les Jardins',
    client_id: 'CLI-002',
    artisan: 'Marie Martin',
    artisan_id: 'ART-002',
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
    coutInterventions: 265,
    priorite: 'normale',
    tags: ['plomberie'],
    documents: [],
    historique: [],
    created_at: '2024-01-16T08:00:00Z',
    updated_at: '2024-01-22T16:00:00Z'
  },
  {
    id: 'INT-2024-003',
    client: 'Restaurant Le Gourmet',
    client_id: 'CLI-003',
    artisan: 'Pierre Durand',
    artisan_id: 'ART-003',
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
    coutInterventions: 600,
    priorite: 'normale',
    tags: ['menuiserie', 'cuisine'],
    documents: [],
    historique: [],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-12T15:30:00Z'
  },
  {
    id: 'INT-2024-004',
    client: 'Boutique Mode & Co',
    client_id: 'CLI-004',
    artisan: 'Sophie Bernard',
    artisan_id: 'ART-004',
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
    coutInterventions: 200,
    priorite: 'basse',
    tags: ['peinture'],
    documents: [],
    historique: [],
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-12T11:00:00Z'
  },
  {
    id: 'INT-2024-005',
    client: 'Hôtel Le Luxe',
    client_id: 'CLI-005',
    artisan: 'Marc Dubois',
    artisan_id: 'ART-005',
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
    coutInterventions: 800,
    priorite: 'haute',
    tags: ['climatisation', 'maintenance'],
    documents: [],
    historique: [],
    created_at: '2024-01-14T09:30:00Z',
    updated_at: '2024-01-16T14:00:00Z'
  }
];

// ============================================================================
// FONCTIONS UTILITAIRES MOCK
// ============================================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const filterInterventions = (
  interventions: Intervention[], 
  filters?: InterventionFilters
): Intervention[] => {
  if (!filters) return interventions;

  return interventions.filter(intervention => {
    // Filtre par statut
    if (filters.statut && filters.statut.length > 0) {
      if (!filters.statut.includes(intervention.statut)) return false;
    }

    // Filtre par artisan
    if (filters.artisan_id && filters.artisan_id.length > 0) {
      if (!filters.artisan_id.includes(intervention.artisan_id)) return false;
    }

    // Filtre par client
    if (filters.client_id && filters.client_id.length > 0) {
      if (!filters.client_id.includes(intervention.client_id)) return false;
    }

    // Filtre par agence
    if (filters.agence && filters.agence.length > 0) {
      if (!filters.agence.includes(intervention.agence || '')) return false;
    }

    // Filtre par utilisateur assigné
    if (filters.utilisateur_assigné && filters.utilisateur_assigné.length > 0) {
      if (!filters.utilisateur_assigné.includes(intervention.utilisateur_assigné || '')) return false;
    }

    // Filtre par statut d'artisan
    if (filters.artisan_status && filters.artisan_status.length > 0) {
      if (!filters.artisan_status.includes(intervention.artisan_status || ARTISAN_STATUS.NOVICE)) return false;
    }

    // Filtre par statut de dossier
    if (filters.artisan_dossier_status && filters.artisan_dossier_status.length > 0) {
      if (!filters.artisan_dossier_status.includes(intervention.artisan_dossier_status || ARTISAN_DOSSIER_STATUS.INCOMPLET)) return false;
    }

    // Filtre par montant
    if (filters.montant_min && intervention.montant && intervention.montant < filters.montant_min) {
      return false;
    }
    if (filters.montant_max && intervention.montant && intervention.montant > filters.montant_max) {
      return false;
    }

    // Filtre par priorité
    if (filters.priorite && filters.priorite.length > 0) {
      if (!filters.priorite.includes(intervention.priorite || 'normale')) return false;
    }

    // Filtre par tags
    if (filters.tags && filters.tags.length > 0) {
      const interventionTags = intervention.tags || [];
      if (!filters.tags.some(tag => interventionTags.includes(tag))) return false;
    }

    return true;
  });
};

const sortInterventions = (
  interventions: Intervention[], 
  sort?: InterventionSort
): Intervention[] => {
  if (!sort) return interventions;

  return [...interventions].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sort.direction === 'asc' ? -1 : 1;
    if (bValue === undefined) return sort.direction === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sort.direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sort.direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });
};

// ============================================================================
// CLASSE MOCK API
// ============================================================================

export class InterventionMockAPI extends InterventionEndpoints {
  private interventions: Intervention[] = [...mockInterventions];

  constructor() {
    super();
  }

  // Override des méthodes pour simuler le comportement API

  async getList(params: {
    page?: number;
    limit?: number;
    filters?: InterventionFilters;
    sort?: InterventionSort;
  }): Promise<InterventionListResponse> {
    await delay(300); // Simulation du délai réseau

    let filteredData = filterInterventions(this.interventions, params.filters);
    const sortedData = sortInterventions(filteredData, params.sort);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        total_pages: Math.ceil(filteredData.length / limit)
      },
      filters: params.filters || {},
      sort: params.sort || { field: 'created_at', direction: 'desc' }
    };
  }

  async getById(id: string): Promise<Intervention> {
    await delay(200);
    
    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }
    
    return intervention;
  }

  async create(data: InterventionCreateRequest): Promise<Intervention> {
    await delay(400);

    const newIntervention: Intervention = {
      id: `INT-${Date.now()}`,
      client: 'Client à récupérer',
      client_id: data.client_id,
      artisan: 'Artisan à récupérer',
      artisan_id: data.artisan_id,
      description: data.description,
      adresse: data.adresse,
      echeance: data.echeance,
      montant: data.montant,
      priorite: data.priorite || 'normale',
      notes: data.notes,
      tags: data.tags || [],
      statut: 'demande',
      cree: new Date().toISOString().split('T')[0],
      documents: [],
      historique: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.interventions.push(newIntervention);
    return newIntervention;
  }

  async update(id: string, data: InterventionUpdateRequest): Promise<Intervention> {
    await delay(300);

    const index = this.interventions.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Intervention non trouvée');
    }

    const updatedIntervention = {
      ...this.interventions[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    this.interventions[index] = updatedIntervention;
    return updatedIntervention;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    await delay(200);

    const index = this.interventions.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Intervention non trouvée');
    }

    this.interventions.splice(index, 1);
    return { success: true, message: 'Intervention supprimée avec succès' };
  }

  async updateStatus(id: string, statut: InterventionStatus): Promise<Intervention> {
    await delay(200);

    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.statut = statut;
    intervention.updated_at = new Date().toISOString();

    // Ajouter à l'historique
    const historyEntry: InterventionHistory = {
      id: `HIST-${Date.now()}`,
      action: 'Statut modifié',
      description: `Statut changé vers "${statut}"`,
      user_id: 'current-user',
      user_name: 'Utilisateur actuel',
      timestamp: new Date().toISOString(),
      changes: {
        statut: { old: intervention.statut, new: statut }
      }
    };

    intervention.historique = intervention.historique || [];
    intervention.historique.push(historyEntry);

    return intervention;
  }

  async updateMontant(id: string, montant: number): Promise<Intervention> {
    await delay(200);

    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    intervention.montant = montant;
    intervention.updated_at = new Date().toISOString();
    return intervention;
  }

  async updateCouts(
    id: string, 
    couts: {
      coutSST?: number;
      coutMateriaux?: number;
      coutInterventions?: number;
    }
  ): Promise<Intervention> {
    await delay(200);

    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    Object.assign(intervention, couts);
    intervention.updated_at = new Date().toISOString();
    return intervention;
  }

  async getStats(filters?: InterventionFilters): Promise<InterventionStats> {
    await delay(500);

    const filteredData = filterInterventions(this.interventions, filters);
    
    const par_statut: Record<InterventionStatus, number> = {
      demande: 0,
      devis_envoye: 0,
      accepte: 0,
      en_cours: 0,
      annule: 0,
      termine: 0,
      visite_technique: 0,
      refuse: 0,
      stand_by: 0,
      sav: 0,
      bloque: 0
    };

    const par_agence: Record<string, number> = {};
    const par_artisan: Record<string, number> = {};
    let montant_total = 0;
    let retards = 0;
    let en_cours = 0;
    let termine_ce_mois = 0;

    filteredData.forEach(intervention => {
      // Compter par statut
      par_statut[intervention.statut]++;

      // Compter par agence
      const agence = intervention.agence || 'Non assignée';
      par_agence[agence] = (par_agence[agence] || 0) + 1;

      // Compter par artisan
      par_artisan[intervention.artisan] = (par_artisan[intervention.artisan] || 0) + 1;

      // Calculer montants
      if (intervention.montant) {
        montant_total += intervention.montant;
      }

      // Compter retards
      if (intervention.statut === 'en_cours' && new Date(intervention.echeance) < new Date()) {
        retards++;
      }

      // Compter en cours
      if (intervention.statut === 'en_cours') {
        en_cours++;
      }

      // Compter terminées ce mois
      if (intervention.statut === 'termine') {
        const termineDate = new Date(intervention.updated_at);
        const now = new Date();
        if (termineDate.getMonth() === now.getMonth() && termineDate.getFullYear() === now.getFullYear()) {
          termine_ce_mois++;
        }
      }
    });

    return {
      total: filteredData.length,
      par_statut,
      par_agence,
      par_artisan,
      montant_total,
      montant_moyen: filteredData.length > 0 ? montant_total / filteredData.length : 0,
      retards,
      en_cours,
      termine_ce_mois
    };
  }

  async getFinancialData(id: string): Promise<InterventionFinancialData> {
    await delay(200);

    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    const coutSST = intervention.coutSST || 0;
    const coutMateriaux = intervention.coutMateriaux || 0;
    const coutInterventions = intervention.coutInterventions || 0;
    const montant_facture = intervention.montant || 0;
    const marge = montant_facture - coutSST - coutMateriaux - coutInterventions;
    const margePourcentage = montant_facture > 0 ? (marge / montant_facture) * 100 : 0;

    return {
      coutSST,
      coutMateriaux,
      coutInterventions,
      marge,
      margePourcentage,
      montant_facture,
      montant_paye: montant_facture * 0.7, // Simulation
      montant_restant: montant_facture * 0.3 // Simulation
    };
  }

  async getDocuments(id: string): Promise<InterventionDocument[]> {
    await delay(200);

    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    return intervention.documents || [];
  }

  async getHistory(id: string): Promise<InterventionHistory[]> {
    await delay(200);

    const intervention = this.interventions.find(i => i.id === id);
    if (!intervention) {
      throw new Error('Intervention non trouvée');
    }

    return intervention.historique || [];
  }

  async getAvailableStatuses(): Promise<InterventionStatus[]> {
    await delay(100);
    return [
      'demande',
      'devis_envoye',
      'accepte',
      'en_cours',
      'annule',
      'termine',
      'visite_technique',
      'refuse',
      'stand_by',
      'sav',
      'bloque'
    ];
  }

  async getAvailablePriorities(): Promise<string[]> {
    await delay(100);
    return ['basse', 'normale', 'haute', 'urgente'];
  }

  // Méthode pour réinitialiser les données mock
  resetMockData(): void {
    this.interventions = [...mockInterventions];
  }

  // Méthode pour ajouter des données mock personnalisées
  addMockIntervention(intervention: Intervention): void {
    this.interventions.push(intervention);
  }
}

// ============================================================================
// INSTANCE PAR DÉFAUT
// ============================================================================

export const interventionMockAPI = new InterventionMockAPI();
