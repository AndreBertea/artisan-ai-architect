import { useState, useEffect, useCallback } from 'react';
import { messagingApi } from '../messaging.api';

export interface Thread {
  id: string;
  title: string;
  participants: string[];
  lastMessage: {
    content: string;
    sender: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  content: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
}

export const useMessaging = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Charger les fils de discussion
  const loadThreads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await messagingApi.getThreads();
      setThreads(data);
      const totalUnread = data.reduce((sum, thread) => sum + thread.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Erreur chargement threads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les messages d'un fil
  const loadMessages = useCallback(async (threadId: string) => {
    try {
      setLoading(true);
      const data = await messagingApi.getMessages(threadId);
      setMessages(data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Envoyer un message
  const sendMessage = useCallback(async (threadId: string, content: string, attachments?: File[]) => {
    try {
      const message = await messagingApi.sendMessage(threadId, content, attachments);
      setMessages(prev => [...prev, message]);
      
      // Mettre à jour le dernier message du thread
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? {
              ...thread,
              lastMessage: {
                content,
                sender: 'Vous',
                timestamp: new Date().toISOString(),
                isRead: false
              },
              updatedAt: new Date().toISOString()
            }
          : thread
      ));
      
      return message;
    } catch (error) {
      console.error('Erreur envoi message:', error);
      throw error;
    }
  }, []);

  // Marquer comme lu
  const markAsRead = useCallback(async (threadId: string) => {
    try {
      await messagingApi.markAsRead(threadId);
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, unreadCount: 0 }
          : thread
      ));
      setMessages(prev => prev.map(msg => 
        msg.threadId === threadId 
          ? { ...msg, isRead: true }
          : msg
      ));
      
      // Recalculer le total des non-lus
      const totalUnread = threads.reduce((sum, thread) => 
        thread.id === threadId ? sum : sum + thread.unreadCount, 0
      );
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  }, [threads]);

  // Créer un nouveau fil
  const createThread = useCallback(async (title: string, participants: string[]) => {
    try {
      const thread = await messagingApi.createThread(title, participants);
      setThreads(prev => [thread, ...prev]);
      return thread;
    } catch (error) {
      console.error('Erreur création thread:', error);
      throw error;
    }
  }, []);

  // Polling pour les nouveaux messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedThread) {
        loadMessages(selectedThread.id);
      }
      loadThreads();
    }, 15000); // 15 secondes

    return () => clearInterval(interval);
  }, [selectedThread, loadMessages, loadThreads]);

  // Charger les threads au montage
  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  return {
    threads,
    selectedThread,
    messages,
    unreadCount,
    loading,
    setSelectedThread,
    loadMessages,
    sendMessage,
    markAsRead,
    createThread,
    loadThreads
  };
}; 