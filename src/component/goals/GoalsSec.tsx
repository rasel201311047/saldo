import { menu } from "@/assets/icons";
import { RootState } from "@/src/redux/store";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";

const GoalsSec = () => {
  const loanRecord = useSelector((state: RootState) => state.user.loanRecord);

  // demo values (replace with redux later)
  const target = 10000;
  const saved = 500;
  const progress = (saved / target) * 100;

  return (
    <ScrollView className="flex-1 pt-4">
      {/* ===== TOP SUMMARY ===== */}
      <View className="flex-row justify-between mb-5">
        <View className="bg-[#242333] w-[48%] rounded-2xl p-4">
          <Text className="text-gray-400 text-xs font-Inter mb-1">
            Total left
          </Text>
          <Text className="text-white text-lg font-Inter font-semibold">
            -$9,900.00
          </Text>
        </View>

        <View className="bg-[#242333] w-[48%] rounded-2xl p-4">
          <Text className="text-gray-400 text-xs font-Inter mb-1">
            Fulfilled Goals
          </Text>
          <Text className="text-white text-lg font-Inter font-semibold">
            0/1
          </Text>
        </View>
      </View>

      {/* ===== MY ACCOUNTS HEADER ===== */}
      <View className="mb-4">
        <View className="flex-row items-center gap-3">
          <SvgXml xml={menu} width={20} height={20} />
          <Text className="text-white text-base font-Inter">My Accounts</Text>
        </View>
        <Text className="text-sm text-gray-400 ml-9">-$10,000.00</Text>
      </View>

      {/* ===== GOAL CARD ===== */}

      <TouchableOpacity
        onPress={() => router.push("/goalsedit")}
        className="bg-[#242333] rounded-2xl p-4 mb-6"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-3">
            <View className="bg-white w-9 h-9 rounded-full items-center justify-center">
              <FontAwesome5 name="car" size={18} color="#000" />
            </View>
            <View>
              <Text className="text-white text-base font-Inter">Buy a car</Text>
              <Text className="text-gray-400 text-xs font-Inter">
                I will purchase my dream ca...
              </Text>
            </View>
          </View>

          <Text className="text-white text-lg font-Inter font-semibold">
            $10,000.00
          </Text>
        </View>

        {/* Progress Values */}
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-400 text-xs font-Inter">
            ${saved.toFixed(2)}
          </Text>
          <Text className="text-gray-400 text-xs font-Inter">
            {progress.toFixed(1)}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-[#2B2A3A] rounded-full overflow-hidden mb-2">
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            style={{
              height: "100%",
              width: `${progress}%`,
            }}
          />
        </View>

        {/* Left Amount */}
        <View className="flex-row justify-end">
          <Text className="text-gray-400 text-xs font-Inter">
            Left: <Text className="text-white font-Inter">$9,900.00</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GoalsSec;
