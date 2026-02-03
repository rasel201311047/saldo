import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Modal, Text, View } from "react-native";
interface SuccessModalProps {
  visible: boolean;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, message }) => {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        router.replace("/signin");
      }, 2000);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="w-[80%] p-5 rounded-2xl items-center  ">
          <LottieView
            source={require("../../../assets/lottie/Success.json")}
            autoPlay
            loop={false}
            style={{ width: 120, height: 120 }}
          />

          <Text className=" font-PoppinsMedium text-base text-gray-900 text-center">
            {message || "Password Reset Successful!"}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
