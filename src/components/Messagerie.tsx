import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Search, 
  Plus, 
  MoreVertical,
  Check,
  CheckCheck,
  File,
  Image,
  Download,
  MessageSquare,
  Wrench,
  User,
  FileText
} from 'lucide-react';
import { useMessaging, Thread, Message } from '@/features/messaging/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { useDragAndDrop } from '@/contexts/DragAndDropContext';

export const Messagerie: React.FC = () => {
  const { threads, selectedThread, messages, loading, setSelectedThread, loadMessages, sendMessage, markAsRead, createThread } = useMessaging();
  const { fullName, initials } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadParticipants, setNewThreadParticipants] = useState<string[]>([]);
  const [draggedItems, setDraggedItems] = useState<Array<{type: string, id: string, name: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { draggedItem, isDragging, dragPosition, onDrop, removeDropCallback } = useDragAndDrop();

  // Participants disponibles (artisans + GM)
  const availableParticipants = ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard'];

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Marquer comme lu quand on sélectionne un thread
  useEffect(() => {
    if (selectedThread && selectedThread.unreadCount > 0) {
      markAsRead(selectedThread.id);
    }
  }, [selectedThread, markAsRead]);

  // Charger les messages quand on sélectionne un thread
  useEffect(() => {
    if (selectedThread) {
      loadMessages(selectedThread.id);
    }
  }, [selectedThread, loadMessages]);

  const handleSendMessage = async () => {
    if (!selectedThread || (!newMessage.trim() && draggedItems.length === 0)) return;

    try {
      let messageContent = newMessage.trim();
      
      // Ajouter les éléments drag & drop au message
      if (draggedItems.length > 0) {
        const draggedItemsText = draggedItems.map(item => {
          const icon = item.type === 'artisan' ? '🔧' : item.type === 'client' ? '👤' : '📄';
          return `${icon} **${item.type.charAt(0).toUpperCase() + item.type.slice(1)}**: ${item.name} (ID: ${item.id})`;
        }).join('\n');
        
        messageContent = messageContent ? `${messageContent}\n\n${draggedItemsText}` : draggedItemsText;
      }

      await sendMessage(selectedThread.id, messageContent, attachments);
      setNewMessage('');
      setAttachments([]);
      setDraggedItems([]);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gérer le drop d'éléments dans la zone de conversation
  const handleDrop = (item: any) => {
    setDraggedItems(prev => [...prev, {
      type: item.type,
      id: item.id,
      name: item.name
    }]);
  };

  // Configurer la zone de drop quand on entre dans la messagerie
  useEffect(() => {
    onDrop(handleDrop);
    return () => removeDropCallback();
  }, [onDrop, removeDropCallback]);

  const removeDraggedItem = (index: number) => {
    setDraggedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || newThreadParticipants.length === 0) return;

    try {
      const thread = await createThread(newThreadTitle.trim(), ['GM', ...newThreadParticipants]);
      setSelectedThread(thread);
      setShowNewThread(false);
      setNewThreadTitle('');
      setNewThreadParticipants([]);
    } catch (error) {
      console.error('Erreur création thread:', error);
    }
  };

  const toggleParticipant = (participant: string) => {
    setNewThreadParticipants(prev => 
      prev.includes(participant) 
        ? prev.filter(p => p !== participant)
        : [...prev, participant]
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex">
      {/* Colonne gauche - Liste des fils */}
      <div className="w-80 border-r flex flex-col">
        <Card className="rounded-none border-0 border-b">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Messagerie</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowNewThread(true)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedThread?.id === thread.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedThread(thread)}
                onMouseEnter={() => {
                  if (isDragging) {
                    // Délai de 0,3 seconde avant d'ouvrir le thread
                    setTimeout(() => {
                      setSelectedThread(thread);
                    }, 300);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium truncate">{thread.title}</h4>
                      {thread.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {thread.lastMessage.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {thread.participants.length} participants
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(thread.lastMessage.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Panneau droit - Conversation */}
      <div 
        className="flex-1 flex flex-col"
        onMouseUp={() => {
          if (isDragging && draggedItem) {
            handleDrop(draggedItem);
          }
        }}
      >
        {selectedThread ? (
          <>
            {/* En-tête de la conversation */}
            <Card className="rounded-none border-0 border-b">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedThread.participants.slice(0, 2).map(p => p[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedThread.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedThread.participants.join(', ')}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Messages */}
            <ScrollArea 
              className="flex-1 p-4"
            >
              <div className="space-y-4">
                {/* Zone de drop pour les éléments drag & drop */}
                {isDragging && (
                  <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg p-8 text-center">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <MessageSquare className="h-6 w-6" />
                      <span className="font-medium">Déposez ici pour ajouter à la conversation</span>
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'GM' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.sender === 'GM' ? 'order-2' : 'order-1'}`}>
                      {message.sender !== 'GM' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{message.sender}</span>
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'GM'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Pièces jointes */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center space-x-2 p-2 bg-background/50 rounded"
                              >
                                {attachment.type.startsWith('image/') ? (
                                  <Image className="h-4 w-4" />
                                ) : (
                                  <File className="h-4 w-4" />
                                )}
                                <span className="text-xs truncate">{attachment.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => window.open(attachment.url, '_blank')}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center space-x-1 mt-1 ${message.sender === 'GM' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'GM' && (
                          <span className="text-xs text-muted-foreground">
                            {message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Zone de saisie */}
            <Card className="rounded-none border-0 border-t">
              <CardContent className="p-4">
                {/* Pièces jointes sélectionnées */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-muted rounded text-sm"
                      >
                        <File className="h-4 w-4" />
                        <span className="truncate max-w-32">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeAttachment(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Éléments drag & drop sélectionnés */}
                {draggedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {draggedItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-primary/10 border border-primary/20 rounded text-sm"
                      >
                        {item.type === 'artisan' && <Wrench className="h-4 w-4 text-blue-600" />}
                        {item.type === 'client' && <User className="h-4 w-4 text-green-600" />}
                        {item.type === 'intervention' && <FileText className="h-4 w-4 text-orange-600" />}
                        <span className="truncate max-w-32 font-medium">{item.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeDraggedItem(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[40px]"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input">
                      <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                        <span>
                          <Paperclip className="h-4 w-4" />
                        </span>
                      </Button>
                    </label>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && draggedItems.length === 0}
                      className="h-10 w-10 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // État vide
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucune conversation sélectionnée</h3>
              <p className="text-muted-foreground mb-4">
                Sélectionnez une conversation ou créez-en une nouvelle
              </p>
              <Button onClick={() => setShowNewThread(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal création de nouveau fil */}
      {showNewThread && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Nouvelle conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre</label>
                <Input
                  placeholder="Titre de la conversation"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Participants</label>
                <div className="mt-2 space-y-2">
                  {availableParticipants.map((participant) => (
                    <label key={participant} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newThreadParticipants.includes(participant)}
                        onChange={() => toggleParticipant(participant)}
                        className="rounded"
                      />
                      <span className="text-sm">{participant}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewThread(false);
                    setNewThreadTitle('');
                    setNewThreadParticipants([]);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateThread}
                  disabled={!newThreadTitle.trim() || newThreadParticipants.length === 0}
                >
                  Créer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


    </div>
  );
}; 