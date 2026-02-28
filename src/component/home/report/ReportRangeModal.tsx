import { useGetReportDataQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReportGraph from "./ReportGraph";

const { width, height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  startDate: Date;
  endDate: Date;
}

interface TransformedData {
  date: string;
  earning: number;
  expense: number;
}

const ReportRangeModal: React.FC<Props> = ({
  visible,
  onClose,
  startDate,
  endDate,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const formattedStartDate = startDate.toISOString().split("T")[0];
  const formattedEndDate = endDate.toISOString().split("T")[0];
  console.log("dates", startDate, endDate);

  const { data: reportData, isLoading: reportLoading } = useGetReportDataQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });

  // Transform API data to match the component structure
  const transformData = (): TransformedData[] => {
    if (!reportData?.data) return [];

    const dateMap = new Map<string, { earning: number; expense: number }>();

    // Add earnings
    reportData.data.earning?.forEach((item: any) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      const existing = dateMap.get(date) || { earning: 0, expense: 0 };
      dateMap.set(date, {
        ...existing,
        earning: existing.earning + item.amount,
      });
    });

    // Add spending
    reportData.data.spending?.forEach((item: any) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      const existing = dateMap.get(date) || { earning: 0, expense: 0 };
      dateMap.set(date, {
        ...existing,
        expense: existing.expense + item.amount,
      });
    });

    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, values]) => ({
        date,
        earning: values.earning,
        expense: values.expense,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const transformedData = transformData();

  // Calculate totals
  const totalEarnings = transformedData.reduce(
    (sum, item) => sum + item.earning,
    0,
  );
  const totalExpenses = transformedData.reduce(
    (sum, item) => sum + item.expense,
    0,
  );
  const balance = totalEarnings - totalExpenses;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: height,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: fadeAnim,
        }}
      >
        <Pressable onPress={onClose} className="absolute inset-0" />

        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <LinearGradient
            colors={["#2A2438", "#352F44"]}
            style={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingTop: 20,
              paddingBottom: 30,
              maxHeight: height * 0.85,
            }}
          >
            {/* Header */}
            <View className="px-6 pb-4 border-b border-gray-600/30">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-2xl font-bold">
                  Financial Report
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 rounded-full bg-gray-600/30 items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Date Range */}
              <View className="flex-row items-center">
                <View className="bg-purple-600/20 px-4 py-2 rounded-full flex-row items-center">
                  <Ionicons name="calendar" size={16} color="#8B5CF6" />
                  <Text className="text-purple-400 ml-2 font-medium">
                    {startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>

            {/* Content */}
            {reportLoading ? (
              <View className="py-20 items-center">
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text className="text-gray-400 mt-4">
                  Loading report data...
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-6 pt-4"
              >
                {/* Summary Cards */}
                <View className="flex-row justify-between mt-6">
                  <View className="flex-1 mr-2">
                    <LinearGradient
                      colors={["#10B981", "#059669"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="rounded-xl p-4"
                      style={{ borderRadius: 16 }}
                    >
                      <Text className="text-white/80 text-sm">Earnings</Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(totalEarnings)}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View className="flex-1 mx-2">
                    <LinearGradient
                      colors={["#EF4444", "#DC2626"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 16 }}
                      className="rounded-xl p-4"
                    >
                      <Text className="text-white/80 text-sm">Expenses</Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(totalExpenses)}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>

                {/* Graph */}
                <ReportGraph
                  startDate={startDate}
                  endDate={endDate}
                  data={transformedData}
                />

                {/* Transactions List */}
                <View className="mt-6">
                  <Text className="text-white text-lg font-bold mb-4">
                    Daily Breakdown
                  </Text>

                  {transformedData.map((item, index) => (
                    <Animated.View
                      key={item.date}
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      <LinearGradient
                        colors={["#352F44", "#2A2438"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 16 }}
                        className="rounded-xl p-4 mb-3 border border-gray-600/20"
                      >
                        <View className="flex-row justify-between items-center">
                          <View>
                            <Text className="text-white font-medium">
                              {formatDate(item.date)}
                            </Text>
                            <Text className="text-gray-400 text-xs mt-1">
                              {new Date(item.date).toLocaleDateString("en-US", {
                                weekday: "long",
                              })}
                            </Text>
                          </View>

                          <View className="flex-row">
                            <View className="items-end mr-4">
                              <Text className="text-green-400 font-semibold">
                                +{formatCurrency(item.earning)}
                              </Text>
                              <Text className="text-gray-400 text-xs">
                                Earned
                              </Text>
                            </View>
                            <View className="items-end">
                              <Text className="text-red-400 font-semibold">
                                -{formatCurrency(item.expense)}
                              </Text>
                              <Text className="text-gray-400 text-xs">
                                Spent
                              </Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  ))}

                  {transformedData.length === 0 && (
                    <View className="py-10 items-center">
                      <Ionicons
                        name="document-text-outline"
                        size={48}
                        color="#4B5563"
                      />
                      <Text className="text-gray-400 text-center mt-4">
                        No transactions found for this period
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ReportRangeModal;
