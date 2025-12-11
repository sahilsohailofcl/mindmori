import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Sparkles } from "lucide-react";
import Mascot from "./Mascot";
import { Button } from "@/components/ui/button";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
}

const LevelUpModal = ({ isOpen, onClose, newLevel }: LevelUpModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-card rounded-3xl p-8 max-w-sm w-full shadow-card overflow-hidden"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-levelup/20 to-transparent" />
            
            {/* Floating stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-accent"
                style={{
                  top: `${20 + Math.random() * 30}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.2,
                }}
              >
                {i % 2 === 0 ? <Star className="w-4 h-4" fill="currentColor" /> : <Sparkles className="w-4 h-4" />}
              </motion.div>
            ))}
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <Mascot emotion="celebrating" size="lg" />
              
              <motion.h2
                className="text-3xl font-bold text-foreground mt-4 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Level Up! 🎉
              </motion.h2>
              
              <motion.div
                className="w-20 h-20 rounded-2xl bg-levelup flex items-center justify-center mb-4 shadow-glow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 10 }}
              >
                <span className="text-4xl font-bold text-secondary-foreground">{newLevel}</span>
              </motion.div>
              
              <motion.p
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Amazing work! You've reached Level {newLevel}. Keep training your mind!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;
