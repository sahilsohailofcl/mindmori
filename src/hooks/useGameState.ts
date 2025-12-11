import { useState, useEffect, useCallback } from "react";

interface GameState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  completedMissions: number;
  lastPlayedDate: string | null;
  hasCompletedOnboarding: boolean;
}

const INITIAL_STATE: GameState = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  completedMissions: 0,
  lastPlayedDate: null,
  hasCompletedOnboarding: false,
};

const XP_PER_LEVEL = 100;

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem("mindmori_state");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if streak should be reset
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (parsed.lastPlayedDate && parsed.lastPlayedDate !== today && parsed.lastPlayedDate !== yesterday) {
        return { ...parsed, streak: 0 };
      }
      return parsed;
    }
    return INITIAL_STATE;
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  // Persist state
  useEffect(() => {
    localStorage.setItem("mindmori_state", JSON.stringify(state));
  }, [state]);

  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const xpForNextLevel = prev.level * XP_PER_LEVEL;
      
      if (newXP >= xpForNextLevel) {
        const levelUp = Math.floor(newXP / XP_PER_LEVEL) + 1;
        if (levelUp > prev.level) {
          setNewLevel(levelUp);
          setShowLevelUp(true);
        }
        return {
          ...prev,
          xp: newXP % XP_PER_LEVEL,
          level: levelUp,
        };
      }
      
      return { ...prev, xp: newXP };
    });
  }, []);

  const completeMission = useCallback(() => {
    const today = new Date().toDateString();
    
    setState((prev) => {
      const isNewDay = prev.lastPlayedDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
      
      return {
        ...prev,
        completedMissions: prev.completedMissions + 1,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastPlayedDate: today,
      };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(INITIAL_STATE);
    localStorage.removeItem("mindmori_state");
  }, []);

  const getXPProgress = useCallback(() => {
    const maxXP = state.level * XP_PER_LEVEL;
    return { currentXP: state.xp, maxXP };
  }, [state.xp, state.level]);

  const isMissionCompletedToday = useCallback(() => {
    const today = new Date().toDateString();
    return state.lastPlayedDate === today;
  }, [state.lastPlayedDate]);

  return {
    ...state,
    addXP,
    completeMission,
    completeOnboarding,
    resetProgress,
    getXPProgress,
    isMissionCompletedToday,
    showLevelUp,
    setShowLevelUp,
    newLevel,
  };
};
