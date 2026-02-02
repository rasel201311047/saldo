import GradientBackground from "@/src/component/background/GradientBackground";
import PhoneCodeModal from "@/src/component/profile/PhoneCodeModal";
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
};
type PickerCountry = {
  cca2: string;
  name: string;
  phoneCode: string;
  flag: string;
};
const DEFAULT_PHONE_CODE = "+975";
const ProfileSetting = () => {
  const { data: phonecodenumbe = [], isLoading } = useGetAllCountriesQuery();

  const [profileImage, setProfileImage] = useState(
    "https://i.ibb.co/27NB7NcJ/user-12.png",
  );
  const [name, setName] = useState("Claudiu");

  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: DEFAULT_PHONE_CODE,
    location: "",
  });

  const [searchText, setSearchText] = useState("");
  //   phonw
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

  /* ================= Pre-select country by code ================= */
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
  }, [countries]);

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
  if (isLoading || !selectedCountry) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
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
    }));
    setShowCountryPicker(false);
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

          <Text className="flex-1 text-center text-white text-2xl font-bold">
            Profile Setting
          </Text>

          <View className="w-9" />
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
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#fff"
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
                placeholderTextColor={"#fff"}
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
              //   value={name}
              //   onChangeText={setName}
              placeholder="Bangladesh"
              placeholderTextColor="#fff"
              className="text-white text-base"
            />
          </View>

          {/* CURRENCY */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Currency
          </Text>
          <View className="bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 mb-5">
            <TextInput
              //   value={name}
              //   onChangeText={setName}
              placeholder="USD"
              placeholderTextColor="#fff"
              className="text-white text-base"
            />
          </View>

          {/* LANGUAGE */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Language
          </Text>
          <View className="bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 mb-5">
            <TextInput
              //   value={name}
              //   onChangeText={setName}
              placeholder="Language"
              placeholderTextColor="#fff"
              className="text-white text-base"
            />
          </View>
          {/* SAVE BUTTON */}
          <TouchableOpacity className="mb-10">
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
