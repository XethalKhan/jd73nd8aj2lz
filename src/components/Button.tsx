import styled from "@emotion/native";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { ActivityIndicator, Pressable, Text } from "react-native";

export type ButtonVariant = "primary" | "outlined" | "text";

export interface ButtonProps extends PressableProps {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const buttonColors = {
  action: "#066BFF",
  heading: "#1E1E2D",
  white: "#FFFFFF",
  disabled: "#A2A2A7",
};

const StyledButton = styled(Pressable)({
  alignItems: "center",
  borderRadius: 16,
  flexDirection: "row",
  height: 56,
  justifyContent: "center",
  paddingHorizontal: 20,
});

const VariantButton = styled(StyledButton, {
  shouldForwardProp: (prop) =>
    !["$variant", "$fullWidth", "$disabled"].includes(prop),
})<{
  $variant: ButtonVariant;
  $fullWidth: boolean;
  $disabled: boolean;
}>(({ $variant, $fullWidth, $disabled }) => ({
  backgroundColor: $variant === "primary" ? buttonColors.action : "transparent",
  borderColor: $variant === "outlined" ? buttonColors.action : undefined,
  borderRadius: $variant === "text" ? 0 : 16,
  borderWidth: $variant === "outlined" ? 1 : 0,
  opacity: $disabled ? 0.55 : 1,
  paddingHorizontal: $variant === "text" ? 8 : 20,
  ...($fullWidth ? { alignSelf: "stretch", width: "100%" } : {}),
}));

const ButtonLabel = styled(Text, {
  shouldForwardProp: (prop) => !["$variant", "$hasIcon"].includes(prop),
})<{ $variant: ButtonVariant; $hasIcon: boolean }>(
  ({ $variant, $hasIcon }) => ({
    color: $variant === "primary" ? buttonColors.white : buttonColors.action,
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginLeft: $hasIcon ? 8 : 0,
  }),
);

export function Button({
  children,
  variant = "primary",
  icon,
  fullWidth = false,
  loading = false,
  disabled = false,
  accessibilityState,
  style,
  ...pressableProps
}: Readonly<ButtonProps>) {
  const isDisabled = disabled || loading;

  return (
    <VariantButton
      {...pressableProps}
      $disabled={isDisabled}
      $fullWidth={fullWidth}
      $variant={variant}
      accessibilityRole={pressableProps.accessibilityRole ?? "button"}
      accessibilityState={{
        ...accessibilityState,
        disabled: isDisabled || accessibilityState?.disabled === true,
      }}
      disabled={isDisabled}
      style={style}
    >
      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Loading"
          color={
            variant === "primary" ? buttonColors.white : buttonColors.action
          }
        />
      ) : (
        <>
          {icon}
          <ButtonLabel $hasIcon={Boolean(icon)} $variant={variant}>
            {children}
          </ButtonLabel>
        </>
      )}
    </VariantButton>
  );
}
