import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import ColorPickerModal from "@/src/component/balance/ColorPickerModal";
import CustomAlert from "@/src/component/customAlart/CustomAlert";
import CustomDatePicker from "@/src/component/custompicker/CustomDatePicker";
import IconSelector from "@/src/component/goals/IconSelector";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import {
  useEditBorrowedformMutation,
  useEditgoalformMutation,
  useEditLentformMutation,
  useGetSingleBorrowedDetailsQuery,
  useGetSingleGoalDetailsQuery,
  useGetSingleLentDetailsQuery,
} from "@/src/redux/api/Page/Goals/goalsApi";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

// Types
type CategoryType = {
  title: string;
  image: any;
};

type AlertType = "success" | "error" | "warning" | "info";

interface GoalFormData {
  name: string;
  targetAmount: number;
  category: string;
  accumulatedAmount: number;
  icon: string;
  color: string;
  date: string;
  notes: string;
}

interface BorrowedFormData {
  name: string;
  notes: string;
  icon: string;
  color: string;
  total: number;
  accumulatedAmount: number;
  lender: string;
  debtDate: string;
  payoffDate: string;
}

interface LentFormData {
  name: string;
  notes: string;
  icon: string;
  color: string;
  total: number;
  accumulatedAmount: number;
  lender: string;
  lentDate: string;
  payoffDate: string;
}

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

const Editgoalform = () => {
  const params = useLocalSearchParams();
  const { id, category } = params;
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();

  // Ensure id is a string
  const itemId = Array.isArray(id) ? id[0] : id;

  // API Queries
  const { data: goalData, isLoading: goalLoading } =
    useGetSingleGoalDetailsQuery(category === "goal" ? itemId : skipToken);
  const { data: borrowedData, isLoading: borrowedLoading } =
    useGetSingleBorrowedDetailsQuery(
      category === "borrowed" ? itemId : skipToken,
    );
  const { data: lentData, isLoading: lentLoading } =
    useGetSingleLentDetailsQuery(category === "lent" ? itemId : skipToken);

  // API Mutations
  const [editGoal, { isLoading: editGoalLoading }] = useEditgoalformMutation();
  const [editBorrowed, { isLoading: editBorrowedLoading }] =
    useEditBorrowedformMutation();
  const [editLent, { isLoading: editLentformLoading }] =
    useEditLentformMutation();

  // Determine active data and loading state
  const getActiveData = () => {
    if (category === "goal")
      return { data: goalData?.data, loading: goalLoading };
    if (category === "borrowed")
      return { data: borrowedData?.data, loading: borrowedLoading };
    if (category === "lent")
      return { data: lentData?.data, loading: lentLoading };
    return { data: null, loading: false };
  };

  const { data: activeData, loading: isLoading } = getActiveData();

  // Form States
  const [color, setColor] = useState("#C49F59");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [accumulatedAmount, setAccumulatedAmount] = useState(0);
  const [noteD, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [categoryModal, setCategoryModal] = useState(false);
  const [advanceModal, setAdvanceModal] = useState(false);

  // Currency States (keeping these for UI but not sending to API)
  const [currency, setCurrency] = useState(
    getProfileData?.data?.currency || "",
  );
  const [showCurrency, setShowCurrency] = useState(false);
  const [accumulatcurrency, setAccumulatCurrency] = useState(
    getProfileData?.data?.currency || "",
  );
  const [showAccumulatCurrency, setAccumulatShowCurrency] = useState(false);

  // Date States
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("");

  // Icon States
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedIconStyle, setSelectedIconStyle] = useState<string>("solid");
  const [iconModal, setIconModal] = useState(false);

  // Borrow/Lent Specific States
  const [lenderName, setLenderName] = useState("");
  const [lentDate, setLentDate] = useState("");
  const [showCalendarLent, setShowCalendarLent] = useState(false);
  const [payoffDate, setPayoffDate] = useState("");
  const [showCalendarPayoff, setShowCalendarPayoff] = useState(false);

  // Alert States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("info");

  // Initialize form with existing data
  useEffect(() => {
    if (activeData) {
      console.log("Active Data:", activeData); // Debug log

      const account = activeData;
      setName(account.name || "");
      setNote(account.notes || "");
      setSelectedIconName(account.icon || "");
      setColor(account.color || "#C49F59");
      setAccumulatedAmount(account.accumulatedAmount || 0);

      if (category === "goal") {
        setTargetAmount(account.targetAmount || 0);

        // Find matching category
        const matchedCategory = dataOfCategory.find(
          (item) => item.title === account.category,
        );

        setSelectedCategory({
          title: account.category || "",
          image: matchedCategory?.image || BudgetImg.Other,
        });

        // Format date to YYYY-MM-DD
        setDate(account.date ? account.date.split("T")[0] : "");
      } else if (category === "borrowed") {
        setTargetAmount(account.total || 0);
        setLenderName(account.lender || "");
        setLentDate(account.debtDate ? account.debtDate.split("T")[0] : "");
        setPayoffDate(
          account.payoffDate ? account.payoffDate.split("T")[0] : "",
        );
      } else if (category === "lent") {
        setTargetAmount(account.total || 0);
        setLenderName(account.lender || "");
        setLentDate(account.lentDate ? account.lentDate.split("T")[0] : "");
        setPayoffDate(
          account.payoffDate ? account.payoffDate.split("T")[0] : "",
        );
      }
    }
  }, [activeData, category]);

  // Helper Functions
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Select a date";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(iconName);
    setIconModal(false);
  };

  const getButtonText = () => {
    switch (category) {
      case "lent":
        return "Edit Lent Amount";
      case "borrowed":
        return "Edit Borrowed Amount";
      case "goal":
        return "Edit Financial Goal";
      default:
        return "Edit";
    }
  };

  const getMutationLoading = () => {
    if (category === "goal") return editGoalLoading;
    if (category === "borrowed") return editBorrowedLoading;
    if (category === "lent") return editLentformLoading;
    return false;
  };

  // Validation
  const validateForm = (): boolean => {
    if (!name.trim()) {
      showAlert("Validation Error", "Name is required", "error");
      return false;
    }

    if (targetAmount <= 0) {
      showAlert("Validation Error", "Amount must be greater than 0", "error");
      return false;
    }

    if (category === "goal" && !selectedCategory) {
      showAlert("Validation Error", "Please select a category", "error");
      return false;
    }

    if (
      (category === "borrowed" || category === "lent") &&
      !lenderName.trim()
    ) {
      showAlert("Validation Error", "Lender name is required", "error");
      return false;
    }

    return true;
  };

  const showAlert = (title: string, message: string, type: AlertType) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Double-check that we have an ID
    if (!itemId) {
      showAlert("Error", "Invalid item ID", "error");
      return;
    }

    try {
      let response;

      // Format dates properly - ensure they're in ISO format
      const formattedDate = date
        ? new Date(date).toISOString()
        : new Date().toISOString();
      const formattedLentDate = lentDate
        ? new Date(lentDate).toISOString()
        : new Date().toISOString();
      const formattedPayoffDate = payoffDate
        ? new Date(payoffDate).toISOString()
        : new Date().toISOString();

      console.log("Submitting with ID:", itemId); // Debug log

      if (category === "goal") {
        const goalData: GoalFormData = {
          name: name.trim(),
          targetAmount: targetAmount,
          category: selectedCategory?.title || "",
          accumulatedAmount: accumulatedAmount,
          icon: selectedIconName || "",
          color: color,
          date: formattedDate,
          notes: noteD.trim(),
        };

        console.log("Goal Data:", goalData); // Debug log

        response = await editGoal({
          id: itemId,
          data: goalData,
        }).unwrap();
      } else if (category === "borrowed") {
        const borrowedData: BorrowedFormData = {
          name: name.trim(),
          notes: noteD.trim(),
          icon: selectedIconName || "",
          color: color,
          total: targetAmount,
          accumulatedAmount: accumulatedAmount,
          lender: lenderName.trim(),
          debtDate: formattedLentDate,
          payoffDate: formattedPayoffDate,
        };

        console.log("Borrowed Data:", borrowedData); // Debug log

        response = await editBorrowed({
          id: itemId,
          data: borrowedData,
        }).unwrap();
      } else if (category === "lent") {
        const lentData: LentFormData = {
          name: name.trim(),
          notes: noteD.trim(),
          icon: selectedIconName || "",
          color: color,
          total: targetAmount,
          accumulatedAmount: accumulatedAmount,
          lender: lenderName.trim(),
          lentDate: formattedLentDate,
          payoffDate: formattedPayoffDate,
        };

        console.log("Lent Data:", lentData); // Debug log

        response = await editLent({
          id: itemId,
          data: lentData,
        }).unwrap();
      }

      if (response?.success) {
        showAlert(
          "Success",
          response.message || "Updated successfully",
          "success",
        );

        // Navigate back after success
        setTimeout(() => {
          setAlertVisible(false);
          router.back();
        }, 1500);
      } else {
        showAlert("Error", response?.message || "Failed to update", "error");
      }
    } catch (error: any) {
      console.error("Update Error Details:", JSON.stringify(error, null, 2));

      // Handle specific error cases
      if (error?.status === 404) {
        showAlert(
          "Error",
          `The ${category} record was not found. It may have been deleted.`,
          "error",
        );
      } else {
        showAlert(
          "Error",
          error?.data?.message || "An unexpected error occurred",
          "error",
        );
      }
    }
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

  // Loading State
  if (isLoading) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#D4AF66" />
          <Text className="text-white mt-4">Loading...</Text>
        </View>
      </GradientBackground>
    );
  }

  const isSubmitting = getMutationLoading();

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-4 px-[5%] mt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
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
          <ScrollView
            className="flex-1 px-[5%]"
            showsVerticalScrollIndicator={false}
          >
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
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Amount */}
            <View>
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                {category === "goal" ? "Target Amount" : "Amount"}
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
                    editable={!isSubmitting}
                  />
                </View>

                <View className="relative">
                  <Pressable
                    onPress={() => setShowCurrency(!showCurrency)}
                    disabled={isSubmitting}
                  >
                    <View className="bg-[#584C2F] px-4 py-5 rounded-lg flex-row items-center">
                      <Text className="text-white font-Inter text-sm">
                        {currency}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Category - Only for goals */}
            {category === "goal" && (
              <View className="mt-5">
                <Text className="text-white text-base mb-2">Category</Text>

                <TouchableOpacity
                  onPress={() => setCategoryModal(true)}
                  className="flex-row items-center justify-between border border-[#C49F59] rounded-xl px-4 py-4"
                  disabled={isSubmitting}
                >
                  {selectedCategory ? (
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={selectedCategory.image}
                        className="w-8 h-8"
                      />
                      <Text className="text-white">
                        {selectedCategory.title}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-gray-400">Select category</Text>
                  )}

                  <FontAwesome5 name="chevron-down" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

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
                    editable={!isSubmitting}
                  />
                </View>

                <View className="relative">
                  <Pressable
                    onPress={() =>
                      setAccumulatShowCurrency(!showAccumulatCurrency)
                    }
                    disabled={isSubmitting}
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

            {/* Lender Details - Only for lent/borrowed */}
            {(category === "lent" || category === "borrowed") && (
              <View className="mb-4">
                <View className="">
                  <Text className="text-white text-base my-2">Lender Name</Text>
                  <View className="border border-[#C49F59] rounded-xl px-4 py-2">
                    <TextInput
                      value={lenderName}
                      placeholder="Enter Lender Name"
                      placeholderTextColor="#aaa"
                      className="text-white"
                      onChangeText={setLenderName}
                      editable={!isSubmitting}
                    />
                  </View>
                </View>

                <View className="flex-row items-center mb-2">
                  <Text className="text-white text-base font-semibold">
                    {category === "borrowed" ? "Borrowed Date" : "Lent Date"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowCalendarLent(true)}
                  className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
                  disabled={isSubmitting}
                >
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={18} color="#C49F59" />
                    <Text className="text-white ml-3">
                      {lentDate ? formatDate(lentDate) : "Select a date"}
                    </Text>
                  </View>
                  <Feather name="chevron-down" size={18} color="#fff" />
                </TouchableOpacity>

                <View className="flex-row items-center mb-2">
                  <Text className="text-white text-base font-semibold">
                    Pay Off Date
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowCalendarPayoff(true)}
                  className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
                  disabled={isSubmitting}
                >
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={18} color="#C49F59" />
                    <Text className="text-white ml-3">
                      {payoffDate ? formatDate(payoffDate) : "Select a date"}
                    </Text>
                  </View>
                  <Feather name="chevron-down" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* Advanced Settings */}
            <TouchableOpacity
              onPress={() => setAdvanceModal(true)}
              className="flex-row mt-[2%] items-center justify-between"
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <LinearGradient
                  colors={
                    isSubmitting ? ["#666", "#888"] : ["#B08A4A", "#E0B66A"]
                  }
                  style={{ borderRadius: 8 }}
                  className="py-4 items-center"
                >
                  {isSubmitting ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="#fff" />
                      <Text className="text-white font-semibold text-base ml-2">
                        Updating...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Update
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center"
                disabled={isSubmitting}
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

        {/* Advanced Settings Modal */}
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
                  Customize your {category?.toLowerCase() || "item"} further
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Icon Selection */}
                <View className="mb-4">
                  <Text className="text-white text-base font-semibold mb-2">
                    Icon
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIconModal(true);
                      setAdvanceModal(false);
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

                {/* Date Selection - Only for goals */}
                {category === "goal" && (
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-white text-base font-semibold">
                        Target Date
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setShowDate(true);
                        setAdvanceModal(false);
                      }}
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
                )}

                {/* Color Selection */}
                <View className="mb-4">
                  <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                    Choose a color
                  </Text>
                  <Pressable
                    onPress={() => {
                      setShowColorPicker(true);
                      setAdvanceModal(false);
                    }}
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
                    Add additional details or reminders
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
                      editable={!isSubmitting}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-col gap-4 space-y-3 mb-2">
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

        {/* Alert */}
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
          type={alertType}
          confirmText="OK"
        />

        {/* Icon Selector Modal */}
        <IconSelector
          visible={iconModal}
          onClose={() => setIconModal(false)}
          onSelect={handleIconSelect}
        />

        {/* Color Picker Modal */}
        <ColorPickerModal
          visible={showColorPicker}
          initialColor={color}
          onClose={() => setShowColorPicker(false)}
          onSelectColor={(selectedColor) => {
            setColor(selectedColor);
            setShowColorPicker(false);
          }}
        />

        {/* Date Pickers */}
        <CustomDatePicker
          visible={showDate}
          date={date || new Date().toISOString().split("T")[0]}
          onClose={() => setShowDate(false)}
          onConfirm={(selected) => {
            setDate(selected);
            setShowDate(false);
          }}
        />

        <CustomDatePicker
          visible={showCalendarLent}
          date={lentDate || new Date().toISOString().split("T")[0]}
          onClose={() => setShowCalendarLent(false)}
          onConfirm={(selected) => {
            setLentDate(selected);
            setShowCalendarLent(false);
          }}
        />

        <CustomDatePicker
          visible={showCalendarPayoff}
          date={payoffDate || new Date().toISOString().split("T")[0]}
          onClose={() => setShowCalendarPayoff(false)}
          onConfirm={(selected) => {
            setPayoffDate(selected);
            setShowCalendarPayoff(false);
          }}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Editgoalform;
