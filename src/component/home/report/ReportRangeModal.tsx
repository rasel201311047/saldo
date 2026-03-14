import { BudgetImg } from "@/assets/budget/budgetimg";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetReportDataQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
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

interface TransactionItem {
  id?: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "earning" | "spending";
}

interface GroupedTransactions {
  title: string;
  data: TransactionItem[];
  totalEarning: number;
  totalSpending: number;
}

interface TransformedData {
  date: string;
  earning: number;
  expense: number;
}

// Currency symbols mapping
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

// Category images mapping
const categoryImages: Record<string, any> = {
  Salary: BudgetImg.dollar,
  Investment: BudgetImg.investment,
  Rewards: BudgetImg.rank,
  Gifts: BudgetImg.Gifts,
  Business: BudgetImg.business,
  Other: BudgetImg.Other,
  Supermarket: BudgetImg.supermarket,
  Clothing: BudgetImg.clothing,
  House: BudgetImg.house,
  Entertainment: BudgetImg.entertainment,
  Transport: BudgetImg.Transport,
  Travel: BudgetImg.Travel,
  Education: BudgetImg.Education,
  Food: BudgetImg.Food,
  Work: BudgetImg.Work,
  Electronics: BudgetImg.Electronics,
  Sport: BudgetImg.Sport,
  Restaurant: BudgetImg.Restaurant,
  Health: BudgetImg.Health,
  Communications: BudgetImg.Communications,
};

const ReportRangeModal: React.FC<Props> = ({
  visible,
  onClose,
  startDate,
  endDate,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const formattedStartDate = startDate.toISOString().split("T")[0];
  const formattedEndDate = endDate.toISOString().split("T")[0];

  const { data: reportData, isLoading: reportLoading } = useGetReportDataQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });

  const { data: getProfileData } = useGetMyProfileQuery();

  // Transform API data for graph
  const transformDataForGraph = (): TransformedData[] => {
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

  const graphData = transformDataForGraph();

  // Process all individual transactions
  const allTransactions: TransactionItem[] = [];

  // Add earning transactions
  reportData?.data?.earning?.forEach((item: any, index: number) => {
    allTransactions.push({
      id: `earning-${index}-${item.date}-${Math.random()}`,
      name: item.name,
      category: item.category,
      amount: item.amount,
      date: item.date,
      type: "earning",
    });
  });

  // Add spending transactions
  reportData?.data?.spending?.forEach((item: any, index: number) => {
    allTransactions.push({
      id: `spending-${index}-${item.date}-${Math.random()}`,
      name: item.name,
      category: item.category,
      amount: item.amount,
      date: item.date,
      type: "spending",
    });
  });

  // Group transactions by date
  const groupTransactionsByDate = (): GroupedTransactions[] => {
    const grouped = new Map<string, TransactionItem[]>();

    // Sort transactions by date (newest first)
    const sortedTransactions = [...allTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    sortedTransactions.forEach((transaction) => {
      const dateKey = new Date(transaction.date).toISOString().split("T")[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(transaction);
    });

    // Convert to array and calculate daily totals
    return Array.from(grouped.entries()).map(([date, transactions]) => {
      const totalEarning = transactions
        .filter((t) => t.type === "earning")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalSpending = transactions
        .filter((t) => t.type === "spending")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        title: date,
        data: transactions,
        totalEarning,
        totalSpending,
      };
    });
  };

  const groupedTransactions = groupTransactionsByDate();

  // Calculate totals
  const totalEarnings = allTransactions
    .filter((t) => t.type === "earning")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.type === "spending")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalEarnings - totalExpenses;

  // Toggle section expansion
  const toggleSection = (date: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedSections(newExpanded);
  };

  // Toggle all sections - Fixed logic
  const toggleAllSections = () => {
    if (expandedSections.size === groupedTransactions.length) {
      // If all are expanded, collapse all (show only headers)
      setExpandedSections(new Set());
    } else {
      // If some or none are expanded, expand all (show all transactions)
      setExpandedSections(new Set(groupedTransactions.map((g) => g.title)));
    }
  };

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
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    const currency = getCurrencySymbol(getProfileData?.data?.currency);
    const formattedAmount = amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency} ${formattedAmount}`;
  };

  const getCategoryImage = (category: string) => {
    return categoryImages[category] || BudgetImg.Other;
  };

  const renderTransactionItem = (transaction: TransactionItem) => (
    <LinearGradient
      colors={
        transaction.type === "earning"
          ? ["rgba(16, 185, 129, 0.1)", "rgba(5, 150, 105, 0.1)"]
          : ["rgba(239, 68, 68, 0.1)", "rgba(220, 38, 38, 0.1)"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ borderRadius: 12 }}
      className="p-3 mb-2 ml-4 border border-gray-600/20"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-gray-700/50 items-center justify-center mr-3">
          <Image
            source={getCategoryImage(transaction.category)}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            {transaction.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-gray-700/50 px-2 py-0.5 rounded-full">
              <Text className="text-gray-300 text-xs">
                {transaction.category}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs ml-2">
              {formatDateTime(transaction.date)}
            </Text>
          </View>
        </View>

        <Text
          className={`font-bold text-lg ${transaction.type === "earning" ? "text-green-400" : "text-red-400"}`}
        >
          {transaction.type === "earning" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </LinearGradient>
  );

  const renderSection = (item: GroupedTransactions) => {
    const isExpanded = expandedSections.has(item.title);
    const date = new Date(item.title);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    return (
      <View key={item.title} className="mb-4">
        <TouchableOpacity
          onPress={() => toggleSection(item.title)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#352F44", "#2A2438"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16 }}
            className="p-4 border border-gray-600/20"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-purple-600/20 items-center justify-center mr-3">
                  <Ionicons
                    name={isExpanded ? "calendar" : "calendar-outline"}
                    size={20}
                    color="#8B5CF6"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-white font-bold text-base">
                    {formatDate(item.title)}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {dayName} • {item.data.length} transactions
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mr-2">
                <View className="items-end mr-4">
                  <Text className="text-green-400 font-semibold text-sm">
                    +{formatCurrency(item.totalEarning)}
                  </Text>
                  <Text className="text-gray-400 text-xs">Earned</Text>
                </View>
                <View className="items-end mr-2">
                  <Text className="text-red-400 font-semibold text-sm">
                    -{formatCurrency(item.totalSpending)}
                  </Text>
                  <Text className="text-gray-400 text-xs">Spent</Text>
                </View>
              </View>

              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            }}
            className="mt-2"
          >
            {item.data.map((transaction) => (
              <View key={transaction.id}>
                {renderTransactionItem(transaction)}
              </View>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  // Determine button text based on current state
  const getToggleButtonText = () => {
    if (groupedTransactions.length === 0) return "";
    return expandedSections.size === groupedTransactions.length
      ? "Collapse All"
      : "Expand All";
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
              maxHeight: height * 0.9,
            }}
          >
            {/* Header */}
            <View className="px-6 pb-4 border-b border-gray-600/30">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-white text-2xl font-bold">
                    Financial Report
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    {allTransactions.length} transactions found
                  </Text>
                </View>
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
                      <Text className="text-white/80 text-sm">
                        Total Earnings
                      </Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(totalEarnings)}
                      </Text>
                      <Text className="text-white/60 text-xs mt-1">
                        {reportData?.data?.earning?.length || 0} transactions
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
                      <Text className="text-white/80 text-sm">
                        Total Expenses
                      </Text>
                      <Text className="text-white text-xl font-bold">
                        {formatCurrency(totalExpenses)}
                      </Text>
                      <Text className="text-white/60 text-xs mt-1">
                        {reportData?.data?.spending?.length || 0} transactions
                      </Text>
                    </LinearGradient>
                  </View>
                </View>

                {/* Balance Card */}
                <LinearGradient
                  colors={
                    balance >= 0
                      ? ["#8B5CF6", "#6D28D9"]
                      : ["#F59E0B", "#D97706"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 16 }}
                  className="p-4 mt-4"
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-white/80 text-sm">Net Balance</Text>
                      <Text className="text-white text-2xl font-bold">
                        {formatCurrency(Math.abs(balance))}
                      </Text>
                    </View>
                    <View className="bg-white/20 px-4 py-2 rounded-full">
                      <Text className="text-white font-semibold">
                        {balance >= 0 ? "Surplus" : "Deficit"}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Graph */}
                <View className="mt-6">
                  <Text className="text-white text-lg font-bold mb-4">
                    Daily Overview
                  </Text>
                  <ReportGraph
                    startDate={startDate}
                    endDate={endDate}
                    data={graphData}
                  />
                </View>

                {/* Transactions List */}
                <View className="mt-6 mb-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-lg font-bold">
                      Transaction Details
                    </Text>
                    {groupedTransactions.length > 0 && (
                      <TouchableOpacity
                        onPress={toggleAllSections}
                        activeOpacity={0.7}
                      >
                        <View className="bg-purple-600/20 px-3 py-1 rounded-full">
                          <Text className="text-purple-400 text-sm font-medium">
                            {getToggleButtonText()}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>

                  {groupedTransactions.length > 0 ? (
                    groupedTransactions.map((section) => renderSection(section))
                  ) : (
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
