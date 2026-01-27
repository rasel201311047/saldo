import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

const DATA: ChartItem[] = [
  { label: "Housing", value: 1800, color: "#6C7CFF" },
  { label: "Food", value: 950, color: "#9B6CFF" },
  { label: "Transport", value: 650, color: "#20C7B5" },
  { label: "Entertainment", value: 480, color: "#FFB020" },
  { label: "Shopping", value: 420, color: "#FF5FA2" },
  { label: "Others", value: 950, color: "#8A93A6" },
];

const SIZE = 220;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const GAP = 6; // spacing between slices

export default function CircleGraph() {
  const total = DATA.reduce((s, i) => s + i.value, 0);

  let offset = 0;

  return (
    <LinearGradient
      colors={["#b08b4a81", "#2626a185"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#C49F59",
      }}
    >
      {/* DONUT */}
      <View className="items-center justify-center">
        <Svg width={SIZE} height={SIZE}>
          <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
            {DATA.map((item, i) => {
              const pct = item.value / total;
              const length = pct * CIRC - GAP;
              const dashArray = `${length} ${CIRC}`;

              const dashOffset = -offset;
              offset += pct * CIRC;

              return (
                <Circle
                  key={i}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke={item.color}
                  strokeWidth={STROKE}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })}
          </G>
        </Svg>

        {/* CENTER */}
        <View className="absolute items-center">
          <Text className="text-gray-400 text-sm">Total</Text>
          <Text className="text-white text-2xl font-semibold mt-1">
            ${total.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* LEVEL / PROGRESS BARS */}
      <View className="mt-6 space-y-4">
        {DATA.map((item, i) => {
          const percent = Math.round((item.value / total) * 100);

          return (
            <View key={i}>
              <View className="flex-row items-center mb-1">
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: item.color,
                    marginRight: 8,
                  }}
                />

                <Text className="text-gray-200 flex-1">{item.label}</Text>

                <Text className="text-gray-400 w-12 text-right">
                  {percent}%
                </Text>

                <Text className="text-white w-20 text-right ml-2">
                  ${item.value.toLocaleString()}
                </Text>
              </View>

              {/* BAR */}
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
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}
