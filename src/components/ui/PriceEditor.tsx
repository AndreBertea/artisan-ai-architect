import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Euro } from 'lucide-react';

interface PriceEditorProps {
  value: number;
  onChange: (newValue: number) => void;
  label?: string;
  className?: string;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const PriceEditor: React.FC<PriceEditorProps> = ({
  value,
  onChange,
  label,
  className = '',
  step = 50,
  min = 0,
  max = 999999,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchroniser la valeur d'édition quand la prop value change
  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  // Focus sur l'input quand on passe en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleIncrement = () => {
    if (!disabled) {
      const newValue = Math.min(max, value + step);
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (!disabled) {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setEditValue(newValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputBlur = () => {
    handleSave();
  };

  const handleSave = () => {
    const numericValue = parseInt(editValue) || 0;
    const clampedValue = Math.max(min, Math.min(max, numericValue));
    onChange(clampedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const formatDisplayValue = (val: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
      
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
          title={`Diminuer de ${step}€`}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <div 
          className={`
            min-w-[80px] px-2 py-1 text-sm font-medium text-center rounded border cursor-pointer
            hover:bg-muted/50 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isEditing ? 'hidden' : ''}
          `}
          onClick={handleClick}
          title="Cliquer pour éditer"
        >
          {formatDisplayValue(value)}
        </div>

        {isEditing && (
          <Input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="h-8 w-20 text-sm text-center"
            placeholder="0"
          />
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 disabled:opacity-50"
          title={`Augmenter de ${step}€`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
