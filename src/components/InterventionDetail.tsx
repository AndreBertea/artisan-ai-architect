import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Wrench,
  FileText,
  Download,
  MoreVertical,
  Mail,
  Phone,
  FilePlus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { InterventionsAPI } from '@/services/api';
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

export const InterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<{field: string, value: string} | null>(null);

  useEffect(() => {
    const loadIntervention = async () => {
      if (!id) return;
      
      try {
        // Simuler le chargement d'une intervention spécifique
        const data = await InterventionsAPI.getList({ page: 1 });
        const foundIntervention = data.data.find((i: Intervention) => i.id === id);
        
        if (foundIntervention) {
          setIntervention(foundIntervention);
        } else {
          // Si pas trouvé, créer une intervention mockée
          setIntervention({
            id: id,
            client: 'Client Mocké',
            artisan: 'Artisan Mocké',
            statut: 'en_cours',
            cree: new Date().toISOString(),
            echeance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Description de l\'intervention',
            montant: 1500,
            adresse: '123 Rue de la Paix, Paris'
          });
        }
      } catch (error) {
        console.error('Erreur chargement intervention:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIntervention();
  }, [id]);

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
    if (editingField && intervention) {
      // Ici vous pouvez implémenter la sauvegarde
      console.log('Sauvegarde:', editingField);
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleAction = (action: string) => {
    console.log(`Action ${action} pour l'intervention ${intervention?.id}`);
    // Ici vous pouvez implémenter les actions
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

  if (!intervention) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/interventions')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Intervention non trouvée</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">L'intervention demandée n'existe pas.</p>
            <Button onClick={() => navigate('/interventions')} className="mt-4">
              Retour aux interventions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête moderne avec indicateur de statut */}
      <div className="relative">
        {/* Indicateur de statut coloré sur le côté */}
        <div className={`
          absolute left-0 top-0 bottom-0 w-2 transition-all duration-300
          ${intervention.statut === 'demande' ? 'bg-blue-500' : ''}
          ${intervention.statut === 'en_cours' ? 'bg-orange-500' : ''}
          ${intervention.statut === 'termine' ? 'bg-green-500' : ''}
          ${intervention.statut === 'bloque' ? 'bg-red-500' : ''}
        `} />
        
        <Card className="ml-4 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/interventions')}
                  className="hover:bg-blue-100 hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">Intervention #{intervention.id}</h1>
                    {getStatusBadge(intervention.statut)}
                  </div>
                  <p className="text-muted-foreground">Détails de l'intervention</p>
                </div>
              </div>
              
              {/* Boutons d'action rapides */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction('email')}
                  className="hover:bg-blue-100 hover:text-blue-600"
                  title="Envoyer un email"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction('call')}
                  className="hover:bg-green-100 hover:text-green-600"
                  title="Appeler"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction('document')}
                  className="hover:bg-purple-100 hover:text-purple-600"
                  title="Ajouter un document"
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  Document
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Détails de l'intervention avec hover */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Détails de l'intervention
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction('edit')}
                  className="hover:bg-blue-100 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client - éditable */}
                <div className="group relative">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Client</label>
                  <div className="flex items-center justify-between">
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
                        className="flex-1 bg-background border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium text-lg group-hover:text-blue-600 transition-colors">
                        {intervention.client}
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditField('client', intervention.client)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Artisan - éditable */}
                <div className="group relative">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Artisan</label>
                  <div className="flex items-center justify-between">
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
                        className="flex-1 bg-background border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium text-lg group-hover:text-blue-600 transition-colors">
                        {intervention.artisan}
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditField('artisan', intervention.artisan)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Statut</label>
                  <div className="mt-1">{getStatusBadge(intervention.statut)}</div>
                </div>

                {/* Montant */}
                {intervention.montant && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Montant</label>
                    <p className="font-medium text-green-600 text-lg">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(intervention.montant)}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Description - éditable */}
              <div className="group relative">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
                <div className="flex items-start justify-between">
                  {editingField?.field === 'description' ? (
                    <textarea
                      value={editingField.value}
                      onChange={(e) => setEditingField({...editingField, value: e.target.value})}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1 bg-background border border-blue-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                      autoFocus
                    />
                  ) : (
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                      {intervention.description}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditField('description', intervention.description)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600 ml-2"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Adresse */}
              {intervention.adresse && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{intervention.adresse}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline moderne */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">Intervention créée</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(intervention.cree).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">En cours de traitement</p>
                    <p className="text-sm text-muted-foreground">En attente de validation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Dates */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                  <p className="font-medium">
                    {new Date(intervention.cree).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Échéance</label>
                  <p className="font-medium">
                    {new Date(intervention.echeance).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides modernes */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                size="sm" 
                className="w-full justify-start hover:bg-blue-100 hover:text-blue-600"
                onClick={() => handleAction('status')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier statut
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start hover:bg-green-100 hover:text-green-600"
                onClick={() => handleAction('contact-client')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacter client
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start hover:bg-orange-100 hover:text-orange-600"
                onClick={() => handleAction('contact-artisan')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contacter artisan
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start hover:bg-purple-100 hover:text-purple-600"
                onClick={() => handleAction('export')}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
            </CardContent>
          </Card>

          {/* Documents modernes */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Documents
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction('add-document')}
                  className="hover:bg-purple-100 hover:text-purple-600"
                >
                  <FilePlus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Devis.pdf</span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Facture.pdf</span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-green-100">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 