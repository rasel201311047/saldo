import { gift } from "@/assets/icons";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";

const AnimatedLinear = Animated.createAnimatedComponent(LinearGradient);

const Subcriptions = () => {
  const features = [
    {
      icon: "apps",
      title: "Customizable categories",
      desc: "Design your own categories and subcategories for income and expenses no restrictions, full flexibility.",
    },
    {
      icon: "chart-bar",
      title: "Advanced insights & trends",
      desc: "Dive into detailed breakdowns of your income and spending by category.",
    },
    {
      icon: "calculator",
      title: "Full control over budgets",
      desc: "Set personalized budgets for each category and stay financially on track.",
    },
    {
      icon: "infinity",
      title: "Unlimited goals & debt tracking",
      desc: "Create as many goals as you like and connect them directly to your transactions.",
    },
    {
      icon: "account-multiple",
      title: "Unlimited Accounts",
      desc: "Add as many personal accounts as needed to manage your balances with ease.",
    },
    {
      icon: "shield-check",
      title: "Ad-Free Experience",
      desc: "Enjoy a clean interface without any ads getting in the way.",
    },
  ];

  /* ---------------- Animations ---------------- */
  const borderAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);
  /* -------------------------------------------- */

  return (
    <View>
      {/* Header */}
      <View className="items-center mt-4 mb-6 relative">
        <LinearGradient
          colors={["#b08b4a77", "#2626a154"]}
          style={{ borderRadius: 8 }}
          className="bg-[#1c1c22] border border-[#fff] p-4 mb-3"
        >
          <SvgXml xml={gift} width={48} height={48} />
        </LinearGradient>

        <Text className="text-white text-xl font-bold">Saldo Premium</Text>

        <Text className="text-gray-400 text-center mt-2 text-sm px-6">
          Become a Budget Genius. Unlock exclusive features and support Saldo by
          upgrading to premium.
        </Text>

        <TouchableOpacity className="absolute right-0 top-0">
          <Ionicons name="close" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <View className="flex-col gap-[4%]">
        {/* Annual */}
        <Pressable>
          <Animated.View
            style={{
              shadowColor: "#f5c46b",
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.45],
              }),
              shadowRadius: 16,
              elevation: 8,
            }}
            className="border border-[#f5c46b] rounded-2xl p-4 bg-[#151519]"
          >
            <View className="absolute -top-3 left-4 bg-[#f5c46b] px-3 py-1 rounded-full">
              <Text className="text-black text-xs font-bold">Most popular</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white font-semibold text-base">
                  Annual
                </Text>
                <Text className="text-gray-400 text-xs">1 year</Text>
              </View>

              <View className="items-end">
                <Text className="text-white font-bold text-lg">$19.99</Text>
                <Text className="text-[#f5c46b] text-xs">
                  1 week Free Trial
                </Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>

        {/* Monthly */}
        <Pressable className="active:opacity-80">
          <View className="border border-gray-700 rounded-2xl p-4 bg-[#151519]">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white font-semibold text-base">
                  Monthly
                </Text>
                <Text className="text-gray-400 text-xs">1 month</Text>
              </View>

              <View className="items-end">
                <Text className="text-white font-bold text-lg">$2.99</Text>
                <Text className="text-[#f5c46b] text-xs">
                  1 week Free Trial
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Lifetime */}
        <Pressable className="active:opacity-80">
          <View className="border border-gray-700 rounded-2xl p-4 bg-[#151519]">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white font-semibold text-base">
                  Lifetime
                </Text>
                <Text className="text-gray-400 text-xs">
                  pay once, use forever
                </Text>
              </View>

              <Text className="text-white font-bold text-lg">$29.99</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Info */}
      <Text className="text-[#F1F1F2] text-sm mt-4 text-center leading-6">
        In 1 week free trial automatically converts into paid subscription at
        rate $19.99/year, billed once per year. Cancel anytime via Google Play
        application before the trial ends to avoid charges.
      </Text>

      <View className="flex-row justify-center gap-6 mt-2 mb-8">
        <Text className="text-[#C49F59] text-base">Terms of Use</Text>
        <Text className="text-[#C49F59] text-base">Privacy policy</Text>
      </View>

      {/* Features Card – Animated Border */}
      <AnimatedLinear
        colors={["#C9A24D55", "#4B3CA755", "#C9A24D55"]}
        start={{ x: borderAnim, y: 0 }}
        end={{
          x: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          y: 1,
        }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="bg-[#0f0f14] rounded-2xl px-4 py-5 space-y-5">
          {features.map((item, index) => (
            <Pressable
              key={index}
              android_ripple={{ color: "#ffffff10" }}
              className="active:opacity-80"
            >
              <View className="flex-row gap-4">
                <View className="bg-[#1b1b22] w-10 h-10 rounded-xl items-center justify-center">
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={22}
                    color="#F5C46B"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-white font-semibold text-[14px]">
                    {item.title}
                  </Text>
                  <Text className="text-[#9CA3AF] text-[12px] leading-4 mt-1">
                    {item.desc}
                  </Text>
                </View>
              </View>

              {index !== features.length - 1 && (
                <View className="h-[1px] bg-white/5 mt-4" />
              )}
            </Pressable>
          ))}
        </View>
      </AnimatedLinear>

      {/* CTA */}
      <TouchableOpacity
        onPress={() => router.replace("/calendar")}
        className="mb-4 mt-3 active:opacity-90"
      >
        <LinearGradient
          colors={["#f5c46b", "#c89a3d"]}
          style={{ borderRadius: 8 }}
          className="py-4 rounded-2xl"
        >
          <Text className="text-center text-[#fff] font-bold text-base">
            Try 1 week for Free
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View className="h-48 w-1" />
    </View>
  );
};

export default Subcriptions;
