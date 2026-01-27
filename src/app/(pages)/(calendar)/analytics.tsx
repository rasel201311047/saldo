import GradientBackground from "@/src/component/background/GradientBackground";
import FontAwesome6 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const analytics = () => {
  return (
    <GradientBackground>
      <View className="flex-1">
        <SafeAreaView className="flex-1">
          {/* Header with back button and title */}
          <View className="flex-row items-center gap-[3%]">
            <TouchableOpacity className="  ">
              <LinearGradient
                colors={["#b08b4a6c", "#2626a18a"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.8, y: 1 }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className=" "
              >
                <FontAwesome6 name="arrow-left" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <Text className="text-[#fff] text-xl font-Inter font-bold">
              Analytics
            </Text>
          </View>

          <ScrollView className="flex-1">
            <View className="px-[5%]"></View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default analytics;
