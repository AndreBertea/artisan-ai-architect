import { Thread, Message } from './hooks/useMessaging';

// Données mockées pour la démonstration
const MOCK_THREADS: Thread[] = [
  {
    id: 'thread-1',
    title: 'Support technique',
    participants: ['GM', 'Jean Dupont', 'Marie Martin'],
    lastMessage: {
      content: 'Le problème est résolu, merci !',
      sender: 'Jean Dupont',
      timestamp: '2024-01-17T14:30:00Z',
      isRead: false
    },
    unreadCount: 2,
    updatedAt: '2024-01-17T14:30:00Z'
  },
  {
    id: 'thread-2',
    title: 'Planning interventions',
    participants: ['GM', 'Pierre Durand', 'Sophie Bernard'],
    lastMessage: {
      content: 'Je peux intervenir demain matin',
      sender: 'Pierre Durand',
      timestamp: '2024-01-17T13:45:00Z',
      isRead: true
    },
    unreadCount: 0,
    updatedAt: '2024-01-17T13:45:00Z'
  },
  {
    id: 'thread-3',
    title: 'Urgent - Panne électrique',
    participants: ['GM', 'Jean Dupont'],
    lastMessage: {
      content: 'J\'arrive dans 30 minutes',
      sender: 'Jean Dupont',
      timestamp: '2024-01-17T12:15:00Z',
      isRead: false
    },
    unreadCount: 1,
    updatedAt: '2024-01-17T12:15:00Z'
  },
  {
    id: 'thread-4',
    title: 'Formation sécurité',
    participants: ['GM', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard'],
    lastMessage: {
      content: 'Rappel : formation demain à 9h',
      sender: 'GM',
      timestamp: '2024-01-17T11:00:00Z',
      isRead: true
    },
    unreadCount: 0,
    updatedAt: '2024-01-17T11:00:00Z'
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'thread-1': [
    {
      id: 'msg-1-1',
      threadId: 'thread-1',
      content: 'Bonjour, j\'ai un problème avec l\'installation électrique',
      sender: 'Jean Dupont',
      timestamp: '2024-01-17T10:00:00Z',
      isRead: true
    },
    {
      id: 'msg-1-2',
      threadId: 'thread-1',
      content: 'Je vais vous aider, pouvez-vous me donner plus de détails ?',
      sender: 'GM',
      timestamp: '2024-01-17T10:05:00Z',
      isRead: true
    },
    {
      id: 'msg-1-3',
      threadId: 'thread-1',
      content: 'Le disjoncteur saute régulièrement',
      sender: 'Jean Dupont',
      timestamp: '2024-01-17T10:10:00Z',
      isRead: true
    },
    {
      id: 'msg-1-4',
      threadId: 'thread-1',
      content: 'Je vais envoyer Marie pour diagnostiquer',
      sender: 'GM',
      timestamp: '2024-01-17T10:15:00Z',
      isRead: true
    },
    {
      id: 'msg-1-5',
      threadId: 'thread-1',
      content: 'J\'ai identifié le problème, c\'est un court-circuit',
      sender: 'Marie Martin',
      timestamp: '2024-01-17T14:00:00Z',
      isRead: false
    },
    {
      id: 'msg-1-6',
      threadId: 'thread-1',
      content: 'Le problème est résolu, merci !',
      sender: 'Jean Dupont',
      timestamp: '2024-01-17T14:30:00Z',
      isRead: false
    }
  ],
  'thread-2': [
    {
      id: 'msg-2-1',
      threadId: 'thread-2',
      content: 'Bonjour, j\'ai besoin d\'aide pour planifier les interventions de la semaine',
      sender: 'GM',
      timestamp: '2024-01-17T13:00:00Z',
      isRead: true
    },
    {
      id: 'msg-2-2',
      threadId: 'thread-2',
      content: 'Je peux intervenir demain matin',
      sender: 'Pierre Durand',
      timestamp: '2024-01-17T13:45:00Z',
      isRead: true
    }
  ],
  'thread-3': [
    {
      id: 'msg-3-1',
      threadId: 'thread-3',
      content: 'URGENT : Panne électrique complète chez le client ABC',
      sender: 'GM',
      timestamp: '2024-01-17T12:00:00Z',
      isRead: true
    },
    {
      id: 'msg-3-2',
      threadId: 'thread-3',
      content: 'J\'arrive dans 30 minutes',
      sender: 'Jean Dupont',
      timestamp: '2024-01-17T12:15:00Z',
      isRead: false
    }
  ],
  'thread-4': [
    {
      id: 'msg-4-1',
      threadId: 'thread-4',
      content: 'Bonjour à tous, rappel de la formation sécurité demain à 9h',
      sender: 'GM',
      timestamp: '2024-01-17T11:00:00Z',
      isRead: true
    }
  ]
};

export const messagingApi = {
  // Récupérer tous les fils de discussion
  async getThreads(): Promise<Thread[]> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_THREADS.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  // Récupérer les messages d'un fil
  async getMessages(threadId: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_MESSAGES[threadId] || [];
  },

  // Envoyer un message
  async sendMessage(threadId: string, content: string, attachments?: File[]): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      content,
      sender: 'GM',
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments: attachments?.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    };

    // Ajouter le message aux données mockées
    if (!MOCK_MESSAGES[threadId]) {
      MOCK_MESSAGES[threadId] = [];
    }
    MOCK_MESSAGES[threadId].push(newMessage);

    // Mettre à jour le thread
    const thread = MOCK_THREADS.find(t => t.id === threadId);
    if (thread) {
      thread.lastMessage = {
        content,
        sender: 'GM',
        timestamp: newMessage.timestamp,
        isRead: false
      };
      thread.updatedAt = newMessage.timestamp;
    }

    return newMessage;
  },

  // Marquer un fil comme lu
  async markAsRead(threadId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const thread = MOCK_THREADS.find(t => t.id === threadId);
    if (thread) {
      thread.unreadCount = 0;
      thread.lastMessage.isRead = true;
    }

    // Marquer tous les messages du fil comme lus
    const messages = MOCK_MESSAGES[threadId];
    if (messages) {
      messages.forEach(msg => {
        msg.isRead = true;
      });
    }
  },

  // Créer un nouveau fil
  async createThread(title: string, participants: string[]): Promise<Thread> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title,
      participants,
      lastMessage: {
        content: 'Fil créé',
        sender: 'GM',
        timestamp: new Date().toISOString(),
        isRead: true
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    };

    MOCK_THREADS.unshift(newThread);
    MOCK_MESSAGES[newThread.id] = [];

    return newThread;
  },

  // Rechercher dans les messages
  async searchMessages(query: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results: Message[] = [];
    Object.values(MOCK_MESSAGES).forEach(messages => {
      messages.forEach(message => {
        if (message.content.toLowerCase().includes(query.toLowerCase())) {
          results.push(message);
        }
      });
    });

    return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}; 