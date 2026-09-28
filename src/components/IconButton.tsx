import styled from "@emotion/native";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable } from "react-native";

export interface IconButtonProps extends PressableProps {
  icon: ReactNode;
  accessibilityLabel: string;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const StyledIconButton = styled(Pressable, {
  shouldForwardProp: (prop) =>
    !["$size", "$backgroundColor", "$borderColor"].includes(prop),
})<{
  $size: number;
  $backgroundColor: string;
  $borderColor?: string;
}>(({ $size, $backgroundColor, $borderColor }) => ({
  alignItems: "center",
  backgroundColor: $backgroundColor,
  borderColor: $borderColor,
  borderRadius: $size / 2,
  borderWidth: $borderColor ? 1 : 0,
  height: $size,
  justifyContent: "center",
  width: $size,
}));

export function IconButton({
  icon,
  accessibilityLabel,
  size = 42,
  backgroundColor = "transparent",
  borderColor,
  accessibilityState,
  style,
  ...pressableProps
}: Readonly<IconButtonProps>) {
  return (
    <StyledIconButton
      {...pressableProps}
      $backgroundColor={backgroundColor}
      $borderColor={borderColor}
      $size={size}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={pressableProps.accessibilityRole ?? "button"}
      accessibilityState={accessibilityState}
      style={style}
    >
      {icon}
    </StyledIconButton>
  );
}
