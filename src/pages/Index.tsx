import { useGameState } from "@/hooks/useGameState";
import Onboarding from "./Onboarding";
import Home from "./Home";

const Index = () => {
  const { hasCompletedOnboarding, completeOnboarding } = useGameState();

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return <Home />;
};

export default Index;
