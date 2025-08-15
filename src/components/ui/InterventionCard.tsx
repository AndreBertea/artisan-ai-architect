import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  CalendarDays,
  Clock4,
  MapPin,
  Wrench,
  Send,
  MessageSquare,
  FileText,
  Settings,
  ExternalLink,
  Edit,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

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
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Gestion du hover "collé"
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        const isInside = 
          e.clientX >= rect.left && 
          e.clientX <= rect.right && 
          e.clientY >= rect.top && 
          e.clientY <= rect.bottom;
        
        if (isInside) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    if (isHovered) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsSticky(false);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/interventions/${intervention.id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Ne pas déclencher l'expansion si on clique sur le titre ou les boutons
    if ((e.target as HTMLElement).closest('.intervention-title') || 
        (e.target as HTMLElement).closest('.action-buttons')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'open-full':
        navigate(`/interventions/${intervention.id}`);
        break;
      case 'edit':
        onEdit?.(intervention);
        break;
      case 'email':
        onSendEmail?.(intervention);
        break;
      case 'call':
        onCall?.(intervention);
        break;
      case 'document':
        onAddDocument?.(intervention);
        break;
      case 'status-demande':
        onStatusChange?.(intervention, 'demande');
        break;
      case 'status-en-cours':
        onStatusChange?.(intervention, 'en_cours');
        break;
      case 'status-termine':
        onStatusChange?.(intervention, 'termine');
        break;
      case 'status-bloque':
        onStatusChange?.(intervention, 'bloque');
        break;
      case 'amount-increase':
        onAmountChange?.(intervention, (intervention.montant || 0) + 100);
        break;
      case 'amount-decrease':
        onAmountChange?.(intervention, Math.max(0, (intervention.montant || 0) - 100));
        break;
      case 'date-created':
        onDateChange?.(intervention, 'cree', new Date().toISOString());
        break;
      case 'date-deadline':
        onDateChange?.(intervention, 'echeance', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
        break;
      case 'address-edit':
        onAddressChange?.(intervention, 'Nouvelle adresse');
        break;
      case 'artisan-change':
        onArtisanChange?.(intervention, 'Nouvel artisan');
        break;
      case 'edit-client':
        onClientChange?.(intervention, intervention.client);
        break;
      case 'edit-artisan':
        onArtisanChange?.(intervention, intervention.artisan);
        break;
      case 'edit-address':
        onAddressChange?.(intervention, intervention.adresse || '');
        break;
      case 'edit-date-created':
        onDateChange?.(intervention, 'cree', intervention.cree);
        break;
      case 'edit-date-deadline':
        onDateChange?.(intervention, 'echeance', intervention.echeance);
        break;
      case 'edit-description':
        onDescriptionChange?.(intervention, intervention.description);
        break;
      case 'edit-notes':
        onNotesChange?.(intervention, intervention.notes || '');
        break;
      case 'cout-sst-increase':
        onCoutSSTChange?.(intervention, (intervention.coutSST || 0) + 100);
        break;
      case 'cout-sst-decrease':
        onCoutSSTChange?.(intervention, (intervention.coutSST || 0) - 100);
        break;
      case 'cout-materiaux-increase':
        onCoutMateriauxChange?.(intervention, (intervention.coutMateriaux || 0) + 100);
        break;
      case 'cout-materiaux-decrease':
        onCoutMateriauxChange?.(intervention, (intervention.coutMateriaux || 0) - 100);
        break;
      case 'cout-interventions-increase':
        onCoutInterventionsChange?.(intervention, (intervention.coutInterventions || 0) + 100);
        break;
      case 'cout-interventions-decrease':
        onCoutInterventionsChange?.(intervention, (intervention.coutInterventions || 0) - 100);
        break;
      default:
        console.log(`Action ${action} pour l'intervention ${intervention.id}`, data);
    }
  };

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      demande: { variant: 'secondary', icon: Clock, color: 'text-blue-600' },
      en_cours: { variant: 'secondary', icon: AlertCircle, color: 'text-orange-600' },
      termine: { variant: 'secondary', icon: CheckCircle, color: 'text-green-600' },
      bloque: { variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    };

    const config = statusConfig[statut as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {statut.charAt(0).toUpperCase() + statut.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  // Couleurs de hover selon le thème
  const getHoverColors = () => {
    if (theme === 'dark') {
      return {
        hover: 'hover:bg-slate-800/80',
        sticky: 'bg-slate-800/80',
        border: 'border-slate-700',
        shadow: 'shadow-lg shadow-slate-900/20'
      };
    }
    return {
      hover: 'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80',
      sticky: 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80',
      border: 'border-blue-200',
      shadow: 'shadow-lg shadow-blue-500/10'
    };
  };

  const colors = getHoverColors();
  const isActive = isHovered || isSticky;

  return (
    <div className="space-y-0">
      <Card 
        ref={cardRef}
        className={`
          relative transition-all duration-300 ease-out cursor-pointer group
          ${colors.hover}
          ${isActive ? colors.sticky : ''}
          ${isActive ? colors.border : 'border-border'}
          ${isActive ? colors.shadow : 'shadow-sm'}
          ${isActive ? 'scale-[1.02]' : 'scale-100'}
          ${isExpanded ? 'rounded-b-none border-b-0' : ''}
          ${className}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
      {/* Indicateur de statut coloré sur le côté */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
        ${intervention.statut === 'demande' ? 'bg-blue-500' : ''}
        ${intervention.statut === 'en_cours' ? 'bg-orange-500' : ''}
        ${intervention.statut === 'termine' ? 'bg-green-500' : ''}
        ${intervention.statut === 'bloque' ? 'bg-red-500' : ''}
        ${isActive ? 'w-2' : 'w-1'}
      `} />

      <CardContent className="p-6">
        {/* En-tête avec ID et statut */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="font-mono text-sm font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
              #{intervention.id}
            </div>
            {getStatusBadge(intervention.statut)}
          </div>
          
          {/* Boutons d'action - visibles uniquement en hover */}
          <div className={`
            action-buttons flex items-center space-x-2 transition-all duration-300
            ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
          `}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSendEmail?.(intervention);
              }}
              title="Envoyer un email"
              className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600"
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCall?.(intervention);
              }}
              title="Appeler"
              className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddDocument?.(intervention);
              }}
              title="Ajouter un document"
              className="h-9 w-9 p-0 hover:bg-purple-100 hover:text-purple-600"
            >
              <FilePlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-3">
          {/* Titre cliquable */}
          <div 
            className="intervention-title cursor-pointer group/title"
            onClick={handleTitleClick}
          >
            <h3 className="text-lg font-semibold text-foreground group-hover/title:text-blue-600 transition-colors duration-200">
              {intervention.client}
            </h3>
            <div className="text-sm text-muted-foreground mt-1">
              {intervention.description}
            </div>
          </div>

          {/* Informations secondaires */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <span className="font-medium">Artisan:</span>
                <span className="cursor-pointer hover:text-foreground hover:bg-muted px-1 rounded transition-colors">
                  {intervention.artisan}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <span className="font-medium">Créé:</span>
                <span>{new Date(intervention.cree).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Indicateur de clic pour édition */}
            <div className={`
              text-xs text-muted-foreground transition-all duration-300
              ${isActive ? 'opacity-100' : 'opacity-0'}
            `}>
              Clic pour éditer
            </div>
          </div>
        </div>

        {/* Overlay subtil en hover */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-50/20 pointer-events-none rounded-lg" />
        )}
      </CardContent>
    </Card>

    {/* Section dépliable avec informations et édition intégrée */}
    <div className={`
      overflow-hidden transition-all duration-500 ease-in-out
      ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
    `}>
      <Card className="rounded-t-none border-t-0 bg-gradient-to-br from-slate-50/80 to-blue-50/80">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* En-tête avec statuts et coûts */}
            <div className="grid grid-cols-2 gap-6">
              {/* Statuts */}
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-orange-600">#{intervention.id}</div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={intervention.statut === 'demande' ? 'default' : 'outline'}
                    className={intervention.statut === 'demande' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-blue-50'}
                    onClick={() => handleAction('status-demande')}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Demande
                  </Button>
                  <Button 
                    size="sm" 
                    variant={intervention.statut === 'en_cours' ? 'default' : 'outline'}
                    className={intervention.statut === 'en_cours' ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-orange-50'}
                    onClick={() => handleAction('status-en-cours')}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    En cours
                  </Button>
                  <Button 
                    size="sm" 
                    variant={intervention.statut === 'termine' ? 'default' : 'outline'}
                    className={intervention.statut === 'termine' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-50'}
                    onClick={() => handleAction('status-termine')}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Terminé
                  </Button>
                  <Button 
                    size="sm" 
                    variant={intervention.statut === 'bloque' ? 'default' : 'outline'}
                    className={intervention.statut === 'bloque' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-50'}
                    onClick={() => handleAction('status-bloque')}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Bloqué
                  </Button>
                </div>
              </div>
              
              {/* Coûts et marge - Grille 4x1 */}
              <div className="grid grid-cols-4 gap-6">
                {/* Coût SST */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground text-center block">Coût SST</label>
                  <div className="flex items-center space-x-0.5">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 h-8 px-2"
                      onClick={() => handleAction('cout-sst-decrease')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="text-sm font-bold flex-1 text-center">
                      <span className={intervention.coutSST && intervention.coutSST < 0 ? 'text-red-600' : 'text-green-600'}>
                        {intervention.coutSST ? `${intervention.coutSST}€` : '0€'}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 h-8 px-2"
                      onClick={() => handleAction('cout-sst-increase')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Coût matériaux */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground text-center block">Coût matériaux</label>
                  <div className="flex items-center space-x-0.5">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 h-8 px-2"
                      onClick={() => handleAction('cout-materiaux-decrease')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="text-sm font-bold flex-1 text-center">
                      <span className={intervention.coutMateriaux && intervention.coutMateriaux < 0 ? 'text-red-600' : 'text-green-600'}>
                        {intervention.coutMateriaux ? `${intervention.coutMateriaux}€` : '0€'}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 h-8 px-2"
                      onClick={() => handleAction('cout-materiaux-increase')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Coût interventions */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground text-center block">Coût interventions</label>
                  <div className="flex items-center space-x-0.5">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 h-8 px-2"
                      onClick={() => handleAction('cout-interventions-decrease')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="text-sm font-bold flex-1 text-center">
                      <span className={intervention.coutInterventions && intervention.coutInterventions < 0 ? 'text-red-600' : 'text-green-600'}>
                        {intervention.coutInterventions ? `${intervention.coutInterventions}€` : '0€'}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 h-8 px-2"
                      onClick={() => handleAction('cout-interventions-increase')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Marge calculée */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground text-center block">Marge</label>
                  <div className="flex items-center justify-center">
                    <div className="text-sm font-bold text-green-600">
                      {(() => {
                        const totalCouts = (intervention.coutSST || 0) + (intervention.coutMateriaux || 0) + (intervention.coutInterventions || 0);
                        const montant = intervention.montant || 0;
                        if (totalCouts === 0) return '0%';
                        const marge = ((montant - totalCouts) / totalCouts) * 100;
                        return `${marge.toFixed(0)}%`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations principales avec édition intégrée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-4">
                {/* Client */}
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Client</label>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <span className="font-medium text-lg">{intervention.client}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                      onClick={() => handleAction('edit-client')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Adresse */}
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Adresse</label>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{intervention.adresse || 'Non spécifiée'}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                      onClick={() => handleAction('edit-address')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
                  <div className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors min-h-[60px]">
                    <span className="text-sm text-muted-foreground flex-1">{intervention.description}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 ml-2"
                      onClick={() => handleAction('edit-description')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                {/* Artisan */}
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Artisan</label>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <span className="font-medium text-lg">{intervention.artisan}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                      onClick={() => handleAction('edit-artisan')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Dates sur la même ligne */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Date de création */}
                  <div className="group">
                    <label className="text-xs font-medium text-orange-600 mb-1 block">Création</label>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{new Date(intervention.cree).toLocaleDateString()}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                        onClick={() => handleAction('edit-date-created')}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Date de validation */}
                  <div className="group">
                    <label className="text-xs font-medium text-green-600 mb-1 block">Validation</label>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4 text-green-600" />
                        <span className="font-medium">
                          {intervention.statut === 'termine' ? new Date(intervention.cree).toLocaleDateString() : '--/--/----'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                        onClick={() => handleAction('edit-date-validation')}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Échéance */}
                  <div className="group">
                    <label className="text-xs font-medium text-red-600 mb-1 block">Échéance</label>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-1">
                        <Clock4 className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{new Date(intervention.echeance).toLocaleDateString()}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                        onClick={() => handleAction('edit-date-deadline')}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="group">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Notes</label>
                  <div className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors min-h-[60px]">
                    <span className="text-sm text-muted-foreground flex-1">
                      {intervention.notes || 'Aucune note'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 ml-2"
                      onClick={() => handleAction('edit-notes')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                onClick={() => handleAction('email')}
              >
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => handleAction('call')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Appel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                onClick={() => handleAction('generate-email')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mail artisan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                onClick={() => handleAction('document')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Document
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                onClick={() => handleAction('open-full')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Page complète
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};
