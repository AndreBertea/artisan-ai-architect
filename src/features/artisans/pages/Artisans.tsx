import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Map, List, Filter } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import * as artisansApi from '@/services/artisans.api';

const statusColors = {
  'Potentiel': 'bg-gray-100 text-gray-800',
  'Novice': 'bg-blue-100 text-blue-800',
  'Confirmé': 'bg-green-100 text-green-800',
  'Expert': 'bg-yellow-100 text-yellow-800'
};

const activityColors = {
  'Actif': 'bg-green-100 text-green-800',
  'Moyen': 'bg-orange-100 text-orange-800',
  'Inactif': 'bg-red-100 text-red-800'
};

export const Artisans = () => {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<any>(null);
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadArtisans = async () => {
      const data = await artisansApi.getArtisans();
      setArtisans(data.data);
    };
    loadArtisans();
  }, []);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher artisans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ToggleGroup type="single" value={view} onValueChange={setView}>
          <ToggleGroupItem value="list">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="map">
            <Map className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Vue principale */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Artisans ({artisans.length})
              {view === 'map' && ' - Vue carte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {view === 'map' ? (
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">[Carte Leaflet à intégrer]</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Activité</TableHead>
                    <TableHead>CA/mois</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artisans.map((artisan) => (
                    <TableRow 
                      key={artisan.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedArtisan(artisan)}
                    >
                      <TableCell className="font-medium">{artisan.nom}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[artisan.statut as keyof typeof statusColors]}>
                          {artisan.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>{artisan.zone}</TableCell>
                      <TableCell>
                        <Badge className={activityColors[artisan.activite as keyof typeof activityColors]}>
                          {artisan.activite}
                        </Badge>
                      </TableCell>
                      <TableCell>{artisan.ca_mois}€</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sidebar artisan */}
        {selectedArtisan && (
          <Card className="w-96">
            <CardHeader>
              <CardTitle>{selectedArtisan.nom}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Statut</h4>
                <Badge className={statusColors[selectedArtisan.statut as keyof typeof statusColors]}>
                  {selectedArtisan.statut}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium">Zone d'intervention</h4>
                <p className="text-sm text-muted-foreground">{selectedArtisan.zone}</p>
              </div>
              <div>
                <h4 className="font-medium">Spécialités</h4>
                <p className="text-sm text-muted-foreground">{selectedArtisan.specialites}</p>
              </div>
              <div>
                <h4 className="font-medium">Statistiques</h4>
                <div className="text-sm space-y-1">
                  <div>• CA mensuel: {selectedArtisan.ca_mois}€</div>
                  <div>• Interventions réalisées: {selectedArtisan.nb_interventions}</div>
                  <div>• Note moyenne: {selectedArtisan.note_moyenne}/5</div>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button className="w-full" variant="outline">
                  Voir historique
                </Button>
                <Button className="w-full" variant="outline">
                  Gérer documents
                </Button>
                <Button className="w-full" variant="outline">
                  Planifier absence
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};