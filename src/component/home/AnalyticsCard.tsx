import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text } from "react-native";

interface AnalyticsItem {
  title: string;
  value: string | number;
}

interface AnalyticsCardProps {
  item: AnalyticsItem;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ item }) => {
  return (
    <LinearGradient
      colors={["#b08b4a6c", "#2626a18a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        width: responsive.scale(150),
        alignSelf: "center",
        padding: 10,
      }}
    >
      <Text className="text-white text-lg font-Inter ">{item.title}</Text>
      <Text className="text-white text-xl font-Inter font-medium">
        {item.value}
      </Text>
    </LinearGradient>
  );
};

export default AnalyticsCard;
