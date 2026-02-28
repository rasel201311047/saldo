import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetCurrentBalanceQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavberCalenderModal from "./NavberCalenderModal";
const getCurrencySymbol = (code?: string) => {
  if (!code) return "";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    BDT: "৳",
    INR: "₹",
    AED: "د.إ",

    RON: "L",
    HUF: "Ft",
    BGN: "лв",
    RSD: "дин",
    UAH: "₴",
    MDL: "L",

    CHF: "CHF",
    PLN: "zł",
    CZK: "Kč",
  };

  return currencySymbols[code] || code;
};
const Nav = () => {
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const { data: getCurrentBalanceData, isLoading: currentBalanceLoading } =
    useGetCurrentBalanceQuery();

  console.log("Profile Data:", getCurrentBalanceData?.data);
  const [openCalender, setOpenCalender] = useState(false);
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

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
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className=""
          >
            <Image
              source={{
                uri:
                  getProfileData?.data?.profilePicture ||
                  "https://i.ibb.co.com/BVvVXn3h/user-5.png",
              }}
              className="w-16 h-16 rounded-full"
            />
          </TouchableOpacity>

          <LinearGradient
            colors={["#b08b4a6c", "#2626a18a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={{
              borderRadius: 50,
            }}
          >
            <Text className="font-Inter font-bold text-xl text-[#FFFFFF] rounded-full px-[8%] py-3">
              {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
              {getCurrentBalanceData?.data.toFixed(2) || "0.00"}
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

        <TouchableOpacity onPress={() => setOpenCalender(true)}>
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
                {formattedDate}
              </Text>
              <Entypo name="chevron-down" size={20} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <NavberCalenderModal
          visible={openCalender}
          onClose={() => setOpenCalender(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Nav;
