import responsive from "@/src/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type DayItem = {
  day: string;
  date: number;
  isToday: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  weekLabel: string;
  days: DayItem[];
};

const WeekPastdateModal = ({ visible, onClose, weekLabel, days }: Props) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable
        className="flex-1 bg-black/60 justify-center items-center"
        onPress={onClose}
      >
        <Pressable className="bg-[#0B0B0B] w-[90%] rounded-3xl p-5">
          <Text className="text-white text-center font-Inter font-semibold text-lg mb-4">
            {weekLabel}
          </Text>

          <View className="flex-row justify-between">
            {days.map((item, index) => (
              <TouchableOpacity
                onPress={() => router.push("/datecatagory")}
                key={index}
              >
                <LinearGradient
                  colors={
                    item.isToday
                      ? ["#FAD885", "#C49F59", "#8A622A"]
                      : ["#FAD885", "#C49F59", "#8A622A"]
                  }
                  style={{
                    width: responsive.scale(42),
                    height: responsive.scale(52),
                    borderRadius: 10,
                  }}
                  className=" rounded-xl justify-center items-center "
                >
                  <Text className="text-xs text-white">{item.day}</Text>
                  <Text className="text-lg font-bold text-white">
                    {item.date}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default WeekPastdateModal;
