import React, { useEffect, useState } from "react";
import { BackHandler, Modal, Text, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

interface ColorPickerModalProps {
  visible: boolean;
  initialColor: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  initialColor,
  onClose,
  onSelectColor,
}) => {
  const [tempColor, setTempColor] = useState(initialColor);

  useEffect(() => {
    if (visible) {
      setTempColor(initialColor);
      console.log("Modal opened with color:", initialColor);
    }
  }, [visible, initialColor]);

  // 🔒 BLOCK ANDROID BACK BUTTON
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => backHandler.remove();
  }, [visible]);

  const onColorChange = (color: string) => {
    setTempColor(color);
    console.log("Color changed:", color);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={() => {
        console.log("Back button pressed - blocked");
      }}
    >
      {/* Backdrop */}
      <TouchableOpacity
        className="absolute inset-0 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      />

      <View className="flex-1 justify-center items-center px-4">
        <View
          className="bg-[#150000] border border-[#7C5100] rounded-2xl p-4 w-full max-w-md"
          onStartShouldSetResponder={() => true}
        >
          <Text className="text-lg font-bold mb-4 text-white">
            Pick a color
          </Text>

          <View className="mb-4" style={{ height: 260 }}>
            <ColorPicker
              color={tempColor}
              onColorChange={onColorChange}
              onColorChangeComplete={onColorChange}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
              gapSize={0}
              discrete={false}
              wheelLodingIndicator={
                <Text className="text-white">Loading...</Text>
              }
              swatches={true}
              swatchesOnly={false}
              swatchesLast={true}
              swatchesTitle={"Color swatches"}
              palette={[
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#FFFF00",
                "#FF00FF",
                "#00FFFF",
                "#000000",
                "#FFFFFF",
                "#FF8800",
                "#8800FF",
              ]}
            />
          </View>

          {/* Show current color hex and preview */}
          <View className="mb-4 flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-lg border border-[#7C5100]"
              style={{ backgroundColor: tempColor }}
            />
            <View className="flex-1 p-2 bg-gray-800 rounded-lg">
              <Text className="text-white text-center font-mono">
                {tempColor.toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={() => {
                console.log("Cancel pressed");
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              <Text className="text-black">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log("Select pressed with color:", tempColor);
                onSelectColor(tempColor);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-[#D69000]"
            >
              <Text className="text-white">Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;
