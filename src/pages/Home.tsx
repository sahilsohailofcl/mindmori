import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Mascot from "@/components/Mascot";
import XPBar from "@/components/XPBar";
import StreakCounter from "@/components/StreakCounter";
import DailyMissionCard from "@/components/DailyMissionCard";
import BottomNav from "@/components/BottomNav";
import LevelUpModal from "@/components/LevelUpModal";
import MemoryGame from "@/components/MemoryGame";
import { useGameState } from "@/hooks/useGameState";

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const {
    level,
    streak,
    addXP,
    completeMission,
    getXPProgress,
    isMissionCompletedToday,
    showLevelUp,
    setShowLevelUp,
    newLevel,
  } = useGameState();

  const { currentXP, maxXP } = getXPProgress();
  const missionCompleted = isMissionCompletedToday();

  const getMascotMessage = () => {
    if (missionCompleted) {
      return "Great job today! See you tomorrow! 🌟";
    }
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Ready for brain training?";
    if (hour < 18) return "Let's give your brain a workout!";
    return "Evening training session? Let's do it!";
  };

  const handleGameComplete = (score: number) => {
    const xpEarned = Math.max(20, score);
    addXP(xpEarned);
    if (!missionCompleted) {
      completeMission();
    }
    setIsPlaying(false);
  };

  if (isPlaying) {
    return <MemoryGame onComplete={handleGameComplete} onExit={() => setIsPlaying(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <motion.header
        className="p-4 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.h1
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              MindMori
            </motion.h1>
            <StreakCounter streak={streak} isActive={streak > 0} />
          </div>

          {/* Mascot section */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Mascot
              emotion={missionCompleted ? "celebrating" : "happy"}
              size="lg"
              message={getMascotMessage()}
            />
          </motion.div>

          {/* XP Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <XPBar currentXP={currentXP} maxXP={maxXP} level={level} />
          </motion.div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="px-4 mt-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Today's Mission</h2>
            <DailyMissionCard
              title="Memory Sequence"
              description="Remember and repeat color patterns to sharpen your memory!"
              xpReward={50}
              timeEstimate="3-5 min"
              isCompleted={missionCompleted}
              onStart={() => setIsPlaying(true)}
            />
          </motion.div>

          {/* Quick stats */}
          <motion.div
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <span className="text-sm text-muted-foreground">Total XP</span>
              <p className="text-2xl font-bold text-primary">{(level - 1) * maxXP + currentXP}</p>
            </div>
            <div
              className="bg-card rounded-2xl p-4 shadow-soft cursor-pointer hover:shadow-card transition-shadow"
              onClick={() => navigate("/profile")}
            >
              <span className="text-sm text-muted-foreground">View Profile</span>
              <p className="text-2xl font-bold text-secondary">→</p>
            </div>
          </motion.div>
        </div>
      </main>

      <BottomNav />
      <LevelUpModal isOpen={showLevelUp} onClose={() => setShowLevelUp(false)} newLevel={newLevel} />
    </div>
  );
};

export default Home;
