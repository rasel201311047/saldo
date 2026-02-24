import { Fonts } from "@/assets/fonts/fonts";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../../global.css";
import GradientBackground from "../component/background/GradientBackground";
import { store } from "../redux/store";
import { registerForPushNotificationsAsync } from "../utils/fcmService";
export default function RootLayout() {
  const [fontsLoaded] = useFonts(Fonts);
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        const rawToken = token
          .replace("ExponentPushToken[", "")
          .replace("]", "");
        console.log("Raw Token:", rawToken);
      }
    });
  }, []);

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
