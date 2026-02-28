import { useGetReportDataQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DayItem = {
  day: string;
  date: number;
  isToday: boolean;
  fullDate?: string; // We'll add this to store the full date
};

type Props = {
  visible: boolean;
  onClose: () => void;
  weekLabel: string;
  days: DayItem[];
  year: number;
  startDate: string;
  endDate: string;
};

const WeekPastdateModal = ({
  visible,
  onClose,
  weekLabel,
  days,
  year,
  startDate,
  endDate,
}: Props) => {
  const [selectedDay, setSelectedDay] = useState<DayItem | null>(null);
  const [showDayDetails, setShowDayDetails] = useState(false);

  console.log("week modal data", startDate, endDate);
  const { data: reportData, isLoading: reportLoading } = useGetReportDataQuery({
    startDate: startDate,
    endDate: endDate,
  });

  // Helper function to format date for comparison
  const formatDateForComparison = (dateString: string) => {
    return dateString.split("T")[0]; // Returns YYYY-MM-DD
  };

  // Helper function to get full date string from day
  const getFullDateFromDay = (day: DayItem) => {
    // You need to implement this based on your date logic
    // This is a placeholder - adjust according to your date handling
    const month = new Date(startDate).getMonth();
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day.date).padStart(2, "0")}`;
  };

  // Get data for selected day
  const getDayData = (day: DayItem) => {
    if (!reportData?.data) return { earning: 0, spending: 0, transactions: [] };

    const fullDate = getFullDateFromDay(day);

    const dayEarning = reportData.data.earning
      .filter((e) => formatDateForComparison(e.date) === fullDate)
      .reduce((sum, e) => sum + e.amount, 0);

    const daySpending = reportData.data.spending
      .filter((s) => formatDateForComparison(s.date) === fullDate)
      .reduce((sum, s) => sum + s.amount, 0);

    const dayTransactions = [
      ...reportData.data.earning
        .filter((e) => formatDateForComparison(e.date) === fullDate)
        .map((e) => ({ ...e, type: "earning" })),
      ...reportData.data.spending
        .filter((s) => formatDateForComparison(s.date) === fullDate)
        .map((s) => ({ ...s, type: "spending" })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      earning: dayEarning,
      spending: daySpending,
      transactions: dayTransactions,
    };
  };

  const handleDayPress = (day: DayItem) => {
    setSelectedDay(day);
    setShowDayDetails(true);
  };

  const handleAddPress = () => {
    // Navigate to datecategory with the selected date
    if (selectedDay) {
      const fullDate = getFullDateFromDay(selectedDay);
      router.push({
        pathname: "/datecatagory",
        params: { date: fullDate },
      });
    }
    setShowDayDetails(false);
    onClose();
  };

  const handleBackToDays = () => {
    setShowDayDetails(false);
    setSelectedDay(null);
  };

  if (reportLoading) {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center"
          onPress={onClose}
        >
          <View className="bg-[#0B0B0B] w-[90%] rounded-3xl p-5 items-center">
            <ActivityIndicator size="large" color="#FAD885" />
            <Text className="text-white mt-4">Loading...</Text>
          </View>
        </Pressable>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable
        className="flex-1 bg-black/60 justify-center items-center"
        onPress={onClose}
      >
        <Pressable className="bg-[#0B0B0B] w-[90%] rounded-3xl p-5">
          {!showDayDetails ? (
            // Week days view
            <>
              <Text className="text-white text-center font-Inter font-semibold text-lg mb-4">
                {weekLabel}
              </Text>

              <View className="flex-row justify-between">
                {days.map((item, index) => {
                  const dayData = getDayData(item);
                  const hasData = dayData.earning > 0 || dayData.spending > 0;

                  return (
                    <TouchableOpacity
                      onPress={() => handleDayPress(item)}
                      key={index}
                      className="items-center"
                    >
                      <LinearGradient
                        colors={
                          item.isToday
                            ? ["#FAD885", "#C49F59", "#8A622A"]
                            : hasData
                              ? ["#4CAF50", "#45a049", "#2e7d32"] // Green gradient for days with data
                              : ["#FAD885", "#C49F59", "#8A622A"]
                        }
                        style={{
                          width: responsive.scale(42),
                          height: responsive.scale(52),
                          borderRadius: 10,
                        }}
                        className="rounded-xl justify-center items-center"
                      >
                        <Text className="text-xs text-white">{item.day}</Text>
                        <Text className="text-lg font-bold text-white">
                          {item.date}
                        </Text>
                      </LinearGradient>
                      {hasData && (
                        <View className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            // Selected day details view
            <>
              <TouchableOpacity onPress={handleBackToDays} className="mb-4">
                <Text className="text-[#FAD885]">← Back to week</Text>
              </TouchableOpacity>

              <Text className="text-white text-center font-Inter font-semibold text-lg mb-2">
                {selectedDay?.day}, {selectedDay?.date}{" "}
                {new Date(startDate).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {year}
              </Text>

              {selectedDay && (
                <>
                  {/* Summary Cards */}
                  <View className="flex-row justify-between mb-6">
                    <View className="bg-green-900/30 p-4 rounded-xl flex-1 mr-2">
                      <Text className="text-green-400 text-sm">Earning</Text>
                      <Text className="text-white text-xl font-bold">
                        ${getDayData(selectedDay).earning.toLocaleString()}
                      </Text>
                    </View>
                    <View className="bg-red-900/30 p-4 rounded-xl flex-1 ml-2">
                      <Text className="text-red-400 text-sm">Spending</Text>
                      <Text className="text-white text-xl font-bold">
                        ${getDayData(selectedDay).spending.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Transactions List */}
                  {getDayData(selectedDay).transactions.length > 0 ? (
                    <ScrollView className="max-h-60 mb-4">
                      {getDayData(selectedDay).transactions.map(
                        (transaction, index) => (
                          <View
                            key={index}
                            className="flex-row justify-between items-center py-3 border-b border-gray-800"
                          >
                            <View>
                              <Text className="text-white">
                                {transaction.type === "earning"
                                  ? "💰 Earning"
                                  : "💸 Spending"}
                              </Text>
                              <Text className="text-gray-400 text-xs">
                                {new Date(
                                  transaction.date,
                                ).toLocaleTimeString()}
                              </Text>
                            </View>
                            <Text
                              className={
                                transaction.type === "earning"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {transaction.type === "earning" ? "+" : "-"}$
                              {transaction.amount.toLocaleString()}
                            </Text>
                          </View>
                        ),
                      )}
                    </ScrollView>
                  ) : (
                    <View className="items-center py-8 mb-4">
                      <Text className="text-gray-400">
                        No transactions for this day
                      </Text>
                    </View>
                  )}

                  {/* Add Button */}
                  <TouchableOpacity onPress={handleAddPress} className="  mt-2">
                    <LinearGradient
                      colors={["#FAD885", "#C49F59", "#8A622A"]}
                      style={{ borderRadius: 50 }}
                      className="py-2 px-3 "
                    >
                      <Text className="text-[#fff] text-center font-semibold text-lg">
                        + Add
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default WeekPastdateModal;
