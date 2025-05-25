
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Dumbbell,
  LogOut,
  LayoutGrid,
  Home
} from "lucide-react";
import Footer from "@/components/Footer";

const BackofficeLayout: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="bg-primary p-1 rounded-md">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">GymTrack Pro</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <Link to="/dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Atletas">
                      <Link to="/atletas">
                        <Users />
                        <span>Atletas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rutinas">
                      <Link to="/rutinas">
                        <Dumbbell />
                        <span>Rutinas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Sala">
                      <Link to="/sala">
                        <LayoutGrid />
                        <span>Sala</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.name?.charAt(0)}</span>
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <SidebarMenuButton asChild className="w-full justify-start mb-2">
                <Link to="/">
                  <Home size={18} />
                  <span>Volver a la sala</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton onClick={() => logout()} className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <div className="flex items-center h-14 px-4 border-b bg-background">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold ml-4">Panel de administración</h1>
          </div>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BackofficeLayout;
