// API fonctionnelle pour les interventions
// Gestion des modifications de prix et calculs de marge

export interface Intervention {
  id: string;
  client: string;
  artisan: string;
  artisan_metier?: string;
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

// Fonctions utilitaires
export const calculateMarge = (intervention: Intervention): number => {
  const coutInterventions = intervention.coutInterventions || 0;
  const coutSST = intervention.coutSST || 0;
  const coutMateriaux = intervention.coutMateriaux || 0;
  return coutInterventions - coutSST - coutMateriaux;
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
