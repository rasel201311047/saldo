import GradientBackground from "@/src/component/background/GradientBackground";
import Genaral from "@/src/component/profile/Genaral";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center gap-4 px-[5%] mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white font-Inter text-2xl text-center font-bold">
            Profile
          </Text>
          <View />
        </View>

        <ScrollView className="flex-1">
          <View className="px-[5%]">
            <Genaral />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default profile;
