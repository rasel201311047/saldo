import GradientBackground from "@/src/component/background/GradientBackground";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Startmonth = () => {
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("2026-01-18");

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const buttonScale = useState(new Animated.Value(1))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for date picker
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirm = (selected: string) => {
    setDate(selected);
    setShowDate(false);

    // Confirmation animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER with animation */}
        <View className="flex-row items-center px-[5%] mt-3 ">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="flex-1 ml-3 text-white text-2xl font-bold">
            Month Start Sate
          </Text>
        </View>

        {/* MAIN CONTENT */}

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="px-[5%] pt-[10%]  flex-1 pb-10">
            {/* Decorative elements */}
            <Animated.View
              style={{ opacity: fadeAnim }}
              className="absolute top-0 right-0"
            >
              <LinearGradient
                colors={["rgba(196, 159, 89, 0.1)", "transparent"]}
                style={{ borderRadius: 100 }}
                className="w-40 h-40"
              />
            </Animated.View>

            {/* Instruction card */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="mb-10 "
            >
              <LinearGradient
                colors={["rgba(196, 159, 89, 0.15)", "rgba(38, 38, 161, 0.15)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16 }}
                className="rounded-2xl p-5 border border-white/10"
              >
                <View className="flex-row items-start gap-3">
                  <LinearGradient
                    colors={["#C49F59", "#2626A1"]}
                    style={{ borderRadius: 50 }}
                    className="w-8 h-8 rounded-full items-center justify-center"
                  >
                    <Feather name="info" size={16} color="#fff" />
                  </LinearGradient>
                  <View className="flex-1">
                    <Text className="text-white font-InterBold text-base mb-1">
                      Why Set a Start Date?
                    </Text>
                    <Text className="text-gray-300 text-sm font-Inter leading-5">
                      This helps track your monthly income and expenses
                      accurately. Choose the date when your salary or main
                      income arrives each month.
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Date Picker Section */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="mb-8"
            >
              <Text className="text-[#C49F59] text-sm font-InterBold uppercase mb-2 tracking-wider">
                Start Date
              </Text>

              <Text className="text-gray-400 text-sm font-Inter mb-4">
                Set the date your income cycle starts
              </Text>

              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowDate(true)}
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                  activeOpacity={0.8}
                  className="relative "
                >
                  <LinearGradient
                    colors={[
                      "rgba(196, 159, 89, 0.2)",
                      "rgba(38, 38, 161, 0.2)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 16 }}
                    className=" border-2 border-[#C49F59]/50 p-5 overflow-hidden"
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale: buttonScale }],
                      }}
                      className="flex-row items-center justify-between"
                    >
                      <View>
                        <Text className="text-white/60 text-xs font-Inter mb-1">
                          Selected Date
                        </Text>
                        <Text className="text-white text-xl font-InterBold">
                          {formatDate(date)}
                        </Text>
                      </View>

                      <LinearGradient
                        colors={["#C49F59", "#2626A1"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 8 }}
                        className="w-12 h-12 rounded-xl items-center justify-center shadow-lg shadow-black/30"
                      >
                        <Feather name="calendar" size={20} color="#fff" />
                      </LinearGradient>
                    </Animated.View>
                  </LinearGradient>

                  {/* Shine effect */}
                  <Animated.View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: -100,
                      width: 100,
                      height: "200%",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: [{ rotate: "20deg" }],
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {/* Confirmation Button */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="mt-10"
            >
              <TouchableOpacity
                onPress={() => {
                  // Handle save/confirm action
                  handleConfirm(date);
                  router.back();
                }}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#C49F59", "#2626A1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 8 }}
                  className="rounded-2xl py-4 items-center shadow-lg shadow-black/40"
                >
                  <Animated.Text
                    style={{
                      transform: [{ scale: buttonScale }],
                    }}
                    className="text-white text-lg font-InterBold"
                  >
                    Confirm Start Date
                  </Animated.Text>
                  <Text className="text-white/70 text-sm font-Inter mt-1">
                    Save and continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Custom Date Picker */}
        <CustomDatePicker
          visible={showDate}
          date={date}
          onClose={() => setShowDate(false)}
          onConfirm={handleConfirm}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Startmonth;
