import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface BudgetModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

interface BudgetItem {
  title: string;
  total: number;
  spent: number;
  percent: number;
  color: string;
}

const DATA: BudgetItem[] = [
  {
    title: "Supermarket",
    total: 500,
    spent: 141.59,
    percent: 72,
    color: "#8C5454",
  },
  {
    title: "Clothing",
    total: 1000,
    spent: 836.75,
    percent: 17,
    color: "#2D6CDF",
  },
  {
    title: "House",
    total: 1500,
    spent: 766.5,
    percent: 19,
    color: "#9B6B55",
  },
  {
    title: "Entertainment",
    total: 2000,
    spent: 1524.18,
    percent: 24,
    color: "#E2B35C",
  },
];

const BudgetModal: React.FC<BudgetModalProps> = ({ open, setOpen }) => {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="w-[94%] max-h-[85%] rounded-3xl bg-[#0F0F14] p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-semibold">Budget</Text>
            <View className="bg-[#C59A45] px-4 py-1.5 rounded-full">
              <Text className="text-black font-semibold">Weekly</Text>
            </View>
          </View>

          {/* Total budget */}
          <View className="bg-[#1A1A22] rounded-2xl p-4 mb-4">
            <Text className="text-gray-400 text-sm">Total budget</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-white text-lg">$0.00</Text>
              <Text className="text-white text-lg">$0.00</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-2">
              Budget period · 18 January 2026 – 24 January 2026
            </Text>
          </View>

          {/* Categories */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {DATA.map((item, index) => (
              <View key={index} className="bg-[#1A1A22] rounded-2xl p-4 mb-3">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-white font-medium">{item.title}</Text>
                  <Text className="text-white">{item.percent}%</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-400 text-sm">
                    ${item.total.toFixed(2)}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    ${item.spent.toFixed(2)}
                  </Text>
                </View>

                {/* Progress bar */}
                <View className="h-2 w-full bg-[#2A2A33] rounded-full overflow-hidden">
                  <LinearGradient
                    colors={[item.color, `${item.color}CC`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: `${item.percent}%`,
                      height: "100%",
                      borderRadius: 999,
                    }}
                  />
                </View>
              </View>
            ))}

            {/* Add button */}
            <TouchableOpacity className="mt-3 bg-[#C59A45] py-4 rounded-2xl items-center">
              <Text className="text-black font-semibold text-base">
                ＋ Add category budget
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Close */}
          <TouchableOpacity
            onPress={() => setOpen(false)}
            className="mt-3 items-center"
          >
            <Text className="text-gray-400">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BudgetModal;
