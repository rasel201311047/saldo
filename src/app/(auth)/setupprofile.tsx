import GradientBackground from "@/src/component/background/GradientBackground";
import LanguagePickerModal from "@/src/component/profile/LanguagePickerModal";
import { useProfileData } from "@/src/hook/useProfileData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface Country {
  countryCode: string;
  countryName: string;
  currency: string;
  flagEmoji: string;
}

interface Currency {
  code: string;
  name: string;
  countries: string[];
  flag: string;
}

interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

const SetupProfile = () => {
  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // Custom hook
  const {
    countries,
    popularCountries,
    isLoadingCountries,
    isFetchingCountries,
    isSearchingCountries,
    hasMoreCountries,
    loadMoreCountries,
    setCountrySearch,
    clearCountrySearch,
    countrySearchTerm,
    currencies,
    isLoadingCurrencies,
    setCurrencySearch,
    clearCurrencySearch,
    currencySearchTerm,
    languages,
    isLoadingLanguages,
    setLanguageSearch,
    clearLanguageSearch,
    languageSearchTerm,
  } = useProfileData();

  // Refs
  const countrySearchInputRef = useRef<TextInput>(null);
  const currencySearchInputRef = useRef<TextInput>(null);

  // Form validation
  const isFormValid = useMemo(
    () => selectedCountry && selectedCurrency && selectedLanguage,
    [selectedCountry, selectedCurrency, selectedLanguage],
  );

  // Handlers
  const handleCountrySelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      setShowCountryModal(false);
      clearCountrySearch();

      // Auto-select currency based on country
      const currency = currencies.find((c) => c.code === country.currency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    },
    [currencies, clearCountrySearch],
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      setSelectedCurrency(currency);
      setShowCurrencyModal(false);
      clearCurrencySearch();
    },
    [clearCurrencySearch],
  );

  const handleLanguageSelect = useCallback(
    (lang: Language) => {
      setSelectedLanguage(lang);
      setModalVisible(false);
      clearLanguageSearch();
    },
    [clearLanguageSearch],
  );

  const handleOpenCountryModal = useCallback(() => {
    setShowCountryModal(true);
    setTimeout(() => {
      countrySearchInputRef.current?.focus();
    }, 300);
  }, []);

  const handleOpenCurrencyModal = useCallback(() => {
    setShowCurrencyModal(true);
    setTimeout(() => {
      currencySearchInputRef.current?.focus();
    }, 300);
  }, []);

  const handleCloseCountryModal = useCallback(() => {
    setShowCountryModal(false);
    clearCountrySearch();
    Keyboard.dismiss();
  }, [clearCountrySearch]);

  const handleCloseCurrencyModal = useCallback(() => {
    setShowCurrencyModal(false);
    clearCurrencySearch();
    Keyboard.dismiss();
  }, [clearCurrencySearch]);

  // Render country item
  const renderCountryItem = useCallback(
    ({ item, index }: { item: Country; index: number }) => (
      <TouchableOpacity
        onPress={() => handleCountrySelect(item)}
        className={`py-4 px-5 active:bg-white/5 ${
          index !== countries.length - 1 ? "border-b border-white/10" : ""
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-[#D6AA63]/20 items-center justify-center mr-4">
            <Text className="text-2xl">{item.flagEmoji}</Text>
          </View>
          <View className="flex-1">
            <Text
              className="text-white text-base font-medium"
              numberOfLines={1}
            >
              {item.countryName}
            </Text>
            <Text className="text-white/40 text-sm mt-1">
              {item.currency} • {item.countryCode}
            </Text>
          </View>
          <View className="bg-[#D6AA63]/20 px-3 py-1.5 rounded-full">
            <Text className="text-[#D6AA63] text-sm font-semibold">
              {item.currency}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleCountrySelect, countries.length],
  );

  // Render currency item
  const renderCurrencyItem = useCallback(
    ({ item, index }: { item: Currency; index: number }) => (
      <TouchableOpacity
        onPress={() => handleCurrencySelect(item)}
        className={`py-4 px-5 active:bg-white/5 ${
          index !== currencies.length - 1 ? "border-b border-white/10" : ""
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-12 h-12 rounded-full items-center justify-center mr-4"
          >
            <Text className="text-white text-lg font-bold">
              {item.code.charAt(0)}
            </Text>
          </LinearGradient>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                className="text-white text-base font-medium"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-[#D6AA63] text-lg font-bold ml-2">
                ({item.code})
              </Text>
            </View>
            <Text className="text-white/40 text-sm mt-1" numberOfLines={1}>
              Used in: {item.countries.slice(0, 2).join(", ")}
              {item.countries.length > 2 && ` +${item.countries.length - 2}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleCurrencySelect, currencies.length],
  );

  // List footer
  const ListFooterComponent = useCallback(
    () =>
      isFetchingCountries || isSearchingCountries ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="large" color="#D6AA63" />
          <Text className="text-white/40 text-sm mt-2">Loading more...</Text>
        </View>
      ) : null,
    [isFetchingCountries, isSearchingCountries],
  );

  // Empty component
  const ListEmptyComponent = useCallback(
    (message: string) => (
      <View className="py-20 items-center">
        <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
          <Ionicons name="search-outline" size={40} color="#666" />
        </View>
        <Text className="text-white/60 text-base font-medium">{message}</Text>
        <Text className="text-white/20 text-sm mt-2">
          Try a different search
        </Text>
      </View>
    ),
    [],
  );

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
                <Text className="text-white/80 text-sm font-medium mb-2 ml-1">
                  🌐 Country
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleOpenCountryModal}
                  className="flex-row items-center justify-between px-5 py-4 rounded-2xl border border-[#D6AA63]/30 bg-black/30"
                >
                  <View className="flex-row items-center flex-1">
                    {selectedCountry && (
                      <Text className="text-2xl mr-3">
                        {selectedCountry.flagEmoji}
                      </Text>
                    )}
                    <Text
                      className={
                        selectedCountry
                          ? "text-white text-base"
                          : "text-white/40 text-base"
                      }
                      numberOfLines={1}
                    >
                      {selectedCountry?.countryName || "Select your country"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={22} color="#D6AA63" />
                </TouchableOpacity>
              </View>

              {/* Currency */}
              <View>
                <Text className="text-white/80 text-sm font-medium mb-2 ml-1">
                  💲 Currency
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleOpenCurrencyModal}
                  className="flex-row items-center justify-between px-5 py-4 rounded-2xl border border-[#D6AA63]/30 bg-black/30"
                >
                  <View className="flex-1">
                    <Text
                      className={
                        selectedCurrency
                          ? "text-white text-base"
                          : "text-white/40 text-base"
                      }
                      numberOfLines={1}
                    >
                      {selectedCurrency
                        ? `${selectedCurrency.code} - ${selectedCurrency.name}`
                        : "Select your currency"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={22} color="#D6AA63" />
                </TouchableOpacity>
              </View>

              {/* Language */}
              <View>
                <Text className="text-white/80 text-sm font-medium mb-2 ml-1">
                  🗣️ Language
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setModalVisible(true)}
                  className="flex-row items-center justify-between px-5 py-4 rounded-2xl border border-[#D6AA63]/30 bg-black/30"
                >
                  <Text
                    className={
                      selectedLanguage
                        ? "text-white text-base"
                        : "text-white/40 text-base"
                    }
                    numberOfLines={1}
                  >
                    {selectedLanguage?.name || "Select your language"}
                  </Text>
                  <Ionicons name="chevron-down" size={22} color="#D6AA63" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Continue Button */}
            <View className="flex-1 justify-end pb-8">
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isFormValid}
                className="w-full"
              >
                <LinearGradient
                  colors={
                    !isFormValid
                      ? ["#666", "#444", "#333"]
                      : ["#FAD885", "#C49F59", "#8A622A"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 rounded-2xl items-center"
                  style={{
                    shadowColor: !isFormValid ? "#666" : "#D6AA63",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
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

        {/* Country Modal */}
        <Modal
          visible={showCountryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseCountryModal}
          statusBarTranslucent
        >
          <TouchableWithoutFeedback onPress={handleCloseCountryModal}>
            <View className="flex-1 bg-black/95 justify-end">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                  className="bg-[#1A1A1A] rounded-t-3xl"
                  style={{
                    maxHeight: "90%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 10,
                  }}
                >
                  {/* Header */}
                  <View className="p-5 border-b border-white/10">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-2xl font-bold">
                        Select Country
                      </Text>
                      <TouchableOpacity
                        onPress={handleCloseCountryModal}
                        className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close" size={22} color="#D6AA63" />
                      </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View className="mt-4">
                      <LinearGradient
                        colors={["#FAD885", "#C49F59", "#8A622A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ padding: 1.5, borderRadius: 12 }}
                      >
                        <View className="flex-row items-center px-4 py-3.5 bg-[#1A1A1A] rounded-[10px]">
                          <Ionicons name="search" size={20} color="#D6AA63" />
                          <TextInput
                            ref={countrySearchInputRef}
                            className="text-white ml-3 flex-1 text-base"
                            placeholder="Search countries..."
                            placeholderTextColor="#666"
                            onChangeText={setCountrySearch}
                            value={countrySearchTerm}
                            returnKeyType="search"
                            clearButtonMode="while-editing"
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                          {isSearchingCountries && (
                            <ActivityIndicator size="small" color="#D6AA63" />
                          )}
                        </View>
                      </LinearGradient>
                    </View>
                  </View>

                  {/* Countries List */}
                  <FlatList
                    data={countries}
                    keyExtractor={(item) => item.countryCode}
                    renderItem={renderCountryItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMoreCountries}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={ListFooterComponent}
                    ListEmptyComponent={() =>
                      ListEmptyComponent("No countries found")
                    }
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingBottom: Platform.OS === "ios" ? 40 : 20,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Currency Modal */}
        <Modal
          visible={showCurrencyModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseCurrencyModal}
          statusBarTranslucent
        >
          <TouchableWithoutFeedback onPress={handleCloseCurrencyModal}>
            <View className="flex-1 bg-black/95 justify-end">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                  className="bg-[#1A1A1A] rounded-t-3xl"
                  style={{
                    maxHeight: "80%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 10,
                  }}
                >
                  {/* Header */}
                  <View className="p-5 border-b border-white/10">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-2xl font-bold">
                        Select Currency
                      </Text>
                      <TouchableOpacity
                        onPress={handleCloseCurrencyModal}
                        className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close" size={22} color="#D6AA63" />
                      </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View className="mt-4">
                      <LinearGradient
                        colors={["#FAD885", "#C49F59", "#8A622A"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ padding: 1.5, borderRadius: 12 }}
                      >
                        <View className="flex-row items-center px-4 py-3.5 bg-[#1A1A1A] rounded-[10px]">
                          <Ionicons name="search" size={20} color="#D6AA63" />
                          <TextInput
                            ref={currencySearchInputRef}
                            className="text-white ml-3 flex-1 text-base"
                            placeholder="Search currencies..."
                            placeholderTextColor="#666"
                            onChangeText={setCurrencySearch}
                            value={currencySearchTerm}
                            returnKeyType="search"
                            clearButtonMode="while-editing"
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                          {isLoadingCurrencies && (
                            <ActivityIndicator size="small" color="#D6AA63" />
                          )}
                        </View>
                      </LinearGradient>
                    </View>
                  </View>

                  {/* Currencies List */}
                  <FlatList
                    data={currencies}
                    keyExtractor={(item) => item.code}
                    renderItem={renderCurrencyItem}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={20}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={() =>
                      ListEmptyComponent("No currencies found")
                    }
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingBottom: Platform.OS === "ios" ? 40 : 20,
                    }}
                    ListHeaderComponent={
                      currencies.length > 0 ? (
                        <View className="px-5 py-3 bg-white/5">
                          <Text className="text-white/40 text-sm">
                            {currencies.length} currencies available
                          </Text>
                        </View>
                      ) : null
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Language Modal */}
        <LanguagePickerModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            clearLanguageSearch();
          }}
          languages={languages}
          onSelect={handleLanguageSelect}
          onSearch={setLanguageSearch}
          isLoading={isLoadingLanguages}
          searchTerm={languageSearchTerm}
          title="Select Language"
        />
      </GradientBackground>
    </>
  );
};

export default SetupProfile;
