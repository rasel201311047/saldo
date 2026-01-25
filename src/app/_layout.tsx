import { Fonts } from "@/assets/fonts/fonts";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import "../../global.css";
export default function RootLayout() {
  const [fontsLoaded] = useFonts(Fonts);
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <View style={{ flex: 1 }} className="bg-[#010101]">
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
