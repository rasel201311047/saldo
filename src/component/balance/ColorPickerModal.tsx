import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { ColorPicker as WheelColorPicker } from "react-native-wheel-color-picker";

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

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
        <View className="bg-[#1F1E2C] rounded-xl p-4 w-full">
          <WheelColorPicker
            color={tempColor}
            onColorChange={setTempColor}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
            style={{ width: "100%", height: 250 }}
          />

          <TouchableOpacity
            onPress={() => {
              onSelectColor(tempColor);
              onClose();
            }}
            className="mt-3 bg-[#C49F59] py-2 rounded-lg"
          >
            <Text className="text-center text-black font-Inter">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;
