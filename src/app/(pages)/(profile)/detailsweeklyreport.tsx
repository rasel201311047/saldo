import GradientBackground from "@/src/component/background/GradientBackground";
import {
  useGetMonthlyReportQuery,
  useGetWeeklyReportQuery,
} from "@/src/redux/api/Page/profile/profileApi";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  const categoryLower = category?.toLowerCase() || "";

  if (categoryLower.includes("salary") || categoryLower.includes("business")) {
    return <FontAwesome5 name="dollar-sign" size={16} color="#60A5FA" />;
  } else if (
    categoryLower.includes("food") ||
    categoryLower.includes("drink")
  ) {
    return <MaterialIcons name="restaurant" size={18} color="#FB923C" />;
  } else if (
    categoryLower.includes("travel") ||
    categoryLower.includes("transport")
  ) {
    return <FontAwesome5 name="bus" size={16} color="#38BDF8" />;
  } else if (categoryLower.includes("gift")) {
    return <FontAwesome5 name="gift" size={16} color="#C084FC" />;
  } else if (categoryLower.includes("entertainment")) {
    return <MaterialIcons name="movie" size={18} color="#F472B6" />;
  } else if (categoryLower.includes("supermarket")) {
    return <MaterialIcons name="shopping-cart" size={18} color="#4ADE80" />;
  } else {
    return <MaterialIcons name="category" size={18} color="#94A3B8" />;
  }
};

// Helper function to get category background color
const getCategoryBg = (category: string) => {
  const categoryLower = category?.toLowerCase() || "";

  if (categoryLower.includes("salary") || categoryLower.includes("business")) {
    return "#1D4ED833";
  } else if (
    categoryLower.includes("food") ||
    categoryLower.includes("drink")
  ) {
    return "#F9731633";
  } else if (
    categoryLower.includes("travel") ||
    categoryLower.includes("transport")
  ) {
    return "#0EA5E933";
  } else if (categoryLower.includes("gift")) {
    return "#9333EA33";
  } else if (categoryLower.includes("entertainment")) {
    return "#EC489933";
  } else if (categoryLower.includes("supermarket")) {
    return "#22C55E33";
  } else {
    return "#47556933";
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
};

// Helper function to format amount
const formatAmount = (amount: number, type: string) => {
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === "earning" ? `+${formatted}` : `-${formatted}`;
};

// Helper function to check if a date belongs to a specific month
const isDateInMonth = (dateString: string, monthString: string) => {
  if (!monthString) return true;

  const date = new Date(dateString);
  const [year, month] = monthString.split("-").map(Number);

  return date.getFullYear() === year && date.getMonth() + 1 === month;
};

const DetailsWeeklyReport = () => {
  const params = useLocalSearchParams();
  const [active, setActive] = useState<"All" | "Earnings" | "Spendings">("All");

  console.log("===================");
  console.log(params);

  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isFetching: monthlyFetching,
  } = useGetMonthlyReportQuery(params.month, {
    skip: params.type !== "monthly",
  });

  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    isFetching: weeklyFetching,
  } = useGetWeeklyReportQuery(undefined, {
    skip: params.type !== "weekly",
  });

  const isLoading =
    (params.type === "weekly" && (weeklyLoading || weeklyFetching)) ||
    (params.type === "monthly" && (monthlyLoading || monthlyFetching));

  const currentData = params.type === "weekly" ? weeklyData : monthlyData;

  // Memoized filter function
  const filterEntriesByMonth = useCallback(
    (entries: any[]) => {
      if (params.type !== "monthly" || !params.month) return entries;
      return entries.filter((entry) =>
        isDateInMonth(entry.date, params.month as string),
      );
    },
    [params.type, params.month],
  );
  console.log("mon", currentData?.data?.entries?.all);
  // Memoized filtered entries
  const filteredEntries = useMemo(() => {
    if (!currentData?.data?.entries) return [];

    let entries = [];
    switch (active) {
      case "Earnings":
        entries = currentData.data.entries.earning || [];
        break;
      case "Spendings":
        entries = currentData.data.entries.spending || [];
        break;
      default:
        entries = currentData?.data?.entries?.all || [];
    }

    return filterEntriesByMonth(entries);
  }, [currentData, active, filterEntriesByMonth]);

  // Memoized filtered totals
  const filteredTotals = useMemo(() => {
    if (!currentData?.data) return { earning: 0, spending: 0 };

    const filteredAll = filterEntriesByMonth(
      currentData.data.entries.all || [],
    );

    const earning = filteredAll
      .filter((entry) => entry.type === "earning")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const spending = filteredAll
      .filter((entry) => entry.type === "spending")
      .reduce((sum, entry) => sum + entry.amount, 0);

    return { earning, spending };
  }, [currentData, filterEntriesByMonth]);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const [listAnims, setListAnims] = useState<Animated.Value[]>([]);

  // Reset and start animations when filtered entries change
  useEffect(() => {
    // Create new animations for the new filtered entries
    const newAnims = filteredEntries.map(() => new Animated.Value(0));
    setListAnims(newAnims);

    // Start header animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Start staggered animations for list items
    if (newAnims.length > 0) {
      Animated.stagger(
        120,
        newAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ),
      ).start();
    }
  }, [filteredEntries.length]); // Only depend on length, not the entire array

  // Display month in header for monthly reports
  const getHeaderTitle = () => {
    if (params.type === "weekly") return "Weekly Report Details";
    if (params.month) {
      const [year, month] = (params.month as string).split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1,
      ).toLocaleString("default", { month: "long" });
      return `${monthName} ${year} Report`;
    }
    return "Monthly Report Details";
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center gap-4 px-[5%] mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">
            {getHeaderTitle()}
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="px-[5%] pb-14">
            {isLoading ? (
              <View className="h-64 items-center justify-center">
                <ActivityIndicator size="large" color="#E6C57A" />
                <Text className="text-white mt-4">Loading details...</Text>
              </View>
            ) : currentData?.success ? (
              <>
                {/* TOP CARDS */}
                <Animated.View
                  style={{
                    opacity: headerAnim,
                    transform: [
                      {
                        translateY: headerAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  }}
                  className="flex-row gap-4 mb-6"
                >
                  <LinearGradient
                    colors={["#0F766E", "#064E3B"]}
                    className="flex-1 rounded-2xl p-4"
                    style={{ borderRadius: 10 }}
                  >
                    <View className="flex-row items-center gap-2 mb-2">
                      <Feather name="trending-up" size={14} color="#5EEAD4" />
                      <Text className="text-[#5EEAD4] text-xs">Earnings</Text>
                    </View>
                    <Text className="text-white text-xl font-bold">
                      $
                      {(params.type === "monthly"
                        ? filteredTotals.earning
                        : currentData.data.totalEarning
                      ).toLocaleString()}
                    </Text>
                  </LinearGradient>

                  <LinearGradient
                    colors={["#7F1D1D", "#450A0A"]}
                    style={{ borderRadius: 10 }}
                    className="flex-1 rounded-2xl p-4"
                  >
                    <View className="flex-row items-center gap-2 mb-2">
                      <Feather name="trending-down" size={14} color="#FDA4AF" />
                      <Text className="text-[#FDA4AF] text-xs">Spendings</Text>
                    </View>
                    <Text className="text-white text-xl font-bold">
                      $
                      {(params.type === "monthly"
                        ? filteredTotals.spending
                        : currentData.data.totalSpending
                      ).toLocaleString()}
                    </Text>
                  </LinearGradient>
                </Animated.View>

                {/* FILTER BUTTONS */}
                <View className="flex-row gap-3 mb-6">
                  {["All", "Earnings", "Spendings"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setActive(item as any)}
                    >
                      {active === item ? (
                        <LinearGradient
                          style={{ borderRadius: 50 }}
                          colors={["#E6C57A", "#B08B4A"]}
                          className="px-4 py-2 rounded-full"
                        >
                          <Text className="text-white font-semibold">
                            {item}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View className="px-4 py-2 rounded-full bg-[#1E1E2E]">
                          <Text className="text-gray-400">{item}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* TRANSACTIONS COUNT */}
                <View className="mb-3">
                  <Text className="text-gray-400 text-sm">
                    {filteredEntries.length} transaction
                    {filteredEntries.length !== 1 ? "s" : ""} found
                  </Text>
                </View>

                {/* TRANSACTIONS LIST */}
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((item: any, index: number) => (
                    <Animated.View
                      key={`${item.date}-${item.name}-${item.amount}-${index}`}
                      style={{
                        opacity: listAnims[index] || 1,
                        transform: [
                          {
                            translateY: (
                              listAnims[index] || new Animated.Value(1)
                            ).interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                          },
                        ],
                      }}
                      className="bg-[#1E1E2E] rounded-2xl p-4 mb-3 flex-row justify-between items-center"
                    >
                      <View className="flex-row items-center gap-3">
                        <View
                          style={{
                            backgroundColor: getCategoryBg(item.category),
                          }}
                          className="p-2 rounded-xl"
                        >
                          {getCategoryIcon(item.category)}
                        </View>
                        <View>
                          <Text className="text-white font-semibold">
                            {item.name}
                          </Text>
                          <Text className="text-gray-400 text-xs">
                            {item.category} • {formatDate(item.date)}
                          </Text>
                        </View>
                      </View>
                      <Text
                        className={`font-bold ${
                          item.type === "earning"
                            ? "text-[#22C55E]"
                            : "text-[#EF4444]"
                        }`}
                      >
                        {formatAmount(item.amount, item.type)}
                      </Text>
                    </Animated.View>
                  ))
                ) : (
                  <View className="bg-[#1E1E2E] rounded-2xl p-8 items-center justify-center">
                    <Text className="text-gray-400 text-center">
                      No transactions found for this period
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View className="bg-[#1E1E2E] rounded-2xl p-8 items-center justify-center">
                <Text className="text-white text-center">
                  No data available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default DetailsWeeklyReport;
