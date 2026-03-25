import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TaggedPerson {
  user_id: string;
  display_name: string | null;
}

const MemoryTree = ({ scale, color = "#1a6b3c", label }: { scale: number; color?: string; label?: string }) => {
  return (
    <group scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 2, 8]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.8} />
      </mesh>

      {/* Leaves */}
      <mesh position={[0, 2.8, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={color} roughness={0.6} emissive={color} emissiveIntensity={0.15} />
      </mesh>

      <mesh position={[0.5, 2.2, 0.3]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} emissive={color} emissiveIntensity={0.1} />
      </mesh>

      <mesh position={[-0.4, 2.4, -0.3]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} emissive={color} emissiveIntensity={0.1} />
      </mesh>

      {/* Name label */}
      {label && (
        <Html position={[0, 4.2, 0]} center>
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-md px-2 py-0.5 text-xs font-body text-primary whitespace-nowrap pointer-events-none">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

const TREE_COLORS = ["#2d8a5e", "#8a6d2d", "#5e2d8a", "#8a2d5e", "#2d5e8a"];

const TreeCanvas = () => {
  const { user } = useAuth();
  const [memoryCount, setMemoryCount] = useState(0);
  const [taggedPeople, setTaggedPeople] = useState<TaggedPerson[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Get memory count
      const { count } = await supabase
        .from("memories")
        .select("*", { count: "exact", head: true });
      setMemoryCount(count ?? 0);

      // Get unique tagged people from user's memories
      const { data: tags } = await supabase
        .from("memory_tags")
        .select("tagged_user_id");

      if (tags && tags.length > 0) {
        const uniqueIds = [...new Set(tags.map((t) => t.tagged_user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name")
          .in("user_id", uniqueIds);

        if (profiles) {
          setTaggedPeople(profiles);
        }
      } else {
        setTaggedPeople([]);
      }
    };

    fetchData();
  }, [user]);

  const treeScale = memoryCount > 0 ? 1.5 : 1;

  // Position tagged trees in a semicircle around the main tree
  const getPosition = (index: number, total: number): [number, number, number] => {
    const spread = Math.min(total * 2.5, 10);
    const angle = ((index + 1) / (total + 1)) * Math.PI - Math.PI / 2;
    return [Math.sin(angle) * spread, 0, Math.cos(angle) * spread * 0.5];
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-background">
      <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#d4af37" />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#1a6b3c" />
        <Stars radius={50} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />

        {/* Main user tree */}
        <MemoryTree scale={treeScale} label="My Forest" />

        {/* Tagged people trees */}
        {taggedPeople.map((person, i) => {
          const pos = getPosition(i, taggedPeople.length);
          return (
            <group key={person.user_id} position={pos}>
              <MemoryTree
                scale={0.7}
                color={TREE_COLORS[i % TREE_COLORS.length]}
                label={person.display_name || "Friend"}
              />
            </group>
          );
        })}

        <OrbitControls enablePan={false} minDistance={3} maxDistance={16} />
      </Canvas>

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 text-muted-foreground/60 font-body text-xs">
        {memoryCount} {memoryCount === 1 ? "memory" : "memories"} planted
        {taggedPeople.length > 0 && ` · ${taggedPeople.length} connected`}
      </div>
    </div>
  );
};

export default TreeCanvas;
