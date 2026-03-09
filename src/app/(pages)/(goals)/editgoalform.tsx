import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import ColorPickerModal from "@/src/component/balance/ColorPickerModal";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import IconSelector from "@/src/component/goals/IconSelector";
import {
  usePostBorrowedAddNewGoalMutation,
  usePostGoalsAddNewGoalMutation,
  usePostLentAddNewGoalMutation,
} from "@/src/redux/api/Page/Goals/goalsApi";
import { RootState } from "@/src/redux/store";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
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

// Additional fields for borrowed/lent
type AdditionalFields = {
  lender: string;
  debtDate?: string;
  lentDate?: string;
  payoffDate?: string;
};

const Editgoalform = () => {
  const params = useLocalSearchParams();
  const category = params.category as string;

  // Color
  const [color, setColor] = useState("#C49F59");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [noteD, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [categoryModal, setCategoryModal] = useState(false);
  const [advanceModal, setAdvanceModal] = useState(false);

  // Additional fields for borrowed/lent
  const [lender, setLender] = useState("");
  const [payoffDate, setPayoffDate] = useState("");

  const buttoncategory = useSelector(
    (state: RootState) => state.user.buttonCatagory,
  );

  // Currency
  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const [accumulatcurrency, setAccumulatCurrency] = useState("USD");
  const [showAccumulatCurrency, setAccumulatShowCurrency] = useState(false);

  // Date
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("");

  // Icon
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedIconStyle, setSelectedIconStyle] = useState<string>("solid");
  const [iconModal, setIconModal] = useState(false);

  // API mutations
  const [postGoalsAddNewGoal, { isLoading: isGoalsLoading }] =
    usePostGoalsAddNewGoalMutation();
  const [postBorrowedAddNewGoal, { isLoading: isBorrowedLoading }] =
    usePostBorrowedAddNewGoalMutation();
  const [postLentAddNewGoal, { isLoading: isLentLoading }] =
    usePostLentAddNewGoalMutation();

  // Loading state
  const isLoading = isGoalsLoading || isBorrowedLoading || isLentLoading;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Select a date";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(iconName);
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

  const getButtonText = () => {
    switch (category) {
      case "LENT":
        return "Record Lent Amount";
      case "BORROWED":
        return "Record Borrowed Amount";
      case "GOALS":
        return "Create a Financial Goal";
      default:
        return "";
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter a name");
      return false;
    }

    if (targetAmount <= 0) {
      Alert.alert("Validation Error", "Please enter a valid amount");
      return false;
    }

    if (!selectedCategory) {
      Alert.alert("Validation Error", "Please select a category");
      return false;
    }

    if ((category === "BORROWED" || category === "LENT") && !lender.trim()) {
      Alert.alert("Validation Error", "Please enter the lender/borrower name");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const baseData = {
        name: name.trim(),
        targetAmount,
        currency,
        category: selectedCategory?.title || "Other",
        accumulatedAmount,
        icon: selectedIconName || "🎯",
        color,
        ...(date && { date }), // Only include if date is set
        notes: noteD.trim() || undefined,
      };

      let response;
      let successMessage = "";

      switch (category) {
        case "GOALS":
          response = await postGoalsAddNewGoal(baseData).unwrap();
          successMessage = "Goal created successfully!";
          break;

        case "BORROWED":
          response = await postBorrowedAddNewGoal({
            ...baseData,
            amount: targetAmount,
            lender: lender.trim(),
            debtDate: date || new Date().toISOString().split("T")[0],
            ...(payoffDate && { payoffDate }),
          }).unwrap();
          successMessage = "Borrowed record created successfully!";
          break;

        case "LENT":
          response = await postLentAddNewGoal({
            ...baseData,
            amount: targetAmount,
            lender: lender.trim(),
            lentDate: date || new Date().toISOString().split("T")[0],
            ...(payoffDate && { payoffDate }),
          }).unwrap();
          successMessage = "Lent record created successfully!";
          break;

        default:
          throw new Error("Invalid category");
      }

      console.log("Success response:", response);

      Alert.alert("Success", successMessage, [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Error creating record:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to create record. Please try again.",
      );
    }
  };

  // Determine if we need to show lender field
  const showLenderField = category === "BORROWED" || category === "LENT";

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
            {getButtonText()}
          </Text>
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-[5%]">
            {/* Name */}
            <View className="pt-[8%]">
              <Text className="text-white text-base my-2">Name</Text>
              <View className="border border-[#C49F59] rounded-xl px-4 py-2">
                <TextInput
                  placeholder="Enter name"
                  placeholderTextColor="#aaa"
                  className="text-white"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Lender Field (for Borrowed/Lent) */}
            {showLenderField && (
              <View>
                <Text className="text-white text-base my-2">
                  {category === "BORROWED" ? "Lender Name" : "Borrower Name"}
                </Text>
                <View className="border border-[#C49F59] rounded-xl px-4 py-2">
                  <TextInput
                    placeholder={
                      category === "BORROWED"
                        ? "Enter lender name"
                        : "Enter borrower name"
                    }
                    placeholderTextColor="#aaa"
                    className="text-white"
                    value={lender}
                    onChangeText={setLender}
                  />
                </View>
              </View>
            )}

            {/* Amount */}
            <View>
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                {category === "GOALS" ? "Target Amount" : "Amount"}
              </Text>
              <View className="flex-row gap-[3%]">
                <View className="flex-1 bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor="#F1F1F2"
                    keyboardType="numeric"
                    className="text-white text-base"
                    value={targetAmount.toString()}
                    onChangeText={(text) => setTargetAmount(Number(text) || 0)}
                  />
                </View>

                <View className="relative">
                  <Pressable onPress={() => setShowCurrency(!showCurrency)}>
                    <View className="bg-[#584C2F] px-4 py-5 rounded-lg flex-row items-center">
                      <Text className="text-white font-Inter text-sm">
                        {currency}
                      </Text>
                    </View>
                  </Pressable>
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
                {selectedCategory ? (
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={selectedCategory.image}
                      className="w-8 h-8"
                    />
                    <Text className="text-white">{selectedCategory.title}</Text>
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
                Accumulated amount
              </Text>
              <View className="flex-row gap-[3%]">
                <View className="flex-1 bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor="#F1F1F2"
                    keyboardType="numeric"
                    className="text-white text-base"
                    value={accumulatedAmount.toString()}
                    onChangeText={(text) =>
                      setAccumulatedAmount(Number(text) || 0)
                    }
                  />
                </View>

                <View className="relative">
                  <Pressable
                    onPress={() =>
                      setAccumulatShowCurrency(!showAccumulatCurrency)
                    }
                  >
                    <View className="bg-[#584C2F] px-4 py-5 rounded-lg flex-row items-center">
                      <Text className="text-white font-Inter text-sm">
                        {accumulatcurrency}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>

            <Text className="text-xs text-white font-Inter mt-[2%] mb-[4%]">
              Enter the amount you already{" "}
              {category === "GOALS" ? "saved for this goal" : "paid/received"}
            </Text>

            <TouchableOpacity
              onPress={() => setAdvanceModal(true)}
              className="flex-row mt-[2%] items-center justify-between"
            >
              <Text className="font-Inter text-white text-lg font-bold">
                Advanced settings
              </Text>
              <Octicons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>

            {/* Buttons */}
            <View className="mt-[14%] mb-10">
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 8, opacity: isLoading ? 0.7 : 1 }}
                  className="py-4 items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Create
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center"
                disabled={isLoading}
              >
                <Text className="text-white font-Inter font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

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
                        setSelectedCategory(item);
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
            <View className="bg-[#1F1E2C] border border-[#C49F59] rounded-3xl p-6 mx-auto w-[85%] max-h-[80%]">
              {/* Header */}
              <View className="mb-6">
                <Text className="text-white text-xl font-bold mb-1">
                  Additional Details
                </Text>
                <Text className="text-gray-400 text-sm">
                  Customize your {category.toLowerCase()} further
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Icon Selection */}
                <View className="mb-4">
                  <Text className="text-white text-base font-semibold mb-2">
                    Icon
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIconModal(true)}
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
                        <Text className="text-gray-400">Select an icon</Text>
                      </View>
                    )}
                    <FontAwesome5
                      name={selectedIconName ? "edit" : "chevron-right"}
                      size={16}
                      color={selectedIconName ? "#C49F59" : "#fff"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Date Selection */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-white text-base font-semibold">
                      {category === "GOALS"
                        ? "Target Date"
                        : "Transaction Date"}
                    </Text>
                    <View className="bg-[#C49F59]/20 px-2 py-1 rounded ml-2">
                      <Text className="text-[#C49F59] text-xs">Optional</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowDate(true)}
                    className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
                  >
                    <View className="flex-row items-center">
                      <Feather name="calendar" size={18} color="#C49F59" />
                      <Text className="text-white ml-3">
                        {date ? formatDate(date) : "Select a date"}
                      </Text>
                    </View>
                    <Feather name="chevron-down" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Payoff Date for Borrowed/Lent */}
                {(category === "BORROWED" || category === "LENT") && (
                  <View className="mb-4">
                    <Text className="text-white text-base font-semibold mb-2">
                      Payoff Date
                    </Text>
                    <Text className="text-gray-400 text-xs mb-3">
                      When is this expected to be paid off? (Optional)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // You can add a separate date picker for payoff date
                        // For now, we'll use a simple input
                      }}
                      className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
                    >
                      <TextInput
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#666"
                        className="text-white flex-1"
                        value={payoffDate}
                        onChangeText={setPayoffDate}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Color Selection */}
                <View className="mb-4">
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
                </View>

                {/* Notes */}
                <View className="mb-8">
                  <Text className="text-white text-base font-semibold mb-2">
                    Notes
                  </Text>
                  <Text className="text-gray-400 text-xs mb-3">
                    Add additional details or reminders (optional)
                  </Text>
                  <View className="bg-transparent border border-[#C49F59] rounded-xl px-4 py-3">
                    <TextInput
                      placeholder="Write your notes here..."
                      placeholderTextColor="#666"
                      className="text-white"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      style={{ minHeight: 100 }}
                      onChangeText={setNote}
                      value={noteD}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-col space-y-3 mb-2">
                  <TouchableOpacity
                    onPress={() => setAdvanceModal(false)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#B08A4A", "#E0B66A"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 12 }}
                      className="py-4 items-center"
                    >
                      <Text className="text-white font-bold text-base">
                        Apply Settings
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAdvanceModal(false)}
                    className="py-4 rounded-xl border border-[#C49F59]/30 bg-white/5 items-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-300 font-medium">Cancel</Text>
                  </TouchableOpacity>
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

        <ColorPickerModal
          visible={showColorPicker}
          initialColor={color}
          onClose={() => setShowColorPicker(false)}
          onSelectColor={setColor}
        />

        {/* Date Picker */}
        <CustomDatePicker
          visible={showDate}
          date={date || new Date().toISOString().split("T")[0]}
          onClose={() => setShowDate(false)}
          onConfirm={(selected) => {
            setDate(selected);
            setShowDate(false);
          }}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Editgoalform;
