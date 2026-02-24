import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";
import { Button } from "@/components/ui/button";

interface PatternGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

type GamePhase = "instructions" | "memorize" | "playing" | "result";

const SYMBOLS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⭐", "💎"];

const PatternGame = ({ onComplete, onExit }: PatternGameProps) => {
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [grid, setGrid] = useState<string[]>([]);
  const [targetSymbol, setTargetSymbol] = useState("");
  const [targetCount, setTargetCount] = useState(0);
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [allTargetIndices, setAllTargetIndices] = useState<number[]>([]);
  const [roundComplete, setRoundComplete] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<"happy" | "excited" | "thinking" | "celebrating" | "sad">("happy");
  const [mascotMessage, setMascotMessage] = useState("Find the patterns!");

  const gridSize = Math.min(4 + Math.floor(round / 3), 6);
  const totalCells = gridSize * gridSize;

  const generateGrid = useCallback(() => {
    const symbolPool = SYMBOLS.slice(0, Math.min(3 + round, SYMBOLS.length));
    const target = symbolPool[Math.floor(Math.random() * symbolPool.length)];
    const count = 2 + Math.floor(Math.random() * 3);

    const newGrid: string[] = [];
    const targetPositions = new Set<number>();

    // Place targets
    while (targetPositions.size < count) {
      targetPositions.add(Math.floor(Math.random() * totalCells));
    }

    for (let i = 0; i < totalCells; i++) {
      if (targetPositions.has(i)) {
        newGrid.push(target);
      } else {
        let sym = symbolPool[Math.floor(Math.random() * symbolPool.length)];
        while (sym === target) {
          sym = symbolPool[Math.floor(Math.random() * symbolPool.length)];
        }
        newGrid.push(sym);
      }
    }

    setGrid(newGrid);
    setTargetSymbol(target);
    setTargetCount(count);
    setAllTargetIndices(Array.from(targetPositions));
    setFoundIndices([]);
    setWrongIndices([]);
    setRoundComplete(false);
  }, [round, totalCells]);

  const startGame = () => {
    generateGrid();
    setPhase("memorize");
    setMascotEmotion("thinking");
    setMascotMessage("Study the grid...");

    setTimeout(() => {
      setPhase("playing");
      setMascotEmotion("excited");
    }, 2000);
  };

  useEffect(() => {
    if (phase === "playing") {
      setMascotMessage(`Find all ${targetCount} × ${targetSymbol}`);
    }
  }, [phase, targetCount, targetSymbol]);

  const handleCellClick = (index: number) => {
    if (phase !== "playing" || roundComplete) return;
    if (foundIndices.includes(index) || wrongIndices.includes(index)) return;

    if (grid[index] === targetSymbol) {
      const newFound = [...foundIndices, index];
      setFoundIndices(newFound);

      if (newFound.length === targetCount) {
        const pts = targetCount * 20;
        setScore((p) => p + pts);
        setRoundComplete(true);
        setMascotEmotion("celebrating");
        setMascotMessage(`Found them all! +${pts} 🎯`);
      }
    } else {
      setWrongIndices((p) => [...p, index]);
      setMascotEmotion("sad");
      setMascotMessage("That's not the one!");

      if (wrongIndices.length + 1 >= 3) {
        setRoundComplete(true);
        setPhase("result");
        setMascotMessage("Too many mistakes!");
      }
    }
  };

  const handleNextRound = () => {
    setRound((p) => p + 1);
    generateGrid();
    setPhase("memorize");
    setMascotEmotion("thinking");
    setMascotMessage("Next pattern coming...");
    setTimeout(() => {
      setPhase("playing");
      setMascotEmotion("excited");
    }, 2000);
  };

  const handleFinish = () => {
    onComplete(score);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onExit} className="text-muted-foreground">Exit</Button>
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <Mascot emotion={mascotEmotion} size="md" message={mascotMessage} />

        <AnimatePresence mode="wait">
          {phase === "instructions" && (
            <motion.div key="instructions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 text-center max-w-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">Pattern Match</h2>
              <p className="text-muted-foreground mb-6">
                A grid of symbols will appear. Find and tap all instances of the target symbol. Be careful — 3 wrong taps and it's game over!
              </p>
              <Button onClick={startGame} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Start Game</Button>
            </motion.div>
          )}

          {(phase === "memorize" || phase === "playing") && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 w-full max-w-xs">
              {/* Target indicator */}
              <div className="text-center mb-4">
                <span className="text-sm text-muted-foreground">Find: </span>
                <span className="text-2xl">{targetSymbol}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({foundIndices.length}/{targetCount})
                </span>
              </div>

              {/* Mistakes */}
              <div className="flex justify-center gap-1 mb-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < wrongIndices.length ? "bg-destructive" : "bg-muted"}`} />
                ))}
              </div>

              {/* Grid */}
              <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {grid.map((symbol, i) => {
                  const isFound = foundIndices.includes(i);
                  const isWrong = wrongIndices.includes(i);
                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      disabled={phase === "memorize" || roundComplete}
                      whileTap={{ scale: 0.9 }}
                      className={`aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                        isFound ? "bg-success/30 ring-2 ring-success" :
                        isWrong ? "bg-destructive/20 ring-2 ring-destructive" :
                        "bg-card shadow-card hover:shadow-glow"
                      } ${phase === "playing" && !roundComplete ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {symbol}
                    </motion.button>
                  );
                })}
              </div>

              {roundComplete && phase === "playing" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                  <Button onClick={handleNextRound} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Next Round</Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 text-center">
              <motion.div className="text-6xl mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                {score >= 60 ? "🧩" : "📋"}
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Game Over</h3>
              <p className="text-muted-foreground mb-2">You completed {round - 1} rounds</p>
              <p className="text-lg font-bold text-primary mb-6">Score: {score}</p>
              <Button onClick={handleFinish} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatternGame;
