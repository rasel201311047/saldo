import { useGetIncomeExpensesQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";

const SCREEN_WIDTH = responsive.scale(360);
const HEIGHT = 240;
const PADDING = 24;
const LEFT_AXIS_WIDTH = 45;

const barWidth = 10;
const barGap = 6;
const groupWidth = barWidth * 2 + barGap;

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

const BarGraph = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const availableYears = getAvailableYears();

  const {
    data: incomeExpensesData,
    isLoading,
    isError,
    refetch,
  } = useGetIncomeExpensesQuery(selectedYear);

  // Transform API data to chart format
  const chartData = React.useMemo(() => {
    if (!incomeExpensesData?.data?.months) return [];

    return incomeExpensesData.data.months.map((monthData: any) => ({
      month: MONTH_NAMES[monthData.month - 1],
      income: monthData.income || 0,
      expense: monthData.expenses || 0,
      monthNumber: monthData.month,
    }));
  }, [incomeExpensesData]);

  // Calculate dynamic max value for Y axis
  const maxValue = React.useMemo(() => {
    if (chartData.length === 0) return 10000;

    const allValues = chartData.flatMap((item) => [item.income, item.expense]);
    const max = Math.max(...allValues);
    // Round up to nearest thousand with some padding
    return Math.ceil(max / 1000) * 1000 + 1000;
  }, [chartData]);

  // Generate Y axis steps based on max value
  const yAxisSteps = React.useMemo(() => {
    const steps = [];
    const stepCount = 5;
    for (let i = 0; i <= stepCount; i++) {
      steps.push(Math.round((maxValue / stepCount) * i));
    }
    return steps;
  }, [maxValue]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    refetch();
  };

  if (isError) {
    return (
      <View className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
        <Text className="text-red-400 text-center font-Inter">
          Failed to load data. Please try again.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-3 bg-red-500/20 py-2 rounded-lg"
        >
          <Text className="text-red-400 text-center font-Inter">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mt-2">
      {/* Year Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row ">
          {availableYears.map((year) => (
            <TouchableOpacity
              key={year}
              onPress={() => handleYearChange(year)}
              className={`mr-3 px-4 py-2 rounded-full border ${
                selectedYear === year
                  ? "bg-[#C49F59] border-[#C49F59]"
                  : "border-[#C49F59]/30 bg-transparent"
              }`}
            >
              <Text
                className={`font-Inter ${
                  selectedYear === year ? "text-white" : "text-[#C49F59]"
                }`}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Main Graph Card */}
      <LinearGradient
        colors={["#b08b4a30", "#2626a130"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#C49F59",
          overflow: "hidden",
        }}
      >
        {/* Header with total stats */}
        <View className="flex-row justify-between items-center px-4 pt-4 pb-2 border-b border-white/10">
          <View>
            <Text className="text-slate-400 text-xs font-Inter">
              Total {selectedYear}
            </Text>
            <Text className="text-white text-lg font-bold font-Inter">
              {formatCurrency(incomeExpensesData?.data?.totalIncome || 0)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1" />
              <Text className="text-slate-400 text-xs">Income</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
              <Text className="text-slate-400 text-xs">Expenses</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View
            style={{ height: HEIGHT }}
            className="items-center justify-center"
          >
            <ActivityIndicator size="large" color="#C49F59" />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2"
          >
            <Svg
              width={Math.max(
                SCREEN_WIDTH - 42,
                chartData.length * (groupWidth + 10) + LEFT_AXIS_WIDTH + 20,
              )}
              height={HEIGHT}
            >
              {/* Y Axis Grid and Labels */}
              {yAxisSteps.map((value) => {
                const y =
                  HEIGHT -
                  PADDING -
                  (value / maxValue) * (HEIGHT - PADDING * 2);

                return (
                  <G key={value}>
                    <SvgText
                      x={LEFT_AXIS_WIDTH - 8}
                      y={y + 4}
                      fontSize={10}
                      fill="#94a3b8"
                      textAnchor="end"
                      fontFamily="Inter"
                    >
                      {formatCurrency(value).replace("$", "")}
                    </SvgText>

                    <Line
                      x1={LEFT_AXIS_WIDTH}
                      x2={SCREEN_WIDTH * 2}
                      y1={y}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="4"
                    />
                  </G>
                );
              })}

              {/* Bars */}
              {chartData.map((item, index) => {
                const x = LEFT_AXIS_WIDTH + index * (groupWidth + 12) + 8;
                const chartHeight = HEIGHT - PADDING * 2;

                const incomeHeight = (item.income / maxValue) * chartHeight;
                const expenseHeight = (item.expense / maxValue) * chartHeight;

                return (
                  <G key={item.month}>
                    {/* Income Bar */}
                    {item.income > 0 && (
                      <Rect
                        x={x}
                        y={HEIGHT - PADDING - incomeHeight}
                        width={barWidth}
                        height={incomeHeight}
                        rx={4}
                        fill="#34d399"
                        opacity={0.9}
                      />
                    )}

                    {/* Expense Bar */}
                    {item.expense > 0 && (
                      <Rect
                        x={x + barWidth + barGap}
                        y={HEIGHT - PADDING - expenseHeight}
                        width={barWidth}
                        height={expenseHeight}
                        rx={4}
                        fill="#ef4444"
                        opacity={0.9}
                      />
                    )}

                    {/* X Axis Label */}
                    <SvgText
                      x={x + groupWidth / 2}
                      y={HEIGHT - 8}
                      fontSize={10}
                      fill={
                        item.income > 0 || item.expense > 0
                          ? "#ffffff"
                          : "#94a3b8"
                      }
                      textAnchor="middle"
                      fontFamily="Inter"
                      fontWeight={
                        item.income > 0 || item.expense > 0 ? "600" : "400"
                      }
                    >
                      {item.month}
                    </SvgText>

                    {/* Show small dot for months with no data */}
                    {item.income === 0 && item.expense === 0 && (
                      <Rect
                        x={x + barWidth - 2}
                        y={HEIGHT - PADDING - 4}
                        width={4}
                        height={4}
                        rx={2}
                        fill="#94a3b8"
                        opacity={0.3}
                      />
                    )}
                  </G>
                );
              })}
            </Svg>
          </ScrollView>
        )}

        {/* Summary Section */}
        <View className="flex-row justify-between items-center px-4 py-3 border-t border-white/10">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View className="w-3 h-3 rounded-full bg-emerald-400 mr-2" />
              <Text className="text-slate-400 text-xs font-Inter">
                Avg. Monthly Income
              </Text>
            </View>
            <Text className="text-white text-lg font-bold font-Inter">
              {formatCurrency(incomeExpensesData?.data?.avgMonthlyIncome || 0)}
            </Text>
          </View>

          <View className="w-px h-10 bg-white/10 mx-4" />

          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-slate-400 text-xs font-Inter">
                Avg. Monthly Expenses
              </Text>
            </View>
            <Text className="text-white text-lg font-bold font-Inter">
              {formatCurrency(
                incomeExpensesData?.data?.avgMonthlyExpenses || 0,
              )}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BarGraph;
