
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
import { StatusBadge } from '@/components/ui/BadgeComponents';
import { InterventionAPI } from '@/services/interventionApi';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InterventionCard } from '@/components/ui/InterventionCard';
import { InterventionDetailCard } from '@/components/ui/InterventionDetailCard';

// Import de l'interface depuis l'API
import { Intervention } from '@/services/interventionApi';

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
        const data = await InterventionAPI.getAll();
        setInterventions(data);
        
        // Vérifier si une intervention est sélectionnée via l'URL
        const selectedId = searchParams.get('selected');
        if (selectedId) {
          const intervention = data.find((i: Intervention) => i.id === selectedId);
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
            const data = await InterventionAPI.getAll();
            const originalInterventions = data;
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

  // Suppression de getStatusBadge car maintenant on utilise StatusBadge de BadgeComponents

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

  const handleStatusChange = async (intervention: Intervention, newStatus: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateStatus(intervention.id, newStatus as Intervention['statut']);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const handleAmountChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateMontant(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour montant:', error);
    }
  };

  const handleDateChange = async (intervention: Intervention, field: string, date: string) => {
    try {
      let updatedIntervention;
      if (field === 'echeance') {
        updatedIntervention = await InterventionAPI.updateEcheance(intervention.id, date);
      }
      if (updatedIntervention) {
        setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
        if (selectedIntervention?.id === intervention.id) {
          setSelectedIntervention(updatedIntervention);
        }
      }
    } catch (error) {
      console.error('Erreur mise à jour date:', error);
    }
  };

  const handleAddressChange = async (intervention: Intervention, address: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateAddress(intervention.id, address);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour adresse:', error);
    }
  };

  const handleArtisanChange = async (intervention: Intervention, artisan: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateArtisan(intervention.id, artisan);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour artisan:', error);
    }
  };

  const handleClientChange = async (intervention: Intervention, client: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateClient(intervention.id, client);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour client:', error);
    }
  };

  const handleDescriptionChange = async (intervention: Intervention, description: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateDescription(intervention.id, description);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour description:', error);
    }
  };

  const handleNotesChange = async (intervention: Intervention, notes: string) => {
    try {
      const updatedIntervention = await InterventionAPI.updateNotes(intervention.id, notes);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour notes:', error);
    }
  };

  const handleCoutSSTChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateCoutSST(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour coût SST:', error);
    }
  };

  const handleCoutMateriauxChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateCoutMateriaux(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour coût matériaux:', error);
    }
  };

  const handleCoutInterventionsChange = async (intervention: Intervention, amount: number) => {
    try {
      const updatedIntervention = await InterventionAPI.updateCoutInterventions(intervention.id, amount);
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour coût interventions:', error);
    }
  };

  const handleUserChange = async (intervention: Intervention, username: string) => {
    try {
      // Ici vous pouvez ajouter l'appel API pour mettre à jour l'utilisateur assigné
      // const updatedIntervention = await InterventionAPI.updateUser(intervention.id, username);
      
      // Pour l'instant, on met à jour localement
      const updatedIntervention = {
        ...intervention,
        utilisateur_assigné: username
      };
      
      setInterventions(prev => prev.map(i => i.id === intervention.id ? updatedIntervention : i));
      if (selectedIntervention?.id === intervention.id) {
        setSelectedIntervention(updatedIntervention);
      }
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
    }
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
                  onUserChange={handleUserChange}
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
            onCoutSSTChange={handleCoutSSTChange}
            onCoutMateriauxChange={handleCoutMateriauxChange}
            onCoutInterventionsChange={handleCoutInterventionsChange}
            className="h-full overflow-y-auto"
          />
        </div>
      )}


    </div>
  );
};
