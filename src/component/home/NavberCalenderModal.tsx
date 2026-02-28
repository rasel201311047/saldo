import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import ReportRangeModal from "./report/ReportRangeModal";

const { height } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply?: (data: {
    from: string | null;
    to: string | null;
    type: "weekly" | "monthly";
  }) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const NavberCalenderModal: React.FC<Props> = ({
  visible,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
}) => {
  const [selectedType, setSelectedType] = useState<"weekly" | "monthly">(
    "weekly",
  );

  const [startDate, setStartDate] = useState<string | null>(
    initialStartDate || null,
  );
  const [endDate, setEndDate] = useState<string | null>(initialEndDate || null);

  const todayString = new Date().toISOString().split("T")[0];

  const [currentMonth1, setCurrentMonth1] = useState(startDate || todayString);
  const [reportShow, setReportShow] = useState(false);

  const [currentMonth2, setCurrentMonth2] = useState(() => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return next.toISOString().split("T")[0];
  });
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  useEffect(() => {
    if (startDate) {
      setCurrentMonth1(startDate);

      const next = new Date(startDate);
      next.setMonth(next.getMonth() + 1);
      setCurrentMonth2(next.toISOString().split("T")[0]);
    }
  }, [startDate]);

  const handleDayPress = (day: any) => {
    const selected = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
    } else {
      if (selected < startDate) {
        setStartDate(selected);
        setEndDate(startDate);
      } else {
        setEndDate(selected);
      }
    }
  };

  //  Clean Period Marking
  const getMarkedDates = () => {
    if (!startDate) return {};

    let marked: any = {};

    if (!endDate) {
      marked[startDate] = {
        startingDay: true,
        endingDay: true,
        color: "#C49F59",
        textColor: "#000",
      };
      return marked;
    }

    let current = new Date(startDate);
    let end = new Date(endDate);

    while (current <= end) {
      const dateString = current.toISOString().split("T")[0];

      if (dateString === startDate) {
        marked[dateString] = {
          startingDay: true,
          color: "#C49F59",
          textColor: "#000",
        };
      } else if (dateString === endDate) {
        marked[dateString] = {
          endingDay: true,
          color: "#C49F59",
          textColor: "#000",
        };
      } else {
        marked[dateString] = {
          color: "#C49F59",
          textColor: "#000",
        };
      }

      current.setDate(current.getDate() + 1);
    }

    return marked;
  };

  const handleApply = () => {
    if (!startDate) return;

    onApply?.({
      from: startDate,
      to: endDate,
      type: selectedType,
    });

    setReportShow(true);
  };

  const formatDisplayDate = (date: string | null) => {
    if (!date) return "Select Date";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const calendarTheme = {
    backgroundColor: "#1A132F",
    calendarBackground: "#1A132F",
    textSectionTitleColor: "#C49F59",
    dayTextColor: "#ffffff",
    monthTextColor: "#ffffff",
    todayTextColor: "#FAD885",
    arrowColor: "#C49F59",
    textDisabledColor: "#4A4A4A",
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/80">
        <Pressable onPress={onClose} className="absolute inset-0" />

        <View className="flex-1 justify-center items-center px-4 py-6">
          <View
            className="w-full max-w-6xl bg-[#0E0A1F] rounded-3xl border border-[#C49F59] overflow-hidden"
            style={{
              maxHeight: height * 0.9,
              ...Platform.select({
                android: { elevation: 20 },
              }),
            }}
          >
            <ScrollView>
              <View className="flex-col">
                {/* LEFT SIDE */}
                <View className="flex-1 p-6">
                  <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 border border-[#C49F59] rounded-xl p-3">
                      <Text className="text-white">
                        {formatDisplayDate(startDate)}
                      </Text>
                    </View>

                    <View className="flex-1 border border-[#C49F59] rounded-xl p-3">
                      <Text className="text-white">
                        {formatDisplayDate(endDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-col gap-4">
                    <Calendar
                      current={currentMonth1}
                      onDayPress={handleDayPress}
                      markingType="period"
                      markedDates={getMarkedDates()}
                      theme={calendarTheme}
                      style={{ borderRadius: 12, height: 350 }}
                      firstDay={1}
                    />

                    <Calendar
                      current={currentMonth2}
                      onDayPress={handleDayPress}
                      markingType="period"
                      markedDates={getMarkedDates()}
                      theme={calendarTheme}
                      style={{ borderRadius: 12, height: 350 }}
                      firstDay={1}
                    />
                  </View>
                </View>

                {/* RIGHT SIDE */}
                <View className="w-full  mx-auto border-[#C49F59] p-5">
                  <TouchableOpacity
                    onPress={handleApply}
                    className="mt-10 bg-[#C49F59] py-4 rounded-full"
                  >
                    <Text className="text-center font-bold text-black">
                      Apply
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onClose}
                    className="mt-2 border border-[#C49F59] py-4 rounded-full"
                  >
                    <Text className="text-center font-bold text-[#C49F59]">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <ReportRangeModal
        visible={reportShow}
        onClose={() => setReportShow(false)}
        startDate={startDate ? new Date(startDate) : new Date()}
        endDate={endDate ? new Date(endDate) : new Date()}
      />
    </Modal>
  );
};

export default NavberCalenderModal;
