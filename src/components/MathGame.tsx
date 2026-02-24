import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Mascot from "./Mascot";
import { Button } from "@/components/ui/button";

interface MathGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

type GamePhase = "instructions" | "playing" | "result";

interface Problem {
  question: string;
  answer: number;
  options: number[];
}

const MathGame = ({ onComplete, onExit }: MathGameProps) => {
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mascotEmotion, setMascotEmotion] = useState<"happy" | "excited" | "thinking" | "celebrating" | "sad">("happy");
  const [mascotMessage, setMascotMessage] = useState("Time to sharpen your math skills!");

  const generateProblem = useCallback((): Problem => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const difficulty = Math.min(round, 5);
    let a: number, b: number, answer: number;

    switch (op) {
      case "+":
        a = Math.floor(Math.random() * (10 * difficulty)) + 1;
        b = Math.floor(Math.random() * (10 * difficulty)) + 1;
        answer = a + b;
        break;
      case "-":
        a = Math.floor(Math.random() * (10 * difficulty)) + 5;
        b = Math.floor(Math.random() * Math.min(a, 10 * difficulty)) + 1;
        answer = a - b;
        break;
      case "×":
        a = Math.floor(Math.random() * (3 * difficulty)) + 2;
        b = Math.floor(Math.random() * (3 * difficulty)) + 2;
        answer = a * b;
        break;
      default:
        a = 1; b = 1; answer = 2;
    }

    // Generate wrong options close to the answer
    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrong = answer + (offset === 0 ? 1 : offset);
      if (wrong >= 0) optionsSet.add(wrong);
    }
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { question: `${a} ${op} ${b} = ?`, answer, options };
  }, [round]);

  const startGame = () => {
    setPhase("playing");
    setTimeLeft(30);
    setTotalQuestions(0);
    setCorrectCount(0);
    setScore(0);
    nextProblem();
  };

  const nextProblem = () => {
    setProblem(generateProblem());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMascotEmotion("thinking");
    setMascotMessage("Quick, solve it!");
  };

  // Timer
  useEffect(() => {
    if (phase !== "playing" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setPhase("result");
          setMascotEmotion(correctCount > 3 ? "celebrating" : "sad");
          setMascotMessage(correctCount > 3 ? `Great job! ${correctCount} correct!` : "Time's up!");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, correctCount]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    const correct = answer === problem?.answer;
    setIsCorrect(correct);
    setTotalQuestions((p) => p + 1);

    if (correct) {
      const pts = 10 + round * 2;
      setScore((p) => p + pts);
      setCorrectCount((p) => p + 1);
      setMascotEmotion("excited");
      setMascotMessage(`Correct! +${pts} ⚡`);
    } else {
      setMascotEmotion("sad");
      setMascotMessage(`It was ${problem?.answer}`);
    }

    setTimeout(() => {
      if (timeLeft > 0) nextProblem();
    }, 800);
  };

  const handleFinish = () => {
    setRound((p) => p + 1);
    onComplete(score);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onExit} className="text-muted-foreground">Exit</Button>
        <div className="flex items-center gap-4">
          {phase === "playing" && (
            <div className="text-center">
              <span className="text-xs text-muted-foreground">Time</span>
              <p className={`text-lg font-bold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>{timeLeft}s</p>
            </div>
          )}
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Quick Math</h2>
              <p className="text-muted-foreground mb-6">
                Solve as many math problems as you can in 30 seconds! Pick the correct answer from the options below each equation.
              </p>
              <Button onClick={startGame} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Start Game</Button>
            </motion.div>
          )}

          {phase === "playing" && problem && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 w-full max-w-xs">
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(timeLeft / 30) * 100}%` }} transition={{ duration: 0.5 }} />
              </div>

              <motion.div key={problem.question} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="text-center mb-8">
                <p className="text-4xl font-bold text-foreground">{problem.question}</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {problem.options.map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  const showCorrect = selectedAnswer !== null && opt === problem.answer;
                  return (
                    <motion.button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      disabled={selectedAnswer !== null}
                      whileTap={{ scale: 0.95 }}
                      className={`py-4 rounded-2xl text-xl font-bold transition-all ${
                        showCorrect ? "bg-success text-success-foreground" :
                        isSelected && !isCorrect ? "bg-destructive text-destructive-foreground" :
                        "bg-card shadow-card hover:shadow-glow text-foreground"
                      }`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8 text-center">
              <motion.div className="text-6xl mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                {correctCount >= 5 ? "🧠" : correctCount >= 3 ? "💪" : "📝"}
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Time's Up!</h3>
              <p className="text-muted-foreground mb-2">
                {correctCount} / {totalQuestions} correct
              </p>
              <p className="text-lg font-bold text-primary mb-6">Score: {score}</p>
              <Button onClick={handleFinish} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MathGame;
