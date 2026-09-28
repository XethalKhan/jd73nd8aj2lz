import { useRouter } from "expo-router";
import styled from "@emotion/native";
import {
  ArrowLeftIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { useAppTranslation } from "../../i18n";

import {
  AuthContent,
  AuthScroll,
  AuthScreen,
  AuthTitle,
  Field,
  Fields,
  FooterCopy,
  FooterLink,
} from "./AuthPrimitives";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { LabeledField } from "../../components/LabeledField";
import { PasswordInput } from "../../components/PasswordInput";

const SubmitButton = styled(Button)({
  marginTop: 19,
});

export function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useAppTranslation("create-account");

  return (
    <AuthScreen>
      <AuthScroll
        keyboardShouldPersistTaps="handled"
      >
        <AuthContent>
          <IconButton
            accessibilityLabel={t("goBack")}
            backgroundColor="transparent"
            icon={<ArrowLeftIcon color="#1E1E2D" size={20} weight="regular" />}
            onPress={() => router.back()}
            size={40}
          >
          </IconButton>

          <AuthTitle>{t("title")}</AuthTitle>

          <Fields>
            <Field>
              <LabeledField
                label={t("fullName")}
                onChangeText={setFullName}
                value={fullName}
              />
            </Field>

            <Field>
              <LabeledField
                icon={<PhoneIcon color="#A2A2A7" size={20} weight="regular" />}
                keyboardType="phone-pad"
                label={t("phoneNumber")}
                onChangeText={setPhoneNumber}
                value={phoneNumber}
              />
            </Field>

            <Field>
              <LabeledField
                autoCapitalize="none"
                autoComplete="email"
                icon={
                  <EnvelopeSimpleIcon
                    color="#A2A2A7"
                    size={20}
                    weight="regular"
                  />
                }
                keyboardType="email-address"
                label={t("emailAddress")}
                onChangeText={setEmail}
                value={email}
              />
            </Field>

            <Field>
              <PasswordInput
                autoCapitalize="none"
                hideLabel={t("hidePassword")}
                label={t("password")}
                onChangeText={setPassword}
                showLabel={t("showPassword")}
                value={password}
              />
            </Field>
          </Fields>

          <SubmitButton
            accessibilityLabel={t("signUp")}
            onPress={() => undefined}
          >
            {t("signUp")}
          </SubmitButton>

          <FooterCopy>
            {t("existingUser")} <FooterLink>{t("footerSignUp")}</FooterLink>
          </FooterCopy>
        </AuthContent>
      </AuthScroll>
    </AuthScreen>
  );
}
