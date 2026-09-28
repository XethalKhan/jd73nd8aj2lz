import { useRouter } from "expo-router";

import illustration from "../../../assets/images/onboarding2.svg";
import { OnboardingScreen } from "./OnboardingScreen";

export function Onboarding2Screen() {
  const router = useRouter();

  return (
    <OnboardingScreen
      activeIndex={1}
      illustration={illustration}
      onNext={() => router.push("/(closed)/onboarding/3")}
      translationNamespace="onboarding-2"
    />
  );
}
