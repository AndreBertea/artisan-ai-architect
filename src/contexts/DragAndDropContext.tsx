import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface DraggedItem {
  type: 'intervention' | 'artisan' | 'client';
  id: string;
  name: string;
  data: any;
}

interface DragAndDropContextType {
  draggedItem: DraggedItem | null;
  isDragging: boolean;
  dragPosition: { x: number; y: number };
  startDrag: (item: DraggedItem, event: React.MouseEvent) => void;
  stopDrag: () => void;
  onDrop: (callback: (item: DraggedItem) => void) => void;
  removeDropCallback: () => void;
  onMessagerieHover: () => void;
  onMessagerieLeave: () => void;
  startTouchDrag: (item: DraggedItem, event: React.TouchEvent) => void;
}

const DragAndDropContext = createContext<DragAndDropContextType | undefined>(undefined);

export const DragAndDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagerieHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const mouseDownTime = useRef(0);
  const dropCallback = useRef<((item: DraggedItem) => void) | null>(null);

  const startDrag = (item: DraggedItem, event: React.MouseEvent) => {
    // Vérifier si on est déjà en train de dragger
    if (isDragging) return;
    
    dragStartPosition.current = { x: event.clientX, y: event.clientY };
    isMouseDown.current = true;
    mouseDownTime.current = Date.now();
    
    // Délai de 1 seconde avant de commencer le drag
    dragTimeoutRef.current = setTimeout(() => {
      if (isMouseDown.current) {
        setIsDragging(true);
        setDraggedItem(item);
        setDragPosition({ x: event.clientX, y: event.clientY });
        
        // Empêcher la sélection de texte
        event.preventDefault();
        
        // Désactiver la sélection de texte sur tout le document
        document.body.style.userSelect = 'none';
        document.body.style.setProperty('-webkit-user-select', 'none');
        document.body.style.setProperty('-moz-user-select', 'none');
        document.body.style.setProperty('-ms-user-select', 'none');
      }
    }, 1000);
  };

  const updateDragPosition = (event: MouseEvent) => {
    if (isDragging) {
      setDragPosition({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    }
  };

  const preventSelection = (event: Event) => {
    if (isDragging) {
      event.preventDefault();
    }
  };

  const stopDrag = () => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    if (messagerieHoverTimeoutRef.current) {
      clearTimeout(messagerieHoverTimeoutRef.current);
      messagerieHoverTimeoutRef.current = null;
    }
    isMouseDown.current = false;
    setIsDragging(false);
    setDraggedItem(null);
    
    // Restaurer la sélection de texte
    document.body.style.userSelect = '';
    document.body.style.setProperty('-webkit-user-select', '');
    document.body.style.setProperty('-moz-user-select', '');
    document.body.style.setProperty('-ms-user-select', '');
  };

  const onMessagerieHover = () => {
    if (isDragging) {
      // Délai de 0,5 seconde avant d'ouvrir la messagerie
      messagerieHoverTimeoutRef.current = setTimeout(() => {
        // Simuler un clic sur la messagerie pour ouvrir la page
        const messagerieLink = document.querySelector('a[href="/messagerie"]') as HTMLAnchorElement;
        if (messagerieLink) {
          messagerieLink.click();
        }
      }, 500);
    }
  };

  const onMessagerieLeave = () => {
    if (messagerieHoverTimeoutRef.current) {
      clearTimeout(messagerieHoverTimeoutRef.current);
      messagerieHoverTimeoutRef.current = null;
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      updateDragPosition(event);
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    if (isDragging && draggedItem && dropCallback.current) {
      dropCallback.current(draggedItem);
    }
    stopDrag();
  };

  const handleMouseDown = (event: MouseEvent) => {
    // Si on relâche la souris avant 1 seconde, annuler le drag
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const onDrop = (callback: (item: DraggedItem) => void) => {
    dropCallback.current = callback;
  };

  const removeDropCallback = () => {
    dropCallback.current = null;
  };

  // --- GESTION TACTILE ---
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTouchDragging = useRef(false);
  const touchDraggedItem = useRef<DraggedItem | null>(null);

  // Démarrer le drag tactile (appui long)
  const startTouchDrag = (item: DraggedItem, event: React.TouchEvent) => {
    if (isDragging) return;
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchDraggedItem.current = item;
    // Délai de 1s avant de démarrer le drag
    touchDragTimeoutRef.current = setTimeout(() => {
      isTouchDragging.current = true;
      setIsDragging(true);
      setDraggedItem(item);
      setDragPosition({ x: touch.clientX, y: touch.clientY });
      // Désactiver la sélection de texte
      document.body.style.userSelect = 'none';
      document.body.style.setProperty('-webkit-user-select', 'none');
      document.body.style.setProperty('-moz-user-select', 'none');
      document.body.style.setProperty('-ms-user-select', 'none');
    }, 1000);
  };

  // Suivre le doigt
  const handleTouchMove = (event: TouchEvent) => {
    if (isTouchDragging.current && event.touches.length === 1) {
      const touch = event.touches[0];
      setDragPosition({ x: touch.clientX, y: touch.clientY });
      event.preventDefault();
    }
  };

  // Arrêter le drag tactile
  const handleTouchEnd = () => {
    if (touchDragTimeoutRef.current) {
      clearTimeout(touchDragTimeoutRef.current);
      touchDragTimeoutRef.current = null;
    }
    if (isTouchDragging.current && draggedItem && dropCallback.current) {
      dropCallback.current(draggedItem);
    }
    isTouchDragging.current = false;
    touchDraggedItem.current = null;
    stopDrag();
  };

  // Annuler si on retire le doigt avant 1s
  const handleTouchCancel = () => {
    if (touchDragTimeoutRef.current) {
      clearTimeout(touchDragTimeoutRef.current);
      touchDragTimeoutRef.current = null;
    }
    isTouchDragging.current = false;
    touchDraggedItem.current = null;
    stopDrag();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('selectstart', preventSelection);
      document.addEventListener('dragstart', preventSelection);
      // Ajout tactile
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchCancel);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('selectstart', preventSelection);
        document.removeEventListener('dragstart', preventSelection);
        // Nettoyage tactile
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchCancel);
      };
    }
  }, [isDragging, draggedItem]);

  // Gestionnaire global pour annuler le drag si on relâche la souris
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <DragAndDropContext.Provider
      value={{
        draggedItem,
        isDragging,
        dragPosition,
        startDrag,
        stopDrag,
        onDrop,
        removeDropCallback,
        onMessagerieHover,
        onMessagerieLeave,
        // Ajout pour le tactile
        startTouchDrag
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};

export const useDragAndDrop = () => {
  const context = useContext(DragAndDropContext);
  if (context === undefined) {
    throw new Error('useDragAndDrop must be used within a DragAndDropProvider');
  }
  return context;
}; 