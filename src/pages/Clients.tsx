// src/pages/Clients.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Clients() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Clients</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Module clients en développement...</p>
        </CardContent>
      </Card>
    </div>
  );
}