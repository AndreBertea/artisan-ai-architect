import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Star,
  Activity,
  MapPin,
  Wrench,
  Calendar,
  FileText,
  Download,
  MoreVertical
} from 'lucide-react';
import { ArtisansAPI } from '@/services/api';

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

export const ArtisanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtisan = async () => {
      if (!id) return;
      
      try {
        const data = await ArtisansAPI.getList({});
        const foundArtisan = data.data.find((a: Artisan) => a.id === id);
        
        if (foundArtisan) {
          setArtisan(foundArtisan);
        } else {
          setArtisan({
            id: id,
            nom: 'Artisan Mocké',
            specialite: 'Plomberie',
            statut: 'confirme',
            zone: 'Paris',
            activite_badge: 'actif',
            ca_mois: 5000,
            note_moyenne: 4.5,
            derniere_intervention: new Date().toISOString(),
            disponible: true
          });
        }
      } catch (error) {
        console.error('Erreur chargement artisan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtisan();
  }, [id]);

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

  if (!artisan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/artisans')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Artisan non trouvé</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">L'artisan demandé n'existe pas.</p>
            <Button onClick={() => navigate('/artisans')} className="mt-4">
              Retour aux artisans
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/artisans')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{artisan.nom}</h1>
            <p className="text-muted-foreground">Détails de l'artisan</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatutBadge(artisan.statut)}
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
                  <AvatarFallback className="text-lg">{getInitials(artisan.nom)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{artisan.nom}</h3>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Wrench className="h-4 w-4 mr-2" />
                    {artisan.specialite}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">{artisan.note_moyenne.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">/5</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <div className="mt-1">{getStatutBadge(artisan.statut)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Activité</label>
                  <div className="mt-1">{getActiviteBadge(artisan.activite_badge)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Zone</label>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {artisan.zone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Disponibilité</label>
                  <p className="font-medium">{artisan.disponible ? 'Disponible' : 'Indisponible'}</p>
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
                  <p className="text-muted-foreground">{artisan.zone}</p>
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
                <label className="text-sm font-medium text-muted-foreground">CA mensuel</label>
                <p className="font-medium text-green-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(artisan.ca_mois)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Note moyenne</label>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-medium">{artisan.note_moyenne.toFixed(1)}/5</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Dernière intervention</label>
                <p className="font-medium">
                  {new Date(artisan.derniere_intervention).toLocaleDateString('fr-FR')}
                </p>
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
                <Calendar className="h-4 w-4 mr-2" />
                Gérer disponibilité
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Documents légaux
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Contacter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 