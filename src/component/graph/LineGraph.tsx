import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

const width = responsive.scale(360);
const CARD_WIDTH = width;
const CHART_HEIGHT = 120;
const CHART_PADDING = 42;
const TOP_OFFSET = 12;

const data = [1000, 11000, 10700, 11200, 11800, 12300];
const labels = ["Jan 1", "Jan 4", "Jan 7", "Jan 10", "Jan 16"];

const maxValue = 14000;
const minValue = 0;

const LineGraph = () => {
  const stepX = (CARD_WIDTH - CHART_PADDING * 2) / (data.length - 1);

  const getY = (value: number) =>
    TOP_OFFSET +
    CHART_HEIGHT -
    ((value - minValue) / (maxValue - minValue)) * CHART_HEIGHT;

  const path = data
    .map((value, index) => {
      const x = CHART_PADDING + stepX * index;
      const y = getY(value);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <View className="">
      <LinearGradient
        colors={["#b08b4a81", "#2626a185"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          padding: 8,
          borderWidth: 1,
          borderColor: "#C49F59",
        }}
      >
        {/* Header */}
        <Text style={{ color: "#E7D9B0", fontSize: 13 }}>Current Balance</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: "700",
            }}
          >
            $12,450.50
          </Text>

          <Text
            style={{
              color: "#4ADE80",
              marginLeft: 8,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            ↗ +12.5%
          </Text>
        </View>

        {/* Chart */}
        <View style={{ paddingTop: 16 }} className="">
          <Svg width={CARD_WIDTH} height={CHART_HEIGHT + 40}>
            {/* Grid Lines */}
            {[0, 3500, 7000, 10500, 14000].map((val, i) => {
              const y = getY(val);
              return (
                <G key={i}>
                  <Line
                    x1={CHART_PADDING}
                    x2={CARD_WIDTH - CHART_PADDING}
                    y1={y}
                    y2={y}
                    stroke="#ffffff22"
                    strokeDasharray="4 4"
                  />
                  <SvgText x={0} y={y + 4} fill="#CFCFCF" fontSize="10">
                    {val}
                  </SvgText>
                </G>
              );
            })}

            {/* Line Path */}
            <Path d={path} stroke="#6366F1" strokeWidth={3} fill="none" />

            {/* Dots */}
            {data.map((value, index) => {
              const x = CHART_PADDING + stepX * index;
              const y = getY(value);
              return <Circle key={index} cx={x} cy={y} r={4} fill="#6366F1" />;
            })}

            {/* X Labels */}
            {labels.map((label, index) => {
              const x = CHART_PADDING + stepX * index;
              return (
                <SvgText
                  key={index}
                  x={x}
                  y={TOP_OFFSET + CHART_HEIGHT + 18}
                  fill="#CFCFCF"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              );
            })}
          </Svg>
        </View>
      </LinearGradient>
    </View>
  );
};

export default LineGraph;
