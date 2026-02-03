import { google } from "@/assets/icons";
import { Images } from "@/assets/images/image";
import GradientBackground from "@/src/component/background/GradientBackground";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
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
import { SvgXml } from "react-native-svg";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    router.replace("/falsepage");
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className=" px-6 justify-center ">
              {/* Logo */}
              <View className="items-center mb-6 ">
                <Image
                  source={Images.logo}
                  resizeMode="contain"
                  className="w-36 h-36"
                />
              </View>

              {/* Title */}
              <Text className="text-center text-3xl font-Inter font-bold text-white">
                Let’s start!
              </Text>
              <Text className="text-center font-Inter text-gray-400 mt-2 mb-8">
                Sign in to manage your finances
              </Text>

              {/* Email */}
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Email
              </Text>
              <TextInput
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType="email-address"
                placeholder="claudiu@gmail.com"
                placeholderTextColor="#9CA3AF"
                className=" bg-transparent  border border-[#C49F59]  rounded-xl px-4 py-4 text-white mb-4"
              />

              {/* Password */}
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Password
              </Text>
              <View className="flex-row items-center  bg-transparent  border border-[#C49F59]  rounded-xl px-4 py-1">
                <TextInput
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  secureTextEntry={!showPassword}
                  placeholder="********"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-white"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#fff"
                  />
                </Pressable>
              </View>

              {/* Remember + Forgot */}
              <View className="flex-row justify-between items-center mt-4">
                <Pressable
                  onPress={() => setRemember(!remember)}
                  className="flex-row items-center"
                >
                  <View className="w-4 h-4 border border-gray-400 rounded mr-2 items-center justify-center">
                    {remember && (
                      <FontAwesome5 name="check" size={10} color="#fff" />
                    )}
                  </View>
                  <Text className="text-gray-300 text-sm">Remember me</Text>
                </Pressable>

                <TouchableOpacity onPress={() => router.push("/forgot")}>
                  <Text className="text-sm text-yellow-500">
                    Forgot password
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}

              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                className="my-4"
              >
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 8 }}
                  className="  py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Login
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-[1px] bg-[#fff]" />
                <Text className="mx-3 text-[#fff]">or continue with</Text>
                <View className="flex-1 h-[1px] bg-[#fff]" />
              </View>

              {/* Google */}

              <TouchableOpacity activeOpacity={0.8} className="my-4 ">
                <LinearGradient
                  colors={["#b08b4ab0", "#2626a19c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 8 }}
                  className="flex-row  items-center justify-center gap-2 py-4 "
                >
                  <SvgXml xml={google} width={20} height={20} />
                  <Text className="text-white font-semibold text-base">
                    Sign In with Google
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer */}
              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-400">Don’t have an account?</Text>
                <Pressable onPress={() => router.push("/signup")}>
                  <Text className="text-yellow-500 ml-1 font-semibold">
                    Register
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Signin;
