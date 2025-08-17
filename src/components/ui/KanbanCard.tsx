import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  MapPin, 
  User, 
  Euro,
  MoreHorizontal,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { Intervention } from '@/services/interventionApi';
import { StatusBadge } from '@/components/ui/BadgeComponents';
import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS } from '@/types/artisan';

interface KanbanCardProps {
  intervention: Intervention;
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
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  intervention,
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
  onUserChange
}) => {
  // Configuration des statuts avec icônes et couleurs
  const statusConfig = {
    demande: { label: 'Demandé', icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200', activeColor: 'bg-blue-500 text-white' },
    devis_envoye: { label: 'Devis Envoyé', icon: FileText, color: 'bg-purple-100 text-purple-700 border-purple-200', activeColor: 'bg-purple-500 text-white' },
    accepte: { label: 'Accepté', icon: Clock, color: 'bg-green-100 text-green-700 border-green-200', activeColor: 'bg-green-500 text-white' },
    en_cours: { label: 'En cours', icon: Clock, color: 'bg-orange-100 text-orange-700 border-orange-200', activeColor: 'bg-orange-500 text-white' },
    annule: { label: 'Annulé', icon: Clock, color: 'bg-red-100 text-red-700 border-red-200', activeColor: 'bg-red-500 text-white' },
    termine: { label: 'Terminé', icon: Clock, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', activeColor: 'bg-emerald-500 text-white' },
    visite_technique: { label: 'Visite Technique', icon: Clock, color: 'bg-indigo-100 text-indigo-700 border-indigo-200', activeColor: 'bg-indigo-500 text-white' },
    refuse: { label: 'Refusé', icon: Clock, color: 'bg-red-100 text-red-700 border-red-200', activeColor: 'bg-red-500 text-white' },
    stand_by: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', activeColor: 'bg-yellow-500 text-white' },
    sav: { label: 'SAV', icon: Clock, color: 'bg-pink-100 text-pink-700 border-pink-200', activeColor: 'bg-pink-500 text-white' },
    bloque: { label: 'Bloqué', icon: Clock, color: 'bg-gray-100 text-gray-700 border-gray-200', activeColor: 'bg-gray-500 text-white' }
  };

  const config = statusConfig[intervention.statut as keyof typeof statusConfig];
  const IconComponent = config?.icon || Clock;

  // Calculer la marge
  const marge = (intervention.montant || 0) - (intervention.coutSST || 0) - (intervention.coutMateriaux || 0) - (intervention.coutInterventions || 0);

  // Formater la date d'échéance
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  // Vérifier si l'échéance est proche (dans les 3 jours)
  const isUrgent = () => {
    const echeance = new Date(intervention.echeance);
    const today = new Date();
    const diffTime = echeance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Vérifier si l'échéance est dépassée
  const isOverdue = () => {
    const echeance = new Date(intervention.echeance);
    const today = new Date();
    return echeance < today;
  };

  return (
    <Card className="w-full kanban-card-hover cursor-pointer group">
      <CardContent className="p-3">
        {/* En-tête avec ID et statut */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-muted-foreground">
              {intervention.id}
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs ${config?.color} border`}
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {config?.label}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(intervention);
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {/* Client et artisan */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium truncate">
              {intervention.client}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Artisan:</span>
            <span className="text-xs truncate">
              {intervention.artisan}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-2">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {intervention.description}
          </p>
        </div>

        {/* Adresse */}
        {intervention.adresse && (
          <div className="flex items-start space-x-1 mb-2">
            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground line-clamp-1">
              {intervention.adresse}
            </span>
          </div>
        )}

        {/* Échéance et montant */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className={`text-xs ${isOverdue() ? 'text-red-600 font-medium' : isUrgent() ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
              {formatDate(intervention.echeance)}
            </span>
          </div>
          {intervention.montant && (
            <div className="flex items-center space-x-1">
              <Euro className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">
                {intervention.montant.toLocaleString('fr-FR')}€
              </span>
            </div>
          )}
        </div>

        {/* Marge */}
        {intervention.montant && (
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Marge:</span>
              <span className={`text-xs font-medium ${marge >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marge.toLocaleString('fr-FR')}€
              </span>
            </div>
          </div>
        )}

        {/* Statuts artisan et dossier */}
        <div className="flex items-center space-x-2 mb-2">
          {intervention.artisan_status && (
            <StatusBadge 
              status={intervention.artisan_status} 
              className="text-xs"
            />
          )}
          {intervention.artisan_dossier_status && (
            <Badge 
              variant="outline" 
              className="text-xs"
            >
              {intervention.artisan_dossier_status}
            </Badge>
          )}
        </div>

        {/* Actions rapides */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onSendEmail(intervention);
              }}
            >
              <Mail className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onCall(intervention);
              }}
            >
              <Phone className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onAddDocument(intervention);
              }}
            >
              <FileText className="h-3 w-3" />
            </Button>
          </div>
          
                     {/* Indicateur d'urgence */}
           {(isUrgent() || isOverdue()) && (
             <div className={`w-2 h-2 rounded-full urgent-indicator ${isOverdue() ? 'bg-red-500' : 'bg-orange-500'}`} />
           )}
        </div>
      </CardContent>
    </Card>
  );
};
