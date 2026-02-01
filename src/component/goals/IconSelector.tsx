import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

import type { IconStyle } from "@/src/redux/types/icon";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IconSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (iconName: string, iconStyle: IconStyle) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const dispatch = useAppDispatch();
  const { icons, selectedIcon, style } = useAppSelector((state) => state.icons);
  console.log(icons);
  const [initialLoad, setInitialLoad] = useState(true);
  //   console.log("", allIcons);
  //   useEffect(() => {
  //     if (visible && initialLoad) {
  //       dispatch(loadIcons());
  //       setInitialLoad(false);
  //     }
  //   }, [visible]);

  const stylesFilter = [
    { label: "All", value: "all" as const, icon: "th" },
    { label: "Solid", value: "solid" as const, icon: "circle" },
    { label: "Regular", value: "regular" as const, icon: "circle" },
    { label: "Brands", value: "brands" as const, icon: "facebook" },
  ];

  //   const handleSelect = (icon: any) => {
  //     dispatch(selectIcon(icon));
  //     onSelect(icon.name, icon.style);
  //   };

  const getIconProps = (style: string) => ({ solid: style === "solid" });

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

          {/* Search */}
          <TextInput
            placeholder="Search icons..."
            placeholderTextColor="#aaa"
            // value={searchQuery}
            // onChangeText={(text) => dispatch(setSearchQuery(text))}
            className="bg-[#2A2940] text-white rounded-xl px-4 py-3 text-base mb-4"
          />

          {/* Style Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {stylesFilter.map((style) => (
                <TouchableOpacity
                  key={style.value}
                  //   onPress={() => dispatch(setSelectedStyle(style.value))}
                  //   className={`px-4 py-2 rounded-full ${
                  //     selectedStyle === style.value
                  //       ? "bg-[#C49F59]"
                  //       : "bg-[#2A2940]"
                  //   }`}
                >
                  <Text
                  // className={
                  //   selectedStyle === style.value
                  //     ? "text-white"
                  //     : "text-gray-400"
                  // }
                  >
                    {style.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Icons Grid */}
          {/* {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#C49F59" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="flex-row flex-wrap justify-between">
                {filteredIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon.id}
                    onPress={() => handleSelect(icon)}
                    className={`w-[18%] aspect-square rounded-xl justify-center items-center mb-3 ${
                      selectedIcon?.id === icon.id
                        ? "bg-[#C49F59]/20 border-2 border-[#C49F59]"
                        : "bg-[#2A2940]"
                    }`}
                  >
                    <FontAwesome5
                      name={icon.name}
                      size={22}
                      color="#fff"
                      {...getIconProps(icon.style)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )} */}
        </View>
      </View>
    </Modal>
  );
};

export default IconSelector;
