// src/features/account/pages/Parametre.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export function Parametre() {
  const { fullName, initials, email } = useAuth();

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout");
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
              <ThemeToggle />
            </div>
            
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}