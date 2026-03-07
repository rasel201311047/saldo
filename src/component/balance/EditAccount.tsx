import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import {
  useGetBalanceAccountByIdQuery,
  usePutBalanceUpdateByIdMutation,
} from "@/src/redux/api/Page/Balance/balanceApi";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
const getCurrencySymbol = (code?: string) => {
  if (!code) return "";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    BDT: "৳",
    INR: "₹",
    AED: "د.إ",

    RON: "L",
    HUF: "Ft",
    BGN: "лв",
    RSD: "дин",
    UAH: "₴",
    MDL: "L",

    CHF: "CHF",
    PLN: "zł",
    CZK: "Kč",
  };

  return currencySymbols[code] || code;
};

const EditAccount = () => {
  const params = useLocalSearchParams();
  console.log("Edit Account Params:", params?.id);
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  // Get account data
  const { data: balanceData, isLoading: balanceLoading } =
    useGetBalanceAccountByIdQuery(params.id as string);

  // Update mutation
  const [updateBalance, { isLoading: isUpdating }] =
    usePutBalanceUpdateByIdMutation();

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [color, setColor] = useState("#C49F59");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState("");
  const [selectedIconName, setSelectedIconName] = useState<string | null>(null);
  const [selectedIconStyle, setSelectedIconStyle] = useState<string>("solid");
  const [iconModal, setIconModal] = useState(false);
  const [accountType, setAccountType] = useState("Savings");
  //   alter
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Populate form with existing data when loaded
  useEffect(() => {
    if (balanceData?.data) {
      const account = balanceData.data;
      setName(account.name || "");
      setAmount(account.amount?.toString() || "");
      setColor(account.color || "#C49F59");
      setCurrency(account.currency || "USD");
      setAccountType(account.accountType || "Savings");
      setSelectedIconName(account.icon || null);

      // Format date from lastUpdated or createdAt
      if (account.lastUpdated) {
        const dateObj = new Date(account.lastUpdated);
        setDate(dateObj.toISOString().split("T")[0]); // YYYY-MM-DD format
      } else if (account.createdAt) {
        const dateObj = new Date(account.createdAt);
        setDate(dateObj.toISOString().split("T")[0]);
      }
    }
  }, [balanceData]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Select date";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(iconName);
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an account name");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedIconName) {
      Alert.alert("Error", "Please select an icon");
      return;
    }

    try {
      // Prepare update data - only send fields that exist in your API
      const updateData = {
        name: name.trim(),
        amount: parseFloat(amount),
        currency: currency,
        icon: selectedIconName,
        color: color,
        accountType: accountType,
        // Only include if your API accepts these
        ...(date && { lastUpdated: new Date(date).toISOString() }),
      };

      console.log("Updating account with data:", updateData);

      const result = await updateBalance({
        id: params.id as string,
        data: updateData,
      }).unwrap();

      console.log("Update result:", result);

      if (result.success) {
        setAlertVisible(true);
        setAlertTittle("Success");
        setAlertMessage("Account updated successfully!");
        setAlertType("success");
        // Alert.alert("Success", "Account updated successfully!", [
        //   { text: "OK", onPress: () => router.back() },
        // ]);
      } else {
        setAlertVisible(true);
        setAlertTittle("Error");
        setAlertMessage(result.message || "Failed to update account");
        setAlertType("error");
        // Alert.alert("Error", result.message || "Failed to update account");
      }
    } catch (error) {
      console.error("Update error:", error);
      setAlertVisible(true);
      setAlertTittle("Error");
      setAlertMessage(error?.data?.message || "Failed to update account");
      setAlertType("error");
      //   Alert.alert("Error", "An error occurred while updating the account");
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

  if (balanceLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#121212]">
        <ActivityIndicator size="large" color="#C49F59" />
        <Text className="text-white mt-4">Loading account details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Name Input */}
      <View>
        <View className="border border-[#C49F59] rounded-xl px-4 py-3 mt-6">
          <TextInput
            placeholder="Account Name"
            placeholderTextColor="#CFCFCF"
            className="text-white text-base"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text className="text-[#FFFFFF] text-base font-Inter my-2">Amount</Text>
        <View className="flex-row gap-[3%]">
          <View className="flex-1 bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#F1F1F2"
              keyboardType="numeric"
              className="text-white text-base"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View className="relative">
            <Pressable onPress={() => setShowCurrency(!showCurrency)}>
              <View className="bg-[#584C2F] px-4 py-5 rounded-lg flex-row items-center">
                <Text className="text-white font-Inter text-sm">
                  {getProfileData?.data?.currency}
                </Text>
              </View>
            </Pressable>
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
      <View className="mb-2">
        <Text className="text-white text-base font-semibold mb-3">
          Select Icon
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <LinearGradient
              colors={["#B08A4A", "#E0B66A"]}
              style={{ borderRadius: 8 }}
              className="py-4 items-center"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">Save</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 py-4 rounded-xl border border-white/10 bg-white/5 items-center"
            disabled={isUpdating}
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

export default EditAccount;
