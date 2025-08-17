import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  ChevronUp,
  Wrench,
  Briefcase,
  Activity,
  X,
  Play
} from 'lucide-react';

import { ARTISAN_STATUS, ARTISAN_DOSSIER_STATUS, Artisan } from '@/types/artisan';
import { EditableCell } from './EditableCell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Configuration des statuts d'interventions avec icônes et couleurs
const interventionStatusConfig = {
  demande: { 
    label: 'Demandé', 
    icon: Clock, 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    activeColor: 'bg-blue-500 text-white'
  },
  devis_envoye: { 
    label: 'Devis Envoyé', 
    icon: FileText, 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    activeColor: 'bg-purple-500 text-white'
  },
  accepte: { 
    label: 'Accepté', 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-700 border-green-200',
    activeColor: 'bg-green-500 text-white'
  },
  en_cours: { 
    label: 'Inter en cours', 
    icon: Play, 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    activeColor: 'bg-orange-500 text-white'
  },
  annulee: { 
    label: 'Annulé', 
    icon: Clock, 
    color: 'bg-red-100 text-red-700 border-red-200',
    activeColor: 'bg-red-500 text-white'
  },
  terminee: { 
    label: 'Inter terminée', 
    icon: CheckCircle, 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    activeColor: 'bg-emerald-500 text-white'
  },
  visite_technique: { 
    label: 'Visite Technique', 
    icon: Clock, 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    activeColor: 'bg-indigo-500 text-white'
  },
  refuse: { 
    label: 'Refusé', 
    icon: Clock, 
    color: 'bg-red-100 text-red-700 border-red-200',
    activeColor: 'bg-red-500 text-white'
  },
  stand_by: { 
    label: 'STAND BY', 
    icon: Clock, 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    activeColor: 'bg-yellow-500 text-white'
  },
  sav: { 
    label: 'SAV', 
    icon: Clock, 
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    activeColor: 'bg-pink-500 text-white'
  },
  att_acompte: { 
    label: 'Att Acompte', 
    icon: Clock, 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    activeColor: 'bg-cyan-500 text-white'
  }
};

interface ArtisanRealCardProps {
  artisan: Artisan;
  interventions?: Record<string, number>;
  assignedUser?: string;
  onEdit?: (artisan: Artisan) => void;
  onSendEmail?: (artisan: Artisan) => void;
  onCall?: (artisan: Artisan) => void;
  onAddDocument?: (artisan: Artisan) => void;
  onStatusChange?: (artisan: Artisan, newStatus: ARTISAN_STATUS) => void;
  onDossierStatusChange?: (artisan: Artisan, newStatus: ARTISAN_DOSSIER_STATUS) => void;
  onMetierChange?: (artisan: Artisan, metier: string) => void;
  onEmailChange?: (artisan: Artisan, email: string) => void;
  onTelephoneChange?: (artisan: Artisan, telephone: string) => void;
  onAdresseChange?: (artisan: Artisan, adresse: string) => void;
  onDisponibiliteChange?: (artisan: Artisan, disponibilite: string) => void;
  className?: string;
  hideBorder?: boolean;
  keyboardHovered?: boolean;
  selectedActionIndex?: number;
  selectedCardIndex?: number;
}

// Configuration des statuts d'artisan avec icônes et couleurs
const artisanStatusConfig = {
  [ARTISAN_STATUS.CANDIDAT]: { 
    label: 'Candidat', 
    icon: User, 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    activeColor: 'bg-gray-500 text-white'
  },
  [ARTISAN_STATUS.ONE_SHOT]: { 
    label: 'One shot', 
    icon: Clock, 
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    activeColor: 'bg-slate-500 text-white'
  },
  [ARTISAN_STATUS.POTENTIEL]: { 
    label: 'Potentiel', 
    icon: Activity, 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    activeColor: 'bg-blue-500 text-white'
  },
  [ARTISAN_STATUS.NOVICE]: { 
    label: 'Novice', 
    icon: User, 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    activeColor: 'bg-indigo-500 text-white'
  },
  [ARTISAN_STATUS.FORMATION]: { 
    label: 'Formation', 
    icon: Wrench, 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    activeColor: 'bg-yellow-500 text-white'
  },
  [ARTISAN_STATUS.CONFIRME]: { 
    label: 'Confirmé', 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-700 border-green-200',
    activeColor: 'bg-green-500 text-white'
  },
  [ARTISAN_STATUS.EXPERT]: { 
    label: 'Expert', 
    icon: CheckCircle, 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    activeColor: 'bg-emerald-500 text-white'
  },
  [ARTISAN_STATUS.ARCHIVER]: { 
    label: 'Archivé', 
    icon: FileText, 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    activeColor: 'bg-gray-500 text-white'
  }
};

// Configuration des statuts de dossier
const dossierStatusConfig = {
  [ARTISAN_DOSSIER_STATUS.INCOMPLET]: { 
    label: 'Incomplet', 
    color: 'bg-red-100 text-red-700 border-red-200',
    activeColor: 'bg-red-500 text-white',
    borderColor: 'border-l-red-500'
  },
  [ARTISAN_DOSSIER_STATUS.A_FINALISER]: { 
    label: 'À finaliser', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    activeColor: 'bg-orange-500 text-white',
    borderColor: 'border-l-orange-500'
  },
  [ARTISAN_DOSSIER_STATUS.COMPLET]: { 
    label: 'Complet', 
    color: 'bg-green-100 text-green-700 border-green-200',
    activeColor: 'bg-green-500 text-white',
    borderColor: 'border-l-green-500'
  }
};

export const ArtisanRealCard: React.FC<ArtisanRealCardProps> = ({
  artisan,
  interventions,
  assignedUser,
  onEdit,
  onSendEmail,
  onCall,
  onAddDocument,
  onStatusChange,
  onDossierStatusChange,
  onMetierChange,
  onEmailChange,
  onTelephoneChange,
  onAdresseChange,
  onDisponibiliteChange,
  className = '',
  hideBorder = false,
  keyboardHovered = false,
  selectedActionIndex = -1,
  selectedCardIndex = -1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusEdit, setShowStatusEdit] = useState(false);
  const [showDossierStatusEdit, setShowDossierStatusEdit] = useState(false);

  const navigate = useNavigate();

  // Gérer l'ouverture/fermeture de la carte au clic
  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Combiner le hover de la souris avec le hover du clavier
  const isAnyHovered = isHovered || keyboardHovered;

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };



  return (
    <>
      <Card 
        className={`
          transition-all duration-200 cursor-pointer relative overflow-hidden
          ${hideBorder ? 'border-0 shadow-none' : 'border border-gray-200'}
          ${isAnyHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm'}
          ${isExpanded ? 'shadow-xl border-primary' : ''}
          ${dossierStatusConfig[artisan.artisanDossierStatus].borderColor}
          ${isHovered ? 'border-l-8' : 'border-l-4'}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        data-artisan-id={artisan.id}
      >
        {/* Effet de fade de droite à gauche */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/20 to-gray-50/40 pointer-events-none transition-opacity duration-200" />
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            {/* Colonne 1: Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                
                {/* Nom et statuts */}
                <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                     <h3 className="font-semibold text-lg truncate">{artisan.name}</h3>
                     <Badge className={artisanStatusConfig[artisan.artisanStatus].color}>
                       {artisanStatusConfig[artisan.artisanStatus].label}
                     </Badge>
                     <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                       {artisan.interventionsRealisees} interventions
                     </Badge>
                     
                     {/* Bulles des interventions par statut */}
                     {interventions && (
                       <div className="flex items-center space-x-1 ml-2">
                         {Object.entries(interventionStatusConfig)
                           .filter(([status, config]) => {
                             const count = interventions[status] || 0;
                             return count > 0;
                           })
                           .map(([status, config]) => {
                             const count = interventions[status] || 0;
                             const Icon = config.icon;
                             return (
                               <TooltipProvider key={status}>
                                 <Tooltip>
                                   <TooltipTrigger asChild>
                                     <div className={`p-1 rounded-full ${config.color} flex items-center space-x-1`}>
                                       <Icon className="h-3 w-3" />
                                       <span className="text-xs font-medium">{count}</span>
                                     </div>
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <p>{config.label}: {count}</p>
                                   </TooltipContent>
                                 </Tooltip>
                               </TooltipProvider>
                             );
                           })}
                       </div>
                     )}
                   </div>
                   
                   {/* Métier, disponibilité, utilisateur assigné et statut dossier */}
                   <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                     <div className="flex items-center space-x-1">
                       <Briefcase className="h-4 w-4" />
                       <span>{artisan.metier}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <Activity className="h-4 w-4" />
                       <span>{artisan.disponibilite}</span>
                     </div>
                     {assignedUser && (
                       <div className="flex items-center space-x-1">
                         <User className="h-4 w-4" />
                         <span>{assignedUser}</span>
                       </div>
                     )}
                     <Badge className={dossierStatusConfig[artisan.artisanDossierStatus].color}>
                       {dossierStatusConfig[artisan.artisanDossierStatus].label}
                     </Badge>
                   </div>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{artisan.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{artisan.telephone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{artisan.adresse}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Inscrit le {formatDate(artisan.dateInscription)}</span>
                  </div>
                                     <div className="flex items-center space-x-2">
                     <CheckCircle className="h-4 w-4 text-muted-foreground" />
                     <span>{artisan.interventionsRealisees} interventions</span>
                   </div>
                 </div>
               </div>


            </div>

            {/* Colonne 2: Actions */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              {/* Actions principales */}
              <div className="flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendEmail?.(artisan);
                        }}
                                                 className={`h-8 w-8 p-0 email-button hover:scale-110 transition-transform duration-200 ${
                           selectedActionIndex === 0 && keyboardHovered ? 'bg-primary text-primary-foreground' : ''
                         }`}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Envoyer un email</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCall?.(artisan);
                        }}
                                                 className={`h-8 w-8 p-0 phone-button hover:scale-110 transition-transform duration-200 ${
                           selectedActionIndex === 1 && keyboardHovered ? 'bg-primary text-primary-foreground' : ''
                         }`}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Appeler</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddDocument?.(artisan);
                        }}
                                                 className={`h-8 w-8 p-0 document-button hover:scale-110 transition-transform duration-200 ${
                           selectedActionIndex === 2 && keyboardHovered ? 'bg-primary text-primary-foreground' : ''
                         }`}
                      >
                        <FilePlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ajouter un document</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Menu déroulant */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(artisan)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/artisans/${artisan.id}`)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir en détail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSendEmail?.(artisan)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCall?.(artisan)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Section étendue pour les modifications */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                {/* En-tête de la section étendue */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Détails et modifications
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Informations détaillées */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Métier</label>
                      <EditableCell
                        value={artisan.metier}
                        onSave={(value) => onMetierChange?.(artisan, value)}
                        editing={false}
                        onEdit={() => {}}
                        onCancel={() => {}}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <EditableCell
                        value={artisan.email}
                        onSave={(value) => onEmailChange?.(artisan, value)}
                        editing={false}
                        onEdit={() => {}}
                        onCancel={() => {}}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Téléphone</label>
                      <EditableCell
                        value={artisan.telephone}
                        onSave={(value) => onTelephoneChange?.(artisan, value)}
                        editing={false}
                        onEdit={() => {}}
                        onCancel={() => {}}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Adresse</label>
                      <EditableCell
                        value={artisan.adresse}
                        onSave={(value) => onAdresseChange?.(artisan, value)}
                        editing={false}
                        onEdit={() => {}}
                        onCancel={() => {}}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Disponibilité</label>
                      <EditableCell
                        value={artisan.disponibilite}
                        onSave={(value) => onDisponibiliteChange?.(artisan, value)}
                        editing={false}
                        onEdit={() => {}}
                        onCancel={() => {}}
                      />
                    </div>

                  </div>
                </div>

                {/* Statuts modifiables */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut d'artisan</label>
                    <DropdownMenu open={showStatusEdit} onOpenChange={setShowStatusEdit}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <Badge className={artisanStatusConfig[artisan.artisanStatus].color}>
                            {artisanStatusConfig[artisan.artisanStatus].label}
                          </Badge>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {Object.entries(artisanStatusConfig).map(([status, config]) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => {
                              onStatusChange?.(artisan, status as ARTISAN_STATUS);
                              setShowStatusEdit(false);
                            }}
                          >
                            <Badge className={config.color}>
                              {config.label}
                            </Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut de dossier</label>
                    <DropdownMenu open={showDossierStatusEdit} onOpenChange={setShowDossierStatusEdit}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <Badge className={dossierStatusConfig[artisan.artisanDossierStatus].color}>
                            {dossierStatusConfig[artisan.artisanDossierStatus].label}
                          </Badge>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {Object.entries(dossierStatusConfig).map(([status, config]) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => {
                              onDossierStatusChange?.(artisan, status as ARTISAN_DOSSIER_STATUS);
                              setShowDossierStatusEdit(false);
                            }}
                          >
                            <Badge className={config.color}>
                              {config.label}
                            </Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Actions étendues */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendEmail?.(artisan);
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCall?.(artisan);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDocument?.(artisan);
                    }}
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Document
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(artisan);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </>
  );
};
