import Subcriptions from "@/src/component/auth/Subcriptions";
import GradientBackground from "@/src/component/background/GradientBackground";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const subcription = () => {
  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-1 px-[5%]">
            <Subcriptions />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default subcription;
