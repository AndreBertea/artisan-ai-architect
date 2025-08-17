// Exemple d'utilisation des endpoints API pour les interventions
// Ce fichier montre comment utiliser les différentes méthodes de l'API

import { interventionAPI, interventionMockAPI } from './interventionEndpoints';
import { InterventionMockAPI } from './interventionMock';
import type { 
  InterventionFilters, 
  InterventionSort, 
  InterventionCreateRequest,
  InterventionUpdateRequest 
} from './interventionEndpoints';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Pour le développement avec mock
const api = interventionMockAPI;

// Pour la production avec vrai backend
// const api = interventionAPI;

// ============================================================================
// EXEMPLES D'UTILISATION
// ============================================================================

export class InterventionUsageExamples {
  
  // ============================================================================
  // RÉCUPÉRATION DES DONNÉES
  // ============================================================================

  /**
   * Exemple: Récupérer la liste des interventions avec pagination
   */
  static async getInterventionsList() {
    try {
      const response = await api.getList({
        page: 1,
        limit: 10,
        filters: {
          statut: ['en_cours', 'demande'],
          priorite: ['haute', 'urgente']
        },
        sort: {
          field: 'created_at',
          direction: 'desc'
        }
      });

      console.log('Interventions récupérées:', response.data);
      console.log('Pagination:', response.pagination);
      console.log('Total:', response.pagination.total);
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des interventions:', error);
      throw error;
    }
  }

  /**
   * Exemple: Récupérer une intervention par ID
   */
  static async getInterventionById(id: string) {
    try {
      const intervention = await api.getById(id);
      console.log('Intervention récupérée:', intervention);
      return intervention;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'intervention:', error);
      throw error;
    }
  }

  /**
   * Exemple: Récupérer les statistiques
   */
  static async getInterventionStats() {
    try {
      const stats = await api.getStats({
        statut: ['en_cours', 'termine']
      });
      
      console.log('Statistiques des interventions:', stats);
      console.log('Total:', stats.total);
      console.log('En cours:', stats.en_cours);
      console.log('Retards:', stats.retards);
      
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // ============================================================================
  // CRÉATION ET MODIFICATION
  // ============================================================================

  /**
   * Exemple: Créer une nouvelle intervention
   */
  static async createNewIntervention() {
    try {
      const newInterventionData: InterventionCreateRequest = {
        client_id: 'CLI-006',
        artisan_id: 'ART-006',
        description: 'Installation système de sécurité',
        adresse: '123 Rue de la Sécurité, 75001 Paris',
        echeance: '2024-02-15',
        montant: 2500,
        priorite: 'haute',
        notes: 'Client prioritaire, installation urgente',
        tags: ['sécurité', 'installation', 'urgent']
      };

      const newIntervention = await api.create(newInterventionData);
      console.log('Nouvelle intervention créée:', newIntervention);
      
      return newIntervention;
    } catch (error) {
      console.error('Erreur lors de la création de l\'intervention:', error);
      throw error;
    }
  }

  /**
   * Exemple: Mettre à jour une intervention
   */
  static async updateIntervention(id: string) {
    try {
      const updateData: InterventionUpdateRequest = {
        description: 'Installation système de sécurité - Mise à jour',
        montant: 2800,
        priorite: 'urgente',
        notes: 'Prix mis à jour suite à devis détaillé',
        tags: ['sécurité', 'installation', 'urgent', 'devis-validé']
      };

      const updatedIntervention = await api.update(id, updateData);
      console.log('Intervention mise à jour:', updatedIntervention);
      
      return updatedIntervention;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'intervention:', error);
      throw error;
    }
  }

  /**
   * Exemple: Changer le statut d'une intervention
   */
  static async changeInterventionStatus(id: string, newStatus: 'en_cours' | 'termine') {
    try {
      const updatedIntervention = await api.updateStatus(id, newStatus);
      console.log(`Statut changé vers "${newStatus}":`, updatedIntervention);
      
      return updatedIntervention;
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      throw error;
    }
  }

  /**
   * Exemple: Mettre à jour les coûts d'une intervention
   */
  static async updateInterventionCosts(id: string) {
    try {
      const updatedIntervention = await api.updateCouts(id, {
        coutSST: 300,
        coutMateriaux: 500,
        coutInterventions: 800
      });
      
      console.log('Coûts mis à jour:', updatedIntervention);
      return updatedIntervention;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des coûts:', error);
      throw error;
    }
  }

  // ============================================================================
  // FILTRES ET RECHERCHE
  // ============================================================================

  /**
   * Exemple: Rechercher des interventions avec filtres complexes
   */
  static async searchInterventionsWithFilters() {
    try {
      const filters: InterventionFilters = {
        statut: ['en_cours', 'demande'],
        artisan_id: ['ART-001', 'ART-002'],
        agence: ['Paris Nord', 'Boulogne'],
        montant_min: 500,
        montant_max: 2000,
        priorite: ['haute', 'urgente'],
        tags: ['électricité', 'urgent']
      };

      const response = await api.getList({
        page: 1,
        limit: 20,
        filters,
        sort: {
          field: 'montant',
          direction: 'desc'
        }
      });

      console.log('Interventions filtrées:', response.data);
      console.log('Nombre de résultats:', response.pagination.total);
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  }

  /**
   * Exemple: Rechercher les interventions en retard
   */
  static async getOverdueInterventions() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const filters: InterventionFilters = {
        statut: ['en_cours'],
        date_fin: today // Interventions dont l'échéance est passée
      };

      const response = await api.getList({
        page: 1,
        limit: 50,
        filters,
        sort: {
          field: 'echeance',
          direction: 'asc'
        }
      });

      console.log('Interventions en retard:', response.data);
      console.log('Nombre d\'interventions en retard:', response.pagination.total);
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des interventions en retard:', error);
      throw error;
    }
  }

  // ============================================================================
  // DOCUMENTS ET HISTORIQUE
  // ============================================================================

  /**
   * Exemple: Récupérer les documents d'une intervention
   */
  static async getInterventionDocuments(id: string) {
    try {
      const documents = await api.getDocuments(id);
      console.log('Documents de l\'intervention:', documents);
      
      return documents;
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      throw error;
    }
  }

  /**
   * Exemple: Récupérer l'historique d'une intervention
   */
  static async getInterventionHistory(id: string) {
    try {
      const history = await api.getHistory(id);
      console.log('Historique de l\'intervention:', history);
      
      return history;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

  // ============================================================================
  // DONNÉES FINANCIÈRES
  // ============================================================================

  /**
   * Exemple: Récupérer les données financières d'une intervention
   */
  static async getInterventionFinancialData(id: string) {
    try {
      const financialData = await api.getFinancialData(id);
      console.log('Données financières:', financialData);
      console.log('Marge:', financialData.marge);
      console.log('Marge en pourcentage:', financialData.margePourcentage);
      
      return financialData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données financières:', error);
      throw error;
    }
  }

  // ============================================================================
  // OPERATIONS EN LOT
  // ============================================================================

  /**
   * Exemple: Mettre à jour plusieurs interventions en lot
   */
  static async bulkUpdateInterventions() {
    try {
      const interventionIds = ['INT-2024-001', 'INT-2024-002', 'INT-2024-003'];
      const updateData: InterventionUpdateRequest = {
        priorite: 'normale',
        notes: 'Mise à jour en lot - Priorité normalisée'
      };

      const result = await api.bulkUpdate(interventionIds, updateData);
      console.log('Résultat de la mise à jour en lot:', result);
      console.log('Interventions mises à jour:', result.updated);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour en lot:', error);
      throw error;
    }
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  /**
   * Exemple: Valider les données d'une intervention avant création
   */
  static async validateInterventionData() {
    try {
      const interventionData: InterventionCreateRequest = {
        client_id: 'CLI-007',
        artisan_id: 'ART-007',
        description: 'Test validation',
        adresse: 'Test Address',
        echeance: '2024-02-20',
        montant: -100 // Montant négatif pour tester la validation
      };

      const validation = await api.validate(interventionData);
      console.log('Résultat de la validation:', validation);
      
      if (!validation.valid) {
        console.log('Erreurs de validation:', validation.errors);
      }
      
      return validation;
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTION DES ERREURS
  // ============================================================================

  /**
   * Exemple: Gestion d'erreur avec try-catch
   */
  static async handleErrorsExample() {
    try {
      // Tentative de récupération d'une intervention inexistante
      const intervention = await api.getById('INT-INEXISTANT');
      return intervention;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erreur API:', error.message);
        
        // Gestion spécifique selon le type d'erreur
        if (error.message.includes('non trouvée')) {
          console.log('Intervention introuvable - Création d\'une nouvelle intervention...');
          // Logique de création d'une nouvelle intervention
        } else if (error.message.includes('API Error: 401')) {
          console.log('Erreur d\'authentification - Redirection vers la page de connexion...');
          // Logique de redirection
        } else if (error.message.includes('API Error: 500')) {
          console.log('Erreur serveur - Réessayer plus tard...');
          // Logique de retry
        }
      }
      
      // Remonter l'erreur ou la gérer localement
      throw error;
    }
  }
}

// ============================================================================
// EXEMPLES D'UTILISATION AVEC HOOKS REACT
// ============================================================================

/**
 * Exemple d'utilisation dans un composant React avec useState et useEffect
 */
export const useInterventionExamples = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInterventions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await InterventionUsageExamples.getInterventionsList();
      setInterventions(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createIntervention = async (data: InterventionCreateRequest) => {
    try {
      const newIntervention = await InterventionUsageExamples.createNewIntervention();
      setInterventions(prev => [newIntervention, ...prev]);
      return newIntervention;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    interventions,
    loading,
    error,
    loadInterventions,
    createIntervention
  };
};

// ============================================================================
// EXPORT DES EXEMPLES
// ============================================================================

export default InterventionUsageExamples;
