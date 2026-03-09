import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetBorrowedShowingQuery } from "@/src/redux/api/Page/Goals/goalsApi";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

const BorrowedSec = () => {
  const { data: getBorrowedShowing, isLoading: isBorrowedShowingLoading } =
    useGetBorrowedShowingQuery();
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  // demo values (replace with redux later)
  console.log("Borrowed Data:", getBorrowedShowing?.data?.borrowed);
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
            {getCurrencySymbol(getProfileData?.data?.currency)}
            {getBorrowedShowing?.data?.totalDebtLeft}
          </Text>
        </View>

        <View className="bg-[#242333] w-[48%] rounded-2xl p-4">
          <Text className="text-gray-400 text-xs font-Inter mb-1">
            Fulfilled Goals
          </Text>
          <Text className="text-white text-lg font-Inter font-semibold">
            {getBorrowedShowing?.data?.paidOff}
          </Text>
        </View>
      </View>

      {/* ===== GOAL CARD ===== */}
      {getBorrowedShowing?.data?.borrowed &&
        getBorrowedShowing?.data?.borrowed.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                params: { id: item?.id, type: "borrowed" },
                pathname: "/goalsedit",
              })
            }
            className="bg-[#242333] rounded-2xl p-4 mb-6"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center gap-3">
                <View className="bg-white w-9 h-9 rounded-full items-center justify-center">
                  <FontAwesome5 name={item?.icon} size={18} color="#000" />
                </View>
                <View>
                  <Text className="text-white text-base font-Inter">
                    {item?.name}
                  </Text>
                  <Text className="text-gray-400 text-xs font-Inter">
                    {item?.notes?.split(" ").slice(0, 8).join(" ")}
                    {item?.notes?.split(" ").length > 8 && "..."}
                  </Text>
                </View>
              </View>

              <Text className="text-white text-lg font-Inter font-semibold">
                {getCurrencySymbol(getProfileData?.data?.currency)}
                {item?.amount}
              </Text>
            </View>

            {/* Progress Values */}
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 text-xs font-Inter">
                {getCurrencySymbol(getProfileData?.data?.currency)}
                {item?.accumulatedAmount.toFixed(2)}
              </Text>
              <Text className="text-gray-400 text-xs font-Inter">
                {item?.paymentPercentage.toFixed(1)}%
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-[#2B2A3A] rounded-full overflow-hidden mb-2">
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{
                  height: "100%",
                  width: `${item?.paymentPercentage}%`,
                }}
              />
            </View>

            {/* Left Amount */}
            <View className="flex-row justify-end">
              <Text className="text-gray-400 text-xs font-Inter">
                Left:{" "}
                <Text className="text-white font-Inter">
                  {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
                  {item?.amountLeft}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      <View className="h-96 w-full" />
    </ScrollView>
  );
};

export default BorrowedSec;
