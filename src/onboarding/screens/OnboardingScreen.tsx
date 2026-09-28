import styled from "@emotion/native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { useAppTranslation } from "../../i18n";

const colors = {
  action: "#0066FF",
  heading: "#1E1E2D",
  muted: "#7E848D",
  inactiveIndicator: "#D9DDE4",
  white: "#FFFFFF",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});

const Content = styled.View({
  alignItems: "center",
  flex: 1,
  paddingHorizontal: 20,
});

const IllustrationFrame = styled.View({
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  maxHeight: 390,
  minHeight: 250,
  width: "100%",
});

const Illustration = styled(Image)({
  height: "100%",
  maxWidth: 335,
  width: "100%",
});

const Copy = styled.View({
  alignItems: "center",
  width: "100%",
});

const Heading = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-SemiBold",
  fontSize: 24,
  lineHeight: 32,
  maxWidth: 335,
  textAlign: "center",
});

const SupportingText = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  lineHeight: 22,
  marginTop: 12,
  maxWidth: 335,
  textAlign: "center",
});

const Pagination = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 8,
  marginTop: 24,
});

const Indicator = styled.View<{ active: boolean }>(({ active }) => ({
  backgroundColor: active ? colors.action : colors.inactiveIndicator,
  borderRadius: 4,
  height: 8,
  width: active ? 24 : 8,
}));

const NextButton = styled(Button)({
  marginBottom: 20,
  marginTop: 24,
  width: "100%",
});

type OnboardingScreenProps = {
  activeIndex: number;
  illustration: number;
  onNext: () => void;
  translationNamespace: "onboarding-1" | "onboarding-2" | "onboarding-3";
};

export function OnboardingScreen({
  activeIndex,
  illustration,
  onNext,
  translationNamespace,
}: Readonly<OnboardingScreenProps>) {
  const { t } = useAppTranslation(translationNamespace);
  return (
    <Screen>
      <Content>
        <IllustrationFrame>
          <Illustration
            accessibilityLabel={t("illustration")}
            contentFit="contain"
            source={illustration}
          />
        </IllustrationFrame>

        <Copy>
          <Heading>{t("title")}</Heading>
          <SupportingText>{t("supportingText")}</SupportingText>
        </Copy>

        <Pagination
          accessibilityLabel={t("pagination", { step: activeIndex + 1 })}
        >
          {[0, 1, 2].map((index) => (
            <Indicator
              active={index === activeIndex}
              key={index}
              accessibilityLabel={t(
                index === activeIndex ? "currentStep" : "step",
                { step: index + 1 },
              )}
            />
          ))}
        </Pagination>

        <NextButton
          accessibilityLabel={t("next")}
          onPress={onNext}
        >
          {t("next")}
        </NextButton>
      </Content>
    </Screen>
  );
}
