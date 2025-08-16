import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, X } from 'lucide-react';
import { ARTISAN_DOSSIER_STATUS, ARTISAN_DOSSIER_LABELS, ARTISAN_DOSSIER_COLORS } from '@/types/artisan';

// Configuration des couleurs pour les statuts de dossier
const dossierStatusConfig = {
  [ARTISAN_DOSSIER_STATUS.INCOMPLET]: { 
    color: 'bg-red-100 text-red-700 border-red-200', 
    activeColor: 'bg-red-500 text-white border-red-500' 
  },
  [ARTISAN_DOSSIER_STATUS.A_FINALISER]: { 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
    activeColor: 'bg-yellow-500 text-white border-yellow-500' 
  },
  [ARTISAN_DOSSIER_STATUS.COMPLET]: { 
    color: 'bg-green-100 text-green-700 border-green-200', 
    activeColor: 'bg-green-500 text-white border-green-500' 
  },
} as const;

interface ArtisanDossierStatusFilterProps {
  selectedStatuses: ARTISAN_DOSSIER_STATUS[];
  onStatusChange: (statuses: ARTISAN_DOSSIER_STATUS[]) => void;
  className?: string;
}

export const ArtisanDossierStatusFilter: React.FC<ArtisanDossierStatusFilterProps> = ({
  selectedStatuses,
  onStatusChange,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [pinnedStatuses, setPinnedStatuses] = useState<ARTISAN_DOSSIER_STATUS[]>([
    ARTISAN_DOSSIER_STATUS.INCOMPLET,
    ARTISAN_DOSSIER_STATUS.A_FINALISER,
    ARTISAN_DOSSIER_STATUS.COMPLET
  ]);

  // Statuts par défaut (toujours affichés)
  const defaultStatuses: ARTISAN_DOSSIER_STATUS[] = [
    ARTISAN_DOSSIER_STATUS.INCOMPLET,
    ARTISAN_DOSSIER_STATUS.A_FINALISER,
    ARTISAN_DOSSIER_STATUS.COMPLET
  ];
  
  // Statuts supplémentaires (disponibles dans le menu)
  const additionalStatuses = Object.values(ARTISAN_DOSSIER_STATUS).filter(
    status => !defaultStatuses.includes(status)
  );
  
  // Statuts à afficher (par défaut + épinglés)
  const displayedStatuses = [...defaultStatuses, ...pinnedStatuses.filter(s => !defaultStatuses.includes(s))];

  // Fonction pour épingler un statut
  const pinStatus = (status: ARTISAN_DOSSIER_STATUS) => {
    if (!pinnedStatuses.includes(status)) {
      setPinnedStatuses([...pinnedStatuses, status]);
    }
  };

  // Fonction pour désépingler un statut
  const unpinStatus = (status: ARTISAN_DOSSIER_STATUS) => {
    setPinnedStatuses(pinnedStatuses.filter(s => s !== status));
  };

  // Fonction pour basculer la sélection d'un statut
  const toggleStatus = (status: ARTISAN_DOSSIER_STATUS) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    onStatusChange([]);
    setPinnedStatuses(defaultStatuses);
  };

  return (
    <div className={`flex items-center space-x-6 ${className}`}>
      <div className="flex items-center space-x-2" style={{ paddingLeft: '250px' }}>
        <span className="text-sm font-medium text-muted-foreground">Statut dossier:</span>
        
        {/* Menu des paramètres */}
        <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Settings className="h-3 w-3 text-muted-foreground hover:text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="text-xs font-medium text-gray-600 mb-3 px-2">Ajouter des statuts</div>
            <div className="space-y-1">
              {additionalStatuses.map(status => {
                const config = dossierStatusConfig[status];
                const isPinned = pinnedStatuses.includes(status);
                
                return (
                  <div key={status} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === ARTISAN_DOSSIER_STATUS.INCOMPLET ? 'bg-red-500' :
                        status === ARTISAN_DOSSIER_STATUS.A_FINALISER ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <span className="text-xs">{ARTISAN_DOSSIER_LABELS[status]}</span>
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
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Bouton "Tous" */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange([])}
          className={`
            text-xs flex items-center gap-1.5 px-3 py-1.5
            ${selectedStatuses.length === 0 ? 'bg-gray-500 text-white border-gray-500' : 'bg-gray-100 text-gray-700 border-gray-200'}
          `}
        >
          Tous
        </Button>
        
        {/* Statuts affichés */}
        {displayedStatuses.map(status => {
          const config = dossierStatusConfig[status];
          const isSelected = selectedStatuses.includes(status);
          const isPinned = pinnedStatuses.includes(status);
          
          return (
            <div key={status} className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleStatus(status)}
                className={`
                  text-xs flex items-center gap-1.5 px-3 py-1.5
                  ${isSelected ? config.activeColor : config.color}
                  ${isSelected ? 'border-2' : 'border'}
                `}
              >
                <div className={`w-2 h-2 rounded-full ${
                  status === ARTISAN_DOSSIER_STATUS.INCOMPLET ? 'bg-red-500' :
                  status === ARTISAN_DOSSIER_STATUS.A_FINALISER ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                {ARTISAN_DOSSIER_LABELS[status]}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Bouton pour réinitialiser les filtres */}
      {(selectedStatuses.length > 0 || pinnedStatuses.length > defaultStatuses.length) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
};
