import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setIconStyle } from "@/src/redux/slices/iconSlice";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  onSelect: (iconName: string) => void;
}

type IconStyle = "solid" | "regular" | "brands";

const ICONS_PER_PAGE = 50;

const IconSelector: React.FC<IconSelectorProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const dispatch = useAppDispatch();
  const { icons, style: currentStyle } = useAppSelector((state) => state.icons);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>(currentStyle);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get icons based on selected style
  const currentIcons = useMemo(() => {
    return icons.FontAwesome5[selectedStyle] || [];
  }, [icons.FontAwesome5, selectedStyle]);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return currentIcons;
    return currentIcons.filter((icon) =>
      icon.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [currentIcons, searchQuery]);

  // Paginate icons
  const paginatedIcons = useMemo(() => {
    return filteredIcons.slice(0, page * ICONS_PER_PAGE);
  }, [filteredIcons, page]);

  const hasMore = paginatedIcons.length < filteredIcons.length;

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoading(false);
      }, 300);
    }
  }, [hasMore, loading]);

  const handleStyleChange = useCallback(
    (newStyle: IconStyle) => {
      setSelectedStyle(newStyle);
      dispatch(setIconStyle(newStyle));
      setPage(1);
      setSearchQuery("");
    },
    [dispatch],
  );

  const handleSelectIcon = useCallback(
    (iconName: string) => {
      onSelect(iconName);
      onClose();
    },
    [onSelect, onClose],
  );

  const renderIcon = useCallback(
    ({ item: iconName, index }: { item: string; index: number }) => (
      <TouchableOpacity
        onPress={() => handleSelectIcon(iconName)}
        activeOpacity={0.7}
        className="items-center justify-center p-3 rounded-xl bg-[#2A2936] border border-[#3A3944] active:bg-[#3A3944]"
        style={{ width: "23%", margin: "1%" }}
      >
        <FontAwesome5
          name={iconName}
          size={24}
          color="#fff"
          solid={selectedStyle === "solid"}
        />
        <Text
          className="text-gray-400 text-xs mt-2 text-center"
          numberOfLines={1}
        >
          {iconName}
        </Text>
      </TouchableOpacity>
    ),
    [handleSelectIcon, selectedStyle],
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#6366f1" />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="py-10 items-center">
      <FontAwesome5 name="search" size={40} color="#4B5563" />
      <Text className="text-gray-400 text-base mt-3 text-center">
        {searchQuery
          ? `No icons found for "${searchQuery}"`
          : "No icons available"}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          onPress={() => setSearchQuery("")}
          className="mt-3 px-4 py-2 bg-[#3A3944] rounded-lg"
        >
          <Text className="text-white">Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const styles: { label: string; value: IconStyle }[] = [
    { label: "Solid", value: "solid" },
    { label: "Regular", value: "regular" },
    { label: "Brands", value: "brands" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/80">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-[#1F1E2C] rounded-t-3xl h-[90%] mt-auto overflow-hidden">
          {/* Header */}
          <View className="px-5 pt-5 pb-3 border-b border-[#2A2936]">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-white text-xl font-bold">
                  Select Icon
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {filteredIcons.length} icons available
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 rounded-full bg-[#2A2936] items-center justify-center"
              >
                <FontAwesome5 name="times" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-[#2A2936] rounded-xl px-4 py-2 border border-[#3A3944]">
              <FontAwesome5 name="search" size={16} color="#6B7280" />
              <TextInput
                className="flex-1 text-white ml-3 text-base"
                placeholder="Search icons..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setPage(1);
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <FontAwesome5 name="times-circle" size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Style Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4"
            >
              <View className="flex-row gap-2">
                {styles.map((style) => (
                  <TouchableOpacity
                    key={style.value}
                    onPress={() => handleStyleChange(style.value)}
                    className={`px-5 py-2.5 rounded-xl ${
                      selectedStyle === style.value
                        ? "bg-[#CEA55D]"
                        : "bg-[#2A2936] border border-[#3A3944]"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedStyle === style.value
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {style.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Icons Grid */}
          <FlatList
            data={paginatedIcons}
            renderItem={renderIcon}
            keyExtractor={(item, index) => `${item}-${index}`}
            numColumns={4}
            contentContainerClassName="px-3 py-4"
            columnWrapperClassName="justify-between"
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={20}
            windowSize={10}
            removeClippedSubviews={true}
            initialNumToRender={20}
          />

          {/* Quick Stats */}
          <View className="px-5 py-3 border-t border-[#2A2936] flex-row justify-between items-center">
            <Text className="text-gray-400 text-xs">
              Showing {paginatedIcons.length} of {filteredIcons.length} icons
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 bg-[#2A2936] rounded-lg"
            >
              <Text className="text-white text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(IconSelector);
