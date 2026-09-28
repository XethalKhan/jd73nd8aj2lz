import { render } from "@testing-library/react-native";
import { Text } from "react-native";

import { Input } from "./Input";
import { LabeledField } from "./LabeledField";

describe("LabeledField", () => {
  it("composes a label with the input-friendly API", async () => {
    const { getByText, getByTestId } = await render(
      <LabeledField
        description="Required"
        error="This field is required"
        inputTestID="name-input"
        label="Full name"
        placeholder="Your name"
      />,
    );

    expect(getByText("Full name")).toBeTruthy();
    expect(getByTestId("name-input")).toHaveProp("placeholder", "Your name");
    expect(getByText("Required")).toBeTruthy();
    expect(getByText("This field is required")).toBeTruthy();
  });

  it("accepts custom children without replacing them", async () => {
    const { getByTestId, getByText } = await render(
      <LabeledField label="Account" testID="account-field">
        <Text testID="custom-field">Custom control</Text>
      </LabeledField>,
    );

    expect(getByTestId("account-field")).toBeTruthy();
    expect(getByTestId("custom-field")).toBeTruthy();
    expect(getByText("Account")).toBeTruthy();
  });

  it("supports an explicitly composed Input", async () => {
    const { getByTestId } = await render(
      <LabeledField label="Username">
        <Input testID="username-input" />
      </LabeledField>,
    );

    expect(getByTestId("username-input")).toBeTruthy();
  });
});
