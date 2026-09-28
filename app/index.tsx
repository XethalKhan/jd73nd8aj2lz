import { Redirect } from "expo-router";

import { useAuthStore } from "../src/auth/client";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Redirect
      href={
        isAuthenticated ? "/(closed)/(tabs)/home" : "/(open)/welcome"
      }
    />
  );
}
