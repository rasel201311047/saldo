import GradientBackground from "@/src/component/background/GradientBackground";
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
interface FormErrors {
  email: string;
}

export default function Forgot() {
  const [form, setForm] = useState({
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
  });

  const handeleForgetPassword = () => {
    let newErrors: Partial<FormErrors> = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!newErrors.email) {
      console.log("Login success", form);
    }
    setErrors({
      email: newErrors.email || "",
    });

    if (!newErrors.email) {
      console.log("Login success", form);
      router.push({
        pathname: "/verify",
        params: { typeOfvarification: "forget" },
      });
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 w-[95%] mx-auto pt-16">
              {/* Title */}
              <Text className="text-3xl  text-[#fff] font-BodoniModa font-semibold ">
                Email Confirmation
              </Text>
              <Text className="text-base font-Inter text-gray-200 mt-2 leading-6">
                Enter Your email for verification.
              </Text>

              {/* Email */}
              <Text className="mt-10 text-lg font-bold font-Inter text-[#fff]">
                Email
              </Text>
              <TextInput
                placeholder="Enter Your Email"
                placeholderTextColor="#fff"
                value={form.email}
                keyboardType="email-address"
                onChangeText={(text) => {
                  setForm({ ...form, email: text });
                }}
                className="w-full py-[4%] bg-transparent  border border-[#C49F59] rounded-xl px-[4%] mt-2 text-[15px] font-Inter font-bold text-[#fff]"
              />
              {errors?.email ? (
                <Text className="font-PoppinsRegular text-xs text-red-800">
                  {errors.email}
                </Text>
              ) : null}

              {/* Login Button */}

              <TouchableOpacity
                onPress={handeleForgetPassword}
                activeOpacity={0.8}
                className="my-4"
              >
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 8 }}
                  className="  py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Send
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
