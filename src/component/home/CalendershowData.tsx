import { BudgetImg } from "@/assets/budget/budgetimg";
import { MonthImg } from "@/assets/month/month";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetTodayinsertedItemsQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import { RootState } from "@/src/redux/store";
import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import WeekPastdateModal from "./WeekPastdateModal";
import ReportRangeModal from "./report/ReportRangeModal";
// -------------------currency--------------
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

// ------------------catagory imge--------------
const categorydata = [
  { title: "Salary", image: BudgetImg.dollar },
  { title: "Investment", image: BudgetImg.investment },
  { title: "Rewards", image: BudgetImg.rank },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Business", image: BudgetImg.business },
  { title: "Other", image: BudgetImg.Other },
  { title: "Supermarket", image: BudgetImg.supermarket },
  { title: "Clothing", image: BudgetImg.clothing },
  { title: "House", image: BudgetImg.house },
  { title: "Entertainment", image: BudgetImg.entertainment },
  { title: "Transport", image: BudgetImg.Transport },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Travel", image: BudgetImg.Travel },
  { title: "Education", image: BudgetImg.Education },
  { title: "Food", image: BudgetImg.Food },
  { title: "Work", image: BudgetImg.Work },
  { title: "Electronics", image: BudgetImg.Electronics },
  { title: "Sport", image: BudgetImg.Sport },
  { title: "Restaurant", image: BudgetImg.Restaurant },
  { title: "Health", image: BudgetImg.Health },
  { title: "Communications", image: BudgetImg.Communications },
];

/* ---------------- CONSTANTS ---------------- */

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

/* ---------------- HELPERS ---------------- */

const getWeekDays = (
  year: number,
  month: number,
  start: number,
  end: number,
) => {
  const days = [];
  for (let d = start; d <= end; d++) {
    const date = new Date(year, month, d);
    days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: d,
      isToday: date.toDateString() === new Date().toDateString(),
    });
  }
  return days;
};

const isCurrentWeek = (
  month: number,
  year: number,
  start: number,
  end: number,
) => {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() >= start &&
    today.getDate() <= end
  );
};

const getWeekRanges = (month: number, year: number) => {
  const ranges = [];
  const totalDays = new Date(year, month + 1, 0).getDate();
  let start = 1;

  while (start <= totalDays) {
    const end = Math.min(start + 6, totalDays);
    ranges.push({
      start,
      end,
      isCurrent: isCurrentWeek(month, year, start, end),
      days: getWeekDays(year, month, start, end),
    });
    start = end + 1;
  }

  return ranges;
};

const getMonthData = (month: number, year: number) => ({
  name: monthNames[month],
  year,
  image: monthImages[month],
  weeks: getWeekRanges(month, year).map((w) => ({
    label: `${monthNames[month]} ${String(w.start).padStart(2, "0")}-${String(w.end).padStart(2, "0")}`,
    ...w,
  })),
});

/* ---------------- COMPONENT ---------------- */

const CalendershowData = () => {
  const { currentMonth, currentYear } = useSelector(
    (state: RootState) => state.calendar,
  );
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const getCurrentMonth = () => new Date().getMonth() + 1;
  const getCurrentYear = () => new Date().getFullYear();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [reportShow, setReportShow] = useState(false);
  const [startDate, setStartDate] = useState<string | null>("");
  const [endDate, setEndDate] = useState<string | null>("");
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const { data: dailydata, isLoading } =
    useGetTodayinsertedItemsQuery(getCurrentDate());

  console.log(dailydata);

  const monthData = getMonthData(currentMonth, currentYear);
  console.log("Report Show Clicked", currentMonth + 1, currentYear);
  const handleReportShow = (level: string) => {
    const [month, dateRange] = level.split(" ");
    const [startDay, endDay] = dateRange.split("-");
    const year = monthData.year;
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

    const monthIndex = monthNames.indexOf(month);
    const startDate = new Date(
      Date.UTC(year, monthIndex, parseInt(startDay), 0, 0, 0, 0),
    );
    const endDate = new Date(
      Date.UTC(year, monthIndex, parseInt(endDay), 23, 59, 59, 999),
    );
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    setEndDate(end);
    setStartDate(start);
    setReportShow(true);

    console.log(start, end);
  };

  const handleReportData = (week: any, level: string) => {
    console.log("Report Show Clicked", monthData.year, monthData.name, level);
    const [month, dateRange] = level.split(" ");
    const [startDay, endDay] = dateRange.split("-");
    const year = monthData.year;
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

    const monthIndex = monthNames.indexOf(month);
    const startDate = new Date(
      Date.UTC(year, monthIndex, parseInt(startDay), 0, 0, 0, 0),
    );
    const endDate = new Date(
      Date.UTC(year, monthIndex, parseInt(endDay), 23, 59, 59, 999),
    );
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    setEndDate(end);
    setStartDate(start);
    setSelectedWeek(week);
    setModalVisible(true);

    console.log(start, end);
  };

  return (
    <View>
      {/* Header   */}
      <View style={{ height: responsive.verticalScale(180) }}>
        <Image source={monthData.image} className="w-full h-full" />
        <View className="absolute inset-0 items-center">
          <View className="bg-black mt-4 px-5 py-1 rounded-full">
            <Text className="text-white text-lg font-Inter font-semibold">
              {monthData.name} {monthData.year}
            </Text>
          </View>
        </View>
      </View>

      {/* Weeks */}
      <View className="items-center my-[6%]">
        {monthData.weeks.map((week, index) => (
          <View key={index}>
            {week.isCurrent ? (
              <TouchableOpacity
                onPress={() => {
                  handleReportData(week, week.label);
                }}
              >
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  style={{ borderRadius: 50 }}
                  className="py-2 px-3 rounded-full mt-[5%]"
                >
                  <Text className="text-center text-white font-medium">
                    {week.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleReportShow(week.label)}
                className="mb-[2%]"
              >
                <Text className="text-white mt-3 opacity-40">{week.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* today value */}

      {getCurrentMonth() === currentMonth + 1 &&
        getCurrentYear() === currentYear &&
        (dailydata?.data?.earning?.length > 0 ||
          dailydata?.data?.spending?.length > 0) && (
          <View className="px-[5%] mb-3">
            <Text className="font-Inter font-semibold text-lg text-white mb-2">
              {new Date(dailydata?.data?.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </Text>

            <View className="flex-col gap-[2%] space-y-2">
              {/* Display Earnings */}
              {dailydata?.data?.earning?.map((item, index) => {
                const categoryImage =
                  categorydata.find((cat) => cat.title === item.category)
                    ?.image || BudgetImg.Other;

                return (
                  <View
                    key={`earning-${index}`}
                    className="flex-row items-center justify-between bg-[#2A2A2A] p-3 rounded-lg"
                  >
                    <View className="flex-row items-center flex-1">
                      <Image source={categoryImage} className="w-8 h-8 mr-3" />
                      <View>
                        <Text className="text-white font-Inter text-base">
                          {item.name}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {item.category}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-green-500 font-Inter font-semibold">
                      + {getCurrencySymbol(getProfileData?.data?.currency)}
                      {item.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}

              {/* Display Spendings */}
              {dailydata?.data?.spending?.map((item, index) => {
                const categoryImage =
                  categorydata.find((cat) => cat.title === item.category)
                    ?.image || BudgetImg.Other;

                return (
                  <View
                    key={`spending-${index}`}
                    className="flex-row items-center justify-between bg-[#2A2A2A] p-3 rounded-lg"
                  >
                    <View className="flex-row items-center flex-1">
                      <Image source={categoryImage} className="w-8 h-8 mr-3" />
                      <View>
                        <Text className="text-white font-Inter text-base">
                          {item.name}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          {item.category}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-red-500 font-Inter font-semibold">
                      - {getCurrencySymbol(getProfileData?.data?.currency)}
                      {item.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

      {/* Modal */}
      {selectedWeek && (
        <WeekPastdateModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          weekLabel={selectedWeek.label}
          days={selectedWeek.days}
          year={monthData.year}
          startDate={startDate ? new Date(startDate) : new Date()}
          endDate={endDate ? new Date(endDate) : new Date()}
        />
      )}

      {/* the report */}
      <ReportRangeModal
        visible={reportShow}
        onClose={() => setReportShow(false)}
        startDate={startDate ? new Date(startDate) : new Date()}
        endDate={endDate ? new Date(endDate) : new Date()}
      />
    </View>
  );
};

export default CalendershowData;
