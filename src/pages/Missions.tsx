import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Eye, Calculator, Puzzle, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import MemoryGame from "@/components/MemoryGame";
import { useGameState } from "@/hooks/useGameState";
import LevelUpModal from "@/components/LevelUpModal";

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: typeof Brain;
  xpReward: number;
  unlockLevel: number;
  available: boolean;
}

const Missions = () => {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const { level, addXP, completeMission, showLevelUp, setShowLevelUp, newLevel } = useGameState();

  const missions: Mission[] = [
    {
      id: "memory",
      title: "Memory Sequence",
      description: "Remember and repeat color patterns",
      icon: Brain,
      xpReward: 50,
      unlockLevel: 1,
      available: true,
    },
    {
      id: "focus",
      title: "Focus Training",
      description: "Track moving objects and test your attention",
      icon: Eye,
      xpReward: 60,
      unlockLevel: 3,
      available: false,
    },
    {
      id: "math",
      title: "Quick Math",
      description: "Solve equations under time pressure",
      icon: Calculator,
      xpReward: 70,
      unlockLevel: 5,
      available: false,
    },
    {
      id: "pattern",
      title: "Pattern Match",
      description: "Find matching patterns in complex grids",
      icon: Puzzle,
      xpReward: 80,
      unlockLevel: 7,
      available: false,
    },
  ];

  const handleGameComplete = (score: number) => {
    const xpEarned = Math.max(20, score);
    addXP(xpEarned);
    completeMission();
    setActiveMission(null);
  };

  if (activeMission === "memory") {
    return (
      <MemoryGame
        onComplete={handleGameComplete}
        onExit={() => setActiveMission(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <motion.header
        className="p-4 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-2">Mind Missions</h1>
          <p className="text-muted-foreground">Choose your training challenge</p>
        </div>
      </motion.header>

      <main className="px-4 mt-6">
        <div className="max-w-lg mx-auto space-y-4">
          {missions.map((mission, index) => {
            const isUnlocked = level >= mission.unlockLevel;
            const Icon = mission.icon;

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => isUnlocked && mission.available && setActiveMission(mission.id)}
                  disabled={!isUnlocked || !mission.available}
                  className={`w-full text-left p-4 rounded-2xl transition-all ${
                    isUnlocked && mission.available
                      ? "bg-card shadow-card hover:shadow-glow cursor-pointer"
                      : "bg-muted/50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        isUnlocked ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      {isUnlocked ? (
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-bold ${
                            isUnlocked ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {mission.title}
                        </h3>
                        {!mission.available && isUnlocked && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-accent">+{mission.xpReward} XP</span>
                        {!isUnlocked && (
                          <span className="text-xs text-muted-foreground">
                            Unlocks at Level {mission.unlockLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>

      <BottomNav />
      <LevelUpModal isOpen={showLevelUp} onClose={() => setShowLevelUp(false)} newLevel={newLevel} />
    </div>
  );
};

export default Missions;
