import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

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

const SIZE = 220; // chart size

export default function CircleGraph() {
  const total = DATA.reduce((s, i) => s + i.value, 0);

  // PieChart expects array of objects with { value, color }
  const series = DATA.map((item) => ({
    value: item.value,
    color: item.color,
  }));

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
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
        {/* DONUT GRAPH */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <PieChart
            widthAndHeight={SIZE}
            series={series}
            cover={0.6} // donut thickness
          />

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
          {DATA.map((item, i) => {
            const percent = Math.round((item.value / total) * 100);
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
                      width: 32,
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
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
