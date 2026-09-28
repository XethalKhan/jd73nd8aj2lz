import styled from "@emotion/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "../../../assets/images/close-brothers-logo.svg";
import { Button } from "../../components/Button";
import { useAppTranslation } from "../../i18n";

const Screen = styled(SafeAreaView)({
  flex: 1,
  backgroundColor: "#FFFFFF",
});

const Content = styled.View({
  flex: 1,
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  paddingBottom: 20,
  paddingTop: 12,
});

const Intro = styled.View({
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  width: "100%",
});

const Logo = styled(Image)({
  height: 140,
  marginBottom: 20,
  width: "100%",
});

const Title = styled.Text({
  color: "#1E1E2D",
  fontSize: 30,
  fontWeight: "700",
  lineHeight: 38,
  marginTop: 12,
  textAlign: "center",
});

const Description = styled.Text({
  color: "#7E848D",
  fontSize: 15,
  lineHeight: 23,
  marginTop: 12,
  maxWidth: 320,
  textAlign: "center",
});

const Actions = styled.View({
  gap: 12,
  width: "100%",
});

export function WelcomeScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("welcome");

  return (
    <Screen>
      <Content>
        <Intro>
          <Logo
            accessibilityLabel={t("logo")}
            contentFit="contain"
            source={logo}
          />
          <Title>{t("title")}</Title>
          <Description>{t("description")}</Description>
        </Intro>

        <Actions>
          <Button
            accessibilityLabel={t("signIn")}
            onPress={() => router.push("/(open)/login")}
            variant="outlined"
          >
            {t("signIn")}
          </Button>
          <Button
            accessibilityLabel={t("signUp")}
            onPress={() => router.push("/(open)/create-account")}
            variant="primary"
          >
            {t("signUp")}
          </Button>
        </Actions>
      </Content>
    </Screen>
  );
}
