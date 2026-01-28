import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
type Period = "Weekly" | "Monthly" | "Yearly";

interface SetupBudgetProps {
  opendelete: boolean;
  setOpendelete: (v: boolean) => void;
}

const DeleteModal: React.FC<SetupBudgetProps> = ({
  opendelete,
  setOpendelete,
}) => {
  return (
    <Modal visible={opendelete} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <Pressable
          onPress={() => setOpendelete(false)}
          className="absolute inset-0"
        />

        {/* CARD */}
        <View className="w-[88%] ">
          <LinearGradient
            colors={["#b08b4a5d", "#2626a149"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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
            <Text className="text-[#FFFFFF] w-[80%] mx-auto font-Inter text-center  text-xl font-bold">
              Are you sure to delete the category budget ?
            </Text>

            <TouchableOpacity className="bg-[#EE2626] my-[1%] py-2 w-full  rounded-lg justify-center items-center">
              <Text className="text-base text-[#fff] font-Inter">Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setOpendelete(false)}
              className="border border-[#fff] my-[3%] py-2 w-full  rounded-lg justify-center items-center"
            >
              <Text className="text-base text-[#fff] font-Inter">No</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
