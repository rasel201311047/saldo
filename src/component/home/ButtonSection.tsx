import { analyticsicon, budgeticon } from "@/assets/icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";

const ButtonSection = () => {
  return (
    <View className="px-[5%] flex-row  my-[4%] justify-between items-center">
      <TouchableOpacity>
        <LinearGradient
          colors={["#b08b4a6c", "#2626a18a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.8, y: 1 }}
          style={{
            borderRadius: 20,
            width: 150,
            alignSelf: "center",
            paddingVertical: 10,
          }}
        >
          <View className="flex-row justify-center items-center">
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.8, y: 1 }}
              style={{
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View className="">
                <SvgXml xml={budgeticon} width={20} height={20} />
              </View>
            </LinearGradient>

            <Text className="font-Inter font-bold text-sm text-[#FFFFFF] rounded-full px-[8%] py-3">
              Budget
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/analytics")}>
        <LinearGradient
          colors={["#b08b4a6c", "#2626a18a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.8, y: 1 }}
          style={{
            borderRadius: 20,
            width: 150,
            alignSelf: "center",
            paddingVertical: 10,
          }}
        >
          <View className="flex-row justify-center items-center">
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.8, y: 1 }}
              style={{
                borderRadius: 50,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View className="">
                <SvgXml xml={analyticsicon} width={20} height={20} />
              </View>
            </LinearGradient>

            <Text className="font-Inter font-bold text-sm text-[#FFFFFF] rounded-full px-[8%] py-3">
              Analytics
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonSection;
