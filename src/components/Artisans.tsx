
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MapPin, 
  List,
  Star,
  Activity,
  Calendar,
  FileText,
  X,
  Wrench,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArtisansAPI, InterventionsAPI } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import { useDragAndDrop } from '@/contexts/DragAndDropContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Artisan {
  id: string;
  nom: string;
  specialite: string;
  statut: 'potentiel' | 'novice' | 'confirme' | 'expert';
  zone: string;
  activite_badge: 'actif' | 'moyen' | 'inactif';
  ca_mois: number;
  note_moyenne: number;
  derniere_intervention: string;
  disponible: boolean;
}

interface Intervention {
  id: string;
  client: string;
  artisan: string;
  statut: 'en_cours' | 'demande' | 'termine' | 'bloque';
  cree: string;
  echeance: string;
  description: string;
  montant: number;
}

const METIERS = [
  'Plomberie', 'Electricite', 'Vitrerie', 'Chauffage', 'Electroménager', 'Renovation', 'Ménage',
  'Serrurerie', 'Bricolage', 'Volet/Store', 'Nuisible', 'Climatisation', 'Peinture', 'RDF', 'Jardinage', 'Camion'
];
const ZONES = [
  '0 à 20 km', '20 à 35 km', '35 à 50 km', '50 km ou plus'
];
const STATUTS_DOSSIER = ['INCOMPLET', 'COMPLET'];
const STATUTS_ARTISAN = ['Potentiel', 'Actif', 'Archivé'];
// Utilisateurs enrichis avec couleur (mock)
const UTILISATEURS_OBJ = [
  { username: 'Morin', color: '#222222' },
  { username: 'admin', color: '#000000' },
  { username: 'admin2', color: '#1976d2' },
  { username: 'Birckel', color: '#eab308' },
  { username: 'Boujimal', color: '#ef4444' },
  { username: 'test', color: '#10b981' },
  { username: 'BERTEA', color: '#6366f1' },
  { username: 'Aguenana', color: '#f59e42' },
  { username: 'Saune', color: '#f472b6' },
  { username: 's', color: '#f87171' },
  { username: 'L', color: '#0ea5e9' },
  { username: 'GAUTRET', color: '#a21caf' },
  { username: 'K', color: '#f43f5e' },
  { username: 'Montanari', color: '#22d3ee' },
];

// UserColorBubble repris de Parametre.tsx
const UserColorBubble = ({ color, username }: { color: string, username: string }) => {
  function getContrastYIQ(hexcolor: string) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#222' : '#fff';
  }
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full font-medium text-xs border border-gray-300 shadow-sm mr-2"
      style={{ backgroundColor: color || '#ccc', color: getContrastYIQ(color || '#ccc') }}
    >
      {username}
    </span>
  );
};

export const Artisans: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [searchParams] = useSearchParams();
  const { startDrag, startTouchDrag, draggedItem, isDragging, dragPosition } = useDragAndDrop();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  // Champs du formulaire
  const [metiers, setMetiers] = useState<string[]>([]);
  const [zone, setZone] = useState('');
  const [absenceOpen, setAbsenceOpen] = useState(false);
  const [absences, setAbsences] = useState<{debut: string, fin: string}[]>([]);
  const [absenceDebut, setAbsenceDebut] = useState('');
  const [absenceFin, setAbsenceFin] = useState('');
  const [commentaires, setCommentaires] = useState<{auteur: string, date: string, texte: string}[]>([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [attribueA, setAttribueA] = useState('');
  const [statutDossier, setStatutDossier] = useState(STATUTS_DOSSIER[0]);
  const [statutArtisan, setStatutArtisan] = useState(STATUTS_ARTISAN[0]);
  // Pour chaque document uploadé, on gère l'état du fichier et l'aperçu
  const [docs, setDocs] = useState<{[k:string]: File|null}>({});
  // Supprimer toute la logique liée à la prévisualisation de document
  // - Retirer Eye, previewDoc, setPreviewDoc, Dialog de prévisualisation, boutons 'Voir le document'
  // - Garder uniquement l'upload et la suppression (poubelle)
  const handleDocChange = (key: string, file: File|null) => {
    setDocs({ ...docs, [key]: file });
  };

  // Ajout d'une fonction pour supprimer un document
  const handleRemoveDoc = (key: string) => {
    setDocs({ ...docs, [key]: null });
  };

  // Ajout d'un métier
  const handleAddMetier = (m: string) => {
    if (!metiers.includes(m)) setMetiers([...metiers, m]);
  };
  const handleRemoveMetier = (m: string) => {
    setMetiers(metiers.filter(x => x !== m));
  };
  // Ajout d'une absence
  const handleAddAbsence = () => {
    if (absenceDebut && absenceFin) {
      setAbsences([...absences, { debut: absenceDebut, fin: absenceFin }]);
      setAbsenceDebut('');
      setAbsenceFin('');
    }
  };
  // Ajout d'un commentaire
  const handleAddCommentaire = () => {
    if (nouveauCommentaire.trim()) {
      setCommentaires([
        ...commentaires,
        { auteur: attribueA || 'admin', date: format(new Date(), 'dd/MM/yyyy HH:mm'), texte: nouveauCommentaire }
      ]);
      setNouveauCommentaire('');
    }
  };

  const [previewDoc, setPreviewDoc] = useState<{file: File|null, label: string}>({file: null, label: ''});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [artisansData, interventionsData] = await Promise.all([
          ArtisansAPI.getList({}),
          InterventionsAPI.getList({ page: 1 })
        ]);
        setArtisans(artisansData.data);
        setInterventions(interventionsData.data);
        
        // Vérifier si un artisan est sélectionné via l'URL
        const selectedId = searchParams.get('selected');
        if (selectedId) {
          const artisan = artisansData.data.find((a: Artisan) => a.id === selectedId);
          if (artisan) {
            setSelectedArtisan(artisan);
          }
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Écouter les événements de filtre de recherche
  useEffect(() => {
    const handleSearchFilter = (event: CustomEvent) => {
      const { filterKey, value, page } = event.detail;
      
      if (page === '/artisans') {
        console.log(`Filtre reçu: ${filterKey} = ${value}`);
        
        // Recharger les données originales d'abord
        const loadOriginalData = async () => {
          try {
            const artisansData = await ArtisansAPI.getList({});
            const originalArtisans = artisansData.data;
            
            // Appliquer le filtre aux artisans originaux
            const filteredArtisans = originalArtisans.filter((artisan: Artisan) => {
              switch (filterKey) {
                case 'metier':
                  return artisan.specialite.toLowerCase().includes(value.toLowerCase());
                case 'ville':
                  return artisan.zone.toLowerCase().includes(value.toLowerCase());
                case 'statut':
                  return artisan.statut === value;
                case 'note':
                  return artisan.note_moyenne >= parseFloat(value);
                case 'activite':
                  return artisan.activite_badge === value;
                default:
                  return true;
              }
            });
            
            // Mettre à jour la liste filtrée
            setArtisans(filteredArtisans);
          } catch (error) {
            console.error('Erreur lors du filtrage:', error);
          }
        };
        
        loadOriginalData();
      }
    };

    window.addEventListener('searchFilter', handleSearchFilter as EventListener);
    
    return () => {
      window.removeEventListener('searchFilter', handleSearchFilter as EventListener);
    };
  }, []);

  const getStatutBadge = (statut: string) => {
    const statusConfig = {
      potentiel: { variant: 'outline', color: 'text-gray-600' },
      novice: { variant: 'secondary', color: 'text-blue-600' },
      confirme: { variant: 'secondary', color: 'text-green-600' },
      expert: { variant: 'secondary', color: 'text-yellow-600' }
    };

    const config = statusConfig[statut as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant as any} className={config.color}>
        {statut.charAt(0).toUpperCase() + statut.slice(1)}
      </Badge>
    );
  };

  const getActiviteBadge = (activite: string) => {
    const activityConfig = {
      actif: { variant: 'secondary', color: 'text-green-600' },
      moyen: { variant: 'secondary', color: 'text-orange-600' },
      inactif: { variant: 'destructive', color: 'text-red-600' }
    };

    const config = activityConfig[activite as keyof typeof activityConfig];
    return (
      <Badge variant={config.variant as any} className={config.color}>
        <Activity className="h-3 w-3 mr-1" />
        {activite}
      </Badge>
    );
  };

  const getStatusBadge = (statut: string) => {
    const variants = {
      'en_cours': 'bg-blue-100 text-blue-800',
      'demande': 'bg-yellow-100 text-yellow-800', 
      'termine': 'bg-green-100 text-green-800',
      'bloque': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'en_cours': 'En cours',
      'demande': 'Demande',
      'termine': 'Terminé',
      'bloque': 'Bloqué'
    };

    return (
      <Badge className={variants[statut as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[statut as keyof typeof labels] || statut}
      </Badge>
    );
  };

  const getArtisanInterventions = (artisanName: string) => {
    return interventions.filter(intervention => intervention.artisan === artisanName);
  };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredArtisans = artisans.filter(artisan =>
    artisan.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Artisans
          <Button size="icon" variant="outline" className="ml-2" onClick={() => setShowAddModal(true)} title="Ajouter un artisan">
            <Plus className="h-5 w-5" />
          </Button>
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Liste
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Carte
          </Button>
        </div>
      </div>
      {/* Modal d'ajout d'artisan */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent
          className="max-w-6xl w-full p-8 bg-background rounded-2xl shadow-2xl border border-border"
          style={previewDoc.file ? { background: 'rgba(0,0,0,0.01)' } : {}}
        >
          <DialogHeader>
            <DialogTitle>Ajouter un artisan</DialogTitle>
          </DialogHeader>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations de l'artisan */}
              <div className="space-y-4 bg-muted/60 p-6 rounded-xl shadow-sm border border-border">
                <h3 className="font-semibold text-lg mb-2 text-primary">Informations de l'artisan :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Raison Sociale" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Prénom Nom Artisan" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Téléphone" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Téléphone 2" />
                  <input className="input md:col-span-2 bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Email" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Adresse d'intervention" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Adresse du siège social" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Statut Juridique" />
                  <input className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Siret" />
                </div>
              </div>
              {/* Gestion des absences (accordion) + Documents */}
              <div className="space-y-6">
                <div className="bg-muted/60 rounded-xl shadow-sm border border-border">
                  <button type="button" className="flex items-center w-full px-6 py-3 font-semibold text-primary hover:bg-accent/40 rounded-t-xl transition" onClick={() => setAbsenceOpen(!absenceOpen)}>
                    Gestion des Absences
                    {absenceOpen ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                  </button>
                  {absenceOpen && (
                    <div className="p-4 space-y-2">
                      <div className="flex flex-col md:flex-row gap-2">
                        <input type="date" className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" value={absenceDebut} onChange={e => setAbsenceDebut(e.target.value)} placeholder="Date de début" />
                        <input type="date" className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" value={absenceFin} onChange={e => setAbsenceFin(e.target.value)} placeholder="Date de fin" />
                        <button type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition" onClick={handleAddAbsence}>Ajouter une absence</button>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Absences</div>
                        <ul>
                          {absences.map((a, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs bg-blue-50 rounded px-2 py-1 mb-1 border border-border">
                              {a.debut} → {a.fin}
                              <button type="button" onClick={() => setAbsences(absences.filter((_, j) => j !== i))}><X className="h-3 w-3 text-red-500" /></button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                {/* Documents de l'entreprise */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-2 text-primary">Documents de l'entreprise :</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-4 rounded-xl border border-border">
                    <div>
                      <label className="block text-sm font-medium mb-1">KBIS</label>
                      {docs['kbis'] ? (
                        <div className="flex items-center gap-2">
                          <button type="button" className="flex items-center gap-1 text-primary hover:underline" onClick={() => setPreviewDoc({file: docs['kbis'], label: 'KBIS'})}>
                            <Eye className="h-5 w-5" /> Voir le document
                          </button>
                          <button type="button" className="text-destructive hover:bg-destructive/10 rounded-full p-1" onClick={e => { e.stopPropagation(); handleRemoveDoc('kbis'); }} title="Supprimer le document">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <input type="file" className="input" onChange={e => handleDocChange('kbis', e.target.files?.[0] || null)} />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Attestation d'assurance</label>
                      {docs['attestation'] ? (
                        <div className="flex items-center gap-2">
                          <button type="button" className="flex items-center gap-1 text-primary hover:underline" onClick={() => setPreviewDoc({file: docs['attestation'], label: 'Attestation d\'assurance'})}>
                            <Eye className="h-5 w-5" /> Voir le document
                          </button>
                          <button type="button" className="text-destructive hover:bg-destructive/10 rounded-full p-1" onClick={e => { e.stopPropagation(); handleRemoveDoc('attestation'); }} title="Supprimer le document">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <input type="file" className="input" onChange={e => handleDocChange('attestation', e.target.files?.[0] || null)} />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CNI Recto / Verso</label>
                      {docs['cni'] ? (
                        <div className="flex items-center gap-2">
                          <button type="button" className="flex items-center gap-1 text-primary hover:underline" onClick={() => setPreviewDoc({file: docs['cni'], label: 'CNI Recto / Verso'})}>
                            <Eye className="h-5 w-5" /> Voir le document
                          </button>
                          <button type="button" className="text-destructive hover:bg-destructive/10 rounded-full p-1" onClick={e => { e.stopPropagation(); handleRemoveDoc('cni'); }} title="Supprimer le document">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <input type="file" className="input" onChange={e => handleDocChange('cni', e.target.files?.[0] || null)} />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">IBAN</label>
                      {docs['iban'] ? (
                        <div className="flex items-center gap-2">
                          <button type="button" className="flex items-center gap-1 text-primary hover:underline" onClick={() => setPreviewDoc({file: docs['iban'], label: 'IBAN'})}>
                            <Eye className="h-5 w-5" /> Voir le document
                          </button>
                          <button type="button" className="text-destructive hover:bg-destructive/10 rounded-full p-1" onClick={e => { e.stopPropagation(); handleRemoveDoc('iban'); }} title="Supprimer le document">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <input type="file" className="input" onChange={e => handleDocChange('iban', e.target.files?.[0] || null)} />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Décharge de partenariat</label>
                      {docs['decharge'] ? (
                        <div className="flex items-center gap-2">
                          <button type="button" className="flex items-center gap-1 text-primary hover:underline" onClick={() => setPreviewDoc({file: docs['decharge'], label: 'Décharge de partenariat'})}>
                            <Eye className="h-5 w-5" /> Voir le document
                          </button>
                          <button type="button" className="text-destructive hover:bg-destructive/10 rounded-full p-1" onClick={e => { e.stopPropagation(); handleRemoveDoc('decharge'); }} title="Supprimer le document">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <input type="file" className="input" onChange={e => handleDocChange('decharge', e.target.files?.[0] || null)} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Paramètres de l'entreprise et autres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 bg-muted/60 p-6 rounded-xl shadow-sm border border-border">
                <h3 className="font-semibold text-lg mb-2 text-primary">Paramètres de l'entreprise :</h3>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Métiers</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {metiers.map(m => (
                      <span key={m} className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1 text-xs border border-primary/30">
                        {m}
                        <button type="button" onClick={() => handleRemoveMetier(m)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  <select className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" onChange={e => handleAddMetier(e.target.value)} value="">
                    <option value="">Sélectionner des métiers</option>
                    {METIERS.filter(m => !metiers.includes(m)).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zone d'intervention</label>
                  <select className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" value={zone} onChange={e => setZone(e.target.value)}>
                    <option value="">Sélectionner une zone</option>
                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-2 text-primary">Commentaires :</h3>
                <div className="bg-background p-2 rounded-xl border border-border max-h-32 overflow-y-auto text-xs mb-2">
                  {commentaires.length === 0 && <div className="text-muted-foreground">Aucun commentaire</div>}
                  {commentaires.map((c, i) => (
                    <div key={i} className="mb-1">
                      <span className="font-bold">{c.auteur}</span> <span className="text-muted-foreground">({c.date})</span> : {c.texte}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <textarea className="input flex-1 bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" placeholder="Écrivez votre commentaire ici..." rows={2} value={nouveauCommentaire} onChange={e => setNouveauCommentaire(e.target.value)}></textarea>
                  <button type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow h-fit hover:bg-primary/90 transition" onClick={handleAddCommentaire}>Ajouter le commentaire</button>
                </div>
              </div>
              <div className="space-y-4 bg-muted/60 p-6 rounded-xl shadow-sm border border-border">
                <div>
                  <label className="block text-sm font-medium mb-1">Attribué à</label>
                  {attribueA ? (
                    <div className="relative inline-block">
                      <button type="button" className="absolute -top-2 -right-2 text-destructive bg-white rounded-full shadow p-1" onClick={() => setAttribueA('')} title="Supprimer la sélection">
                        <X className="h-4 w-4" />
                      </button>
                      {UserColorBubble(UTILISATEURS_OBJ.find(u => u.username === attribueA) || { username: attribueA, color: '#ccc' })}
                    </div>
                  ) : (
                    <select
                      className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md"
                      value={attribueA}
                      onChange={e => setAttribueA(e.target.value)}
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {UTILISATEURS_OBJ.map(u => (
                        <option key={u.username} value={u.username}>{u.username}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut du dossier</label>
                  <select className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" value={statutDossier} onChange={e => setStatutDossier(e.target.value)}>
                    {STATUTS_DOSSIER.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut Artisan</label>
                  <select className="input bg-background border focus:ring-2 focus:ring-primary/30 rounded-md" value={statutArtisan} onChange={e => setStatutArtisan(e.target.value)}>
                    {STATUTS_ARTISAN.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" className="px-8 py-3 bg-destructive text-destructive-foreground rounded-lg font-semibold shadow hover:bg-destructive/90 transition" onClick={() => setShowAddModal(false)}>Fermer</button>
              <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary/90 transition">Enregistrer</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un artisan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'map' ? (
        <Card>
          <CardHeader>
            <CardTitle>Localisation des artisans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Carte Leaflet avec markers artisans</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des artisans ({filteredArtisans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredArtisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedArtisan(artisan)}
                    onMouseDown={(e) => {
                      startDrag({
                        type: 'artisan',
                        id: artisan.id,
                        name: artisan.nom,
                        data: artisan
                      }, e);
                    }}
                    onTouchStart={(e) => startTouchDrag({
                      type: 'artisan',
                      id: artisan.id,
                      name: artisan.nom,
                      data: artisan
                    }, e)}
                    title="Maintenez 1 seconde pour glisser"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(artisan.nom)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{artisan.nom}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Wrench className="h-3 w-3 mr-1" />
                          {artisan.specialite} • {artisan.zone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>{getStatutBadge(artisan.statut)}</div>
                      <div>{getActiviteBadge(artisan.activite_badge)}</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="font-medium">{artisan.note_moyenne.toFixed(1)}</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
                          .format(artisan.ca_mois)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sidebar détail artisan */}
      {selectedArtisan && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Détails de l'artisan
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/artisans/${selectedArtisan.id}`)}
                title="Ouvrir en page complète"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedArtisan(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Profil</h4>
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">{getInitials(selectedArtisan.nom)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedArtisan.nom}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Wrench className="h-3 w-3 mr-1" />
                    {selectedArtisan.specialite} • {selectedArtisan.zone}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">{selectedArtisan.note_moyenne.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm ml-1">/5</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>Statut:</strong> {getStatutBadge(selectedArtisan.statut)}</div>
                <div><strong>Activité:</strong> {getActiviteBadge(selectedArtisan.activite_badge)}</div>
                <div><strong>Disponibilité:</strong> {selectedArtisan.disponible ? 'Disponible' : 'Indisponible'}</div>
                <div><strong>CA mensuel:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedArtisan.ca_mois)}</div>
                <div><strong>Dernière intervention:</strong> {new Date(selectedArtisan.derniere_intervention).toLocaleDateString()}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Localisation</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Carte Maps</p>
                  <p className="text-xs text-muted-foreground">{selectedArtisan.zone}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Interventions ({getArtisanInterventions(selectedArtisan.nom).length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getArtisanInterventions(selectedArtisan.nom).map((intervention) => (
                  <div
                    key={intervention.id}
                    className="p-3 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedIntervention(intervention)}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startDrag({
                        type: 'intervention',
                        id: intervention.id,
                        name: `Intervention ${intervention.id}`,
                        data: intervention
                      }, e);
                    }}
                    onTouchStart={(e) => startTouchDrag({
                      type: 'intervention',
                      id: intervention.id,
                      name: `Intervention ${intervention.id}`,
                      data: intervention
                    }, e)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{intervention.id}</h5>
                        <p className="text-xs text-muted-foreground">{intervention.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {intervention.client}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(intervention.statut)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(intervention.cree).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Actions</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer disponibilité
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents légaux
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sidebar détail intervention */}
      {selectedIntervention && (
        <Card className="fixed right-6 top-24 bottom-6 w-96 shadow-lg z-60" style={{ right: selectedArtisan ? '420px' : '24px' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle 
              className="cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                startDrag({
                  type: 'intervention',
                  id: selectedIntervention.id,
                  name: `Intervention ${selectedIntervention.id}`,
                  data: selectedIntervention
                }, e);
              }}
              onTouchStart={(e) => startTouchDrag({
                type: 'intervention',
                id: selectedIntervention.id,
                name: `Intervention ${selectedIntervention.id}`,
                data: selectedIntervention
              }, e)}
            >
              Intervention #{selectedIntervention.id}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/interventions/${selectedIntervention.id}`)}
                title="Ouvrir en page complète"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedIntervention(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h4 className="font-medium mb-2">Détails</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Client:</strong> {selectedIntervention.client}</div>
                <div><strong>Artisan:</strong> {selectedIntervention.artisan}</div>
                <div><strong>Statut:</strong> {getStatusBadge(selectedIntervention.statut)}</div>
                <div><strong>Description:</strong> {selectedIntervention.description}</div>
                <div><strong>Montant:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedIntervention.montant)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dates</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Créé:</strong> {new Date(selectedIntervention.cree).toLocaleDateString()}</div>
                <div><strong>Échéance:</strong> {new Date(selectedIntervention.echeance).toLocaleDateString()}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Actions rapides</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  Modifier statut
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Contacter client
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Timeline</h4>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Historique des étapes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de visualisation du document */}
      <Dialog open={!!previewDoc.file} onOpenChange={open => { if (!open) setPreviewDoc({file: null, label: ''}); }}>
        <DialogContent className="max-w-[70vw] w-[70vw] max-h-[70vh] p-6 flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewDoc.label}</DialogTitle>
          </DialogHeader>
          {previewDoc.file && (
            <>
              {previewDoc.file.type.startsWith('image') ? (
                <img src={URL.createObjectURL(previewDoc.file)} alt="Aperçu" className="max-h-[60vh] max-w-full mx-auto object-contain" />
              ) : previewDoc.file.type === 'application/pdf' ? (
                <iframe src={URL.createObjectURL(previewDoc.file)} className="w-full h-[60vh]" title="Aperçu PDF" />
              ) : (
                <div className="text-muted-foreground">Aperçu non disponible</div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
};
