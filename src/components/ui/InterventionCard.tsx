import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  FilePlus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Euro,
  Calendar,
  MoreVertical,
  ExternalLink,
  Edit,
  Plus,
  Minus,
  FileText,
  ChevronDown,
  ChevronUp,
  Wrench
} from 'lucide-react';

import { StatusBadge, MetierBadge, AgenceBadge } from '@/components/ui/BadgeComponents';
import { ArtisanStatusBadge } from '@/components/ui/ArtisanStatusBadge';
import { ArtisanDossierStatusIcon } from '@/components/ui/ArtisanDossierStatusIcon';
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';
import AnimatedCard from './AnimatedCard';
import { InterventionAPI, formatCurrency } from '@/services/interventionApi';
import { EditableCell } from './EditableCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  artisan_metier?: string;
  artisan_status?: ARTISAN_STATUS;
  artisan_dossier_status?: ARTISAN_DOSSIER_STATUS;
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

interface InterventionCardProps {
  intervention: Intervention;
  onEdit?: (intervention: Intervention) => void;
  onSendEmail?: (intervention: Intervention) => void;
  onCall?: (intervention: Intervention) => void;
  onAddDocument?: (intervention: Intervention) => void;
  onStatusChange?: (intervention: Intervention, newStatus: string) => void;
  onAmountChange?: (intervention: Intervention, amount: number) => void;
  onDateChange?: (intervention: Intervention, field: string, date: string) => void;
  onAddressChange?: (intervention: Intervention, address: string) => void;
  onArtisanChange?: (intervention: Intervention, artisan: string) => void;
  onArtisanStatusChange?: (intervention: Intervention, newStatus: ARTISAN_STATUS) => void;
  onArtisanDossierStatusChange?: (intervention: Intervention, newStatus: ARTISAN_DOSSIER_STATUS) => void;
  onClientChange?: (intervention: Intervention, client: string) => void;
  onDescriptionChange?: (intervention: Intervention, description: string) => void;
  onNotesChange?: (intervention: Intervention, notes: string) => void;
  onCoutSSTChange?: (intervention: Intervention, amount: number) => void;
  onCoutMateriauxChange?: (intervention: Intervention, amount: number) => void;
  onCoutInterventionsChange?: (intervention: Intervention, amount: number) => void;
  onUserChange?: (intervention: Intervention, username: string) => void;
  className?: string;
  hideBorder?: boolean;
  keyboardHovered?: boolean;
  selectedActionIndex?: number;
  selectedCardIndex?: number;
}

export const InterventionCard: React.FC<InterventionCardProps> = ({
  intervention,
  onEdit,
  onSendEmail,
  onCall,
  onAddDocument,
  onStatusChange,
  onAmountChange,
  onDateChange,
  onAddressChange,
  onArtisanChange,
  onArtisanStatusChange,
  onArtisanDossierStatusChange,
  onClientChange,
  onDescriptionChange,
  onNotesChange,
  onCoutSSTChange,
  onCoutMateriauxChange,
  onCoutInterventionsChange,
  onUserChange,
  className = '',
  hideBorder = false,
  keyboardHovered = false,
  selectedActionIndex = -1,
  selectedCardIndex = -1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMarginEdit, setShowMarginEdit] = useState(false);
  const [showStatusEdit, setShowStatusEdit] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const [showDocumentAnimation, setShowDocumentAnimation] = useState(false);
  const [animationPosition, setAnimationPosition] = useState({ top: 0, left: 0 });
  const [statusColors, setStatusColors] = useState<Record<string, string>>({
    demande: '#3B82F6',
    devis_envoye: '#8B5CF6',
    accepte: '#10B981',
    en_cours: '#F59E0B',
    annule: '#EF4444',
    termine: '#059669',
    visite_technique: '#6366F1',
    refuse: '#DC2626',
    stand_by: '#EAB308',
    sav: '#6B7280'
  });
  const [pinnedStatuses, setPinnedStatuses] = useState<string[]>(['demande', 'devis_envoye', 'accepte', 'en_cours']);

  const navigate = useNavigate();

  // Combiner le hover de la souris avec le hover du clavier
  const isAnyHovered = isHovered || keyboardHovered;
  
  // Combiner la sélection d'action souris et clavier
  const isDocumentHovered = isAnyHovered && (selectedActionIndex === 2 || isHovered);

  // Effet pour mettre à jour la position de l'animation lors de la sélection clavier
  useEffect(() => {
    if (selectedActionIndex === 2 && keyboardHovered) {
      // Trouver l'élément document button et calculer sa position
      const documentButton = document.querySelector(`[data-intervention-id="${intervention.id}"] .document-button`) as HTMLElement;
      if (documentButton) {
        const rect = documentButton.getBoundingClientRect();
        setAnimationPosition({
          top: rect.top - 200,
          left: rect.left - 90
        });
        setShowDocumentAnimation(true);
      }
    } else if (selectedActionIndex !== 2) {
      setShowDocumentAnimation(false);
    }
  }, [selectedActionIndex, keyboardHovered, intervention.id]);

  // Effet pour gérer les effets de hover des icônes lors de la sélection clavier
  useEffect(() => {
    if (keyboardHovered && selectedActionIndex >= 0) {
      // Ajouter des effets visuels spécifiques selon l'icône sélectionnée
      const selectedButton = document.querySelector(`[data-intervention-id="${intervention.id}"] .${selectedActionIndex === 0 ? 'email-button' : selectedActionIndex === 1 ? 'phone-button' : 'document-button'}`) as HTMLElement;
      if (selectedButton) {
        // L'effet visuel est déjà géré par les classes CSS
        console.log(`Icône ${selectedActionIndex} sélectionnée pour l'intervention ${intervention.id}`);
      }
    }
  }, [selectedActionIndex, keyboardHovered, intervention.id]);

  // Effet pour gérer l'état hover de l'AnimatedCard lors de la sélection clavier
  useEffect(() => {
    if (keyboardHovered && selectedActionIndex === 2) {
      // Garder l'AnimatedCard ouvert quand on est sur l'icône document
      setShowDocumentAnimation(true);
    } else if (selectedActionIndex !== 2) {
      // Fermer l'AnimatedCard quand on n'est plus sur l'icône document
      setShowDocumentAnimation(false);
    }
  }, [keyboardHovered, selectedActionIndex]);

  // Liste des utilisateurs (mock - à remplacer par les données des paramètres)
  const users = [
    { id: 99, nom: 'Morin', prenom: 'Grégoire', username: 'GM', color: '#222222' },
    { id: 1, nom: 'admin', prenom: 'admin', username: 'admin', color: '#000000' },
    { id: 20, nom: 'admin2', prenom: 'admin2', username: 'admin2', color: '#1976d2' },
    { id: 11, nom: 'Birckel', prenom: 'Tom', username: 'Tom', color: '#eab308' },
    { id: 9, nom: 'Boujimal', prenom: 'Badr', username: 'Badr', color: '#ef4444' },
    { id: 22, nom: 'BERTEA', prenom: 'André', username: 'dd', color: '#6366f1' },
    { id: 13, nom: 'Aguenana', prenom: 'Keryan', username: 'Paul', color: '#f59e42' },
    { id: 14, nom: 'Saune', prenom: 'Louis', username: 'Louis', color: '#f472b6' },
    { id: 16, nom: 's', prenom: 'Samuel', username: 'Samuel', color: '#f87171' },
    { id: 17, nom: 'L', prenom: 'Lucien', username: 'Lucien', color: '#0ea5e9' },
    { id: 3, nom: 'GAUTRET', prenom: 'ANDREA', username: 'Andrea', color: '#a21caf' },
    { id: 18, nom: 'K', prenom: 'Killian', username: 'Killian', color: '#f43f5e' },
    { id: 10, nom: 'Montanari', prenom: 'Dimitri', username: 'Dimitri', color: '#22d3ee' },
  ];

  // Styles CSS pour l'icône utilisateur dans la colonne 1
  const userIconStyles = `
    /* Styles pour l'icône utilisateur dans la colonne 1 */
    .user-menu-container .user-button {
      transition: all 0.2s ease;
    }

    .user-menu-container:hover .user-button {
      transform: translate(0, -1px);
    }
  `;

  // Configuration des statuts avec couleurs personnalisées
  const allStatuses = [
    { key: 'demande', label: 'Demandé', icon: Clock, defaultColor: '#3B82F6' },
    { key: 'devis_envoye', label: 'Devis Envoyé', icon: FileText, defaultColor: '#8B5CF6' },
    { key: 'accepte', label: 'Accepté', icon: CheckCircle, defaultColor: '#10B981' },
    { key: 'en_cours', label: 'En cours', icon: AlertCircle, defaultColor: '#F59E0B' },
    { key: 'annule', label: 'Annulé', icon: XCircle, defaultColor: '#EF4444' },
    { key: 'termine', label: 'Terminé', icon: CheckCircle, defaultColor: '#059669' },
    { key: 'visite_technique', label: 'Visite Technique', icon: MapPin, defaultColor: '#6366F1' },
    { key: 'refuse', label: 'Refusé', icon: XCircle, defaultColor: '#DC2626' },
    { key: 'stand_by', label: 'STAND BY', icon: Clock, defaultColor: '#EAB308' },
    { key: 'sav', label: 'SAV', icon: Wrench, defaultColor: '#6B7280' }
  ];

  // Statuts rapides (les plus utilisés - épinglés)
  const quickStatuses = allStatuses.filter(status => 
    pinnedStatuses.includes(status.key)
  );

  // Fonction pour obtenir la couleur d'un statut
  const getStatusColor = (statusKey: string) => {
    return statusColors[statusKey] || allStatuses.find(s => s.key === statusKey)?.defaultColor || '#6B7280';
  };

  // Fonction pour générer les styles CSS d'un statut
  const getStatusStyles = (statusKey: string, isActive: boolean = false) => {
    const color = getStatusColor(statusKey);
    const rgb = hexToRgb(color);
    if (!rgb) return '';
    
    if (isActive) {
      return `bg-[${color}] text-white border-[${color}] shadow-md`;
    }
    
    return `bg-[${color}]/10 text-[${color}] border-[${color}]/20 hover:bg-[${color}]/20`;
  };

  // Fonction utilitaire pour convertir hex en RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Fonction pour changer la couleur d'un statut
  const handleStatusColorChange = (statusKey: string, newColor: string) => {
    setStatusColors(prev => ({
      ...prev,
      [statusKey]: newColor
    }));
    // Le color picker reste ouvert pour permettre les ajustements
  };

  // Fonction pour ouvrir le color picker
  const handleOpenColorPicker = (statusKey: string) => {
    setActiveColorPicker(statusKey);
  };



  // Fonction pour fermer le color picker
  const handleCloseColorPicker = () => {
    setActiveColorPicker(null);
  };

  // Gestionnaire de clic global pour fermer le color picker
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeColorPicker && !(event.target as Element).closest('.color-picker-container')) {
        handleCloseColorPicker();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeColorPicker]);

  // Fonction pour épingler/désépingler un statut
  const handleTogglePin = (statusKey: string) => {
    setPinnedStatuses(prev => {
      if (prev.includes(statusKey)) {
        return prev.filter(key => key !== statusKey);
      } else {
        return [...prev, statusKey];
      }
    });
  };

  // Fonction pour changer l'utilisateur assigné
  const handleUserChange = async (newUsername: string) => {
    try {
      // Ici vous pouvez ajouter l'appel API pour mettre à jour l'utilisateur assigné
      // Par exemple: await InterventionAPI.updateUser(intervention.id, newUsername);
      
      // Pour l'instant, on met à jour localement
      const updatedIntervention = {
        ...intervention,
        utilisateur_assigné: newUsername
      };
      
      // Mettre à jour l'intervention dans le parent
      onUserChange?.(intervention, newUsername);
      
      console.log('Utilisateur changé vers:', newUsername);
    } catch (error) {
      console.error('Erreur lors du changement d\'utilisateur:', error);
    }
  };

  const handleNavigateToDetail = () => {
    navigate(`/interventions/${intervention.id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    // Clic gauche : expand/collapse de la vue détaillée
    if (e.button === 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCardRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher le menu contextuel par défaut
    // Clic droit : navigation vers la page complète
    handleNavigateToDetail();
  };

  const getMarge = () => {
    // Marge = Tarif main d'œuvre - Coûts réels
    const coutSST = intervention.coutSST || 0;
    const coutMateriaux = intervention.coutMateriaux || 0;
    const coutInterventions = intervention.coutInterventions || 0;
    
    // Marge = Tarif interventions - (Coûts SST + Coûts Matériaux)
    const margin = coutInterventions - (coutSST + coutMateriaux);
    
    return margin;
  };

  const getPrixIntervention = () => {
    // Prix intervention = Tarif main d'œuvre
    return intervention.coutInterventions || 0;
  };

  const getMargePourcentage = () => {
    // Calculer le pourcentage de marge
    const coutSST = intervention.coutSST || 0;
    const coutMateriaux = intervention.coutMateriaux || 0;
    const coutInterventions = intervention.coutInterventions || 0;
    
    // Marge = Tarif interventions - (Coûts SST + Coûts Matériaux)
    const margin = coutInterventions - (coutSST + coutMateriaux);
    
    // Pourcentage de marge par rapport au tarif interventions
    if (coutInterventions === 0) return 0;
    
    const pourcentage = (margin / coutInterventions) * 100;
    return pourcentage;
  };

  const getMargeColor = (marge: number) => {
    if (marge < 0) {
      return 'text-red-600'; // Rouge pour les marges négatives
    }
    
    // Calculer le pourcentage de marge par rapport au montant total
    const montantTotal = (intervention.montant || 0);
    if (montantTotal > 0) {
      const pourcentageMarge = (marge / montantTotal) * 100;
      if (pourcentageMarge < 15) {
        return 'text-yellow-600'; // Jaune pour les marges < 15%
      }
    }
    
    return 'text-green-600'; // Vert pour les marges normales
  };

  const getStatusConfig = (statut: string) => {
    const configs = {
      demande: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        iconColor: '#3B82F6'
      },
      devis_envoye: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        iconColor: '#8B5CF6'
      },
      accepte: { 
        variant: 'secondary' as const, 
        icon: CheckCircle, 
        color: 'bg-green-50 text-green-700 border-green-200',
        iconColor: '#10B981'
      },
      en_cours: { 
        variant: 'secondary' as const, 
        icon: AlertCircle, 
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        iconColor: '#F59E0B'
      },
      annule: { 
        variant: 'destructive' as const, 
        icon: XCircle, 
        color: 'bg-red-50 text-red-700 border-red-200',
        iconColor: '#EF4444'
      },
      termine: { 
        variant: 'secondary' as const, 
        icon: CheckCircle, 
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconColor: '#059669'
      },
      visite_technique: { 
        variant: 'secondary' as const, 
        icon: MapPin, 
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        iconColor: '#6366F1'
      },
      refuse: { 
        variant: 'destructive' as const, 
        icon: XCircle, 
        color: 'bg-red-50 text-red-700 border-red-200',
        iconColor: '#DC2626'
      },
      stand_by: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        iconColor: '#EAB308'
      },
      sav: { 
        variant: 'secondary' as const, 
        icon: Wrench, 
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        iconColor: '#6B7280'
      },
      bloque: { 
        variant: 'destructive' as const, 
        icon: XCircle, 
        color: 'bg-red-50 text-red-700 border-red-200',
        iconColor: '#EF4444'
      }
    };
    return configs[statut as keyof typeof configs] || configs.demande;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const statusConfig = getStatusConfig(intervention.statut);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={className}>
      <style>{userIconStyles}</style>
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out
        hover:shadow-lg hover:border-primary/20
        cursor-pointer
        ${isExpanded ? 'shadow-lg border-primary/20' : ''}
        ${hideBorder ? 'border-0' : ''}
      `}
      data-card-clickable="true"
      data-intervention-id={intervention.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onContextMenu={handleCardRightClick}
    >
      {/* Indicateur de statut coloré */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2"
        style={{ 
          backgroundColor: statusConfig.iconColor,
          width: isAnyHovered ? '8px' : '4px'
        }}
      />

      <CardHeader className="py-2">
                {/* Layout 3 colonnes responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Colonne 1: Client */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 
                className="text-xl font-semibold text-foreground truncate flex-1"
                title={intervention.client}
              >
                {intervention.client}
              </h3>
              
              {intervention.agence && (
                <AgenceBadge agence={intervention.agence} size="sm" />
              )}

              {/* Icône Utilisateur */}
              <div className="user-menu-container">
                {(() => {
                  const currentUser = users.find(u => u.username === intervention.utilisateur_assigné);
                  return (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: currentUser ? currentUser.color : "#6B7280" }}
                          title={`Opérateur: ${intervention.utilisateur_assigné || 'Non assigné'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {currentUser ? currentUser.username.substring(0, 2).toUpperCase() : "NA"}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        <div className="text-xs font-medium text-gray-600 mb-3 px-2">Changer l'opérateur</div>
                        <div className="max-h-60 overflow-y-auto">
                          {users.map((user) => {
                            const isActive = intervention.utilisateur_assigné === user.username;
                            return (
                              <DropdownMenuItem
                                key={user.id}
                                className={`
                                  flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200
                                  ${isActive ? 'bg-orange-100 border border-orange-300' : 'hover:bg-gray-50'}
                                `}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserChange(user.username);
                                }}
                              >
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                  style={{ backgroundColor: user.color }}
                                >
                                  {user.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{user.prenom} {user.nom}</div>
                                  <div className="text-xs text-gray-500">{user.username}</div>
                                </div>
                                {isActive && (
                                  <div className="text-orange-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })()}
              </div>
            </div>
            
            <p className="text-base text-muted-foreground line-clamp-1 leading-snug" title={intervention.description}>
              {intervention.description}
            </p>
            
            {intervention.adresse && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate" title={intervention.adresse}>
                  {intervention.adresse}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Créé le {formatDate(intervention.cree)}</span>
            </div>
          </div>

          {/* Colonne 2: Artisan & Statut */}
          <div className="space-y-2">
            {/* Badge de statut cliquable */}
            <div className="relative status-menu-container">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 hover:shadow-md cursor-pointer"
                    style={{
                      backgroundColor: `${getStatusColor(intervention.statut)}10`,
                      borderColor: `${getStatusColor(intervention.statut)}30`,
                      color: getStatusColor(intervention.statut)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(() => {
                      const status = allStatuses.find(s => s.key === intervention.statut);
                      const StatusIcon = status?.icon || Clock;
                      return <StatusIcon className="h-4 w-4" />;
                    })()}
                    {(() => {
                      const status = allStatuses.find(s => s.key === intervention.statut);
                      return status?.label || intervention.statut;
                    })()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="text-xs font-medium text-gray-600 mb-3 px-2">Changer le statut</div>
                  <div className="grid grid-cols-1 gap-1">
                    {allStatuses.map((status) => {
                      const StatusIcon = status.icon;
                      const isActive = intervention.statut === status.key;
                      const statusColor = getStatusColor(status.key);
                      return (
                        <DropdownMenuItem
                          key={status.key}
                          className={`
                            flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200
                            ${isActive ? 'shadow-md' : 'hover:bg-gray-50'}
                          `}
                          style={{
                            ...(isActive ? {
                              backgroundColor: statusColor,
                              color: 'white'
                            } : {
                              backgroundColor: `${statusColor}10`,
                              color: statusColor
                            })
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange?.(intervention, status.key);
                          }}
                        >
                          <StatusIcon className="h-4 w-4" />
                          <span className="font-medium">{status.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{intervention.artisan}</span>
              {intervention.artisan_dossier_status && (
                <ArtisanDossierStatusIcon status={intervention.artisan_dossier_status} size="sm" />
              )}
              {intervention.artisan_status && (
                <ArtisanStatusBadge status={intervention.artisan_status} size="sm" />
              )}
              {intervention.artisan_metier && (
                <MetierBadge metier={intervention.artisan_metier as import('@/components/ui/BadgeComponents').ArtisanMetier} size="sm" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Échéance: {formatDate(intervention.echeance)}</span>
            </div>
          </div>

          {/* Colonne 3: Actions & Infos */}
          <div className="space-y-2 flex flex-col items-end">
            {/* Actions Menu */}
            <div className={`
              flex items-center gap-2 transition-all duration-300
              ${isAnyHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
            `}>
              
              {/* Desktop: Individual Buttons */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendEmail?.(intervention)}
                  title="Envoyer un email"
                  className={`h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 email-button ${
                    selectedActionIndex === 0 ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500 scale-110' : ''
                  }`}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCall?.(intervention)}
                  title="Appeler"
                  className={`h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-all duration-200 phone-button ${
                    selectedActionIndex === 1 ? 'bg-green-100 text-green-600 ring-2 ring-green-500 scale-110' : ''
                  }`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onAddDocument?.(intervention);
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setAnimationPosition({
                        top: rect.top - 200,
                        left: rect.left - 90
                      });
                      setShowDocumentAnimation(true);
                    }}
                    onMouseLeave={() => {
                      // Pas de fermeture immédiate, on laisse l'overlay gérer
                    }}
                    title="Ajouter un document"
                    className={`h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600 transition-all duration-200 document-button ${
                      selectedActionIndex === 2 ? 'bg-purple-100 text-purple-600 ring-2 ring-purple-500 scale-110' : ''
                    }`}
                  >
                    <FilePlus className="h-4 w-4" />
                  </Button>
                  
                  {/* Overlay d'animation au-dessus de l'icône document */}
                  {(showDocumentAnimation || (selectedActionIndex === 2 && keyboardHovered)) && createPortal(
                    <div 
                      className="fixed z-[9999]"
                      style={{
                        top: `${animationPosition.top}px`,
                        left: `${animationPosition.left}px`,
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={() => setShowDocumentAnimation(true)}
                      onMouseLeave={() => {
                        if (!keyboardHovered || selectedActionIndex !== 2) {
                          setShowDocumentAnimation(false);
                        }
                      }}
                    >
                      {/* Zone de transition invisible pour éviter la fermeture */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '50px',
                          height: '20px',
                          pointerEvents: 'auto'
                        }}
                        onMouseEnter={() => setShowDocumentAnimation(true)}
                      />
                      <AnimatedCard 
                        onMouseEnter={() => setShowDocumentAnimation(true)} 
                        onMouseLeave={() => {
                          if (!keyboardHovered || selectedActionIndex !== 2) {
                            setShowDocumentAnimation(false);
                          }
                        }}
                        statusColor={getStatusColor(intervention.statut)}
                        isKeyboardMode={keyboardHovered && selectedActionIndex === 2}
                        selectedCardIndex={keyboardHovered && selectedActionIndex === 2 ? selectedCardIndex : -1}
                        selectedActionIndex={selectedActionIndex}
                        onCardSelect={(index) => {
                          if (keyboardHovered && selectedActionIndex === 2) {
                            // La gestion de selectedCardIndex se fait maintenant dans le composant parent
                            console.log('Carte sélectionnée:', index);
                          }
                        }}
                      />
                    </div>,
                    document.body
                  )}
                  

                </div>
              </div>

              {/* Mobile: Dropdown Menu */}
              <div className="block md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onEdit?.(intervention)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Éditer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendEmail?.(intervention)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCall?.(intervention)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onAddDocument?.(intervention)}
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Informations */}
            <div className="space-y-2 text-right">
              <div className="space-y-1 text-right">
                <div className={`flex items-center gap-2 text-lg font-bold justify-end ${getMargeColor(getMarge())}`}>
                  <Euro className="h-5 w-5" />
                  <span>{formatCurrency(getMarge())}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Marge: {getMargePourcentage().toFixed(1)}% • Prix intervention: {formatCurrency(getPrixIntervention())}
                </div>
              </div>
              
              {intervention.reference && (
                <div className="text-sm text-muted-foreground">
                  Réf: {intervention.reference}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact spacing: remove helper text and reduce vertical gap */}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Mobile actions handled by dropdown menu */}
      </CardContent>

      {/* Hover overlay */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-primary/10 
        pointer-events-none rounded-lg transition-opacity duration-300
        ${isAnyHovered ? 'opacity-100' : 'opacity-0'}
      `} />
    </Card>



    {/* Section dépliable avec informations et édition intégrée */}
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <Card className="rounded-t-none border-t-0 bg-gradient-to-br from-slate-50/80 to-blue-50/80 dark:from-slate-800/50 dark:to-slate-900/50">
        <CardContent className="p-4 md:p-6">
          {/* Header avec statuts et coûts */}
          <div className="space-y-6">
            
            {/* Section Statuts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Statut de l'intervention</h4>
                <div 
                  className="relative"
                  onMouseEnter={() => setShowStatusEdit(true)}
                  onMouseLeave={() => setShowStatusEdit(false)}
                >
                  <button 
                    className="p-1 rounded hover:bg-gray-100 transition-colors group"
                    title="Tous les statuts"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusEdit(!showStatusEdit);
                    }}
                  >
                    <svg 
                      className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  {/* Menu élargi des statuts */}
                  {showStatusEdit && (
                    <>
                      {/* Zone invisible pour maintenir le hover */}
                      <div 
                        className="absolute top-0 right-0 w-8 h-8 bg-transparent"
                        onMouseEnter={() => setShowStatusEdit(true)}
                      />
                      <div 
                        className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-4 z-10 min-w-[280px]"
                        onMouseEnter={() => setShowStatusEdit(true)}
                        onMouseLeave={() => setShowStatusEdit(false)}
                      >
                        <div className="text-xs font-medium text-gray-600 mb-3">Tous les statuts</div>
                        <div className="grid grid-cols-1 gap-2">
                          {allStatuses.map((status) => {
                  const StatusIcon = status.icon;
                  const isActive = intervention.statut === status.key;
                            const statusColor = getStatusColor(status.key);
                            return (
                              <div key={status.key} className="flex items-center gap-2">
                                <Button
                                  variant={isActive ? "default" : "outline"}
                                  size="sm"
                                  className={`
                                    h-9 flex-1 justify-start transition-all duration-200 text-xs
                                    ${isActive ? 'shadow-md' : getStatusStyles(status.key)}
                                  `}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange?.(intervention, status.key);
                                    setShowStatusEdit(false);
                                  }}
                                >
                                  <StatusIcon className="h-3 w-3 mr-2" />
                                  <span className="text-xs font-medium">{status.label}</span>
                                </Button>
                                
                                {/* Sélecteur de couleur et pin */}
                                <div className="flex items-center gap-1">
                                  {/* Sélecteur de couleur */}
                                  <div className="relative color-picker-container">
                                    <button
                                      className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                      style={{ backgroundColor: statusColor }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenColorPicker(status.key);
                                      }}
                                      title="Changer la couleur"
                                    />
                                    
                                    {/* Color picker */}
                                    {activeColorPicker === status.key && (
                                      <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border p-2 z-20">
                                        <input
                                          type="color"
                                          value={statusColor}
                                          onChange={(e) => handleStatusColorChange(status.key, e.target.value)}
                                          className="w-8 h-8 border-0 rounded cursor-pointer"
                                          title="Sélectionner une couleur"
                                          autoFocus
                                        />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Bouton pin */}
                                  <button
                                    className={`p-1 rounded transition-colors ${
                                      pinnedStatuses.includes(status.key) 
                                        ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTogglePin(status.key);
                                    }}
                                    title={pinnedStatuses.includes(status.key) ? "Désépingler" : "Épingler"}
                                  >
                                    <MapPin className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Statuts rapides (épinglés) */}
              <div className={`grid gap-2 ${pinnedStatuses.length <= 2 ? 'grid-cols-2' : pinnedStatuses.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'}`}>
                {quickStatuses.map((status) => {
                  const StatusIcon = status.icon;
                  const isActive = intervention.statut === status.key;
                  const statusColor = getStatusColor(status.key);
                  return (
                    <Button
                      key={status.key}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`
                        h-10 w-full justify-start transition-all duration-300 ease-out
                        ${isActive ? 'shadow-lg scale-110 transform' : 'hover:scale-110 hover:shadow-md'}
                      `}
                      style={{
                        ...(isActive ? {
                          backgroundColor: statusColor,
                          borderColor: statusColor,
                          color: 'white',
                          boxShadow: `0 4px 12px ${statusColor}40`
                        } : {
                          backgroundColor: `${statusColor}10`,
                          borderColor: `${statusColor}30`,
                          color: statusColor
                        })
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(intervention, status.key);
                      }}
                    >
                      <StatusIcon 
                        className="h-4 w-4 mr-2 transition-colors duration-300" 
                        style={{ color: isActive ? 'white' : statusColor }}
                      />
                      <span className="text-xs font-medium">{status.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Section Coûts */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Détail des coûts</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">SST</div>
                    <EditableCell
                      value={intervention.coutSST || 0}
                      onChange={(newValue) => onCoutSSTChange?.(intervention, newValue)}
                      type="currency"
                      className="text-blue-600"
                    />
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Matériaux</div>
                    <EditableCell
                      value={intervention.coutMateriaux || 0}
                      onChange={(newValue) => onCoutMateriauxChange?.(intervention, newValue)}
                      type="currency"
                      className="text-purple-600"
                    />
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3 border">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Interventions</div>
                    <EditableCell
                      value={intervention.coutInterventions || 0}
                      onChange={(newValue) => onCoutInterventionsChange?.(intervention, newValue)}
                      type="currency"
                      className="text-green-600"
                    />
                  </div>
                </div>
              </div>
              
              {/* Résumé financier avec design reproduit */}
              <div className="bg-white rounded-lg p-4 border relative">
                <div className="flex items-center justify-between">
                  {/* Coûts déduits */}
                  <div className="text-sm">
                    <span className="text-gray-600">Coûts déduits:</span>
                    <div className="font-semibold text-red-600">
                      {formatCurrency((intervention.coutSST || 0) + (intervention.coutMateriaux || 0))}
                    </div>
                  </div>
                  
                  {/* Marge actuelle avec icône engrenage */}
                  <div className="text-sm flex items-center gap-2">
                    <span className="text-gray-600">Marge actuelle:</span>
                    <div className={`font-semibold ${getMargeColor(getMarge())}`}>
                      {formatCurrency(getMarge())} ({intervention.coutInterventions > 0 ? Math.round((getMarge() / intervention.coutInterventions) * 100) : 0}%)
                    </div>
                    <div 
                      className="relative"
                      onMouseEnter={() => setShowMarginEdit(true)}
                      onMouseLeave={() => setShowMarginEdit(false)}
                    >
                      <button 
                        className="p-1 rounded hover:bg-gray-100 transition-colors group"
                        title="Éditer la marge"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMarginEdit(!showMarginEdit);
                        }}
                      >
                        <svg 
                          className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      
                      {/* Menu d'édition de marge en superposition */}
                      {showMarginEdit && (
                        <>
                          {/* Zone invisible pour maintenir le hover */}
                          <div 
                            className="absolute top-0 right-0 w-8 h-8 bg-transparent"
                            onMouseEnter={() => setShowMarginEdit(true)}
                          />
                          <div 
                            className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-3 z-10 min-w-[200px]"
                            onMouseEnter={() => setShowMarginEdit(true)}
                            onMouseLeave={() => setShowMarginEdit(false)}
                          >
                            <div className="text-xs font-medium text-gray-600 mb-3">Édition de la marge</div>
                  <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-gray-600">Marge en €</div>
                      <EditableCell
                        value={getMarge()}
                        onChange={(newMargin) => {
                          const newInterventionPrice = (intervention.coutSST || 0) + (intervention.coutMateriaux || 0) + newMargin;
                          onCoutInterventionsChange?.(intervention, Math.round(newInterventionPrice * 100) / 100);
                        }}
                        type="currency"
                        className="text-green-600"
                      />
                    </div>
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-gray-600">Pourcentage</div>
                      <EditableCell
                        value={intervention.coutInterventions > 0 ? Math.round((getMarge() / intervention.coutInterventions) * 100) : 0}
                        onChange={(newPercentage) => {
                          const newInterventionPrice = ((intervention.coutSST || 0) + (intervention.coutMateriaux || 0)) / (1 - newPercentage / 100);
                          onCoutInterventionsChange?.(intervention, Math.round(newInterventionPrice * 100) / 100);
                        }}
                        type="percentage"
                        className="text-blue-600"
                        max={99}
                      />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations principales en colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Colonne gauche - Client & Adresse */}
              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 border">
                  <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations client
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Client</label>
                      <div className="text-sm font-medium text-foreground mt-1">{intervention.client}</div>
                    </div>
                    {intervention.adresse && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Adresse</label>
                        <div className="text-sm text-foreground mt-1 flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>{intervention.adresse}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <div className="text-sm text-foreground mt-1">{intervention.description}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Artisan & Dates */}
              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 border">
                  <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations intervention
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Artisan assigné</label>
                      <div className="text-sm font-medium text-foreground mt-1">{intervention.artisan}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Date création</label>
                        <div className="text-sm text-foreground mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(intervention.cree)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Échéance</label>
                        <div className="text-sm text-foreground mt-1 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDate(intervention.echeance)}
                        </div>
                      </div>
                    </div>
                    {intervention.notes && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Notes</label>
                        <div className="text-sm text-foreground mt-1 p-2 bg-background/80 rounded border">
                          {intervention.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="pt-4 border-t">
              <h5 className="text-sm font-semibold text-foreground mb-3">Actions rapides</h5>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendEmail?.(intervention);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email client
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCall?.(intervention);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mail artisan handler would go here
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Mail artisan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddDocument?.(intervention);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToDetail();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Page complète
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};