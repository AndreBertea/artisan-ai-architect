interface SearchResult {
  type: 'artisan' | 'intervention' | 'client' | 'notif';
  id: string;
  label: string;
  description?: string;
}

// Données cohérentes avec les autres API
const mockData: SearchResult[] = [
  // Artisans
  { type: 'artisan', id: 'ART-001', label: 'Jean Dupont', description: 'Électricien - Disponible' },
  { type: 'artisan', id: 'ART-002', label: 'Marie Martin', description: 'Plombier - En intervention' },
  { type: 'artisan', id: 'ART-003', label: 'Pierre Durand', description: 'Menuisier - Disponible' },
  { type: 'artisan', id: 'ART-004', label: 'Sophie Bernard', description: 'Peintre - En congé' },
  
  // Interventions
  { type: 'intervention', id: 'INT-2024-001', label: 'Réparation électrique - Rue de la Paix', description: 'En cours - Jean Dupont' },
  { type: 'intervention', id: 'INT-2024-002', label: 'Fuite d\'eau - Avenue Victor Hugo', description: 'Terminée - Marie Martin' },
  { type: 'intervention', id: 'INT-2024-003', label: 'Installation cuisine - Boulevard Central', description: 'En cours - Pierre Durand' },
  { type: 'intervention', id: 'INT-2024-004', label: 'Peinture salon - Place du Marché', description: 'En attente - Sophie Bernard' },
  
  // Clients
  { type: 'client', id: 'CLI-001', label: 'Entreprise ABC', description: 'Client premium - 15 interventions' },
  { type: 'client', id: 'CLI-002', label: 'Résidence Les Jardins', description: 'Syndic - 8 interventions' },
  { type: 'client', id: 'CLI-003', label: 'Restaurant Le Gourmet', description: 'Client régulier - 12 interventions' },
  { type: 'client', id: 'CLI-004', label: 'Boutique Mode & Co', description: 'Nouveau client - 2 interventions' },
  
  // Notifications
  { type: 'notif', id: '1', label: 'Intervention INT-2024-001 en retard', description: 'Il y a 2 heures' },
  { type: 'notif', id: '2', label: 'Intervention INT-2024-002 terminée', description: 'Il y a 4 heures' },
  { type: 'notif', id: '3', label: 'Devis manquant pour INT-2024-004', description: 'Il y a 1 jour' },
  { type: 'notif', id: '4', label: 'Sophie Bernard indisponible', description: 'Dans 2 jours' },
];

export const searchApi = {
  async search(query: string): Promise<SearchResult[]> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    
    return mockData.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }
}; 