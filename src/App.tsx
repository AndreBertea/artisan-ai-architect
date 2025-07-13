
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from '@/components/ui/AppSidebar';
import { Dashboard } from '@/components/Dashboard';
import { Interventions } from '@/components/Interventions';
import { InterventionDetail } from '@/components/InterventionDetail';
import { Artisans } from '@/components/Artisans';
import { ArtisanDetail } from '@/components/ArtisanDetail';
import { Clients } from '@/components/Clients';
import { ClientDetail } from '@/components/ClientDetail';
import { Parametre } from '@/components/Parametre';
import { Notifications } from '@/components/Notifications';
import { Messagerie } from '@/components/Messagerie';
import { SearchBar } from '@/features/search/components/SearchBar';
import { DragAndDropProvider, useDragAndDrop } from '@/contexts/DragAndDropContext';
import { DragPreview } from '@/components/DragPreview';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { draggedItem, isDragging, dragPosition } = useDragAndDrop();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-16 flex items-center border-b px-6 py-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
            </div>
            <div className="flex-1 flex justify-center">
              <SearchBar />
            </div>
          </header>
                            <div className="p-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/interventions" element={<Interventions />} />
                      <Route path="/interventions/:id" element={<InterventionDetail />} />
                      <Route path="/artisans" element={<Artisans />} />
                      <Route path="/artisans/:id" element={<ArtisanDetail />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/clients/:id" element={<ClientDetail />} />
                      <Route path="/messagerie" element={<div className="h-[calc(100vh-120px)] -m-6"><Messagerie /></div>} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/parametre" element={<Parametre />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
        </main>
      </div>
      
      {/* Aperçu global du drag & drop */}
      <DragPreview
        isVisible={isDragging}
        position={dragPosition}
        item={draggedItem}
      />
    </SidebarProvider>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DragAndDropProvider>
            <AppContent />
          </DragAndDropProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
