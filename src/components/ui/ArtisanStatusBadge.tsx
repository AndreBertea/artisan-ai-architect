import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Star, 
  TrendingUp, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Crown, 
  Archive 
} from 'lucide-react';
import { ARTISAN_STATUS, ARTISAN_STATUS_LABELS, ARTISAN_STATUS_COLORS } from '@/types/artisan';

// Configuration des icônes pour chaque statut
const ARTISAN_STATUS_ICONS = {
  [ARTISAN_STATUS.CANDIDAT]: User,
  [ARTISAN_STATUS.ONE_SHOT]: Star,
  [ARTISAN_STATUS.POTENTIEL]: TrendingUp,
  [ARTISAN_STATUS.NOVICE]: GraduationCap,
  [ARTISAN_STATUS.FORMATION]: BookOpen,
  [ARTISAN_STATUS.CONFIRME]: Award,
  [ARTISAN_STATUS.EXPERT]: Crown,
  [ARTISAN_STATUS.ARCHIVER]: Archive,
} as const;

interface ArtisanStatusBadgeProps {
  status: ARTISAN_STATUS;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  tooltip?: boolean;
}

export const ArtisanStatusBadge: React.FC<ArtisanStatusBadgeProps> = ({ 
  status, 
  size = 'sm', 
  showIcon = true,
  className = '',
  tooltip = true
}) => {
  const colors = ARTISAN_STATUS_COLORS[status];
  const label = ARTISAN_STATUS_LABELS[status];
  const IconComponent = ARTISAN_STATUS_ICONS[status];
  
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

  const badgeContent = (
    <Badge 
      className={`${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border || colors.bg,
      }}
      title={tooltip ? label : undefined}
    >
      {showIcon && <IconComponent className={`${iconSizes[size]} mr-1`} />}
      {label}
    </Badge>
  );

  return badgeContent;
};

// Export des configurations pour usage externe
export { ARTISAN_STATUS_ICONS };
