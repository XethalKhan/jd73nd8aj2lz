import styled from "@emotion/native";
import { useRouter } from "expo-router";
import {
  AppleLogoIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CurrencyDollarSimpleIcon,
  MagnifyingGlassIcon,
  ShoppingCartSimpleIcon,
  SpotifyLogoIcon,
  UploadSimpleIcon,
  UserIcon,
} from "phosphor-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "../../components/Card";
import { IconButton } from "../../components/IconButton";
import { useAppTranslation } from "../../i18n";

const colors = {
  action: "#0066FF",
  danger: "#E16364",
  heading: "#1E1E2D",
  muted: "#7E848D",
  surface: "#F4F4F4",
  success: "#1FAA47",
  white: "#FFFFFF",
};

const cardFixture = {
  cardNumber: "4562 1122 4595 7852",
  cardholderName: "AR Jonson",
  cvv: "6986",
  expiryDate: "24/2000",
} as const;

const actions = [
  { Icon: ArrowUpIcon, key: "send" },
  { Icon: ArrowDownIcon, key: "receive" },
  { Icon: UploadSimpleIcon, key: "topup" },
  { Icon: CurrencyDollarSimpleIcon, key: "loan" },
] as const;

const transactions = [
  {
    categoryKey: "entertainment",
    Icon: AppleLogoIcon,
    iconColor: colors.heading,
    labelKey: "appleStore",
    value: "- $5,99",
  },
  {
    categoryKey: "music",
    Icon: SpotifyLogoIcon,
    iconColor: colors.success,
    labelKey: "spotify",
    value: "- $12,99",
  },
  {
    categoryKey: "transactionCategory",
    Icon: ArrowDownIcon,
    iconColor: colors.heading,
    labelKey: "moneyTransfer",
    value: "$300",
  },
  {
    categoryKey: "shopping",
    Icon: ShoppingCartSimpleIcon,
    iconColor: colors.danger,
    labelKey: "grocery",
    value: "- $ 88",
  },
] as const;

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});

const Header = styled.View({
  alignItems: "center",
  flexDirection: "row",
  height: 50,
  justifyContent: "space-between",
  marginTop: 10,
  paddingHorizontal: 20,
});

const WelcomeCopy = styled.View({
  flex: 1,
  marginLeft: 16,
});

const WelcomeLabel = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 18,
});

const UserName = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 17,
  lineHeight: 23,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const ContentBody = styled.View({
  paddingBottom: 20,
});

const CardSlot = styled.View({
  marginTop: 32,
  width: "100%",
});

const ActionRow = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 30,
});

const Action = styled.View({
  alignItems: "center",
  width: "23%",
});

const ActionLabel = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 18,
  marginTop: 7,
  textAlign: "center",
});

const TransactionSection = styled.View({
  marginTop: 24,
  paddingBottom: 112,
});

const SectionTitle = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-SemiBold",
  fontSize: 18,
  lineHeight: 24,
});

const TransactionRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  marginTop: 21,
  minHeight: 42,
});

const TransactionIcon = styled.View({
  alignItems: "center",
  backgroundColor: colors.surface,
  borderRadius: 21,
  height: 42,
  justifyContent: "center",
  width: 42,
});

const TransactionCopy = styled.View({
  flex: 1,
  marginLeft: 18,
});

const TransactionLabel = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 16,
  lineHeight: 20,
});

const TransactionCategory = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 1,
});

const TransactionValue = styled.Text<{ positive?: boolean }>(
  ({ positive = false }) => ({
    color: positive ? colors.action : colors.heading,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    lineHeight: 20,
  }),
);

export function HomeScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("home");

  return (
    <Screen>
      <Header>
        <IconButton
          accessibilityLabel={t("profile")}
          backgroundColor="#D8D8DA"
          icon={<UserIcon color={colors.heading} size={24} weight="fill" />}
          onPress={() => undefined}
          size={50}
        >
        </IconButton>

        <WelcomeCopy>
          <WelcomeLabel>{t("welcomeBack")}</WelcomeLabel>
          <UserName>Tanya Myroniuk</UserName>
        </WelcomeCopy>

        <IconButton
          accessibilityLabel={t("search")}
          backgroundColor={colors.surface}
          icon={<MagnifyingGlassIcon color={colors.heading} size={18} weight="regular" />}
          onPress={() => undefined}
          size={42}
        >
        </IconButton>
      </Header>

      <Content>
        <ContentBody>
          <CardSlot>
            <Card
              {...cardFixture}
              brand="mastercard"
              accessibilityLabel={t("paymentCard")}
              contactlessAccessibilityLabel={t("contactlessPayment")}
              showContactless
              testID="home-payment-card"
            />
          </CardSlot>

          <ActionRow>
            {actions.map(({ Icon, key }) => (
              <Action key={key}>
                <IconButton
                  accessibilityLabel={t(key)}
                  backgroundColor={colors.surface}
                  icon={<Icon color={colors.heading} size={22} weight="regular" />}
                  onPress={() => {
                    if (key === "send") {
                      router.push("/send-money");
                    }
                  }}
                  size={54}
                />
                <ActionLabel>{t(key)}</ActionLabel>
              </Action>
            ))}
          </ActionRow>

          <TransactionSection>
            <SectionTitle>{t("transaction")}</SectionTitle>
            {transactions.map(({ categoryKey, Icon, iconColor, labelKey, value }) => (
              <TransactionRow key={labelKey}>
                <TransactionIcon>
                  <Icon color={iconColor} size={19} weight="regular" />
                </TransactionIcon>
                <TransactionCopy>
                  <TransactionLabel>{t(labelKey)}</TransactionLabel>
                  <TransactionCategory>{t(categoryKey)}</TransactionCategory>
                </TransactionCopy>
                <TransactionValue positive={value === "$300"}>
                  {value}
                </TransactionValue>
              </TransactionRow>
            ))}
          </TransactionSection>
        </ContentBody>
      </Content>
    </Screen>
  );
}
