import GradientBackground from "@/src/component/background/GradientBackground";
import CustomAlert from "@/src/component/customAlart/CustomAlert";
import { usePostChangePasswordMutation } from "@/src/redux/api/Page/profile/profileApi";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Changepassword = () => {
  const [changePassword, { isLoading }] = usePostChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // alart
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSavePassword = async () => {
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (response.success) {
        setAlertVisible(true);
        setAlertType("success");
        setAlertTittle("success");
        setAlertMessage(response?.message);
      }
    } catch (error: any) {
      console.error("Password change error:", error);

      // Handle different error formats
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to change password. Please try again.";

      setAlertVisible(true);
      setAlertType("error");
      setAlertTittle("Error");
      setAlertMessage(errorMessage);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center gap-4 px-[5%] mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">Change Password</Text>
        </View>

        {/* main contain */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 24,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Old Password */}
            <View className="mb-4">
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Old Password
              </Text>
              <View className="flex-row items-center bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
                <TextInput
                  placeholder="*****************"
                  secureTextEntry={!showOld}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3 text-sm font-Inter text-[#fff]"
                />
                <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                  <Ionicons
                    name={showOld ? "eye" : "eye-off"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                New Password
              </Text>
              <View className="flex-row items-center bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
                <TextInput
                  placeholder="*****************"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3 text-sm font-Inter text-[#fff]"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons
                    name={showNew ? "eye" : "eye-off"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Confirm Password
              </Text>
              <View className="flex-row items-center bg-transparent border border-[#C49F59] rounded-xl px-4 py-2">
                <TextInput
                  placeholder="*****************"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3 text-sm font-Inter text-[#fff]"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? "eye" : "eye-off"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSavePassword}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#B08A4A", "#E0B66A"]}
                style={{ borderRadius: 8 }}
                className="py-4 items-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Save
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <CustomAlert
          visible={alertVisible}
          title={alertTittle}
          message={alertMessage}
          onConfirm={() => {
            console.log("Confirmed");
            setAlertVisible(false);
          }}
          // onCancel={() => {
          //   console.log("Cancelled");
          //   setAlertVisible(false);
          // }}
          type={alertType}
          confirmText={"OK"}
          cancelText="Cancel"
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Changepassword;
