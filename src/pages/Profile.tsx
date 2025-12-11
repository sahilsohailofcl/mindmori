import { motion } from "framer-motion";
import { Trophy, Flame, Brain, Calendar, RotateCcw } from "lucide-react";
import Mascot from "@/components/Mascot";
import XPBar from "@/components/XPBar";
import BottomNav from "@/components/BottomNav";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const {
    level,
    streak,
    longestStreak,
    completedMissions,
    getXPProgress,
    resetProgress,
  } = useGameState();

  const { currentXP, maxXP } = getXPProgress();
  const totalXP = (level - 1) * 100 + currentXP;

  const stats = [
    { icon: Trophy, label: "Total XP", value: totalXP, color: "text-primary" },
    { icon: Flame, label: "Current Streak", value: `${streak} days`, color: "text-accent" },
    { icon: Calendar, label: "Longest Streak", value: `${longestStreak} days`, color: "text-secondary" },
    { icon: Brain, label: "Missions Done", value: completedMissions, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      <motion.header
        className="p-4 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-lg mx-auto text-center">
          <Mascot emotion="happy" size="lg" />
          <motion.h1
            className="text-2xl font-bold text-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Progress
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Level {level} Mind Master
          </motion.p>
        </div>
      </motion.header>

      <main className="px-4 mt-6">
        <div className="max-w-lg mx-auto">
          {/* XP Progress */}
          <motion.div
            className="bg-card rounded-2xl p-6 shadow-card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <XPBar currentXP={currentXP} maxXP={maxXP} level={level} />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-card rounded-2xl p-4 shadow-soft"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievements Preview */}
          <motion.div
            className="bg-card rounded-2xl p-6 shadow-card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Achievements</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                { emoji: "🎯", name: "First Mission", unlocked: completedMissions >= 1 },
                { emoji: "🔥", name: "3 Day Streak", unlocked: longestStreak >= 3 },
                { emoji: "⭐", name: "Level 5", unlocked: level >= 5 },
                { emoji: "🏆", name: "100 XP", unlocked: totalXP >= 100 },
                { emoji: "💪", name: "7 Day Streak", unlocked: longestStreak >= 7 },
              ].map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                    achievement.unlocked ? "bg-primary/10" : "bg-muted grayscale"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  title={achievement.name}
                >
                  {achievement.emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reset Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your level, XP, streaks, and all achievements. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetProgress}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
