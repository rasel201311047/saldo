import GradientBackground from "@/src/component/background/GradientBackground";
import PhoneCodeModal from "@/src/component/profile/PhoneCodeModal";
import { useGetAllCountriesQuery } from "@/src/redux/phonenumber/countriesApi";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

interface FormErrors {
  email: string;
  password: string;
}

type PickerCountry = {
  cca2: string;
  name: string;
  phoneCode: string;
  flag: string;
};

const DEFAULT_PHONE_CODE = "+975";

export default function Signup() {
  const { data: phonecodenumbe = [] } = useGetAllCountriesQuery();

  const [showPassword, setShowPassword] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchText, setSearchText] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<PickerCountry | null>(
    null,
  );

  const [form, setForm] = useState({
    name: "",
    phone: DEFAULT_PHONE_CODE,
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  /* ================= Format Countries ================= */
  const countries = useMemo<PickerCountry[]>(() => {
    return phonecodenumbe.map((c: any) => ({
      cca2: c.cca2,
      name: c.name.common,
      phoneCode: c.idd.root + (c.idd.suffixes?.[0] ?? ""),
      flag: c.flags.png,
    }));
  }, [phonecodenumbe]);

  /* ================= Default Country ================= */
  useEffect(() => {
    if (countries.length && !selectedCountry) {
      const country = countries.find((c) => c.phoneCode === DEFAULT_PHONE_CODE);
      if (country) {
        setSelectedCountry(country);
        setForm((p) => ({
          ...p,
          phone: `${country.phoneCode}${phoneNumber}`,
        }));
      }
    }
  }, [countries, phoneNumber, selectedCountry]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  /* ================= Phone Change ================= */
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setPhoneNumber(cleaned);

    if (selectedCountry) {
      setForm((p) => ({
        ...p,
        phone: `${selectedCountry.phoneCode}${cleaned}`,
      }));
    }
  };
  const handleCountrySelect = (country: PickerCountry) => {
    setSelectedCountry(country);
    setForm((p) => ({
      ...p,
      phone: `${country.phoneCode}${phoneNumber}`,
    }));
    setShowCountryPicker(false);
  };

  /* ================= Register ================= */
  const handeleSignin = () => {
    let newErrors: Partial<FormErrors> = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors({
      email: newErrors.email || "",
      password: newErrors.password || "",
    });

    if (!newErrors.email && !newErrors.password && isCheck) {
      router.push({
        pathname: "/verify",
        params: { typeOfvarification: "signup" },
      });

      console.log("Register success", form);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-[95%] mx-auto pt-5">
              <Text className=" text-3xl font-Inter font-bold text-white ">
                Create Account
              </Text>

              <Text className="text-base font-Inter text-gray-400 mt-2 leading-6">
                Sign up and get started with smarter ride {"\n"} tracking and
                daily reporting made simple.
              </Text>

              {/* Name */}
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Full Name
              </Text>
              <TextInput
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                className=" bg-transparent   border border-[#C49F59]  rounded-xl px-4 py-4 text-white mb-4"
              />

              {/* Phone */}
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Mobile Number
              </Text>
              <View className="flex-row w-full  h-16 bg-transparent  border border-[#C49F59] rounded-xl px-[4%] text-[15px] font-Inter font-bold text-[#0F0B18] mt-2">
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  className="flex-row items-center px-4"
                >
                  {selectedCountry && (
                    <>
                      <Image
                        source={{ uri: selectedCountry.flag }}
                        className="w-6 h-4 mr-2"
                      />
                      <Text className="font-Inter text-white ">
                        {selectedCountry.phoneCode}
                      </Text>
                    </>
                  )}
                  <Ionicons name="chevron-down" size={16} color={"#fff"} />
                </TouchableOpacity>

                <TextInput
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  placeholderTextColor={"#fff"}
                  className="flex-1 px-4 py-3 text-white font-Inter"
                />
              </View>

              {/* Email */}
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Email
              </Text>
              <TextInput
                value={form.email}
                onChangeText={(t) => setForm({ ...form, email: t })}
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor={"#fff"}
                className="w-full h-16 bg-transparent  text-white  border border-[#C49F59] rounded-xl px-[4%] mt-2 text-[15px] font-Inter font-bold "
              />
              {!!errors.email && (
                <Text className="text-red-700 text-xs mt-1">
                  {errors.email}
                </Text>
              )}

              {/* Password */}
              <Text className="text-[#FFFFFF] text-base font-Inter my-2">
                Password
              </Text>
              <View className="flex-row items-center w-full h-16 bg-transparent  border border-[#C49F59] rounded-xl px-[4%]  text-[15px] font-Inter font-bold text-[#0F0B18] mt-2">
                <TextInput
                  value={form.password}
                  onChangeText={(t) => setForm({ ...form, password: t })}
                  secureTextEntry={!showPassword}
                  placeholder="********"
                  placeholderTextColor={"#fff"}
                  className="flex-1 py-3 text-[#fff]"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={"#fff"}
                  />
                </Pressable>
              </View>
              {!!errors.password && (
                <Text className="text-red-700 text-xs mt-1">
                  {errors.password}
                </Text>
              )}

              {/* Terms */}
              <View className="flex-row items-center mt-4">
                <Pressable
                  onPress={() => setIsCheck(!isCheck)}
                  className="w-4 h-4 border border-[#C49F59] mr-2 items-center justify-center rounded-sm"
                >
                  {isCheck && (
                    <FontAwesome5 name="check" size={10} color="#C49F59" />
                  )}
                </Pressable>
                <Text className="font-Inter text-xs text-[#FFFFFF] ">
                  I agree to Terms & Conditions
                </Text>
              </View>

              {/* Register */}

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
                  <Text className="text-white font-bold text-base">
                    Register
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-[#FFFFFF] text-base font-Inter ">
                  Have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/signin")}>
                  <Text className=" text-[#FFFFFF] text-base font-Inter font-bold ml-1">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Country Picker */}
          {/* ================= Country Picker Modal ================= */}
          <PhoneCodeModal
            visible={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
            countries={filteredCountries}
            searchText={searchText}
            onSearchChange={setSearchText}
            onSelect={handleCountrySelect}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
