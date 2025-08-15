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
  Shield,
  Home,
  Building,
  User,
  Settings,
  Car,
  Leaf,
  Camera,
  Music,
  Heart,
  Star,
  Key,
  Sparkles,
  Truck
} from 'lucide-react';

// Types pour les badges
export type InterventionStatus = 'demande' | 'en_cours' | 'termine' | 'bloque';
export type ArtisanMetier = 'Plomberie' | 'Electricite' | 'Vitrerie' | 'Menuiserie' | 'Peinture' | 'Carrelage' | 'Chauffage' | 'Climatisation' | 'Serruerie' | 'Jardinage' | 'Nettoyage' | 'Demenagement' | 'Renovation' | 'Maintenance' | 'Securite' | 'Divers';

// Configuration des statuts
const STATUS_CONFIG = {
  demande: {
    label: 'Demande',
    icon: Clock,
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    iconClassName: 'text-blue-500'
  },
  en_cours: {
    label: 'En cours',
    icon: AlertCircle,
    className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    iconClassName: 'text-orange-500'
  },
  termine: {
    label: 'Terminé',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    iconClassName: 'text-green-500'
  },
  bloque: {
    label: 'Bloqué',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    iconClassName: 'text-red-500'
  }
} as const;

// Configuration des métiers avec icônes
const METIER_CONFIG = {
  Plomberie: { icon: Droplets, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  Electricite: { icon: Zap, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  Vitrerie: { icon: Shield, className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  Menuiserie: { icon: Hammer, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  Peinture: { icon: Palette, className: 'bg-purple-50 text-purple-700 border-purple-200' },
  Carrelage: { icon: Building, className: 'bg-stone-50 text-stone-700 border-stone-200' },
  Chauffage: { icon: Home, className: 'bg-red-50 text-red-700 border-red-200' },
  Climatisation: { icon: Zap, className: 'bg-sky-50 text-sky-700 border-sky-200' },
  Serruerie: { icon: Key, className: 'bg-gray-50 text-gray-700 border-gray-200' },
  Jardinage: { icon: Leaf, className: 'bg-green-50 text-green-700 border-green-200' },
  Nettoyage: { icon: Sparkles, className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  Demenagement: { icon: Truck, className: 'bg-orange-50 text-orange-700 border-orange-200' },
  Renovation: { icon: Wrench, className: 'bg-teal-50 text-teal-700 border-teal-200' },
  Maintenance: { icon: Settings, className: 'bg-slate-50 text-slate-700 border-slate-200' },
  Securite: { icon: Shield, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Divers: { icon: Star, className: 'bg-pink-50 text-pink-700 border-pink-200' }
} as const;

// Configuration des agences
const AGENCE_CONFIG = {
  'Paris Nord': { className: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Paris Sud': { className: 'bg-green-50 text-green-700 border-green-200' },
  'Paris Est': { className: 'bg-orange-50 text-orange-700 border-orange-200' },
  'Paris Ouest': { className: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Boulogne': { className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  'Issy-les-Moulineaux': { className: 'bg-teal-50 text-teal-700 border-teal-200' },
  'Vanves': { className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'Clichy': { className: 'bg-pink-50 text-pink-700 border-pink-200' },
  'Neuilly': { className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Levallois': { className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Courbevoie': { className: 'bg-rose-50 text-rose-700 border-rose-200' },
  'Puteaux': { className: 'bg-violet-50 text-violet-700 border-violet-200' },
  'Suresnes': { className: 'bg-lime-50 text-lime-700 border-lime-200' },
  'Saint-Cloud': { className: 'bg-sky-50 text-sky-700 border-sky-200' },
  'Garches': { className: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  'Vaucresson': { className: 'bg-stone-50 text-stone-700 border-stone-200' },
  'Marnes-la-Coquette': { className: 'bg-slate-50 text-slate-700 border-slate-200' },
  'Ville-d\'Avray': { className: 'bg-zinc-50 text-zinc-700 border-zinc-200' },
  'Sevres': { className: 'bg-neutral-50 text-neutral-700 border-neutral-200' }
} as const;

// Composant Badge de statut
interface StatusBadgeProps {
  status: InterventionStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  className = '' 
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={`${config.className} ${sizeClasses[size]} font-medium ${className}`}
      title={config.label}
    >
      <Icon className={`${config.iconClassName} ${iconSizes[size]} mr-1`} />
      {config.label}
    </Badge>
  );
};

// Composant Badge de métier
interface MetierBadgeProps {
  metier: ArtisanMetier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MetierBadge: React.FC<MetierBadgeProps> = ({ 
  metier, 
  size = 'md',
  className = '' 
}) => {
  const config = METIER_CONFIG[metier];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={`${config.className} ${sizeClasses[size]} font-medium ${className}`}
      title={metier}
    >
      <Icon className={`${iconSizes[size]} mr-1`} />
      {metier}
    </Badge>
  );
};

// Composant Badge d'agence
interface AgenceBadgeProps {
  agence: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AgenceBadge: React.FC<AgenceBadgeProps> = ({ 
  agence, 
  size = 'md',
  className = '' 
}) => {
  const config = AGENCE_CONFIG[agence as keyof typeof AGENCE_CONFIG] || AGENCE_CONFIG['Paris Nord'];
  
  const sizeClasses = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  return (
    <Badge 
      className={`${config.className} ${sizeClasses[size]} font-medium ${className}`}
      title={agence}
    >
      {agence}
    </Badge>
  );
};

// Composant Badge utilisateur avec avatar
interface UserBadgeProps {
  user: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ 
  user, 
  avatar,
  size = 'md',
  className = '' 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-3 text-sm',
    lg: 'h-8 px-4 text-base'
  };

  const avatarSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Badge 
      variant="outline"
      className={`bg-background ${sizeClasses[size]} font-medium ${className}`}
      title={user}
    >
      <Avatar className={`${avatarSizes[size]} mr-1`}>
        <AvatarImage src={avatar} alt={user} />
        <AvatarFallback className="text-xs">
          {getInitials(user)}
        </AvatarFallback>
      </Avatar>
      {user}
    </Badge>
  );
};

// Export des configurations pour usage externe
export { STATUS_CONFIG, METIER_CONFIG, AGENCE_CONFIG };
