import { motion } from "framer-motion";

interface MascotProps {
  emotion?: "happy" | "excited" | "thinking" | "celebrating" | "sad";
  size?: "sm" | "md" | "lg";
  message?: string;
}

const Mascot = ({ emotion = "happy", size = "md", message }: MascotProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const getEyeAnimation = () => {
    switch (emotion) {
      case "excited":
        return { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.5 } };
      case "celebrating":
        return { y: [0, -2, 0], transition: { repeat: Infinity, duration: 0.3 } };
      default:
        return {};
    }
  };

  const getBodyAnimation = () => {
    switch (emotion) {
      case "excited":
        return { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.4 } };
      case "celebrating":
        return { rotate: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.3 } };
      case "thinking":
        return { rotate: [0, 3, 0], transition: { repeat: Infinity, duration: 2 } };
      default:
        return { y: [0, -3, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const } };
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={getBodyAnimation()}
      >
        {/* Fox body */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Ears */}
          <motion.path
            d="M25 35 L15 10 L35 25 Z"
            fill="hsl(var(--accent))"
            animate={emotion === "excited" ? { rotate: [-5, 5, -5] } : {}}
            style={{ transformOrigin: "25px 35px" }}
          />
          <motion.path
            d="M75 35 L85 10 L65 25 Z"
            fill="hsl(var(--accent))"
            animate={emotion === "excited" ? { rotate: [5, -5, 5] } : {}}
            style={{ transformOrigin: "75px 35px" }}
          />
          {/* Inner ears */}
          <path d="M25 32 L20 15 L32 27 Z" fill="hsl(var(--streak-glow))" />
          <path d="M75 32 L80 15 L68 27 Z" fill="hsl(var(--streak-glow))" />
          
          {/* Head */}
          <circle cx="50" cy="55" r="35" fill="hsl(var(--accent))" />
          
          {/* White face area */}
          <ellipse cx="50" cy="62" rx="25" ry="22" fill="white" />
          
          {/* Eyes */}
          <motion.g animate={getEyeAnimation()}>
            <circle cx="38" cy="50" r="6" fill="hsl(var(--foreground))" />
            <circle cx="62" cy="50" r="6" fill="hsl(var(--foreground))" />
            {/* Eye shine */}
            <circle cx="40" cy="48" r="2" fill="white" />
            <circle cx="64" cy="48" r="2" fill="white" />
          </motion.g>
          
          {/* Nose */}
          <ellipse cx="50" cy="62" rx="4" ry="3" fill="hsl(var(--foreground))" />
          
          {/* Mouth based on emotion */}
          {emotion === "happy" && (
            <path d="M42 68 Q50 75 58 68" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
          )}
          {emotion === "excited" && (
            <ellipse cx="50" cy="70" rx="6" ry="4" fill="hsl(var(--foreground))" />
          )}
          {emotion === "celebrating" && (
            <>
              <ellipse cx="50" cy="70" rx="8" ry="5" fill="hsl(var(--foreground))" />
              <ellipse cx="50" cy="69" rx="5" ry="2" fill="hsl(var(--destructive))" />
            </>
          )}
          {emotion === "thinking" && (
            <path d="M45 70 L55 70" stroke="hsl(var(--foreground))" strokeWidth="2" />
          )}
          {emotion === "sad" && (
            <path d="M42 72 Q50 65 58 72" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" />
          )}
          
          {/* Blush */}
          <circle cx="30" cy="58" r="5" fill="hsl(var(--streak))" opacity="0.3" />
          <circle cx="70" cy="58" r="5" fill="hsl(var(--streak))" opacity="0.3" />
        </svg>
        
        {/* Celebration sparkles */}
        {emotion === "celebrating" && (
          <>
            <motion.div
              className="absolute -top-2 -left-2 w-4 h-4 text-accent"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-2 w-4 h-4 text-accent"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
            >
              ⭐
            </motion.div>
            <motion.div
              className="absolute top-0 left-1/2 w-4 h-4 text-accent"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}
            >
              🌟
            </motion.div>
          </>
        )}
      </motion.div>
      
      {/* Speech bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative bg-card rounded-2xl px-4 py-2 shadow-card max-w-[200px]"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card rotate-45" />
          <p className="text-sm font-semibold text-foreground text-center relative z-10">
            {message}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Mascot;
