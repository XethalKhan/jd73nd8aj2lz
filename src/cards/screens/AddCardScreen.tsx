import styled from "@emotion/native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { useState } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { IconButton } from "../../components/IconButton";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTranslation } from "../../i18n";

const colors = {
  heading: "#1E1E2D",
  muted: "#A2A2A7",
  separator: "#F4F4F4",
  surface: "#F4F4F4",
  white: "#FFFFFF",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
  paddingTop: Platform.OS === "web" ? 44 : 0,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const ContentBody = styled.View({
  paddingBottom: 32,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const CardSlot = styled.View({
  marginTop: 32,
  width: "100%",
});

const Fields = styled.View({
  marginTop: 32,
});

const Field = styled.View({
  height: 84,
  position: "relative",
});

const FieldLabel = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  lineHeight: 18,
});

const FieldInput = styled(Input)({
  marginTop: 13,
  width: "100%",
});

const FieldSeparator = styled.View({
  backgroundColor: colors.separator,
  bottom: 16,
  height: 1,
  left: 0,
  position: "absolute",
  right: 0,
});

const DetailsRow = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
});

const DetailField = styled.View({
  flex: 1,
  position: "relative",
});

const DetailFieldTrailing = styled(DetailField)({
  marginLeft: 32,
});

const DetailInput = styled(Input)({
  marginTop: 13,
});

const DetailSeparator = styled.View({
  backgroundColor: colors.separator,
  bottom: 16,
  height: 1,
  left: 0,
  position: "absolute",
  right: 0,
});

const cardFixture = {
  cardNumber: "4562 1122 4595 7852",
  cardholderName: "AR Jonson",
  cvv: "6986",
  expiryDate: "24/2000",
  brand: "mastercard" as const,
  showContactless: true,
};

export function AddCardScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("add-card");
  const [cardholderName, setCardholderName] = useState(
    cardFixture.cardholderName,
  );
  const [cardNumber, setCardNumber] = useState(cardFixture.cardNumber);
  const [expiryDate, setExpiryDate] = useState(cardFixture.expiryDate);
  const [cvv, setCvv] = useState(cardFixture.cvv);

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("goBack")}
            backgroundColor={colors.surface}
            icon={<ArrowLeftIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => router.back()}
            testID="add-card-back"
          />
        }
        title={t("title")}
      />

      <Content keyboardShouldPersistTaps="handled">
        <ContentBody>
          <CardSlot>
          <Card
            {...cardFixture}
            cardholderName={cardholderName}
            cardNumber={cardNumber}
            cvv={cvv}
            expiryDate={expiryDate}
            accessibilityLabel={t("paymentCard")}
            contactlessAccessibilityLabel={t("contactlessPayment")}
            testID="add-card-payment-card"
          />
          </CardSlot>

        <Fields>
          <Field testID="add-card-field-cardholder-name">
            <FieldLabel>{t("cardholderName")}</FieldLabel>
            <FieldInput
              accessibilityLabel={t("cardholderName")}
              autoCapitalize="words"
              density="compact"
              variant="plain"
              onChangeText={setCardholderName}
              value={cardholderName}
            />
            <FieldSeparator />
          </Field>

          <Field testID="add-card-field-card-number">
            <FieldLabel>{t("cardNumber")}</FieldLabel>
            <FieldInput
              accessibilityLabel={t("cardNumber")}
              density="compact"
              keyboardType="number-pad"
              variant="plain"
              onChangeText={setCardNumber}
              value={cardNumber}
            />
            <FieldSeparator />
          </Field>

          <DetailsRow testID="add-card-field-details">
            <DetailField testID="add-card-field-expiry-date">
              <FieldLabel>{t("expiryDate")}</FieldLabel>
              <DetailInput
                accessibilityLabel={t("expiryDate")}
                density="compact"
                keyboardType="number-pad"
                variant="plain"
                onChangeText={setExpiryDate}
                value={expiryDate}
              />
              <DetailSeparator />
            </DetailField>

            <DetailFieldTrailing testID="add-card-field-cvv">
              <FieldLabel>{t("cvv")}</FieldLabel>
              <DetailInput
                accessibilityLabel={t("cvv")}
                density="compact"
                keyboardType="number-pad"
                variant="plain"
                onChangeText={setCvv}
                value={cvv}
              />
              <DetailSeparator />
            </DetailFieldTrailing>
          </DetailsRow>
          </Fields>
        </ContentBody>
      </Content>
    </Screen>
  );
}
