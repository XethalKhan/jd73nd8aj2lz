import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

import { LanguageScreen } from "../../../src/settings/screens/LanguageScreen";

export default function LanguageRoute() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({
        tabBarStyle: {
          display: "none",
        },
      });

      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation]),
  );

  return <LanguageScreen />;
}
