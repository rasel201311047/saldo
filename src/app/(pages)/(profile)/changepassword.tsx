import GradientBackground from "@/src/component/background/GradientBackground";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

          <Text className="text-white text-xl font-bold">
            Monthly & Weekly Report
          </Text>
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
              <View className="flex-row items-center bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2 text-sm font-Inter text-[#fff]">
                <TextInput
                  placeholder="*****************"
                  secureTextEntry={!showOld}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3  text-sm font-Inter text-[#fff] "
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
              <View className="flex-row items-center bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2 text-sm font-Inter text-[#fff] ">
                <TextInput
                  placeholder="*****************"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3  text-sm font-Inter text-[#fff] "
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
              <View className="flex-row items-center bg-transparent  border border-[#C49F59] rounded-xl px-4 py-2 text-sm font-Inter text-[#fff]">
                <TextInput
                  placeholder="*****************"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3  text-sm font-Inter text-[#fff] "
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
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={["#B08A4A", "#E0B66A"]}
                style={{ borderRadius: 8 }}
                className="  py-4 items-center"
              >
                <Text className="text-white font-semibold text-base">Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Changepassword;
