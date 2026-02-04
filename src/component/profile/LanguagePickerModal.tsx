import { Language } from "@/src/redux/language/languageApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GradientBackground from "../background/GradientBackground";

type LanguagePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  languages: Language[];
  onSelect: (language: Language) => void;
};

const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  visible,
  onClose,
  languages,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState("");

  // Filter languages by name
  const filteredLanguages = useMemo(() => {
    if (!searchText) return languages;
    return languages.filter((l) =>
      l.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [languages, searchText]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="rounded-t-3xl h-[75%] overflow-hidden">
          <GradientBackground>
            {/* Drag indicator */}
            <View className="items-center py-2">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="px-5 pb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                Select Language
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-9 h-9 rounded-full bg-[#C49F59] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View className="px-5 py-3">
              <View className="flex-row items-center bg-transparent border border-[#C49F59] rounded-xl px-3">
                <Ionicons name="search" size={18} color="#fff" />
                <TextInput
                  placeholder="Search language"
                  value={searchText}
                  onChangeText={setSearchText}
                  className="flex-1 px-2 py-2 text-sm text-white"
                  placeholderTextColor="#fff"
                />
              </View>
            </View>

            {/* Language List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  activeOpacity={0.7}
                  onPress={() => onSelect(lang)}
                  className="px-5 py-4 border-b border-[#C49F59]"
                >
                  <Text className="text-sm font-medium text-white">
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </GradientBackground>
        </View>
      </View>
    </Modal>
  );
};

export default LanguagePickerModal;
