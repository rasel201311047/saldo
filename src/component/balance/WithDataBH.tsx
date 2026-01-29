import { Entypo, Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

const { width } = Dimensions.get("window");
const CHART_SIZE = 220; // Reduced size
const STROKE_WIDTH = 26;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Custom Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WithDataBH = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChart, setShowChart] = useState(true);

  // Simplified animations
  const progressAnim = useRef(new Animated.Value(0)).current;

  const chartData = {
    balance: 5000,
    total: 5250,
    used: 0,
    limit: 250,
    percentage: 100,
    salary: 5000,
  };

  useEffect(() => {
    if (showChart) {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [showChart]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {/* ===== Balance Chart ===== */}
      {showChart && (
        <View className="items-center mb-8">
          <View style={{ width: CHART_SIZE + 140, height: CHART_SIZE }}>
            <Svg width={CHART_SIZE + 140} height={CHART_SIZE}>
              <Defs>
                <SvgGradient
                  id="goldGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor="#D4AF6A" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#F4C542" stopOpacity="1" />
                </SvgGradient>
              </Defs>

              {/* Background ring */}
              <Circle
                cx={CHART_SIZE / 2 + 70}
                cy={CHART_SIZE / 2}
                r={RADIUS}
                stroke="#3A3950"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />

              {/* Animated progress ring */}
              <AnimatedCircle
                cx={CHART_SIZE / 2 + 70}
                cy={CHART_SIZE / 2}
                r={RADIUS}
                stroke="url(#goldGradient)"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${CHART_SIZE / 2 + 70}, ${CHART_SIZE / 2}`}
              />

              {/* 100% Marker Line */}
              <Line
                x1={CHART_SIZE / 2 + 70}
                y1={CHART_SIZE / 2 - RADIUS - 10}
                x2={CHART_SIZE / 2 + 70}
                y2={CHART_SIZE / 2 - RADIUS + 5}
                stroke="#D4AF6A"
                strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Marker Circle */}
              <Circle
                cx={CHART_SIZE / 2 + 70}
                cy={CHART_SIZE / 2 - RADIUS - 15}
                r={5}
                fill="#D4AF6A"
              />

              {/* Horizontal Line to Salary Label */}
              <Line
                x1={CHART_SIZE / 2 + 70 - RADIUS}
                y1={CHART_SIZE / 2}
                x2={30}
                y2={CHART_SIZE / 2}
                stroke="#D4AF6A"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
            </Svg>

            {/* Center Text */}
            <View
              className="absolute items-center justify-center"
              style={{
                left: 70,
                width: CHART_SIZE,
                height: CHART_SIZE,
              }}
            >
              <Text className="text-gray-400 text-sm">Balance</Text>
              <Text className="text-white text-2xl font-semibold mt-1">
                +${chartData.balance.toLocaleString()}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">USD ▼</Text>
            </View>

            {/* Salary Label on Left */}
            <View
              className="absolute"
              style={{
                left: 10,
                top: CHART_SIZE / 2 - 25,
              }}
            >
              <View className="items-start">
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="w-3 h-3 rounded-full bg-[#D4AF6A]" />
                  <Text className="text-white text-sm font-medium">Salary</Text>
                </View>
                <Text className="text-[#D4AF6A] text-lg font-bold">
                  ${chartData.salary.toLocaleString()}
                </Text>
                <Text className="text-[#D4AF6A] text-xs mt-1">100%</Text>
              </View>
            </View>

            {/* 100% Label at Top */}
            <View
              className="absolute"
              style={{
                left: CHART_SIZE / 2 + 55,
                top: CHART_SIZE / 2 - RADIUS - 45,
              }}
            >
              <View className="bg-[#D4AF6A] px-3 py-1 rounded-full">
                <Text className="text-black text-xs font-bold">100%</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ===== Header ===== */}
      <View className="flex-row items-center justify-between px-5 mb-3">
        <View className="flex-row items-center gap-2">
          <Feather name="menu" size={18} color="#fff" />
          <View>
            <Text className="text-white text-base">My Accounts</Text>
            <Text className="text-gray-400 text-xs">
              +${chartData.balance.toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Entypo name="dots-three-vertical" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ===== Account Card ===== */}
      <View className="px-4">
        <View className="bg-[#1F1E2C] border border-[#3A3950] rounded-2xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Feather name="briefcase" size={18} color="#D4AF6A" />
              <Text className="text-white text-base">Salary</Text>
            </View>
            <Text className="text-white text-lg font-semibold">
              $
              {chartData.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400 text-xs">
              ${chartData.limit.toLocaleString()} limit
            </Text>
            <Text className="text-gray-400 text-xs">
              used ${chartData.used.toLocaleString()}
            </Text>
          </View>

          <View className="h-2 bg-[#2B2A3A] rounded-full overflow-hidden">
            <View
              className="h-2 bg-[#D4AF6A]"
              style={{ width: `${(chartData.used / chartData.limit) * 100}%` }}
            />
          </View>
        </View>
      </View>

      {/* ===== Three Dot Menu ===== */}
      <Modal transparent visible={menuOpen} animationType="fade">
        <Pressable className="flex-1" onPress={() => setMenuOpen(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-[#1F1E2C] border border-[#3A3950] rounded-xl w-48 overflow-hidden">
              <TouchableOpacity
                className="flex-row items-center justify-between px-4 py-3"
                onPress={() => setShowChart((v) => !v)}
              >
                <Text className="text-white">Show in chart</Text>
                <View
                  className={`w-10 h-5 rounded-full ${
                    showChart ? "bg-[#D4AF6A]" : "bg-[#3A3950]"
                  }`}
                >
                  <View
                    className={`w-4 h-4 bg-white rounded-full mt-0.5 ${
                      showChart ? "ml-5" : "ml-1"
                    }`}
                  />
                </View>
              </TouchableOpacity>

              <View className="h-[1px] bg-[#3A3950]" />

              <TouchableOpacity className="px-4 py-3">
                <Text className="text-white">Rename</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default WithDataBH;
