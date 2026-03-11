import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { usePostBalanceAddNewAccountMutation } from "@/src/redux/api/Page/Balance/balanceApi";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../customAlart/CustomAlert";
import CustomDatePicker from "../custompicker/CustomDatePicker";
import IconSelector from "../goals/IconSelector";
import ColorPickerModal from "./ColorPickerModal";

// Account type options
const ACCOUNT_TYPES = [
  { id: "1", label: "Savings", value: "Savings" },
  { id: "2", label: "Checking", value: "Checking" },
  { id: "3", label: "Credit Card", value: "Credit Card" },
  { id: "4", label: "Investment", value: "Investment" },
  { id: "5", label: "Cash", value: "Cash" },
  { id: "6", label: "Loan", value: "Loan" },
  { id: "7", label: "Insurance", value: "Insurance" },
  { id: "8", label: "Other", value: "Other" },
];

const AddNewAccountForm = () => {
  // API mutation
  const [addNewAccount, { isLoading }] = usePostBalanceAddNewAccountMutation();
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  // alter state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [notes, setNotes] = useState("");
  const [accountType, setAccountType] = useState("Savings"); // Default value
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  // Color state
  const [color, setColor] = useState("#C49F59");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Currency state
  const [currency] = useState("USD");

  // Date state
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });

  // Icon state
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedIconStyle, setSelectedIconStyle] = useState<string>("solid");
  const [iconModal, setIconModal] = useState(false);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(iconName);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setAlertVisible(true);
      setAlertTittle("Validation Error");
      setAlertMessage("Please enter an account name");
      setAlertType("error");
      // Alert.alert("Validation Error", "Please enter an account name");
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAlertVisible(true);
      setAlertTittle("Validation Error");
      setAlertMessage("Please enter a valid amount");
      setAlertType("error");
      // Alert.alert("Validation Error", "Please enter a valid amount");
      return false;
    }
    if (!selectedIconName) {
      setAlertVisible(true);
      setAlertTittle("Validation Error");
      setAlertMessage("Please select an icon");
      setAlertType("error");
      // Alert.alert("Validation Error", "Please select an icon");
      return false;
    }
    if (!accountType) {
      setAlertVisible(true);
      setAlertTittle("Validation Error");
      setAlertMessage("Please select an account type");
      setAlertType("error");
      // Alert.alert("Validation Error", "Please select an account type");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const accountData = {
        name: name.trim(),
        amount: parseFloat(amount),
        creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
        lastUpdated: date,
        icon: selectedIconName,
        accountType: accountType,
        color: color,
        notes: notes.trim() || "This is notes",
      };

      console.log("Creating account with data:", accountData);

      const response = await addNewAccount(accountData).unwrap();

      if (response.success) {
        setAlertVisible(true);
        setAlertTittle("Success");
        setAlertMessage(response.message);
        setAlertType("success");
      }
    } catch (error: any) {
      console.error("Error creating account:", error);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to create account. Please try again.";

      setAlertVisible(true);
      setAlertTittle(" Error");
      setAlertMessage(errorMessage);
      setAlertType("error");

      // Alert.alert("Error", errorMessage);
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

  // Account Type Modal
  const AccountTypeModal = () => (
    <Modal
      visible={showAccountTypeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAccountTypeModal(false)}
    >
      <Pressable
        className="flex-1 justify-end bg-black/50"
        onPress={() => setShowAccountTypeModal(false)}
      >
        <View className="bg-[#1A1927] rounded-t-3xl p-5 border-t border-[#C49F59]/30">
          <View className="w-12 h-1 bg-[#C49F59] rounded-full self-center mb-5" />

          <Text className="text-white text-xl font-semibold mb-4">
            Select Account Type
          </Text>

          <FlatList
            data={ACCOUNT_TYPES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setAccountType(item.value);
                  setShowAccountTypeModal(false);
                }}
                className={`py-4 px-3 rounded-lg mb-2 flex-row items-center justify-between ${
                  accountType === item.value
                    ? "bg-[#C49F59]/20 border border-[#C49F59]"
                    : ""
                }`}
              >
                <Text
                  className={`text-base ${
                    accountType === item.value ? "text-[#C49F59]" : "text-white"
                  }`}
                >
                  {item.label}
                </Text>
                {accountType === item.value && (
                  <Feather name="check" size={20} color="#C49F59" />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            className="max-h-80"
          />

          <TouchableOpacity
            onPress={() => setShowAccountTypeModal(false)}
            className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center"
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View>
      {/* Name Input */}
      <View className="border border-[#C49F59] rounded-xl px-4 py-3 mt-6 mb-2">
        <TextInput
          placeholder="Name"
          placeholderTextColor="#CFCFCF"
          className="text-white text-base"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />
      </View>

      {/* Account Type Selection */}
      <View className="mt-4">
        <Text className="text-[#FFFFFF] text-base font-Inter mb-2">
          Account Type
        </Text>
        <TouchableOpacity
          onPress={() => !isLoading && setShowAccountTypeModal(true)}
          className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
          disabled={isLoading}
        >
          <Text
            className={`text-base ${accountType ? "text-white" : "text-gray-400"}`}
          >
            {accountType || "Select account type"}
          </Text>
          <Feather name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <View className="mt-4">
        <Text className="text-[#FFFFFF] text-base font-Inter mb-2">Amount</Text>
        <View className="flex-row gap-[3%]">
          <View className="flex-1 bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#F1F1F2"
              keyboardType="numeric"
              className="text-white text-base"
              value={amount}
              onChangeText={setAmount}
              editable={!isLoading}
            />
          </View>

          <View className="relative">
            <Pressable disabled={isLoading}>
              <View className="bg-[#584C2F] px-4 py-5 rounded-lg flex-row items-center">
                <Text className="text-white font-Inter text-sm">
                  {getProfileData?.data?.currency}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Credit Limit */}
      <View className="mt-4">
        <Text className="text-[#FFFFFF] text-base font-Inter mb-2">
          Credit Limit (Optional)
        </Text>
        <View className="bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
          <TextInput
            placeholder="Enter credit limit"
            placeholderTextColor="#CFCFCF"
            keyboardType="numeric"
            className="text-white text-base"
            value={creditLimit}
            onChangeText={setCreditLimit}
            editable={!isLoading}
          />
        </View>
      </View>

      {/* Date */}
      <View className="mb-4">
        <Text className="text-[#FFFFFF] text-base font-Inter my-2">Date</Text>
        <TouchableOpacity
          onPress={() => !isLoading && setShowDate(true)}
          className="flex-row items-center justify-between bg-transparent border border-[#C49F59] rounded-xl px-4 py-4"
          disabled={isLoading}
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
      <View className="mb-2">
        <Text className="text-white text-base font-semibold mb-3">
          Select Icon
        </Text>
        <TouchableOpacity
          onPress={() => !isLoading && setIconModal(true)}
          className="flex-row items-center justify-between border border-[#C49F59] rounded-xl px-4 py-4 bg-[#1F1E2C]/50"
          activeOpacity={0.7}
          disabled={isLoading}
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
      <View className="">
        <Text className="text-[#FFFFFF] text-base font-Inter my-2">
          Choose a color
        </Text>
        <Pressable
          onPress={() => !isLoading && setShowColorPicker(true)}
          className="flex-row items-center justify-between border border-[#C49F59] rounded-xl px-4 py-4 bg-[#1F1E2C]"
          disabled={isLoading}
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

        {/* Notes Field */}
        <View className="mt-4">
          <Text className="text-[#FFFFFF] text-base font-Inter mb-2">
            Notes (Optional)
          </Text>
          <View className="bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
            <TextInput
              placeholder="Add notes..."
              placeholderTextColor="#CFCFCF"
              multiline
              numberOfLines={3}
              className="text-white text-base"
              value={notes}
              onChangeText={setNotes}
              editable={!isLoading}
            />
          </View>
        </View>

        <View className="mt-[4%]">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
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
                <Text className="text-white font-semibold text-base">Save</Text>
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

        {/* Account Type Modal */}
        <AccountTypeModal />
      </View>
      <CustomAlert
        visible={alertVisible}
        title={alertTittle}
        message={alertMessage}
        onConfirm={() => {
          console.log("Confirmed");
          setAlertVisible(false);
          router.back();
        }}
        // onCancel={() => {
        //   console.log("Cancelled");
        //   setAlertVisible(false);
        // }}
        type={alertType}
        confirmText={"OK"}
        cancelText="Cancel"
      />
    </View>
  );
};

export default AddNewAccountForm;
