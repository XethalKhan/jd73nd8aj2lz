import styled from "@emotion/native";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { Pressable, Text } from "react-native";

export interface ScreenHeaderProps extends ViewProps {
  title: ReactNode;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  onBackPress?: () => void;
  backAccessibilityLabel?: string;
  titleAccessibilityLabel?: string;
}

const HeaderRoot = styled.View({
  alignItems: "center",
  flexDirection: "row",
  height: 42,
  justifyContent: "space-between",
  paddingHorizontal: 20,
  position: "relative",
});
const HeaderSlot = styled.View({
  minWidth: 42,
});
const RightHeaderSlot = styled(HeaderSlot)({
  alignItems: "flex-end",
});
const BackButton = styled(Pressable)({
  alignItems: "center",
  height: 42,
  justifyContent: "center",
  width: 42,
});
const BackGlyph = styled(Text)({
  color: "#1E1E2D",
  fontSize: 28,
  lineHeight: 30,
});
const HeaderTitle = styled.Text({
  color: "#1E1E2D",
  fontFamily: "Poppins-SemiBold",
  fontSize: 18,
  left: 20,
  lineHeight: 24,
  position: "absolute",
  right: 20,
  textAlign: "center",
});

export function ScreenHeader({
  title,
  leftAction,
  rightAction,
  onBackPress,
  backAccessibilityLabel = "Go back",
  titleAccessibilityLabel,
  style,
  ...viewProps
}: Readonly<ScreenHeaderProps>) {
  const resolvedLeftAction =
    leftAction ??
    (onBackPress ? (
      <BackButton
        accessibilityLabel={backAccessibilityLabel}
        accessibilityRole="button"
        onPress={onBackPress}
      >
        <BackGlyph>‹</BackGlyph>
      </BackButton>
    ) : null);

  return (
    <HeaderRoot
      {...viewProps}
      accessibilityRole={viewProps.accessibilityRole ?? "header"}
      style={style}
    >
      <HeaderSlot>{resolvedLeftAction}</HeaderSlot>
      <HeaderTitle
        accessibilityLabel={titleAccessibilityLabel}
        pointerEvents="none"
      >
        {title}
      </HeaderTitle>
      <RightHeaderSlot>{rightAction}</RightHeaderSlot>
    </HeaderRoot>
  );
}
