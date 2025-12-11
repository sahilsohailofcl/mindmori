import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";
import { Button } from "@/components/ui/button";

interface MemoryGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

const COLORS = [
  { name: "red", class: "bg-destructive" },
  { name: "blue", class: "bg-primary" },
  { name: "green", class: "bg-success" },
  { name: "yellow", class: "bg-accent" },
];

type GamePhase = "instructions" | "showing" | "input" | "result";

const MemoryGame = ({ onComplete, onExit }: MemoryGameProps) => {
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [mascotEmotion, setMascotEmotion] = useState<"happy" | "excited" | "thinking" | "celebrating" | "sad">("happy");
  const [mascotMessage, setMascotMessage] = useState("Ready to train your memory?");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const generateSequence = useCallback((length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 4));
  }, []);

  const startGame = () => {
    const newSequence = generateSequence(3);
    setSequence(newSequence);
    setPlayerSequence([]);
    setPhase("showing");
    setCurrentShowIndex(0);
    setMascotEmotion("thinking");
    setMascotMessage("Watch carefully!");
  };

  const startNextRound = () => {
    const newLength = 3 + round;
    const newSequence = generateSequence(newLength);
    setSequence(newSequence);
    setPlayerSequence([]);
    setPhase("showing");
    setCurrentShowIndex(0);
    setMascotEmotion("thinking");
    setMascotMessage("Here we go again!");
    setIsCorrect(null);
  };

  // Show sequence animation
  useEffect(() => {
    if (phase !== "showing") return;

    if (currentShowIndex < sequence.length) {
      const timer = setTimeout(() => {
        setActiveTile(sequence[currentShowIndex]);
        setTimeout(() => {
          setActiveTile(null);
          setCurrentShowIndex((prev) => prev + 1);
        }, 500);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setPhase("input");
        setMascotEmotion("excited");
        setMascotMessage("Your turn! Tap the colors!");
      }, 500);
    }
  }, [phase, currentShowIndex, sequence]);

  const handleTileClick = (index: number) => {
    if (phase !== "input") return;

    setActiveTile(index);
    setTimeout(() => setActiveTile(null), 200);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong answer
      setIsCorrect(false);
      setPhase("result");
      setMascotEmotion("sad");
      setMascotMessage("Oops! Let's try again!");
    } else if (newPlayerSequence.length === sequence.length) {
      // Completed sequence correctly
      const roundScore = sequence.length * 10;
      setScore((prev) => prev + roundScore);
      setIsCorrect(true);
      setPhase("result");
      setMascotEmotion("celebrating");
      setMascotMessage(`Perfect! +${roundScore} points!`);
    }
  };

  const handleContinue = () => {
    if (isCorrect) {
      setRound((prev) => prev + 1);
      startNextRound();
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onExit} className="text-muted-foreground">
          Exit
        </Button>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Round</span>
            <p className="text-lg font-bold text-foreground">{round}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Score</span>
            <p className="text-lg font-bold text-primary">{score}</p>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <Mascot emotion={mascotEmotion} size="md" message={mascotMessage} />

        <AnimatePresence mode="wait">
          {phase === "instructions" && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center max-w-sm"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Memory Sequence</h2>
              <p className="text-muted-foreground mb-6">
                Watch the color sequence, then tap the tiles in the same order. The sequences get longer as you progress!
              </p>
              <Button onClick={startGame} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Start Game
              </Button>
            </motion.div>
          )}

          {(phase === "showing" || phase === "input") && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 w-full max-w-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                {COLORS.map((color, index) => (
                  <motion.button
                    key={color.name}
                    onClick={() => handleTileClick(index)}
                    disabled={phase !== "input"}
                    className={`aspect-square rounded-2xl ${color.class} transition-all duration-200 ${
                      activeTile === index ? "scale-95 brightness-125 shadow-glow" : ""
                    } ${phase === "input" ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
                    whileTap={phase === "input" ? { scale: 0.9 } : {}}
                  />
                ))}
              </div>
              
              {phase === "input" && (
                <div className="mt-4 flex justify-center gap-1">
                  {sequence.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < playerSequence.length ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 text-center"
            >
              <motion.div
                className={`text-6xl mb-4`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                {isCorrect ? "🎉" : "😢"}
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {isCorrect ? "Well Done!" : "Game Over"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isCorrect
                  ? `Round ${round} complete! Ready for the next challenge?`
                  : `Final Score: ${score} points`}
              </p>
              <Button
                onClick={handleContinue}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                {isCorrect ? "Next Round" : "Finish"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemoryGame;
