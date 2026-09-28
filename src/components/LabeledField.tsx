import styled from "@emotion/native";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { InputProps } from "./Input";
import { Input } from "./Input";

type DirectInputProps = Partial<
  Omit<InputProps, "icon" | "description" | "error" | "style" | "testID">
>;

const FieldRoot = styled.View({});
const FieldLabel = styled.Text({
  color: "#A2A2A7",
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 20,
  marginBottom: 4,
});
const SupportingText = styled.Text({
  color: "#A2A2A7",
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 18,
  marginTop: 4,
});
const ErrorText = styled(SupportingText)({
  color: "#C62828",
});

export interface LabeledFieldProps extends DirectInputProps {
  label?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  inputProps?: Omit<InputProps, "icon" | "description" | "error">;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputTestID?: string;
  testID?: string;
}

export function LabeledField({
  label,
  children,
  icon,
  description,
  error,
  inputProps,
  containerStyle,
  labelStyle,
  inputTestID,
  testID,
  ...inputFriendlyProps
}: Readonly<LabeledFieldProps>) {
  const hasCustomChildren = children !== undefined && children !== null;
  const content = hasCustomChildren ? (
    children
  ) : (
    <Input
      {...inputFriendlyProps}
      {...inputProps}
      accessibilityLabel={
        inputProps?.accessibilityLabel ??
        inputFriendlyProps.accessibilityLabel ??
        (typeof label === "string" ? label : undefined)
      }
      description={description}
      error={error}
      icon={icon}
      testID={inputTestID}
    />
  );

  return (
    <FieldRoot testID={testID} style={containerStyle}>
      {label !== undefined && label !== null && label !== "" ? (
        <FieldLabel accessibilityRole="text" style={labelStyle}>
          {label}
        </FieldLabel>
      ) : null}
      {content}
      {hasCustomChildren &&
      description !== undefined &&
      description !== null &&
      description !== "" ? (
        <SupportingText accessibilityRole="text">{description}</SupportingText>
      ) : null}
      {hasCustomChildren &&
      error !== undefined &&
      error !== null &&
      error !== "" ? (
        <ErrorText accessibilityRole="alert">{error}</ErrorText>
      ) : null}
    </FieldRoot>
  );
}
