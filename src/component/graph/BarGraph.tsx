import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";

const SCREEN_WIDTH = responsive.scale(360);
const HEIGHT = 220;

const PADDING = 24;
const LEFT_AXIS_WIDTH = 40;

const data = [
  { month: "Aug", income: 4200, expense: 3800 },
  { month: "Sep", income: 4600, expense: 4200 },
  { month: "Oct", income: 5000, expense: 4400 },
  { month: "Nov", income: 4800, expense: 4100 },
  { month: "Dec", income: 5400, expense: 4700 },
  { month: "Jan", income: 8500, expense: 5200 },
];

const maxValue = 10000;
const yAxisSteps = [0, 2500, 5000, 7500, 10000];

const barWidth = 10;
const barGap = 6;

const BarGraph = () => {
  const chartWidth = SCREEN_WIDTH - 32 - LEFT_AXIS_WIDTH;
  const chartHeight = HEIGHT - PADDING * 2;
  const groupWidth = barWidth * 2 + barGap;
  const groupGap = (chartWidth - data.length * groupWidth) / data.length;

  return (
    <View className=" mt-6 ">
      <LinearGradient
        colors={["#b08b4a81", "#2626a185"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 12, borderWidth: 1, borderColor: "#C49F59" }}
      >
        <Svg width={SCREEN_WIDTH - 42} height={HEIGHT}>
          {/* Y Axis */}
          {yAxisSteps.map((value) => {
            const y = HEIGHT - PADDING - (value / maxValue) * chartHeight;

            return (
              <G key={value}>
                <SvgText
                  x={LEFT_AXIS_WIDTH - 6}
                  y={y + 4}
                  fontSize={10}
                  fill="#94a3b8"
                  textAnchor="end"
                >
                  {value}
                </SvgText>

                <Line
                  x1={LEFT_AXIS_WIDTH}
                  x2={SCREEN_WIDTH}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="4"
                />
              </G>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const x =
              LEFT_AXIS_WIDTH + index * (groupWidth + groupGap) + groupGap / 2;

            const incomeHeight = (item.income / maxValue) * chartHeight;
            const expenseHeight = (item.expense / maxValue) * chartHeight;

            return (
              <G key={item.month}>
                <Rect
                  x={x}
                  y={HEIGHT - PADDING - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  rx={6}
                  fill="#34d399"
                />

                <Rect
                  x={x + barWidth + barGap}
                  y={HEIGHT - PADDING - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  rx={6}
                  fill="#ef4444"
                />

                {/* X Axis Label */}
                <SvgText
                  x={x + groupWidth / 2}
                  y={HEIGHT - 6}
                  fontSize={11}
                  fill="#94a3b8"
                  textAnchor="middle"
                >
                  {item.month}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {/* Summary */}
        <View className="flex-row justify-between mt-6 px-[3%] pb-3">
          <View>
            <View className="flex-row items-center mb-1">
              <View className="w-3 h-3 rounded-full bg-emerald-400 mr-2" />
              <Text className="text-slate-400 text-sm font-Inter">
                Avg. Income
              </Text>
            </View>
            <Text className="text-white text-xl font-bold font-Inter">
              $5,350
            </Text>
          </View>

          <View>
            <View className="flex-row items-center mb-1">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-slate-400 text-sm font-Inter">
                Avg. Expenses
              </Text>
            </View>
            <Text className="text-white text-xl font-bold font-Inter">
              $4,450
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BarGraph;
