import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

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
  const todayDate = new Date().getDate();

  // ✅ FILTER: show only past + today
  const filteredDays = days.filter((item) => item.date <= todayDate);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable
        className="flex-1 bg-black/60 justify-center items-center"
        onPress={onClose}
      >
        <Pressable className="bg-[#0B0B0B] border border-[#C49F59]  rounded-3xl p-5">
          <Text className="text-white text-center font-Inter font-semibold text-lg mb-4">
            {weekLabel}
          </Text>

          <View className="flex-row gap-[3%] justify-between">
            {filteredDays.map((item, index) => (
              <LinearGradient
                key={index}
                colors={
                  item.isToday
                    ? ["#FAD885", "#C49F59", "#8A622A"]
                    : ["#FAD885", "#C49F59", "#8A622A"]
                }
                style={{ borderRadius: 10 }}
                className="w-14 h-16 rounded-xl justify-center items-center"
              >
                <Text className="text-xs text-white">{item.day}</Text>
                <Text className="text-lg font-bold text-white">
                  {item.date}
                </Text>
              </LinearGradient>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default WeekPastdateModal;
