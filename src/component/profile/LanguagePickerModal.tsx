import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useRef } from "react";
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

interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  languages: Language[];
  onSelect: (language: Language) => void;
  onSearch: (text: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  title?: string;
}

const LanguagePickerModal = memo(
  ({
    visible,
    onClose,
    languages,
    onSelect,
    onSearch,
    isLoading = false,
    searchTerm = "",
    title = "Select Language",
  }: Props) => {
    const searchInputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [visible]);

    const handleClose = useCallback(() => {
      Keyboard.dismiss();
      onClose();
    }, [onClose]);

    const handleSelect = useCallback(
      (item: Language) => {
        Keyboard.dismiss();
        onSelect(item);
      },
      [onSelect],
    );

    const renderItem = useCallback(
      ({ item, index }: { item: Language; index: number }) => (
        <TouchableOpacity
          onPress={() => handleSelect(item)}
          className={`py-4 px-5 active:bg-white/5 ${
            index !== languages.length - 1 ? "border-b border-white/10" : ""
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text
                className="text-white text-base font-medium"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.nativeName && item.nativeName !== item.name && (
                <Text className="text-white/40 text-sm mt-1" numberOfLines={1}>
                  {item.nativeName}
                </Text>
              )}
            </View>
            <View className="bg-[#D6AA63]/20 px-3 py-1.5 rounded-full">
              <Text className="text-[#D6AA63] text-sm font-semibold">
                {item.code.toUpperCase()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
      [handleSelect, languages.length],
    );

    const ListEmptyComponent = useCallback(
      () => (
        <View className="py-20 items-center">
          <View className="w-20 h-20 rounded-full bg-white/5 items-center justify-center mb-4">
            <Ionicons name="language-outline" size={40} color="#666" />
          </View>
          <Text className="text-white/60 text-base font-medium">
            No languages found
          </Text>
          <Text className="text-white/20 text-sm mt-2">
            Try a different search term
          </Text>
        </View>
      ),
      [],
    );

    const ListHeaderComponent = useCallback(
      () => (
        <View className="px-5 py-3 bg-white/5">
          <Text className="text-white/40 text-sm">
            {languages.length}{" "}
            {languages.length === 1 ? "language" : "languages"} available
          </Text>
        </View>
      ),
      [languages.length],
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
                      {title}
                    </Text>
                    <TouchableOpacity
                      onPress={handleClose}
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
                          ref={searchInputRef}
                          className="text-white ml-3 flex-1 text-base"
                          placeholder="Search languages..."
                          placeholderTextColor="#666"
                          onChangeText={onSearch}
                          value={searchTerm}
                          returnKeyType="search"
                          clearButtonMode="while-editing"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        {isLoading && (
                          <ActivityIndicator size="small" color="#D6AA63" />
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                </View>

                {/* Languages List */}
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.code}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: Platform.OS === "ios" ? 40 : 20,
                  }}
                  ListHeaderComponent={
                    languages.length > 0 ? ListHeaderComponent : null
                  }
                  ListEmptyComponent={ListEmptyComponent}
                  initialNumToRender={20}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  removeClippedSubviews={true}
                  keyboardShouldPersistTaps="handled"
                  getItemLayout={(data, index) => ({
                    length: 85,
                    offset: 85 * index,
                    index,
                  })}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);

LanguagePickerModal.displayName = "LanguagePickerModal";

export default LanguagePickerModal;
