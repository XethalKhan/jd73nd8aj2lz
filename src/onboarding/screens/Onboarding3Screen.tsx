import { useRouter } from "expo-router";

import illustration from "../../../assets/images/onboarding3.svg";
import { OnboardingScreen } from "./OnboardingScreen";

export function Onboarding3Screen() {
  const router = useRouter();

  return (
    <OnboardingScreen
      activeIndex={2}
      illustration={illustration}
      onNext={() => router.replace("/(closed)/(tabs)/home")}
      translationNamespace="onboarding-3"
    />
  );
}
