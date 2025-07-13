// src/features/notifications/pages/Notifications.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MessageSquare, Clock } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  count: number;
  type: 'urgent' | 'internal' | 'reminder';
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock API calls
    const fetchNotifications = async () => {
      const urgent = await fetch('/api/notifications/urgent').catch(() => ({ json: () => ({ count: 3, items: [] }) }));
      const internal = await fetch('/api/notifications/internal').catch(() => ({ json: () => ({ count: 10, items: [] }) }));
      const reminders = await fetch('/api/notifications/reminders').catch(() => ({ json: () => ({ count: 5, items: [] }) }));

      setNotifications([
        { id: '1', title: 'Demandes urgentes', count: 3, type: 'urgent' },
        { id: '2', title: 'Messagerie inter-agents', count: 10, type: 'internal' },
        { id: '3', title: 'Rappels de tâches', count: 5, type: 'reminder' },
      ]);
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'internal': return <MessageSquare className="h-6 w-6 text-blue-500" />;
      case 'reminder': return <Clock className="h-6 w-6 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
              {getIcon(notification.type)}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{notification.count}</div>
                <Badge variant={notification.type === 'urgent' ? 'destructive' : 'secondary'}>
                  {notification.type === 'urgent' ? 'Urgent' : 
                   notification.type === 'internal' ? 'Messages' : 'Rappels'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.type === 'urgent' ? 'interventions nécessitent une attention immédiate' :
                 notification.type === 'internal' ? 'nouveaux messages d\'agents' : 'tâches à traiter'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}