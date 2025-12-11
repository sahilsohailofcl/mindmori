import { motion } from "framer-motion";
import { Brain, Clock, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyMissionCardProps {
  title: string;
  description: string;
  xpReward: number;
  timeEstimate: string;
  isCompleted?: boolean;
  onStart: () => void;
}

const DailyMissionCard = ({
  title,
  description,
  xpReward,
  timeEstimate,
  isCompleted = false,
  onStart,
}: DailyMissionCardProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-6 ${
        isCompleted ? "bg-success/10" : "bg-card"
      } shadow-card`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <motion.div
            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              isCompleted ? "bg-success" : "bg-primary"
            }`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Brain className="w-7 h-7 text-primary-foreground" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-accent">+{xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{timeEstimate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          onClick={onStart}
          disabled={isCompleted}
          className={`w-full group ${
            isCompleted
              ? "bg-success/20 text-success hover:bg-success/30"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isCompleted ? (
            "Completed! ✓"
          ) : (
            <>
              Start Mission
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default DailyMissionCard;
