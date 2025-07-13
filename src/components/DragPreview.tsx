import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, User, FileText } from 'lucide-react';

interface DragPreviewProps {
  isVisible: boolean;
  position: { x: number; y: number };
  item: {
    type: 'intervention' | 'artisan' | 'client';
    id: string;
    name: string;
  } | null;
}

export const DragPreview: React.FC<DragPreviewProps> = ({ isVisible, position, item }) => {
  if (!isVisible || !item) return null;

  const getIcon = () => {
    switch (item.type) {
      case 'artisan':
        return <Wrench className="h-4 w-4" />;
      case 'client':
        return <User className="h-4 w-4" />;
      case 'intervention':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'artisan':
        return 'Artisan';
      case 'client':
        return 'Client';
      case 'intervention':
        return 'Intervention';
      default:
        return '';
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'artisan':
        return 'bg-blue-500';
      case 'client':
        return 'bg-green-500';
      case 'intervention':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x + 10,
        top: position.y - 20,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <Card className="shadow-xl border-2 border-dashed border-primary bg-background/95 backdrop-blur-sm animate-pulse">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${getTypeColor()} text-white border-0`}>
              {getIcon()}
              <span className="ml-1">{getTypeLabel()}</span>
            </Badge>
            <span className="text-sm font-medium truncate max-w-32">
              {item.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 