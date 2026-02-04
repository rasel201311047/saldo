import GradientBackground from "@/src/component/background/GradientBackground";
import LanguagePickerModal from "@/src/component/profile/LanguagePickerModal";
import { useGetLanguagesQuery } from "@/src/redux/language/languageApi";
import { useGetAllCountriesQuery } from "@/src/redux/phonenumber/countriesApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SetupProfile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null);

  const { data: languagesdata = [], isLoading } = useGetLanguagesQuery();
  const { data: countryname = [] } = useGetAllCountriesQuery();

  // State management
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [language, setLanguage] = useState("");
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Sample data
  const countries = [
    { id: "1", name: "United States", emoji: "🇺🇸" },
    { id: "2", name: "United Kingdom", emoji: "🇬🇧" },
    { id: "3", name: "Canada", emoji: "🇨🇦" },
    { id: "4", name: "Australia", emoji: "🇦🇺" },
    { id: "5", name: "Germany", emoji: "🇩🇪" },
    { id: "6", name: "France", emoji: "🇫🇷" },
    { id: "7", name: "Japan", emoji: "🇯🇵" },
    { id: "8", name: "India", emoji: "🇮🇳" },
  ];

  const currencies = [
    { id: "1", code: "USD", name: "US Dollar" },
    { id: "2", code: "EUR", name: "Euro" },
    { id: "3", code: "GBP", name: "British Pound" },
    { id: "4", code: "CAD", name: "Canadian Dollar" },
    { id: "5", code: "AUD", name: "Australian Dollar" },
    { id: "6", code: "JPY", name: "Japanese Yen" },
    { id: "7", code: "INR", name: "Indian Rupee" },
  ];

  const languages = [
    { id: "1", code: "en", name: "English" },
    { id: "2", code: "es", name: "Spanish" },
    { id: "3", code: "fr", name: "French" },
    { id: "4", code: "de", name: "German" },
    { id: "5", code: "ja", name: "Japanese" },
    { id: "6", code: "hi", name: "Hindi" },
    { id: "7", code: "ar", name: "Arabic" },
  ];

  // Selection handlers
  const handleCountrySelect = (selectedCountry: any) => {
    setCountry(selectedCountry.name);
    setShowCountryModal(false);
  };

  const handleCurrencySelect = (selectedCurrency: any) => {
    setCurrency(selectedCurrency.code);
    setShowCurrencyModal(false);
  };

  const handleLanguageSelect = (selectedLanguage: any) => {
    setLanguage(selectedLanguage.name);
    setShowLanguageModal(false);
  };

  // Continue button handler
  const handleContinue = () => {
    router.replace("/subcription");
  };

  // Render list item component
  const renderListItem = (item: any, onSelect: any, type: string) => (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      className="py-3 px-4 border-b border-white/10"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {type === "country" && (
          <Text className="text-xl mr-3">{item.emoji}</Text>
        )}
        <Text className="text-white text-base flex-1">{item.name}</Text>
        {type === "currency" && (
          <Text className="text-white/60 text-sm">{item.code}</Text>
        )}
        {type === "language" && (
          <Text className="text-white/60 text-sm">
            {item.code.toUpperCase()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1 px-5">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {/* Header */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-white/60">Profile Setup</Text>
              <Text className="text-xs text-white/60">Step 1 of 1</Text>
            </View>

            {/* Progress bar */}
            <View className="h-[2px] bg-white/20 mt-3 rounded-full">
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{ borderRadius: 50, height: 5 }}
                className="  "
              />
            </View>
          </View>

          {/* Title */}
          <View className="mt-8">
            <Text className="text-white text-3xl font-bold">
              Setup Your Profile
            </Text>
            <Text className="text-white/60 mt-2">
              Customize your experience
            </Text>
          </View>

          {/* Form */}
          <View className="mt-10 space-y-6">
            {/* Country */}
            <View className="mb-3">
              <Text className="text-white  font-Inter mb-3">🌐 Country</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCountryModal(true)}
                className="flex-row items-center justify-between px-4 py-4 rounded-lg border border-[#D6AA63]/40"
              >
                <Text className={`${country ? "text-white" : "text-white/70"}`}>
                  {country || "Select country"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#D6AA63" />
              </TouchableOpacity>
            </View>

            {/* Currency */}
            <View className="mb-3">
              <Text className="text-white  font-Inter mb-3">💲 Currency</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCurrencyModal(true)}
                className="flex-row items-center justify-between px-4 py-4 rounded-lg border border-[#D6AA63]/40"
              >
                <Text
                  className={`${currency ? "text-white" : "text-white/70"}`}
                >
                  {currency
                    ? `${currency} - ${currencies.find((c) => c.code === currency)?.name}`
                    : "Select currency"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#D6AA63" />
              </TouchableOpacity>
            </View>

            {/* Language */}
            <View className="mb-2">
              <Text className="text-white  font-Inter mb-3">🌐 Language</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
                className="flex-row items-center justify-between px-4 py-4 rounded-lg border border-[#D6AA63]/40"
              >
                <Text
                  className={`${selectedLanguage ? "text-white" : "text-white/70"}`}
                >
                  {selectedLanguage?.name || "Select language"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#D6AA63" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <View className="mt-auto mb-6">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.replace("/subcription")}
            >
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{ borderRadius: 8 }}
                className={`py-4 rounded-lg items-center ${
                  !country || !currency || !language
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              >
                <Text className="text-white font-semibold text-base">
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <LanguagePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          languages={languagesdata}
          onSelect={(lang) => {
            setSelectedLanguage(lang);
            setModalVisible(false);
          }}
        />
      </SafeAreaView>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCountryModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-[#1A1A1A] rounded-t-3xl max-h-3/4">
                <View className="p-5 border-b border-white/10">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white text-xl font-bold">
                      Select Country
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowCountryModal(false)}
                    >
                      <Ionicons name="close" size={24} color="#D6AA63" />
                    </TouchableOpacity>
                  </View>

                  {/* Search Input */}
                  <View className="mt-4">
                    <LinearGradient
                      colors={["#FAD885", "#C49F59", "#8A622A"]}
                      style={{ borderRadius: 3 }}
                      className="flex-row items-center px-4 py-3 rounded-lg border border-[#D6AA63]/30"
                    >
                      <Ionicons name="search" size={20} color="#D6AA63" />
                      <TextInput
                        className="text-white ml-3 flex-1"
                        placeholder="Search countries..."
                        placeholderTextColor="#666"
                        autoFocus={true}
                      />
                    </LinearGradient>
                  </View>
                </View>

                <FlatList
                  data={countries}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) =>
                    renderListItem(item, handleCountrySelect, "country")
                  }
                  className="pb-5"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCurrencyModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-[#1A1A1A] rounded-t-3xl max-h-3/4">
                <View className="p-5 border-b border-white/10">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white text-xl font-bold">
                      Select Currency
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowCurrencyModal(false)}
                    >
                      <Ionicons name="close" size={24} color="#D6AA63" />
                    </TouchableOpacity>
                  </View>
                </View>

                <FlatList
                  data={currencies}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) =>
                    renderListItem(item, handleCurrencySelect, "currency")
                  }
                  className="pb-5"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-[#1A1A1A] rounded-t-3xl max-h-3/4">
                <View className="p-5 border-b border-white/10">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white text-xl font-bold">
                      Select Language
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowLanguageModal(false)}
                    >
                      <Ionicons name="close" size={24} color="#D6AA63" />
                    </TouchableOpacity>
                  </View>
                </View>

                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) =>
                    renderListItem(item, handleLanguageSelect, "language")
                  }
                  className="pb-5"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GradientBackground>
  );
};

export default SetupProfile;
