import { TreePine } from "lucide-react";

const TreeCanvas = () => {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-forest-deep via-background to-forest-mid">
      {/* Ambient particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="text-center float-animation">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center border border-border">
          <TreePine className="w-12 h-12 text-primary/60" />
        </div>
        <p className="text-muted-foreground font-body text-lg tracking-wide">
          Tree Loading...
        </p>
        <p className="text-muted-foreground/50 font-body text-sm mt-2">
          Your memory tree will grow here
        </p>
        <div className="mt-6 w-48 h-0.5 mx-auto shimmer rounded-full" />
      </div>
    </div>
  );
};

export default TreeCanvas;
