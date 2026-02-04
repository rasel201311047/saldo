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
import GradientBackground from "../background/GradientBackground";

export type PickerCountry = {
  cca2: string;
  name: string;
  phoneCode: string;
  flag: string;
};

type CountryModalProps = {
  visible: boolean;
  onClose: () => void;
  countries: PickerCountry[];
  searchText: string;
  onSearchChange: (text: string) => void;
  onSelect: (countryName: string) => void; // only country name
};

const CountryModal: React.FC<CountryModalProps> = ({
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
        <View className="rounded-t-3xl h-[75%] overflow-hidden">
          <GradientBackground>
            {/* Drag Indicator */}
            <View className="items-center py-2">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="px-5 pb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-[#fff]">
                Select Country
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
                  placeholder="Search country"
                  value={searchText}
                  onChangeText={onSearchChange}
                  className="flex-1 px-2 py-2 text-sm text-[#fff]"
                  placeholderTextColor="#fff"
                />
              </View>
            </View>

            {/* Country List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {countries.map((c) => (
                <TouchableOpacity
                  key={c.cca2}
                  activeOpacity={0.7}
                  onPress={() => onSelect(c.name)} // only send country name
                  className="flex-row items-center px-5 py-4 border-b border-[#C49F59]"
                >
                  <Image
                    source={{ uri: c.flag }}
                    className="w-9 h-6 rounded-sm mr-4"
                  />

                  <View className="flex-1">
                    <Text className="text-sm font-medium text-[#fff]">
                      {c.name}
                    </Text>
                  </View>

                  <Text className="text-sm font-semibold text-[#fff]">
                    {c.phoneCode} {/* still visible, but not selectable */}
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

export default CountryModal;
