import styled from "@emotion/native";
import type { ReactNode } from "react";
import type { StyleProp, TextInputProps, ViewStyle } from "react-native";
import { TextInput, View } from "react-native";

export type InputVariant = "underline" | "filled" | "plain";
export type InputDensity = "compact" | "normal" | "large";

export interface InputProps extends TextInputProps {
  variant?: InputVariant;
  density?: InputDensity;
  icon?: ReactNode;
  rightAccessory?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const colors = {
  heading: "#1E1E2D",
  muted: "#A2A2A7",
  action: "#066BFF",
  border: "#E3E3E6",
  surface: "#F4F4F4",
  error: "#C62828",
};

const heights: Record<InputDensity, number> = {
  compact: 44,
  normal: 56,
  large: 64,
};

const InputContainer = styled(View, {
  shouldForwardProp: (prop) =>
    !["$variant", "$density", "$hasError"].includes(prop),
})<{
  $variant: InputVariant;
  $density: InputDensity;
  $hasError: boolean;
}>(({ $variant, $density, $hasError }) => ({
  alignItems: "center",
  borderBottomColor: $hasError ? colors.error : colors.border,
  borderBottomWidth: $variant === "underline" || $hasError ? 1 : 0,
  backgroundColor: $variant === "filled" ? colors.surface : undefined,
  borderRadius: $variant === "filled" ? 14 : 0,
  flexDirection: "row",
  height: heights[$density],
  paddingHorizontal: $variant === "filled" ? 14 : 0,
}));

const StyledInput = styled(TextInput, {
  shouldForwardProp: (prop) => prop !== "$density",
})<{ $density: InputDensity }>(({ $density }) => ({
  color: colors.heading,
  flex: 1,
  fontFamily: "Poppins-Regular",
  fontSize: 16,
  height: heights[$density],
  paddingHorizontal: 0,
  paddingVertical: 0,
}));

const InputIcon = styled.View({
  alignItems: "center",
  height: 24,
  justifyContent: "center",
  marginRight: 12,
  width: 24,
});

const SupportingText = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 18,
  marginTop: 4,
});

const ErrorText = styled(SupportingText)({
  color: colors.error,
});

const InputRoot = styled.View({});

export function Input({
  variant = "underline",
  density = "normal",
  icon,
  rightAccessory,
  description,
  error,
  containerStyle,
  style,
  accessibilityState,
  editable = true,
  ...textInputProps
}: Readonly<InputProps>) {
  const hasError = error !== undefined && error !== null && error !== "";

  return (
    <InputRoot style={containerStyle}>
      <InputContainer
        $density={density}
        $hasError={hasError}
        $variant={variant}
      >
        {icon ? <InputIcon accessible={false}>{icon}</InputIcon> : null}
        <StyledInput
          {...textInputProps}
          accessibilityState={{
            ...accessibilityState,
            disabled: !editable || accessibilityState?.disabled === true,
          }}
          editable={editable}
          $density={density}
          style={style}
        />
        {rightAccessory}
      </InputContainer>
      {description !== undefined &&
      description !== null &&
      description !== "" ? (
        <SupportingText accessibilityRole="text">{description}</SupportingText>
      ) : null}
      {hasError ? (
        <ErrorText accessibilityRole="alert">{error}</ErrorText>
      ) : null}
    </InputRoot>
  );
}
