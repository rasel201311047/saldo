import GradientBackground from "@/src/component/background/GradientBackground";
import { useGetTermQuery } from "@/src/redux/api/Page/profile/profileApi";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
const policy = () => {
  const { data, isLoading } = useGetTermQuery();
  console.log(data?.data?.content);

  const source = {
    html: `
  <p>
   ${data?.data?.content || ""}
  </p>
`,
  };
  if (isLoading) {
    <GradientBackground>
      <View className="flex-1">
        <ActivityIndicator size="small" color="#D4AF66" />
      </View>
    </GradientBackground>;
  }
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center justify-between gap-4 px-[5%] mt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">Privacy Policy</Text>
          <View className="w-2" />
        </View>

        <View className="px-[5%] mt-[9%] flex-1">
          <LinearGradient
            colors={["#0F0D25", "#2A2114"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 25 }}
            className="h-[95%] w-full py-8 px-3 rounded-3xl"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <RenderHtml
                source={source}
                tagsStyles={{
                  p: {
                    color: "#FFFFFF",
                    fontFamily: "Inter",
                    fontSize: 14,
                    lineHeight: 22,
                    marginBottom: 16,
                  },
                }}
              />
            </ScrollView>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default policy;
