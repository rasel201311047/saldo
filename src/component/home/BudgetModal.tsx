import { BudgetImg } from "@/assets/budget/budgetimg";
import { budgeticon } from "@/assets/icons";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import AddCategory from "./AddCategory";

interface BudgetModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

interface BudgetItem {
  title: string;
  image: any;
  total: number;
  spent: number;
  percent: number;
  color: string;
}

const DATA: BudgetItem[] = [
  {
    title: "Supermarket",
    image: BudgetImg.supermarket,
    total: 500,
    spent: 141.59,
    percent: 72,
    color: "#885255",
  },
  {
    title: "Clothing",
    image: BudgetImg.clothing,
    total: 1000,
    spent: 836.75,
    percent: 17,
    color: "#364B82",
  },
  {
    title: "House",
    image: BudgetImg.house,
    total: 1500,
    spent: 766.5,
    percent: 29,
    color: "#8F5950",
  },
  {
    title: "Entertainment",
    image: BudgetImg.entertainment,
    total: 2000,
    spent: 1524.18,
    percent: 54,
    color: "#714754",
  },
];

const BudgetModal: React.FC<BudgetModalProps> = ({ open, setOpen }) => {
  const [catagoryOpen, setCatagoryOpen] = useState(false);
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1 relative bg-black/60 justify-center items-center">
        <Pressable
          onPress={() => setOpen(false)}
          className=" absolute inset-0"
        />
        <View className="w-[94%] max-h-[85%] rounded-3xl bg-[#1A1A24] border border-[#4F4F59] p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-Inter font-bold">
              Budget
            </Text>

            <LinearGradient
              colors={["#FAD885", "#C49F59", "#8A622A"]}
              style={{
                borderRadius: 10,
                paddingVertical: 6,
                paddingHorizontal: 20,
              }}
              className=" "
            >
              <Text className="text-[#fff] font-Inter  text-lg font-bold">
                Weekly
              </Text>
            </LinearGradient>
          </View>

          {/* Total budget */}
          <View className="bg-[#242333] border border-[#4F4F59] rounded-2xl p-[4%] mb-[2%]">
            <View>
              <View className="flex-row items-center gap-[2%]">
                <View className="">
                  <SvgXml xml={budgeticon} width={34} height={34} />
                </View>
                <View className=" w-[85%] ">
                  <View className="flex-row justify-between items-center ">
                    <Text className="text-gray-400 text-sm">Total budget</Text>
                    <Text className="text-[#FFFFFF] font-Inter text-sm">
                      0%
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center ">
                    <Text className="text-white text-lg">$0.00</Text>
                    <Text className="text-white text-lg">$0.00</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-row justify-between items-start mt-2">
              <Text className="text-gray-500 text-xs mt-2">Budget period</Text>
              <View>
                <Text className="text-xs text-gray-500 text-right">
                  18 January 2026 – 24
                </Text>
                <Text className="text-xs text-gray-500 text-right">
                  January 2026
                </Text>
              </View>
            </View>
          </View>

          {/* Categories */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {DATA.map((item, index) => (
              <View
                key={index}
                className="mb-3 px-[4%] rounded-2xl flex-row items-center bg-[#242333] border border-[#4F4F59] overflow-hidden"
              >
                {/* Progress fill */}
                <LinearGradient
                  colors={[item.color, `${item.color}CC`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${item.percent}%`,
                  }}
                />

                {/* Content */}
                <View>
                  <Image source={item.image} className="w-8 h-8" />
                </View>
                <View className="p-4 w-[90%]">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-white font-Inter font-semibold">
                      {item.title}
                    </Text>
                    <Text className="text-white font-Inter font-medium">
                      {item.percent}%
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-[#F1F1F2] font-Inter  text-sm">
                      ${item.total.toFixed(2)}
                    </Text>
                    <Text className="text-[#F1F1F2] font-Inter text-sm">
                      ${item.spent.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Add button */}
            <TouchableOpacity
              onPress={() => setCatagoryOpen(true)}
              className=""
            >
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                }}
                className=" "
              >
                <View className="w-full flex-row justify-center items-center gap-[3%]">
                  <Entypo name="plus" size={24} color="#fff" />

                  <Text className="text-[#fff] font-semibold text-base">
                    Add category budget
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <AddCategory
        openModal={catagoryOpen}
        close={() => setCatagoryOpen(false)}
      />
    </Modal>
  );
};

export default BudgetModal;
