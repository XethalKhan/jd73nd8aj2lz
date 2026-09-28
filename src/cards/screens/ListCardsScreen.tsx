import styled from "@emotion/native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, DotsThreeVerticalIcon, PlusIcon } from "phosphor-react-native";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTranslation } from "../../i18n";

const colors = {
  action: "#0066FF",
  heading: "#1E1E2D",
  surface: "#F4F4F4",
  white: "#FFFFFF",
};

const cardFixtures = [
  {
    cardNumber: "4562 1122 4595 7852",
    cardholderName: "AR Jonson",
    cvv: "6986",
    expiryDate: "24/2000",
    brand: "mastercard" as const,
    showContactless: true,
  },
  {
    cardNumber: "4242 4242 4242 4242",
    cardholderName: "Alex Morgan",
    cvv: "123",
    expiryDate: "12/29",
    brand: "visa" as const,
    showContactless: true,
  },
] as const;

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
  paddingTop: Platform.OS === "web" ? 44 : 0,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const CardSlot = styled.View({
  height: 199,
  width: "100%",
});

const FirstCardSlot = styled(CardSlot)({
  marginTop: 32,
});

const CardStackGap = styled.View({
  height: 24,
});

const AddCardAction = styled(Button)({
  marginTop: 146,
  width: "100%",
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

export function ListCardsScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("list-cards");

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("goBack")}
            backgroundColor={colors.surface}
            icon={<ArrowLeftIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => router.back()}
            testID="list-cards-back"
          />
        }
        rightAction={
          <IconButton
            accessibilityLabel={t("moreOptions")}
            icon={<DotsThreeVerticalIcon color={colors.action} size={22} weight="bold" />}
            onPress={() => undefined}
            testID="list-cards-more"
          />
        }
        title={t("title")}
      />

      <Content>
        <FirstCardSlot>
          <Card
            {...cardFixtures[0]}
            accessibilityLabel={t("paymentCard")}
            contactlessAccessibilityLabel={t("contactlessPayment")}
            testID="list-cards-payment-card"
          />
        </FirstCardSlot>

        <CardStackGap />

        <CardSlot>
          <Card
            {...cardFixtures[1]}
            accessibilityLabel={t("paymentCard")}
            contactlessAccessibilityLabel={t("contactlessPayment")}
            testID="list-cards-payment-card"
          />
        </CardSlot>

        <AddCardAction
          accessibilityLabel={t("addNewCard")}
          icon={<PlusIcon color={colors.white} size={18} weight="regular" />}
          testID="list-cards-add"
          onPress={() => router.push("/add-card")}
        >
          {t("addNewCardTitle")}
        </AddCardAction>
      </Content>
    </Screen>
  );
}
