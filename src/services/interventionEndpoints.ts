// Endpoints API pour les interventions - Prêt pour l'intégration backend
// Ce fichier contient tous les types, interfaces et méthodes nécessaires

import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

export interface Intervention {
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

export type InterventionStatus = 
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

export interface InterventionDocument {
  id: string;
  nom: string;
  type: 'devis' | 'facture' | 'photo' | 'rapport' | 'autre';
  url: string;
  taille: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface InterventionHistory {
  id: string;
  action: string;
  description: string;
  user_id: string;
  user_name: string;
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
}

export interface InterventionFilters {
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

export interface InterventionSort {
  field: keyof Intervention;
  direction: 'asc' | 'desc';
}

export interface InterventionPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface InterventionListResponse {
  data: Intervention[];
  pagination: InterventionPagination;
  filters: InterventionFilters;
  sort: InterventionSort;
}

export interface InterventionCreateRequest {
  client_id: string;
  artisan_id: string;
  description: string;
  adresse: string;
  echeance: string;
  montant?: number;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
  notes?: string;
  tags?: string[];
}

export interface InterventionUpdateRequest {
  client_id?: string;
  artisan_id?: string;
  description?: string;
  adresse?: string;
  echeance?: string;
  montant?: number;
  statut?: InterventionStatus;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
  notes?: string;
  tags?: string[];
  coutSST?: number;
  coutMateriaux?: number;
  coutInterventions?: number;
}

export interface InterventionStats {
  total: number;
  par_statut: Record<InterventionStatus, number>;
  par_agence: Record<string, number>;
  par_artisan: Record<string, number>;
  montant_total: number;
  montant_moyen: number;
  retards: number;
  en_cours: number;
  termine_ce_mois: number;
}

export interface InterventionFinancialData {
  coutSST: number;
  coutMateriaux: number;
  coutInterventions: number;
  marge: number;
  margePourcentage: number;
  montant_facture: number;
  montant_paye: number;
  montant_restant: number;
}

// ============================================================================
// ENDPOINTS API
// ============================================================================

export class InterventionEndpoints {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = '/api/interventions', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  /**
   * Récupérer la liste des interventions avec filtres, tri et pagination
   */
  async getList(params: {
    page?: number;
    limit?: number;
    filters?: InterventionFilters;
    sort?: InterventionSort;
  }): Promise<InterventionListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.filters) searchParams.append('filters', JSON.stringify(params.filters));
    if (params.sort) searchParams.append('sort', JSON.stringify(params.sort));

    return this.request<InterventionListResponse>(`?${searchParams.toString()}`);
  }

  /**
   * Récupérer une intervention par ID
   */
  async getById(id: string): Promise<Intervention> {
    return this.request<Intervention>(`/${id}`);
  }

  /**
   * Créer une nouvelle intervention
   */
  async create(data: InterventionCreateRequest): Promise<Intervention> {
    return this.request<Intervention>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour une intervention
   */
  async update(id: string, data: InterventionUpdateRequest): Promise<Intervention> {
    return this.request<Intervention>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprimer une intervention
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // OPERATIONS SPÉCIFIQUES
  // ============================================================================

  /**
   * Mettre à jour le statut d'une intervention
   */
  async updateStatus(id: string, statut: InterventionStatus): Promise<Intervention> {
    return this.request<Intervention>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }

  /**
   * Mettre à jour le montant d'une intervention
   */
  async updateMontant(id: string, montant: number): Promise<Intervention> {
    return this.request<Intervention>(`/${id}/montant`, {
      method: 'PATCH',
      body: JSON.stringify({ montant }),
    });
  }

  /**
   * Mettre à jour les coûts d'une intervention
   */
  async updateCouts(
    id: string, 
    couts: {
      coutSST?: number;
      coutMateriaux?: number;
      coutInterventions?: number;
    }
  ): Promise<Intervention> {
    return this.request<Intervention>(`/${id}/couts`, {
      method: 'PATCH',
      body: JSON.stringify(couts),
    });
  }

  /**
   * Assigner un artisan à une intervention
   */
  async assignArtisan(id: string, artisan_id: string): Promise<Intervention> {
    return this.request<Intervention>(`/${id}/assign-artisan`, {
      method: 'PATCH',
      body: JSON.stringify({ artisan_id }),
    });
  }

  /**
   * Changer la priorité d'une intervention
   */
  async updatePriorite(id: string, priorite: 'basse' | 'normale' | 'haute' | 'urgente'): Promise<Intervention> {
    return this.request<Intervention>(`/${id}/priorite`, {
      method: 'PATCH',
      body: JSON.stringify({ priorite }),
    });
  }

  // ============================================================================
  // DOCUMENTS
  // ============================================================================

  /**
   * Récupérer les documents d'une intervention
   */
  async getDocuments(id: string): Promise<InterventionDocument[]> {
    return this.request<InterventionDocument[]>(`/${id}/documents`);
  }

  /**
   * Uploader un document pour une intervention
   */
  async uploadDocument(
    id: string, 
    file: File, 
    type: InterventionDocument['type']
  ): Promise<InterventionDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<InterventionDocument>(`/${id}/documents`, {
      method: 'POST',
      headers: {}, // Pas de Content-Type pour FormData
      body: formData,
    });
  }

  /**
   * Supprimer un document
   */
  async deleteDocument(intervention_id: string, document_id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/${intervention_id}/documents/${document_id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // HISTORIQUE
  // ============================================================================

  /**
   * Récupérer l'historique d'une intervention
   */
  async getHistory(id: string): Promise<InterventionHistory[]> {
    return this.request<InterventionHistory[]>(`/${id}/history`);
  }

  // ============================================================================
  // STATISTIQUES ET RAPPORTS
  // ============================================================================

  /**
   * Récupérer les statistiques des interventions
   */
  async getStats(filters?: InterventionFilters): Promise<InterventionStats> {
    const searchParams = filters ? `?filters=${JSON.stringify(filters)}` : '';
    return this.request<InterventionStats>(`/stats${searchParams}`);
  }

  /**
   * Récupérer les données financières d'une intervention
   */
  async getFinancialData(id: string): Promise<InterventionFinancialData> {
    return this.request<InterventionFinancialData>(`/${id}/financial`);
  }

  /**
   * Exporter les interventions en CSV/Excel
   */
  async export(
    format: 'csv' | 'excel',
    filters?: InterventionFilters
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append('format', format);
    if (filters) searchParams.append('filters', JSON.stringify(filters));

    const response = await fetch(`${this.baseUrl}/export?${searchParams.toString()}`, {
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
    });

    if (!response.ok) {
      throw new Error(`Export Error: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  // ============================================================================
  // OPERATIONS EN LOT
  // ============================================================================

  /**
   * Mettre à jour plusieurs interventions en lot
   */
  async bulkUpdate(
    ids: string[], 
    data: InterventionUpdateRequest
  ): Promise<{ success: boolean; updated: number; errors: string[] }> {
    return this.request<{ success: boolean; updated: number; errors: string[] }>('/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ ids, data }),
    });
  }

  /**
   * Supprimer plusieurs interventions en lot
   */
  async bulkDelete(ids: string[]): Promise<{ success: boolean; deleted: number; errors: string[] }> {
    return this.request<{ success: boolean; deleted: number; errors: string[] }>('/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // ============================================================================
  // VALIDATION ET UTILITAIRES
  // ============================================================================

  /**
   * Valider les données d'une intervention
   */
  async validate(data: InterventionCreateRequest | InterventionUpdateRequest): Promise<{
    valid: boolean;
    errors: Record<string, string[]>;
  }> {
    return this.request<{ valid: boolean; errors: Record<string, string[]> }>('/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Récupérer les statuts disponibles
   */
  async getAvailableStatuses(): Promise<InterventionStatus[]> {
    return this.request<InterventionStatus[]>('/statuses');
  }

  /**
   * Récupérer les priorités disponibles
   */
  async getAvailablePriorities(): Promise<string[]> {
    return this.request<string[]>('/priorities');
  }
}

// ============================================================================
// INSTANCE PAR DÉFAUT
// ============================================================================

// Instance par défaut pour une utilisation simple
export const interventionAPI = new InterventionEndpoints();

// Instance avec configuration personnalisée
export const createInterventionAPI = (baseUrl: string, apiKey?: string) => {
  return new InterventionEndpoints(baseUrl, apiKey);
};

// ============================================================================
// TYPES D'ERREUR
// ============================================================================

export class InterventionAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'InterventionAPIError';
  }
}

// ============================================================================
// CONSTANTES
// ============================================================================

export const INTERVENTION_STATUS_LABELS: Record<InterventionStatus, string> = {
  demande: 'Demandé',
  devis_envoye: 'Devis Envoyé',
  accepte: 'Accepté',
  en_cours: 'En cours',
  annule: 'Annulé',
  termine: 'Terminé',
  visite_technique: 'Visite Technique',
  refuse: 'Refusé',
  stand_by: 'En attente',
  sav: 'SAV',
  bloque: 'Bloqué',
};

export const INTERVENTION_STATUS_COLORS: Record<InterventionStatus, string> = {
  demande: 'bg-blue-100 text-blue-700',
  devis_envoye: 'bg-purple-100 text-purple-700',
  accepte: 'bg-green-100 text-green-700',
  en_cours: 'bg-orange-100 text-orange-700',
  annule: 'bg-red-100 text-red-700',
  termine: 'bg-emerald-100 text-emerald-700',
  visite_technique: 'bg-indigo-100 text-indigo-700',
  refuse: 'bg-red-100 text-red-700',
  stand_by: 'bg-yellow-100 text-yellow-700',
  sav: 'bg-pink-100 text-pink-700',
  bloque: 'bg-gray-100 text-gray-700',
};

export const PRIORITY_LABELS: Record<string, string> = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente',
};

export const PRIORITY_COLORS: Record<string, string> = {
  basse: 'bg-gray-100 text-gray-700',
  normale: 'bg-blue-100 text-blue-700',
  haute: 'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700',
};
