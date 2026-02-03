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
      <View className="flex-1 bg-black/80 justify-center items-center">
        <View className="w-[70%] max-h-[85%] rounded-3xl bg-[#1A1A24] border border-[#4F4F59] p-4">
          <Text className="text-lg text-[#fff] font-Inter text-center w-[70%] mx-auto">
            Are you sure you want to logout?
          </Text>

          <View className="flex-row items-center justify-center my-4">
            <TouchableOpacity
              className="px-[9%] py-[1%] border border-[#fff] rounded-lg mr-[2%]"
              onPress={onClose}
            >
              <Text className="text-[#fff] font-Inter  text-base">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-[9%] py-[1%] border border-red-400 rounded-lg mr-[2%]"
              onPress={handleLogout}
            >
              <Text className="text-red-400 font-Inter text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
