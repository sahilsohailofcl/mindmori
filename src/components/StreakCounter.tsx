import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  isActive?: boolean;
}

const StreakCounter = ({ streak, isActive = true }: StreakCounterProps) => {
  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
        isActive ? "bg-accent/10" : "bg-muted"
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative"
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Flame
          className={`w-8 h-8 ${isActive ? "text-accent" : "text-muted-foreground"}`}
          fill={isActive ? "hsl(var(--accent))" : "transparent"}
        />
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ boxShadow: "0 0 20px hsl(var(--streak))" }}
          />
        )}
      </motion.div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${isActive ? "text-accent" : "text-muted-foreground"}`}>
          {streak}
        </span>
        <span className="text-xs text-muted-foreground font-medium">day streak</span>
      </div>
    </motion.div>
  );
};

export default StreakCounter;
