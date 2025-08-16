import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ARTISAN_DOSSIER_STATUS, ARTISAN_DOSSIER_LABELS } from '@/types/artisan';

interface ArtisanDossierStatusIconProps {
  status: ARTISAN_DOSSIER_STATUS;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ArtisanDossierStatusIcon: React.FC<ArtisanDossierStatusIconProps> = ({
  status,
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getStatusColor = (status: ARTISAN_DOSSIER_STATUS) => {
    switch (status) {
      case ARTISAN_DOSSIER_STATUS.INCOMPLET:
        return 'bg-red-500';
      case ARTISAN_DOSSIER_STATUS.A_FINALISER:
        return 'bg-yellow-500';
      case ARTISAN_DOSSIER_STATUS.COMPLET:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              ${sizeClasses[size]} rounded-full ${getStatusColor(status)} 
              flex-shrink-0 cursor-help transition-all duration-200 hover:scale-110
              ${className}
            `}
            aria-label={`Statut dossier : ${ARTISAN_DOSSIER_LABELS[status]}`}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>Statut dossier : {ARTISAN_DOSSIER_LABELS[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
