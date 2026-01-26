import { MonthImg } from "@/assets/month/month";
import { RootState } from "@/src/redux/store";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthImages = [
  MonthImg.january,
  MonthImg.february,
  MonthImg.march,
  MonthImg.april,
  MonthImg.may,
  MonthImg.june,
  MonthImg.july,
  MonthImg.august,
  MonthImg.september,
  MonthImg.october,
  MonthImg.november,
  MonthImg.december,
];

// Function to generate week ranges for any month/year
const getWeekRanges = (month: number, year: number) => {
  const ranges = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  let start = 1;

  while (start <= totalDays) {
    let end = Math.min(start + 6, totalDays);
    const endDate = new Date(year, month, end);
    const dayOfWeek = endDate.getDay();
    if (dayOfWeek !== 0 && end < totalDays) {
      end = Math.min(end + (6 - dayOfWeek), totalDays);
    }

    ranges.push({
      start,
      end,
      isCurrentWeek: isCurrentWeek(month, year, start, end),
    });

    start = end + 1;
  }

  return ranges;
};

const isCurrentWeek = (
  month: number,
  year: number,
  start: number,
  end: number,
) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  if (year === currentYear && month === currentMonth) {
    return currentDate >= start && currentDate <= end;
  }
  return false;
};

const getMonthData = (month: number, year: number) => {
  const weekRanges = getWeekRanges(month, year);

  return {
    name: monthNames[month],
    year,
    image: monthImages[month],
    weeks: weekRanges.map((range) => ({
      label: `${monthNames[month]} ${range.start}-${range.end}`,
      isCurrent: range.isCurrentWeek,
    })),
  };
};

const CalendershowData = () => {
  const { currentMonth, currentYear } = useSelector(
    (state: RootState) => state.calendar,
  );
  const monthData = getMonthData(currentMonth, currentYear);

  return (
    <View>
      <View className="w-full">
        <Image source={monthData.image} className="w-full" resizeMode="cover" />
        <View className="absolute w-full inset-0 items-center">
          <View className="bg-[#010101] mt-[3%] px-[4%] py-1 rounded-full">
            <Text className="font-Inter font-semibold text-lg text-[#fff]">
              {monthData.name} {monthData.year}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-col gap-2 justify-center items-center my-[3%]">
        {monthData.weeks.map((week, index) => (
          <TouchableOpacity key={index}>
            {week.isCurrent ? (
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{ borderRadius: 50 }}
                className="w-[60%] py-2 px-3 rounded-lg"
              >
                <Text className="text-center font-Inter font-medium text-[#fff]">
                  {week.label}
                </Text>
              </LinearGradient>
            ) : (
              <View className="text-center font-Inter font-medium text-[#fff]">
                <Text className="text-center font-Inter font-medium text-[#fff]">
                  {week.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CalendershowData;
