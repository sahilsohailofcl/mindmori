import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

const XPBar = ({ currentXP, maxXP, level }: XPBarProps) => {
  const progress = (currentXP / maxXP) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-primary-foreground font-bold text-lg">{level}</span>
          </motion.div>
          <span className="text-sm font-semibold text-muted-foreground">Level {level}</span>
        </div>
        <span className="text-sm font-bold text-foreground">
          {currentXP} / {maxXP} XP
        </span>
      </div>
      
      <div className="relative h-4 bg-xp-bg rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
          style={{ width: `${progress}%` }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default XPBar;
