import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Users } from "lucide-react";

const people = [
  { name: "Nadun", color: "bg-emerald-700" },
  { name: "Sakuni", color: "bg-amber-700" },
  { name: "Sewmini", color: "bg-teal-700" },
];

const SocialGrove = () => {
  const [sent, setSent] = useState<Record<string, boolean>>({});

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onPlantMemory={() => {}} />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card/30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2 ml-3">
              <Users className="w-4 h-4 text-primary" />
              <h1 className="font-display text-lg text-primary tracking-wide">Social Grove</h1>
            </div>
          </header>

          <div className="flex-1 p-8">
            <p className="text-muted-foreground font-body text-sm mb-6">
              Connect with other forest keepers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">
              {people.map((person) => (
                <div
                  key={person.name}
                  className="rounded-xl border border-border bg-card/60 p-6 flex flex-col items-center gap-4"
                >
                  <div
                    className={`w-16 h-16 rounded-full ${person.color} flex items-center justify-center text-white font-display text-xl`}
                  >
                    {person.name[0]}
                  </div>
                  <span className="font-display text-foreground tracking-wide">{person.name}</span>
                  <button
                    onClick={() => setSent((s) => ({ ...s, [person.name]: true }))}
                    disabled={sent[person.name]}
                    className={`w-full py-2 rounded-lg font-body text-sm tracking-wide transition-colors ${
                      sent[person.name]
                        ? "bg-secondary text-muted-foreground cursor-default"
                        : "bg-primary text-primary-foreground hover:bg-gold-glow"
                    }`}
                  >
                    {sent[person.name] ? "Request Sent" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SocialGrove;
