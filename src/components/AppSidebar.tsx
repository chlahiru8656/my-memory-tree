import { TreePine, Plus, Trees, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onPlantMemory: () => void;
}

const AppSidebar = ({ onPlantMemory }: AppSidebarProps) => {
  const { signOut } = useAuth();

  const navItems = [
    { title: "My Forest", icon: Trees, action: () => {} },
    { title: "Social Grove", icon: Users, action: () => {} },
  ];

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center gold-pulse">
            <TreePine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg text-primary tracking-wide">Memory Forest</h2>
            <p className="text-xs text-muted-foreground font-body">Your living journal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        {/* Plant Memory Button */}
        <div className="px-2 mb-4">
          <button
            onClick={onPlantMemory}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-body text-sm tracking-wide hover:bg-gold-glow transition-colors gold-pulse"
          >
            <Plus className="w-4 h-4" />
            Plant Memory
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={item.action}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-body"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-body"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Forest</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
