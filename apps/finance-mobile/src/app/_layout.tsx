import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/auth-context";
import { TransactionsProvider } from "@/context/transactions-context";
import { palette } from "@/theme/tokens";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TransactionsProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.background },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="transaction/new" options={{ presentation: "modal" }} />
            <Stack.Screen name="transaction/edit" options={{ presentation: "modal" }} />
          </Stack>
        </TransactionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
