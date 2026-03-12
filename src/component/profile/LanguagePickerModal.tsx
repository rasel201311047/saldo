import { Language } from "@/src/type/thepicker";
import { Ionicons } from "@expo/vector-icons";
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

interface LanguagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  languages: Language[];
  onSelect: (language: Language) => void;
  onSearch: (text: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  title?: string;
}

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  visible,
  onClose,
  languages,
  onSelect,
  onSearch,
  isLoading = false,
  searchTerm = "",
  title = "Select Language",
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
    (language: Language) => {
      onSelect(language);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const renderLanguageItem = useCallback(
    ({ item, index }: { item: Language; index: number }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className="active:bg-white/5"
        activeOpacity={0.6}
        key={`language-${item.code}-${index}`}
      >
        <View className="flex-row items-center px-5 py-4">
          <View className="w-12 h-12 rounded-full bg-[#D6AA63]/10 items-center justify-center mr-4">
            <Text className="text-white text-lg font-bold">
              {item.nativeName?.charAt(0) || item.name.charAt(0)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-white font-medium text-base">
              {item.name}
            </Text>
            {item.nativeName && item.nativeName !== item.name && (
              <Text className="text-white/40 text-sm mt-1">
                {item.nativeName}
              </Text>
            )}
          </View>

          <View className="px-3 py-1.5 bg-white/5 rounded-full">
            <Text className="text-white/60 text-xs font-medium uppercase">
              {item.code}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="py-16 items-center">
        <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
          <Ionicons name="language-outline" size={36} color="#666" />
        </View>
        <Text className="text-white/60 text-base font-medium">
          No languages found
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
                height: "80%",
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
                  <Text className="text-white text-2xl font-bold">{title}</Text>
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
                    placeholder="Search languages..."
                    placeholderTextColor="#666"
                    onChangeText={handleSearchChange}
                    defaultValue={searchTerm}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    autoCapitalize="none"
                  />
                  {isLoading && (
                    <ActivityIndicator size="small" color="#D6AA63" />
                  )}
                </View>
              </View>

              {/* Languages List */}
              <FlatList
                data={languages}
                keyExtractor={(item, index) => `language-${item.code}-${index}`}
                renderItem={renderLanguageItem}
                showsVerticalScrollIndicator={false}
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

export default React.memo(LanguagePickerModal);
