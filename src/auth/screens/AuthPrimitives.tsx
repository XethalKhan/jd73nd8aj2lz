import styled from "@emotion/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const colors = {
  action: "#06F",
  heading: "#1E1E2D",
  muted: "#A2A2A7",
  white: "#FFFFFF",
};

export const AuthScreen = styled(SafeAreaView)({
  flex: 1,
  backgroundColor: colors.white,
});

export const AuthScroll = styled.ScrollView({
  flex: 1,
});

export const AuthContent = styled.View({
  flexGrow: 1,
  paddingHorizontal: 20,
  paddingBottom: 24,
});

export const AuthTitle = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-SemiBold",
  fontSize: 32,
  lineHeight: 40,
  marginTop: 40,
});

export const Fields = styled.View({
  marginTop: 30,
});

export const Field = styled.View({
  marginBottom: 19,
});

export const FooterCopy = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 20,
  marginTop: 24,
  textAlign: "center",
});

export const FooterLink = styled.Text({
  color: colors.action,
  fontFamily: "Poppins-Medium",
});
