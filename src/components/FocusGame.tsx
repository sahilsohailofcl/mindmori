import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";
import { Button } from "@/components/ui/button";

interface FocusGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

type GamePhase = "instructions" | "playing" | "result";

interface Ball {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  isTarget: boolean;
  color: string;
}

const FocusGame = ({ onComplete, onExit }: FocusGameProps) => {
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [highlightTargets, setHighlightTargets] = useState(false);
  const [selectedBalls, setSelectedBalls] = useState<number[]>([]);
  const [canSelect, setCanSelect] = useState(false);
  const [roundResult, setRoundResult] = useState<boolean | null>(null);
  const [mascotEmotion, setMascotEmotion] = useState<"happy" | "excited" | "thinking" | "celebrating" | "sad">("happy");
  const [mascotMessage, setMascotMessage] = useState("Ready to test your focus?");
  const animRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetCount = Math.min(2 + Math.floor((round - 1) / 2), 5);
  const totalBalls = targetCount + 3 + Math.floor(round / 2);

  const initBalls = useCallback(() => {
    const newBalls: Ball[] = [];
    for (let i = 0; i < Math.min(totalBalls, 10); i++) {
      newBalls.push({
        id: i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        isTarget: i < targetCount,
        color: "hsl(var(--muted-foreground))",
      });
    }
    setBalls(newBalls);
    ballsRef.current = newBalls;
  }, [totalBalls, targetCount]);

  const startRound = () => {
    initBalls();
    setSelectedBalls([]);
    setRoundResult(null);
    setCanSelect(false);
    setHighlightTargets(true);
    setMascotEmotion("thinking");
    setMascotMessage("Remember the highlighted balls!");
    setPhase("playing");

    // Show targets for 2 seconds, then start moving
    setTimeout(() => {
      setHighlightTargets(false);
      setMascotMessage("Track them! Click when they stop.");

      // Move balls for 3 seconds
      let startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > 3000) {
          setCanSelect(true);
          setMascotEmotion("excited");
          setMascotMessage(`Select the ${targetCount} target balls!`);
          return;
        }
        ballsRef.current = ballsRef.current.map((b) => {
          let nx = b.x + b.dx;
          let ny = b.y + b.dy;
          let ndx = b.dx;
          let ndy = b.dy;
          if (nx < 5 || nx > 95) ndx = -ndx;
          if (ny < 5 || ny > 95) ndy = -ndy;
          return { ...b, x: Math.max(5, Math.min(95, nx)), y: Math.max(5, Math.min(95, ny)), dx: ndx, dy: ndy };
        });
        setBalls([...ballsRef.current]);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }, 2000);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleBallClick = (id: number) => {
    if (!canSelect) return;
    if (selectedBalls.includes(id)) {
      setSelectedBalls(selectedBalls.filter((b) => b !== id));
    } else if (selectedBalls.length < targetCount) {
      const newSelected = [...selectedBalls, id];
      setSelectedBalls(newSelected);

      if (newSelected.length === targetCount) {
        // Check answer
        const correct = newSelected.every((sid) => balls.find((b) => b.id === sid)?.isTarget);
        setRoundResult(correct);
        setCanSelect(false);
        setHighlightTargets(true);
        if (correct) {
          const pts = targetCount * 15;
          setScore((p) => p + pts);
          setMascotEmotion("celebrating");
          setMascotMessage(`Amazing focus! +${pts} points!`);
        } else {
          setMascotEmotion("sad");
          setMascotMessage("Not quite right!");
        }
      }
    }
  };

  const handleContinue = () => {
    if (roundResult) {
      setRound((p) => p + 1);
      setTimeout(() => startRound(), 100);
    } else {
      onComplete(score);
    }
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Focus Training</h2>
              <p className="text-muted-foreground mb-6">
                Some balls will be highlighted. Memorize them, then track them as they move. When they stop, select the target balls!
              </p>
              <Button onClick={startRound} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Start Game</Button>
            </motion.div>
          )}

          {phase === "playing" && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 w-full max-w-xs">
              <div ref={containerRef} className="relative aspect-square bg-card rounded-2xl shadow-card overflow-hidden">
                {balls.map((ball) => {
                  const isSelected = selectedBalls.includes(ball.id);
                  const showTarget = highlightTargets && ball.isTarget;
                  return (
                    <motion.div
                      key={ball.id}
                      onClick={() => handleBallClick(ball.id)}
                      className={`absolute w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${
                        showTarget ? "bg-primary shadow-glow" :
                        isSelected ? "bg-accent ring-2 ring-accent" :
                        roundResult !== null && ball.isTarget ? "bg-primary/60" :
                        "bg-muted-foreground/40"
                      } ${canSelect ? "cursor-pointer hover:brightness-125" : "cursor-default"}`}
                      style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
                    />
                  );
                })}
              </div>

              {roundResult !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                  <p className="text-lg font-bold text-foreground mb-4">
                    {roundResult ? "🎯 Perfect Focus!" : "😢 Game Over"}
                  </p>
                  <Button onClick={handleContinue} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    {roundResult ? "Next Round" : "Finish"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FocusGame;
