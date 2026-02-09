import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MemoryTree = ({ scale }: { scale: number }) => {
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
        <meshStandardMaterial color="#1a6b3c" roughness={0.6} emissive="#0a2f1c" emissiveIntensity={0.2} />
      </mesh>

      {/* Smaller leaf cluster */}
      <mesh position={[0.5, 2.2, 0.3]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#22804a" roughness={0.7} emissive="#0a2f1c" emissiveIntensity={0.15} />
      </mesh>

      <mesh position={[-0.4, 2.4, -0.3]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#1f7040" roughness={0.7} emissive="#0a2f1c" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
};

const TreeCanvas = () => {
  const { user } = useAuth();
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      const { count } = await supabase
        .from("memories")
        .select("*", { count: "exact", head: true });
      setMemoryCount(count ?? 0);
    };
    fetchCount();
  }, [user]);

  const treeScale = memoryCount > 0 ? 1.5 : 1;

  return (
    <div className="flex-1 relative overflow-hidden bg-background">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#d4af37" />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#1a6b3c" />
        <Stars radius={50} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
        <MemoryTree scale={treeScale} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={12} />
      </Canvas>

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 text-muted-foreground/60 font-body text-xs">
        {memoryCount} {memoryCount === 1 ? "memory" : "memories"} planted
      </div>
    </div>
  );
};

export default TreeCanvas;
