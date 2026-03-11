import GradientBackground from "@/src/component/background/GradientBackground";
import CustomAlert from "@/src/component/customAlart/CustomAlert";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import CustomTimePicker from "@/src/component/custompicker/CustomTimePicker";
import { useGetBalanceAccountQuery } from "@/src/redux/api/Page/Balance/balanceApi";
import { usePostspendingDataMutation } from "@/src/redux/api/Page/calendar/calendarApi";
import { RootState } from "@/src/redux/store";
import { Entypo } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Addspending = () => {
  const { data: dataaccount, isLoading: isLoadiungAccount } =
    useGetBalanceAccountQuery();
  const [dataspendingPost, { isLoading: spendingload }] =
    usePostspendingDataMutation();

  // altert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const category = useSelector((state: RootState) => state.user.category);
  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);

  const [accountCarrent, setAccountCarrent] = useState("select Account");
  const [showAccountCarrent, setShowAccountCarrent] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");

  console.log("hello ", dataaccount?.data?.accounts);

  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("2026-01-18");
  const [openTime, setOpenTime] = useState(false);
  const [time, setTime] = useState("09:52 AM");

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
  const formatTimeToHHMM = (time) => {
    const [timePart, modifier] = time.split(" "); // "09:52" , "AM"
    let [hours, minutes] = timePart.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours) + 12);
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  };
  // data post
  const handleCreateSpanding = async () => {
    const playload = {
      category: category?.title,
      amount: amount,
      accountId: accountNumber,
      date: new Date(date).toISOString(),
      time: formatTimeToHHMM(time),
      name: name,
    };

    try {
      console.log("Sending payload:", playload);
      const res = await dataspendingPost(playload).unwrap();
      console.log("Success:", res);
      if (res?.success) {
        setAlertVisible(true);
        setAlertType("success");
        setAlertTittle("success");
        setAlertMessage(res?.message);
      } else {
        setAlertVisible(true);
        setAlertType("error");
        setAlertTittle("error");
        setAlertMessage(res?.message);
      }
    } catch (error) {
      console.log("Error details:", JSON.stringify(error, null, 2));
      setAlertVisible(true);
      setAlertType("error");
      setAlertTittle("Error");
      setAlertMessage(error?.data?.message);
    }
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
              Plan an spendings
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "padding" : "height"}
            className="flex-1"
          >
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
                        onChangeText={(text) => setAmount(Number(text))}
                      />
                    </View>

                    <View className="relative">
                      <Pressable onPress={() => setShowCurrency(!showCurrency)}>
                        <View className="bg-[#584C2F]  px-4 py-5 rounded-lg flex-row items-center">
                          <Text className="text-white font-Inter text-sm">
                            {currency}
                          </Text>
                        </View>
                      </Pressable>
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
                        {dataaccount?.data?.accounts &&
                          dataaccount?.data?.accounts.map((item, index) => (
                            <Pressable
                              key={index}
                              onPress={() => {
                                setAccountCarrent(item.name);
                                setShowAccountCarrent(false);
                                setAccountNumber(item.id);
                              }}
                              className="px-2 py-4 "
                            >
                              <Text
                                className={`text-sm font-Inter text-center ${
                                  currency === item.name
                                    ? "text-[#FAD885]"
                                    : "text-white"
                                }`}
                              >
                                {item.name}
                              </Text>
                            </Pressable>
                          ))}
                      </View>
                    )}
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
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>

                {/* Buttons */}
                <View className="mt-6">
                  <TouchableOpacity
                    onPress={handleCreateSpanding}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#B08A4A", "#E0B66A"]}
                      style={{ borderRadius: 8 }}
                      className="  py-4 items-center"
                    >
                      <Text className="text-white font-semibold text-base">
                        {spendingload ? "Createing" : "Create"}
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
          </KeyboardAvoidingView>

          <CustomAlert
            visible={alertVisible}
            title={alertTittle}
            message={alertMessage}
            onConfirm={() => {
              console.log("Confirmed");
              setAlertVisible(false);
            }}
            // onCancel={() => {
            //   console.log("Cancelled");
            //   setAlertVisible(false);
            // }}
            type={alertType}
            confirmText={"OK"}
            cancelText="Cancel"
          />
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default Addspending;
