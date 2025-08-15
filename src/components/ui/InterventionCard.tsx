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
  Edit
} from 'lucide-react';
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
  statut: 'demande' | 'en_cours' | 'termine' | 'bloque';
  cree: string;
  echeance: string;
  description: string;
  montant?: number;
  adresse?: string;
  notes?: string;
  coutSST?: number;
  coutMateriaux?: number;
  coutInterventions?: number;
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
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/interventions/${intervention.id}`);
  };

  const getStatusConfig = (statut: string) => {
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
    return configs[statut as keyof typeof configs] || configs.demande;
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
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out
        hover:shadow-lg hover:scale-[1.02] hover:border-primary/20
        cursor-pointer
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicateur de statut coloré */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
        ${statusConfig.iconColor.replace('text-', 'bg-')}
        group-hover:w-2
      `} />

      <CardHeader className="pb-3">
        {/* Header: ID + Status + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
              #{intervention.id}
            </div>
            <Badge className={`${statusConfig.color} border font-medium`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {intervention.statut.charAt(0).toUpperCase() + intervention.statut.slice(1).replace('_', ' ')}
            </Badge>
          </div>

          {/* Actions Menu */}
          <div className={`
            flex items-center gap-2 transition-all duration-300
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
        {/* Titre clickable pour navigation */}
        <div 
          className="mb-4 cursor-pointer group/title"
          onClick={handleNavigateToDetail}
        >
          <h3 className="text-lg font-semibold text-foreground group-hover/title:text-primary transition-colors duration-200 line-clamp-1">
            {intervention.client}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {intervention.description}
          </p>
        </div>

        {/* Meta Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {/* Client & Artisan */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{intervention.client}</div>
                <div className="text-muted-foreground text-xs">Client</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{intervention.artisan}</div>
                <div className="text-muted-foreground text-xs">Artisan</div>
              </div>
            </div>
          </div>

          {/* Adresse */}
          {intervention.adresse && (
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{intervention.adresse}</div>
                  <div className="text-muted-foreground text-xs">Adresse</div>
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-foreground">{formatDate(intervention.cree)}</div>
                <div className="text-muted-foreground text-xs">Créé</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-foreground">{formatDate(intervention.echeance)}</div>
                <div className="text-muted-foreground text-xs">Échéance</div>
              </div>
            </div>
          </div>

          {/* Montant */}
          {intervention.montant && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-green-600">{formatCurrency(intervention.montant)}</div>
                  <div className="text-muted-foreground text-xs">Montant</div>
                </div>
              </div>
            </div>
          )}
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
  );
};