import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Bot } from 'lucide-react';

interface AiAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: string;
  isLoading?: boolean;
}

export const AiAnswerModal: React.FC<AiAnswerModalProps> = ({
  isOpen,
  onClose,
  answer,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Réponse IA
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">L'IA réfléchit...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="whitespace-pre-wrap">{answer}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 