// Types et enums pour les statuts d'artisan
export enum ARTISAN_STATUS {
  CANDIDAT = 'Candidat',
  ONE_SHOT = 'One shot',
  POTENTIEL = 'Potentiel',
  NOVICE = 'Novice',
  FORMATION = 'Formation',
  CONFIRME = 'Confirmé',
  EXPERT = 'Expert',
  ARCHIVER = 'Archiver',
}

// Nouveau enum pour le statut de dossier de l'artisan
export enum ARTISAN_DOSSIER_STATUS {
  INCOMPLET = 'Incomplet',
  A_FINALISER = 'À finaliser',
  COMPLET = 'Complet',
}

export const ARTISAN_STATUS_LABELS: Record<ARTISAN_STATUS, string> = {
  [ARTISAN_STATUS.CANDIDAT]: 'Candidat',
  [ARTISAN_STATUS.ONE_SHOT]: 'One shot',
  [ARTISAN_STATUS.POTENTIEL]: 'Potentiel',
  [ARTISAN_STATUS.NOVICE]: 'Novice',
  [ARTISAN_STATUS.FORMATION]: 'Formation',
  [ARTISAN_STATUS.CONFIRME]: 'Confirmé',
  [ARTISAN_STATUS.EXPERT]: 'Expert',
  [ARTISAN_STATUS.ARCHIVER]: 'Archiver',
};

// Labels pour le statut de dossier
export const ARTISAN_DOSSIER_LABELS: Record<ARTISAN_DOSSIER_STATUS, string> = {
  [ARTISAN_DOSSIER_STATUS.INCOMPLET]: 'Incomplet',
  [ARTISAN_DOSSIER_STATUS.A_FINALISER]: 'À finaliser',
  [ARTISAN_DOSSIER_STATUS.COMPLET]: 'Complet',
};

// Icônes pour le statut de dossier (dots colorés)
export const ARTISAN_DOSSIER_ICONS: Record<ARTISAN_DOSSIER_STATUS, string> = {
  [ARTISAN_DOSSIER_STATUS.INCOMPLET]: '🔴',
  [ARTISAN_DOSSIER_STATUS.A_FINALISER]: '🟡',
  [ARTISAN_DOSSIER_STATUS.COMPLET]: '🟢',
};

// Couleurs pour le statut de dossier
export const ARTISAN_DOSSIER_COLORS: Record<ARTISAN_DOSSIER_STATUS, { bg: string; text: string; border?: string }> = {
  [ARTISAN_DOSSIER_STATUS.INCOMPLET]: { bg: '#fef2f2', text: '#dc2626' },
  [ARTISAN_DOSSIER_STATUS.A_FINALISER]: { bg: '#fffbeb', text: '#d97706' },
  [ARTISAN_DOSSIER_STATUS.COMPLET]: { bg: '#f0fdf4', text: '#16a34a' },
};

export const ARTISAN_STATUS_COLORS: Record<ARTISAN_STATUS, { bg: string; text: string; border?: string }> = {
  [ARTISAN_STATUS.CANDIDAT]: { bg: '#e5e7eb', text: '#111827' },
  [ARTISAN_STATUS.ONE_SHOT]: { bg: '#cbd5e1', text: '#0f172a' },
  [ARTISAN_STATUS.POTENTIEL]: { bg: '#e0f2fe', text: '#0c4a6e' },
  [ARTISAN_STATUS.NOVICE]: { bg: '#e0e7ff', text: '#3730a3' },
  [ARTISAN_STATUS.FORMATION]: { bg: '#fef3c7', text: '#92400e' },
  [ARTISAN_STATUS.CONFIRME]: { bg: '#dcfce7', text: '#14532d' },
  [ARTISAN_STATUS.EXPERT]: { bg: '#d1fae5', text: '#065f46' },
  [ARTISAN_STATUS.ARCHIVER]: { bg: '#f3f4f6', text: '#374151' },
};

// Interface pour un artisan avec statut
export interface Artisan {
  id: string;
  name: string;
  metier: string;
  artisanStatus: ARTISAN_STATUS;
  artisanDossierStatus: ARTISAN_DOSSIER_STATUS; // Nouveau champ
  // Autres propriétés existantes...
}

// Interface étendue pour Intervention avec artisan complet
export interface InterventionWithArtisan {
  id: string;
  client: string;
  artisan: Artisan; // Artisan complet avec statut
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
