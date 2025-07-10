
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  List,
  Star,
  Activity,
  Calendar,
  FileText
} from 'lucide-react';
import { ArtisansAPI } from '@/services/api';

interface Artisan {
  id: string;
  nom: string;
  statut: 'potentiel' | 'novice' | 'confirme' | 'expert';
  zone: string;
  activite_badge: 'actif' | 'moyen' | 'inactif';
  ca_mois: number;
  note_moyenne: number;
  derniere_intervention: string;
}

export const Artisans: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  useEffect(() => {
    const loadArtisans = async () => {
      try {
        const data = await ArtisansAPI.getList({});
        setArtisans(data.data);
      } catch (error) {
        console.error('Erreur chargement artisans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtisans();
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

  const filteredArtisans = artisans.filter(artisan =>
    artisan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.zone.toLowerCase().includes(searchTerm.toLowerCase())
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
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="font-medium">{artisan.nom}</div>
                      <div>{getStatutBadge(artisan.statut)}</div>
                      <div className="text-sm text-muted-foreground">{artisan.zone}</div>
                      <div>{getActiviteBadge(artisan.activite_badge)}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {artisan.note_moyenne}/5
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

      {/* Fiche artisan détaillée */}
      {selectedArtisan && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{selectedArtisan.nom}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedArtisan(null)}
            >
              ×
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Profil</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Statut:</strong> {getStatutBadge(selectedArtisan.statut)}</div>
                <div><strong>Zone:</strong> {selectedArtisan.zone}</div>
                <div><strong>Activité:</strong> {getActiviteBadge(selectedArtisan.activite_badge)}</div>
                <div><strong>Note:</strong> {selectedArtisan.note_moyenne}/5 ⭐</div>
                <div><strong>CA mois:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedArtisan.ca_mois)}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Actions</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer absences
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents légaux
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Historique récent</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Dernières interventions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
