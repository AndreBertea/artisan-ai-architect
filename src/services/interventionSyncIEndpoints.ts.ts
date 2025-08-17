// interventionSyncEndpoints.ts - Version synchronisée avec le backend Python
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';

// ============================================================================
// TYPES ET INTERFACES SYNCHRONISÉS
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
  utilisateur_assigne?: string;
  reference?: string;
  statut: InterventionStatus;
  cree: string;
  echeance: string;
  description: string;
  montant?: number;
  adresse?: string;
  notes?: string;
  cout_sst?: number;
  cout_materiaux?: number;
  cout_interventions?: number;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
  tags?: string[];
  documents?: InterventionDocument[];
  historique?: InterventionHistory[];
  created_at: string;
  updated_at: string;
}

// Statuts synchronisés avec le backend Python
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

// ============================================================================
// CLASSE D'ENDPOINTS SYNCHRONISÉE
// ============================================================================

export class InterventionSyncEndpoints {
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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new InterventionAPIError(
          `API Error: ${response.status} ${response.statusText} - ${errorText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof InterventionAPIError) {
        throw error;
      }
      throw new InterventionAPIError(
        `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  }

  // ============================================================================
  // MÉTHODES SYNCHRONISÉES AVEC LE BACKEND
  // ============================================================================

  /**
   * Récupérer la liste des interventions avec filtres, tri et pagination
   * Synchronisé avec l'endpoint GET /api/interventions du backend Python
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
   * Synchronisé avec l'endpoint GET /api/interventions/{id} du backend Python
   */
  async getById(id: string): Promise<Intervention> {
    return this.request<Intervention>(`/${id}`);
  }

  /**
   * Créer une nouvelle intervention
   * Synchronisé avec l'endpoint POST /api/interventions du backend Python
   */
  async create(data: InterventionCreateRequest): Promise<Intervention> {
    return this.request<Intervention>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour une intervention
   * Synchronisé avec l'endpoint PUT /api/interventions/{id} du backend Python
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

  /**
   * Mettre à jour le statut d'une intervention
   * Utilise l'endpoint de mise à jour générale du backend
   */
  async updateStatus(id: string, statut: InterventionStatus): Promise<Intervention> {
    return this.update(id, { statut });
  }

  /**
   * Mettre à jour les coûts d'une intervention
   * Utilise l'endpoint de mise à jour générale du backend
   */
  async updateCouts(
    id: string, 
    couts: {
      cout_sst?: number;
      cout_materiaux?: number;
      cout_interventions?: number;
    }
  ): Promise<Intervention> {
    return this.update(id, couts);
  }

  /**
   * Récupérer les statistiques des interventions
   * Synchronisé avec l'endpoint GET /api/interventions/stats du backend Python
   */
  async getStats(filters?: InterventionFilters): Promise<InterventionStats> {
    const searchParams = filters ? `?filters=${JSON.stringify(filters)}` : '';
    return this.request<InterventionStats>(`/stats${searchParams}`);
  }

  /**
   * Validation côté client avant envoi
   */
  validateRequest(data: InterventionCreateRequest | InterventionUpdateRequest): {
    valid: boolean;
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};

    // Validation pour création
    if ('client_id' in data) {
      const createData = data as InterventionCreateRequest;
      
      if (!createData.client_id?.trim()) {
        errors.client_id = ['Le client est requis'];
      }
      
      if (!createData.artisan_id?.trim()) {
        errors.artisan_id = ['L\'artisan est requis'];
      }
      
      if (!createData.description?.trim()) {
        errors.description = ['La description est requise'];
      }
      
      if (!createData.adresse?.trim()) {
        errors.adresse = ['L\'adresse est requise'];
      }
      
      if (!createData.echeance?.trim()) {
        errors.echeance = ['L\'échéance est requise'];
      } else {
        // Validation format date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(createData.echeance)) {
          errors.echeance = ['Format de date invalide (YYYY-MM-DD)'];
        } else {
          const echeanceDate = new Date(createData.echeance);
          if (echeanceDate < new Date()) {
            errors.echeance = ['L\'échéance ne peut pas être dans le passé'];
          }
        }
      }
    }

    // Validation commune
    if (data.montant !== undefined && data.montant < 0) {
      errors.montant = ['Le montant ne peut pas être négatif'];
    }

    if (data.cout_sst !== undefined && data.cout_sst < 0) {
      errors.cout_sst = ['Le coût SST ne peut pas être négatif'];
    }

    if (data.cout_materiaux !== undefined && data.cout_materiaux < 0) {
      errors.cout_materiaux = ['Le coût matériaux ne peut pas être négatif'];
    }

    if (data.cout_interventions !== undefined && data.cout_interventions < 0) {
      errors.cout_interventions = ['Le coût interventions ne peut pas être négatif'];
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Récupérer les statuts disponibles
   * Retourne la liste synchronisée avec le backend
   */
  async getAvailableStatuses(): Promise<InterventionStatus[]> {
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

  /**
   * Récupérer les priorités disponibles
   */
  async getAvailablePriorities(): Promise<string[]> {
    return ['basse', 'normale', 'haute', 'urgente'];
  }
}

// ============================================================================
// INTERFACES COMPLÉMENTAIRES
// ============================================================================

export interface InterventionFilters {
  statut?: InterventionStatus[];
  artisan_id?: string[];
  client_id?: string[];
  agence?: string[];
  utilisateur_assigne?: string[];
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
  cout_sst?: number;
  cout_materiaux?: number;
  cout_interventions?: number;
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

// ============================================================================
// SERVICE DE SYNCHRONISATION FRONTEND
// ============================================================================

export class InterventionSyncService {
  private api: InterventionSyncEndpoints;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl?: string, apiKey?: string) {
    this.api = new InterventionSyncEndpoints(baseUrl, apiKey);
  }

  private getCacheKey(method: string, params?: any): string {
    return `${method}-${JSON.stringify(params || {})}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Récupérer les interventions avec cache intelligent
   */
  async getInterventions(params: {
    page?: number;
    limit?: number;
    filters?: InterventionFilters;
    sort?: InterventionSort;
    useCache?: boolean;
  }): Promise<InterventionListResponse> {
    const cacheKey = this.getCacheKey('getList', params);
    
    if (params.useCache !== false) {
      const cached = this.getFromCache<InterventionListResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const result = await this.api.getList(params);
    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Créer une intervention avec validation et mise à jour du cache
   */
  async createIntervention(data: InterventionCreateRequest): Promise<{
    success: boolean;
    intervention?: Intervention;
    errors?: Record<string, string[]>;
  }> {
    // Validation côté client
    const validation = this.api.validateRequest(data);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    try {
      const intervention = await this.api.create(data);
      
      // Invalider le cache des listes
      this.invalidateListCache();
      
      return { success: true, intervention };
    } catch (error) {
      if (error instanceof InterventionAPIError) {
        return { 
          success: false, 
          errors: { api: [error.message] } 
        };
      }
      return { 
        success: false, 
        errors: { general: ['Erreur inattendue'] } 
      };
    }
  }

  /**
   * Mettre à jour une intervention avec gestion d'erreurs
   */
  async updateIntervention(
    id: string, 
    data: InterventionUpdateRequest
  ): Promise<{
    success: boolean;
    intervention?: Intervention;
    errors?: Record<string, string[]>;
  }> {
    // Validation côté client
    const validation = this.api.validateRequest(data);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    try {
      const intervention = await this.api.update(id, data);
      
      // Mettre à jour le cache spécifique
      this.setCache(`getById-${id}`, intervention);
      // Invalider le cache des listes
      this.invalidateListCache();
      
      return { success: true, intervention };
    } catch (error) {
      if (error instanceof InterventionAPIError) {
        return { 
          success: false, 
          errors: { api: [error.message] } 
        };
      }
      return { 
        success: false, 
        errors: { general: ['Erreur inattendue'] } 
      };
    }
  }

  /**
   * Récupérer les statistiques avec cache
   */
  async getStats(filters?: InterventionFilters, useCache: boolean = true): Promise<InterventionStats> {
    const cacheKey = this.getCacheKey('getStats', filters);
    
    if (useCache) {
      const cached = this.getFromCache<InterventionStats>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const stats = await this.api.getStats(filters);
    this.setCache(cacheKey, stats);
    return stats;
  }

  /**
   * Invalider le cache des listes
   */
  private invalidateListCache(): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith('getList-')) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vider tout le cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Synchroniser les données avec le serveur
   */
  async syncWithServer(): Promise<void> {
    this.clearCache();
    // Force le rechargement des données essentielles
    await this.getStats(undefined, false);
  }
}

// ============================================================================
// UTILITAIRES DE TRANSFORMATION
// ============================================================================

export class InterventionTransformer {
  /**
   * Convertir une intervention pour l'affichage
   */
  static toDisplayFormat(intervention: Intervention): {
    id: string;
    titre: string;
    client: string;
    artisan: string;
    statut: string;
    statut_color: string;
    priorite: string;
    priorite_color: string;
    echeance: string;
    echeance_formatted: string;
    montant_formatted: string;
    progression: number;
  } {
    return {
      id: intervention.id,
      titre: `${intervention.reference || intervention.id} - ${intervention.description}`,
      client: intervention.client,
      artisan: intervention.artisan,
      statut: INTERVENTION_STATUS_LABELS[intervention.statut],
      statut_color: INTERVENTION_STATUS_COLORS[intervention.statut],
      priorite: PRIORITY_LABELS[intervention.priorite || 'normale'],
      priorite_color: PRIORITY_COLORS[intervention.priorite || 'normale'],
      echeance: intervention.echeance,
      echeance_formatted: new Date(intervention.echeance).toLocaleDateString('fr-FR'),
      montant_formatted: intervention.montant 
        ? new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR' 
          }).format(intervention.montant)
        : 'Non défini',
      progression: this.calculateProgression(intervention.statut)
    };
  }

  /**
   * Calculer la progression basée sur le statut
   */
  private static calculateProgression(statut: InterventionStatus): number {
    const progressionMap: Record<InterventionStatus, number> = {
      demande: 10,
      devis_envoye: 25,
      accepte: 40,
      visite_technique: 50,
      en_cours: 75,
      termine: 100,
      sav: 90,
      annule: 0,
      refuse: 0,
      stand_by: 35,
      bloque: 20
    };
    
    return progressionMap[statut] || 0;
  }

  /**
   * Grouper les interventions par statut
   */
  static groupByStatus(interventions: Intervention[]): Record<InterventionStatus, Intervention[]> {
    const grouped: Partial<Record<InterventionStatus, Intervention[]>> = {};
    
    interventions.forEach(intervention => {
      if (!grouped[intervention.statut]) {
        grouped[intervention.statut] = [];
      }
      grouped[intervention.statut]!.push(intervention);
    });
    
    return grouped as Record<InterventionStatus, Intervention[]>;
  }

  /**
   * Filtrer les interventions en retard
   */
  static getOverdueInterventions(interventions: Intervention[]): Intervention[] {
    const now = new Date();
    return interventions.filter(intervention => 
      intervention.statut === 'en_cours' &&
      new Date(intervention.echeance) < now
    );
  }
}

// ============================================================================
// GESTION D'ERREURS
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

  static isNetworkError(error: InterventionAPIError): boolean {
    return error.status === 0;
  }

  static isValidationError(error: InterventionAPIError): boolean {
    return error.status === 400;
  }

  static isNotFoundError(error: InterventionAPIError): boolean {
    return error.status === 404;
  }

  static isServerError(error: InterventionAPIError): boolean {
    return error.status >= 500;
  }
}

// ============================================================================
// CONSTANTES SYNCHRONISÉES
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

// ============================================================================
// INSTANCES PAR DÉFAUT
// ============================================================================

// Instance de service synchronisé par défaut
export const interventionSyncService = new InterventionSyncService();

// Instance API direct pour usage avancé
export const interventionSyncAPI = new InterventionSyncEndpoints();

// Factory pour créer des instances avec configuration personnalisée
export const createInterventionSyncService = (baseUrl: string, apiKey?: string) => {
  return new InterventionSyncService(baseUrl, apiKey);
};