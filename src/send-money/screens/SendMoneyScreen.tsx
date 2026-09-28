import styled from "@emotion/native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, PlusIcon, UserCircleIcon, XIcon } from "phosphor-react-native";
import { useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, CardProps } from "../../components/Card";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { Input } from "../../components/Input";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTranslation } from "../../i18n";

const colors = {
  action: "#0066FF",
  border: "#E7EAEE",
  heading: "#1E1E2D",
  muted: "#7E848D",
  surface: "#F4F4F4",
  white: "#FFFFFF",
};

type SourceCard = Omit<CardProps, "testID"> & {
  id: "mastercard" | "visa";
};

const sourceCards: SourceCard[] = [
  {
    brand: "mastercard",
    cardholderName: "AR Jonson",
    cardNumber: "4562 1122 4595 7852",
    cvv: "6986",
    expiryDate: "24/2000",
    id: "mastercard",
    showContactless: true,
  },
  {
    brand: "visa",
    cardholderName: "Tanya Myroniuk",
    cardNumber: "4217 8910 1234 5678",
    cvv: "421",
    expiryDate: "08/2028",
    id: "visa",
    showContactless: true,
  },
];

const recipients = [
  { accountEnding: "4582", id: "alex", name: "Alex" },
  { accountEnding: "1096", id: "maria", name: "Maria" },
  { accountEnding: "7724", id: "john", name: "John" },
  { accountEnding: "6318", id: "sofia", name: "Sofia" },
] as const;

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
  paddingTop: Platform.OS === "web" ? 44 : 0,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const ContentBody = styled.View({
  paddingBottom: 20,
});

const Carousel = styled.ScrollView({
  marginTop: 32,
  width: "100%",
});

const CarouselPage = styled.View<{ pageWidth: number }>(({ pageWidth }) => ({
  alignItems: "center",
  width: pageWidth,
}));

const Pagination = styled.View({
  alignItems: "center",
  flexDirection: "row",
  gap: 6,
  justifyContent: "center",
  marginTop: 12,
});

const PaginationDot = styled.View<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? colors.action : colors.border,
  borderRadius: 3,
  height: 6,
  width: selected ? 18 : 6,
}));

const SectionCard = styled.View({
  borderColor: colors.border,
  borderRadius: 14,
  borderWidth: 1,
  padding: 16,
});

const RecipientCard = styled(SectionCard)({
  height: 128,
  marginTop: 19,
  paddingVertical: 16,
});

const SectionTitle = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-SemiBold",
  fontSize: 16,
  lineHeight: 22,
});

const RecipientRow = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 16,
});

const RecipientOption = styled(Pressable)({
  alignItems: "center",
  width: "20%",
});

const RecipientAvatar = styled.View({
  alignItems: "center",
  backgroundColor: colors.surface,
  borderRadius: 24,
  height: 48,
  justifyContent: "center",
  width: 48,
});

const RecipientName = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 10,
  lineHeight: 14,
  marginTop: 5,
});

const SelectedRecipientRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  marginTop: 16,
});

const SelectedRecipientAvatar = styled(RecipientAvatar)({
  height: 56,
  width: 56,
});

const SelectedRecipientCopy = styled.View({
  flex: 1,
  marginLeft: 16,
});

const SelectedRecipientName = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 15,
  lineHeight: 20,
});

const SelectedRecipientAccount = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 3,
});

const ClearRecipientButton = styled(Pressable)({
  alignItems: "center",
  height: 32,
  justifyContent: "center",
  width: 32,
});

const AmountCard = styled(SectionCard)({
  height: 116,
  marginTop: 30,
});

const AmountHeader = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
});

const AmountLabel = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 18,
});

const CurrencyButton = styled(Pressable)({
  padding: 2,
});

const CurrencyButtonLabel = styled.Text({
  color: "#FF3F60",
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 18,
});

const AmountRow = styled.View({
  alignItems: "center",
  flexDirection: "row",
  marginTop: 10,
});

const CurrencyCode = styled.Text({
  color: "#9BB2D4",
  fontFamily: "Poppins-SemiBold",
  fontSize: 24,
  lineHeight: 34,
});

const AmountInputContainer = styled.View({
  flex: 1,
  marginLeft: 16,
});
const AmountInput = styled(Input)({
  fontFamily: "Poppins-SemiBold",
  fontSize: 24,
  lineHeight: 34,
});
const SendButton = styled(Button)({
  marginBottom: 50,
  marginTop: 74,
});

function getPageIndex(
  event: NativeSyntheticEvent<NativeScrollEvent>,
  pageWidth: number,
) {
  const offset = event.nativeEvent.contentOffset.x;
  return Math.max(
    0,
    Math.min(sourceCards.length - 1, Math.round(offset / pageWidth)),
  );
}

function normalizeAmount(value: string) {
  if (value.trimStart().startsWith("-")) {
    return "0";
  }

  const decimalIndex = value.indexOf(".");
  const integerPart = (
    decimalIndex === -1 ? value : value.slice(0, decimalIndex)
  ).replace(/\D/g, "");
  const decimalPart =
    decimalIndex === -1
      ? ""
      : value
          .slice(decimalIndex + 1)
          .replace(/\D/g, "")
          .slice(0, 2);

  if (decimalIndex === -1) {
    return integerPart;
  }

  return `${integerPart || "0"}.${decimalPart}`;
}

export function SendMoneyScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("send-money");
  const { width } = useWindowDimensions();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [selectedRecipient, setSelectedRecipient] = useState<
    (typeof recipients)[number] | null
  >(null);
  const [amount, setAmount] = useState("36.00");
  const pageWidth = Math.max(width - 40, 1);

  const handlePageChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setSelectedCardIndex(getPageIndex(event, pageWidth));
  };

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("back")}
            backgroundColor={colors.surface}
            borderColor={colors.border}
            icon={<ArrowLeftIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => router.replace("/home")}
            testID="send-money-back"
          />
        }
        title={t("title")}
        testID="send-money-title"
      />

      <Content showsVerticalScrollIndicator={false}>
        <ContentBody>
          <Carousel
            accessibilityLabel={t("sourceCardCarousel")}
            horizontal
            onMomentumScrollEnd={handlePageChange}
            onScrollEndDrag={handlePageChange}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            testID="send-money-card-carousel"
          >
            {sourceCards.map((sourceCard, index) => (
              <CarouselPage
                accessibilityLabel={t("sourceCard", { name: sourceCard.id })}
                accessibilityRole="image"
                accessibilityState={{ selected: selectedCardIndex === index }}
                key={sourceCard.id}
                pageWidth={pageWidth}
                testID={`send-money-card-page-${sourceCard.id}`}
              >
                <Card
                  {...sourceCard}
                  accessibilityLabel={t("paymentCard")}
                  contactlessAccessibilityLabel={t("contactlessPayment")}
                  testID={`send-money-card-${sourceCard.id}`}
                />
              </CarouselPage>
            ))}
          </Carousel>

          <Pagination accessibilityLabel={t("selectedSourceCard")}>
            {sourceCards.map((sourceCard, index) => (
              <PaginationDot
                key={sourceCard.id}
                selected={selectedCardIndex === index}
                testID={`send-money-card-indicator-${sourceCard.id}`}
              />
            ))}
          </Pagination>

          <RecipientCard testID="send-money-recipient">
          <SectionTitle>{t("chooseRecipient")}</SectionTitle>
          {selectedRecipient ? (
            <SelectedRecipientRow testID="send-money-selected-recipient">
              <SelectedRecipientAvatar
                accessible
                accessibilityLabel={t("avatar", {
                  name: selectedRecipient.name,
                })}
                testID={`send-money-selected-avatar-${selectedRecipient.id}`}
              >
                <UserCircleIcon color={colors.muted} size={34} weight="regular" />
              </SelectedRecipientAvatar>
              <SelectedRecipientCopy>
                <SelectedRecipientName>
                  {selectedRecipient.name}
                </SelectedRecipientName>
                <SelectedRecipientAccount>
                  {t("accountEnding", {
                    digits: selectedRecipient.accountEnding,
                  })}
                </SelectedRecipientAccount>
              </SelectedRecipientCopy>
              <ClearRecipientButton
                accessibilityLabel={t("clearRecipient")}
                accessibilityRole="button"
                onPress={() => setSelectedRecipient(null)}
                testID="send-money-clear-recipient"
              >
                <XIcon color={colors.muted} size={18} weight="regular" />
              </ClearRecipientButton>
            </SelectedRecipientRow>
          ) : (
            <RecipientRow>
              <RecipientOption
                accessibilityLabel={t("addRecipient")}
                accessibilityRole="button"
                onPress={() => undefined}
                testID="send-money-add-recipient"
              >
                <RecipientAvatar>
                  <PlusIcon color={colors.action} size={22} weight="regular" />
                </RecipientAvatar>
                <RecipientName>{t("add")}</RecipientName>
              </RecipientOption>
              {recipients.map((recipient) => (
                <RecipientOption
                  accessibilityLabel={recipient.name}
                  accessibilityRole="button"
                  key={recipient.id}
                  onPress={() => setSelectedRecipient(recipient)}
                  testID={`send-money-recipient-${recipient.id}`}
                >
                  <RecipientAvatar>
                    <UserCircleIcon
                      color={colors.muted}
                      size={30}
                      weight="regular"
                    />
                  </RecipientAvatar>
                  <RecipientName>{recipient.name}</RecipientName>
                </RecipientOption>
              ))}
            </RecipientRow>
          )}
        </RecipientCard>

        <AmountCard testID="send-money-amount">
          <AmountHeader>
            <AmountLabel>{t("enterAmount")}</AmountLabel>
            <CurrencyButton
              accessibilityLabel={t("changeCurrency")}
              accessibilityRole="button"
              onPress={() => undefined}
              testID="send-money-change-currency"
            >
              <CurrencyButtonLabel>{t("changeCurrency")}</CurrencyButtonLabel>
            </CurrencyButton>
          </AmountHeader>
          <AmountRow>
            <CurrencyCode>USD</CurrencyCode>
            <AmountInputContainer>
              <AmountInput
                accessibilityLabel={t("amount")}
                keyboardType="decimal-pad"
                onChangeText={(value) => setAmount(normalizeAmount(value))}
                testID="send-money-amount-input"
                value={amount}
                variant="plain"
              />
            </AmountInputContainer>
          </AmountRow>
        </AmountCard>

        <SendButton
          accessibilityLabel={t("sendMoney")}
          onPress={() => undefined}
          testID="send-money-submit"
        >
          {t("sendMoney")}
        </SendButton>
        </ContentBody>
      </Content>
    </Screen>
  );
}
