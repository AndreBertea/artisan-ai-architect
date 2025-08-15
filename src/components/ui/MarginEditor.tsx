import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Euro, Percent } from 'lucide-react';

interface MarginEditorProps {
  currentMargin: number;
  currentMarginPercentage: number;
  sst: number;
  materiaux: number;
  onInterventionChange: (newInterventionPrice: number) => void;
  className?: string;
  disabled?: boolean;
}

export const MarginEditor: React.FC<MarginEditorProps> = ({
  currentMargin,
  currentMarginPercentage,
  sst,
  materiaux,
  onInterventionChange,
  className = '',
  disabled = false
}) => {
  const [isEditingMargin, setIsEditingMargin] = useState(false);
  const [isEditingPercentage, setIsEditingPercentage] = useState(false);
  const [editMarginValue, setEditMarginValue] = useState(currentMargin.toString());
  const [editPercentageValue, setEditPercentageValue] = useState(currentMarginPercentage.toString());
  const marginInputRef = useRef<HTMLInputElement>(null);
  const percentageInputRef = useRef<HTMLInputElement>(null);

  // Synchroniser les valeurs d'édition quand les props changent
  useEffect(() => {
    setEditMarginValue(currentMargin.toString());
    setEditPercentageValue(currentMarginPercentage.toString());
  }, [currentMargin, currentMarginPercentage]);

  // Focus sur l'input quand on passe en mode édition
  useEffect(() => {
    if (isEditingMargin && marginInputRef.current) {
      marginInputRef.current.focus();
      marginInputRef.current.select();
    }
  }, [isEditingMargin]);

  useEffect(() => {
    if (isEditingPercentage && percentageInputRef.current) {
      percentageInputRef.current.focus();
      percentageInputRef.current.select();
    }
  }, [isEditingPercentage]);

  const calculateNewInterventionPrice = (targetMargin: number, targetPercentage: number, mode: 'euros' | 'percentage') => {
    const totalCosts = sst + materiaux;
    
    if (mode === 'euros') {
      // Si on modifie la marge en euros
      return totalCosts + targetMargin;
    } else {
      // Si on modifie le pourcentage
      if (targetPercentage <= 0) return totalCosts;
      return totalCosts / (1 - targetPercentage / 100);
    }
  };

  const handleMarginIncrement = () => {
    if (!disabled) {
      const newMargin = currentMargin + 50;
      const newInterventionPrice = calculateNewInterventionPrice(newMargin, currentMarginPercentage, 'euros');
      onInterventionChange(Math.round(newInterventionPrice * 100) / 100);
    }
  };

  const handleMarginDecrement = () => {
    if (!disabled) {
      const newMargin = Math.max(0, currentMargin - 50);
      const newInterventionPrice = calculateNewInterventionPrice(newMargin, currentMarginPercentage, 'euros');
      onInterventionChange(Math.round(newInterventionPrice * 100) / 100);
    }
  };

  const handlePercentageIncrement = () => {
    if (!disabled) {
      const newPercentage = Math.min(99, currentMarginPercentage + 5);
      const newInterventionPrice = calculateNewInterventionPrice(currentMargin, newPercentage, 'percentage');
      onInterventionChange(Math.round(newInterventionPrice * 100) / 100);
    }
  };

  const handlePercentageDecrement = () => {
    if (!disabled) {
      const newPercentage = Math.max(0, currentMarginPercentage - 5);
      const newInterventionPrice = calculateNewInterventionPrice(currentMargin, newPercentage, 'percentage');
      onInterventionChange(Math.round(newInterventionPrice * 100) / 100);
    }
  };

  const handleMarginClick = () => {
    if (!disabled) {
      setIsEditingMargin(true);
      setIsEditingPercentage(false);
    }
  };

  const handlePercentageClick = () => {
    if (!disabled) {
      setIsEditingPercentage(true);
      setIsEditingMargin(false);
    }
  };

  const handleMarginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9,.]/g, '').replace(',', '.');
    setEditMarginValue(newValue);
  };

  const handlePercentageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9,.]/g, '').replace(',', '.');
    setEditPercentageValue(newValue);
  };

  const handleMarginInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMarginSave();
    } else if (e.key === 'Escape') {
      handleMarginCancel();
    }
  };

  const handlePercentageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePercentageSave();
    } else if (e.key === 'Escape') {
      handlePercentageCancel();
    }
  };

  const handleMarginInputBlur = () => {
    handleMarginSave();
  };

  const handlePercentageInputBlur = () => {
    handlePercentageSave();
  };

  const handleMarginSave = () => {
    const numericValue = parseFloat(editMarginValue) || 0;
    const newInterventionPrice = calculateNewInterventionPrice(numericValue, currentMarginPercentage, 'euros');
    onInterventionChange(Math.round(newInterventionPrice * 100) / 100);
    setIsEditingMargin(false);
  };

  const handlePercentageSave = () => {
    const numericValue = parseFloat(editPercentageValue) || 0;
    const clampedValue = Math.max(0, Math.min(99, numericValue));
    const newInterventionPrice = calculateNewInterventionPrice(currentMargin, clampedValue, 'percentage');
    onInterventionChange(Math.round(newInterventionPrice * 100) / 100);
    setIsEditingPercentage(false);
  };

  const handleMarginCancel = () => {
    setEditMarginValue(currentMargin.toString());
    setIsEditingMargin(false);
  };

  const handlePercentageCancel = () => {
    setEditPercentageValue(currentMarginPercentage.toString());
    setIsEditingPercentage(false);
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(val);
  };

  const formatPercentage = (val: number): string => {
    return `${Math.round(val)}%`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Marge en euros */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Marge:
        </span>
        
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMarginDecrement}
            disabled={disabled}
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
            title="Diminuer de 50€"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <div 
            className={`
              min-w-[100px] px-2 py-1 text-sm font-medium text-center rounded border cursor-pointer
              hover:bg-muted/50 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isEditingMargin ? 'hidden' : ''}
            `}
            onClick={handleMarginClick}
            title="Cliquer pour éditer la marge"
          >
            {formatCurrency(currentMargin)}
          </div>

          {isEditingMargin && (
            <Input
              ref={marginInputRef}
              type="text"
              value={editMarginValue}
              onChange={handleMarginInputChange}
              onKeyDown={handleMarginInputKeyDown}
              onBlur={handleMarginInputBlur}
              className="h-8 w-24 text-sm text-center"
              placeholder="0"
            />
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMarginIncrement}
            disabled={disabled}
            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 disabled:opacity-50"
            title="Augmenter de 50€"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Marge en pourcentage */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Pourcentage:
        </span>
        
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePercentageDecrement}
            disabled={disabled}
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
            title="Diminuer de 5%"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <div 
            className={`
              min-w-[60px] px-2 py-1 text-sm font-medium text-center rounded border cursor-pointer
              hover:bg-muted/50 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isEditingPercentage ? 'hidden' : ''}
            `}
            onClick={handlePercentageClick}
            title="Cliquer pour éditer le pourcentage"
          >
            {formatPercentage(currentMarginPercentage)}
          </div>

          {isEditingPercentage && (
            <Input
              ref={percentageInputRef}
              type="text"
              value={editPercentageValue}
              onChange={handlePercentageInputChange}
              onKeyDown={handlePercentageInputKeyDown}
              onBlur={handlePercentageInputBlur}
              className="h-8 w-16 text-sm text-center"
              placeholder="0"
            />
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePercentageIncrement}
            disabled={disabled}
            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 disabled:opacity-50"
            title="Augmenter de 5%"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
