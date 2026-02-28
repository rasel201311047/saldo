import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import { PieChart as RNPPieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

interface DataPoint {
  date: string;
  earning: number;
  expense: number;
}

interface Props {
  startDate: Date;
  endDate: Date;
  data: DataPoint[];
}

const ReportGraph: React.FC<Props> = ({ startDate, endDate, data }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data]);

  // Calculate total earnings and expenses for pie chart
  const totalEarnings = data.reduce((sum, item) => sum + item.earning, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expense, 0);

  // Prepare data for charts
  const chartData = {
    labels: data.slice(-7).map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }),
    datasets: [
      {
        data: data.slice(-7).map((item) => item.earning),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: data.slice(-7).map((item) => item.expense),
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Earnings", "Expenses"],
  };

  const pieData = [
    {
      name: "Earnings",
      amount: totalEarnings,
      color: "#10B981",
      legendFontColor: "#9CA3AF",
      legendFontSize: 12,
    },
    {
      name: "Expenses",
      amount: totalExpenses,
      color: "#EF4444",
      legendFontColor: "#9CA3AF",
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#2A2438",
    backgroundGradientTo: "#352F44",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#8B5CF6",
    },
  };

  if (data.length === 0) {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center justify-center py-10"
      >
        <Text className="text-gray-400">No data available for graph</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {/* Chart Type Selector - You can add toggle between chart types */}
      <View className="mb-6">
        <Text className="text-white text-lg font-bold mb-4">Overview</Text>

        {/* Pie Chart */}
        <LinearGradient
          colors={["#352F44", "#2A2438"]}
          style={{ borderRadius: 16 }}
          className="rounded-xl p-4"
        >
          <Text className="text-white/80 text-sm mb-2">Distribution</Text>
          <View className="items-center">
            <RNPPieChart
              data={pieData}
              width={width * 0.7}
              height={150}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </View>

          {/* Legend */}
          <View className="flex-row justify-center mt-4">
            <View className="flex-row items-center mr-4">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-400">Earnings</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-gray-400">Expenses</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default ReportGraph;
