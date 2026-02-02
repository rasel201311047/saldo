import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose }) => {
  const handleLogout = async () => {};
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-[80%] bg-mainColor p-[3%] rounded-2xl">
          <Text className="text-lg text-Textcolor1 font-PoppinsSemiBold text-center w-[70%] mx-auto">
            Are you sure you want to logout?
          </Text>

          <View className="flex-row items-center justify-center my-4">
            <TouchableOpacity
              className="px-[3%] py-[1%] border border-color2 rounded-lg mr-[2%]"
              onPress={onClose}
            >
              <Text className="text-color2 font-PoppinsSemiBold text-base">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-[3%] py-[1%] border border-red-400 rounded-lg mr-[2%]"
              onPress={handleLogout}
            >
              <Text className="text-red-400 font-PoppinsSemiBold text-base">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
