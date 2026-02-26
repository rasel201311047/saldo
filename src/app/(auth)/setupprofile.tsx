// Updated SetupProfile.tsx with professional pickers
import GradientBackground from "@/src/component/background/GradientBackground";
import CountryPickerModal from "@/src/component/profile/CountryPickerModal";
import LanguagePickerModal from "@/src/component/profile/LanguagePickerModal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrencyPickerModal from "../../component/profile/CurrencyModalPicker";
import { useCountryDataPicker } from "../../hook/useCountryDataPicker";

// Types (these can be imported from your types file)
import { Country, Currency, Language } from "@/src/type/thepicker";

const SetupProfile = () => {
  // State
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Custom hook - now using useCountryDataPicker
  const {
    countries,
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

  // Form validation
  const isFormValid = useMemo(
    () => selectedCountry && selectedCurrency && selectedLanguage,
    [selectedCountry, selectedCurrency, selectedLanguage],
  );

  // Handlers
  const handleCountrySelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);

      // Auto-select currency based on country
      const currency = currencies.find((c) => c.code === country.currency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    },
    [currencies],
  );

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
  }, []);

  const handleLanguageSelect = useCallback((lang: Language) => {
    setSelectedLanguage(lang);
  }, []);

  // Selection display components
  const renderSelectedCountry = useCallback(() => {
    if (!selectedCountry) return null;

    return (
      <View className="flex-row items-center">
        <Text className="text-2xl mr-2">{selectedCountry.flagEmoji}</Text>
        <Text className="text-white text-base" numberOfLines={1}>
          {selectedCountry.countryName}
        </Text>
      </View>
    );
  }, [selectedCountry]);

  const renderSelectedCurrency = useCallback(() => {
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
  }, [selectedCurrency]);

  const renderSelectedLanguage = useCallback(() => {
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
  }, [selectedLanguage]);

  // Complete profile handler (this is where you'd typically send data to your backend)
  const handleCompleteProfile = async () => {
    if (!isFormValid) return;

    // Here you would typically send the selected data to your backend or context
    // For this example, we'll just log it to the console
    console.log("Profile Completed with:");
    console.log("Country:", selectedCountry);
    console.log("Currency:", selectedCurrency);
    console.log("Language:", selectedLanguage);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <GradientBackground>
        <SafeAreaView edges={["top"]} className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 px-5"
          >
            {/* Header */}
            <View className="mt-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-white/60 font-medium tracking-wider">
                  PROFILE SETUP
                </Text>
                <Text className="text-xs text-white/60 font-medium">
                  STEP 1 OF 1
                </Text>
              </View>

              {/* Progress bar */}
              <View className="h-1.5 bg-white/10 mt-3 rounded-full overflow-hidden">
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>

            {/* Title */}
            <View className="mt-10">
              <Text className="text-white text-4xl font-bold tracking-tight">
                Complete Your
              </Text>
              <Text className="text-white text-4xl font-bold mt-1">
                Profile
              </Text>
              <Text className="text-white/40 text-base mt-3 leading-5">
                Customize your experience by selecting your preferences
              </Text>
            </View>

            {/* Form */}
            <View className="mt-10 space-y-4">
              {/* Country */}
              <View>
                <Text className="text-white/60 text-sm font-medium mb-2 ml-1">
                  Country
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowCountryModal(true)}
                  className="flex-row items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-black/30"
                >
                  {renderSelectedCountry() || (
                    <Text className="text-white/40 text-base">
                      Select your country
                    </Text>
                  )}
                  <Ionicons name="chevron-down" size={20} color="#D6AA63" />
                </TouchableOpacity>
              </View>

              {/* Currency */}
              <View>
                <Text className="text-white/60 text-sm font-medium mb-2 ml-1">
                  Currency
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowCurrencyModal(true)}
                  className="flex-row items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-black/30"
                >
                  {renderSelectedCurrency() || (
                    <Text className="text-white/40 text-base">
                      Select your currency
                    </Text>
                  )}
                  <Ionicons name="chevron-down" size={20} color="#D6AA63" />
                </TouchableOpacity>
              </View>

              {/* Language */}
              <View>
                <Text className="text-white/60 text-sm font-medium mb-2 ml-1">
                  Language
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowLanguageModal(true)}
                  className="flex-row items-center justify-between px-5 py-4 rounded-2xl border border-white/10 bg-black/30"
                >
                  {renderSelectedLanguage() || (
                    <Text className="text-white/40 text-base">
                      Select your language
                    </Text>
                  )}
                  <Ionicons name="chevron-down" size={20} color="#D6AA63" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Continue Button */}
            <View className="flex-1 justify-end pb-8">
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isFormValid}
                className="w-full"
                onPress={handleCompleteProfile}
              >
                <LinearGradient
                  colors={
                    !isFormValid
                      ? ["#333", "#222", "#111"]
                      : ["#FAD885", "#C49F59", "#8A622A"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 rounded-2xl items-center"
                  style={{
                    shadowColor: !isFormValid ? "#000" : "#D6AA63",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                    borderRadius: 12,
                  }}
                >
                  <Text className="text-white font-bold text-lg tracking-wide">
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Modals */}
        <CountryPickerModal
          visible={showCountryModal}
          onClose={() => setShowCountryModal(false)}
          countries={countries}
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
      </GradientBackground>
    </>
  );
};

export default SetupProfile;
