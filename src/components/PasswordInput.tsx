import { EyeIcon, EyeSlashIcon, LockIcon } from "phosphor-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { IconButton } from "./IconButton";
import type { InputProps } from "./Input";
import { Input } from "./Input";
import { LabeledField } from "./LabeledField";

export interface PasswordInputProps extends Omit<
  InputProps,
  "secureTextEntry" | "rightAccessory"
> {
  label?: ReactNode;
  visible?: boolean;
  defaultVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  visibilityLabel?: string;
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordInput({
  label,
  visible,
  defaultVisible = false,
  onToggleVisibility,
  visibilityLabel,
  showLabel = "Show password",
  hideLabel = "Hide password",
  description,
  error,
  ...inputProps
}: Readonly<PasswordInputProps>) {
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const isVisible = visible ?? internalVisible;
  const toggleLabel = visibilityLabel ?? (isVisible ? hideLabel : showLabel);

  const toggleVisibility = () => {
    const nextVisible = !isVisible;
    if (visible === undefined) {
      setInternalVisible(nextVisible);
    }
    onToggleVisibility?.(nextVisible);
  };

  const input = (
    <Input
      {...inputProps}
      accessibilityLabel={
        inputProps.accessibilityLabel ??
        (typeof label === "string" ? label : undefined)
      }
      icon={
        inputProps.icon ?? (
          <LockIcon color="#A2A2A7" size={20} weight="regular" />
        )
      }
      description={label === undefined ? description : undefined}
      error={label === undefined ? error : undefined}
      rightAccessory={
        <IconButton
          accessibilityLabel={toggleLabel}
          accessibilityState={{ expanded: isVisible }}
          backgroundColor="transparent"
          hitSlop={8}
          icon={
            isVisible ? (
              <EyeSlashIcon color="#A2A2A7" size={20} weight="regular" />
            ) : (
              <EyeIcon color="#A2A2A7" size={20} weight="regular" />
            )
          }
          onPress={toggleVisibility}
          size={44}
        ></IconButton>
      }
      secureTextEntry={!isVisible}
    />
  );

  return label !== undefined && label !== null && label !== "" ? (
    <LabeledField description={description} error={error} label={label}>
      {input}
    </LabeledField>
  ) : (
    input
  );
}
