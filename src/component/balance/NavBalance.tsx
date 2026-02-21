import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const NavBalance = () => {
  return (
    <View>
      <View className="flex-row justify-between items-center px-[5%]">
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="  flex-row items-center gap-2"
        >
          <Image
            source={{ uri: "https://i.ibb.co.com/BVvVXn3h/user-5.png" }}
            className="w-16 h-16 rounded-full"
          />
          <Text className="font-Inter font-bold text-xl text-white">
            Rasel Islam
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/accountbalanceadd")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#b08b4a6c", "#2626a18a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              paddingHorizontal: 24,
              paddingVertical: 12,
              gap: 10,
            }}
          >
            <FontAwesome6 name="plus" size={18} color="#fff" />
            <Text className="font-Inter font-bold text-lg text-white">
              Create
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBalance;
