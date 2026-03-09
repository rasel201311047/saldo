import { useDeleteGoalMutation } from "@/src/redux/api/Page/Goals/goalsApi";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../customAlart/CustomAlert";
interface SetupBudgetProps {
  theDeleteId: string;
  opendelete: boolean;
  setOpendelete: (v: boolean) => void;
}

const DeleteModal: React.FC<SetupBudgetProps> = ({
  theDeleteId,
  opendelete,
  setOpendelete,
}) => {
  const [deletethegoal, { isLoading: isLoadingGoal }] = useDeleteGoalMutation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleDelete = async () => {
    try {
      const res = await deletethegoal(theDeleteId).unwrap();
      if (res.success) {
        router.back();
      } else {
        setAlertVisible(true);
        setAlertTittle("Error");
        setAlertMessage(res?.message);
      }
    } catch (error) {
      setAlertVisible(true);
      console.log("Error Delete goal:", error);
      setAlertTittle("Error");
      setAlertMessage(error?.data?.message);
    }
  };
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

            <TouchableOpacity
              onPress={handleDelete}
              className="bg-[#EE2626] my-[1%] py-2 w-full  rounded-lg justify-center items-center"
            >
              <Text className="text-base text-[#fff] font-Inter">
                {isLoadingGoal ? (
                  <View>
                    <ActivityIndicator size="small" color="#D4AF66" />
                  </View>
                ) : (
                  "Yes"
                )}
              </Text>
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
      <CustomAlert
        visible={alertVisible}
        title={alertTittle}
        message={alertMessage}
        onConfirm={() => {
          console.log("Confirmed");
          setAlertVisible(false);
        }}
        // onCancel={() => {
        //   console.log("Cancelled");
        //   setAlertVisible(false);
        // }}
        type={"error"}
        confirmText={"OK"}
        cancelText="Cancel"
      />
    </Modal>
  );
};

export default DeleteModal;
