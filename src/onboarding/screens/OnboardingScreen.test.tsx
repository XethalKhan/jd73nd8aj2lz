import { fireEvent, render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { Onboarding1Screen } from "./Onboarding1Screen";
import { Onboarding2Screen } from "./Onboarding2Screen";
import { Onboarding3Screen } from "./Onboarding3Screen";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("onboarding screens", () => {
  const push = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push, replace });
  });

  it("renders onboarding 1 with its local illustration, copy, and active step", async () => {
    const { getByLabelText, getByRole, getByText } = await render(
      <Onboarding1Screen />,
    );

    expect(getByText("Fastest Payment in the world")).toBeTruthy();
    expect(
      getByText(
        "Integrate multiple payment methoods to help you up the process quickly",
      ),
    ).toBeTruthy();
    const image = getByLabelText("Onboarding payment illustration");
    expect(image).toBeTruthy();
    expect(image.props.source).not.toEqual(
      expect.stringMatching(/^https?:\/\//),
    );
    expect(getByLabelText("Current onboarding step 1")).toBeTruthy();
    expect(getByRole("button", { name: "Next" })).toBeTruthy();
  });

  it("renders onboarding 2 with the second active step and advances to 3", async () => {
    const { getByLabelText, getByText, getByRole } = await render(
      <Onboarding2Screen />,
    );

    expect(getByText("The most Secure Platfrom for Customer")).toBeTruthy();
    expect(
      getByText(
        "Built-in Fingerprint, face recognition and more, keeping you completely safe",
      ),
    ).toBeTruthy();
    expect(getByLabelText("Current onboarding step 2")).toBeTruthy();

    await fireEvent.press(getByRole("button", { name: "Next" }));

    expect(push).toHaveBeenCalledWith("/(closed)/onboarding/3");
  });

  it("renders onboarding 3 and replaces the route with Home", async () => {
    const { getByRole, getByText } = await render(<Onboarding3Screen />);

    expect(
      getByText("Paying for Everything is Easy and Convenient"),
    ).toBeTruthy();
    expect(getByRole("button", { name: "Next" })).toBeTruthy();

    await fireEvent.press(getByRole("button", { name: "Next" }));

    expect(replace).toHaveBeenCalledWith("/(closed)/(tabs)/home");
  });
});
