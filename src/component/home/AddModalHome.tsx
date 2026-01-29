import { earningicon, spendingicon } from "@/assets/icons";
import responsive from "@/src/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import EarnCategory from "./EarnCategory";
import SpendingAdd from "./SpendingAdd";
interface SetupBudgetProps {
  open: boolean;
  close: (v: boolean) => void;
}

const AddModalHome: React.FC<SetupBudgetProps> = ({ open, close }) => {
  const [spendingCatagoryOpen, setSpendingCatagoryOpen] = useState(false);
  const [earnCatagoryOpen, setEarnCatagoryOpen] = useState(false);

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center">
        <Pressable onPress={() => close(false)} className="absolute inset-0" />

        {/* CARD */}
        <View className="flex-1 w-[100%] ">
          <View className=" absolute bottom-36 right-3 flex-col items-end gap-4">
            <TouchableOpacity
              onPress={() => setSpendingCatagoryOpen(true)}
              className="flex-row items-center gap-4 bg-[#584C2F] py-2 px-3 rounded-full"
            >
              <View>
                <SvgXml xml={spendingicon} width={responsive.scale(20)} />
              </View>
              <View>
                <Text className="text-[#fff] text-base font-Inter">
                  Spendings
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEarnCatagoryOpen(true)}
              className="flex-row items-center gap-4 border border-[#584C2F] py-2 px-3 rounded-full "
            >
              <View>
                <SvgXml xml={earningicon} width={responsive.scale(20)} />
              </View>
              <View>
                <Text className="text-[#fff] text-base font-Inter">
                  Earnings
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => close(false)}>
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{
                  borderRadius: 10,
                  width: 42,
                  height: 42,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className=" "
              >
                <MaterialCommunityIcons
                  name="window-close"
                  size={24}
                  color="#fff"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SpendingAdd
        openModal={spendingCatagoryOpen}
        closeModal={() => setSpendingCatagoryOpen(false)}
      />

      <EarnCategory
        openModal={earnCatagoryOpen}
        close={() => setEarnCatagoryOpen(false)}
      />
    </Modal>
  );
};

export default AddModalHome;
