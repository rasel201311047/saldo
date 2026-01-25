import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  active: "owe" | "cash";
  onChange: (value: "owe" | "cash") => void;
};

const AccountTypeSwitch = ({ active, onChange }: Props) => {
  return (
    <View className="flex-row bg-white/5 p-1 rounded-full self-center">
      <TouchableOpacity
        onPress={() => onChange("owe")}
        className={`px-4 py-2 rounded-full ${
          active === "owe" ? "bg-red-500" : ""
        }`}
      >
        <Text className="text-white text-sm font-medium">Money you owe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange("cash")}
        className={`px-4 py-2 rounded-full ${
          active === "cash" ? "bg-white/10" : ""
        }`}
      >
        <Text className="text-white text-sm font-medium">Cash balance</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountTypeSwitch;
