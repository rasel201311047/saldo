import { useGetBalanceTredQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import responsive from "@/src/utils/responsive";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

const width = responsive.scale(360);
const CARD_WIDTH = width;
const CHART_HEIGHT = 140;
const CHART_PADDING = 48;
const TOP_OFFSET = 16;

// Month names for display
const MONTH_NAMES = [
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

// Short month names for labels
const SHORT_MONTH_NAMES = [
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

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers for Y-axis
const formatYAxisValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${value}`;
};

// Generate days array for a given month with professional spacing
const generateDaysArray = (
  daysInMonth: number,
  year: number,
  month: number,
) => {
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    days.push({
      day: i,
      balance: 0,
      dayName: dayName,
      date: `${dayName} ${i}`,
    });
  }
  return days;
};

const LineGraph = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const availableYears = getAvailableYears();

  const {
    data: incomeBalanceTredData,
    isLoading,
    isError,
    refetch,
  } = useGetBalanceTredQuery({ year: selectedYear, month: selectedMonth });

  // Safely extract data with null handling - if trend is null, create array of zeros
  const apiData = useMemo(() => {
    if (!incomeBalanceTredData?.data) {
      return {
        trend: generateDaysArray(31, selectedYear, selectedMonth),
        currentBalance: 0,
        growthPercentage: 0,
        daysInMonth: 31,
        message: "No data available for this period",
      };
    }

    const { trend, currentBalance, growthPercentage, daysInMonth, message } =
      incomeBalanceTredData.data;

    // If trend is null, create array of zeros for all days in the month
    let processedTrend = [];
    const totalDays = daysInMonth || 31;

    if (!trend || !Array.isArray(trend) || trend.length === 0) {
      // Create professional zero-filled array with day names
      processedTrend = generateDaysArray(
        totalDays,
        selectedYear,
        selectedMonth,
      );
    } else {
      // Process existing trend data and ensure all days are present
      const trendMap = new Map();
      trend.forEach((item) => {
        if (item && item.day) {
          trendMap.set(item.day, item);
        }
      });

      // Fill in missing days with zero balance
      for (let i = 1; i <= totalDays; i++) {
        if (trendMap.has(i)) {
          const existing = trendMap.get(i);
          processedTrend.push({
            day: i,
            balance: existing.balance || 0,
            dayName: new Date(
              selectedYear,
              selectedMonth - 1,
              i,
            ).toLocaleDateString("en-US", { weekday: "short" }),
            date: `${new Date(selectedYear, selectedMonth - 1, i).toLocaleDateString("en-US", { weekday: "short" })} ${i}`,
          });
        } else {
          const date = new Date(selectedYear, selectedMonth - 1, i);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          processedTrend.push({
            day: i,
            balance: 0,
            dayName: dayName,
            date: `${dayName} ${i}`,
          });
        }
      }

      // Sort by day
      processedTrend.sort((a, b) => a.day - b.day);
    }

    return {
      trend: processedTrend,
      currentBalance: currentBalance || 0,
      growthPercentage: growthPercentage || 0,
      daysInMonth: totalDays,
      message: message || "No transactions found for this month",
      isNullTrend: !trend || !Array.isArray(trend) || trend.length === 0,
    };
  }, [incomeBalanceTredData, selectedYear, selectedMonth]);

  // Process API data for chart
  const chartData = useMemo(() => {
    return apiData.trend.map((item) => item?.balance || 0);
  }, [apiData.trend]);

  // Generate day labels from API data with professional formatting
  const chartLabels = useMemo(() => {
    return apiData.trend.map((item) => item?.date || `Day ${item?.day || 0}`);
  }, [apiData.trend]);

  // Calculate dynamic min/max values
  const { minValue, maxValue, hasValidData } = useMemo(() => {
    // If all values are 0, use professional default range
    if (chartData.length === 0 || chartData.every((val) => val === 0)) {
      return {
        minValue: 0,
        maxValue: 10000,
        hasValidData: false,
      };
    }

    const validData = chartData.filter(
      (val) => typeof val === "number" && !isNaN(val),
    );

    if (validData.length === 0) {
      return {
        minValue: 0,
        maxValue: 10000,
        hasValidData: false,
      };
    }

    const min = Math.min(...validData);
    const max = Math.max(...validData);

    if (min === max) {
      return {
        minValue: Math.max(0, min - 1000),
        maxValue: min + 1000,
        hasValidData: true,
      };
    }

    const range = max - min;
    const padding = range * 0.1;

    return {
      minValue: Math.max(0, Math.floor(min - padding)),
      maxValue: Math.ceil(max + padding),
      hasValidData: true,
    };
  }, [chartData]);

  // Generate Y-axis grid values
  const gridValues = useMemo(() => {
    if (!hasValidData || chartData.length === 0) {
      return [0, 2500, 5000, 7500, 10000];
    }

    const step = (maxValue - minValue) / 4;
    return [
      Math.round(minValue),
      Math.round(minValue + step),
      Math.round(minValue + step * 2),
      Math.round(minValue + step * 3),
      Math.round(maxValue),
    ];
  }, [minValue, maxValue, hasValidData, chartData.length]);

  // For better scrolling experience, calculate content width
  const contentWidth = useMemo(() => {
    if (chartData.length <= 1) return CARD_WIDTH;
    return CHART_PADDING * 2 + (chartData.length - 1) * 45; // 45px gap between points for professional look
  }, [chartData.length]);

  const getY = (value: number) => {
    if (!hasValidData || maxValue === minValue) {
      return TOP_OFFSET + CHART_HEIGHT / 2;
    }
    return (
      TOP_OFFSET +
      CHART_HEIGHT -
      ((value - minValue) / (maxValue - minValue)) * CHART_HEIGHT
    );
  };

  const path = chartData
    .map((value, index) => {
      const x = CHART_PADDING + index * 45; // Fixed spacing for professional look
      const y = getY(value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Scroll to start when year changes
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }, 100);
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
    // Scroll to start when month changes
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }, 100);
  };

  // Check if we have any non-zero values
  const hasNonZeroValues = useMemo(() => {
    return chartData.some((val) => val > 0);
  }, [chartData]);

  if (isError) {
    return (
      <View className="mt-6">
        <LinearGradient
          colors={["#b08b4a81", "#2626a185"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#C49F59",
          }}
        >
          <Text
            style={{
              color: "#ef4444",
              textAlign: "center",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Failed to load data
          </Text>
          <Text
            style={{
              color: "#ef4444",
              textAlign: "center",
              fontSize: 14,
              marginTop: 4,
              opacity: 0.8,
            }}
          >
            Please check your connection
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#C49F59",
              borderRadius: 12,
              alignSelf: "center",
              paddingHorizontal: 30,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
              Retry
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="mt-2">
      {/* Year Filter - Professional Horizontal Scroll */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          {availableYears.map((year) => (
            <TouchableOpacity
              key={year}
              onPress={() => handleYearChange(year)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 25,
                borderWidth: 1,
                borderColor: selectedYear === year ? "#C49F59" : "#C49F5933",
                backgroundColor:
                  selectedYear === year ? "#C49F59" : "transparent",
                shadowColor: selectedYear === year ? "#C49F59" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: selectedYear === year ? 3 : 0,
              }}
            >
              <Text
                style={{
                  color: selectedYear === year ? "#FFFFFF" : "#C49F59",
                  fontSize: 15,
                  fontWeight: selectedYear === year ? "600" : "500",
                }}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Month Filter - Professional Navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => handleMonthChange(-1)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#C49F5933",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#C49F5940",
          }}
          className="flex-row justify-center items-center"
        >
          <FontAwesome name="long-arrow-left" size={18} color="#C49F59" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "#E7D9B0",
              fontSize: 18,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            {MONTH_NAMES[selectedMonth - 1]}
          </Text>
          <Text
            style={{
              color: "#C49F59",
              fontSize: 14,
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            {selectedYear}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleMonthChange(1)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#C49F5933",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#C49F5940",
          }}
          className="flex-row justify-center items-center"
        >
          <FontAwesome name="long-arrow-right" size={18} color="#C49F59" />
        </TouchableOpacity>
      </View>

      {/* Main Graph Card */}
      <LinearGradient
        colors={["#b08b4a30", "#2626a130"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "#C49F59",
        }}
      >
        {/* Header with Current Balance */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              letterSpacing: 0.5,
            }}
            className="text-sm text-[#E7D9B0] font-Inter font-medium"
          >
            CURRENT BALANCE
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text
            style={{
              letterSpacing: 0.5,
            }}
            className="text-lg font-Inter font-bold text-[#FFFFFF]"
          >
            {isLoading ? "..." : formatCurrency(apiData.currentBalance)}
          </Text>

          {!isLoading && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  color: apiData.growthPercentage >= 0 ? "#4ADE80" : "#ef4444",
                  fontSize: 12,
                  fontWeight: "600",
                  backgroundColor:
                    apiData.growthPercentage >= 0 ? "#4ADE8033" : "#ef444433",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 16,
                }}
              >
                {apiData.growthPercentage >= 0 ? "↑" : "↓"}
                {Math.abs(apiData.growthPercentage).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>

        {/* Chart */}
        <View style={{ marginTop: 24 }}>
          {isLoading ? (
            <View
              style={{
                height: CHART_HEIGHT + 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#C49F59" />
              <Text style={{ color: "#CFCFCF", marginTop: 12, fontSize: 13 }}>
                Loading trend data...
              </Text>
            </View>
          ) : (
            <>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="normal"
                snapToInterval={100}
                className=""
              >
                <Svg width={contentWidth} height={CHART_HEIGHT + 75}>
                  {/* Y-axis line */}
                  <Line
                    x1={CHART_PADDING - 10}
                    x2={CHART_PADDING - 10}
                    y1={TOP_OFFSET - 5}
                    y2={TOP_OFFSET + CHART_HEIGHT + 10}
                    stroke="#C49F5940"
                    strokeWidth={1}
                  />

                  {/* Grid Lines */}
                  {gridValues.map((val, i) => {
                    const y = getY(val);
                    return (
                      <G key={`grid-${i}`}>
                        <Line
                          x1={CHART_PADDING - 10}
                          x2={contentWidth - 20}
                          y1={y}
                          y2={y}
                          stroke="#ffffff15"
                          strokeDasharray="6 6"
                        />
                        <SvgText
                          x={CHART_PADDING - 15}
                          y={y + 4}
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="500"
                          textAnchor="end"
                        >
                          {formatYAxisValue(val)}
                        </SvgText>
                      </G>
                    );
                  })}

                  {/* Line Path */}
                  {chartData.length > 1 && (
                    <Path
                      d={path}
                      stroke={hasNonZeroValues ? "#6366F1" : "#6366F180"}
                      strokeWidth={hasNonZeroValues ? 3 : 2}
                      strokeDasharray={hasNonZeroValues ? "none" : "8 8"}
                      fill="none"
                    />
                  )}

                  {/* Dots and Labels */}
                  {chartData.map((value, index) => {
                    const x = CHART_PADDING + index * 45; // Professional fixed spacing
                    const y = getY(value);
                    const isSignificant =
                      value > 0 ||
                      index % 5 === 0 ||
                      index === chartData.length - 1;

                    return (
                      <G key={`point-${index}`}>
                        <Circle
                          cx={x}
                          cy={y}
                          r={value > 0 ? 6 : 4}
                          fill={value > 0 ? "#6366F1" : "#6366F140"}
                          stroke="#FFFFFF"
                          strokeWidth={value > 0 ? 2 : 1}
                          opacity={value > 0 ? 1 : 0.6}
                        />

                        {/* Value label for significant points */}
                        {(value > 0 || index % 7 === 0) && (
                          <SvgText
                            x={x}
                            y={y - 15}
                            fill="#FFFFFF"
                            fontSize="9"
                            fontWeight="600"
                            textAnchor="middle"
                            opacity={0.9}
                          >
                            {value > 0
                              ? formatYAxisValue(value).replace("$", "")
                              : ""}
                          </SvgText>
                        )}
                      </G>
                    );
                  })}

                  {/* X-axis labels with professional spacing */}
                  {chartLabels.map((label, index) => {
                    // Show every 3rd label for clean look
                    if (
                      index % 3 !== 0 &&
                      index !== 0 &&
                      index !== chartLabels.length - 1
                    )
                      return null;

                    const x = CHART_PADDING + index * 45;
                    const dayData = apiData.trend[index];

                    return (
                      <G key={`xlabel-${index}`}>
                        <SvgText
                          x={x}
                          y={TOP_OFFSET + CHART_HEIGHT + 25}
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="500"
                          textAnchor="middle"
                        >
                          {dayData?.day || index + 1}
                        </SvgText>
                        <SvgText
                          x={x}
                          y={TOP_OFFSET + CHART_HEIGHT + 38}
                          fill="#C49F59"
                          fontSize="8"
                          fontWeight="400"
                          textAnchor="middle"
                          opacity={0.7}
                        >
                          {dayData?.dayName || ""}
                        </SvgText>
                      </G>
                    );
                  })}
                </Svg>
              </ScrollView>

              {/* Professional scroll indicator */}
              {/* {chartData.length > 10 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 12,
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 4,
                      backgroundColor: "#C49F59",
                      borderRadius: 2,
                    }}
                  />
                  <View
                    style={{
                      width: 30,
                      height: 4,
                      backgroundColor: "#C49F5933",
                      borderRadius: 2,
                    }}
                  />
                  <View
                    style={{
                      width: 30,
                      height: 4,
                      backgroundColor: "#C49F5933",
                      borderRadius: 2,
                    }}
                  />
                  <Text
                    style={{ color: "#94a3b8", fontSize: 10, marginLeft: 8 }}
                  >
                    Scroll for more days →
                  </Text>
                </View>
              )} */}
            </>
          )}

          {/* Professional message when trend was null or all zeros */}
          {!isLoading && !hasNonZeroValues && (
            <View
              style={{
                marginTop: 16,
                padding: 14,
                backgroundColor: "#C49F5910",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#C49F5930",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#C49F59",
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: "#E7D9B0",
                  fontSize: 13,
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {apiData.message}
              </Text>
            </View>
          )}
        </View>

        {/* Professional Summary Stats */}
        {!isLoading && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "#ffffff15",
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                DAYS
              </Text>
              <Text
                style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}
              >
                {apiData.trend.length}
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 10 }}>
                of {apiData.daysInMonth}
              </Text>
            </View>

            <View
              style={{ width: 1, height: 40, backgroundColor: "#ffffff15" }}
            />

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                GROWTH
              </Text>
              <Text
                style={{
                  color: apiData.growthPercentage >= 0 ? "#4ADE80" : "#ef4444",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {apiData.growthPercentage >= 0 ? "+" : ""}
                {apiData.growthPercentage.toFixed(1)}%
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 10 }}>this month</Text>
            </View>

            <View
              style={{ width: 1, height: 40, backgroundColor: "#ffffff15" }}
            />

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                MONTH
              </Text>
              <Text
                style={{ color: "#C49F59", fontSize: 18, fontWeight: "700" }}
              >
                {SHORT_MONTH_NAMES[selectedMonth - 1]}
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 10 }}>
                {selectedYear}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default LineGraph;
