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
  Settings,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/BadgeComponents';
import { ArtisanStatusFilter } from '@/components/ui/ArtisanStatusFilter';
import { ArtisanDossierStatusFilter } from '@/components/ui/ArtisanDossierStatusFilter';
import { DateRangeFilter, DateRange } from '@/components/ui/DateRangeFilter';
import { UserFilter } from '@/components/ui/UserFilter';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS, Artisan } from '@/types/artisan';
import { useDebounce } from '@/hooks/useDebounce';
import { ArtisanRealCard } from '@/components/ui/ArtisanRealCard';

// Données mock pour les interventions par artisan
const mockInterventionsByArtisan: Record<string, Record<string, number>> = {
  '1': { demande: 3, devis_envoye: 2, accepte: 8, en_cours: 2, terminee: 15, visite_technique: 1, sav: 2 },
  '2': { demande: 1, devis_envoye: 3, accepte: 5, en_cours: 1, terminee: 12, annulee: 1, stand_by: 1 },
  '3': { demande: 2, accepte: 2, terminee: 8, refuse: 1, att_acompte: 1 },
  '4': { demande: 0, en_cours: 1, terminee: 10, accepte: 3, visite_technique: 2 },
  '5': { demande: 1, terminee: 5, accepte: 1, sav: 1 },
  '6': { demande: 0, en_cours: 0, terminee: 0, accepte: 0 },
  '7': { demande: 0, terminee: 2, accepte: 1, stand_by: 1 },
  '8': { demande: 2, devis_envoye: 4, accepte: 12, en_cours: 1, terminee: 25, visite_technique: 3, sav: 1 }
};

// Données mock pour les utilisateurs assignés aux artisans
const mockUsersByArtisan: Record<string, string> = {
  '1': 'Jean Dupont',
  '2': 'Marie Martin',
  '3': 'Pierre Durand',
  '4': 'Sophie Bernard',
  '5': 'Lucas Moreau',
  '6': 'Emma Roux',
  '7': 'Thomas Leroy',
  '8': 'Julie Moreau'
};

// Données mock pour les artisans
const mockArtisans: Artisan[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    metier: 'Plombier',
    artisanStatus: ARTISAN_STATUS.EXPERT,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.COMPLET,
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    adresse: '123 Rue de la Paix, 75001 Paris',
    dateInscription: '2023-01-15',
    interventionsRealisees: 45,
    noteMoyenne: 4.8,
    disponibilite: 'Disponible'
  },
  {
    id: '2',
    name: 'Marie Martin',
    metier: 'Électricien',
    artisanStatus: ARTISAN_STATUS.CONFIRME,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.A_FINALISER,
    email: 'marie.martin@email.com',
    telephone: '06 98 76 54 32',
    adresse: '456 Avenue des Champs, 69000 Lyon',
    dateInscription: '2023-03-20',
    interventionsRealisees: 28,
    noteMoyenne: 4.6,
    disponibilite: 'En intervention'
  },
  {
    id: '3',
    name: 'Pierre Durand',
    metier: 'Menuisier',
    artisanStatus: ARTISAN_STATUS.NOVICE,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.INCOMPLET,
    email: 'pierre.durand@email.com',
    telephone: '06 55 44 33 22',
    adresse: '789 Boulevard Central, 13000 Marseille',
    dateInscription: '2024-01-10',
    interventionsRealisees: 12,
    noteMoyenne: 4.2,
    disponibilite: 'Disponible'
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    metier: 'Peintre',
    artisanStatus: ARTISAN_STATUS.FORMATION,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.COMPLET,
    email: 'sophie.bernard@email.com',
    telephone: '06 11 22 33 44',
    adresse: '321 Rue du Commerce, 44000 Nantes',
    dateInscription: '2023-08-05',
    interventionsRealisees: 18,
    noteMoyenne: 4.4,
    disponibilite: 'Disponible'
  },
  {
    id: '5',
    name: 'Lucas Moreau',
    metier: 'Chauffagiste',
    artisanStatus: ARTISAN_STATUS.POTENTIEL,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.A_FINALISER,
    email: 'lucas.moreau@email.com',
    telephone: '06 99 88 77 66',
    adresse: '654 Place de la République, 31000 Toulouse',
    dateInscription: '2023-11-12',
    interventionsRealisees: 8,
    noteMoyenne: 4.0,
    disponibilite: 'En formation'
  },
  {
    id: '6',
    name: 'Emma Roux',
    metier: 'Carreleur',
    artisanStatus: ARTISAN_STATUS.CANDIDAT,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.INCOMPLET,
    email: 'emma.roux@email.com',
    telephone: '06 77 66 55 44',
    adresse: '987 Rue de la Liberté, 59000 Lille',
    dateInscription: '2024-02-01',
    interventionsRealisees: 0,
    noteMoyenne: 0,
    disponibilite: 'En attente'
  },
  {
    id: '7',
    name: 'Thomas Leroy',
    metier: 'Serrurier',
    artisanStatus: ARTISAN_STATUS.ONE_SHOT,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.COMPLET,
    email: 'thomas.leroy@email.com',
    telephone: '06 33 44 55 66',
    adresse: '147 Avenue Victor Hugo, 21000 Dijon',
    dateInscription: '2023-06-18',
    interventionsRealisees: 3,
    noteMoyenne: 4.5,
    disponibilite: 'Disponible'
  },
  {
    id: '8',
    name: 'Julie Petit',
    metier: 'Vitrier',
    artisanStatus: ARTISAN_STATUS.EXPERT,
    artisanDossierStatus: ARTISAN_DOSSIER_STATUS.COMPLET,
    email: 'julie.petit@email.com',
    telephone: '06 88 99 00 11',
    adresse: '258 Rue de la Gare, 35000 Rennes',
    dateInscription: '2022-09-25',
    interventionsRealisees: 67,
    noteMoyenne: 4.9,
    disponibilite: 'En intervention'
  }
];

// Configuration des statuts d'artisan avec icônes et couleurs
const artisanStatusConfig = {
  [ARTISAN_STATUS.CANDIDAT]: { 
    label: 'Candidat', 
    icon: User, 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    activeColor: 'bg-gray-500 text-white'
  },
  [ARTISAN_STATUS.ONE_SHOT]: { 
    label: 'One shot', 
    icon: Clock, 
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    activeColor: 'bg-slate-500 text-white'
  },
  [ARTISAN_STATUS.POTENTIEL]: { 
    label: 'Potentiel', 
    icon: Play, 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    activeColor: 'bg-blue-500 text-white'
  },
  [ARTISAN_STATUS.NOVICE]: { 
    label: 'Novice', 
    icon: User, 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    activeColor: 'bg-indigo-500 text-white'
  },
  [ARTISAN_STATUS.FORMATION]: { 
    label: 'Formation', 
    icon: Settings, 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    activeColor: 'bg-yellow-500 text-white'
  },
  [ARTISAN_STATUS.CONFIRME]: { 
    label: 'Confirmé', 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-700 border-green-200',
    activeColor: 'bg-green-500 text-white'
  },
  [ARTISAN_STATUS.EXPERT]: { 
    label: 'Expert', 
    icon: CheckCircle, 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    activeColor: 'bg-emerald-500 text-white'
  },
  [ARTISAN_STATUS.ARCHIVER]: { 
    label: 'Archivé', 
    icon: FileText, 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    activeColor: 'bg-gray-500 text-white'
  }
};

// Configuration des statuts de dossier
const dossierStatusConfig = {
  [ARTISAN_DOSSIER_STATUS.INCOMPLET]: { 
    label: 'Incomplet', 
    color: 'bg-red-100 text-red-700 border-red-200',
    activeColor: 'bg-red-500 text-white'
  },
  [ARTISAN_DOSSIER_STATUS.A_FINALISER]: { 
    label: 'À finaliser', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    activeColor: 'bg-orange-500 text-white'
  },
  [ARTISAN_DOSSIER_STATUS.COMPLET]: { 
    label: 'Complet', 
    color: 'bg-green-100 text-green-700 border-green-200',
    activeColor: 'bg-green-500 text-white'
  }
};

// Configuration des statuts d'interventions avec icônes et couleurs
  const interventionStatusConfig = {
    demande: { 
      label: 'Demandé', 
      icon: Clock, 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      activeColor: 'bg-blue-500 text-white'
    },
    devis_envoye: { 
      label: 'Devis Envoyé', 
      icon: FileText, 
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      activeColor: 'bg-purple-500 text-white'
    },
    accepte: { 
      label: 'Accepté', 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-700 border-green-200',
      activeColor: 'bg-green-500 text-white'
    },
    en_cours: { 
      label: 'Inter en cours', 
      icon: Play, 
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      activeColor: 'bg-orange-500 text-white'
    },
    annulee: { 
      label: 'Annulé', 
      icon: Clock, 
      color: 'bg-red-100 text-red-700 border-red-200',
      activeColor: 'bg-red-500 text-white'
    },
    terminee: { 
      label: 'Inter terminée', 
      icon: CheckCircle, 
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      activeColor: 'bg-emerald-500 text-white'
    },
    visite_technique: { 
      label: 'Visite Technique', 
      icon: Clock, 
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      activeColor: 'bg-indigo-500 text-white'
    },
    refuse: { 
      label: 'Refusé', 
      icon: Clock, 
      color: 'bg-red-100 text-red-700 border-red-200',
      activeColor: 'bg-red-500 text-white'
    },
    stand_by: { 
      label: 'STAND BY', 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      activeColor: 'bg-yellow-500 text-white'
    },
    sav: { 
      label: 'SAV', 
      icon: Clock, 
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      activeColor: 'bg-pink-500 text-white'
    },
    att_acompte: { 
      label: 'Att Acompte', 
      icon: Clock, 
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      activeColor: 'bg-cyan-500 text-white'
    }
  };

export const ArtisansReal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // États pour les filtres
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedArtisanStatus, setSelectedArtisanStatus] = useState<ARTISAN_STATUS | ''>('');
  const [selectedDossierStatus, setSelectedDossierStatus] = useState<ARTISAN_DOSSIER_STATUS | ''>('');
  const [selectedMetier, setSelectedMetier] = useState<string>('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [pinnedStatuses, setPinnedStatuses] = useState<string[]>([]);
  
  // États pour les filtres épinglables
  const [pinnedFilters, setPinnedFilters] = useState<{
    artisanStatus: boolean;
    dossierStatus: boolean;
    metier: boolean;
  }>({
    artisanStatus: false,
    dossierStatus: false,
    metier: false
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // États pour la recherche et pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const itemsPerPage = 10;

  // États pour la navigation au clavier
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState<number>(-1);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number>(-1);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrer les artisans selon les critères
  const filteredArtisans = mockArtisans.filter(artisan => {
    const matchesSearch = !debouncedSearchTerm || 
      artisan.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      artisan.metier.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      artisan.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesArtisanStatus = !selectedArtisanStatus || artisan.artisanStatus === selectedArtisanStatus;
    const matchesDossierStatus = !selectedDossierStatus || artisan.artisanDossierStatus === selectedDossierStatus;
    const matchesMetier = !selectedMetier || artisan.metier === selectedMetier;
    const matchesUser = !selectedUser || mockUsersByArtisan[artisan.id] === selectedUser;
    
    return matchesSearch && matchesArtisanStatus && matchesDossierStatus && matchesMetier && matchesUser;
  });

  // Pagination
  const total = filteredArtisans.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtisans = filteredArtisans.slice(startIndex, endIndex);

  // Obtenir les métiers uniques
  const uniqueMetiers = Array.from(new Set(mockArtisans.map(a => a.metier)));

  // Obtenir les utilisateurs uniques
  const uniqueUsers = Array.from(new Set(Object.values(mockUsersByArtisan)));

  // Fonction pour calculer le nombre d'artisans par statut
  const getArtisanCountByStatus = (status: ARTISAN_STATUS | '') => {
    if (status === '') {
      return mockArtisans.length;
    }
    return mockArtisans.filter(artisan => artisan.artisanStatus === status).length;
  };

  // Fonction pour calculer le nombre d'artisans par statut de dossier
  const getArtisanCountByDossierStatus = (status: ARTISAN_DOSSIER_STATUS | '') => {
    if (status === '') {
      return mockArtisans.length;
    }
    return mockArtisans.filter(artisan => artisan.artisanDossierStatus === status).length;
  };

  // Fonction pour calculer le nombre d'artisans par métier
  const getArtisanCountByMetier = (metier: string) => {
    if (metier === '') {
      return mockArtisans.length;
    }
    return mockArtisans.filter(artisan => artisan.metier === metier).length;
  };

  // Handlers pour les actions
  const handleEditArtisan = (artisan: Artisan) => {
    console.log('Modifier artisan:', artisan.id);
  };

  const handleSendEmail = (artisan: Artisan) => {
    console.log('Envoi email pour:', artisan.id);
    window.open(`mailto:${artisan.email}`);
  };

  const handleCall = (artisan: Artisan) => {
    console.log('Appel pour:', artisan.id);
    window.open(`tel:${artisan.telephone}`);
  };

  const handleAddDocument = (artisan: Artisan) => {
    console.log('Ajout document pour:', artisan.id);
  };

  const handleViewProfile = (artisan: Artisan) => {
    console.log('Voir profil pour:', artisan.id);
    // La carte s'ouvre maintenant directement au clic, pas besoin de sidebar
  };

  // Handlers pour les modifications
  const handleStatusChange = (artisan: Artisan, newStatus: ARTISAN_STATUS) => {
    console.log('Changement statut pour:', artisan.id, 'vers:', newStatus);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  const handleDossierStatusChange = (artisan: Artisan, newStatus: ARTISAN_DOSSIER_STATUS) => {
    console.log('Changement statut dossier pour:', artisan.id, 'vers:', newStatus);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  const handleMetierChange = (artisan: Artisan, metier: string) => {
    console.log('Changement métier pour:', artisan.id, 'vers:', metier);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  const handleEmailChange = (artisan: Artisan, email: string) => {
    console.log('Changement email pour:', artisan.id, 'vers:', email);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  const handleTelephoneChange = (artisan: Artisan, telephone: string) => {
    console.log('Changement téléphone pour:', artisan.id, 'vers:', telephone);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  const handleAdresseChange = (artisan: Artisan, adresse: string) => {
    console.log('Changement adresse pour:', artisan.id, 'vers:', adresse);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  const handleDisponibiliteChange = (artisan: Artisan, disponibilite: string) => {
    console.log('Changement disponibilité pour:', artisan.id, 'vers:', disponibilite);
    // Ici vous pouvez implémenter la mise à jour via API
  };

  // Navigation au clavier
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setKeyboardSelectedIndex(prev => 
        prev < paginatedArtisans.length - 1 ? prev + 1 : prev
      );
      setSelectedActionIndex(-1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setKeyboardSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      setSelectedActionIndex(-1);
    } else if (event.key === 'ArrowLeft' && keyboardSelectedIndex >= 0) {
      event.preventDefault();
      setSelectedActionIndex(prev => prev > 0 ? prev - 1 : 2);
    } else if (event.key === 'ArrowRight' && keyboardSelectedIndex >= 0) {
      event.preventDefault();
      setSelectedActionIndex(prev => prev < 2 ? prev + 1 : 0);
    } else if (event.key === 'Enter' && keyboardSelectedIndex >= 0) {
      event.preventDefault();
      if (selectedActionIndex >= 0) {
        // Exécuter l'action sélectionnée
        const artisan = paginatedArtisans[keyboardSelectedIndex];
        switch (selectedActionIndex) {
          case 0:
            handleSendEmail(artisan);
            break;
          case 1:
            handleCall(artisan);
            break;
          case 2:
            handleAddDocument(artisan);
            break;
        }
      } else {
        handleViewProfile(paginatedArtisans[keyboardSelectedIndex]);
      }
          } else if (event.key === 'Escape') {
        setKeyboardSelectedIndex(-1);
        setSelectedActionIndex(-1);
      }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardSelectedIndex, paginatedArtisans]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedArtisanStatus, selectedDossierStatus, selectedMetier, debouncedSearchTerm]);

  return (
    <div className="space-y-6 p-6">
      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Première ligne : Filtres compacts */}
            <div className="flex items-center space-x-6">
              {/* Filtres utilisateur et métier côte à côte */}
              <div className="flex items-center space-x-2">
                <UserFilter
                  selectedUser={selectedUser}
                  onUserChange={setSelectedUser}
                  users={uniqueUsers}
                />

                {/* Filtre par métier */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Métier:</span>
                  <select
                    value={selectedMetier}
                    onChange={(e) => setSelectedMetier(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Tous</option>
                    {uniqueMetiers.map(metier => (
                      <option key={metier} value={metier}>
                        {metier} ({getArtisanCountByMetier(metier)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bouton pour réinitialiser les filtres */}
              {(selectedUser || selectedArtisanStatus || selectedDossierStatus || selectedMetier) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser('');
                    setSelectedArtisanStatus('');
                    setSelectedDossierStatus('');
                    setSelectedMetier('');
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Deuxième ligne : Filtres de statut */}
            <div className="flex items-center space-x-6">
              {/* Filtre par statut d'artisan */}
              <ArtisanStatusFilter
                selectedStatuses={selectedArtisanStatus ? [selectedArtisanStatus] : []}
                onStatusChange={(statuses) => setSelectedArtisanStatus(statuses.length > 0 ? statuses[0] : '')}
                className="flex-1"
              />

              {/* Filtre par statut de dossier */}
              <ArtisanDossierStatusFilter
                selectedStatuses={selectedDossierStatus ? [selectedDossierStatus] : []}
                onStatusChange={(statuses) => setSelectedDossierStatus(statuses.length > 0 ? statuses[0] : '')}
                className="flex-1"
              />
            </div>
            
            {/* Export CSV et icônes */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des artisans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span>Liste des Artisans</span>
              {selectedArtisanStatus && (
                <Badge className={artisanStatusConfig[selectedArtisanStatus].color}>
                  {artisanStatusConfig[selectedArtisanStatus].label}
                </Badge>
              )}
              {selectedDossierStatus && (
                <Badge className={dossierStatusConfig[selectedDossierStatus].color}>
                  {dossierStatusConfig[selectedDossierStatus].label}
                </Badge>
              )}
              {selectedMetier && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {selectedMetier}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {total} artisan{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paginatedArtisans.map((artisan, index) => (
              <div
                key={artisan.id}
                data-artisan-index={index}
                className={`
                  transition-all duration-200 rounded-lg p-1 relative
                  ${keyboardSelectedIndex === index 
                    ? 'bg-primary/10 shadow-lg scale-[1.02]' 
                    : 'hover:bg-muted/50'
                  }
                `}
                onClick={() => handleViewProfile(artisan)}
              >
                {keyboardSelectedIndex === index && (
                  <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                    Sélectionné
                  </div>
                )}
                <ArtisanRealCard
                  artisan={artisan}
                  interventions={mockInterventionsByArtisan[artisan.id]}
                  assignedUser={mockUsersByArtisan[artisan.id]}
                  onEdit={handleEditArtisan}
                  onSendEmail={handleSendEmail}
                  onCall={handleCall}
                  onAddDocument={handleAddDocument}
                  onStatusChange={handleStatusChange}
                  onDossierStatusChange={handleDossierStatusChange}
                  onMetierChange={handleMetierChange}
                  onEmailChange={handleEmailChange}
                  onTelephoneChange={handleTelephoneChange}
                  onAdresseChange={handleAdresseChange}
                  onDisponibiliteChange={handleDisponibiliteChange}
                  hideBorder={keyboardSelectedIndex === index}
                  keyboardHovered={keyboardSelectedIndex === index}
                  selectedActionIndex={keyboardSelectedIndex === index ? selectedActionIndex : -1}
                  selectedCardIndex={keyboardSelectedIndex === index ? selectedCardIndex : -1}
                />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {total > 0 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-600">
                Affichage de {startIndex + 1} à {Math.min(endIndex, total)} sur {total} artisans
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, Math.ceil(total / itemsPerPage)) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {Math.ceil(total / itemsPerPage) > 5 && (
                    <span className="text-sm text-gray-500">...</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(Math.ceil(total / itemsPerPage), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(total / itemsPerPage)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};
