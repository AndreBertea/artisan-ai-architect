import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Star,
  MapPin,
  User,
  Calendar,
  FileText,
  Download,
  MoreVertical,
  Phone,
  Mail
} from 'lucide-react';
import { ClientsAPI } from '@/services/api';

interface Client {
  id: string;
  nom: string;
  type: string;
  adresse: string;
  evaluation: number;
  interventions_count: number;
  contact: string;
  evaluations: Array<{
    intervention: string;
    note: number;
    date: string;
  }>;
  lat: number;
  lng: number;
  interventions: string[];
}

export const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      
      try {
        const data = await ClientsAPI.getList();
        const foundClient = data.data.find((c: Client) => c.id === id);
        
        if (foundClient) {
          setClient(foundClient);
        } else {
          setClient({
            id: id,
            nom: 'Client Mocké',
            type: 'Particulier',
            adresse: '123 Rue de la Paix, Paris',
            evaluation: 4.2,
            interventions_count: 5,
            contact: '+33 1 23 45 67 89',
            evaluations: [],
            lat: 48.8566,
            lng: 2.3522,
            interventions: []
          });
        }
      } catch (error) {
        console.error('Erreur chargement client:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  const getInitials = (nom: string) => {
    return nom.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-muted rounded animate-pulse w-64"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Client non trouvé</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Le client demandé n'existe pas.</p>
            <Button onClick={() => navigate('/clients')} className="mt-4">
              Retour aux clients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.nom}</h1>
            <p className="text-muted-foreground">Détails du client</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{client.type}</Badge>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profil */}
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{getInitials(client.nom)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{client.nom}</h3>
                  <p className="text-muted-foreground mt-1">{client.type}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">{client.evaluation.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({client.evaluations.length} éval.)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact</label>
                  <p className="font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {client.contact}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Interventions</label>
                  <p className="font-medium">{client.interventions_count} interventions</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {client.adresse}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Carte Maps</p>
                  <p className="text-muted-foreground">
                    {client.lat.toFixed(4)}, {client.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Évaluation moyenne</label>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-medium">{client.evaluation.toFixed(1)}/5</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre d'interventions</label>
                <p className="font-medium">{client.interventions_count}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Client ID</label>
                <p className="font-medium text-sm">{client.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Nouvelle intervention
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </Button>
            </CardContent>
          </Card>

          {/* Évaluations récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Évaluations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {client.evaluations.length > 0 ? (
                <div className="space-y-2">
                  {client.evaluations.slice(0, 3).map((evaluation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="text-sm font-medium">{evaluation.intervention}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evaluation.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-sm">{evaluation.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Aucune évaluation pour le moment</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 