
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ExternalLink,
  Plus,
  Info,
  Clock,
  FileText,
  CheckCircle,
  Play,
  Settings
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/BadgeComponents';
import { ArtisanStatusFilter } from '@/components/ui/ArtisanStatusFilter';
import { ArtisanDossierStatusFilter } from '@/components/ui/ArtisanDossierStatusFilter';
import { InterventionSortFilter, SortConfig } from '@/components/ui/InterventionSortFilter';
import { DateRangeFilter, DateRange } from '@/components/ui/DateRangeFilter';
import { UserFilter } from '@/components/ui/UserFilter';
import { InterventionAPI } from '@/services/interventionApi';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InterventionCard } from '@/components/ui/InterventionCard';
import { InterventionDetailCard } from '@/components/ui/InterventionDetailCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';

// Import de l'interface depuis l'API
import { Intervention } from '@/services/interventionApi';

export const Interventions: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // États pour les filtres
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedArtisanStatuses, setSelectedArtisanStatuses] = useState<ARTISAN_STATUS[]>([]);
  const [selectedDossierStatuses, setSelectedDossierStatuses] = useState<ARTISAN_DOSSIER_STATUS[]>([]);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [pinnedStatuses, setPinnedStatuses] = useState<string[]>([]);
  const [scrollDirection, setScrollDirection] = useState<'left' | 'right' | null>(null);
  
  // États pour les filtres épinglables
  const [pinnedFilters, setPinnedFilters] = useState<{
    artisanStatus: boolean;
    dossierStatus: boolean;
  }>({
    artisanStatus: false,
    dossierStatus: false
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Nouveaux états pour la navigation au clavier
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // États pour la gestion de la souris
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  
  // État pour la sélection des icônes d'action
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(-1);
  
  // État pour la navigation dans l'AnimatedCard
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);
  
  // État pour le tri des interventions
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'cree',
    direction: 'desc'
  });

  // État pour le filtre par plage de dates d'échéance
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null
  });

  useEffect(() => {
    const loadInterventions = async () => {
      try {
        const data = await InterventionAPI.getAll();
        setInterventions(data);
        
        // Vérifier si une intervention est sélectionnée via l'URL
        const selectedId = searchParams.get('selected');
        if (selectedId) {
          const intervention = data.find((i: Intervention) => i.id === selectedId);
          if (intervention) {
            setSelectedIntervention(intervention);
          }
        }
      } catch (error) {
        console.error('Erreur chargement interventions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInterventions();
  }, [searchParams]);

  useEffect(() => {
    const handleSearchFilter = (event: CustomEvent) => {
      const { filterKey, value, page } = event.detail;
      if (page === '/interventions') {
        // Recharger les données originales d'abord
        const loadOriginalData = async () => {
          try {
            const data = await InterventionAPI.getAll();
            const originalInterventions = data;
            // Appliquer le filtre
            const filtered = originalInterventions.filter((intervention: Intervention) => {
              switch (filterKey) {
                case 'statut':
                  return intervention.statut === value;
                case 'artisan':
                  return intervention.artisan.toLowerCase().includes(value.toLowerCase());
                case 'client':
                  return intervention.client.toLowerCase().includes(value.toLowerCase());
                case 'date':
                  return intervention.cree === value || intervention.echeance === value;
                default:
                  return true;
              }
            });
            setInterventions(filtered);
          } catch (error) {
            console.error('Erreur lors du filtrage:', error);
          }
        };
        loadOriginalData();
      }
    };
    window.addEventListener('searchFilter', handleSearchFilter as EventListener);
    return () => {
      window.removeEventListener('searchFilter', handleSearchFilter as EventListener);
    };
  }, []);

  // Obtenir les listes uniques pour les filtres
  const uniqueUsers = Array.from(new Set(interventions.map(i => i.utilisateur_assigné).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(interventions.map(i => i.statut)));

  // Configuration des statuts avec icônes et couleurs
  const statusConfig = {
    demande: { label: 'Demandé', icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200', activeColor: 'bg-blue-500 text-white' },
    devis_envoye: { label: 'Devis Envoyé', icon: FileText, color: 'bg-purple-100 text-purple-700 border-purple-200', activeColor: 'bg-purple-500 text-white' },
    accepte: { label: 'Accepté', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', activeColor: 'bg-green-500 text-white' },
    en_cours: { label: 'En cours', icon: Play, color: 'bg-orange-100 text-orange-700 border-orange-200', activeColor: 'bg-orange-500 text-white' },
    annule: { label: 'Annulé', icon: Clock, color: 'bg-red-100 text-red-700 border-red-200', activeColor: 'bg-red-500 text-white' },
    termine: { label: 'Terminé', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', activeColor: 'bg-emerald-500 text-white' },
    visite_technique: { label: 'Visite Technique', icon: Clock, color: 'bg-indigo-100 text-indigo-700 border-indigo-200', activeColor: 'bg-indigo-500 text-white' },
    refuse: { label: 'Refusé', icon: Clock, color: 'bg-red-100 text-red-700 border-red-200', activeColor: 'bg-red-500 text-white' },
    stand_by: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', activeColor: 'bg-yellow-500 text-white' },
    sav: { label: 'SAV', icon: Clock, color: 'bg-pink-100 text-pink-700 border-pink-200', activeColor: 'bg-pink-500 text-white' },
    bloque: { label: 'Bloqué', icon: Clock, color: 'bg-gray-100 text-gray-700 border-gray-200', activeColor: 'bg-gray-500 text-white' }
  };

  // Statuts par défaut (toujours affichés)
  const defaultStatuses = ['demande', 'devis_envoye', 'accepte', 'en_cours'];
  
  // Statuts supplémentaires (disponibles dans le menu)
  const additionalStatuses = uniqueStatuses.filter(status => !defaultStatuses.includes(status));
  
  // Statuts à afficher (par défaut + épinglés)
  const displayedStatuses = [...defaultStatuses, ...pinnedStatuses];

  // Fonction pour calculer le nombre d'interventions par statut
  const getInterventionCountByStatus = (status: string) => {
    if (status === '') {
      return interventions.length; // Toutes les interventions
    }
    return interventions.filter(intervention => intervention.statut === status).length;
  };

  // Fonction pour épingler un statut
  const pinStatus = (status: string) => {
    if (!pinnedStatuses.includes(status)) {
      setPinnedStatuses([...pinnedStatuses, status]);
    }
  };

  // Fonction pour désépingler un statut
  const unpinStatus = (status: string) => {
    setPinnedStatuses(pinnedStatuses.filter(s => s !== status));
  };

  // Fonction pour gérer le scroll horizontal et changer de statut
  const handleHorizontalScroll = (direction: 'left' | 'right') => {
    setScrollDirection(direction);
    
    // Liste de tous les statuts disponibles (y compris "toutes")
    const allStatuses = ['', ...displayedStatuses];
    const currentIndex = allStatuses.indexOf(selectedStatus);
    
    let newIndex: number;
    if (direction === 'right') {
      newIndex = currentIndex < allStatuses.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allStatuses.length - 1;
    }
    
    const newStatus = allStatuses[newIndex];
    setSelectedStatus(newStatus);
    
    // Réinitialiser la direction après l'animation
    setTimeout(() => {
      setScrollDirection(null);
    }, 300);
  };

  // État pour accumuler le scroll horizontal
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const scrollThreshold = 100; // Seuil pour déclencher le changement de statut

  // Filtrer les interventions selon les critères sélectionnés
  const filteredInterventions = interventions.filter(intervention => {
    // Filtre par utilisateur
    if (selectedUser && intervention.utilisateur_assigné !== selectedUser) {
      return false;
    }
    
    // Filtre par statut d'intervention
    if (selectedStatus && intervention.statut !== selectedStatus) {
      return false;
    }
    
    // Filtre par statut d'artisan
    if (selectedArtisanStatuses.length > 0 && intervention.artisan_status) {
      if (!selectedArtisanStatuses.includes(intervention.artisan_status)) {
        return false;
      }
    }
    
    // Filtre par statut de dossier
    if (selectedDossierStatuses.length > 0 && intervention.artisan_dossier_status) {
      if (!selectedDossierStatuses.includes(intervention.artisan_dossier_status)) {
        return false;
      }
    }
    
    // Filtre par plage de dates d'échéance
    if (dateRange.from || dateRange.to) {
      const echeanceDate = new Date(intervention.echeance);
      
      if (dateRange.from && echeanceDate < dateRange.from) {
        return false;
      }
      
      if (dateRange.to && echeanceDate > dateRange.to) {
        return false;
      }
    }
    
    return true;
  });

  // Trier les interventions selon la configuration de tri
  const sortedInterventions = [...filteredInterventions].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortConfig.field) {
      case 'cree':
        aValue = new Date(a.cree).getTime();
        bValue = new Date(b.cree).getTime();
        break;
      case 'echeance':
        aValue = new Date(a.echeance).getTime();
        bValue = new Date(b.echeance).getTime();
        break;
      case 'marge':
        // Calculer la marge (montant - coûts)
        aValue = (a.montant || 0) - (a.coutSST || 0) - (a.coutMateriaux || 0) - (a.coutInterventions || 0);
        bValue = (b.montant || 0) - (b.coutSST || 0) - (b.coutMateriaux || 0) - (b.coutInterventions || 0);
        break;
      default:
        return 0;
    }

    if (sortConfig.direction === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  // Handlers pour les actions du composant InterventionCard
  const handleEditIntervention = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
  };

  const handleSendEmail = (intervention: Intervention) => {
    console.log('Envoi email pour:', intervention.id);
    // Ici vous pouvez implémenter l'envoi d'email
  };

  const handleCall = (intervention: Intervention) => {
    console.log('Appel pour:', intervention.id);
    // Ici vous pouvez implémenter l'appel
  };

  const handleAddDocument = (intervention: Intervention) => {
    console.log('Ajout document pour:', intervention.id);
    // Ici vous pouvez implémenter l'ajout de document
  };

  const handleStatusChange = async (intervention: Intervention, newStatus: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateStatus(intervention.id, newStatus as Intervention['statut']);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const handleAmountChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateMontant(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour montant:', error);
    }
  };

  const handleDateChange = async (intervention: Intervention, field: string, date: string) => {
    try {
      let updatedIntervention;
      if (field === 'echeance') {
        updatedIntervention = await InterventionAPI.updateEcheance(intervention.id, date);
      }
      if (updatedIntervention) {
        setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
        if (selectedIntervention?.id === intervention.id) {
          setSelectedIntervention(updatedIntervention);
        }
      }
    } catch (error) {
      console.error('Erreur mise à jour date:', error);
    }
  };

  const handleAddressChange = async (intervention: Intervention, address: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateAddress(intervention.id, address);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour adresse:', error);
    }
  };

  const handleArtisanChange = async (intervention: Intervention, artisan: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateArtisan(intervention.id, artisan);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour artisan:', error);
    }
  };

  const handleArtisanStatusChange = async (intervention: Intervention, newStatus: ARTISAN_STATUS) => {
    try {
      const updatedIntervention = await InterventionAPI.updateArtisanStatus(intervention.id, newStatus);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut artisan:', error);
    }
  };

  const handleArtisanDossierStatusChange = async (intervention: Intervention, newStatus: ARTISAN_DOSSIER_STATUS) => {
    try {
      const updatedIntervention = await InterventionAPI.updateArtisanDossierStatus(intervention.id, newStatus);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut dossier:', error);
    }
  };

  const handleClientChange = async (intervention: Intervention, client: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateClient(intervention.id, client);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour client:', error);
    }
  };

  const handleDescriptionChange = async (intervention: Intervention, description: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateDescription(intervention.id, description);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour description:', error);
    }
  };

  const handleNotesChange = async (intervention: Intervention, notes: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateNotes(intervention.id, notes);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour notes:', error);
    }
  };

  const handleCoutSSTChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateCoutSST(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour coût SST:', error);
    }
  };

  const handleCoutMateriauxChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateCoutMateriaux(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour coût matériaux:', error);
    }
  };

  const handleCoutInterventionsChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateCoutInterventions(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour coût interventions:', error);
    }
  };

  const handleUserChange = async (intervention: Intervention, username: string) => {
    try {
      // Ici vous pouvez ajouter l'appel API pour mettre à jour l'utilisateur assigné
      // const updatedIntervention = await InterventionAPI.updateUser(intervention.id, username);
      
      // Pour l'instant, on met à jour localement
      const updatedIntervention = {
        ...intervention,
        utilisateur_assigné: username
      };
      
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
    }
  };

  // Gestionnaire pour sauvegarder la position de la souris
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Sauvegarder la position de la souris si on n'est pas en mode clavier
      if (!isKeyboardMode) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
      
      // Si on est en mode navigation clavier, sortir complètement du mode
      if (isKeyboardMode) {
        console.log('Souris détectée - abandon complet de la navigation clavier');
        setIsKeyboardMode(false);
        setKeyboardSelectedIndex(-1);
        setSelectedActionIndex(-1);
        document.body.style.cursor = 'auto';
        
        // Restaurer la position de la souris si elle était sauvegardée
        if (mousePosition) {
          // Note: On ne peut pas repositionner la souris directement pour des raisons de sécurité
          // Mais on peut au moins restaurer le curseur
          console.log('Position souris restaurée:', mousePosition);
        }
      }
    };

    const handleMouseEnter = () => {
      // Afficher le curseur et abandonner la navigation quand la souris entre dans la zone
      if (isKeyboardMode) {
        console.log('Souris entrée dans la zone - abandon de la navigation clavier');
        setIsKeyboardMode(false);
        setKeyboardSelectedIndex(-1);
        setSelectedActionIndex(-1);
        document.body.style.cursor = 'auto';
      }
    };

    const handleMouseClick = () => {
      // Abandonner la navigation clavier lors d'un clic
      if (isKeyboardMode) {
        console.log('Clic souris détecté - abandon de la navigation clavier');
        setIsKeyboardMode(false);
        setKeyboardSelectedIndex(-1);
        setSelectedActionIndex(-1);
        document.body.style.cursor = 'auto';
      }
    };

    // Ajouter les écouteurs d'événements
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('click', handleMouseClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('click', handleMouseClick);
      // Restaurer le curseur à la sortie
      document.body.style.cursor = 'auto';
    };
  }, [isKeyboardMode, mousePosition]);

  // Gestionnaire d'événements clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Vérifier si on est dans un champ de saisie ou un élément interactif
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.contentEditable === 'true') {
        return;
      }

      console.log('Touche pressée:', event.key, 'Index actuel:', keyboardSelectedIndex);

      switch (event.key) {
        case 'Enter':
          // Si une carte de l'AnimatedCard est sélectionnée, déclencher l'action de la carte
          if (keyboardSelectedIndex >= 0 && selectedActionIndex === 2 && selectedCardIndex >= 0) {
            event.preventDefault();
            const intervention = filteredInterventions[keyboardSelectedIndex];
            console.log('Déclenchement action carte:', selectedCardIndex, 'pour intervention:', intervention.id);
            
            // Déclencher l'action correspondante à la carte sélectionnée
            switch (selectedCardIndex) {
              case 0: // Github
                console.log('Action Github déclenchée');
                // Ici vous pouvez ajouter l'action spécifique pour Github
                break;
              case 1: // Code
                console.log('Action Code déclenchée');
                // Ici vous pouvez ajouter l'action spécifique pour Code
                break;
              case 2: // Earn
                console.log('Action Earn déclenchée');
                // Ici vous pouvez ajouter l'action spécifique pour Earn
                break;
            }
            
            // Réinitialiser la sélection de carte
            setSelectedCardIndex(-1);
          }
          // Si une icône d'action est sélectionnée, déclencher l'action
          else if (keyboardSelectedIndex >= 0 && selectedActionIndex >= 0) {
            event.preventDefault();
            const intervention = filteredInterventions[keyboardSelectedIndex];
            console.log('Déclenchement action:', selectedActionIndex, 'pour intervention:', intervention.id);
            
            // Déclencher l'action correspondante
            switch (selectedActionIndex) {
              case 0: // Email
                handleSendEmail(intervention);
                break;
              case 1: // Téléphone
                handleCall(intervention);
                break;
              case 2: // Document
                handleAddDocument(intervention);
                break;
            }
            
            // Réinitialiser la sélection d'action
            setSelectedActionIndex(-1);
          }
          // Si une intervention est sélectionnée par le clavier, simuler un clic simple
          else if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < filteredInterventions.length) {
            event.preventDefault();
            const intervention = filteredInterventions[keyboardSelectedIndex];
            console.log('Simulation clic simple pour intervention:', intervention.id);
            
            // Simuler un clic simple pour ouvrir le menu déroulant de la carte
            // On va déclencher l'événement de clic sur la carte sélectionnée
            const selectedElement = document.querySelector(`[data-intervention-index="${keyboardSelectedIndex}"]`) as HTMLElement;
            if (selectedElement) {
              // Trouver la carte InterventionCard à l'intérieur et déclencher son clic
              const cardElement = selectedElement.querySelector('[data-card-clickable]') as HTMLElement;
              if (cardElement) {
                cardElement.click();
              }
            }
            
            // Restaurer le curseur après l'action
            document.body.style.cursor = 'auto';
          }
          // Si aucune intervention n'est sélectionnée, démarrer la navigation
          else if (keyboardSelectedIndex === -1 && filteredInterventions.length > 0) {
            event.preventDefault();
            console.log('Démarrage navigation clavier');
            setIsKeyboardMode(true);
            setKeyboardSelectedIndex(0);
            
            // Cacher le curseur
            document.body.style.cursor = 'none';
          }
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          // Si on est sur l'icône document, déplier l'AnimatedCard et sélectionner la première carte
          if (keyboardSelectedIndex >= 0 && selectedActionIndex === 2) {
            if (selectedCardIndex === -1) {
              // Déplier l'AnimatedCard et sélectionner la première carte
              setSelectedCardIndex(0);
              console.log('AnimatedCard déplié, carte 0 sélectionnée');
            } else {
              // Navigation dans les cartes (vers le haut)
              setSelectedCardIndex(prev => {
                const newIndex = prev > 0 ? prev - 1 : 2; // 3 cartes: 0, 1, 2
                console.log('Nouvelle carte sélectionnée (haut):', newIndex);
                return newIndex;
              });
            }
          } else {
            // Navigation normale entre interventions (seulement s'il y a des interventions)
            if (filteredInterventions.length > 0) {
              setKeyboardSelectedIndex(prev => {
                const newIndex = prev > 0 ? prev - 1 : filteredInterventions.length - 1;
                console.log('Nouvel index (haut):', newIndex);
                // S'assurer que le curseur reste caché
                document.body.style.cursor = 'none';
                // Réinitialiser la sélection d'action quand on change d'intervention
                setSelectedActionIndex(-1);
                setSelectedCardIndex(-1);
                // Faire défiler vers l'intervention sélectionnée
                setTimeout(() => {
                  const selectedElement = document.querySelector(`[data-intervention-index="${newIndex}"]`) as HTMLElement;
                  if (selectedElement) {
                    selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }, 0);
                return newIndex;
              });
            } else {
              // Si pas d'interventions, naviguer vers le statut précédent
              handleHorizontalScroll('left');
            }
          }
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          // Si on est dans l'AnimatedCard, sortir de la navigation des cartes et revenir sur l'icône document
          if (keyboardSelectedIndex >= 0 && selectedActionIndex === 2 && selectedCardIndex >= 0) {
            setSelectedCardIndex(-1);
            console.log('Sortie de la navigation des cartes, retour sur icône document');
          } else {
            // Navigation normale entre interventions (seulement s'il y a des interventions)
            if (filteredInterventions.length > 0) {
              setKeyboardSelectedIndex(prev => {
                const newIndex = prev < filteredInterventions.length - 1 ? prev + 1 : 0;
                console.log('Nouvel index (bas):', newIndex);
                // S'assurer que le curseur reste caché
                document.body.style.cursor = 'none';
                // Réinitialiser la sélection d'action quand on change d'intervention
                setSelectedActionIndex(-1);
                setSelectedCardIndex(-1);
                // Faire défiler vers l'intervention sélectionnée
                setTimeout(() => {
                  const selectedElement = document.querySelector(`[data-intervention-index="${newIndex}"]`) as HTMLElement;
                  if (selectedElement) {
                    selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }, 0);
                return newIndex;
              });
            } else {
              // Si pas d'interventions, naviguer vers le statut suivant
              handleHorizontalScroll('right');
            }
          }
          break;
          
        case 'ArrowLeft':
          event.preventDefault();
          // Si on est dans l'AnimatedCard, naviguer vers la gauche
          if (keyboardSelectedIndex >= 0 && selectedActionIndex === 2 && selectedCardIndex >= 0) {
            setSelectedCardIndex(prev => {
              const newIndex = prev > 0 ? prev - 1 : 2; // 3 cartes: 0, 1, 2
              console.log('Nouvelle carte sélectionnée (gauche):', newIndex);
              return newIndex;
            });
          } else {
            // Navigation entre les icônes d'action (mail, téléphone, document)
            if (keyboardSelectedIndex >= 0) {
              setSelectedActionIndex(prev => {
                const newIndex = prev > 0 ? prev - 1 : 2; // 3 icônes: 0, 1, 2
                console.log('Nouvelle icône sélectionnée (gauche):', newIndex);
                return newIndex;
              });
            } else {
              // Naviguer vers le statut précédent
              handleHorizontalScroll('left');
            }
          }
          break;
          
        case 'ArrowRight':
          event.preventDefault();
          // Si on est dans l'AnimatedCard, naviguer vers la droite
          if (keyboardSelectedIndex >= 0 && selectedActionIndex === 2 && selectedCardIndex >= 0) {
            setSelectedCardIndex(prev => {
              const newIndex = prev < 2 ? prev + 1 : 0; // 3 cartes: 0, 1, 2
              console.log('Nouvelle carte sélectionnée (droite):', newIndex);
              return newIndex;
            });
          } else {
            // Navigation entre les icônes d'action (mail, téléphone, document)
            if (keyboardSelectedIndex >= 0) {
              setSelectedActionIndex(prev => {
                const newIndex = prev < 2 ? prev + 1 : 0; // 3 icônes: 0, 1, 2
                console.log('Nouvelle icône sélectionnée (droite):', newIndex);
                return newIndex;
              });
            } else {
              // Naviguer vers le statut suivant
              handleHorizontalScroll('right');
            }
          }
          break;
          
        case 'Tab':
          // Si une intervention est sélectionnée par le clavier, simuler un clic droit
          if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < filteredInterventions.length) {
            event.preventDefault();
            const intervention = filteredInterventions[keyboardSelectedIndex];
            console.log('Simulation clic droit pour intervention:', intervention.id);
            
            // Simuler un clic droit en naviguant vers la page complète
            navigate(`/interventions/${intervention.id}`);
            
            // Restaurer le curseur après la navigation
            document.body.style.cursor = 'auto';
            
            // Ne pas réinitialiser la sélection clavier pour permettre la navigation continue
          }
          break;
          
        case ' ':
          // Espace pour changer le statut de l'intervention sélectionnée
          if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < filteredInterventions.length) {
            event.preventDefault();
            const intervention = filteredInterventions[keyboardSelectedIndex];
            console.log('Changement de statut pour intervention:', intervention.id);
            
            // Liste des statuts dans l'ordre
            const statusOrder = [
              'demande', 'devis_envoye', 'accepte', 'en_cours', 'annule', 
              'termine', 'visite_technique', 'refuse', 'stand_by', 'sav'
            ];
            
            // Trouver l'index du statut actuel
            const currentStatusIndex = statusOrder.indexOf(intervention.statut);
            // Passer au statut suivant (ou revenir au début)
            const nextStatusIndex = (currentStatusIndex + 1) % statusOrder.length;
            const nextStatus = statusOrder[nextStatusIndex];
            
            // Appliquer le changement de statut
            handleStatusChange(intervention, nextStatus);
          }
          break;
          
        case 'Escape':
          // Réinitialiser complètement la navigation clavier
          console.log('Annulation complète de la navigation clavier');
          setIsKeyboardMode(false);
          setKeyboardSelectedIndex(-1);
          setSelectedActionIndex(-1);
          setSelectedCardIndex(-1);
          // Restaurer le curseur
          document.body.style.cursor = 'auto';
          break;
      }
    };

    // Ajouter l'écouteur d'événements au document
    document.addEventListener('keydown', handleKeyDown, true); // Utiliser capture phase
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [filteredInterventions, keyboardSelectedIndex, isKeyboardMode, mousePosition, selectedStatus, displayedStatuses]);

  // Réinitialiser la sélection clavier quand les interventions changent
  useEffect(() => {
    // Ne réinitialiser que si la sélection actuelle n'est plus valide
    if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex >= filteredInterventions.length) {
      setKeyboardSelectedIndex(-1);
      setSelectedActionIndex(-1);
      setIsKeyboardMode(false);
      document.body.style.cursor = 'auto';
    }
  }, [filteredInterventions, keyboardSelectedIndex]);

  // Gestionnaire pour maintenir la sélection clavier lors des clics
  const handleCardClick = (index: number) => {
    // Si on clique sur une carte, abandonner complètement la navigation clavier
    if (isKeyboardMode) {
      console.log('Clic sur carte - abandon de la navigation clavier');
      setIsKeyboardMode(false);
      setKeyboardSelectedIndex(-1);
      setSelectedActionIndex(-1);
      document.body.style.cursor = 'auto';
    }
  };

  // Gestionnaire pour empêcher la perte de focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ne pas réinitialiser la sélection clavier lors des clics
      // La sélection reste active jusqu'à ce qu'on appuie sur Échap
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Gestionnaire pour fermer le menu des statuts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.status-menu-container')) {
        setShowStatusMenu(false);
      }
    };

    if (showStatusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusMenu]);

  // Gestionnaire pour fermer le menu des filtres épinglables
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-menu-container')) {
        setShowFilterMenu(false);
      }
    };

    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);

  // Gestionnaire pour le scroll horizontal
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Détecter le scroll horizontal
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        
        // Accumuler le scroll
        const newAccumulator = scrollAccumulator + event.deltaX;
        setScrollAccumulator(newAccumulator);
        
        // Vérifier si le seuil est atteint
        if (Math.abs(newAccumulator) >= scrollThreshold) {
          if (newAccumulator > 0) {
            // Scroll vers la droite
            handleHorizontalScroll('right');
          } else {
            // Scroll vers la gauche
            handleHorizontalScroll('left');
          }
          // Réinitialiser l'accumulateur
          setScrollAccumulator(0);
        }
      }
    };

    // Ajouter l'écouteur d'événements au conteneur des interventions
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [selectedStatus, displayedStatuses, scrollAccumulator]);

  // Réinitialiser l'accumulateur après un délai d'inactivité
  useEffect(() => {
    if (Math.abs(scrollAccumulator) > 0) {
      const timer = setTimeout(() => {
        setScrollAccumulator(0);
      }, 1000); // Réinitialiser après 1 seconde d'inactivité

      return () => clearTimeout(timer);
    }
  }, [scrollAccumulator]);

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
                <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-4">
              {/* Première ligne : Filtres compacts */}
              <div className="flex items-center space-x-6">
              {/* Filtres utilisateur et échéance côte à côte */}
              <div className="flex items-center space-x-2">
                <UserFilter
                  selectedUser={selectedUser}
                  onUserChange={setSelectedUser}
                  users={uniqueUsers}
                />

                <DateRangeFilter
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
              </div>

              {/* Filtre par statut */}
              <div className="flex items-center space-x-2 status-menu-container relative" style={{ paddingLeft: '29px' }}>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-muted-foreground">Statut:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="h-3 w-3 text-muted-foreground hover:text-primary" />
          </Button>
                </div>
                
                {/* Menu déroulant des statuts supplémentaires */}
                {showStatusMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 status-menu-container">
                    <div className="text-xs font-medium text-gray-500 mb-2">Ajouter des statuts</div>
                    <div className="space-y-1">
                      {additionalStatuses.map(status => {
                        const config = statusConfig[status as keyof typeof statusConfig];
                        const IconComponent = config.icon;
                        const isPinned = pinnedStatuses.includes(status);
                        
                        return (
                          <div key={status} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
        <div className="flex items-center space-x-2">
                              <IconComponent className="h-3 w-3" />
                              <span className="text-xs">{config.label}</span>
          </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => isPinned ? unpinStatus(status) : pinStatus(status)}
                              className="h-6 w-6 p-0"
                            >
                              {isPinned ? (
                                <div className="h-3 w-3 bg-primary rounded-full"></div>
                              ) : (
                                <div className="h-3 w-3 border border-gray-300 rounded-full"></div>
                              )}
          </Button>
        </div>
                        );
                      })}
      </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  {/* Bouton "Toutes" */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStatus('')}
                    className={`
                      text-xs flex items-center gap-1.5 px-3 py-1.5
                      ${!selectedStatus ? 'bg-gray-500 text-white border-gray-500' : 'bg-gray-100 text-gray-700 border-gray-200'}
                    `}
                  >
                    Toutes ({getInterventionCountByStatus('')})
                  </Button>
                  
                  {displayedStatuses.map(status => {
                    const config = statusConfig[status as keyof typeof statusConfig];
                    const IconComponent = config.icon;
                    const isSelected = selectedStatus === status;
                    const isPinned = pinnedStatuses.includes(status);
                    
                    return (
                      <div key={status} className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStatus(isSelected ? '' : status)}
                          className={`
                            text-xs flex items-center gap-1.5 px-3 py-1.5
                            ${isSelected ? config.activeColor : config.color}
                            ${isSelected ? 'border-2' : 'border'}
                            ${isPinned ? 'ring-2 ring-primary ring-offset-1' : ''}
                          `}
                        >
                          <IconComponent className="h-3 w-3" />
                          {config.label} ({getInterventionCountByStatus(status)})
                        </Button>
                        {isPinned && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => unpinStatus(status)}
                            className="h-6 w-6 p-0"
                          >
                            <div className="h-3 w-3 bg-primary rounded-full"></div>
                          </Button>
                        )}
                        {isSelected && !isPinned && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => pinStatus(status)}
                            className="h-6 w-6 p-0"
                          >
                            <div className="h-3 w-3 border border-gray-300 rounded-full hover:border-primary"></div>
                          </Button>
                        )}
            </div>
                    );
                  })}
                </div>
              </div>

              </div>

              {/* Filtres épinglables conditionnels */}
              {pinnedFilters.artisanStatus && (
                <ArtisanStatusFilter
                  selectedStatuses={selectedArtisanStatuses}
                  onStatusChange={setSelectedArtisanStatuses}
                />
              )}

              {pinnedFilters.dossierStatus && (
                <ArtisanDossierStatusFilter
                  selectedStatuses={selectedDossierStatuses}
                  onStatusChange={setSelectedDossierStatuses}
                />
              )}

              {/* Bouton pour réinitialiser les filtres */}
              {(selectedStatus || selectedArtisanStatuses.length > 0 || selectedDossierStatuses.length > 0 || pinnedStatuses.length > 0 || pinnedFilters.artisanStatus || pinnedFilters.dossierStatus) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser('');
                    setSelectedStatus('');
                    setSelectedArtisanStatuses([]);
                    setSelectedDossierStatuses([]);
                    setDateRange({ from: null, to: null });
                    setPinnedStatuses([]);
                    setPinnedFilters({
                      artisanStatus: false,
                      dossierStatus: false
                    });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
            
            {/* Export CSV et icônes */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
              
              {/* Icône filtre pour épingler les filtres */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 relative"
                        onMouseEnter={() => setShowFilterMenu(true)}
                      >
                        <Filter className="h-4 w-4" />
                        {/* Indicateur de filtres actifs */}
                        {(pinnedFilters.artisanStatus || pinnedFilters.dossierStatus) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                        )}
                      </Button>
                      
                      {/* Zone de transition invisible pour éviter la fermeture du menu */}
                      {showFilterMenu && (
                        <div 
                          className="absolute top-full right-0 w-48 h-2 bg-transparent"
                          onMouseEnter={() => setShowFilterMenu(true)}
                        />
                      )}
                      
                      {/* Menu des filtres épinglables */}
                      {showFilterMenu && (
                        <div 
                          className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 filter-menu-container"
                          onMouseEnter={() => setShowFilterMenu(true)}
                          onMouseLeave={() => setShowFilterMenu(false)}
                        >
                          <div className="text-xs font-medium text-gray-600 mb-3">Épingler des filtres</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                 onClick={() => setPinnedFilters(prev => ({ ...prev, artisanStatus: !prev.artisanStatus }))}>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-xs">Statut artisan</span>
                              </div>
                              <div className="h-6 w-6 flex items-center justify-center">
                                {pinnedFilters.artisanStatus ? (
                                  <div className="h-3 w-3 bg-primary rounded-full"></div>
                                ) : (
                                  <div className="h-3 w-3 border border-gray-300 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                                 onClick={() => setPinnedFilters(prev => ({ ...prev, dossierStatus: !prev.dossierStatus }))}>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs">Statut dossier</span>
                              </div>
                              <div className="h-6 w-6 flex items-center justify-center">
                                {pinnedFilters.dossierStatus ? (
                                  <div className="h-3 w-3 bg-primary rounded-full"></div>
                                ) : (
                                  <div className="h-3 w-3 border border-gray-300 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="w-48 p-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Filtres épinglables</h4>
                      <div className="text-xs text-muted-foreground">
                        Épingler des filtres supplémentaires pour les afficher en permanence
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Icône d'information pour la navigation au clavier */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="w-80 p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Navigation au clavier</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Entrée</kbd>
                          <span>Ouvrir menu / Démarrer navigation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">↑↓</kbd>
                          <span>Naviguer entre interventions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">←→</kbd>
                          <span>Sélectionner icônes (Mail, Téléphone, Document)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">↑</kbd>
                          <span>Déplier cartes (sur icône Document)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">←→</kbd>
                          <span>Naviguer dans les cartes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Tab</kbd>
                          <span>Page complète</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Espace</kbd>
                          <span>Statut suivant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Échap</kbd>
                          <span>Annuler / Quitter</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="font-medium text-xs mb-2">Navigation des statuts :</div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">←→</kbd>
                            <span>Changer de statut (quand pas d'intervention sélectionnée)</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">↑↓</kbd>
                            <span>Changer de statut (si liste vide)</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">• Scroll horizontal pour navigation fluide</span>
                          </div>
                        </div>
                      </div>
                      {keyboardSelectedIndex >= 0 && (
                        <div className="flex items-center gap-2 text-primary font-medium text-xs pt-2 border-t">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          Navigation active (Index: {keyboardSelectedIndex})
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des interventions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedStatus !== undefined && (
                <div className="flex items-center space-x-2">
                  <div className={`
                    text-xs px-2 py-1 rounded-full flex items-center gap-1
                    ${selectedStatus === '' ? 'bg-gray-100 text-gray-700 border border-gray-200' : statusConfig[selectedStatus as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700'}
                  `}>
                    {selectedStatus === '' ? (
                      <>
                        <span className="text-gray-600">Toutes les interventions</span>
                      </>
                    ) : (
                      <>
                        {statusConfig[selectedStatus as keyof typeof statusConfig]?.icon && 
                          React.createElement(statusConfig[selectedStatus as keyof typeof statusConfig].icon, { className: "h-3 w-3" })
                        }
                        {statusConfig[selectedStatus as keyof typeof statusConfig]?.label || selectedStatus}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Composant de tri aligné à droite */}
              <InterventionSortFilter
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
              />
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {/* Indicateur de progression du scroll */}
                {Math.abs(scrollAccumulator) > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>Scroll en cours...</span>
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-200 ${
                          scrollAccumulator > 0 ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(scrollAccumulator) / scrollThreshold * 100, 100)}%`,
                          transform: `translateX(${scrollAccumulator > 0 ? '0' : '100%'})`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div 
              className={`space-y-2 transition-all duration-300 ease-out ${
                scrollDirection === 'right' ? 'translate-x-4 opacity-50' : 
                scrollDirection === 'left' ? '-translate-x-4 opacity-50' : 
                'translate-x-0 opacity-100'
              }`}
            >
              {sortedInterventions.map((intervention, index) => (
                <div
                  key={intervention.id}
                  data-intervention-index={index}
                  className={`
                    transition-all duration-200 rounded-lg p-1 relative
                    ${keyboardSelectedIndex === index 
                      ? 'bg-primary/10 shadow-lg scale-[1.02]' 
                      : 'hover:bg-muted/50'
                    }
                  `}
                  onClick={() => handleCardClick(index)}
                >
                  {keyboardSelectedIndex === index && (
                    <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                      Sélectionné
                    </div>
                  )}
                  <InterventionCard
                    intervention={intervention}
                    onEdit={handleEditIntervention}
                    onSendEmail={handleSendEmail}
                    onCall={handleCall}
                    onAddDocument={handleAddDocument}
                    onStatusChange={handleStatusChange}
                    onAmountChange={handleAmountChange}
                    onDateChange={handleDateChange}
                    onAddressChange={handleAddressChange}
                    onArtisanChange={handleArtisanChange}
                    onArtisanStatusChange={handleArtisanStatusChange}
                    onArtisanDossierStatusChange={handleArtisanDossierStatusChange}
                    onClientChange={handleClientChange}
                    onDescriptionChange={handleDescriptionChange}
                    onNotesChange={handleNotesChange}
                    onCoutSSTChange={handleCoutSSTChange}
                    onCoutMateriauxChange={handleCoutMateriauxChange}
                    onCoutInterventionsChange={handleCoutInterventionsChange}
                    onUserChange={handleUserChange}
                    hideBorder={keyboardSelectedIndex === index}
                    keyboardHovered={keyboardSelectedIndex === index}
                    selectedActionIndex={keyboardSelectedIndex === index ? selectedActionIndex : -1}
                    selectedCardIndex={keyboardSelectedIndex === index ? selectedCardIndex : -1}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar détail intervention */}
      {selectedIntervention && (
        <div className="fixed right-6 top-24 bottom-6 w-96 z-50">
          <InterventionDetailCard
            intervention={selectedIntervention}
            onClose={() => setSelectedIntervention(null)}
            onEdit={handleEditIntervention}
            onSendEmail={handleSendEmail}
            onCall={handleCall}
            onAddDocument={handleAddDocument}
            onStatusChange={handleStatusChange}
            onAmountChange={handleAmountChange}
            onDateChange={handleDateChange}
            onAddressChange={handleAddressChange}
            onArtisanChange={handleArtisanChange}
            onArtisanStatusChange={handleArtisanStatusChange}
            onCoutSSTChange={handleCoutSSTChange}
            onCoutMateriauxChange={handleCoutMateriauxChange}
            onCoutInterventionsChange={handleCoutInterventionsChange}
            className="h-full overflow-y-auto"
          />
        </div>
      )}


    </div>
  );
};
