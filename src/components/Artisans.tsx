
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MapPin, 
  List,
  Star,
  Activity,
  Calendar,
  FileText,
  X,
  Wrench,
  ExternalLink
} from 'lucide-react';
import { ArtisansAPI, InterventionsAPI } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { useDragAndDrop } from '@/contexts/DragAndDropContext';
import { useNavigate } from 'react-router-dom';

interface Artisan {
  id: string;
  nom: string;
  specialite: string;
  statut: 'potentiel' | 'novice' | 'confirme' | 'expert';
  zone: string;
  activite_badge: 'actif' | 'moyen' | 'inactif';
  ca_mois: number;
  note_moyenne: number;
  derniere_intervention: string;
  disponible: boolean;
}

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  statut: 'en_cours' | 'demande' | 'termine' | 'bloque';
  cree: string;
  echeance: string;
  description: string;
  montant: number;
}

export const Artisans: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [searchParams] = useSearchParams();
  const { startDrag, startTouchDrag, draggedItem, isDragging, dragPosition } = useDragAndDrop();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [artisansData, interventionsData] = await Promise.all([
          ArtisansAPI.getList({}),
          InterventionsAPI.getList({ page: 1 })
        ]);
        setArtisans(artisansData.data);
        setInterventions(interventionsData.data);
        
        // Vérifier si un artisan est sélectionné via l'URL
        const selectedId = searchParams.get('selected');
        if (selectedId) {
          const artisan = artisansData.data.find((a: Artisan) => a.id === selectedId);
          if (artisan) {
            setSelectedArtisan(artisan);
          }
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Écouter les événements de filtre de recherche
  useEffect(() => {
    const handleSearchFilter = (event: CustomEvent) => {
      const { filterKey, value, page } = event.detail;
      
      if (page === '/artisans') {
        console.log(`Filtre reçu: ${filterKey} = ${value}`);
        
        // Recharger les données originales d'abord
        const loadOriginalData = async () => {
          try {
            const artisansData = await ArtisansAPI.getList({});
            const originalArtisans = artisansData.data;
            
            // Appliquer le filtre aux artisans originaux
            const filteredArtisans = originalArtisans.filter((artisan: Artisan) => {
              switch (filterKey) {
                case 'metier':
                  return artisan.specialite.toLowerCase().includes(value.toLowerCase());
                case 'ville':
                  return artisan.zone.toLowerCase().includes(value.toLowerCase());
                case 'statut':
                  return artisan.statut === value;
                case 'note':
                  return artisan.note_moyenne >= parseFloat(value);
                case 'activite':
                  return artisan.activite_badge === value;
                default:
                  return true;
              }
            });
            
            // Mettre à jour la liste filtrée
            setArtisans(filteredArtisans);
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

  const getStatutBadge = (statut: string) => {
    const statusConfig = {
      potentiel: { variant: 'outline', color: 'text-gray-600' },
      novice: { variant: 'secondary', color: 'text-blue-600' },
      confirme: { variant: 'secondary', color: 'text-green-600' },
      expert: { variant: 'secondary', color: 'text-yellow-600' }
    };

    const config = statusConfig[statut as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant as any} className={config.color}>
        {statut.charAt(0).toUpperCase() + statut.slice(1)}
      </Badge>
    );
  };

  const getActiviteBadge = (activite: string) => {
    const activityConfig = {
      actif: { variant: 'secondary', color: 'text-green-600' },
      moyen: { variant: 'secondary', color: 'text-orange-600' },
      inactif: { variant: 'destructive', color: 'text-red-600' }
    };

    const config = activityConfig[activite as keyof typeof activityConfig];
    return (
      <Badge variant={config.variant as any} className={config.color}>
        <Activity className="h-3 w-3 mr-1" />
        {activite}
      </Badge>
    );
  };

  const getStatusBadge = (statut: string) => {
    const variants = {
      'en_cours': 'bg-blue-100 text-blue-800',
      'demande': 'bg-yellow-100 text-yellow-800', 
      'termine': 'bg-green-100 text-green-800',
      'bloque': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'en_cours': 'En cours',
      'demande': 'Demande',
      'termine': 'Terminé',
      'bloque': 'Bloqué'
    };

    return (
      <Badge className={variants[statut as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[statut as keyof typeof labels] || statut}
      </Badge>
    );
  };

  const getArtisanInterventions = (artisanName: string) => {
    return interventions.filter(intervention => intervention.artisan === artisanName);
  };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredArtisans = artisans.filter(artisan =>
    artisan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Artisans</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Liste
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Carte
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un artisan..."
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

      {viewMode === 'map' ? (
        <Card>
          <CardHeader>
            <CardTitle>Localisation des artisans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Carte Leaflet avec markers artisans</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des artisans ({filteredArtisans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredArtisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedArtisan(artisan)}
                    onMouseDown={(e) => {
                      startDrag({
                        type: 'artisan',
                        id: artisan.id,
                        name: artisan.nom,
                        data: artisan
                      }, e);
                    }}
                    onTouchStart={(e) => startTouchDrag({
                      type: 'artisan',
                      id: artisan.id,
                      name: artisan.nom,
                      data: artisan
                    }, e)}
                    title="Maintenez 1 seconde pour glisser"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(artisan.nom)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{artisan.nom}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Wrench className="h-3 w-3 mr-1" />
                          {artisan.specialite} • {artisan.zone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>{getStatutBadge(artisan.statut)}</div>
                      <div>{getActiviteBadge(artisan.activite_badge)}</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="font-medium">{artisan.note_moyenne.toFixed(1)}</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
                          .format(artisan.ca_mois)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sidebar détail artisan */}
      {selectedArtisan && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Détails de l'artisan
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/artisans/${selectedArtisan.id}`)}
                title="Ouvrir en page complète"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedArtisan(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Profil</h4>
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">{getInitials(selectedArtisan.nom)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedArtisan.nom}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Wrench className="h-3 w-3 mr-1" />
                    {selectedArtisan.specialite} • {selectedArtisan.zone}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">{selectedArtisan.note_moyenne.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">/5</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>Statut:</strong> {getStatutBadge(selectedArtisan.statut)}</div>
                <div><strong>Activité:</strong> {getActiviteBadge(selectedArtisan.activite_badge)}</div>
                <div><strong>Disponibilité:</strong> {selectedArtisan.disponible ? 'Disponible' : 'Indisponible'}</div>
                <div><strong>CA mensuel:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedArtisan.ca_mois)}</div>
                <div><strong>Dernière intervention:</strong> {new Date(selectedArtisan.derniere_intervention).toLocaleDateString()}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Localisation</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Carte Maps</p>
                  <p className="text-xs text-muted-foreground">{selectedArtisan.zone}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Interventions ({getArtisanInterventions(selectedArtisan.nom).length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getArtisanInterventions(selectedArtisan.nom).map((intervention) => (
                  <div
                    key={intervention.id}
                    className="p-3 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedIntervention(intervention)}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startDrag({
                        type: 'intervention',
                        id: intervention.id,
                        name: `Intervention ${intervention.id}`,
                        data: intervention
                      }, e);
                    }}
                    onTouchStart={(e) => startTouchDrag({
                      type: 'intervention',
                      id: intervention.id,
                      name: `Intervention ${intervention.id}`,
                      data: intervention
                    }, e)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{intervention.id}</h5>
                        <p className="text-xs text-muted-foreground">{intervention.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {intervention.client}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(intervention.statut)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(intervention.cree).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Actions</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer disponibilité
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents légaux
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sidebar détail intervention */}
      {selectedIntervention && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-60" style={{ right: selectedArtisan ? '420px' : '24px' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle 
              className="cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                startDrag({
                  type: 'intervention',
                  id: selectedIntervention.id,
                  name: `Intervention ${selectedIntervention.id}`,
                  data: selectedIntervention
                }, e);
              }}
              onTouchStart={(e) => startTouchDrag({
                type: 'intervention',
                id: selectedIntervention.id,
                name: `Intervention ${selectedIntervention.id}`,
                data: selectedIntervention
              }, e)}
            >
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
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Détails</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Client:</strong> {selectedIntervention.client}</div>
                <div><strong>Artisan:</strong> {selectedIntervention.artisan}</div>
                <div><strong>Statut:</strong> {getStatusBadge(selectedIntervention.statut)}</div>
                <div><strong>Description:</strong> {selectedIntervention.description}</div>
                <div><strong>Montant:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedIntervention.montant)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dates</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Créé:</strong> {new Date(selectedIntervention.cree).toLocaleDateString()}</div>
                <div><strong>Échéance:</strong> {new Date(selectedIntervention.echeance).toLocaleDateString()}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Actions rapides</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  Modifier statut
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Contacter client
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Timeline</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Historique des étapes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
};
