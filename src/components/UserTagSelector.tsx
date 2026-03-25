import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { X, UserPlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface UserTagSelectorProps {
  selectedUsers: Profile[];
  onChange: (users: Profile[]) => void;
}

const UserTagSelector = ({ selectedUsers, onChange }: UserTagSelectorProps) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url");
      if (data) {
        setProfiles(data.filter((p) => p.user_id !== user?.id));
      }
    };
    fetchProfiles();
  }, [user]);

  const filtered = profiles.filter(
    (p) =>
      !selectedUsers.some((s) => s.user_id === p.user_id) &&
      (p.display_name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const addUser = (profile: Profile) => {
    onChange([...selectedUsers, profile]);
    setSearch("");
  };

  const removeUser = (userId: string) => {
    onChange(selectedUsers.filter((u) => u.user_id !== userId));
  };

  return (
    <div className="space-y-2">
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedUsers.map((u) => (
            <Badge
              key={u.user_id}
              variant="secondary"
              className="gap-1 bg-primary/20 text-primary border-primary/30"
            >
              {u.display_name || "User"}
              <button onClick={() => removeUser(u.user_id)} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-input border-border text-muted-foreground font-body text-sm justify-start gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Tag someone...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-card border-border" align="start">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-input border-border text-foreground text-sm mb-2"
            autoFocus
          />
          <ScrollArea className="max-h-40">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">
                {profiles.length === 0 ? "No other users yet" : "No matches"}
              </p>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.user_id}
                  onClick={() => addUser(p)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-sm text-foreground font-body transition-colors"
                >
                  {p.display_name || "Unknown User"}
                </button>
              ))
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserTagSelector;
