
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
  ExternalLink,
  Plus
} from 'lucide-react';
import { InterventionsAPI } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InterventionCard } from '@/components/ui/InterventionCard';
import { InterventionDetailCard } from '@/components/ui/InterventionDetailCard';
import { type InterventionStatus, type ArtisanMetier } from '@/components/ui/BadgeComponents';

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  statut: InterventionStatus;
  cree: string;
  echeance: string;
  description: string;
  // Nouvelles propriétés
  artisan_metier?: ArtisanMetier;
  agence?: string;
  utilisateur_assigné?: string;
  reference?: string;
}

export const Interventions: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [searchParams] = useSearchParams();
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



  const filteredInterventions = interventions.filter(intervention =>
    intervention.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.artisan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.id.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Handlers pour les actions du composant InterventionCard
  const handleEditIntervention = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
  };

  const handleSendEmail = (intervention: Intervention) => {
    console.log('Envoi email pour:', intervention.id);
    // Ici vous pouvez implémenter l'envoi d'email
  };

  const handleCall = (intervention: Intervention) => {
    console.log('Appel pour:', intervention.id);
    // Ici vous pouvez implémenter l'appel
  };

  const handleAddDocument = (intervention: Intervention) => {
    console.log('Ajout document pour:', intervention.id);
    // Ici vous pouvez implémenter l'ajout de document
  };

  const handleStatusChange = (intervention: Intervention, newStatus: string) => {
    console.log('Changement de statut pour:', intervention.id, 'vers:', newStatus);
    // Ici vous pouvez implémenter le changement de statut
  };

  const handleAmountChange = (intervention: Intervention, amount: number) => {
    console.log('Changement de montant pour:', intervention.id, 'nouveau montant:', amount);
    // Ici vous pouvez implémenter le changement de montant
  };

  const handleDateChange = (intervention: Intervention, field: string, date: string) => {
    console.log('Changement de date pour:', intervention.id, 'champ:', field, 'date:', date);
    // Ici vous pouvez implémenter le changement de date
  };

  const handleAddressChange = (intervention: Intervention, address: string) => {
    console.log('Changement d\'adresse pour:', intervention.id, 'nouvelle adresse:', address);
    // Ici vous pouvez implémenter le changement d'adresse
  };

  const handleArtisanChange = (intervention: Intervention, artisan: string) => {
    console.log('Changement d\'artisan pour:', intervention.id, 'nouvel artisan:', artisan);
    // Ici vous pouvez implémenter le changement d'artisan
  };

  const handleClientChange = (intervention: Intervention, client: string) => {
    console.log('Changement de client pour:', intervention.id, 'nouveau client:', client);
    // Ici vous pouvez implémenter le changement de client
  };

  const handleDescriptionChange = (intervention: Intervention, description: string) => {
    console.log('Changement de description pour:', intervention.id, 'nouvelle description:', description);
    // Ici vous pouvez implémenter le changement de description
  };

  const handleNotesChange = (intervention: Intervention, notes: string) => {
    console.log('Changement de notes pour:', intervention.id, 'nouvelles notes:', notes);
    // Ici vous pouvez implémenter le changement de notes
  };

  const handleCoutSSTChange = (intervention: Intervention, amount: number) => {
    console.log('Changement de coût SST pour:', intervention.id, 'nouveau montant:', amount);
    // Ici vous pouvez implémenter le changement de coût SST
  };

  const handleCoutMateriauxChange = (intervention: Intervention, amount: number) => {
    console.log('Changement de coût matériaux pour:', intervention.id, 'nouveau montant:', amount);
    // Ici vous pouvez implémenter le changement de coût matériaux
  };

  const handleCoutInterventionsChange = (intervention: Intervention, amount: number) => {
    console.log('Changement de coût interventions pour:', intervention.id, 'nouveau montant:', amount);
    // Ici vous pouvez implémenter le changement de coût interventions
  };

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
                <InterventionCard
                  key={intervention.id}
                  intervention={intervention}
                  onEdit={handleEditIntervention}
                  onSendEmail={handleSendEmail}
                  onCall={handleCall}
                  onAddDocument={handleAddDocument}
                  onStatusChange={handleStatusChange}
                  onAmountChange={handleAmountChange}
                  onDateChange={handleDateChange}
                  onAddressChange={handleAddressChange}
                  onArtisanChange={handleArtisanChange}
                  onClientChange={handleClientChange}
                  onDescriptionChange={handleDescriptionChange}
                  onNotesChange={handleNotesChange}
                  onCoutSSTChange={handleCoutSSTChange}
                  onCoutMateriauxChange={handleCoutMateriauxChange}
                  onCoutInterventionsChange={handleCoutInterventionsChange}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar détail intervention */}
      {selectedIntervention && (
        <div className="fixed right-6 top-24 bottom-6 w-96 z-50">
          <InterventionDetailCard
            intervention={selectedIntervention}
            onClose={() => setSelectedIntervention(null)}
            onEdit={handleEditIntervention}
            onSendEmail={handleSendEmail}
            onCall={handleCall}
            onAddDocument={handleAddDocument}
            onStatusChange={handleStatusChange}
            onAmountChange={handleAmountChange}
            onDateChange={handleDateChange}
            onAddressChange={handleAddressChange}
            onArtisanChange={handleArtisanChange}
            className="h-full overflow-y-auto"
          />
        </div>
      )}


    </div>
  );
};
