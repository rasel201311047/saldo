import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type PickerCountry = {
  cca2: string;
  name: string;
  phoneCode: string;
  flag: string;
};

type PhoneCodeModalProps = {
  visible: boolean;
  onClose: () => void;
  countries: PickerCountry[];
  searchText: string;
  onSearchChange: (text: string) => void;
  onSelect: (country: PickerCountry) => void;
};

const PhoneCodeModal: React.FC<PhoneCodeModalProps> = ({
  visible,
  onClose,
  countries,
  searchText,
  onSearchChange,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl h-[75%] overflow-hidden">
          {/* Drag Indicator */}
          <View className="items-center py-2">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="px-5 pb-3 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-lg font-semibold text-[#0C243D]">
              Select Country
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#0C243D" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="px-5 py-3 border-b border-gray-100">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
              <Ionicons name="search" size={18} color="#6B7280" />
              <TextInput
                placeholder="Search country"
                value={searchText}
                onChangeText={onSearchChange}
                className="flex-1 px-2 py-2 text-sm text-[#0C243D]"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          {/* Country List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {countries.map((c) => (
              <TouchableOpacity
                key={c.cca2}
                activeOpacity={0.7}
                onPress={() => onSelect(c)}
                className="flex-row items-center px-5 py-4 border-b border-gray-100"
              >
                <Image
                  source={{ uri: c.flag }}
                  className="w-9 h-6 rounded-sm mr-4"
                />

                <View className="flex-1">
                  <Text className="text-sm font-medium text-[#0C243D]">
                    {c.name}
                  </Text>
                </View>

                <Text className="text-sm font-semibold text-gray-700">
                  {c.phoneCode}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PhoneCodeModal;
