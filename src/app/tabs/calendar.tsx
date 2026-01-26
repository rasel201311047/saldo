import { earningicon, spendingicon } from "@/assets/icons";
import Background1 from "@/src/component/background/Background1";
import ButtonSection from "@/src/component/home/ButtonSection";
import CalendershowData from "@/src/component/home/CalendershowData";
import Nav from "@/src/component/home/Nav";
import {
  nextMonth,
  previousMonth,
  resetToCurrent,
} from "@/src/redux/slices/calendarSlice";
import { RootState } from "@/src/redux/store";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

const Calendar = () => {
  const dispatch = useDispatch();
  const { currentMonth, currentYear } = useSelector(
    (state: RootState) => state.calendar,
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
      <Nav />
      <ButtonSection />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-2 flex-row justify-between items-center"></View>
        <CalendershowData />

        <View className="px-4 mb-6">
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
                <SvgXml xml={earningicon} width={30} height={30} />
              </View>
              <View>
                <Text className="text-[#fff] text-lg font-Inter">Earnings</Text>
                <Text className="text-[#fff] text-lg font-Inter font-medium">
                  $0.00
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
                <SvgXml xml={spendingicon} width={30} height={30} />
              </View>
              <View>
                <Text className="text-[#fff] text-lg font-Inter">
                  Spendings
                </Text>
                <Text className="text-[#fff] text-lg font-Inter font-medium">
                  $0.00
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
      </ScrollView>
    </Background1>
  );
};

export default Calendar;
