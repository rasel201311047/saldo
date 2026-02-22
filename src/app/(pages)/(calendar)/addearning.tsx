import GradientBackground from "@/src/component/background/GradientBackground";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import CustomTimePicker from "@/src/component/custompicker/CustomTimePicker";
import { RootState } from "@/src/redux/store";
import { Entypo } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Addearning = () => {
  const category = useSelector((state: RootState) => state.user.category);
  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD"];

  const [accountCarrent, setAccountCarrent] = useState("Account1");
  const [showAccountCarrent, setShowAccountCarrent] = useState(false);
  const AccountOptions = ["Account1", "Account2", "Account3"];

  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("2026-01-18");
  const [openTime, setOpenTime] = useState(false);
  const [time, setTime] = useState("09:52 AM");
  const [fillCheckbox, setFillCheckbox] = useState<"yes" | "no" | "">("");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleTimeConfirm = (selectedTime: string) => {
    setTime(selectedTime);
    setOpenTime(false);
  };

  return (
    <GradientBackground>
      <View className="flex-1">
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center gap-4 px-[5%] mt-2">
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
              Plan an Earning
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="px-[5%] mt-6 space-y-5">
              {/* Category */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter mb-2">
                  Category
                </Text>
                <View className="flex-row items-center justify-between bg-transparent  border border-[#C49F59] rounded-xl px-4 py-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8  rounded-lg items-center justify-center">
                      <Image source={category?.image} className="w-8 h-8" />
                    </View>
                    <Text className="text-white font-medium">
                      {category?.title}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Amount */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                  Amount
                </Text>
                <View className="flex-row gap-[3%]">
                  <View className="flex-1  bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2">
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#F1F1F2"
                      keyboardType="numeric"
                      className="text-white text-base"
                    />
                  </View>

                  <View className="relative">
                    <Pressable onPress={() => setShowCurrency(!showCurrency)}>
                      <View className="bg-[#584C2F]  px-4 py-5 rounded-lg flex-row items-center">
                        <Text className="text-white font-Inter text-sm">
                          {currency}
                        </Text>
                        <Entypo name="chevron-down" size={20} color="#fff" />
                      </View>
                    </Pressable>

                    {showCurrency && (
                      <View className="absolute right-0 top-12 bg-[#584C2F] rounded-lg border border-[#4F4F59] overflow-hidden z-50">
                        {currencyOptions.map((c) => (
                          <Pressable
                            key={c}
                            onPress={() => {
                              setCurrency(c);
                              setShowCurrency(false);
                            }}
                            className="px-2 py-2"
                          >
                            <Text
                              className={`text-sm font-Inter ${
                                currency === c ? "text-[#FAD885]" : "text-white"
                              }`}
                            >
                              {c}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Account */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                  Select account
                </Text>
                <View className="relative">
                  <Pressable
                    onPress={() => setShowAccountCarrent(!showAccountCarrent)}
                  >
                    <View className="bg-transparent  border border-[#C49F59] px-4 py-5 rounded-lg flex-row justify-between items-center">
                      <Text className="text-white font-Inter text-sm">
                        {accountCarrent}
                      </Text>
                      <Entypo name="chevron-down" size={20} color="#fff" />
                    </View>
                  </Pressable>

                  {showAccountCarrent && (
                    <View className="absolute left-0 right-0 top-12 bg-[#584C2F] rounded-lg border border-[#4F4F59] overflow-hidden z-50">
                      {AccountOptions.map((c) => (
                        <Pressable
                          key={c}
                          onPress={() => {
                            setAccountCarrent(c);
                            setShowAccountCarrent(false);
                          }}
                          className="px-2 py-4 "
                        >
                          <Text
                            className={`text-sm font-Inter text-center ${
                              currency === c ? "text-[#FAD885]" : "text-white"
                            }`}
                          >
                            {c}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* fill year */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                  Fill for all year
                </Text>

                <View className="flex-row gap-4">
                  {/* YES */}
                  <TouchableOpacity
                    onPress={() => setFillCheckbox("yes")}
                    className="flex-row items-center"
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center
          ${fillCheckbox === "yes" ? "border-[#B28C4A]" : "border-[#B28C4A]"}`}
                    >
                      {fillCheckbox === "yes" && (
                        <View className="w-3 h-3 rounded-full bg-[#B28C4A]" />
                      )}
                    </View>
                    <Text className="text-white">Yes</Text>
                  </TouchableOpacity>

                  {/* NO */}
                  <TouchableOpacity
                    onPress={() => setFillCheckbox("no")}
                    className="flex-row items-center"
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center
          ${fillCheckbox === "no" ? "border-[#B28C4A]" : "border-[#B28C4A]"}`}
                    >
                      {fillCheckbox === "no" && (
                        <View className="w-3 h-3 rounded-full bg-[#B28C4A]" />
                      )}
                    </View>
                    <Text className="text-white">No</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                  Date
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

              {/* Time */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                  Time
                </Text>

                {/* Time Input Field */}
                <TouchableOpacity
                  className="flex-row items-center justify-between bg-transparent  border border-[#C49F59] rounded-xl px-4 py-4"
                  onPress={() => setOpenTime(true)}
                  activeOpacity={0.7}
                >
                  <Text className="text-white text-base">{time}</Text>
                  <Feather name="clock" size={18} color="#fff" />
                </TouchableOpacity>

                {/* Time Picker Modal */}
                <CustomTimePicker
                  visible={openTime}
                  onClose={() => setOpenTime(false)}
                  onConfirm={handleTimeConfirm}
                  initialTime={time}
                />
              </View>
              {/* Name */}
              <View>
                <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                  Name
                </Text>
                <View className="bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2">
                  <TextInput
                    placeholder="Enter name"
                    placeholderTextColor="#fff"
                    className="text-white"
                  />
                </View>
              </View>

              {/* Buttons */}
              <View className="mt-6">
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={["#B08A4A", "#E0B66A"]}
                    style={{ borderRadius: 8 }}
                    className="  py-4 items-center"
                  >
                    <Text className="text-white font-semibold text-base">
                      Create
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.back()}
                  className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center"
                >
                  <Text className="text-white font-Inter font-bold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default Addearning;
