import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  FilePlus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Euro,
  Calendar,
  MoreVertical,
  ExternalLink,
  Edit,
  Plus,
  Minus,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StatusBadge, MetierBadge, AgenceBadge, UserBadge, type InterventionStatus, type ArtisanMetier } from './BadgeComponents';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  statut: InterventionStatus;
  cree: string;
  echeance: string;
  description: string;
  montant?: number;
  adresse?: string;
  notes?: string;
  coutSST?: number;
  coutMateriaux?: number;
  coutInterventions?: number;
  // Nouvelles propriétés
  artisan_metier?: ArtisanMetier;
  agence?: string;
  utilisateur_assigné?: string;
  reference?: string;
}

interface InterventionCardProps {
  intervention: Intervention;
  onEdit?: (intervention: Intervention) => void;
  onSendEmail?: (intervention: Intervention) => void;
  onCall?: (intervention: Intervention) => void;
  onAddDocument?: (intervention: Intervention) => void;
  onStatusChange?: (intervention: Intervention, newStatus: string) => void;
  onAmountChange?: (intervention: Intervention, amount: number) => void;
  onDateChange?: (intervention: Intervention, field: string, date: string) => void;
  onAddressChange?: (intervention: Intervention, address: string) => void;
  onArtisanChange?: (intervention: Intervention, artisan: string) => void;
  onClientChange?: (intervention: Intervention, client: string) => void;
  onDescriptionChange?: (intervention: Intervention, description: string) => void;
  onNotesChange?: (intervention: Intervention, notes: string) => void;
  onCoutSSTChange?: (intervention: Intervention, amount: number) => void;
  onCoutMateriauxChange?: (intervention: Intervention, amount: number) => void;
  onCoutInterventionsChange?: (intervention: Intervention, amount: number) => void;
  className?: string;
}

export const InterventionCard: React.FC<InterventionCardProps> = ({
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
  onClientChange,
  onDescriptionChange,
  onNotesChange,
  onCoutSSTChange,
  onCoutMateriauxChange,
  onCoutInterventionsChange,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/interventions/${intervention.id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent expansion if clicking on action buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const calculateMarge = () => {
    const total = (intervention.coutSST || 0) + (intervention.coutMateriaux || 0) + (intervention.coutInterventions || 0);
    const marge = (intervention.montant || 0) - total;
    return marge;
  };

  const getStatusConfig = (statut: InterventionStatus) => {
    const configs = {
      demande: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        iconColor: 'text-blue-500'
      },
      en_cours: { 
        variant: 'secondary' as const, 
        icon: AlertCircle, 
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        iconColor: 'text-orange-500'
      },
      termine: { 
        variant: 'secondary' as const, 
        icon: CheckCircle, 
        color: 'bg-green-50 text-green-700 border-green-200',
        iconColor: 'text-green-500'
      },
      bloque: { 
        variant: 'destructive' as const, 
        icon: XCircle, 
        color: 'bg-red-50 text-red-700 border-red-200',
        iconColor: 'text-red-500'
      }
    };
    return configs[statut] || configs.demande;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '€0';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const statusConfig = getStatusConfig(intervention.statut);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={className}>
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out
        hover:shadow-lg hover:border-primary/20
        cursor-pointer
        ${isExpanded ? 'shadow-lg border-primary/20' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Indicateur de statut coloré */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
        ${statusConfig.iconColor.replace('text-', 'bg-')}
        group-hover:w-2
      `} />

      <CardHeader className="pb-3">
        {/* Header (ligne 1): Titre + Statut + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h3 
              className="text-lg font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
              onClick={handleNavigateToDetail}
              title={intervention.client}
            >
              {intervention.client}
            </h3>
            <StatusBadge status={intervention.statut} size="md" />
            {/* Expand indicator */}
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <div className={`
            flex items-center gap-2 transition-all duration-300 flex-shrink-0
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          `}>
            {/* Mobile: Dropdown Menu */}
            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleNavigateToDetail}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(intervention)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Éditer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSendEmail?.(intervention)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCall?.(intervention)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddDocument?.(intervention)}>
                    <FilePlus className="h-4 w-4 mr-2" />
                    Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop: Individual Buttons */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateToDetail}
                className="h-8 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Ouvrir</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSendEmail?.(intervention)}
                title="Envoyer un email"
                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
              >
                <Mail className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCall?.(intervention)}
                title="Appeler"
                className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
              >
                <Phone className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddDocument?.(intervention)}
                title="Ajouter un document"
                className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600"
              >
                <FilePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2" title={intervention.description}>
          {intervention.description}
        </p>

        {/* Layout responsive: Desktop (≥768px) vs Mobile (<768px) */}
        {/* Desktop: Layout horizontal */}
        <div className="hidden md:block">
          {/* Sous-titre (ligne 2): Artisan + Utilisateur */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate">
                {intervention.artisan}
              </span>
              {intervention.artisan_metier && (
                <MetierBadge metier={intervention.artisan_metier} size="sm" />
              )}
            </div>
            <div className="flex-shrink-0">
              {intervention.utilisateur_assigné && (
                <UserBadge user={intervention.utilisateur_assigné} size="sm" />
              )}
            </div>
          </div>

          {/* Footer (ligne 3): Agence + Date/Référence */}
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              {intervention.agence && (
                <AgenceBadge agence={intervention.agence} size="sm" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {intervention.reference && (
                <span className="font-mono" title={intervention.reference}>
                  {intervention.reference}
                </span>
              )}
              <span title={`Créé le ${formatDate(intervention.cree)}`}>
                {formatDate(intervention.cree)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile: Layout vertical empilé */}
        <div className="md:hidden space-y-3">
          {/* Sous-titre: Artisan + Métier */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">
              {intervention.artisan}
            </span>
            {intervention.artisan_metier && (
              <MetierBadge metier={intervention.artisan_metier} size="sm" />
            )}
          </div>

          {/* Utilisateur assigné */}
          {intervention.utilisateur_assigné && (
            <div className="flex items-center">
              <UserBadge user={intervention.utilisateur_assigné} size="sm" />
            </div>
          )}

          {/* Footer: Agence + Date/Référence */}
          <div className="flex items-center gap-2 flex-wrap">
            {intervention.agence && (
              <AgenceBadge agence={intervention.agence} size="sm" />
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {intervention.reference && (
                <span className="font-mono" title={intervention.reference}>
                  {intervention.reference}
                </span>
              )}
              <span title={`Créé le ${formatDate(intervention.cree)}`}>
                {formatDate(intervention.cree)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Primary Action */}
        <div className="block md:hidden mt-4">
          <Button 
            onClick={handleNavigateToDetail}
            className="w-full h-11 font-medium"
            size="lg"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir l'intervention
          </Button>
        </div>
      </CardContent>

      {/* Hover overlay */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-primary/10 
        pointer-events-none rounded-lg transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />
    </Card>

    {/* Section dépliable avec informations et édition intégrée */}
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <Card className="rounded-t-none border-t-0 bg-gradient-to-br from-slate-50/80 to-blue-50/80 dark:from-slate-800/50 dark:to-slate-900/50">
        <CardContent className="p-4 md:p-6">
          {/* Header avec statuts et coûts */}
          <div className="space-y-6">
            
            {/* Section Statuts */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Statut de l'intervention</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['demande', 'en_cours', 'termine', 'bloque'] as const).map((status) => {
                  const isActive = intervention.statut === status;
                  return (
                    <Button
                      key={status}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`
                        h-10 justify-start transition-all duration-200
                        ${isActive ? 'shadow-md' : ''}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(intervention, status);
                      }}
                    >
                      <StatusBadge status={status} size="sm" className="border-0 bg-transparent p-0 h-auto" />
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Section Coûts */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Détail des coûts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'SST', value: intervention.coutSST || 0, onChange: onCoutSSTChange, color: 'text-blue-600' },
                  { label: 'Matériaux', value: intervention.coutMateriaux || 0, onChange: onCoutMateriauxChange, color: 'text-purple-600' },
                  { label: 'Interventions', value: intervention.coutInterventions || 0, onChange: onCoutInterventionsChange, color: 'text-orange-600' },
                  { label: 'Marge', value: calculateMarge(), readonly: true, color: calculateMarge() >= 0 ? 'text-green-600' : 'text-red-600' }
                ].map((cost, index) => (
                  <div key={index} className="bg-background/50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">{cost.label}</span>
                      {!cost.readonly && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              cost.onChange?.(intervention, Math.max(0, cost.value - 50));
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              cost.onChange?.(intervention, cost.value + 50);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className={`text-sm font-semibold ${cost.color}`}>
                      {formatCurrency(cost.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations principales en colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Colonne gauche - Client & Adresse */}
              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 border">
                  <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations client
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Client</label>
                      <div className="text-sm font-medium text-foreground mt-1">{intervention.client}</div>
                    </div>
                    {intervention.adresse && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Adresse</label>
                        <div className="text-sm text-foreground mt-1 flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>{intervention.adresse}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <div className="text-sm text-foreground mt-1">{intervention.description}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Artisan & Dates */}
              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 border">
                  <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations intervention
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Artisan assigné</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-foreground">{intervention.artisan}</span>
                        {intervention.artisan_metier && (
                          <MetierBadge metier={intervention.artisan_metier} size="sm" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Date création</label>
                        <div className="text-sm text-foreground mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(intervention.cree)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Échéance</label>
                        <div className="text-sm text-foreground mt-1 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDate(intervention.echeance)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Agence et Utilisateur assigné */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {intervention.agence && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Agence</label>
                          <div className="mt-1">
                            <AgenceBadge agence={intervention.agence} size="sm" />
                          </div>
                        </div>
                      )}
                      {intervention.utilisateur_assigné && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Utilisateur assigné</label>
                          <div className="mt-1">
                            <UserBadge user={intervention.utilisateur_assigné} size="sm" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Référence */}
                    {intervention.reference && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Référence</label>
                        <div className="text-sm font-mono text-foreground mt-1">
                          {intervention.reference}
                        </div>
                      </div>
                    )}
                    {intervention.notes && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Notes</label>
                        <div className="text-sm text-foreground mt-1 p-2 bg-background/80 rounded border">
                          {intervention.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="pt-4 border-t">
              <h5 className="text-sm font-semibold text-foreground mb-3">Actions rapides</h5>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendEmail?.(intervention);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email client
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCall?.(intervention);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mail artisan handler would go here
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Mail artisan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddDocument?.(intervention);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateToDetail();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Page complète
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};