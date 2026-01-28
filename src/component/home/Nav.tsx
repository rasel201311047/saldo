import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Nav = () => {
  return (
    <LinearGradient
      colors={["#b08b4a6c", "#2626a18a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.8, y: 1 }}
      style={{
        padding: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <SafeAreaView edges={["top"]} className="">
        <View className="flex-row justify-between items-center px-[5%]">
          <View className="">
            <Image
              source={{ uri: "https://i.ibb.co.com/BVvVXn3h/user-5.png" }}
              className="w-16 h-16 rounded-full"
            />
          </View>

          <LinearGradient
            colors={["#b08b4a6c", "#2626a18a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={{
              borderRadius: 50,
            }}
          >
            <Text className="font-Inter font-bold text-xl text-[#FFFFFF] rounded-full px-[8%] py-3">
              $0.00
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#b08b4a6c", "#2626a18a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={{
              borderRadius: 50,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/notification")}
              className="p-3"
            >
              <Ionicons name="notifications" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Text className="font-Inter text-[#FFFFFF] font-medium text-center my-4">
          Current Balance
        </Text>

        <LinearGradient
          colors={["#b08b4a6c", "#2626a18a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.8, y: 1 }}
          style={{
            borderRadius: 50,
            width: 150,
            alignSelf: "center",
          }}
        >
          <View className="flex-row justify-center items-center">
            <Text className="font-Inter font-bold text-sm text-[#FFFFFF] rounded-full px-[8%] py-3">
              January 2026
            </Text>
            <Entypo name="chevron-down" size={20} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Nav;
