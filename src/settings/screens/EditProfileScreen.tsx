import styled from "@emotion/native";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  UserCircleIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTranslation } from "../../i18n";
import { IconButton } from "../../components/IconButton";
import { LabeledField } from "../../components/LabeledField";
import { ScreenHeader } from "../../components/ScreenHeader";

const colors = {
  heading: "#1E1E2D",
  icon: "#A2A2A7",
  muted: "#7E848D",
  separator: "#F4F4F4",
  white: "#FFFFFF",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const SaveButton = styled(Pressable)({
  alignItems: "center",
  height: 42,
  justifyContent: "center",
  width: 42,
});

const SaveLabel = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Medium",
  fontSize: 13,
  lineHeight: 18,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const AccountSummary = styled.View({
  alignItems: "center",
  marginTop: 32,
});

const Avatar = styled(Pressable)({
  alignItems: "center",
  backgroundColor: colors.heading,
  borderRadius: 45,
  height: 90,
  justifyContent: "center",
  width: 90,
});

const AccountName = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 16,
  lineHeight: 20,
  marginTop: 20,
});

const AccountRole = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 4,
});

const Fields = styled.View({
  marginTop: 30,
});

const Field = styled.View({
  height: 84,
  position: "relative",
});

const BirthDateLabel = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  lineHeight: 18,
});

const BirthDateField = styled(Field)({
  height: 84,
});

const BirthDateGrid = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 17,
});

const BirthDateInput = styled(TextInput)({
  borderBottomColor: colors.separator,
  borderBottomWidth: 1,
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  height: 26,
  includeFontPadding: false,
  lineHeight: 18,
  padding: 0,
  textAlign: "center",
  width: 83,
});

const JoinedCopy = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 91,
  textAlign: "center",
});

export function EditProfileScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("edit-profile");
  const [name, setName] = useState("Tanya Myroniuk");
  const [email, setEmail] = useState("tanya.myroniuk@gmail.com");
  const [phone, setPhone] = useState("+8801712663389");
  const [birthDay, setBirthDay] = useState("28");
  const [birthMonth, setBirthMonth] = useState("September");
  const [birthYear, setBirthYear] = useState("2000");

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
          <SaveButton
            accessibilityLabel={t("saveProfile")}
            accessibilityState={{ disabled: true }}
            disabled
          >
            <SaveLabel>{t("save")}</SaveLabel>
          </SaveButton>
        }
        title={t("title")}
      />

      <Content keyboardShouldPersistTaps="handled">
        <AccountSummary>
          <Avatar
            accessibilityHint={t("photoUnavailable")}
            accessibilityLabel={t("changePhoto")}
            accessibilityRole="button"
            onPress={() => undefined}
          />
          <AccountName>{name}</AccountName>
          <AccountRole>{t("role")}</AccountRole>
        </AccountSummary>

        <Fields>
          <Field>
            <LabeledField
              icon={<UserCircleIcon color={colors.icon} size={20} weight="regular" />}
              inputProps={{
                onChangeText: setName,
                value: name,
              }}
              label={t("fullName")}
              labelStyle={{ color: colors.heading }}
            />
          </Field>

          <Field>
            <LabeledField
              icon={
                <EnvelopeSimpleIcon
                  color={colors.icon}
                  size={20}
                  weight="regular"
                />
              }
              inputProps={{
                keyboardType: "email-address",
                onChangeText: setEmail,
                value: email,
              }}
              label={t("emailAddress")}
              labelStyle={{ color: colors.heading }}
            />
          </Field>

          <Field>
            <LabeledField
              icon={<PhoneIcon color={colors.icon} size={20} weight="regular" />}
              inputProps={{
                keyboardType: "phone-pad",
                onChangeText: setPhone,
                value: phone,
              }}
              label={t("phoneNumber")}
              labelStyle={{ color: colors.heading }}
            />
          </Field>

          <BirthDateField>
            <BirthDateLabel>{t("birthDate")}</BirthDateLabel>
            <BirthDateGrid>
              <BirthDateInput
                accessibilityLabel={t("birthDay")}
                keyboardType="number-pad"
                onChangeText={setBirthDay}
                value={birthDay}
              />
              <BirthDateInput
                accessibilityLabel={t("birthMonth")}
                onChangeText={setBirthMonth}
                value={birthMonth}
              />
              <BirthDateInput
                accessibilityLabel={t("birthYear")}
                keyboardType="number-pad"
                onChangeText={setBirthYear}
                value={birthYear}
              />
            </BirthDateGrid>
          </BirthDateField>

          <JoinedCopy>{t("joined")}</JoinedCopy>
        </Fields>
      </Content>
    </Screen>
  );
}
