import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as interventionsApi from '@/services/interventions.api';

const statusColors = {
  'Demandé': 'bg-blue-100 text-blue-800',
  'En cours': 'bg-orange-100 text-orange-800',
  'Terminé': 'bg-green-100 text-green-800',
  'Bloqué': 'bg-red-100 text-red-800'
};

export const Interventions = () => {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterventions = async () => {
      try {
        const data = await interventionsApi.getInterventions();
        setInterventions(data.data);
      } finally {
        setLoading(false);
      }
    };
    loadInterventions();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await interventionsApi.updateStatus(id, newStatus);
    setInterventions(prev => 
      prev.map(item => 
        item.id === id ? { ...item, statut: newStatus } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher interventions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Table principale */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Interventions ({interventions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((intervention) => (
                  <TableRow 
                    key={intervention.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedIntervention(intervention)}
                  >
                    <TableCell className="font-mono">{intervention.id}</TableCell>
                    <TableCell>{intervention.client}</TableCell>
                    <TableCell>{intervention.artisan}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[intervention.statut as keyof typeof statusColors]}>
                        {intervention.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>{intervention.date_creation}</TableCell>
                    <TableCell>{intervention.date_echeance}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(intervention.id, 'En cours')}>
                            Passer en cours
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Générer mail artisan
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Voir détail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar détail */}
        {selectedIntervention && (
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Intervention #{selectedIntervention.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Client</h4>
                <p className="text-sm text-muted-foreground">{selectedIntervention.client}</p>
              </div>
              <div>
                <h4 className="font-medium">Artisan</h4>
                <p className="text-sm text-muted-foreground">{selectedIntervention.artisan}</p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedIntervention.description}</p>
              </div>
              <div>
                <h4 className="font-medium">Timeline</h4>
                <div className="text-sm space-y-1">
                  <div>• Demandé le {selectedIntervention.date_creation}</div>
                  <div>• Échéance: {selectedIntervention.date_echeance}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};