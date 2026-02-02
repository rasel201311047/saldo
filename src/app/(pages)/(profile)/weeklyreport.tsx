import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WeeklyReport = () => {
  const [activeTab, setActiveTab] = useState<"Weekly" | "Monthly">("Weekly");

  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.65,
      duration: 900,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center gap-4 px-[5%] mt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">
            Monthly & Weekly Report
          </Text>
        </View>

        <ScrollView className="flex-1 mt-6">
          <View className="px-[5%] pb-12">
            {/* TOGGLE */}
            <View className="flex-row bg-[#1E1E2E] rounded-full p-1 mb-6">
              {["Weekly", "Monthly"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  className="flex-1"
                  onPress={() => setActiveTab(tab as any)}
                >
                  {activeTab === tab ? (
                    <LinearGradient
                      colors={["#E6C57A", "#B08B4A"]}
                      style={{ borderRadius: 50 }}
                      className="py-2 rounded-full items-center"
                    >
                      <Text className="text-[#fff] font-semibold">{tab}</Text>
                    </LinearGradient>
                  ) : (
                    <View className="py-2 items-center">
                      <Text className="text-[#fff]">{tab}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* TOTAL EARNINGS */}
            <View className="bg-[#1E1E2E] rounded-2xl p-4 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="bg-[#0EA5E933] p-2 rounded-xl">
                  <Feather name="trending-up" size={18} color="#38BDF8" />
                </View>
                <View>
                  <Text className="text-gray-400 text-sm">Total Earnings</Text>
                  <Text className="text-white text-xl font-bold">$2,450</Text>
                </View>
              </View>
            </View>

            {/* TOTAL SPENDINGS */}
            <View className="bg-[#1E1E2E] rounded-2xl p-4 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="bg-[#EC489933] p-2 rounded-xl">
                  <Feather name="trending-down" size={18} color="#F472B6" />
                </View>
                <View>
                  <Text className="text-gray-400 text-sm">Total Spendings</Text>
                  <Text className="text-white text-xl font-bold">$1,680</Text>
                </View>
              </View>
            </View>

            {/* REMAINING BALANCE */}
            <Animated.View
              style={{ opacity: glowOpacity }}
              className="rounded-2xl mb-4"
            >
              <LinearGradient
                colors={["#2A2233", "#1A1A2E"]}
                className="p-5 rounded-2xl border border-[#E6C57A66]"
              >
                <Text className="text-center text-gray-300 mb-1">
                  Remaining Balance
                </Text>
                <Text className="text-center text-[#E6C57A] text-3xl font-bold">
                  +$770
                </Text>
                <Text className="text-center text-gray-400 text-xs mt-1">
                  Great job staying within budget!
                </Text>
              </LinearGradient>
            </Animated.View>

            {/* BIGGEST CATEGORY */}
            <View className="bg-[#1E1E2E] rounded-2xl p-4 mb-4 flex-row justify-between items-center">
              <View className="flex-row items-center gap-[2%]">
                <Image source={BudgetImg.Food} className="w-8 h-8" />

                <View>
                  <Text className="text-gray-400 text-sm">
                    Biggest spending category
                  </Text>
                  <Text className="text-white font-semibold mt-1">
                    Food & Dining
                  </Text>
                </View>
              </View>
              <Text className="text-white font-bold">$520</Text>
            </View>

            {/* GOAL PROGRESS */}
            <View className="bg-[#1E1E2E] rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between mb-2">
                <View className="flex-row gap-[4%]">
                  <View className="bg-[#2B7FFF1A] w-12 h-12 rounded-xl justify-center items-center">
                    <Image source={BudgetImg.goal} className="w-8 h-8" />
                  </View>
                  <View>
                    <Text className="text-white font-semibold">
                      Goal Progress
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      $3,250 of $5,000
                    </Text>
                  </View>
                </View>
                <Text className="text-[#E6C57A] font-bold">65%</Text>
              </View>

              <View className="h-2 bg-[#2A2A3D] rounded-full overflow-hidden">
                <Animated.View style={{ width: progressWidth }}>
                  <LinearGradient
                    colors={["#E6C57A", "#B08B4A"]}
                    className="h-2 rounded-full"
                  />
                </Animated.View>
              </View>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              onPress={() => router.push("/detailsweeklyreport")}
            >
              <LinearGradient
                colors={["#E6C57A", "#B08B4A"]}
                style={{ borderRadius: 50 }}
                className="py-4 rounded-xl items-center mb-4"
              >
                <Text className="text-[#fff] font-bold">View Details</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <Text className="text-[#fff]">Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default WeeklyReport;
