import { MonthImg } from "@/assets/month/month";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CalendershowData = () => {
  return (
    <View>
      <View className="w-full">
        <Image source={MonthImg.january} className="w-full" />
        <View className=" absolute w-full inset-0 items-center ">
          <View className="bg-[#010101] mt-[3%] px-[4%] py-1 rounded-full">
            <Text className="font-Inter font-medium text-[#fff]">
              January 2026
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-col gap-2 justify-center items-center my-[3%]">
        <TouchableOpacity>
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            style={{ borderRadius: 50 }}
            className="w-[60%] py-2 px-3 rounded-lg"
          >
            <Text className="text-center font-Inter font-medium text-[#fff]">
              January 01-07
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-center font-Inter font-medium text-[#fff]">
            January 08-16
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-center font-Inter font-medium text-[#fff]">
            January 17-23
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className="text-center font-Inter font-medium text-[#fff]">
            January 24-30
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className="text-center font-Inter font-medium text-[#fff]">
            January 31
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CalendershowData;
