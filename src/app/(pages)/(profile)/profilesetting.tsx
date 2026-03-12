import SuccessModalAll from "@/src/component/auth/SuccessModalAll";
import GradientBackground from "@/src/component/background/GradientBackground";
import CountryPickerModal from "@/src/component/profile/CountryPickerModal";
import CurrencyPickerModal from "@/src/component/profile/CurrencyModalPicker";
import LanguagePickerModal from "@/src/component/profile/LanguagePickerModal";
import PhoneCodeModal from "@/src/component/profile/PhoneCodeModal";
import { useCountryDataPicker } from "@/src/hook/useCountryDataPicker";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useEditProfileMutation } from "@/src/redux/api/Page/profile/profileApi";
import { Language } from "@/src/redux/language/languageApi";
import {
  Country,
  useGetAllCountriesQuery,
} from "@/src/redux/phonenumber/countriesApi";
import { Currency } from "@/src/type/thepicker";
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

  const [updateAccount, { isLoading: accountLoading }] =
    useEditProfileMutation();
  console.log("lan", getProfileData?.data?.language);
  const { data: phonecodenumbe = [], isLoading } = useGetAllCountriesQuery();

  // State for professional pickers
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );

  // Modal visibility states
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [successmodal, setSuccessmodal] = useState(false);

  const {
    countries: cuntryname,
    popularCountries,
    isLoadingCountries,
    isFetchingCountries,
    isSearchingCountries,
    hasMoreCountries,
    loadMoreCountries,
    setCountrySearch,
    countrySearchTerm,
    currencies,
    isLoadingCurrencies,
    setCurrencySearch,
    currencySearchTerm,
    languages,
    isLoadingLanguages,
    setLanguageSearch,
    languageSearchTerm,
  } = useCountryDataPicker();

  const [profileImage, setProfileImage] = useState(
    "https://i.ibb.co.com/gbnTNDBv/user.png",
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

  /* ================= Format Countries ================= */
  const countries = useMemo<PickerCountry[]>(() => {
    return phonecodenumbe.map((c) => ({
      cca2: c.cca2,
      name: c.name.common,
      phoneCode: c.idd.root + (c.idd.suffixes?.[0] ?? ""),
      flag: c.flags.png,
    }));
  }, [phonecodenumbe]);

  console.log(selectedLanguage);
  console.log(selectedCountry);

  console.log(selectedLanguage);

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
          // if (mobileNumber.startsWith(phoneCode.replace("+", ""))) {
          //   phoneNum = mobileNumber.substring(phoneCode.length - 1);
          // }
        }
      }

      setPhoneNumber(phoneNum);

      // Find and set selected country from professional picker data
      if (cuntryname.length && userData.country) {
        const country = cuntryname.find(
          (c) =>
            c.countryName?.toLowerCase() === userData.country?.toLowerCase(),
        );
        if (country) {
          setSelectedCountry(country);
        }
      }

      // Find and set selected currency
      if (currencies.length && userData.currency) {
        const currency = currencies.find((c) => c.code === userData.currency);
        if (currency) {
          setSelectedCurrency(currency);
        }
      }

      // Find and set selected language
      if (languages.length && userData.language) {
        const language = languages.find(
          (l) => l.name.toLowerCase() === userData.language?.toLowerCase(),
        );
        if (language) {
          setSelectedLanguage(language);
        }
      }

      // Set form data
      setForm({
        fullName: userData.fullName || "",
        phone: `${phoneNum}`,
        location: userData.country || "",
        country: userData.country || "",
        currency: userData.currency || "",
        language: userData.language || "",
      });
    }
  }, [getProfileData, countries, cuntryname, currencies, languages]);

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
        // Find corresponding country in professional picker data
        const professionalCountry = cuntryname.find(
          (c) => c.countryName?.toLowerCase() === country.name.toLowerCase(),
        );
        if (professionalCountry) {
          setSelectedCountry(professionalCountry);
        }
      }
    }
  }, [countries, form.country, form.phone, phoneNumber, cuntryname]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  /* ================= Phone ================= */
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setPhoneNumber(cleaned);

    if (selectedCountry) {
      // Find phone code from countries list based on selected country
      const phoneCountry = countries.find(
        (c) =>
          c.name.toLowerCase() === selectedCountry.countryName?.toLowerCase(),
      );
      if (phoneCountry) {
        setForm({
          ...form,
          phone: `${phoneCountry.phoneCode}${cleaned}`,
        });
      }
    }
  };

  /* ================= Picker Handlers ================= */
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setForm((p) => ({
      ...p,
      country: country.countryName || "",
    }));

    // Find and update phone code based on selected country
    const phoneCountry = countries.find(
      (c) => c.name.toLowerCase() === country.countryName?.toLowerCase(),
    );
    if (phoneCountry) {
      setForm((p) => ({
        ...p,
        phone: `${phoneCountry.phoneCode}${phoneNumber}`,
      }));
    }

    // Auto-select currency based on country
    const currency = currencies.find((c) => c.code === country.currency);
    if (currency) {
      setSelectedCurrency(currency);
      setForm((p) => ({
        ...p,
        currency: currency.code,
      }));
    }

    setShowCountryModal(false);
  };

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setForm((p) => ({
      ...p,
      currency: currency.code,
    }));
    setShowCurrencyModal(false);
  };

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setForm((p) => ({
      ...p,
      language: lang.name,
    }));
    setShowLanguageModal(false);
  };

  const handlePhoneCountrySelect = (country: PickerCountry) => {
    // Find corresponding country in professional picker data
    const professionalCountry = cuntryname.find(
      (c) => c.countryName?.toLowerCase() === country.name.toLowerCase(),
    );
    if (professionalCountry) {
      setSelectedCountry(professionalCountry);
    }

    setForm((p) => ({
      ...p,
      phone: `${country.phoneCode}${phoneNumber}`,
      country: country.name,
    }));
    setShowCountryPicker(false);
  };

  /* ================= Loading ================= */
  if (isLoading || profileLoading) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#c9a35a" />
        </View>
      </GradientBackground>
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

  // const handleSave = async () => {
  //   // Handle save logic here
  //   console.log("Saving profile:", {
  //     ...form,
  //     profileImage,
  //     selectedCountry: selectedCountry?.countryName,
  //     selectedCurrency: selectedCurrency?.code,
  //     selectedLanguage:
  //       getProfileData?.data?.language || selectedLanguage?.name,
  //   });
  // };

  const handleSave = async () => {
    console.log(
      form.fullName,
      form.phone,
      selectedCountry?.countryName,
      selectedCurrency?.code,
      selectedLanguage?.name || getProfileData?.data?.language,
    );
    const formData = new FormData();

    formData.append("fullName", form.fullName);
    formData.append("mobileNumber", form.phone);
    formData.append(
      "country",
      selectedCountry?.countryName || getProfileData?.data?.country,
    );
    formData.append(
      "currency",
      selectedCurrency?.code || getProfileData?.data?.currency,
    );
    formData.append(
      "language",
      selectedLanguage?.name || getProfileData?.data?.language,
    );

    if (profileImage) {
      formData.append("profilePicture", {
        uri: profileImage,
        type: "image/jpeg",
        name: "profile.jpg",
      });
    }

    try {
      const res = await updateAccount(formData).unwrap();
      console.log("Profile Updated:", res);
      setSuccessmodal(true);
    } catch (error) {
      console.log("Update Error:", error);
    }
  };

  // Render selected display components
  const renderSelectedCountry = () => {
    if (!selectedCountry) return null;

    return (
      <View className="flex-row items-center">
        <Text className="text-2xl mr-2">{selectedCountry.flagEmoji}</Text>
        <Text className="text-white text-base" numberOfLines={1}>
          {selectedCountry.countryName}
        </Text>
      </View>
    );
  };

  const renderSelectedCurrency = () => {
    if (!selectedCurrency) return null;

    return (
      <View className="flex-row items-center">
        <LinearGradient
          colors={["#FAD885", "#C49F59", "#8A622A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 8 }}
          className="w-6 h-6 rounded-full items-center justify-center mr-2"
        >
          <Text className="text-white text-xs font-bold">
            {selectedCurrency.symbol || selectedCurrency.code.charAt(0)}
          </Text>
        </LinearGradient>
        <Text className="text-white text-base" numberOfLines={1}>
          {selectedCurrency.code} - {selectedCurrency.name}
        </Text>
      </View>
    );
  };

  const renderSelectedLanguage = () => {
    if (!selectedLanguage) return null;

    return (
      <View className="flex-row items-center">
        <View className="w-6 h-6 rounded-full bg-[#D6AA63]/20 items-center justify-center mr-2">
          <Text className="text-[#D6AA63] text-xs font-bold">
            {selectedLanguage.nativeName?.charAt(0) ||
              selectedLanguage.name.charAt(0)}
          </Text>
        </View>
        <Text className="text-white text-base" numberOfLines={1}>
          {selectedLanguage.name}
        </Text>
      </View>
    );
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
            <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
              Mobile Number
            </Text>

            <View className="flex-row bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-1 overflow-hidden">
              <TouchableOpacity
                onPress={() => setShowCountryPicker(true)}
                className="flex-row items-center px-4"
              >
                {selectedCountry ? (
                  <>
                    {(() => {
                      const phoneCountry = countries.find(
                        (c) =>
                          c.name.toLowerCase() ===
                          selectedCountry.countryName?.toLowerCase(),
                      );
                      return phoneCountry ? (
                        <>
                          <Image
                            source={{ uri: phoneCountry.flag }}
                            className="w-6 h-4 mr-2"
                          />
                          <Text className="font-semibold font-Inter text-white">
                            {phoneCountry.phoneCode}
                          </Text>
                        </>
                      ) : (
                        <Text className="text-white">+975</Text>
                      );
                    })()}
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

          {/* COUNTRY - Professional Picker */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold my-2">
            Country
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCountryModal(true)}
            className="flex-row items-center justify-between bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-4 mb-5"
          >
            {renderSelectedCountry() || (
              <Text className="text-white/40 text-base">
                {getProfileData?.data?.country || "Select your country"}
              </Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#D6AA63" />
          </TouchableOpacity>

          {/* CURRENCY - Professional Picker */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Currency
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCurrencyModal(true)}
            className="flex-row items-center justify-between bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-4 mb-5"
          >
            {renderSelectedCurrency() || (
              <Text className="text-white/40 text-base">
                {getProfileData?.data?.currency || "Select your currency"}
              </Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#D6AA63" />
          </TouchableOpacity>

          {/* LANGUAGE - Professional Picker */}
          <Text className="text-[#FFFFFF] text-base font-Inter font-bold mb-2">
            Language
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowLanguageModal(true)}
            className="flex-row items-center justify-between bg-[#1c1c1e] border border-[#c9a35a55] rounded-xl px-4 py-4 mb-5"
          >
            {renderSelectedLanguage() || (
              <Text className="text-white text-base">
                {getProfileData?.data?.language
                  ? getProfileData?.data?.language
                  : "Select your language"}
              </Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#D6AA63" />
          </TouchableOpacity>

          {/* SAVE BUTTON */}
          <TouchableOpacity onPress={handleSave} className="mb-10">
            <LinearGradient
              colors={["#e3bf75", "#b08b4a"]}
              className="py-4 rounded-xl items-center"
              style={{ borderRadius: 20 }}
            >
              <Text className="text-white font-bold text-lg">
                {accountLoading ? "Save..." : "Save"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= Modals ================= */}
        <PhoneCodeModal
          visible={showCountryPicker}
          onClose={() => setShowCountryPicker(false)}
          countries={filteredCountries}
          searchText={searchText}
          onSearchChange={setSearchText}
          onSelect={handlePhoneCountrySelect}
        />

        <CountryPickerModal
          visible={showCountryModal}
          onClose={() => setShowCountryModal(false)}
          countries={cuntryname}
          popularCountries={popularCountries}
          onSelect={handleCountrySelect}
          onSearch={setCountrySearch}
          isLoading={isLoadingCountries || isSearchingCountries}
          hasMore={hasMoreCountries}
          onLoadMore={loadMoreCountries}
          searchTerm={countrySearchTerm}
        />

        <CurrencyPickerModal
          visible={showCurrencyModal}
          onClose={() => setShowCurrencyModal(false)}
          currencies={currencies}
          onSelect={handleCurrencySelect}
          onSearch={setCurrencySearch}
          isLoading={isLoadingCurrencies}
          searchTerm={currencySearchTerm}
        />

        <LanguagePickerModal
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
          languages={languages}
          onSelect={handleLanguageSelect}
          onSearch={setLanguageSearch}
          isLoading={isLoadingLanguages}
          searchTerm={languageSearchTerm}
        />

        <SuccessModalAll
          visible={successmodal}
          message=" Successful!"
          close={() => setSuccessmodal(false)}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ProfileSetting;
