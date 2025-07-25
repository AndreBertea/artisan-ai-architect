
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { InterventionsAPI } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { useDragAndDrop } from '@/contexts/DragAndDropContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  statut: 'demande' | 'en_cours' | 'termine' | 'bloque';
  cree: string;
  echeance: string;
  description: string;
}

export const Interventions: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [searchParams] = useSearchParams();
  const { startDrag, startTouchDrag, draggedItem, isDragging, dragPosition } = useDragAndDrop();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loadInterventions = async () => {
      try {
        const data = await InterventionsAPI.getList({ page: 1 });
        setInterventions(data.data);
        
        // Vérifier si une intervention est sélectionnée via l'URL
        const selectedId = searchParams.get('selected');
        if (selectedId) {
          const intervention = data.data.find((i: Intervention) => i.id === selectedId);
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
            const data = await InterventionsAPI.getList({ page: 1 });
            const originalInterventions = data.data;
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

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      demande: { variant: 'secondary', icon: Clock, color: 'text-blue-600' },
      en_cours: { variant: 'secondary', icon: AlertCircle, color: 'text-orange-600' },
      termine: { variant: 'secondary', icon: CheckCircle, color: 'text-green-600' },
      bloque: { variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    };

    const config = statusConfig[statut as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {statut.charAt(0).toUpperCase() + statut.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const filteredInterventions = interventions.filter(intervention =>
    intervention.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.artisan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Interventions
          <Button size="icon" variant="outline" className="ml-2" onClick={() => setShowAddModal(true)} title="Ajouter une intervention">
            <Plus className="h-5 w-5" />
          </Button>
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      {/* Modal d'ajout d'intervention */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle intervention</DialogTitle>
            <DialogDescription>
              (Formulaire à compléter...)
            </DialogDescription>
          </DialogHeader>
          {/* Formulaire à venir */}
        </DialogContent>
      </Dialog>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une intervention..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des interventions ({filteredInterventions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInterventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedIntervention(intervention)}
                  onMouseDown={(e) => {
                    startDrag({
                      type: 'intervention',
                      id: intervention.id,
                      name: `Intervention ${intervention.id}`,
                      data: intervention
                    }, e);
                  }}
                  onTouchStart={(e) => {
                    startTouchDrag({
                      type: 'intervention',
                      id: intervention.id,
                      name: `Intervention ${intervention.id}`,
                      data: intervention
                    }, e);
                  }}
                  title="Maintenez 1 seconde pour glisser"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="font-medium text-sm">#{intervention.id}</div>
                    <div className="flex-1">
                      <div className="font-medium">{intervention.client}</div>
                      <div className="text-sm text-muted-foreground">{intervention.description}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{intervention.artisan}</div>
                    <div>{getStatusBadge(intervention.statut)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(intervention.cree).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar détail intervention */}
      {selectedIntervention && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Intervention #{selectedIntervention.id}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/interventions/${selectedIntervention.id}`)}
                title="Ouvrir en page complète"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedIntervention(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Détails</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Client:</strong> {selectedIntervention.client}</div>
                <div><strong>Artisan:</strong> {selectedIntervention.artisan}</div>
                <div><strong>Statut:</strong> {getStatusBadge(selectedIntervention.statut)}</div>
                <div><strong>Créé:</strong> {new Date(selectedIntervention.cree).toLocaleDateString()}</div>
                <div><strong>Échéance:</strong> {new Date(selectedIntervention.echeance).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Actions rapides</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  Passer en cours
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Générer mail artisan
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Timeline</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Timeline des étapes</p>
              </div>
            </div>
          </CardContent>
        </Card>
              )}


    </div>
  );
};
