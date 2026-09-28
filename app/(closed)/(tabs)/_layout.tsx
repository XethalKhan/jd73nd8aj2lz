import { Tabs } from "expo-router";
import {
  ChartPieIcon,
  CreditCardIcon,
  GearIcon,
  HouseIcon,
  type Icon,
} from "phosphor-react-native";
import type { ColorValue } from "react-native";
import { useAppTranslation } from "../../../src/i18n";

type TabBarIconProps = {
  readonly icon: Icon;
  readonly color: ColorValue;
  readonly size: number;
};

function TabBarIcon({ icon: IconComponent, color, size }: TabBarIconProps) {
  return <IconComponent color={color as string} size={size} weight="regular" />;
}

const homeTabBarIcon = ({ color, size }: Omit<TabBarIconProps, "icon">) => (
  <TabBarIcon icon={HouseIcon} color={color} size={size} />
);

const myCardsTabBarIcon = ({ color, size }: Omit<TabBarIconProps, "icon">) => (
  <TabBarIcon icon={CreditCardIcon} color={color} size={size} />
);

const statisticsTabBarIcon = ({
  color,
  size,
}: Omit<TabBarIconProps, "icon">) => (
  <TabBarIcon icon={ChartPieIcon} color={color} size={size} />
);

const settingsTabBarIcon = ({ color, size }: Omit<TabBarIconProps, "icon">) => (
  <TabBarIcon icon={GearIcon} color={color} size={size} />
);

export default function TabsLayout() {
  const { t } = useAppTranslation("tabs");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0066FF",
        tabBarInactiveTintColor: "#8B8B94",
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: "#F4F4F4",
          borderTopWidth: 0,
          elevation: 0,
          height: 86,
          position: "absolute",
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("home"),
          tabBarIcon: homeTabBarIcon,
        }}
      />
      <Tabs.Screen
        name="my-cards"
        options={{
          title: t("myCards"),
          tabBarIcon: myCardsTabBarIcon,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t("statistics"),
          tabBarIcon: statisticsTabBarIcon,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: settingsTabBarIcon,
        }}
      />
    </Tabs>
  );
}
