import { earningicon, spendingicon } from "@/assets/icons";
import Background1 from "@/src/component/background/Background1";
import AddModalHome from "@/src/component/home/AddModalHome";
import ButtonSection from "@/src/component/home/ButtonSection";
import CalendershowData from "@/src/component/home/CalendershowData";
import Nav from "@/src/component/home/Nav";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetEarningSpendingQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import {
  nextMonth,
  previousMonth,
  resetToCurrent,
} from "@/src/redux/slices/calendarSlice";
import { RootState } from "@/src/redux/store";
import responsive from "@/src/utils/responsive";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";

const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

const Calendar = () => {
  const [addPlus, setAddPlus] = useState(false);
  const dispatch = useDispatch();

  const { currentMonth, currentYear } = useSelector(
    (state: RootState) => state.calendar,
  );
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const { data: currentBalance, isLoading: isCurrentBalanceLoading } =
    useGetEarningSpendingQuery({ data: `${currentYear}-${currentMonth + 1}` });
  console.log(
    "currentBalance",
    currentBalance?.data?.totalIncome,
    currentBalance?.data?.totalSpending,
  );
  const handleNextMonth = () => {
    dispatch(nextMonth());
  };

  const handlePreviousMonth = () => {
    dispatch(previousMonth());
  };

  const handleReset = () => {
    dispatch(resetToCurrent());
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      currentMonth === today.getMonth() && currentYear === today.getFullYear()
    );
  };

  return (
    <Background1>
      <View className="flex-1">
        <Nav />
        <ButtonSection />

        <ScrollView className="flex-1">
          <CalendershowData />

          <View className="px-4 ">
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.8, y: 1 }}
              style={{
                padding: 20,
                borderRadius: 18,
              }}
            >
              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={handlePreviousMonth}>
                  <Entypo name="chevron-left" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Earnings Section */}
                <View>
                  <SvgXml xml={earningicon} width={responsive.scale(24)} />
                </View>
                <View>
                  <Text className="text-[#fff] text-base font-Inter">
                    Earnings
                  </Text>
                  <Text className="text-[#fff] text-base font-Inter font-medium">
                    {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
                    {currentBalance?.data?.totalIncome || "0.00"}
                  </Text>
                </View>

                {/* Month Display */}
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  style={{ borderRadius: 50 }}
                  className="py-2 px-4 mx-2"
                >
                  <Text className="text-center font-Inter font-semibold text-[#fff]">
                    {monthNamesShort[currentMonth]}
                  </Text>
                </LinearGradient>

                {/* Spendings Section */}
                <View>
                  <SvgXml xml={spendingicon} width={responsive.scale(24)} />
                </View>
                <View>
                  <Text className="text-[#fff] text-base font-Inter">
                    Spendings
                  </Text>
                  <Text className="text-[#fff] text-base font-Inter font-medium">
                    {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
                    {currentBalance?.data?.totalSpending || "0.00"}
                  </Text>
                </View>

                {/* Next Month Button */}
                <TouchableOpacity
                  onPress={handleNextMonth}
                  className=" rotate-180"
                >
                  <Entypo name="chevron-left" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
          <View className="h-56" />
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            Vibration.vibrate(100);
            setAddPlus(true);
          }}
          className=" absolute bottom-28 right-3"
        >
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            style={{ borderRadius: 10, padding: 8 }}
            className=" "
          >
            <Entypo name="plus" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <AddModalHome open={addPlus} close={() => setAddPlus(false)} />
      </View>
    </Background1>
  );
};

export default Calendar;
