import { Fonts } from "@/assets/fonts/fonts";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../../global.css";
import GradientBackground from "../component/background/GradientBackground";
import { store } from "../redux/store";
export default function RootLayout() {
  const [fontsLoaded] = useFonts(Fonts);
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <Provider store={store}>
      <GradientBackground>
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(pages)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="index" />
          </Stack>
        </SafeAreaView>
      </GradientBackground>
    </Provider>
  );
}
