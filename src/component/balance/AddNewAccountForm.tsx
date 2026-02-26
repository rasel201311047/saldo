import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDatePicker from "../custompicker/CustomDatePicker";
import IconSelector from "../goals/IconSelector";
import ColorPickerModal from "./ColorPickerModal";

const AddNewAccountForm = () => {
  const [color, setColor] = useState("#C49F59");
  const [showColorPicker, setShowColorPicker] = useState(false);
  console.log(color);

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

  //   icon
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedIconStyle, setSelectedIconStyle] = useState<string>("solid");
  const [iconModal, setIconModal] = useState(false);

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(iconName);
  };

  console.log("Icon Name ", selectedIconName);

  // Render selected icon preview
  const renderSelectedIcon = () => {
    if (!selectedIconName) return null;

    const iconProps = {
      solid: selectedIconStyle === "solid",
      brand: selectedIconStyle === "brands",
    };

    return (
      <View className="flex-row items-center gap-3">
        <View className="bg-[#C49F59]/20 p-2 rounded-lg">
          <FontAwesome5
            name={selectedIconName}
            size={20}
            color="#fff"
            {...iconProps}
          />
        </View>
        <View>
          <Text className="text-white capitalize">
            {selectedIconName.replace(/-/g, " ")}
          </Text>
          <Text className="text-gray-400 text-xs">
            {selectedIconStyle} style
          </Text>
        </View>
      </View>
    );
  };

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

      {/* Date */}
      <View className="mb-4">
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

      {/* Icon Selection */}
      <View className="mb-6">
        <Text className="text-white text-base font-semibold mb-3">
          Select Icon
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIconModal(true);
          }}
          className="flex-row items-center justify-between border border-[#C49F59] rounded-xl px-4 py-4 bg-[#1F1E2C]/50"
          activeOpacity={0.7}
        >
          {selectedIconName ? (
            renderSelectedIcon()
          ) : (
            <View className="flex-row items-center">
              <View className="bg-[#2A2940] p-2 rounded-lg mr-3">
                <FontAwesome5 name="icons" size={18} color="#aaa" />
              </View>
              <Text className="text-gray-400">Choose an icon</Text>
            </View>
          )}
          <FontAwesome5
            name={selectedIconName ? "edit" : "chevron-right"}
            size={16}
            color={selectedIconName ? "#C49F59" : "#fff"}
          />
        </TouchableOpacity>
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

        <View className="mt-[4%]">
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={["#B08A4A", "#E0B66A"]}
              style={{ borderRadius: 8 }}
              className="  py-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Save</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center"
          >
            <Text className="text-white font-Inter font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>

        <ColorPickerModal
          visible={showColorPicker}
          initialColor={color}
          onClose={() => setShowColorPicker(false)}
          onSelectColor={setColor}
        />

        {/* Icon Selector Modal */}
        <IconSelector
          visible={iconModal}
          onClose={() => setIconModal(false)}
          onSelect={handleIconSelect}
        />
      </View>
    </View>
  );
};

export default AddNewAccountForm;
