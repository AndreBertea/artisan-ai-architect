import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  X,
  Mail,
  Phone,
  FilePlus,
  Edit,
  Download,
  Euro,
  Calendar,
  MapPin,
  User,
  Settings,
  Zap,
  Star,
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  Clock4,
  CalendarDays,
  Building2,
  Wrench,
  FileText,
  Send,
  MessageSquare,
  Plus,
  Minus,
  RotateCcw
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
}

interface InterventionDetailCardProps {
  intervention: Intervention;
  onClose?: () => void;
  onEdit?: (intervention: Intervention) => void;
  onSendEmail?: (intervention: Intervention) => void;
  onCall?: (intervention: Intervention) => void;
  onAddDocument?: (intervention: Intervention) => void;
  onStatusChange?: (intervention: Intervention, newStatus: string) => void;
  onAmountChange?: (intervention: Intervention, amount: number) => void;
  onDateChange?: (intervention: Intervention, field: string, date: string) => void;
  onAddressChange?: (intervention: Intervention, address: string) => void;
  onArtisanChange?: (intervention: Intervention, artisan: string) => void;
  className?: string;
}

export const InterventionDetailCard: React.FC<InterventionDetailCardProps> = ({
  intervention,
  onClose,
  onEdit,
  onSendEmail,
  onCall,
  onAddDocument,
  onStatusChange,
  onAmountChange,
  onDateChange,
  onAddressChange,
  onArtisanChange,
  className = ''
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [editingField, setEditingField] = useState<{field: string, value: string} | null>(null);

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

  // Couleurs de hover selon le thème (même logique que InterventionCard)
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

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField({ field, value: currentValue });
  };

  const handleSaveEdit = () => {
    if (editingField) {
      // Ici vous pouvez implémenter la sauvegarde
      console.log('Sauvegarde:', editingField);
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
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
      case 'generate-email':
        onSendEmail?.(intervention);
        break;
      default:
        console.log(`Action ${action} pour l'intervention ${intervention.id}`, data);
    }
  };

  const colors = getHoverColors();

  return (
    <Card className={`
      relative transition-all duration-300 ease-out
      ${colors.shadow}
      ${className}
    `}>
      {/* Indicateur de statut coloré sur le côté */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-2 transition-all duration-300
        ${intervention.statut === 'demande' ? 'bg-blue-500' : ''}
        ${intervention.statut === 'en_cours' ? 'bg-orange-500' : ''}
        ${intervention.statut === 'termine' ? 'bg-green-500' : ''}
        ${intervention.statut === 'bloque' ? 'bg-red-500' : ''}
      `} />

      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold">
          Intervention #{intervention.id}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleAction('open-full')}
            className="hover:bg-blue-100 hover:text-blue-600"
            title="Ouvrir en page complète"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="hover:bg-red-100 hover:text-red-600"
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Section Détails */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">Détails</h3>
          <div className="space-y-3">
            {/* Client - éditable */}
            <div className="group flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium text-muted-foreground">Client: </span>
                {editingField?.field === 'client' ? (
                  <input
                    type="text"
                    value={editingField.value}
                    onChange={(e) => setEditingField({...editingField, value: e.target.value})}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="inline-block bg-background border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium group-hover:text-blue-600 transition-colors">
                    {intervention.client}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditField('client', intervention.client)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600 h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>

            {/* Artisan - éditable */}
            <div className="group flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium text-muted-foreground">Artisan: </span>
                {editingField?.field === 'artisan' ? (
                  <input
                    type="text"
                    value={editingField.value}
                    onChange={(e) => setEditingField({...editingField, value: e.target.value})}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="inline-block bg-background border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium group-hover:text-blue-600 transition-colors">
                    {intervention.artisan}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditField('artisan', intervention.artisan)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600 h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>

            {/* Statut */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Statut: </span>
                {getStatusBadge(intervention.statut)}
              </div>
            </div>

            {/* Dates */}
            <div>
              <span className="text-sm font-medium text-muted-foreground">Créé: </span>
              <span className="font-medium">{new Date(intervention.cree).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Échéance: </span>
              <span className="font-medium">{new Date(intervention.echeance).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Section Actions rapides - Menu ultra-polyvalent */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-4">Actions rapides</h3>
          
          {/* Statuts */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Statuts</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="justify-start bg-blue-500 hover:bg-blue-600 text-white border-0"
                onClick={() => handleAction('status-demande')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Demande
              </Button>
              <Button 
                size="sm" 
                className="justify-start bg-orange-500 hover:bg-orange-600 text-white border-0"
                onClick={() => handleAction('status-en-cours')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                En cours
              </Button>
              <Button 
                size="sm" 
                className="justify-start bg-green-500 hover:bg-green-600 text-white border-0"
                onClick={() => handleAction('status-termine')}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Terminé
              </Button>
              <Button 
                size="sm" 
                className="justify-start bg-red-500 hover:bg-red-600 text-white border-0"
                onClick={() => handleAction('status-bloque')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Bloqué
              </Button>
            </div>
          </div>

          {/* Montant */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Montant</h4>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => handleAction('amount-increase')}
              >
                <Plus className="h-4 w-4 mr-1" />
                +100€
              </Button>
              <div className="flex-1 text-center font-bold text-lg text-green-600">
                {intervention.montant ? `${intervention.montant}€` : '0€'}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                onClick={() => handleAction('amount-decrease')}
              >
                <Minus className="h-4 w-4 mr-1" />
                -100€
              </Button>
            </div>
          </div>

          {/* Dates */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Dates</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                onClick={() => handleAction('date-created')}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Date création
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                onClick={() => handleAction('date-deadline')}
              >
                <Clock4 className="h-4 w-4 mr-2" />
                Échéance
              </Button>
            </div>
          </div>

          {/* Communication */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Communication</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                onClick={() => handleAction('email')}
              >
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => handleAction('call')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Appel
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                onClick={() => handleAction('generate-email')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mail artisan
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                onClick={() => handleAction('document')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Document
              </Button>
            </div>
          </div>

          {/* Modifications rapides */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Modifications</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                onClick={() => handleAction('address-edit')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Adresse
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200"
                onClick={() => handleAction('artisan-change')}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Artisan
              </Button>
            </div>
          </div>

          {/* Actions spéciales */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Actions spéciales</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                onClick={() => handleAction('open-full')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Page complète
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                onClick={() => handleAction('edit')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Édition avancée
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
