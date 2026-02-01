import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import IconSelector from "@/src/component/goals/IconSelector";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

type CategoryType = {
  title: string;
  image: any;
};

const dataOfCategory: CategoryType[] = [
  { title: "Supermarket", image: BudgetImg.supermarket },
  { title: "Clothing", image: BudgetImg.clothing },
  { title: "House", image: BudgetImg.house },
  { title: "Entertainment", image: BudgetImg.entertainment },
  { title: "Transport", image: BudgetImg.Transport },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Travel", image: BudgetImg.Travel },
  { title: "Education", image: BudgetImg.Education },
  { title: "Food", image: BudgetImg.Food },
  { title: "Work", image: BudgetImg.Work },
  { title: "Electronics", image: BudgetImg.Electronics },
  { title: "Sport", image: BudgetImg.Sport },
  { title: "Restaurant", image: BudgetImg.Restaurant },
  { title: "Health", image: BudgetImg.Health },
  { title: "Communications", image: BudgetImg.Communications },
  { title: "Other", image: BudgetImg.Other },
];

const CreateForm = () => {
  const dispatch = useAppDispatch();
  const { selectedIcon } = useAppSelector((state) => state.icons);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [advanceModal, setAdvanceModal] = useState(false);

  const buttoncategory = useSelector(
    (state: RootState) => state.user.buttonCatagory,
  );
  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD"];
  //   Accumulated amount

  const [accumulatcurrency, setAccumulatCurrency] = useState("USD");
  const [showAccumulatCurrency, setAccumulatShowCurrency] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("2026-01-18");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  //   icon
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedIconStyle, setSelectedIconStyle] = useState<string>("solid");
  const [iconModal, setIconModal] = useState(false);

  const handleIconSelect = (iconName: string, style: string) => {
    setSelectedIconName(iconName);
    setSelectedIconStyle(style);
  };

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
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-4 px-[5%] mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white font-Inter text-xl font-bold">
            Create a {buttoncategory.toLowerCase()}
          </Text>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-[5%]">
          {/* Name */}
          <View className="pt-[8%]">
            <Text className="text-white text-base my-2">Name</Text>
            <View className="border border-[#C49F59] rounded-xl px-4 py-2">
              <TextInput
                placeholder="Enter name"
                placeholderTextColor="#aaa"
                className="text-white"
              />
            </View>
          </View>

          {/* target Amount */}
          <View>
            <Text className="text-[#FFFFFF] text-base font-Inter my-2">
              Target Amount
            </Text>
            <View className="flex-row gap-[3%]">
              <View className="flex-1  bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2">
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor="#F1F1F2"
                  keyboardType="numeric"
                  className="text-white text-base"
                />
              </View>

              <View className="relative">
                <Pressable onPress={() => setShowCurrency(!showCurrency)}>
                  <View className="bg-[#584C2F]  px-4 py-5 rounded-lg flex-row items-center">
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
            </View>
          </View>

          {/* Category */}
          <View className="mt-5">
            <Text className="text-white text-base mb-2">Category</Text>

            <TouchableOpacity
              onPress={() => setCategoryModal(true)}
              className="flex-row items-center justify-between border border-[#C49F59] rounded-xl px-4 py-4"
            >
              {category ? (
                <View className="flex-row items-center gap-3">
                  <Image source={category.image} className="w-8 h-8" />
                  <Text className="text-white">{category.title}</Text>
                </View>
              ) : (
                <Text className="text-gray-400">Select category</Text>
              )}

              <FontAwesome5 name="chevron-down" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Accumulated amount */}

          <View>
            <Text className="text-[#FFFFFF] text-base font-Inter my-2">
              Target Amount
            </Text>
            <View className="flex-row gap-[3%]">
              <View className="flex-1  bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2">
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor="#F1F1F2"
                  keyboardType="numeric"
                  className="text-white text-base"
                />
              </View>

              <View className="relative">
                <Pressable
                  onPress={() =>
                    setAccumulatShowCurrency(!showAccumulatCurrency)
                  }
                >
                  <View className="bg-[#584C2F]  px-4 py-5 rounded-lg flex-row items-center">
                    <Text className="text-white font-Inter text-sm">
                      {accumulatcurrency}
                    </Text>
                    <Entypo name="chevron-down" size={20} color="#fff" />
                  </View>
                </Pressable>

                {showAccumulatCurrency && (
                  <View className="absolute right-0 top-12 bg-[#584C2F] rounded-lg border border-[#4F4F59] overflow-hidden z-50">
                    {currencyOptions.map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => {
                          setAccumulatCurrency(c);
                          setAccumulatShowCurrency(false);
                        }}
                        className="px-2 py-2"
                      >
                        <Text
                          className={`text-sm font-Inter ${
                            accumulatcurrency === c
                              ? "text-[#FAD885]"
                              : "text-white"
                          }`}
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

          <Text className="text-xs text-white font-Inter mt-[2%] mb-[4%]">
            Enter the amount you already saved for this goal
          </Text>

          <TouchableOpacity
            onPress={() => setAdvanceModal(true)}
            className="flex-row mt-[2%] items-center justify-between"
          >
            <Text className="font-Inter text-white text-lg font-bold">
              Advanced setting
            </Text>
            <Octicons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          {/* Buttons */}
          <View className="mt-[14%]">
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={["#B08A4A", "#E0B66A"]}
                style={{ borderRadius: 8 }}
                className="  py-4 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  Create
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center">
              <Text className="text-white font-Inter font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Category Modal */}
        <Modal visible={categoryModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/70 justify-end">
            <View className="bg-[#1F1E2C] rounded-t-3xl p-5 max-h-[70%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-bold">
                  Select Category
                </Text>
                <TouchableOpacity onPress={() => setCategoryModal(false)}>
                  <FontAwesome5 name="times" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View className="flex-row flex-wrap justify-between">
                  {dataOfCategory.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setCategory(item);
                        setCategoryModal(false);
                      }}
                      className="w-[48%] flex-row items-center gap-3 border border-[#3A3950] rounded-xl p-3 mb-3"
                    >
                      <Image source={item.image} className="w-8 h-8" />
                      <Text className="text-white">{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Advance setting modal */}
        <Modal visible={advanceModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/70 justify-center">
            <Pressable
              className="flex-1 absolute inset-0"
              onPress={() => setAdvanceModal(false)}
            />
            <View className="bg-[#1F1E2C] border border-[#C49F59] rounded-3xl p-5 mx-auto w-[85%] max-h-[70%]">
              <ScrollView>
                {/* Icon Selection */}
                <View className="mb-6">
                  <Text className="text-white text-base font-semibold mb-3">
                    Select Icon
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setAdvanceModal(false);
                      setTimeout(() => setIconModal(true), 300);
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

                  {selectedIconName && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedIconName(null);
                        setSelectedIconStyle("solid");
                      }}
                      className="mt-2 self-start"
                    >
                      <Text className="text-red-400 text-sm">Remove icon</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Date */}
                <View className="mb-6">
                  <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                    Date
                  </Text>

                  <TouchableOpacity
                    onPress={() => setShowDate(true)}
                    className="flex-row items-center justify-between bg-transparent  border border-[#C49F59] rounded-xl px-4 py-4"
                  >
                    <Text className="text-white">{formatDate(date)}</Text>
                    <Feather name="calendar" size={18} color="#fff" />
                  </TouchableOpacity>

                  <CustomDatePicker
                    visible={showDate}
                    date={date}
                    onClose={() => setShowDate(false)}
                    onConfirm={(selected) => {
                      setDate(selected);
                      setShowDate(false);
                    }}
                  />
                </View>

                {/* Note */}
                <View className="mb-6">
                  <Text className="text-white text-base font-semibold mb-3">
                    Note
                  </Text>
                  <View className="bg-transparent border border-[#C49F59] rounded-xl px-4 py-3">
                    <TextInput
                      placeholder="Add a note..."
                      placeholderTextColor="#aaa"
                      className="text-white"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      style={{ minHeight: 100 }}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Icon Selector Modal */}
        <IconSelector
          visible={iconModal}
          onClose={() => setIconModal(false)}
          onSelect={handleIconSelect}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default CreateForm;
