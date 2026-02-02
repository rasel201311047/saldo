import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
interface SetupBudgetProps {
  openComplete: boolean;
  setOpenComplete: (v: boolean) => void;
}

const CompleteModal: React.FC<SetupBudgetProps> = ({
  openComplete,
  setOpenComplete,
}) => {
  return (
    <Modal visible={openComplete} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <Pressable
          onPress={() => setOpenComplete(false)}
          className="absolute inset-0"
        />

        {/* CARD */}
        <View className="w-[88%]">
          <LinearGradient
            colors={["#b08b4a67", "#2626a183"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: "100%",
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderWidth: 1,
              borderColor: "#FFFFFF",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <View className="w-6 h-6 mx-auto">
              <LottieView
                source={require("../../../assets/lottie/Success.json")}
                autoPlay
                loop
              />
            </View>
            <Text className="text-[#FFFFFF] w-[80%] mx-auto font-Inter text-center  text-xl font-bold">
              Complete Goal
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setOpenComplete(false)}
                className="border border-[#fff] my-[3%] py-2 w-[54%]  rounded-lg justify-center items-center"
              >
                <Text className="text-base text-[#fff] font-Inter">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-[#38B27A] my-[1%] py-2 w-[45%]  rounded-lg justify-center items-center">
                <Text className="text-base text-[#fff] font-Inter">
                  Yes, Complete it
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default CompleteModal;
