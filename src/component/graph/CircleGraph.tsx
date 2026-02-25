import { useGetSpendingCategoryQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PieChart from "react-native-pie-chart";

const SIZE = 220;

// Month names for display
const MONTH_NAMES = [
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

// Available years (current year and last 5 years)
const getAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  return [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4,
  ];
};

// Professional color palette for categories
const CATEGORY_COLORS = [
  "#6C7CFF",
  "#9B6CFF",
  "#20C7B5",
  "#FFB020",
  "#FF5FA2",
  "#8A93A6",
  "#F97316",
  "#10B981",
  "#6366F1",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
];

export default function CircleGraph() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const availableYears = getAvailableYears();

  const {
    data: spendingData,
    isLoading,
    isError,
    refetch,
  } = useGetSpendingCategoryQuery({
    year: selectedYear,
    month: selectedMonth,
  });

  // Process API data for chart
  const chartData = useMemo(() => {
    if (
      !spendingData?.data?.categories ||
      spendingData.data.categories.length === 0
    ) {
      return {
        categories: [],
        totalSpending: 0,
        hasData: false,
      };
    }

    // Map categories with colors
    const categoriesWithColors = spendingData.data.categories.map(
      (item: any, index: number) => ({
        label: item.category,
        value: item.amount,
        count: item.count || 0,
        percentage: item.percentage || 0,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      }),
    );

    return {
      categories: categoriesWithColors,
      totalSpending: spendingData.data.totalSpending || 0,
      hasData: true,
    };
  }, [spendingData]);

  // Use API data or fallback to empty array
  const displayData = chartData.hasData ? chartData.categories : [];
  const total = chartData.totalSpending;

  // Prepare series for PieChart
  const series = displayData.map((item) => ({
    value: item.value,
    color: item.color,
  }));

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (increment: number) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear = selectedYear + 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear = selectedYear - 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  if (isError) {
    return (
      <ScrollView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#b08b4a81", "#2626a185"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#C49F59",
            margin: 16,
          }}
        >
          <Text style={{ color: "#ef4444", textAlign: "center", fontSize: 16 }}>
            Failed to load data
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              marginTop: 12,
              padding: 10,
              backgroundColor: "#C49F59",
              borderRadius: 8,
              alignSelf: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: "#FFFFFF" }}>Retry</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Year Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12, marginTop: 8 }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          {availableYears.map((year) => (
            <TouchableOpacity
              key={year}
              onPress={() => handleYearChange(year)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selectedYear === year ? "#C49F59" : "#C49F5933",
                backgroundColor:
                  selectedYear === year ? "#C49F59" : "transparent",
              }}
            >
              <Text
                style={{
                  color: selectedYear === year ? "#FFFFFF" : "#C49F59",
                  fontSize: 14,
                }}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Month Filter */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => handleMonthChange(-1)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#C49F5933",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="long-arrow-left" size={18} color="#C49F59" />
        </TouchableOpacity>

        <Text style={{ color: "#E7D9B0", fontSize: 16, fontWeight: "600" }}>
          {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
        </Text>

        <TouchableOpacity
          onPress={() => handleMonthChange(1)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#C49F5933",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="long-arrow-right" size={18} color="#C49F59" />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={["#b08b4a81", "#2626a185"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#C49F59",

          marginBottom: 16,
        }}
      >
        {isLoading ? (
          <View
            style={{
              height: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#C49F59" />
          </View>
        ) : !chartData.hasData ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text
              style={{ color: "#E7D9B0", fontSize: 16, textAlign: "center" }}
            >
              No spending data for {MONTH_NAMES[selectedMonth - 1]}{" "}
              {selectedYear}
            </Text>
          </View>
        ) : (
          <>
            {/* DONUT GRAPH */}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <PieChart widthAndHeight={SIZE} series={series} cover={0.6} />

              {/* CENTER TOTAL */}
              <View style={{ position: "absolute", alignItems: "center" }}>
                <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Total</Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 24,
                    fontWeight: "600",
                    marginTop: 4,
                  }}
                >
                  ${total.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* CATEGORY LIST & PROGRESS BARS */}
            <View style={{ marginTop: 24 }}>
              {displayData.map((item, i) => {
                const percent =
                  item.percentage || Math.round((item.value / total) * 100);
                return (
                  <View key={i} style={{ marginBottom: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: item.color,
                          marginRight: 8,
                        }}
                      />
                      <Text style={{ color: "#E5E7EB", flex: 1 }}>
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          color: "#9CA3AF",
                          textAlign: "right",
                        }}
                      >
                        {percent}%
                      </Text>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          width: 80,
                          textAlign: "right",
                          marginLeft: 8,
                        }}
                      >
                        ${item.value.toLocaleString()}
                      </Text>
                    </View>

                    {/* PROGRESS BAR */}
                    <View
                      style={{
                        height: 6,
                        backgroundColor: "#2A2F45",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          backgroundColor: item.color,
                          borderRadius: 6,
                        }}
                      />
                    </View>

                    {/* Optional: Show transaction count if available */}
                    {item.count > 0 && (
                      <Text
                        style={{ color: "#9CA3AF", fontSize: 10, marginTop: 2 }}
                      >
                        {item.count} transaction{item.count > 1 ? "s" : ""}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Summary Footer */}
            <View
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#ffffff22",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                {displayData.length} categories
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </Text>
            </View>
          </>
        )}
      </LinearGradient>
    </ScrollView>
  );
}
