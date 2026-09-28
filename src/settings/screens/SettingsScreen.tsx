import styled from "@emotion/native";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CaretRightIcon,
  SignOutIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SUPPORTED_LANGUAGES,
  useAppTranslation,
  useLocalization,
} from "../../i18n";
import { IconButton } from "../../components/IconButton";
import { ScreenHeader } from "../../components/ScreenHeader";

const colors = {
  action: "#0066FF",
  heading: "#1E1E2D",
  muted: "#A2A2A7",
  separator: "#F0F0F2",
  white: "#FFFFFF",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const FirstSection = styled.View({
  marginTop: 30,
});

const Section = styled.View({
  marginTop: 31,
});

const SectionTitle = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  lineHeight: 16,
  marginBottom: 31,
});

const Row = styled(Pressable)({
  alignItems: "center",
  borderBottomColor: colors.separator,
  borderBottomWidth: 1,
  flexDirection: "row",
  height: 34,
  marginBottom: 22,
  width: "100%",
});

const LastRow = styled(Row)({
  marginBottom: 0,
});

const DescriptionRow = styled(Row)({
  marginBottom: 15,
});

const BiometricRow = styled(Row)({
  borderBottomWidth: 0,
  height: 38,
  marginBottom: 0,
});

const RowCopy = styled.View({
  flex: 1,
});

const RowLabel = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 14,
  lineHeight: 16,
});

const RowValue = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  lineHeight: 16,
  marginLeft: "auto",
  marginRight: 16,
});

const RowEnd = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
  minHeight: 24,
  minWidth: 24,
});

const ToggleTrack = styled.View<{ isOn: boolean }>(({ isOn }) => ({
  alignItems: isOn ? "flex-end" : "flex-start",
  backgroundColor: isOn ? colors.action : "#D9DDE4",
  borderRadius: 10,
  height: 20,
  justifyContent: "center",
  paddingHorizontal: 3,
  width: 35,
}));

const ToggleThumb = styled.View({
  backgroundColor: colors.white,
  borderColor: "#A2A2A7",
  borderWidth: 1,
  borderRadius: 8,
  height: 16,
  width: 16,
});

const SecurityDescription = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 14,
  marginBottom: 31,
});

export function SettingsScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("settings");
  const { locale } = useLocalization();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const activeLanguage =
    SUPPORTED_LANGUAGES.find((language) => language.locale === locale)
      ?.nativeName ?? "English";

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("goBack")}
            backgroundColor="#F4F4F4"
            icon={<ArrowLeftIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => router.back()}
          />
        }
        rightAction={
          <IconButton
            accessibilityLabel={t("logOut")}
            backgroundColor="#F4F4F4"
            icon={<SignOutIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => undefined}
          />
        }
        title={t("title")}
      />

      <Content>
        <FirstSection>
          <SectionTitle>{t("general")}</SectionTitle>
          <Row
            accessibilityLabel={t("language")}
            onPress={() => router.push("/settings/language")}
          >
            <RowCopy>
              <RowLabel>{t("language")}</RowLabel>
            </RowCopy>
            <RowValue>{activeLanguage}</RowValue>
            <RowEnd>
              <CaretRightIcon color={colors.muted} size={18} weight="regular" />
            </RowEnd>
          </Row>
          <Row
            accessibilityLabel={t("myProfile")}
            onPress={() => router.push("/profile")}
          >
            <RowCopy>
              <RowLabel>{t("myProfile")}</RowLabel>
            </RowCopy>
            <RowEnd>
              <CaretRightIcon color={colors.muted} size={18} weight="regular" />
            </RowEnd>
          </Row>
          <LastRow
            accessibilityLabel={t("contactUs")}
            onPress={() => undefined}
          >
            <RowCopy>
              <RowLabel>{t("contactUs")}</RowLabel>
            </RowCopy>
            <RowEnd>
              <CaretRightIcon color={colors.muted} size={18} weight="regular" />
            </RowEnd>
          </LastRow>
        </FirstSection>

        <Section>
          <SectionTitle>{t("security")}</SectionTitle>
          <Row
            accessibilityLabel={t("changePassword")}
            onPress={() => router.push("/change-password")}
          >
            <RowCopy>
              <RowLabel>{t("changePassword")}</RowLabel>
            </RowCopy>
            <RowEnd>
              <CaretRightIcon color={colors.muted} size={18} weight="regular" />
            </RowEnd>
          </Row>
          <DescriptionRow
            accessibilityLabel={t("privacyPolicy")}
            onPress={() => undefined}
          >
            <RowCopy>
              <RowLabel>{t("privacyPolicy")}</RowLabel>
            </RowCopy>
            <RowEnd>
              <CaretRightIcon color={colors.muted} size={18} weight="regular" />
            </RowEnd>
          </DescriptionRow>
          <SecurityDescription>{t("securityDescription")}</SecurityDescription>
          <BiometricRow
            accessibilityLabel={t("biometric")}
            accessibilityRole="switch"
            accessibilityState={{ checked: biometricEnabled }}
            onPress={() => setBiometricEnabled((enabled) => !enabled)}
          >
            <RowCopy>
              <RowLabel>{t("biometric")}</RowLabel>
            </RowCopy>
            <RowEnd>
              <ToggleTrack isOn={biometricEnabled}>
                <ToggleThumb />
              </ToggleTrack>
            </RowEnd>
          </BiometricRow>
        </Section>
      </Content>
    </Screen>
  );
}
