import styled from "@emotion/native";
import { useRouter } from "expo-router";
import {
  AppleLogoIcon,
  ArrowLeftIcon,
  PlusIcon,
  ShoppingCartSimpleIcon,
  SpotifyLogoIcon,
} from "phosphor-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "../../components/Card";
import { IconButton } from "../../components/IconButton";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTranslation } from "../../i18n";

const colors = {
  action: "#0066FF",
  heading: "#1E1E2D",
  muted: "#A2A2A7",
  surface: "#F4F4F4",
  white: "#FFFFFF",
};

const cardFixture = {
  cardNumber: "4562 1122 4595 7852",
  cardholderName: "AR Jonson",
  cvv: "6986",
  expiryDate: "24/2000",
} as const;

const summaryFixture = [
  {
    categoryKey: "entertainment",
    icon: AppleLogoIcon,
    iconColor: colors.heading,
    labelKey: "appleStore",
    value: "- $5,99",
  },
  {
    categoryKey: "music",
    icon: SpotifyLogoIcon,
    iconColor: "#1FAA47",
    labelKey: "spotify",
    value: "- $12,99",
  },
  {
    categoryKey: "shopping",
    icon: ShoppingCartSimpleIcon,
    iconColor: "#E16364",
    labelKey: "grocery",
    value: "- $ 88",
  },
] as const;

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
  position: "relative",
});

const CardSlot = styled.View({
  height: 199,
  marginTop: 32,
  width: "100%",
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const Summary = styled.View({
  marginTop: 30,
});

const SummaryRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  height: 42,
  marginBottom: 22,
});

const SummaryIcon = styled.View({
  alignItems: "center",
  backgroundColor: colors.surface,
  borderRadius: 21,
  height: 42,
  justifyContent: "center",
  width: 42,
});

const SummaryCopy = styled.View({
  flex: 1,
  marginLeft: 16,
});

const SummaryLabel = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 16,
  lineHeight: 20,
});

const SummaryCategory = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 1,
});

const SummaryValue = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 18,
  marginLeft: 8,
});

const LimitSection = styled.View({
  marginTop: 4,
});

const LimitTitle = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 18,
  lineHeight: 24,
});

const LimitPanel = styled.View({
  backgroundColor: colors.surface,
  borderRadius: 18,
  height: 113,
  marginTop: 17,
  paddingHorizontal: 24,
  paddingTop: 20,
  width: "100%",
});

const LimitAmount = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 18,
});

const Track = styled.View({
  backgroundColor: colors.white,
  borderRadius: 4,
  height: 7,
  marginTop: 12,
  overflow: "visible",
  position: "relative",
  width: "100%",
});

const TrackFill = styled.View({
  backgroundColor: colors.action,
  borderRadius: 4,
  height: 7,
  left: 0,
  position: "absolute",
  top: 0,
  width: "35%",
});

const TrackThumb = styled.View({
  alignItems: "center",
  backgroundColor: colors.white,
  borderColor: colors.action,
  borderRadius: 8,
  borderWidth: 3,
  height: 16,
  justifyContent: "center",
  left: "35%",
  marginLeft: -8,
  marginTop: -4.5,
  position: "absolute",
  top: 0,
  width: 16,
});

const LimitScale = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
});

const LimitScaleLabel = styled.Text<{ emphasized?: boolean }>(
  ({ emphasized = false }) => ({
    color: emphasized ? colors.heading : colors.muted,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 16,
  }),
);

export function MyCardsScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("my-cards");

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("back")}
            backgroundColor={colors.surface}
            icon={<ArrowLeftIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => undefined}
            testID="my-cards-back"
          />
        }
        rightAction={
          <IconButton
            accessibilityLabel={t("addCard")}
            backgroundColor={colors.surface}
            icon={<PlusIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => router.push("/add-card")}
            testID="my-cards-add"
          />
        }
        title={t("title")}
      />

      <Content>
        <CardSlot>
          <Card
            {...cardFixture}
            brand="mastercard"
            accessibilityLabel={t("paymentCard")}
            contactlessAccessibilityLabel={t("contactlessPayment")}
            showContactless
            testID="my-cards-payment-card"
          />
        </CardSlot>

        <Summary>
          {summaryFixture.map(
            ({ categoryKey, icon: Icon, iconColor, labelKey, value }) => (
              <SummaryRow
                key={labelKey}
                testID={`summary-${labelKey}`}
              >
                <SummaryIcon>
                  <Icon color={iconColor} size={18} weight="fill" />
                </SummaryIcon>
                <SummaryCopy>
                  <SummaryLabel>{t(labelKey)}</SummaryLabel>
                  <SummaryCategory>{t(categoryKey)}</SummaryCategory>
                </SummaryCopy>
                <SummaryValue>{value}</SummaryValue>
              </SummaryRow>
            ),
          )}
        </Summary>

        <LimitSection>
          <LimitTitle>{t("monthlySpendingLimit")}</LimitTitle>
          <LimitPanel testID="monthly-spending-limit">
            <LimitAmount>{t("amount")}</LimitAmount>
            <Track testID="spending-limit-track">
              <TrackFill />
              <TrackThumb testID="spending-limit-thumb" />
            </Track>
            <LimitScale>
              <LimitScaleLabel>{t("minimumLimit")}</LimitScaleLabel>
              <LimitScaleLabel emphasized>{t("currentLimit")}</LimitScaleLabel>
              <LimitScaleLabel>{t("maximumLimit")}</LimitScaleLabel>
            </LimitScale>
          </LimitPanel>
        </LimitSection>
      </Content>
    </Screen>
  );
}
