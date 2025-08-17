import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, X } from 'lucide-react';
import { ARTISAN_STATUS, ARTISAN_STATUS_LABELS, ARTISAN_STATUS_COLORS } from '@/types/artisan';
import { ARTISAN_STATUS_ICONS } from './ArtisanStatusBadge';

// Configuration des couleurs pour les statuts d'artisan (similaire à celle des interventions)
const artisanStatusConfig = {
  [ARTISAN_STATUS.CANDIDAT]: { 
    color: 'bg-gray-100 text-gray-700 border-gray-200', 
    activeColor: 'bg-gray-500 text-white border-gray-500' 
  },
  [ARTISAN_STATUS.ONE_SHOT]: { 
    color: 'bg-slate-100 text-slate-700 border-slate-200', 
    activeColor: 'bg-slate-500 text-white border-slate-500' 
  },
  [ARTISAN_STATUS.POTENTIEL]: { 
    color: 'bg-sky-100 text-sky-700 border-sky-200', 
    activeColor: 'bg-sky-500 text-white border-sky-500' 
  },
  [ARTISAN_STATUS.NOVICE]: { 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200', 
    activeColor: 'bg-indigo-500 text-white border-indigo-500' 
  },
  [ARTISAN_STATUS.FORMATION]: { 
    color: 'bg-amber-100 text-amber-700 border-amber-200', 
    activeColor: 'bg-amber-500 text-white border-amber-500' 
  },
  [ARTISAN_STATUS.CONFIRME]: { 
    color: 'bg-green-100 text-green-700 border-green-200', 
    activeColor: 'bg-green-500 text-white border-green-500' 
  },
  [ARTISAN_STATUS.EXPERT]: { 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
    activeColor: 'bg-emerald-500 text-white border-emerald-500' 
  },
  [ARTISAN_STATUS.ARCHIVER]: { 
    color: 'bg-gray-100 text-gray-700 border-gray-200', 
    activeColor: 'bg-gray-500 text-white border-gray-500' 
  },
} as const;

interface ArtisanStatusFilterProps {
  selectedStatuses: ARTISAN_STATUS[];
  onStatusChange: (statuses: ARTISAN_STATUS[]) => void;
  className?: string;
}

export const ArtisanStatusFilter: React.FC<ArtisanStatusFilterProps> = ({
  selectedStatuses,
  onStatusChange,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [pinnedStatuses, setPinnedStatuses] = useState<ARTISAN_STATUS[]>([
    ARTISAN_STATUS.CANDIDAT,
    ARTISAN_STATUS.ONE_SHOT,
    ARTISAN_STATUS.POTENTIEL,
    ARTISAN_STATUS.NOVICE
  ]);

  // Statuts par défaut (toujours affichés)
  const defaultStatuses: ARTISAN_STATUS[] = [
    ARTISAN_STATUS.CANDIDAT,
    ARTISAN_STATUS.ONE_SHOT,
    ARTISAN_STATUS.POTENTIEL,
    ARTISAN_STATUS.NOVICE
  ];
  
  // Statuts supplémentaires (disponibles dans le menu)
  const additionalStatuses = Object.values(ARTISAN_STATUS).filter(
    status => !defaultStatuses.includes(status)
  );
  
  // Statuts à afficher (par défaut + épinglés)
  const displayedStatuses = [...defaultStatuses, ...pinnedStatuses.filter(s => !defaultStatuses.includes(s))];

  // Fonction pour épingler un statut
  const pinStatus = (status: ARTISAN_STATUS) => {
    if (!pinnedStatuses.includes(status)) {
      setPinnedStatuses([...pinnedStatuses, status]);
    }
  };

  // Fonction pour désépingler un statut
  const unpinStatus = (status: ARTISAN_STATUS) => {
    setPinnedStatuses(pinnedStatuses.filter(s => s !== status));
  };

  // Fonction pour basculer la sélection d'un statut
  const toggleStatus = (status: ARTISAN_STATUS) => {
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
        <span className="text-sm font-medium text-muted-foreground">Statut artisan:</span>
        
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
                const IconComponent = ARTISAN_STATUS_ICONS[status];
                const config = artisanStatusConfig[status];
                const isPinned = pinnedStatuses.includes(status);
                
                return (
                  <div key={status} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-6">
                      <IconComponent className="h-3 w-3" />
                      <span className="text-xs">{ARTISAN_STATUS_LABELS[status]}</span>
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
          const IconComponent = ARTISAN_STATUS_ICONS[status];
          const config = artisanStatusConfig[status];
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
                <IconComponent className="h-3 w-3" />
                {ARTISAN_STATUS_LABELS[status]}
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
