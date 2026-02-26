import { Country } from "@/src/type/thepicker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface CountryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  countries: Country[];
  popularCountries?: Country[];
  onSelect: (country: Country) => void;
  onSearch: (text: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  searchTerm?: string;
}

const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  visible,
  onClose,
  countries,
  popularCountries = [],
  onSelect,
  onSearch,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  searchTerm = "",
}) => {
  const searchInputRef = useRef<TextInput>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const debouncedSearch = useMemo(() => debounce(onSearch, 300), [onSearch]);

  const handleSearchChange = useCallback(
    (text: string) => {
      debouncedSearch(text);
    },
    [debouncedSearch],
  );

  const handleSelect = useCallback(
    (country: Country) => {
      onSelect(country);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const renderCountryItem = useCallback(
    ({ item, index }: { item: Country; index: number }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className="active:bg-white/5"
        activeOpacity={0.6}
        key={`country-${item.countryCode}-${index}`}
      >
        <View className="flex-row items-center px-5 py-4">
          <View className="w-10 h-10 rounded-full bg-[#D6AA63]/10 items-center justify-center mr-3">
            <Text className="text-xl">{item.flagEmoji}</Text>
          </View>

          <View className="flex-1">
            <Text className="text-white font-medium" numberOfLines={1}>
              {item.countryName}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-white/40 text-xs">{item.countryCode}</Text>
              <View className="w-1 h-1 rounded-full bg-white/20 mx-2" />
              <Text className="text-[#D6AA63] text-xs font-medium">
                {item.currency}
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#D6AA63" />
        </View>
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  const renderPopularItem = useCallback(
    ({ item, index }: { item: Country; index: number }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className="items-center mr-4"
        activeOpacity={0.6}
        key={`popular-${item.countryCode}-${index}`}
      >
        <LinearGradient
          colors={["#FAD885", "#C49F59", "#8A622A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 8 }}
          className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
        >
          <Text className="text-3xl">{item.flagEmoji}</Text>
        </LinearGradient>
        <Text className="text-white/80 text-xs font-medium" numberOfLines={1}>
          {item.countryName}
        </Text>
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  const ListFooterComponent = useCallback(
    () =>
      isLoading ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#D6AA63" />
          <Text className="text-white/40 text-sm mt-2">
            Loading countries...
          </Text>
        </View>
      ) : hasMore ? (
        <TouchableOpacity
          onPress={onLoadMore}
          className="py-4 items-center"
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 8 }}
            className="px-6 py-2 rounded-full"
          >
            <Text className="text-white font-medium">Load More</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null,
    [isLoading, hasMore, onLoadMore],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="py-16 items-center">
        <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
          <Ionicons name="earth-outline" size={36} color="#666" />
        </View>
        <Text className="text-white/60 text-base font-medium">
          No countries found
        </Text>
        <Text className="text-white/20 text-sm mt-1">
          Try a different search term
        </Text>
      </View>
    ),
    [],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/20 justify-end">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className="bg-[#0A0A0A] rounded-t-3xl overflow-hidden"
              style={{
                maxHeight: "90%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 20,
              }}
            >
              {/* Header */}
              <View className="px-5 pt-5 pb-3 border-b border-white/5">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-2xl font-bold">
                    Select Country
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
                    activeOpacity={0.6}
                  >
                    <Ionicons name="close" size={22} color="#D6AA63" />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View
                  className={`flex-row items-center px-4 py-3 rounded-xl border ${
                    isSearchFocused
                      ? "border-[#D6AA63] bg-[#D6AA63]/5"
                      : "border-white/10 bg-black/30"
                  }`}
                >
                  <Ionicons
                    name="search"
                    size={20}
                    color={isSearchFocused ? "#D6AA63" : "#666"}
                  />
                  <TextInput
                    ref={searchInputRef}
                    className="flex-1 text-white ml-3 text-base"
                    placeholder="Search by country or currency..."
                    placeholderTextColor="#666"
                    onChangeText={handleSearchChange}
                    defaultValue={searchTerm}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                  />
                  {isLoading && (
                    <ActivityIndicator size="small" color="#D6AA63" />
                  )}
                </View>
              </View>

              {/* Popular Countries */}
              {popularCountries.length > 0 && !searchTerm && (
                <View className="py-4">
                  <Text className="text-white/40 text-xs font-medium px-5 mb-3">
                    POPULAR COUNTRIES
                  </Text>
                  <FlatList
                    data={popularCountries}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderPopularItem}
                    keyExtractor={(item, index) =>
                      `popular-${item.countryCode}-${index}`
                    }
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                  />
                </View>
              )}

              {/* Countries List */}
              <FlatList
                data={countries}
                keyExtractor={(item, index) =>
                  `country-${item.countryCode}-${index}`
                }
                renderItem={renderCountryItem}
                showsVerticalScrollIndicator={false}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={ListFooterComponent}
                ListEmptyComponent={ListEmptyComponent}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={5}
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
  );
};

export default React.memo(CountryPickerModal);
