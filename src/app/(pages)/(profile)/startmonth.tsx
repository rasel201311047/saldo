import GradientBackground from "@/src/component/background/GradientBackground";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Startmonth = () => {
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("2026-01-18");
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center gap-4 px-[5%] mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">
            Monthly & Weekly Report
          </Text>
        </View>

        {/* main contain */}
        <ScrollView className="flex-1">
          <View className="px-[5%] mt-[40%] pb-14">
            {/* Date */}
            <View>
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Start Date
              </Text>

              <TouchableOpacity
                onPress={() => setShowDate(true)}
                className="flex-row items-center justify-between bg-transparent  border border-[#C49F59] rounded-xl px-4 py-4"
              >
                <Text className="text-white">{formatDate(date)}</Text>
                <Feather name="calendar" size={18} color="#fff" />
              </TouchableOpacity>

              <CustomDatePicker
                visible={showDate}
                date={date}
                onClose={() => setShowDate(false)}
                onConfirm={(selected) => {
                  setDate(selected);
                  setShowDate(false);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Startmonth;
