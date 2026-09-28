import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { useState } from "react";
import { useAppTranslation } from "../../i18n";

import {
  AuthScreen,
  AuthScroll,
} from "./AuthPrimitives";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { PasswordInput } from "../../components/PasswordInput";
import { ScreenHeader } from "../../components/ScreenHeader";
import styled from "@emotion/native";

const Content = styled.View({
  flexGrow: 1,
  paddingBottom: 24,
  paddingHorizontal: 20,
});
const Fields = styled.View({
  marginTop: 30,
});
const Field = styled.View({
  marginBottom: 20,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});
const SubmitButton = styled(Button)({
  marginTop: 42,
});

const fieldLabels = ["currentPassword", "newPassword", "confirmPassword"] as const;
type PasswordField = (typeof fieldLabels)[number];

export function ChangePasswordScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("change-password");
  const [passwords, setPasswords] = useState<Record<PasswordField, string>>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibleFields, setVisibleFields] = useState<
    Record<PasswordField, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const updatePassword = (field: PasswordField, value: string) => {
    setPasswords((current) => ({ ...current, [field]: value }));
  };

  const toggleVisibility = (field: PasswordField) => {
    setVisibleFields((current) => ({ ...current, [field]: !current[field] }));
  };

  return (
    <AuthScreen>
      <AuthScroll
        keyboardShouldPersistTaps="handled"
      >
        <Header
          leftAction={
            <IconButton
              accessibilityLabel={t("goBack")}
              backgroundColor="#F4F4F4"
              icon={<ArrowLeftIcon color="#1E1E2D" size={20} weight="regular" />}
              onPress={() => router.back()}
            />
          }
          title={t("title")}
        />

        <Content>
          <Fields>
            {fieldLabels.map((field) => {
              const isVisible = visibleFields[field];
              const fieldLabel = t(field);
              const visibilityLabel = isVisible
                ? t("hideField", { field: fieldLabel })
                : t("showField", { field: fieldLabel });

              return (
                <Field key={field}>
                  <PasswordInput
                    accessibilityLabel={fieldLabel}
                    autoCapitalize="none"
                    density="compact"
                    label={fieldLabel}
                    onChangeText={(value) => updatePassword(field, value)}
                    onToggleVisibility={(visible) => {
                      if (visible !== isVisible) {
                        toggleVisibility(field);
                      }
                    }}
                    showLabel={visibilityLabel}
                    hideLabel={visibilityLabel}
                    value={passwords[field]}
                    visible={isVisible}
                  />
                </Field>
              );
            })}
          </Fields>

          <SubmitButton
            accessibilityLabel={t("changePassword")}
            onPress={() => undefined}
          >
            {t("changePassword")}
          </SubmitButton>
        </Content>
      </AuthScroll>
    </AuthScreen>
  );
}
