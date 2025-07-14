import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Clock, CheckCircle, Circle, AlertCircle, ChevronLeft, ChevronRight, MoreVertical, Edit, Trash2 } from 'lucide-react';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  type: 'intervention' | 'rdv' | 'maintenance' | 'other';
  source?: 'intervention' | 'manual';
  interventionId?: string;
}

// Données d'interventions pour juillet 2025
const interventionsData = [
  {
    id: 'INT-2025-001',
    client: 'Entreprise ABC',
    artisan: 'Jean Dupont',
    statut: 'en_cours',
    date: new Date(2025, 6, 7, 9, 0), // 7 juillet 2025
    description: 'Réparation tableau électrique - Rue de la Paix',
    montant: 1200
  },
  {
    id: 'INT-2025-002',
    client: 'Résidence Les Jardins',
    artisan: 'Marie Martin',
    statut: 'planifie',
    date: new Date(2025, 6, 12, 14, 30), // 12 juillet 2025
    description: 'Fuite d\'eau - Avenue Victor Hugo',
    montant: 850
  },
  {
    id: 'INT-2025-003',
    client: 'Restaurant Le Gourmet',
    artisan: 'Pierre Durand',
    statut: 'en_cours',
    date: new Date(2025, 6, 15, 8, 0), // 15 juillet 2025
    description: 'Installation cuisine - Boulevard Central',
    montant: 2100
  },
  {
    id: 'INT-2025-004',
    client: 'Boutique Mode & Co',
    artisan: 'Sophie Bernard',
    statut: 'planifie',
    date: new Date(2025, 6, 18, 10, 0), // 18 juillet 2025
    description: 'Peinture salon - Place du Marché',
    montant: 650
  },
  {
    id: 'INT-2025-005',
    client: 'Hôtel Luxe',
    artisan: 'Jean Dupont',
    statut: 'planifie',
    date: new Date(2025, 6, 22, 16, 0), // 22 juillet 2025
    description: 'Maintenance système électrique',
    montant: 1800
  },
  {
    id: 'INT-2025-006',
    client: 'Centre Commercial',
    artisan: 'Marie Martin',
    statut: 'planifie',
    date: new Date(2025, 6, 25, 11, 30), // 25 juillet 2025
    description: 'Réparation plomberie urgente',
    montant: 950
  }
];

// Convertir les interventions en tâches
const interventionsToTasks = (): Task[] => {
  return interventionsData.map(intervention => ({
    id: `intervention-${intervention.id}`,
    title: `Intervention - ${intervention.client}`,
    description: `${intervention.description} (${intervention.artisan})`,
    date: intervention.date,
    priority: intervention.statut === 'en_cours' ? 'high' : 'medium',
    completed: intervention.statut === 'termine',
    type: 'intervention' as const,
    source: 'intervention' as const,
    interventionId: intervention.id
  }));
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Rendez-vous client - Mme Dubois',
    description: 'Devis rénovation salle de bain',
    date: new Date(2025, 6, 10, 14, 30), // 10 juillet 2025
    priority: 'medium',
    completed: false,
    type: 'rdv'
  },
  {
    id: '2',
    title: 'Maintenance chaudière - Résidence Les Chênes',
    description: 'Contrôle annuel obligatoire',
    date: new Date(2025, 6, 14, 10, 0), // 14 juillet 2025
    priority: 'low',
    completed: false,
    type: 'maintenance'
  },
  {
    id: '3',
    title: 'Formation sécurité équipe',
    description: 'Formation aux nouvelles normes',
    date: new Date(2025, 6, 20, 8, 30), // 20 juillet 2025
    priority: 'high',
    completed: false,
    type: 'other'
  }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const typeColors = {
  intervention: 'bg-blue-100 text-blue-800',
  rdv: 'bg-purple-100 text-purple-800',
  maintenance: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800'
};

export function Calendrier() {
  const [tasks, setTasks] = useState<Task[]>([...interventionsToTasks(), ...mockTasks]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 6, 1)); // 1er juillet 2025
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    type: 'other' as 'intervention' | 'rdv' | 'maintenance' | 'other',
    date: new Date(),
    time: '09:00'
  });

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      type: task.type,
      date: task.date,
      time: task.date.toTimeString().slice(0, 5)
    });
  };

  const saveTask = () => {
    if (newTask.title.trim()) {
      const [hours, minutes] = newTask.time.split(':').map(Number);
      const taskDate = new Date(newTask.date);
      taskDate.setHours(hours, minutes, 0, 0);

      if (editingTask) {
        // Modification d'une tâche existante
        setTasks(tasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, ...newTask, date: taskDate }
            : task
        ));
        setEditingTask(null);
      } else {
        // Ajout d'une nouvelle tâche
        const task: Task = {
          id: Date.now().toString(),
          title: newTask.title,
          description: newTask.description,
          date: taskDate,
          priority: newTask.priority,
          completed: false,
          type: newTask.type,
          source: 'manual'
        };
        setTasks([...tasks, task]);
      }
      
      setNewTask({ title: '', description: '', priority: 'medium', type: 'other', date: new Date(), time: '09:00' });
      setShowAddTask(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Fonction pour obtenir les tâches d'une date donnée
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  // Fonction pour personnaliser le rendu des tuiles du calendrier
  const tileContent = ({ date }: { date: Date }) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return null;

    return (
      <div className="flex flex-col gap-1 mt-1">
        {dayTasks.slice(0, 2).map((task) => (
          <div
            key={task.id}
            className={`w-2 h-2 rounded-full ${
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            } ${task.completed ? 'opacity-50' : ''}`}
            title={task.title}
          />
        ))}
        {dayTasks.length > 2 && (
          <div className="text-xs text-gray-500">+{dayTasks.length - 2}</div>
        )}
      </div>
    );
  };

  // Gestionnaire de changement de date pour le calendrier
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Styles personnalisés pour le calendrier
  const calendarStyles = `
    .react-calendar {
      width: 100%;
      max-width: 100%;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      font-family: inherit;
    }
    
    .react-calendar__navigation {
      display: flex;
      height: 44px;
      margin-bottom: 1em;
    }
    
    .react-calendar__navigation button {
      min-width: 44px;
      background: none;
      border: none;
      font-size: 16px;
      font-weight: 500;
    }
    
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: #f3f4f6;
      border-radius: 0.375rem;
    }
    
    .react-calendar__navigation__label {
      font-weight: bold;
      font-size: 16px;
    }
    
    .react-calendar__month-view__weekdays {
      text-align: center;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 0.75em;
      color: #6b7280;
    }
    
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.5em;
    }
    
    .react-calendar__month-view__days__day {
      padding: 0.5em;
      text-align: center;
      border-radius: 0.375rem;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    
    .react-calendar__month-view__days__day:enabled:hover,
    .react-calendar__month-view__days__day:enabled:focus {
      background-color: #f3f4f6;
    }
    
    .react-calendar__tile--active {
      background: #3b82f6 !important;
      color: white;
    }
    
    .react-calendar__tile--now {
      background: #fef3c7;
      color: #92400e;
    }
    
    .react-calendar__tile--now:enabled:hover,
    .react-calendar__tile--now:enabled:focus {
      background: #fde68a;
    }
  `;

  return (
    <div className="h-full flex gap-6">
      {/* Styles CSS pour le calendrier */}
      <style>{calendarStyles}</style>
      
      {/* Colonne gauche - Liste des tâches (40%) */}
      <div className="w-2/5 flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Tâches à faire</CardTitle>
            <Button 
              size="sm" 
              onClick={() => setShowAddTask(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(showAddTask || editingTask) && (
              <Card className="border-dashed border-2">
                <CardContent className="pt-4 space-y-3">
                  <Input
                    placeholder="Titre de la tâche"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={newTask.date.toISOString().split('T')[0]}
                      onChange={(e) => setNewTask({...newTask, date: new Date(e.target.value)})}
                      className="flex-1"
                    />
                    <Input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                      className="w-32"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask({...newTask, type: e.target.value as any})}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    >
                      <option value="intervention">Intervention</option>
                      <option value="rdv">Rendez-vous</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveTask}>
                      {editingTask ? 'Modifier' : 'Ajouter'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddTask(false);
                        setEditingTask(null);
                        setNewTask({ title: '', description: '', priority: 'medium', type: 'other', date: new Date(), time: '09:00' });
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {sortedTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {task.completed ? (
                          <CheckCircle 
                            className="h-4 w-4 text-green-600 cursor-pointer" 
                            onClick={() => toggleTaskComplete(task.id)}
                          />
                        ) : (
                          <Circle 
                            className="h-4 w-4 text-gray-400 cursor-pointer" 
                            onClick={() => toggleTaskComplete(task.id)}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => toggleTaskComplete(task.id)}>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                          <Badge className={`text-xs ${typeColors[task.type]}`}>
                            {task.type === 'intervention' ? 'Intervention' : 
                             task.type === 'rdv' ? 'RDV' : 
                             task.type === 'maintenance' ? 'Maintenance' : 'Autre'}
                          </Badge>
                          {task.source === 'intervention' && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              Auto
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(task.date)} - {formatDate(task.date)}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => editTask(task)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Colonne droite - Calendrier (60%) */}
      <div className="w-3/5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendrier - Juillet 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              locale="fr-FR"
              className="w-full"
            />
            
            {/* Tâches du jour sélectionné */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Tâches du {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="space-y-2">
                {getTasksForDate(selectedDate).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-600">{formatTime(task.date)}</p>
                    </div>
                    <Badge className={`text-xs ${typeColors[task.type]}`}>
                      {task.type === 'intervention' ? 'Intervention' : 
                       task.type === 'rdv' ? 'RDV' : 
                       task.type === 'maintenance' ? 'Maintenance' : 'Autre'}
                    </Badge>
                  </div>
                ))}
                {getTasksForDate(selectedDate).length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Aucune tâche pour cette date
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 