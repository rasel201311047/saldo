import { HomeImg } from "@/assets/home/homeimg";
import {
  usePatchBorrowedMarkMutation,
  usePatchGoalsCompleteMutation,
} from "@/src/redux/api/Page/Goals/goalsApi";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../customAlart/CustomAlert";
interface SetupBudgetProps {
  theCompleteId: string;
  catagory: string;
  openComplete: boolean;
  setOpenComplete: (v: boolean) => void;
}

const CompleteModal: React.FC<SetupBudgetProps> = ({
  theCompleteId,
  catagory,
  openComplete,
  setOpenComplete,
}) => {
  const [completethegoal, { isLoading: isLoadingGoal }] =
    usePatchGoalsCompleteMutation();
  const [markRepaid, { isLoading: isLoadingmarkRepaid }] =
    usePatchBorrowedMarkMutation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  console.log(theCompleteId);

  const handleTheComplete = async () => {
    try {
      let res;

      if (catagory === "goal") {
        res = await completethegoal(theCompleteId).unwrap();
      } else if (catagory === "borrowed") {
        res = await markRepaid(theCompleteId).unwrap();
      }

      if (res.success) {
        router.back();
      } else {
        setAlertVisible(true);
        setAlertTittle("Error");
        setAlertMessage(res?.message);
      }
    } catch (error) {
      setAlertVisible(true);
      console.log("Error completing goal:", error);
      setAlertTittle("Error");
      setAlertMessage(error?.data?.message);
    }
  };
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
            <View className="w-14 h-14  mb-3 mx-auto">
              <Image source={HomeImg.completeicon} className="w-full h-full" />
            </View>
            <Text className="text-[#FFFFFF] w-[80%] mx-auto font-Inter text-center  text-xl font-bold">
              {catagory === "goal" ? " Complete Goal" : "Mark as Repaid"}
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setOpenComplete(false)}
                className="border border-[#fff] my-[3%] py-2 w-[54%]  rounded-lg justify-center items-center"
              >
                <Text className="text-base text-[#fff] font-Inter">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTheComplete}
                className="bg-[#38B27A] my-[1%] py-2 w-[45%]  rounded-lg justify-center items-center"
              >
                <Text className="text-base text-[#fff] font-Inter">
                  {catagory === "goal" ? (
                    isLoadingGoal ? (
                      <View>
                        <ActivityIndicator size="small" color="#fff" />
                      </View>
                    ) : (
                      "Yes, complete it"
                    )
                  ) : isLoadingmarkRepaid ? (
                    <View>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  ) : (
                    "Yes, Repaid it"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
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

export default CompleteModal;
