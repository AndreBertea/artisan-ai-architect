import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      // Première date ou nouvelle sélection
      onDateRangeChange({ from: date, to: null });
    } else {
      // Deuxième date
      if (date < dateRange.from) {
        onDateRangeChange({ from: date, to: dateRange.from });
      } else {
        onDateRangeChange({ from: dateRange.from, to: date });
      }
      setIsOpen(false);
    }
  };

  const clearDateRange = () => {
    onDateRangeChange({ from: null, to: null });
  };

  const formatDateRange = () => {
    if (!dateRange.from) {
      return "Sélectionner";
    }
    
    if (!dateRange.to) {
      return format(dateRange.from, 'dd/MM', { locale: fr });
    }
    
    return `${format(dateRange.from, 'dd/MM', { locale: fr })} - ${format(dateRange.to, 'dd/MM', { locale: fr })}`;
  };

  const isActive = dateRange.from !== null;

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`
              text-xs flex items-center gap-1.5 px-3 py-1.5 h-7
              ${isActive ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-700 border-gray-200'}
            `}
          >
            <Calendar className="h-3 w-3" />
            {isActive ? (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {dateRange.to ? 'P' : 'D'}
                </div>
                <span className="truncate max-w-24">{formatDateRange()}</span>
              </div>
            ) : (
              <span>Sélectionner</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange.from || new Date()}
            selected={{
              from: dateRange.from || undefined,
              to: dateRange.to || undefined
            }}
            onSelect={(range) => {
              if (range?.from) {
                handleDateSelect(range.from);
              }
              if (range?.to) {
                handleDateSelect(range.to);
              }
            }}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      {isActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearDateRange}
          className="absolute -top-2 -right-2 h-5 w-5 p-0 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm"
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      )}
    </div>
  );
};
