import React, { useEffect, useState } from "react";
import { BackHandler, Modal, Text, TouchableOpacity, View } from "react-native";
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
} from "reanimated-color-picker";

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
    if (visible) setTempColor(initialColor);
  }, [visible, initialColor]);

  // 🔒 BLOCK ANDROID BACK BUTTON
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true, // ❌ prevent app close
    );

    return () => backHandler.remove();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={() => {
        /* DO NOTHING */
      }}
    >
      {/* Non-touchable backdrop */}
      <View className="absolute inset-0 bg-black/50" />

      <View className="flex-1 justify-center items-center px-4">
        <View
          className="bg-[#150000] border border-[#7C5100] rounded-2xl p-4 w-full max-w-md"
          onStartShouldSetResponder={() => true}
        >
          <Text className="text-lg font-bold mb-4">Pick a color</Text>

          <ColorPicker
            value={tempColor}
            // onComplete={onColorChange}
            // onComplete={(color) => setTempColor(color.hex)}
            // onComplete={(color) => {
            //   setTempColor(colorKit.HEX(color));
            // }}
          >
            <Panel1 style={{ height: 180, borderRadius: 12 }} />
            <HueSlider style={{ marginTop: 16 }} />
            <OpacitySlider style={{ marginTop: 12 }} />
          </ColorPicker>

          <View
            className="h-12 rounded-lg my-4 border"
            style={{ backgroundColor: tempColor }}
          />

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
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
