import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  Play,
  X,
  Plus,
  Settings,
  List,
  Kanban
} from 'lucide-react';
import { Intervention } from '@/services/interventionApi';
import { KanbanCard } from './KanbanCard';
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';
import './kanban.css';

interface KanbanViewProps {
  interventions: Intervention[];
  onEdit: (intervention: Intervention) => void;
  onSendEmail: (intervention: Intervention) => void;
  onCall: (intervention: Intervention) => void;
  onAddDocument: (intervention: Intervention) => void;
  onStatusChange: (intervention: Intervention, newStatus: string) => void;
  onAmountChange: (intervention: Intervention, amount: number) => void;
  onDateChange: (intervention: Intervention, field: string, date: string) => void;
  onAddressChange: (intervention: Intervention, address: string) => void;
  onArtisanChange: (intervention: Intervention, artisan: string) => void;
  onArtisanStatusChange: (intervention: Intervention, newStatus: ARTISAN_STATUS) => void;
  onArtisanDossierStatusChange: (intervention: Intervention, newStatus: ARTISAN_DOSSIER_STATUS) => void;
  onClientChange: (intervention: Intervention, client: string) => void;
  onDescriptionChange: (intervention: Intervention, description: string) => void;
  onNotesChange: (intervention: Intervention, notes: string) => void;
  onCoutSSTChange: (intervention: Intervention, amount: number) => void;
  onCoutMateriauxChange: (intervention: Intervention, amount: number) => void;
  onCoutInterventionsChange: (intervention: Intervention, amount: number) => void;
  onUserChange: (intervention: Intervention, username: string) => void;
  selectedStatuses: string[];
  pinnedStatuses: string[];
  onViewChange?: (view: 'list' | 'kanban') => void;
  currentView?: 'list' | 'kanban';
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  interventions,
  onEdit,
  onSendEmail,
  onCall,
  onAddDocument,
  onStatusChange,
  onAmountChange,
  onDateChange,
  onAddressChange,
  onArtisanChange,
  onArtisanStatusChange,
  onArtisanDossierStatusChange,
  onClientChange,
  onDescriptionChange,
  onNotesChange,
  onCoutSSTChange,
  onCoutMateriauxChange,
  onCoutInterventionsChange,
  onUserChange,
  selectedStatuses,
  pinnedStatuses,
  onViewChange,
  currentView = 'kanban'
}) => {
  // Configuration des colonnes Kanban
  const kanbanColumns = [
    {
      id: 'demande',
      title: 'Demandé',
      icon: Clock,
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'bg-blue-100 text-blue-800',
      statuses: ['demande']
    },
    {
      id: 'devis_envoye',
      title: 'Devis Envoyé',
      icon: FileText,
      color: 'bg-purple-50 border-purple-200',
      headerColor: 'bg-purple-100 text-purple-800',
      statuses: ['devis_envoye']
    },
    {
      id: 'accepte',
      title: 'Accepté',
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200',
      headerColor: 'bg-green-100 text-green-800',
      statuses: ['accepte']
    },
    {
      id: 'en_cours',
      title: 'En cours',
      icon: Play,
      color: 'bg-orange-50 border-orange-200',
      headerColor: 'bg-orange-100 text-orange-800',
      statuses: ['en_cours']
    },
    {
      id: 'termine',
      title: 'Terminé',
      icon: CheckCircle,
      color: 'bg-emerald-50 border-emerald-200',
      headerColor: 'bg-emerald-100 text-emerald-800',
      statuses: ['termine']
    },
    {
      id: 'annule',
      title: 'Annulé',
      icon: X,
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-100 text-red-800',
      statuses: ['annule']
    },
    {
      id: 'visite_technique',
      title: 'Visite Technique',
      icon: Settings,
      color: 'bg-indigo-50 border-indigo-200',
      headerColor: 'bg-indigo-100 text-indigo-800',
      statuses: ['visite_technique']
    },
    {
      id: 'refuse',
      title: 'Refusé',
      icon: X,
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-100 text-red-800',
      statuses: ['refuse']
    },
    {
      id: 'stand_by',
      title: 'En attente',
      icon: Clock,
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-100 text-yellow-800',
      statuses: ['stand_by']
    },
    {
      id: 'sav',
      title: 'SAV',
      icon: Settings,
      color: 'bg-pink-50 border-pink-200',
      headerColor: 'bg-pink-100 text-pink-800',
      statuses: ['sav']
    },
    {
      id: 'bloque',
      title: 'Bloqué',
      icon: X,
      color: 'bg-gray-50 border-gray-200',
      headerColor: 'bg-gray-100 text-gray-800',
      statuses: ['bloque']
    }
  ];

  // Filtrer les colonnes selon les statuts épinglés
  const visibleColumns = kanbanColumns.filter(column => 
    column.statuses.some(status => pinnedStatuses.includes(status))
  );

  // Filtrer les interventions selon les statuts sélectionnés
  const filteredInterventions = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return interventions;
    }
    return interventions.filter(intervention => 
      selectedStatuses.includes(intervention.statut)
    );
  }, [interventions, selectedStatuses]);

  // Organiser les interventions par colonne
  const interventionsByColumn = useMemo(() => {
    const grouped: { [key: string]: Intervention[] } = {};
    
    visibleColumns.forEach(column => {
      grouped[column.id] = [];
    });

    filteredInterventions.forEach(intervention => {
      const column = visibleColumns.find(col => 
        col.statuses.includes(intervention.statut)
      );
      if (column) {
        grouped[column.id].push(intervention);
      }
    });

    return grouped;
  }, [filteredInterventions, visibleColumns]);

  // Calculer les statistiques par colonne
  const getColumnStats = (columnId: string) => {
    const interventions = interventionsByColumn[columnId] || [];
    const totalAmount = interventions.reduce((sum, int) => sum + (int.montant || 0), 0);
    const urgentCount = interventions.filter(int => {
      const echeance = new Date(int.echeance);
      const today = new Date();
      const diffTime = echeance.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length;
    const overdueCount = interventions.filter(int => {
      const echeance = new Date(int.echeance);
      const today = new Date();
      return echeance < today;
    }).length;

    return {
      count: interventions.length,
      totalAmount,
      urgentCount,
      overdueCount
    };
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de changement de vue */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Vue Kanban</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredInterventions.length} interventions
          </Badge>
          <Badge variant="outline" className="text-xs">
            {visibleColumns.length} colonnes affichées
          </Badge>
        </div>
        
        {onViewChange && (
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('list')}
              className="flex items-center space-x-1"
            >
              <List className="h-4 w-4" />
              <span>Liste</span>
            </Button>
            <Button
              variant={currentView === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('kanban')}
              className="flex items-center space-x-1"
            >
              <Kanban className="h-4 w-4" />
              <span>Kanban</span>
            </Button>
          </div>
        )}
      </div>

      {/* Grille Kanban */}
      <div className={`grid gap-4 kanban-grid ${
        visibleColumns.length <= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        visibleColumns.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
        visibleColumns.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
      }`}>
        {visibleColumns.map(column => {
          const stats = getColumnStats(column.id);
          const IconComponent = column.icon;
          
          return (
            <Card key={column.id} className={`${column.color} border`}>
              <CardHeader className={`${column.headerColor} p-3`}>
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{column.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats.count}
                  </Badge>
                </CardTitle>
                
                {/* Statistiques de la colonne */}
                <div className="mt-2 space-y-1">
                  {stats.totalAmount > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Total: {stats.totalAmount.toLocaleString('fr-FR')}€
                    </div>
                  )}
                  {stats.urgentCount > 0 && (
                    <div className="text-xs text-orange-600 font-medium">
                      ⚠️ {stats.urgentCount} urgent
                    </div>
                  )}
                  {stats.overdueCount > 0 && (
                    <div className="text-xs text-red-600 font-medium">
                      🚨 {stats.overdueCount} en retard
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-3">
                <div className="space-y-2 max-h-96 overflow-y-auto kanban-column-scroll">
                  {interventionsByColumn[column.id]?.map(intervention => (
                    <KanbanCard
                      key={intervention.id}
                      intervention={intervention}
                      onEdit={onEdit}
                      onSendEmail={onSendEmail}
                      onCall={onCall}
                      onAddDocument={onAddDocument}
                      onStatusChange={onStatusChange}
                      onAmountChange={onAmountChange}
                      onDateChange={onDateChange}
                      onAddressChange={onAddressChange}
                      onArtisanChange={onArtisanChange}
                      onArtisanStatusChange={onArtisanStatusChange}
                      onArtisanDossierStatusChange={onArtisanDossierStatusChange}
                      onClientChange={onClientChange}
                      onDescriptionChange={onDescriptionChange}
                      onNotesChange={onNotesChange}
                      onCoutSSTChange={onCoutSSTChange}
                      onCoutMateriauxChange={onCoutMateriauxChange}
                      onCoutInterventionsChange={onCoutInterventionsChange}
                      onUserChange={onUserChange}
                    />
                  ))}
                  
                  {interventionsByColumn[column.id]?.length === 0 && (
                    <div className="kanban-empty-column">
                      <div className="text-xs">Aucune intervention</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistiques globales */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredInterventions.length}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredInterventions.reduce((sum, int) => sum + (int.montant || 0), 0).toLocaleString('fr-FR')}€
              </div>
              <div className="text-xs text-muted-foreground">Montant total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {filteredInterventions.filter(int => {
                  const echeance = new Date(int.echeance);
                  const today = new Date();
                  const diffTime = echeance.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 3 && diffDays >= 0;
                }).length}
              </div>
              <div className="text-xs text-muted-foreground">Urgentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredInterventions.filter(int => {
                  const echeance = new Date(int.echeance);
                  const today = new Date();
                  return echeance < today;
                }).length}
              </div>
              <div className="text-xs text-muted-foreground">En retard</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
