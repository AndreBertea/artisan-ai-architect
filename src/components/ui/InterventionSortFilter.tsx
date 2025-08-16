import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Euro } from 'lucide-react';

export type SortField = 'cree' | 'echeance' | 'marge';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface InterventionSortFilterProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  className?: string;
}

export const InterventionSortFilter: React.FC<InterventionSortFilterProps> = ({
  sortConfig,
  onSortChange,
  className = ''
}) => {
  const sortOptions = [
    { 
      field: 'cree' as SortField, 
      label: 'Date de création',
      icon: Calendar
    },
    { 
      field: 'echeance' as SortField, 
      label: 'Date d\'échéance',
      icon: Clock
    },
    { 
      field: 'marge' as SortField, 
      label: 'Marge (€)',
      icon: Euro
    }
  ];

  const handleSort = (field: SortField, direction: SortDirection) => {
    onSortChange({ field, direction });
  };

  const getSortDirection = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">Trier par:</span>
      
      <div className="flex items-center space-x-1">
        {sortOptions.map((option) => {
          const IconComponent = option.icon;
          const currentDirection = getSortDirection(option.field);
          const isActive = sortConfig.field === option.field;
          
          return (
            <div key={option.field} className="flex items-center space-x-1">
              <div className="flex items-center space-x-1 bg-gray-50 rounded-md p-1">
                <IconComponent className={`h-3 w-3 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                
                {/* Flèche vers le haut */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort(option.field, 'asc')}
                  className={`
                    h-5 w-5 p-0 hover:bg-blue-100
                    ${currentDirection === 'asc' ? 'text-blue-600 bg-blue-100' : 'text-gray-400'}
                  `}
                >
                  ↑
                </Button>
                
                {/* Flèche vers le bas */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort(option.field, 'desc')}
                  className={`
                    h-5 w-5 p-0 hover:bg-blue-100
                    ${currentDirection === 'desc' ? 'text-blue-600 bg-blue-100' : 'text-gray-400'}
                  `}
                >
                  ↓
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
