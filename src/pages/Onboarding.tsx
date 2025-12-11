import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Flame, Trophy, ArrowRight } from "lucide-react";
import Mascot from "@/components/Mascot";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Welcome to MindMori!",
    description: "I'm Mori, your friendly brain training companion! Together, we'll make your mind sharper and stronger.",
    mascotEmotion: "excited" as const,
    icon: null,
  },
  {
    title: "Daily Mind Missions",
    description: "Complete fun mini-games every day to train your memory, focus, and cognitive skills. Each mission takes just a few minutes!",
    mascotEmotion: "happy" as const,
    icon: Brain,
  },
  {
    title: "Build Your Streak",
    description: "Train daily to build your streak! The longer your streak, the more powerful your mind becomes. Don't break the chain!",
    mascotEmotion: "excited" as const,
    icon: Flame,
  },
  {
    title: "Level Up & Earn XP",
    description: "Earn XP for every mission you complete. Level up to unlock new challenges and show off your progress!",
    mascotEmotion: "celebrating" as const,
    icon: Trophy,
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
      navigate("/");
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep ? "bg-primary" : index < currentStep ? "bg-primary/50" : "bg-muted"
            }`}
            animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center max-w-sm"
        >
          {/* Icon or Mascot */}
          <div className="mb-6">
            {currentStepData.icon ? (
              <motion.div
                className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <currentStepData.icon className="w-10 h-10 text-primary" />
              </motion.div>
            ) : (
              <Mascot emotion={currentStepData.mascotEmotion} size="lg" />
            )}
          </div>

          {/* Content */}
          <motion.h1
            className="text-2xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {currentStepData.title}
          </motion.h1>

          <motion.p
            className="text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentStepData.description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-bold group"
        >
          {currentStep === steps.length - 1 ? "Let's Go!" : "Continue"}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Skip */}
      {currentStep < steps.length - 1 && (
        <button
          onClick={() => {
            onComplete();
            navigate("/");
          }}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip tutorial
        </button>
      )}
    </div>
  );
};

export default Onboarding;
