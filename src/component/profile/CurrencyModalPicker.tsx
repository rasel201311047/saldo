import { Currency } from "@/src/type/thepicker";
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

interface CurrencyPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currencies: Currency[];
  onSelect: (currency: Currency) => void;
  onSearch: (text: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
}

const CurrencyPickerModal: React.FC<CurrencyPickerModalProps> = ({
  visible,
  onClose,
  currencies,
  onSelect,
  onSearch,
  isLoading = false,
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
    (currency: Currency) => {
      onSelect(currency);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const renderCurrencyItem = useCallback(
    ({ item, index }: { item: Currency; index: number }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className="active:bg-white/5"
        activeOpacity={0.6}
        key={`currency-${item.code}-${index}`}
      >
        <View className="flex-row items-center px-5 py-4">
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 8 }}
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          >
            <Text className="text-white text-lg font-bold">
              {item.symbol || item.code.charAt(0)}
            </Text>
          </LinearGradient>

          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                className="text-white font-medium text-base"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-[#D6AA63] text-sm font-bold ml-2">
                {item.code}
              </Text>
            </View>

            <View className="flex-row items-center mt-1">
              <Text className="text-white/40 text-xs" numberOfLines={1}>
                {item.countries.slice(0, 2).join(" • ")}
              </Text>
              {item.countries.length > 2 && (
                <View className="ml-2 px-2 py-0.5 bg-white/5 rounded-full">
                  <Text className="text-white/40 text-xs">
                    +{item.countries.length - 2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View className="px-5 py-3 bg-white/5">
        <Text className="text-white/40 text-sm">
          {currencies.length} currencies available
        </Text>
      </View>
    ),
    [currencies.length],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="py-16 items-center">
        <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
          <Ionicons name="cash-outline" size={36} color="#666" />
        </View>
        <Text className="text-white/60 text-base font-medium">
          No currencies found
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
        <View className="flex-1 bg-black/95 justify-end">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className="bg-[#0A0A0A] rounded-t-3xl overflow-hidden"
              style={{
                maxHeight: "80%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 20,
              }}
            >
              {/* Header */}
              <View className="px-5 pt-5 pb-4 border-b border-white/5">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-2xl font-bold">
                    Select Currency
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
                    placeholder="Search by currency or country..."
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

              {/* Currencies List */}
              <FlatList
                data={currencies}
                keyExtractor={(item, index) => `currency-${item.code}-${index}`}
                renderItem={renderCurrencyItem}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  currencies.length > 0 ? ListHeaderComponent : null
                }
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

export default React.memo(CurrencyPickerModal);
