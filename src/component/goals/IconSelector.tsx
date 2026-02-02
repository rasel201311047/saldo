import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IconSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const dispatch = useAppDispatch();
  const { icons } = useAppSelector((state) => state.icons);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-[#1F1E2C] rounded-t-3xl p-5 h-[85%] mt-auto">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-xl font-bold">Select Icon</Text>
              <Text className="text-gray-400 text-xs">
                {/* {allIcons.length} icons available */}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Style Filter */}
          <ScrollView className="mb-4">
            <View className="flex-row flex-wrap justify-center gap-4">
              {icons.FontAwesome5.solid.map((icon, index) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(icon);
                    onClose();
                  }}
                  key={index}
                >
                  <FontAwesome5 name={icon} size={24} color="white" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default IconSelector;
