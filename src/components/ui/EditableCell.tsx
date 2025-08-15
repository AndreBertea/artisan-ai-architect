import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Euro, Percent } from 'lucide-react';

interface EditableCellProps {
  value: number;
  onChange: (newValue: number) => void;
  type: 'currency' | 'percentage';
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  type,
  className = '',
  disabled = false,
  placeholder = '0',
  min = 0,
  max = type === 'percentage' ? 100 : 999999
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

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Nettoyer la valeur selon le type
    if (type === 'currency') {
      // Permettre seulement les chiffres et la virgule/point
      newValue = newValue.replace(/[^0-9,.]/g, '').replace(',', '.');
    } else if (type === 'percentage') {
      // Permettre seulement les chiffres et la virgule/point
      newValue = newValue.replace(/[^0-9,.]/g, '').replace(',', '.');
    }
    
    setEditValue(newValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentValue = parseFloat(editValue) || 0;
      const step = type === 'currency' ? 0.01 : 1; // Pas de 0.01€ (1 centime) pour la monnaie, 1% pour le pourcentage
      const newValue = Math.min(max, currentValue + step);
      const roundedValue = type === 'currency' ? Math.round(newValue * 100) / 100 : newValue;
      setEditValue(roundedValue.toString());
      // Application en temps réel
      onChange(roundedValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentValue = parseFloat(editValue) || 0;
      const step = type === 'currency' ? 0.01 : 1; // Pas de 0.01€ (1 centime) pour la monnaie, 1% pour le pourcentage
      const newValue = Math.max(min, currentValue - step);
      const roundedValue = type === 'currency' ? Math.round(newValue * 100) / 100 : newValue;
      setEditValue(roundedValue.toString());
      // Application en temps réel
      onChange(roundedValue);
    }
  };

  const handleInputBlur = () => {
    handleSave();
  };

  const handleSave = () => {
    const numericValue = parseFloat(editValue) || 0;
    const clampedValue = Math.max(min, Math.min(max, numericValue));
    const roundedValue = type === 'currency' ? Math.round(clampedValue * 100) / 100 : clampedValue;
    onChange(roundedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const formatDisplayValue = (val: number): string => {
    if (type === 'currency') {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(val);
    } else {
      return `${Math.round(val)}%`;
    }
  };

  const getInputWidth = () => {
    if (type === 'currency') return 'w-24';
    if (type === 'percentage') return 'w-16';
    return 'w-20';
  };

  const getIcon = () => {
    if (type === 'currency') return <Euro className="h-3 w-3" />;
    if (type === 'percentage') return <Percent className="h-3 w-3" />;
    return null;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {getIcon()}
      
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className={`h-8 text-sm text-center ${getInputWidth()}`}
          placeholder={placeholder}
        />
      ) : (
        <div 
          className={`
            min-w-[80px] px-2 py-1 text-sm font-medium text-center rounded border cursor-pointer
            hover:bg-muted/50 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={handleClick}
          title="Cliquer pour éditer"
        >
          {formatDisplayValue(value)}
        </div>
      )}
    </div>
  );
};
