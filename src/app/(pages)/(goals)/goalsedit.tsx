import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import CompleteModal from "@/src/component/goals/CompleteModal";
import DeleteModal from "@/src/component/home/DeleteModal";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Goalsedit = () => {
  const [opendelete, setOpenDelete] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center gap-4 px-[5%] mt-2">
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

          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              style={{
                height: 35,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text className="font-Inter font-semibold text-xl text-white px-5">
                Edit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="flex-1 px-[5%]">
            {/* Content */}
            <View className="flex-1 mt-6">
              {/* Category */}
              <View className="flex-row items-center self-start bg-[#2A2536] px-3 py-1.5 rounded-full gap-2">
                <Image source={BudgetImg.Transport} className="w-6 h-6" />
                <Text className="text-white text-[13px]">Transport</Text>
              </View>

              {/* Title */}
              <Text className="text-white text-[22px] font-semibold mt-4">
                Buy a car
              </Text>
              <Text className="text-[#B0B0B0] text-[14px] mt-1">
                I will purchase my dream car in this month
              </Text>

              {/* Amount cards */}
              <View className="flex-row justify-between mt-6">
                <View className="w-[48%] bg-[#262233] rounded-2xl p-4">
                  <Text className="text-[#B5B5B5] text-[13px]">
                    Accumulated amount
                  </Text>
                  <Text className="text-white text-[16px] font-semibold mt-1.5">
                    $100.00
                  </Text>
                </View>

                <View className="w-[48%] bg-[#262233] rounded-2xl p-4">
                  <Text className="text-[#B5B5B5] text-[13px]">Total</Text>
                  <Text className="text-white text-[16px] font-semibold mt-1.5">
                    $10,000.00
                  </Text>
                </View>
              </View>

              {/* Date */}
              <View className="flex-row justify-between items-center my-4">
                <Text className="text-[#B5B5B5] text-[14px] mb-2">Date</Text>
                <View className="self-start bg-[#2A2536] px-4 py-1.5 rounded-full">
                  <Text className="text-white text-[13px]">
                    20 January 2026
                  </Text>
                </View>
              </View>

              {/* Mark as complete */}
              <View className="flex-row justify-between mt-8">
                <TouchableOpacity onPress={() => setOpenDelete(true)}>
                  <FontAwesome5 name="trash" size={40} color="#FF3B3B" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setOpenComplete(true)}
                  className=" border border-[#E6C27A] px-3 py-1 items-center justify-center rounded-xl "
                >
                  <Text className="text-[#fff] text-[15px]">
                    Mark as complete
                  </Text>
                </TouchableOpacity>
              </View>

              {/* OK Button */}
              <TouchableOpacity activeOpacity={0.9} className="mt-[8%]">
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 8 }}
                  className="  py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <DeleteModal
          opendelete={opendelete}
          setOpendelete={() => setOpenDelete(false)}
        />

        <CompleteModal
          openComplete={openComplete}
          setOpenComplete={() => setOpenComplete(false)}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Goalsedit;
