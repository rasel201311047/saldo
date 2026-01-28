import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteModal from "./DeleteModal";
type Period = "Weekly" | "Monthly" | "Yearly";

interface SetupBudgetProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: {
    title: string;
    image?: any;
  } | null;
}

const SetupBudget: React.FC<SetupBudgetProps> = ({
  open,
  setOpen,
  selected,
}) => {
  const [opendelete, setOpendelete] = useState(false);
  const [period, setPeriod] = useState<Period>("Weekly");
  const [showPeriod, setShowPeriod] = useState(false);
  const [amount, setAmount] = useState("");

  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD"];

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <Pressable
          onPress={() => setOpen(false)}
          className="absolute inset-0"
        />
        <View className="w-[88%] rounded-2xl bg-[#1A1A24] border border-[#3A3A44] p-4">
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">Setup Budget</Text>

            {/* Period Dropdown */}
            <View className="relative">
              <Pressable onPress={() => setShowPeriod(!showPeriod)}>
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  style={{ borderRadius: 8 }}
                  className="px-4 py-1.5 rounded-lg flex-row items-center"
                >
                  <Text className="text-white font-bold text-sm">{period}</Text>
                  <Entypo name="chevron-down" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>

              {showPeriod && (
                <View className="absolute right-0 top-9 bg-[#222232] rounded-lg border border-[#4F4F59] overflow-hidden z-50">
                  {["Weekly", "Monthly", "Yearly"].map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => {
                        setPeriod(p as Period);
                        setShowPeriod(false);
                      }}
                      className="px-4 py-2"
                    >
                      <Text
                        className={`text-sm ${
                          period === p ? "text-[#FAD885]" : "text-white"
                        }`}
                      >
                        {p}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* CATEGORY */}
          <View className="flex-row items-center mb-4 gap-2">
            {selected?.image && (
              <Image
                source={selected.image}
                className="w-7 h-7"
                resizeMode="contain"
              />
            )}
            <Text className="text-white text-base">{selected?.title}</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-5">
            {/* Amount Input */}
            <TextInput
              placeholder="Budget"
              placeholderTextColor="#8A8A96"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              className="flex-1 bg-[#242333] text-[#F1F1F2] px-4 py-2.5 rounded-lg border border-[#4F4F59]"
            />
            <View className="relative">
              <Pressable onPress={() => setShowCurrency(!showCurrency)}>
                <View className="bg-[#584C2F] px-3 py-2.5 rounded-lg flex-row items-center">
                  <Text className="text-white font-Inter text-sm">
                    {currency}
                  </Text>
                  <Entypo name="chevron-down" size={20} color="#fff" />
                </View>
              </Pressable>

              {showCurrency && (
                <View className="absolute right-0 top-12 bg-[#584C2F] rounded-lg border border-[#4F4F59] overflow-hidden z-50">
                  {currencyOptions.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => {
                        setCurrency(c);
                        setShowCurrency(false);
                      }}
                      className="px-2 py-2"
                    >
                      <Text
                        className={`text-sm font-Inter ${
                          currency === c ? "text-[#FAD885]" : "text-white"
                        }`}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              onPress={() => setOpendelete(true)}
              className="bg-[#222232] p-2.5 rounded-lg"
            >
              <Feather name="trash-2" size={18} color="#FF4D4F" />
            </Pressable>
          </View>

          {/* ACTIONS */}
          <View className="flex-row justify-between items-center">
            <View />
            <View className="flex-row items-center gap-[3%]">
              <Pressable
                onPress={() => setOpen(false)}
                className=" border border-[#4F4F59] py-2 px-4 rounded-xl"
              >
                <Text className="text-white text-sm">Cancel</Text>
              </Pressable>
              <TouchableOpacity>
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  style={{ borderRadius: 8 }}
                  className="px-8 py-2.5 rounded-lg"
                >
                  <Text className="text-white font-Inter font-bold">OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <DeleteModal
        opendelete={opendelete}
        setOpendelete={() => setOpendelete(false)}
      />
    </Modal>
  );
};

export default SetupBudget;
