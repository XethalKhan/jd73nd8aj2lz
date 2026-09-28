import { type FontSource, useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "../src/auth/client";
import { LocalizationProvider } from "../src/i18n";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const authReady = useAuthStore((state) => !state.isBootstrapping);
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
    void useAuthStore.getState().bootstrap();
  }, []);

  useEffect(() => {
    if ((loaded || error) && localizationReady && authReady) {
      void SplashScreen.hideAsync();
    }
  }, [authReady, error, loaded, localizationReady]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LocalizationProvider onReady={handleLocalizationReady}>
      {authReady ? <Stack screenOptions={{ headerShown: false }} /> : null}
    </LocalizationProvider>
  );
}
