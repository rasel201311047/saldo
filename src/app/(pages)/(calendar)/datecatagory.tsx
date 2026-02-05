import GradientBackground from "@/src/component/background/GradientBackground";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SEGMENT_WIDTH = SCREEN_WIDTH * 0.85;
const BUTTON_WIDTH = SEGMENT_WIDTH / 2;

const Datecatagory = () => {
  const [activeButton, setActiveButton] = useState<
    "Money you owe" | "Cash Balance"
  >("Money you owe");

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeButton === "Money you owe" ? 0 : BUTTON_WIDTH,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [activeButton]);

  return (
    <GradientBackground>
      <View className="flex-1">
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center gap-[3%] px-[5%] mt-3">
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
              Categories
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="flex-1">
            <View className="px-[5%] my-6">
              {/* Animated Segmented Control */}
              <View
                style={{ width: SEGMENT_WIDTH }}
                className="bg-[#242333] rounded-full mx-auto "
              >
                <Animated.View
                  style={{
                    position: "absolute",
                    width: BUTTON_WIDTH,
                    height: "100%",
                    backgroundColor:
                      activeButton === "Money you owe" ? "#EE2626" : "#38B27A",
                    borderRadius: 999,
                    transform: [{ translateX }],
                  }}
                />

                {/* Buttons */}
                <View className="flex-row">
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setActiveButton("Money you owe")}
                    style={{ width: BUTTON_WIDTH }}
                    className="py-5 items-center"
                  >
                    <Text className="text-white text-lg font-Inter">
                      Money you owe
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setActiveButton("Cash Balance")}
                    style={{ width: BUTTON_WIDTH }}
                    className="py-5 items-center"
                  >
                    <Text className="text-white text-lg font-Inter">
                      Cash Balance
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* main contain */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default Datecatagory;
