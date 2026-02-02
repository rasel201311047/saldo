import GradientBackground from "@/src/component/background/GradientBackground";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const transactions = [
  {
    title: "Salary",
    date: "Jan 15",
    amount: "+5,000.00",
    positive: true,
    icon: <FontAwesome5 name="dollar-sign" size={16} color="#60A5FA" />,
    bg: "#1D4ED833",
  },
  {
    title: "House",
    date: "Jan 14",
    amount: "-1,200.00",
    positive: false,
    icon: <MaterialIcons name="house" size={18} color="#FB923C" />,
    bg: "#F9731633",
  },
  {
    title: "Transport",
    date: "Jan 12",
    amount: "-125.50",
    positive: false,
    icon: <FontAwesome5 name="bus" size={16} color="#38BDF8" />,
    bg: "#0EA5E933",
  },
  {
    title: "Gifts",
    date: "Jan 10",
    amount: "+850.00",
    positive: true,
    icon: <FontAwesome5 name="gift" size={16} color="#C084FC" />,
    bg: "#9333EA33",
  },
];

const DetailsWeeklyReport = () => {
  const [active, setActive] = useState<"All" | "Earnings" | "Spendings">("All");

  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(
    transactions.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      120,
      listAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center gap-4 px-[5%] mt-4 mb-6">
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

        <ScrollView className="flex-1">
          <View className="px-[5%] pb-14">
            {/* TOP CARDS */}
            <Animated.View
              style={{
                opacity: headerAnim,
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
              className="flex-row gap-4 mb-6"
            >
              <LinearGradient
                colors={["#0F766E", "#064E3B"]}
                className="flex-1 rounded-2xl p-4"
                style={{ borderRadius: 10 }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather name="trending-up" size={14} color="#5EEAD4" />
                  <Text className="text-[#5EEAD4] text-xs">Earnings</Text>
                </View>
                <Text className="text-white text-xl font-bold">$6,170</Text>
              </LinearGradient>

              <LinearGradient
                colors={["#7F1D1D", "#450A0A"]}
                style={{ borderRadius: 10 }}
                className="flex-1 rounded-2xl p-4"
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Feather name="trending-down" size={14} color="#FDA4AF" />
                  <Text className="text-[#FDA4AF] text-xs">Spendings</Text>
                </View>
                <Text className="text-white text-xl font-bold">$1,695.49</Text>
              </LinearGradient>
            </Animated.View>

            {/* FILTER */}
            <View className="flex-row gap-3 mb-6">
              {["All", "Earnings", "Spendings"].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setActive(item as any)}
                >
                  {active === item ? (
                    <LinearGradient
                      style={{ borderRadius: 50 }}
                      colors={["#E6C57A", "#B08B4A"]}
                      className="px-4 py-2 rounded-full"
                    >
                      <Text className="text-white font-semibold">{item}</Text>
                    </LinearGradient>
                  ) : (
                    <View className="px-4 py-2 rounded-full bg-[#1E1E2E]">
                      <Text className="text-gray-400">{item}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* TRANSACTIONS */}
            {transactions.map((item, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: listAnim[index],
                  transform: [
                    {
                      translateY: listAnim[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
                className="bg-[#1E1E2E] rounded-2xl p-4 mb-3 flex-row justify-between items-center"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ backgroundColor: item.bg }}
                    className="p-2 rounded-xl"
                  >
                    {item.icon}
                  </View>
                  <View>
                    <Text className="text-white font-semibold">
                      {item.title}
                    </Text>
                    <Text className="text-gray-400 text-xs">{item.date}</Text>
                  </View>
                </View>
                <Text
                  className={`font-bold ${
                    item.positive ? "text-[#22C55E]" : "text-[#EF4444]"
                  }`}
                >
                  {item.amount}
                </Text>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default DetailsWeeklyReport;
