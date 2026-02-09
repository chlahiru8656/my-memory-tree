import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Smile, Frown, Star, Leaf } from "lucide-react";
import { format } from "date-fns";

interface Memory {
  id: string;
  image_url: string | null;
  description: string;
  memory_date: string;
  emotion: string;
  created_at: string;
}

const emotionConfig: Record<string, { icon: typeof Smile; color: string }> = {
  Happy: { icon: Smile, color: "text-gold-glow" },
  Sad: { icon: Frown, color: "text-muted-foreground" },
  Special: { icon: Star, color: "text-primary" },
};

const ActivityFeed = ({ refreshKey }: { refreshKey: number }) => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMemories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setMemories(data as Memory[]);
      }
      setLoading(false);
    };
    fetchMemories();
  }, [user, refreshKey]);

  return (
    <div className="w-80 border-l border-border bg-card/50 flex flex-col">
      <div className="p-5 border-b border-border">
        <h3 className="font-display text-lg text-primary tracking-wide">Recent Memories</h3>
        <p className="text-xs text-muted-foreground font-body mt-1">
          {memories.length} memories planted
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Leaf className="w-6 h-6 text-primary/40 animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Leaf className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-body">
              No memories yet. Plant your first one!
            </p>
          </div>
        ) : (
          memories.map((memory) => {
            const config = emotionConfig[memory.emotion] || emotionConfig.Happy;
            const EmotionIcon = config.icon;
            return (
              <div
                key={memory.id}
                className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors group"
              >
                {memory.image_url && (
                  <img
                    src={memory.image_url}
                    alt="Memory"
                    className="w-full h-32 object-cover rounded-md mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <div className="flex items-start gap-2">
                  <EmotionIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-body line-clamp-2">
                      {memory.description}
                    </p>
                    <p className="text-muted-foreground text-xs font-body mt-1">
                      {format(new Date(memory.memory_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
