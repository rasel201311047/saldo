import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Modal, Text, View } from "react-native";
interface SuccessModalProps {
  visible: boolean;
  message?: string;
  close: () => void;
}

const SuccessModalAll: React.FC<SuccessModalProps> = ({
  visible,
  close,
  message,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        close?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, close]);

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

export default SuccessModalAll;
