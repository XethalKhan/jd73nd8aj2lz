import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../src/auth/client";

export default function ClosedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (!isBootstrapping && !isAuthenticated) {
    return <Redirect href="/(open)/welcome" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
