import { useRouter } from "expo-router";
import styled from "@emotion/native";
import {
  ArrowLeftIcon,
  EnvelopeSimpleIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { useAppTranslation } from "../../i18n";
import { useAuthStore } from "../client";

import {
  AuthContent,
  AuthScreen,
  AuthScroll,
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

const ErrorCopy = styled.Text({
  color: "#C62828",
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  marginTop: 12,
  textAlign: "center",
});

export function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticationError, setAuthenticationError] = useState(false);
  const { t } = useAppTranslation("login");

  const handleSubmit = async () => {
    setAuthenticationError(false);
    try {
      await login({ username: email, password });
      router.replace("/(closed)/onboarding/1");
    } catch {
      setAuthenticationError(true);
    }
  };

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
                icon={
                  <EnvelopeSimpleIcon
                    color="#A2A2A7"
                    size={20}
                    weight="regular"
                  />
                }
                inputProps={{
                  autoCapitalize: "none",
                  autoComplete: "email",
                  keyboardType: "email-address",
                  onChangeText: setEmail,
                  value: email,
                }}
                label={t("emailAddress")}
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
            accessibilityLabel={t("signIn")}
            onPress={() => void handleSubmit()}
          >
            {t("signIn")}
          </SubmitButton>
          {authenticationError ? (
            <ErrorCopy>{t("authenticationFailed")}</ErrorCopy>
          ) : null}

          <FooterCopy>
            {t("newUser")} <FooterLink>{t("footerSignIn")}</FooterLink>
          </FooterCopy>
        </AuthContent>
      </AuthScroll>
    </AuthScreen>
  );
}
