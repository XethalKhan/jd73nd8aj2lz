import { useRouter } from "expo-router";

import illustration from "../../../assets/images/onboarding1.svg";
import { OnboardingScreen } from "./OnboardingScreen";

export function Onboarding1Screen() {
  const router = useRouter();

  return (
    <OnboardingScreen
      activeIndex={0}
      illustration={illustration}
      onNext={() => router.push("/(closed)/onboarding/2")}
      translationNamespace="onboarding-1"
    />
  );
}
