// src/components/ui/AppSidebar.tsx
import { Home, LayoutGrid, Users, UserCheck, Bell, User, MessageSquare, Calendar } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useMessaging } from "@/features/messaging/hooks/useMessaging";
import { useDragAndDrop } from '@/contexts/DragAndDropContext';
import { useNavigate } from 'react-router-dom';

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Interventions", url: "/interventions", icon: LayoutGrid },
  { title: "Artisans", url: "/artisans", icon: Users },
  { title: "Artisans Real", url: "/artisans-real", icon: Users },
  { title: "Clients", url: "/clients", icon: UserCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { fullName, initials } = useAuth();
  const { unreadCount } = useMessaging();
  const { isDragging, onMessagerieHover, onMessagerieLeave } = useDragAndDrop();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={(collapsed ? "w-14" : "w-60") + " bg-[#23272f]"} collapsible="icon">
      <SidebarContent className="flex flex-col justify-between">
        <div>
          {/* Logo GMBS */}
          <div className={`flex items-center justify-center py-6 transition-all duration-700 ease-in-out ${collapsed ? 'scale-90' : 'scale-100'}`}>
            {collapsed ? (
              <>
                {/* Icône petite, change selon le thème */}
                <img
                  src="/logo-gmbs-cl.png"
                  alt="Logo GMBS clair"
                  className="h-10 w-auto block dark:hidden transition-all duration-700 ease-in-out"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                />
                <img
                  src="/logo-gmbs.png"
                  alt="Logo GMBS sombre"
                  className="h-10 w-auto hidden dark:block transition-all duration-700 ease-in-out"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                />
              </>
            ) : (
              <>
                {/* Logo grand, change selon le thème */}
                <img
                  src="/logo-gmbs-cl.png"
                  alt="Logo GMBS clair"
                  className="h-28 w-auto block dark:hidden transition-all duration-700 ease-in-out"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                />
                <img
                  src="/logo-gmbs.png"
                  alt="Logo GMBS sombre"
                  className="h-28 w-auto hidden dark:block transition-all duration-700 ease-in-out"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                />
              </>
            )}
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="transition-all duration-500 ease-in-out opacity-100 ml-2">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/calendrier"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }
                >
                  <Calendar className="h-4 w-4" />
                  {!collapsed && <span>Calendrier</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/messagerie"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }
                  onMouseEnter={onMessagerieHover}
                  onMouseLeave={onMessagerieLeave}
                >
                  <div className="relative flex items-center">
                    <MessageSquare className="h-4 w-4" />
                    
                    {/* Badge sur l'icône (visible quand collapsed) */}
                    {collapsed && unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center badge-bounce badge-transition"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                    
                    {/* Badge à côté du texte (visible quand déployé) */}
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full ml-3 transition-all duration-500 ease-in-out">
                        <span className="transition-all duration-500 ease-in-out opacity-100">Messagerie</span>
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="h-5 w-5 rounded-full p-0 text-xs badge-slide-in badge-transition flex items-center justify-center"
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }
                >
                  <div className="relative flex items-center">
                    <Bell className="h-4 w-4" />
                    
                    {/* Badge sur l'icône (visible quand collapsed) */}
                    {collapsed && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center badge-bounce badge-transition"
                      >
                        3
                      </Badge>
                    )}
                    
                    {/* Badge à côté du texte (visible quand déployé) */}
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full ml-3 transition-all duration-500 ease-in-out">
                        <span className="transition-all duration-500 ease-in-out opacity-100">Notifications</span>
                        <Badge 
                          variant="destructive" 
                          className="h-5 w-5 rounded-full p-0 text-xs badge-slide-in badge-transition flex items-center justify-center"
                        >
                          3
                        </Badge>
                      </div>
                    )}
                  </div>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/parametre"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }
                >
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  {!collapsed && <span className="transition-all duration-500 ease-in-out opacity-100 ml-2">{fullName}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}