// src/features/account/pages/Parametre.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, X, Wrench, Sun, Moon } from 'lucide-react';
import { useThemeId } from "@/theme/ThemeProvider";

// Petit composant pour la bulle de couleur utilisateur
const UserColorBubble = ({ color, username }: { color: string, username: string }) => {
  // Calcul du contraste pour le texte (blanc ou noir)
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
      className="inline-flex items-center px-3 py-1 rounded-full font-medium text-xs mr-0.5 border border-gray-300 shadow-sm"
      style={{ backgroundColor: color || '#ccc', color: getContrastYIQ(color || '#ccc') }}
    >
      {username}
    </span>
  );
};

// Palette de couleurs (hex)
const PALETTES = [
  ["#3F756C", "#F6EECD", "#E1C789", "#C6743E"],
  ["#283D22", "#B4B66F", "#F1F0CC", "#93B5AF"],
  ["#83BBC1", "#E7DDC7", "#B92C0D", "#1F2C24"],
  ["#1B4D3E", "#EA362A", "#F1F0CC", "#C6C596"],
  ["#9CADB3", "#CFDADA", "#EBF2F2", "#BBD5D8"],
  ["#232E3F", "#CF9421", "#EEECE3", "#DAD5C6"]

];

// Utilitaire pour convertir hex en hsl string
function hexToHSL(hex) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0,2), 16) / 255;
  let g = parseInt(hex.substring(2,4), 16) / 255;
  let b = parseInt(hex.substring(4,6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if(max === min){ h = s = 0; }
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h*360); s = Math.round(s*100); l = Math.round(l*100);
  return `${h} ${s}% ${l}%`;
}

// Variables CSS à surcharger (ordre: primary, secondary, accent, sidebar)
const PALETTE_VARS = [
  '--primary', '--secondary', '--accent', '--sidebar-background',
  '--card', '--popover', '--muted', '--border', '--input', '--ring'
];

// Mapping palette -> variables (on applique les 4 couleurs sur les principaux usages)
function applyPalette(palette, idx) {
  // Palette 1 : mapping original
  if (idx === 0) {
    const hsl0 = hexToHSL(palette[0]); // #3F756C
    const hsl1 = hexToHSL(palette[1]); // #F6EECD
    const hsl2 = hexToHSL(palette[2]); // #E1C789
    const hsl3 = hexToHSL(palette[3]); // #C6743E
    document.documentElement.style.setProperty('--background', hsl1);
    document.documentElement.style.setProperty('--foreground', hsl0);
    document.documentElement.style.setProperty('--card', hsl1);
    document.documentElement.style.setProperty('--card-foreground', hsl0);
    document.documentElement.style.setProperty('--popover', hsl1);
    document.documentElement.style.setProperty('--popover-foreground', hsl0);
    document.documentElement.style.setProperty('--primary', hsl0);
    document.documentElement.style.setProperty('--primary-foreground', hsl1);
    document.documentElement.style.setProperty('--secondary', hsl2);
    document.documentElement.style.setProperty('--secondary-foreground', hsl0);
    document.documentElement.style.setProperty('--accent', hsl2);
    document.documentElement.style.setProperty('--accent-foreground', hsl0);
    document.documentElement.style.setProperty('--muted', hsl2);
    document.documentElement.style.setProperty('--muted-foreground', hsl0);
    document.documentElement.style.setProperty('--destructive', hsl3);
    document.documentElement.style.setProperty('--destructive-foreground', hsl1);
    document.documentElement.style.setProperty('--border', hsl0);
    document.documentElement.style.setProperty('--input', hsl0);
    document.documentElement.style.setProperty('--ring', hsl3);
    document.documentElement.style.setProperty('--sidebar-background', hsl0);
    document.documentElement.style.setProperty('--sidebar-foreground', hsl1);
    document.documentElement.style.setProperty('--sidebar-primary', hsl0);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', hsl1);
    document.documentElement.style.setProperty('--sidebar-accent', hsl2);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', hsl0);
    document.documentElement.style.setProperty('--sidebar-border', hsl0);
    document.documentElement.style.setProperty('--sidebar-ring', hsl3);
  } else if (idx === 1) {
    // Palette 2 : vert très foncé, vert olive, crème, bleu-vert
    const hsl0 = hexToHSL(palette[0]); // #283D22
    const hsl1 = hexToHSL(palette[1]); // #B4B66F
    const hsl2 = hexToHSL(palette[2]); // #F1F0CC
    const hsl3 = hexToHSL(palette[3]); // #93B5AF
    document.documentElement.style.setProperty('--background', hsl2);
    document.documentElement.style.setProperty('--foreground', hsl0);
    document.documentElement.style.setProperty('--card', hsl2);
    document.documentElement.style.setProperty('--card-foreground', hsl0);
    document.documentElement.style.setProperty('--popover', hsl2);
    document.documentElement.style.setProperty('--popover-foreground', hsl0);
    document.documentElement.style.setProperty('--primary', hsl0);
    document.documentElement.style.setProperty('--primary-foreground', hsl2);
    document.documentElement.style.setProperty('--secondary', hsl1);
    document.documentElement.style.setProperty('--secondary-foreground', hsl0);
    document.documentElement.style.setProperty('--accent', hsl3);
    document.documentElement.style.setProperty('--accent-foreground', hsl0);
    document.documentElement.style.setProperty('--muted', hsl3);
    document.documentElement.style.setProperty('--muted-foreground', hsl0);
    document.documentElement.style.setProperty('--destructive', hsl1);
    document.documentElement.style.setProperty('--destructive-foreground', hsl2);
    document.documentElement.style.setProperty('--border', hsl0);
    document.documentElement.style.setProperty('--input', hsl0);
    document.documentElement.style.setProperty('--ring', hsl1);
    document.documentElement.style.setProperty('--sidebar-background', hsl0);
    document.documentElement.style.setProperty('--sidebar-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-primary', hsl0);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-accent', hsl1);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', hsl0);
    document.documentElement.style.setProperty('--sidebar-border', hsl0);
    document.documentElement.style.setProperty('--sidebar-ring', hsl1);
  } else if (idx === 2) {
    // Palette 3 : bleu-vert, beige, rouge brique, vert très foncé
    const hsl0 = hexToHSL(palette[0]); // #83BBC1
    const hsl1 = hexToHSL(palette[1]); // #E7DDC7
    const hsl2 = hexToHSL(palette[2]); // #B92C0D
    const hsl3 = hexToHSL(palette[3]); // #1F2C24
    document.documentElement.style.setProperty('--background', hsl1);
    document.documentElement.style.setProperty('--foreground', hsl3);
    document.documentElement.style.setProperty('--card', hsl1);
    document.documentElement.style.setProperty('--card-foreground', hsl3);
    document.documentElement.style.setProperty('--popover', hsl1);
    document.documentElement.style.setProperty('--popover-foreground', hsl3);
    document.documentElement.style.setProperty('--primary', hsl0);
    document.documentElement.style.setProperty('--primary-foreground', hsl1);
    document.documentElement.style.setProperty('--secondary', hsl3);
    document.documentElement.style.setProperty('--secondary-foreground', hsl1);
    document.documentElement.style.setProperty('--accent', hsl2);
    document.documentElement.style.setProperty('--accent-foreground', hsl1);
    document.documentElement.style.setProperty('--muted', hsl0);
    document.documentElement.style.setProperty('--muted-foreground', hsl3);
    document.documentElement.style.setProperty('--destructive', hsl2);
    document.documentElement.style.setProperty('--destructive-foreground', hsl1);
    document.documentElement.style.setProperty('--border', hsl0);
    document.documentElement.style.setProperty('--input', hsl0);
    document.documentElement.style.setProperty('--ring', hsl2);
    document.documentElement.style.setProperty('--sidebar-background', hsl3);
    document.documentElement.style.setProperty('--sidebar-foreground', hsl1);
    document.documentElement.style.setProperty('--sidebar-primary', hsl3);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', hsl1);
    document.documentElement.style.setProperty('--sidebar-accent', hsl2);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', hsl1);
    document.documentElement.style.setProperty('--sidebar-border', hsl3);
    document.documentElement.style.setProperty('--sidebar-ring', hsl2);
  } else if (idx === 3) {
    // Palette 4 : vert très foncé, rouge vif, crème, vert olive pâle
    const hsl0 = hexToHSL(palette[0]); // #1B4D3E
    const hsl1 = hexToHSL(palette[1]); // #EA362A
    const hsl2 = hexToHSL(palette[2]); // #F1F0CC
    const hsl3 = hexToHSL(palette[3]); // #C6C596
    document.documentElement.style.setProperty('--background', hsl2);
    document.documentElement.style.setProperty('--foreground', hsl0);
    document.documentElement.style.setProperty('--card', hsl2);
    document.documentElement.style.setProperty('--card-foreground', hsl0);
    document.documentElement.style.setProperty('--popover', hsl2);
    document.documentElement.style.setProperty('--popover-foreground', hsl0);
    document.documentElement.style.setProperty('--primary', hsl0);
    document.documentElement.style.setProperty('--primary-foreground', hsl2);
    document.documentElement.style.setProperty('--secondary', hsl3);
    document.documentElement.style.setProperty('--secondary-foreground', hsl0);
    document.documentElement.style.setProperty('--accent', hsl1);
    document.documentElement.style.setProperty('--accent-foreground', hsl2);
    document.documentElement.style.setProperty('--muted', hsl3);
    document.documentElement.style.setProperty('--muted-foreground', hsl0);
    document.documentElement.style.setProperty('--destructive', hsl1);
    document.documentElement.style.setProperty('--destructive-foreground', hsl2);
    document.documentElement.style.setProperty('--border', hsl0);
    document.documentElement.style.setProperty('--input', hsl0);
    document.documentElement.style.setProperty('--ring', hsl1);
    document.documentElement.style.setProperty('--sidebar-background', hsl0);
    document.documentElement.style.setProperty('--sidebar-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-primary', hsl0);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-accent', hsl1);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-border', hsl0);
    document.documentElement.style.setProperty('--sidebar-ring', hsl1);
  } else if (idx === 4) {
    // Palette 5 : bleu-gris, gris clair, bleu très pâle, bleu doux
    const hsl0 = hexToHSL(palette[0]); // #9CADB3
    const hsl1 = hexToHSL(palette[1]); // #CFDADA
    const hsl2 = hexToHSL(palette[2]); // #EBF2F2
    const hsl3 = hexToHSL(palette[3]); // #BBD5D8
    document.documentElement.style.setProperty('--background', hsl2);
    document.documentElement.style.setProperty('--foreground', hsl0);
    document.documentElement.style.setProperty('--card', hsl2);
    document.documentElement.style.setProperty('--card-foreground', hsl0);
    document.documentElement.style.setProperty('--popover', hsl2);
    document.documentElement.style.setProperty('--popover-foreground', hsl0);
    document.documentElement.style.setProperty('--primary', hsl0);
    document.documentElement.style.setProperty('--primary-foreground', hsl2);
    document.documentElement.style.setProperty('--secondary', hsl3);
    document.documentElement.style.setProperty('--secondary-foreground', hsl0);
    document.documentElement.style.setProperty('--accent', hsl1);
    document.documentElement.style.setProperty('--accent-foreground', hsl0);
    document.documentElement.style.setProperty('--muted', hsl1);
    document.documentElement.style.setProperty('--muted-foreground', hsl0);
    document.documentElement.style.setProperty('--destructive', hsl3);
    document.documentElement.style.setProperty('--destructive-foreground', hsl2);
    document.documentElement.style.setProperty('--border', hsl0);
    document.documentElement.style.setProperty('--input', hsl0);
    document.documentElement.style.setProperty('--ring', hsl1);
    document.documentElement.style.setProperty('--sidebar-background', hsl0);
    document.documentElement.style.setProperty('--sidebar-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-primary', hsl0);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-accent', hsl1);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', hsl0);
    document.documentElement.style.setProperty('--sidebar-border', hsl0);
    document.documentElement.style.setProperty('--sidebar-ring', hsl1);
  } else if (idx === 5) {
    // Palette 6 : bleu nuit, or, crème, beige
    const hsl0 = hexToHSL(palette[0]); // #232E3F
    const hsl1 = hexToHSL(palette[1]); // #CF9421
    const hsl2 = hexToHSL(palette[2]); // #EEECE3
    const hsl3 = hexToHSL(palette[3]); // #DAD5C6
    document.documentElement.style.setProperty('--background', hsl2);
    document.documentElement.style.setProperty('--foreground', hsl0);
    document.documentElement.style.setProperty('--card', hsl2);
    document.documentElement.style.setProperty('--card-foreground', hsl0);
    document.documentElement.style.setProperty('--popover', hsl2);
    document.documentElement.style.setProperty('--popover-foreground', hsl0);
    document.documentElement.style.setProperty('--primary', hsl0);
    document.documentElement.style.setProperty('--primary-foreground', hsl2);
    document.documentElement.style.setProperty('--secondary', hsl3);
    document.documentElement.style.setProperty('--secondary-foreground', hsl0);
    document.documentElement.style.setProperty('--accent', hsl1);
    document.documentElement.style.setProperty('--accent-foreground', hsl2);
    document.documentElement.style.setProperty('--muted', hsl3);
    document.documentElement.style.setProperty('--muted-foreground', hsl0);
    document.documentElement.style.setProperty('--destructive', hsl1);
    document.documentElement.style.setProperty('--destructive-foreground', hsl2);
    document.documentElement.style.setProperty('--border', hsl0);
    document.documentElement.style.setProperty('--input', hsl0);
    document.documentElement.style.setProperty('--ring', hsl1);
    document.documentElement.style.setProperty('--sidebar-background', hsl0);
    document.documentElement.style.setProperty('--sidebar-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-primary', hsl0);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-accent', hsl1);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', hsl2);
    document.documentElement.style.setProperty('--sidebar-border', hsl0);
    document.documentElement.style.setProperty('--sidebar-ring', hsl1);
  } else {
    // Mapping générique pour les autres palettes (fallback)
    const hsl = palette.map(hexToHSL);
    document.documentElement.style.setProperty('--primary', hsl[0]);
    document.documentElement.style.setProperty('--secondary', hsl[1]);
    document.documentElement.style.setProperty('--accent', hsl[2]);
    document.documentElement.style.setProperty('--sidebar-background', hsl[3]);
    document.documentElement.style.setProperty('--card', hsl[1]);
    document.documentElement.style.setProperty('--popover', hsl[1]);
    document.documentElement.style.setProperty('--muted', hsl[2]);
    document.documentElement.style.setProperty('--border', hsl[0]);
    document.documentElement.style.setProperty('--input', hsl[0]);
    document.documentElement.style.setProperty('--ring', hsl[3]);
  }
}

export function Parametre() {
  const { fullName, initials, email } = useAuth();
  // --- État local utilisateurs et rôles dynamiques ---
  const [users, setUsers] = useState<any[]>([
    { id: 99, nom: 'Morin', prenom: 'Grégoire', username: 'GM', email: 'gregoire.morin@entreprise.com', color: '#222222', roles: ['Interventions', 'Artisans', 'Utilisateurs', 'Suppression', 'Comptabilité', 'Export artisan'], password: 'boss', appPassword: '********' },
    { id: 1, nom: 'admin', prenom: 'admin', username: 'admin', email: 'dav...@gmail.com', color: '#000000', roles: ['Interventions', 'Artisans', 'Utilisateurs', 'Suppression', 'Comptabilité', 'Export artisan'], password: 'admin', appPassword: '********' },
    { id: 20, nom: 'admin2', prenom: 'admin2', username: 'admin2', email: '', color: '#1976d2', roles: ['Interventions'], password: '', appPassword: '' },
    { id: 11, nom: 'Birckel', prenom: 'Tom', username: 'Tom' },
    { id: 9, nom: 'Boujimal', prenom: 'Badr', username: 'Badr' },
    { id: 21, nom: 'test', prenom: 'test', username: 'a' },
    { id: 22, nom: 'BERTEA', prenom: 'André', username: 'dd' },
    { id: 15, nom: 'admin2', prenom: 'admin2', username: 'admin2' },
    { id: 13, nom: 'Aguenana', prenom: 'Keryan', username: 'Paul' },
    { id: 14, nom: 'Saune', prenom: 'Louis', username: 'Louis' },
    { id: 16, nom: 's', prenom: 'Samuel', username: 'Samuel' },
    { id: 17, nom: 'L', prenom: 'Lucien', username: 'Lucien' },
    { id: 3, nom: 'GAUTRET', prenom: 'ANDREA', username: 'Andrea' },
    { id: 18, nom: 'K', prenom: 'Killian', username: 'Killian' },
    { id: 10, nom: 'Montanari', prenom: 'Dimitri', username: 'Dimitri' },
  ]);
  const [roles, setRoles] = useState([
    { key: 'Interventions', label: 'Interventions', icon: <Wrench className="mr-2 h-4 w-4" /> },
    { key: 'Artisans', label: 'Artisans', icon: <span className="mr-2">🦺</span> },
    { key: 'Utilisateurs', label: 'Utilisateurs', icon: <span className="mr-2">👥</span> },
    { key: 'Suppression', label: 'Suppression', icon: <span className="mr-2">🗑️</span> },
    { key: 'Comptabilité', label: 'Comptabilité', icon: <span className="mr-2">🧮</span> },
    { key: 'Export artisan', label: 'Export artisan', icon: <span className="mr-2">📄</span> },
  ]);
  const [newRole, setNewRole] = useState('');

  const [editUser, setEditUser] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { themeId, setThemeId } = useThemeId();

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout");
  };

  // Détection permission "Utilisateurs" et "Suppression" sur l'utilisateur connecté
  const currentUser = users.find(u => u.username === initials || u.email === email || u.nom + ' ' + u.prenom === fullName);
  const hasUserPermission = currentUser?.roles?.includes('Utilisateurs');
  const hasDeletePermission = currentUser?.roles?.includes('Suppression');

  // Fonction pour ouvrir le modal d'ajout
  const handleAddUser = () => {
    setEditUser({
      id: '', nom: '', prenom: '', username: '', email: '', color: '#1976d2', roles: [], password: '', appPassword: ''
    });
  };

  // Sauvegarde (création ou édition)
  const handleSaveUser = (e: any) => {
    e.preventDefault();
    if (!editUser.nom || !editUser.prenom || !editUser.username) return;
    if (editUser.id) {
      // Modification
      setUsers(users.map(u => u.id === editUser.id ? { ...editUser } : u));
    } else {
      // Création (ID auto)
      const newId = Math.max(...users.map(u => Number(u.id) || 0)) + 1;
      setUsers([...users, { ...editUser, id: newId }]);
    }
    setEditUser(null);
  };

  // Suppression
  const handleDeleteUser = () => {
    if (editUser && editUser.id) {
      setUsers(users.filter(u => u.id !== editUser.id));
      setEditUser(null);
    }
  };

  // Ajout dynamique d'un rôle
  const handleAddRole = () => {
    if (newRole.trim() && !roles.find(r => r.key === newRole)) {
      setRoles([...roles, { key: newRole, label: newRole, icon: <span className="mr-2">🔹</span> }]);
      setNewRole('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{fullName}</h3>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Thème</span>
              {/* Utiliser ThemeToggle pour le switch clair/sombre */}
              <ThemeToggle />
              {/* Boutons palettes */}
              <div className="flex space-x-2 ml-4">
                {PALETTES.map((palette, idx) => (
                  <button
                    key={idx}
                    className={`flex items-center space-x-0.5 rounded-full border-2 p-1 transition-all ${themeId === idx + 3 ? 'border-primary' : 'border-gray-300'}`}
                    style={{ outline: themeId === idx + 3 ? '2px solid #3F756C' : 'none' }}
                    onClick={() => setThemeId(idx + 3)}
                    title={`Palette ${idx+1}`}
                  >
                    {palette.map((color, i) => (
                      <span key={i} style={{ background: color, width: 16, height: 16, borderRadius: '50%', display: 'inline-block', marginLeft: i>0?2:0 }} />
                    ))}
                  </button>
                ))}
              </div>
            </div>
            
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Gestion des Utilisateurs pour l'admin */}
      {hasUserPermission && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <div>
              <Button size="sm" variant="secondary" className="ml-2" onClick={handleAddUser} title="Ajouter un utilisateur">
                <span className="text-lg font-bold">+</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-3 py-2 border-b text-left">ID</th>
                    <th className="px-3 py-2 border-b text-left">Nom</th>
                    <th className="px-3 py-2 border-b text-left">Prénom</th>
                    <th className="px-3 py-2 border-b text-left">Nom d'utilisateur</th>
                    <th className="px-3 py-2 border-b text-left">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr
                      key={user.id}
                      className="hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => setEditUser(user)}
                    >
                      <td className="px-3 py-2 border-b font-medium text-primary">{user.id}</td>
                      <td className="px-3 py-2 border-b">{user.nom}</td>
                      <td className="px-3 py-2 border-b">{user.prenom}</td>
                      <td className="px-3 py-2 border-b">
                        <UserColorBubble color={user.color} username={user.username} />
                      </td>
                      <td className="px-3 py-2 border-b">
                        <div className="flex flex-wrap gap-1">
                          {(user.roles || []).map((role: string) => (
                            <span
                              key={role}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Modal d'édition d'utilisateur */}
      <Dialog open={!!editUser} onOpenChange={open => !open && setEditUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editUser && editUser.id ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
          </DialogHeader>
          {editUser && (
            <form className="grid grid-cols-2 gap-4" onSubmit={handleSaveUser}>
              <div className="flex flex-col gap-2">
                <label>Nom</label>
                <Input value={editUser.nom} onChange={e => setEditUser({ ...editUser, nom: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Prénom</label>
                <Input value={editUser.prenom} onChange={e => setEditUser({ ...editUser, prenom: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <label>Pseudo</label>
                <Input className="bg-yellow-50" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <label>Mot de passe</label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} className="bg-yellow-50 pr-10" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <label>Adresse email</label>
                <Input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <label>Mot de passe d'application</label>
                <Input type="password" value={editUser.appPassword} onChange={e => setEditUser({ ...editUser, appPassword: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                <label>Couleur associée</label>
                <input type="color" value={editUser.color} onChange={e => setEditUser({ ...editUser, color: e.target.value })} className="w-10 h-10 p-0 border rounded" />
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Rôles</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {roles.map(role => (
                    <Button
                      key={role.key}
                      type="button"
                      variant={editUser.roles?.includes(role.key) ? 'default' : 'outline'}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setEditUser({
                        ...editUser,
                        roles: editUser.roles?.includes(role.key)
                          ? editUser.roles.filter((r: string) => r !== role.key)
                          : [...(editUser.roles || []), role.key]
                      })}
                    >
                      {role.icon}
                      {role.label}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Ajouter un rôle..."
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-40"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddRole}>
                    +
                  </Button>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="destructive" onClick={() => setEditUser(null)}>
                  Fermer
                </Button>
                {hasDeletePermission && editUser.id && (
                  <Button type="button" variant="destructive" onClick={handleDeleteUser}>
                    Supprimer
                  </Button>
                )}
                <Button type="submit" variant="secondary">{editUser.id ? 'Modifier' : 'Créer'}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}