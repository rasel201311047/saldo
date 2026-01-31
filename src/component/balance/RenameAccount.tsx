import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface SetupBudgetProps {
  openRemane: boolean;
  setOpenRename: (v: boolean) => void;
}

const RenameAccount: React.FC<SetupBudgetProps> = ({
  openRemane,
  setOpenRename,
}) => {
  return (
    <Modal
      visible={openRemane}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      <View className="flex-1 bg-black/60 justify-center items-center">
        <Pressable
          onPress={() => setOpenRename(false)}
          className="absolute inset-0"
        />

        {/* CARD */}
        <View className="w-[88%] ">
          <LinearGradient
            colors={["#1A1A24", "#1A1A24"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderWidth: 1,
              borderColor: "#4F4F59",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <View className="flex-row items-center justify-between w-full">
              <Text className="font-Inter text-xl font-semibold text-[#fff]">
                Rename
              </Text>
              <TouchableOpacity>
                <Ionicons name="close-sharp" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View className="w-full">
              <TextInput
                placeholder="Budget"
                placeholderTextColor="#8A8A96"
                keyboardType="numeric"
                value={"My Accout"}
                //   onChangeText={}
                className=" bg-[#242333] my-[6%] text-[#F1F1F2] px-4 py-4 rounded-lg border border-[#C49F59]"
              />
            </View>

            <View className=" w-full">
              <View className="flex-row items-center justify-center gap-[3%]">
                <Pressable
                  onPress={() => setOpenRename(false)}
                  className=" border border-[#4F4F59] py-2 px-4 rounded-xl"
                >
                  <Text className="text-white text-sm">Cancel</Text>
                </Pressable>
                <TouchableOpacity>
                  <LinearGradient
                    colors={["#FAD885", "#C49F59", "#8A622A"]}
                    style={{ borderRadius: 8 }}
                    className="px-8 py-2.5 rounded-lg"
                  >
                    <Text className="text-white font-Inter font-bold">OK</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default RenameAccount;
