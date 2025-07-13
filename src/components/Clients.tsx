import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, MapPin, X, ExternalLink, Filter, Download } from "lucide-react";
import { ClientsAPI, InterventionsAPI } from "@/services/api";

interface Client {
  id: string;
  nom: string;
  adresse: string;
  evaluation: number;
  evaluations: Array<{
    intervention: string;
    note: number;
    date: string;
  }>;
  lat: number;
  lng: number;
  interventions: string[];
}

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  statut: 'en_cours' | 'demande' | 'termine' | 'bloque';
  cree: string;
  echeance: string;
  description: string;
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, interventionsData] = await Promise.all([
          ClientsAPI.getList(),
          InterventionsAPI.getList({ page: 1 })
        ]);
        setClients(clientsData.data);
        setInterventions(interventionsData.data);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientInterventions = (clientName: string) => {
    return interventions.filter(intervention => intervention.client === clientName);
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

  const getInitials = (nom: string) => {
    return nom.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
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
                placeholder="Rechercher un client..."
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

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(client.nom)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{client.nom}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {client.adresse}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">{client.evaluation.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{client.id}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar détail client */}
      {selectedClient && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Détails du client</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedClient(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Profil</h4>
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">{getInitials(selectedClient.nom)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedClient.nom}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedClient.adresse}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">{selectedClient.evaluation.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({selectedClient.evaluations.length} éval.)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Localisation</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Carte Maps</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedClient.lat.toFixed(4)}, {selectedClient.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Interventions ({getClientInterventions(selectedClient.nom).length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getClientInterventions(selectedClient.nom).map((intervention) => (
                  <div
                    key={intervention.id}
                    className="p-3 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedIntervention(intervention)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{intervention.id}</h5>
                        <p className="text-xs text-muted-foreground">{intervention.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {intervention.artisan}
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
          </CardContent>
        </Card>
      )}

      {/* Sidebar détail intervention (à côté du client, pas à gauche) */}
      {selectedIntervention && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-60" style={{ right: selectedClient ? '420px' : '24px' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Intervention #{selectedIntervention.id}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedIntervention(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Détails</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Client:</strong> {selectedIntervention.client}</div>
                <div><strong>Artisan:</strong> {selectedIntervention.artisan}</div>
                <div><strong>Statut:</strong> {getStatusBadge(selectedIntervention.statut)}</div>
                <div><strong>Description:</strong> {selectedIntervention.description}</div>
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
                  Contacter artisan
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
}