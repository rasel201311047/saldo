import GradientBackground from "@/src/component/background/GradientBackground";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FalsePage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/calendar");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        {/* Icon */}
        <View className="w-20 h-20 rounded-2xl border border-yellow-500/40 justify-center items-center mb-6">
          <FontAwesome5 name="university" size={32} color="#F5C56B" />
        </View>

        {/* Title */}
        <Text className="text-white text-xl font-semibold text-center mb-2">
          No bank connection required.
        </Text>

        {/* Subtitle */}
        <Text className="text-yellow-400 text-sm text-center">
          {` You're in full control now.`}
        </Text>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default FalsePage;
