import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TreeCanvas from "@/components/TreeCanvas";
import ActivityFeed from "@/components/ActivityFeed";
import PlantMemoryModal from "@/components/PlantMemoryModal";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onPlantMemory={() => setModalOpen(true)} />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card/30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </header>
          <div className="flex-1 flex">
            <TreeCanvas />
            <ActivityFeed refreshKey={refreshKey} />
          </div>
        </div>
      </div>

      <PlantMemoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
