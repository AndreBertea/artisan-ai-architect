import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useSearch } from '../hooks/useSearch';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiAnswerModal } from '../../ai/pages/AiAnswerModal';
import { aiApi } from '../../ai/ai.api';
import { useDragAndDrop } from '@/contexts/DragAndDropContext';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { results, isLoading, search } = useSearch();
  const { startDrag, draggedItem, isDragging, dragPosition } = useDragAndDrop();

  // Filtres disponibles par page
  const getAvailableFilters = () => {
    const path = location.pathname;
    
    if (path === '/artisans') {
      return [
        { key: 'metier', label: 'Métier', placeholder: 'Ex: Électricien, Plombier, Menuisier, Peintre' },
        { key: 'ville', label: 'Zone', placeholder: 'Ex: Paris 15e, Boulogne, Issy-les-Moulineaux' },
        { key: 'statut', label: 'Statut', placeholder: 'Ex: potentiel, novice, confirme, expert' },
        { key: 'note', label: 'Note', placeholder: 'Ex: 3.9, 4.1, 4.3, 4.8' },
        { key: 'activite', label: 'Activité', placeholder: 'Ex: actif, moyen, inactif' }
      ];
    }
    
    return [];
  };

  const getFilterValues = (filterKey: string) => {
    const path = location.pathname;
    
    if (path === '/artisans') {
      switch (filterKey) {
        case 'metier':
          return ['Électricien', 'Plombier', 'Menuisier', 'Peintre'];
        case 'ville':
          return ['Paris 15e', 'Boulogne', 'Issy-les-Moulineaux', 'Vanves'];
        case 'statut':
          return ['potentiel', 'novice', 'confirme', 'expert'];
        case 'activite':
          return ['actif', 'moyen', 'inactif'];
        case 'note':
          return ['3.9', '4.0', '4.1', '4.3', '4.8'];
        default:
          return [];
      }
    }
    
    return [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      // Vérifier si c'est une requête IA (commence par /)
      if (query.startsWith('/')) {
        setIsOpen(false);
        setFilterMode(false);
      } 
      // Vérifier si c'est un filtre (commence par :)
      else if (query.startsWith(':')) {
        setFilterMode(true);
        setIsOpen(true);
        
        // Analyser le filtre
        const filterParts = query.slice(1).split(':');
        if (filterParts.length === 1) {
          // Premier niveau : sélection du filtre
          setSelectedFilter('');
          setFilterValue('');
        } else if (filterParts.length === 2) {
          // Deuxième niveau : sélection de la valeur
          setSelectedFilter(filterParts[0]);
          setFilterValue(filterParts[1]);
        }
      } else {
        // Recherche normale
        setFilterMode(false);
        search(query);
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
      setFilterMode(false);
      setSelectedFilter('');
      setFilterValue('');
    }
  }, [query, search]);

  const handleAiQuery = async (aiQuery: string) => {
    setAiLoading(true);
    setAiModalOpen(true);
    setIsOpen(false);
    
    try {
      const response = await aiApi.query({ query: aiQuery });
      setAiAnswer(response.answer);
    } catch (error) {
      setAiAnswer('Désolé, une erreur est survenue lors de la requête IA.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.startsWith('/')) {
      e.preventDefault();
      handleAiQuery(query.slice(1));
    }
  };

  const handleFilterSelect = (filterKey: string) => {
    setQuery(`:${filterKey}:`);
    setSelectedFilter(filterKey);
    setFilterValue('');
    inputRef.current?.focus();
  };

  const handleFilterValueSelect = (value: string) => {
    const newQuery = `:${selectedFilter}:${value}`;
    setQuery(newQuery);
    setFilterValue(value);
    
    // Appliquer le filtre
    applyFilter(selectedFilter, value);
    
    // Fermer le popover après un délai
    setTimeout(() => {
      setIsOpen(false);
      setFilterMode(false);
    }, 500);
  };

  const applyFilter = (filterKey: string, value: string) => {
    // Ici on appliquerait le filtre à la page actuelle
    // Pour l'instant, on simule avec un console.log
    console.log(`Filtre appliqué: ${filterKey} = ${value}`);
    
    // Envoyer un événement personnalisé pour que la page puisse réagir
    const event = new CustomEvent('searchFilter', {
      detail: { filterKey, value, page: location.pathname }
    });
    window.dispatchEvent(event);
  };

  const handleResultClick = (result: any) => {
    setIsOpen(false);
    setQuery('');
    
    // Navigation vers la page correspondante avec l'ID en paramètre
    switch (result.type) {
      case 'artisan':
        navigate(`/artisans?selected=${result.id}`);
        break;
      case 'intervention':
        navigate(`/interventions?selected=${result.id}`);
        break;
      case 'client':
        navigate(`/clients?selected=${result.id}`);
        break;
      case 'notif':
        navigate(`/notifications?selected=${result.id}`);
        break;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'artisan': return 'Artisans';
      case 'intervention': return 'Interventions';
      case 'client': return 'Clients';
      case 'notif': return 'Notifications';
      default: return type;
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full max-w-2xl min-w-[40%]">
            {query.startsWith('/') ? (
              <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary z-10" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            )}
            <Input
              ref={inputRef}
              type="search"
              placeholder="Recherche globale (Ctrl+K), / pour IA, : pour filtres..."
              className="pl-10 w-full rounded-md focus:ring-2 focus:ring-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (query.trim() && !query.startsWith('/')) {
                  setIsOpen(true);
                }
              }}
              onBlur={(e) => {
                // Ne pas fermer le popover si on clique à l'intérieur
                if (e.relatedTarget && e.relatedTarget.closest('[data-radix-popper-content-wrapper]')) {
                  e.preventDefault();
                  inputRef.current?.focus();
                }
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="center" 
          side="bottom" 
          sideOffset={4}
          onOpenAutoFocus={(e) => {
            // Empêcher le focus automatique sur le popover
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <div className="max-h-96 overflow-y-auto">
            {filterMode ? (
              // Mode filtres
              <div>
                {!selectedFilter ? (
                  // Sélection du filtre
                  <div>
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50">
                      Filtres disponibles
                    </div>
                    {getAvailableFilters().map((filter) => (
                      <Button
                        key={filter.key}
                        variant="ghost"
                        className="w-full justify-start rounded-none h-auto p-3 hover:bg-accent/50"
                        onClick={() => handleFilterSelect(filter.key)}
                      >
                        <div className="text-left">
                          <div className="font-medium">:{filter.key}</div>
                          <div className="text-sm text-muted-foreground">
                            {filter.placeholder}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  // Sélection de la valeur
                  <div>
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50">
                      Valeurs pour :{selectedFilter}
                    </div>
                    {getFilterValues(selectedFilter).map((value) => (
                      <Button
                        key={value}
                        variant="ghost"
                        className="w-full justify-start rounded-none h-auto p-3 hover:bg-accent/50"
                        onClick={() => handleFilterValueSelect(value)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{value}</div>
                        </div>
                      </Button>
                    ))}
                    {getFilterValues(selectedFilter).length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        Tapez une valeur personnalisée
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Recherche en cours...</span>
              </div>
            ) : Object.keys(groupedResults).length > 0 ? (
              <div>
                {Object.entries(groupedResults).map(([type, typeResults]) => (
                  <div key={type}>
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50">
                      {getTypeLabel(type)}
                    </div>
                    {typeResults.slice(0, 10).map((result) => (
                      <Button
                        key={result.id}
                        variant="ghost"
                        className="w-full justify-start rounded-none h-auto p-3 cursor-grab active:cursor-grabbing hover:bg-accent/50"
                        onClick={() => handleResultClick(result)}
                        onMouseDown={(e) => {
                          // Empêcher la perte de focus lors du clic
                          e.preventDefault();
                          
                          // Démarrer le drag
                          startDrag({
                            type: result.type,
                            id: result.id,
                            name: result.label,
                            data: result
                          }, e);
                        }}
                        title="Maintenez 1 seconde pour glisser"
                      >
                        <div className="text-left">
                          <div className="font-medium">{result.label}</div>
                          {result.description && (
                            <div className="text-sm text-muted-foreground">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            ) : query.trim() && !query.startsWith('/') && !query.startsWith(':') ? (
              <div className="p-4 text-center text-muted-foreground">
                Aucun résultat trouvé
              </div>
            ) : query.startsWith('/') ? (
              <div className="p-4 text-center text-muted-foreground">
                Appuyez sur Entrée pour interroger l'IA
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    
      <AiAnswerModal
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setQuery('');
        }}
        answer={aiAnswer}
        isLoading={aiLoading}
      />


    </>
  );
}; 