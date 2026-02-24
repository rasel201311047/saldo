import GradientBackground from "@/src/component/background/GradientBackground";
import BarGraph from "@/src/component/graph/BarGraph";
import CircleGraph from "@/src/component/graph/CircleGraph";
import LineGraph from "@/src/component/graph/LineGraph";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  return (
    <GradientBackground>
      <View className="flex-1">
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header */}
          <View className="flex-row py-2 items-center gap-[3%] px-[5%]">
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

            <Text className="text-white font-Inter text-xl font-bold">
              Analytics
            </Text>
          </View>

          <ScrollView className="flex-1">
            <View className="px-[5%] mt-5">
              {/* <View className="flex-row items-center justify-between">
                {dataanalytics.map((item, index) => (
                  <AnalyticsCard key={index} item={item} />
                ))}
              </View> */}
              <Text className="text-white text-lg font-Inter font-bold pt-4">
                Income vs Expenses
              </Text>
              <BarGraph />
              <Text className="text-white text-lg font-bold pt-4">
                Balance Trend
              </Text>
              <View className="h-[2%] w-full" />

              <LineGraph />
              <Text className="text-white text-lg font-bold py-4">
                Spending by Category
              </Text>

              <CircleGraph />
              <View className="h-40" />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default Analytics;
