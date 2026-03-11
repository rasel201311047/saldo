import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import {
  useGetMonthlyReportQuery,
  useGetWeeklyReportQuery,
} from "@/src/redux/api/Page/profile/profileApi";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
  // Get current month for monthly report
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };
  // Fetch data based on active tab
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isFetching: monthlyFetching,
  } = useGetMonthlyReportQuery(getCurrentMonth(), {
    skip: activeTab !== "Monthly",
  });

  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    isFetching: weeklyFetching,
  } = useGetWeeklyReportQuery(undefined, {
    skip: activeTab !== "Weekly",
  });

  const isLoading =
    (activeTab === "Weekly" && (weeklyLoading || weeklyFetching)) ||
    (activeTab === "Monthly" && (monthlyLoading || monthlyFetching));

  // Get current data based on active tab
  const currentData = activeTab === "Weekly" ? weeklyData : monthlyData;

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentData?.data?.goalProgress) {
      const percentage = currentData.data.goalProgress.percentage / 100;
      Animated.timing(progressAnim, {
        toValue: percentage,
        duration: 900,
        useNativeDriver: false,
      }).start();
    }

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
  }, [currentData]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Calculate remaining balance
  const getRemainingBalance = () => {
    if (!currentData?.data) return 0;
    return currentData.data.totalEarning - currentData.data.totalSpending;
  };

  const remainingBalance = getRemainingBalance();

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
            {activeTab} Report
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

            {isLoading ? (
              <View className="h-64 items-center justify-center">
                <ActivityIndicator size="large" color="#E6C57A" />
                <Text className="text-white mt-4">Loading report...</Text>
              </View>
            ) : currentData?.success ? (
              <>
                {/* TOTAL EARNINGS */}
                <View className="bg-[#1E1E2E] rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-[#0EA5E933] p-2 rounded-xl">
                      <Feather name="trending-up" size={18} color="#38BDF8" />
                    </View>
                    <View>
                      <Text className="text-gray-400 text-sm">
                        Total Earnings
                      </Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(currentData.data.totalEarning)}
                      </Text>
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
                      <Text className="text-gray-400 text-sm">
                        Total Spendings
                      </Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(currentData.data.totalSpending)}
                      </Text>
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
                      {remainingBalance >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(remainingBalance))}
                    </Text>
                    <Text className="text-center text-gray-400 text-xs mt-1">
                      {remainingBalance >= 0
                        ? "Great job staying within budget!"
                        : "You've exceeded your budget"}
                    </Text>
                  </LinearGradient>
                </Animated.View>

                {/* BIGGEST CATEGORY */}
                {currentData.data.highestSpendingCategory && (
                  <View className="bg-[#1E1E2E] rounded-2xl p-4 mb-4 flex-row justify-between items-center">
                    <View className="flex-row items-center gap-[2%]">
                      <Image source={BudgetImg.Food} className="w-8 h-8" />
                      <View>
                        <Text className="text-gray-400 text-sm">
                          Biggest spending category
                        </Text>
                        <Text className="text-white font-semibold mt-1">
                          {currentData.data.highestSpendingCategory.category}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-white font-bold">
                      {formatCurrency(
                        currentData.data.highestSpendingCategory.amount,
                      )}
                    </Text>
                  </View>
                )}

                {/* GOAL PROGRESS */}
                {currentData.data.goalProgress && (
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
                            {currentData.data.goalProgress.completed} of{" "}
                            {currentData.data.goalProgress.total.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-[#E6C57A] font-bold">
                        {currentData.data.goalProgress.percentage}%
                      </Text>
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
                )}

                {/* BUTTON */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/detailsweeklyreport",
                      params: {
                        type: activeTab.toLowerCase(),
                        month: activeTab === "Monthly" ? getCurrentMonth() : "",
                      },
                    })
                  }
                >
                  <LinearGradient
                    colors={["#E6C57A", "#B08B4A"]}
                    style={{ borderRadius: 50 }}
                    className="py-4 rounded-xl items-center mb-4"
                  >
                    <Text className="text-[#fff] font-bold">
                      View Details ({currentData.data.entries.all.length}{" "}
                      entries)
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <View className="h-64 items-center justify-center">
                <Text className="text-white text-center">
                  No data available for this period
                </Text>
              </View>
            )}

            <TouchableOpacity
              className="items-center"
              onPress={() => router.back()}
            >
              <Text className="text-[#fff]">Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default WeeklyReport;
