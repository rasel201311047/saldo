import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDatePicker from "../custompicker/CustomDatePicker";

const AddNewAccountForm = () => {
  const [color, setColor] = useState("#C49F59");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD"];

  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("2026-01-18");
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <View>
      {/* Amount */}
      <View>
        <Text className="text-[#FFFFFF] text-base font-Inter my-2">Amount</Text>
        <View className="flex-row gap-[3%]">
          <View className="flex-1 bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#F1F1F2"
              keyboardType="numeric"
              className="text-white text-base"
            />
          </View>

          <View className="relative">
            <Pressable onPress={() => setShowCurrency(!showCurrency)}>
              <View className="bg-[#584C2F] px-4 py-5 rounded-lg flex-row items-center">
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
                      className={`text-sm font-Inter ${currency === c ? "text-[#FAD885]" : "text-white"}`}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Name */}
      <View className="mb-4">
        <Text className="text-white text-base font-Inter mb-2">Name</Text>
        <View className="flex-row items-center border border-[#C49F59] rounded-xl px-4 py-3 bg-[#1F1E2C]">
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white text-base font-Inter"
          />
          <AntDesign name="dollar" size={20} color="#fff" />
        </View>
      </View>

      {/* Date */}
      <View>
        <Text className="text-[#FFFFFF] text-base font-Inter my-2">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDate(true)}
          className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
        >
          <Text className="text-white">{formatDate(date)}</Text>
          <Feather name="calendar" size={18} color="#fff" />
        </TouchableOpacity>

        <CustomDatePicker
          visible={showDate}
          date={date}
          onClose={() => setShowDate(false)}
          onConfirm={(selected) => setDate(selected)}
        />
      </View>

      {/* Choose a color */}
      <View className="mt-4">
        <Text className="text-[#FFFFFF] text-base font-Inter my-2">
          Choose a color
        </Text>
        <Pressable
          onPress={() => setShowColorPicker(true)}
          className="flex-row items-center justify-between border border-[#C49F59] rounded-xl px-4 py-4 bg-[#1F1E2C]"
        >
          <Text className="text-white">{color}</Text>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: color,
              borderWidth: 2,
              borderColor: "#fff",
            }}
          />
        </Pressable>

        {/* <ColorPickerModal
          visible={showColorPicker}
          initialColor={color}
          onClose={() => setShowColorPicker(false)}
          onSelectColor={setColor}
        /> */}
      </View>
    </View>
  );
};

export default AddNewAccountForm;
