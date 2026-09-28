import { type FontSource, useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { LocalizationProvider } from "../src/i18n";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [localizationReady, setLocalizationReady] = useState(false);
  const handleLocalizationReady = useCallback(
    () => setLocalizationReady(true),
    [],
  );
  const [loaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf") as FontSource,
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf") as FontSource,
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf") as FontSource,
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf") as FontSource,
  });

  useEffect(() => {
    if ((loaded || error) && localizationReady) {
      void SplashScreen.hideAsync();
    }
  }, [error, loaded, localizationReady]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LocalizationProvider onReady={handleLocalizationReady}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </LocalizationProvider>
  );
}
