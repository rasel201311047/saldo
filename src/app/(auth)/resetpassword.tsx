import SuccessModal from "@/src/component/auth/SuccessModal";
import GradientBackground from "@/src/component/background/GradientBackground";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface FormErrors {
  password: string;
  confrimpassword: string;
}

export default function Resetpassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfrimPassword, setShowConfrimPassword] = useState(false);
  const [successmodal, setsuccessmodal] = useState(false);
  const [form, setForm] = useState({
    confrimpassword: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    confrimpassword: "",
    password: "",
  });

  const handeleSignin = () => {
    let newErrors: Partial<FormErrors> = {};

    if (!form.confrimpassword.trim()) {
      newErrors.confrimpassword = "Enter The comfirm password";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Please enter a password with at least 6 characters";
    } else if (form.password !== form.confrimpassword) {
      newErrors.confrimpassword = "cannot match password";
    }

    setErrors({
      confrimpassword: newErrors.confrimpassword || "",
      password: newErrors.password || "",
    });

    if (!newErrors.confrimpassword && !newErrors.password) {
      setsuccessmodal(true);
      console.log("success", form);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                Reset your password
              </Text>
              <Text className="text-base font-Inter text-gray-200 mt-2 leading-6">
                Create a new password for your account and make to choose a
                strong and unique password.
              </Text>

              {/* Password  */}
              <Text className="mt-5 text-lg font-bold font-Inter text-[#fff]">
                Password
              </Text>

              <View className="w-full py-[1%] bg-transparent  border border-[#C49F59] rounded-xl px-[4%] mt-2 flex-row items-center">
                <TextInput
                  placeholder="********"
                  placeholderTextColor="#fff"
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(text) => {
                    setForm({ ...form, password: text });
                  }}
                  className="flex-1 text-[15px] font-Inter font-bold text-[#fff]"
                />

                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              </View>

              {errors.password ? (
                <Text className="font-PoppinsRegular text-xs text-red-800">
                  {errors.password}
                </Text>
              ) : null}

              {/* confirm password showConfrimPassword, setShowConfrimPassword */}
              <Text className="mt-5 text-lg font-bold font-Inter text-[#fff]">
                Confirm Password
              </Text>

              <View className="w-full py-[1%] bg-transparent  border border-[#C49F59] rounded-xl px-[4%] mt-2 flex-row items-center">
                <TextInput
                  placeholder="********"
                  placeholderTextColor="#fff"
                  secureTextEntry={!showConfrimPassword}
                  value={form.confrimpassword}
                  onChangeText={(text) => {
                    setForm({ ...form, confrimpassword: text });
                  }}
                  className="flex-1 text-[15px] font-Inter font-bold text-[#fff]"
                />

                <Pressable
                  onPress={() => setShowConfrimPassword(!showConfrimPassword)}
                >
                  <Ionicons
                    name={showConfrimPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              </View>

              {errors.confrimpassword ? (
                <Text className="font-PoppinsRegular text-xs text-red-800">
                  {errors.confrimpassword}
                </Text>
              ) : null}

              {/* Login Button */}

              <TouchableOpacity
                onPress={handeleSignin}
                activeOpacity={0.8}
                className="my-4"
              >
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 8 }}
                  className="  py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Submit
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <SuccessModal
          visible={successmodal}
          message="Password Reset Successful!"
        />
      </SafeAreaView>
    </GradientBackground>
  );
}
