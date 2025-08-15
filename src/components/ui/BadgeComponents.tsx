import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Palette,
  TreePine,
  Car,
  Building,
  Home,
  Shield,
  Settings,
  User,
  MapPin
} from 'lucide-react';

// Types pour les badges
export type InterventionStatus = 'demande' | 'devis_envoye' | 'accepte' | 'en_cours' | 'annule' | 'termine' | 'visite_technique' | 'refuse' | 'stand_by' | 'sav' | 'bloque';
export type ArtisanMetier = 'Plomberie' | 'Electricite' | 'Vitrerie' | 'Menuiserie' | 'Peinture' | 'Jardinage' | 'Mecanique' | 'Batiment' | 'Amenagement' | 'Securite' | 'Maintenance' | 'Nettoyage' | 'Chauffage' | 'Climatisation' | 'Eclairage' | 'Isolation';

// Configuration des statuts
const STATUS_CONFIG = {
  demande: {
    label: 'Demandé',
    icon: Clock,
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    iconClassName: 'text-blue-500'
  },
  devis_envoye: {
    label: 'Devis Envoyé',
    icon: Clock,
    className: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    iconClassName: 'text-purple-500'
  },
  accepte: {
    label: 'Accepté',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    iconClassName: 'text-green-500'
  },
  en_cours: {
    label: 'En cours',
    icon: AlertCircle,
    className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    iconClassName: 'text-orange-500'
  },
  annule: {
    label: 'Annulé',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    iconClassName: 'text-red-500'
  },
  termine: {
    label: 'Terminé',
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    iconClassName: 'text-emerald-500'
  },
  visite_technique: {
    label: 'Visite Technique',
    icon: MapPin,
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
    iconClassName: 'text-indigo-500'
  },
  refuse: {
    label: 'Refusé',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    iconClassName: 'text-red-500'
  },
  stand_by: {
    label: 'STAND BY',
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    iconClassName: 'text-yellow-500'
  },
  sav: {
    label: 'SAV',
    icon: Wrench,
    className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
    iconClassName: 'text-gray-500'
  },
  bloque: {
    label: 'Bloqué',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    iconClassName: 'text-red-500'
  }
} as const;

// Configuration des métiers
const METIER_CONFIG = {
  Plomberie: {
    icon: Droplets,
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    iconClassName: 'text-blue-500'
  },
  Electricite: {
    icon: Zap,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    iconClassName: 'text-yellow-500'
  },
  Vitrerie: {
    icon: Shield,
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
    iconClassName: 'text-cyan-500'
  },
  Menuiserie: {
    icon: Hammer,
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    iconClassName: 'text-amber-500'
  },
  Peinture: {
    icon: Palette,
    className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    iconClassName: 'text-purple-500'
  },
  Jardinage: {
    icon: TreePine,
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    iconClassName: 'text-green-500'
  },
  Mecanique: {
    icon: Wrench,
    className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
    iconClassName: 'text-gray-500'
  },
  Batiment: {
    icon: Building,
    className: 'bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900/20 dark:text-stone-400 dark:border-stone-800',
    iconClassName: 'text-stone-500'
  },
  Amenagement: {
    icon: Home,
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
    iconClassName: 'text-indigo-500'
  },
  Securite: {
    icon: Shield,
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    iconClassName: 'text-red-500'
  },
  Maintenance: {
    icon: Settings,
    className: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800',
    iconClassName: 'text-slate-500'
  },
  Nettoyage: {
    icon: Droplets,
    className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800',
    iconClassName: 'text-sky-500'
  },
  Chauffage: {
    icon: Zap,
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    iconClassName: 'text-orange-500'
  },
  Climatisation: {
    icon: Zap,
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    iconClassName: 'text-blue-500'
  },
  Eclairage: {
    icon: Zap,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    iconClassName: 'text-yellow-500'
  },
  Isolation: {
    icon: Shield,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    iconClassName: 'text-emerald-500'
  }
} as const;

// Configuration des agences (couleurs neutres)
const AGENCE_CONFIG = {
  className: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800',
  iconClassName: 'text-slate-500'
};

// Props pour les badges
interface StatusBadgeProps {
  status: InterventionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

interface MetierBadgeProps {
  metier: ArtisanMetier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

interface AgenceBadgeProps {
  agence: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

interface UserBadgeProps {
  user: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Composant Badge de statut
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = '' 
}) => {
  const config = STATUS_CONFIG[status];
  
  // Protection contre les statuts non reconnus
  if (!config) {
    console.warn(`Statut non reconnu: ${status}`);
    return (
      <Badge className={`bg-gray-50 text-gray-700 border-gray-200 ${className}`}>
        {status}
      </Badge>
    );
  }
  
  const StatusIcon = config.icon;
  
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-7 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} ${className}`}>
      {showIcon && <StatusIcon className={`${config.iconClassName} ${iconSizes[size]} mr-1`} />}
      {config.label}
    </Badge>
  );
};

// Composant Badge de métier
export const MetierBadge: React.FC<MetierBadgeProps> = ({ 
  metier, 
  size = 'sm', 
  showIcon = true,
  className = '' 
}) => {
  const config = METIER_CONFIG[metier];
  const MetierIcon = config.icon;
  
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-7 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className={`${config.className} ${sizeClasses[size]} ${className}`}>
      {showIcon && <MetierIcon className={`${config.iconClassName} ${iconSizes[size]} mr-1`} />}
      {metier}
    </Badge>
  );
};

// Composant Badge d'agence
export const AgenceBadge: React.FC<AgenceBadgeProps> = ({ 
  agence, 
  size = 'sm', 
  showIcon = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-7 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className={`${AGENCE_CONFIG.className} ${sizeClasses[size]} ${className}`}>
      {showIcon && <MapPin className={`${AGENCE_CONFIG.iconClassName} ${iconSizes[size]} mr-1`} />}
      {agence}
    </Badge>
  );
};

// Composant Badge utilisateur avec avatar
export const UserBadge: React.FC<UserBadgeProps> = ({ 
  user, 
  avatar,
  size = 'sm',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-7 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const avatarSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Badge variant="outline" className={`${sizeClasses[size]} ${className}`}>
      <Avatar className={`${avatarSizes[size]} mr-1`}>
        {avatar ? (
          <AvatarImage src={avatar} alt={user} />
        ) : null}
        <AvatarFallback className="text-xs bg-primary/10 text-primary">
          {getInitials(user)}
        </AvatarFallback>
      </Avatar>
      {user}
    </Badge>
  );
};

// Export des configurations pour usage externe
export { STATUS_CONFIG, METIER_CONFIG, AGENCE_CONFIG };
