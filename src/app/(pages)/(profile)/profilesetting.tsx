import GradientBackground from "@/src/component/background/GradientBackground";
import PhoneCodeModal from "@/src/component/profile/PhoneCodeModal";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetAllCountriesQuery } from "@/src/redux/phonenumber/countriesApi";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileForm = {
  fullName: string;
  phone: string;
  location: string;
  country: string;
  currency: string;
  language: string;
};

type PickerCountry = {
  cca2: string;
  name: string;
  phoneCode: string;
  flag: string;
};

const DEFAULT_PHONE_CODE = "+975";

const ProfileSetting = () => {
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const { data: phonecodenumbe = [], isLoading } = useGetAllCountriesQuery();

  const [profileImage, setProfileImage] = useState(
    "https://i.ibb.co/27NB7NcJ/user-12.png",
  );
  const [name, setName] = useState("");

  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: DEFAULT_PHONE_CODE,
    location: "",
    country: "",
    currency: "",
    language: "",
  });

  const [searchText, setSearchText] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<PickerCountry | null>(
    null,
  );

  /* ================= Format Countries ================= */
  const countries = useMemo<PickerCountry[]>(() => {
    return phonecodenumbe.map((c) => ({
      cca2: c.cca2,
      name: c.name.common,
      phoneCode: c.idd.root + (c.idd.suffixes?.[0] ?? ""),
      flag: c.flags.png,
    }));
  }, [phonecodenumbe]);

  /* ================= Populate form with user data ================= */
  useEffect(() => {
    if (getProfileData?.data) {
      const userData = getProfileData.data;

      // Set name
      setName(userData.fullName || "");

      // Set profile image if available
      if (userData.profilePicture) {
        setProfileImage(userData.profilePicture);
      }

      // Extract phone number and code
      const mobileNumber = userData.mobileNumber || "";
      let phoneCode = DEFAULT_PHONE_CODE;
      let phoneNum = mobileNumber;

      // Try to find country by name from user data
      if (countries.length && userData.country) {
        const countryFromData = countries.find(
          (c) => c.name.toLowerCase() === userData.country?.toLowerCase(),
        );
        if (countryFromData) {
          phoneCode = countryFromData.phoneCode;
          // Remove the phone code from the mobile number if it starts with it
          if (mobileNumber.startsWith(phoneCode.replace("+", ""))) {
            phoneNum = mobileNumber.substring(phoneCode.length - 1);
          }
        }
      }

      setPhoneNumber(phoneNum);

      // Set form data
      setForm({
        fullName: userData.fullName || "",
        phone: `${phoneCode}${phoneNum}`,
        location: userData.country || "",
        country: userData.country || "",
        currency: userData.currency || "",
        language: userData.language || "",
      });
    }
  }, [getProfileData, countries]);

  /* ================= Pre-select country by code ================= */
  useEffect(() => {
    if (countries.length && !selectedCountry && form.country) {
      // First try to find by country name
      let country = countries.find(
        (c) => c.name.toLowerCase() === form.country.toLowerCase(),
      );

      // If not found by name, try by phone code
      if (!country) {
        const phoneCode = form.phone.replace(phoneNumber, "");
        country = countries.find((c) => c.phoneCode === phoneCode);
      }

      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [countries, form.country, form.phone, phoneNumber]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  /* ================= Phone ================= */
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setPhoneNumber(cleaned);

    if (selectedCountry) {
      setForm({
        ...form,
        phone: `${selectedCountry.phoneCode}${cleaned}`,
      });
    }
  };

  /* ================= Loading ================= */
  if (isLoading || profileLoading || !selectedCountry) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#c9a35a" />
      </View>
    );
  }

  /* IMAGE PICKER */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleCountrySelect = (country: PickerCountry) => {
    setSelectedCountry(country);
    setForm((p) => ({
      ...p,
      phone: `${country.phoneCode}${phoneNumber}`,
      country: country.name,
    }));
    setShowCountryPicker(false);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile:", {
      ...form,
      profileImage,
    });
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center px-[5%] mt-3">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="flex-1 ml-3 text-white text-2xl font-bold">
            Profile Setting
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-[6%] mt-8"
        >
          {/* PROFILE IMAGE */}
          <View className="items-center mb-10">
            <View className="relative">
              <Image
                source={{ uri: profileImage }}
                className="w-32 h-32 rounded-full"
              />
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-1 right-1 bg-[#c9a35a] w-9 h-9 rounded-full items-center justify-center"
              >
                <Feather name="camera" size={17} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* YOUR NAME */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Your Name
          </Text>
          <View className="bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 mb-5">
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setForm({ ...form, fullName: text });
              }}
              placeholder="Your Name"
              placeholderTextColor="#666"
              className="text-white text-base"
            />
          </View>

          {/* Phone */}
          <View>
            <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2 ">
              Mobile Number
            </Text>

            <View className="flex-row bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 overflow-hidden">
              <TouchableOpacity
                onPress={() => setShowCountryPicker(true)}
                className="flex-row items-center px-4"
              >
                {selectedCountry ? (
                  <>
                    <Image
                      source={{ uri: selectedCountry.flag }}
                      className="w-6 h-4 mr-2"
                    />
                    <Text className="font-semibold font-Inter text-white">
                      {selectedCountry.phoneCode}
                    </Text>
                  </>
                ) : (
                  <Text className="text-gray-500">Code</Text>
                )}
                <Ionicons
                  name="chevron-down"
                  size={16}
                  style={{ marginLeft: 6 }}
                  color={"#fff"}
                />
              </TouchableOpacity>

              <TextInput
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholderTextColor={"#666"}
                className="flex-1 px-4 py-3 text-white"
              />
            </View>
          </View>

          {/* COUNTRY */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold my-2">
            Country
          </Text>
          <View className="bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 mb-5">
            <TextInput
              value={form.country}
              onChangeText={(text) => setForm({ ...form, country: text })}
              placeholder="Country"
              placeholderTextColor="#666"
              className="text-white text-base"
            />
          </View>

          {/* CURRENCY */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Currency
          </Text>
          <View className="bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 mb-5">
            <TextInput
              value={form.currency}
              onChangeText={(text) => setForm({ ...form, currency: text })}
              placeholder="Currency"
              placeholderTextColor="#666"
              className="text-white text-base"
            />
          </View>

          {/* LANGUAGE */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Language
          </Text>
          <View className="bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 mb-5">
            <TextInput
              value={form.language}
              onChangeText={(text) => setForm({ ...form, language: text })}
              placeholder="Language"
              placeholderTextColor="#666"
              className="text-white text-base"
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity onPress={handleSave} className="mb-10">
            <LinearGradient
              colors={["#e3bf75", "#b08b4a"]}
              className="py-4 rounded-xl items-center"
              style={{ borderRadius: 20 }}
            >
              <Text className="text-white font-bold text-lg">Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= Country Picker Modal ================= */}
        <PhoneCodeModal
          visible={showCountryPicker}
          onClose={() => setShowCountryPicker(false)}
          countries={filteredCountries}
          searchText={searchText}
          onSearchChange={setSearchText}
          onSelect={handleCountrySelect}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ProfileSetting;
