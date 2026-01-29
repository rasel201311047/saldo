import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
interface Props {
  visible: boolean;
  date: string;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

const ITEM_HEIGHT = 45;
const YEAR_CHUNK_SIZE = 50;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomDatePicker = ({ visible, date, onClose, onConfirm }: Props) => {
  const [selectedDate, setSelectedDate] = useState(date);
  const [displayDate, setDisplayDate] = useState(date);

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearSearch, setYearSearch] = useState("");

  const yearScrollRef = useRef<ScrollView>(null);
  const isLoadingRef = useRef(false);

  const displayDateObj = new Date(displayDate);
  const selectedDateObj = new Date(selectedDate);

  const currentYear = displayDateObj.getFullYear();
  const currentMonth = displayDateObj.getMonth();

  /* ---------------- YEARS ---------------- */

  const generateYears = (center: number) => {
    const list: number[] = [];
    for (let y = center - 100; y <= center + 100; y++) list.push(y);
    return list;
  };

  const [years, setYears] = useState<number[]>(() =>
    generateYears(currentYear),
  );

  const mergeYears = (a: number[], b: number[]) =>
    Array.from(new Set([...a, ...b])).sort((x, y) => x - y);

  const handleYearScroll = (e: any) => {
    if (isLoadingRef.current) return;

    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const padding = 100;

    // Load next years
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - padding
    ) {
      isLoadingRef.current = true;
      const last = years[years.length - 1];
      const next = Array.from(
        { length: YEAR_CHUNK_SIZE },
        (_, i) => last + i + 1,
      );
      setYears((prev) => mergeYears(prev, next));
      setTimeout(() => (isLoadingRef.current = false), 100);
    }

    // Load previous years
    if (contentOffset.y < padding) {
      isLoadingRef.current = true;
      const first = years[0];
      const prev = Array.from(
        { length: YEAR_CHUNK_SIZE },
        (_, i) => first - (YEAR_CHUNK_SIZE - i),
      );

      setYears((old) => mergeYears(prev, old));

      setTimeout(() => {
        yearScrollRef.current?.scrollTo({
          y: contentOffset.y + YEAR_CHUNK_SIZE * ITEM_HEIGHT,
          animated: false,
        });
        isLoadingRef.current = false;
      }, 0);
    }
  };

  useEffect(() => {
    if (!showYearPicker) return;

    const index = years.indexOf(currentYear);
    if (index !== -1) {
      setTimeout(() => {
        yearScrollRef.current?.scrollTo({
          y: Math.max(0, index * ITEM_HEIGHT - 150),
          animated: true,
        });
      }, 100);
    }
  }, [showYearPicker]);

  const filteredYears = yearSearch
    ? years.filter((y) => y.toString().includes(yearSearch))
    : years;

  const handleYearSelect = (year: number) => {
    const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
    const day = Math.min(selectedDateObj.getDate(), daysInMonth);

    const newDate = new Date(year, currentMonth, day)
      .toISOString()
      .split("T")[0];

    setSelectedDate(newDate);
    setDisplayDate(newDate);
    setShowYearPicker(false);
    setYearSearch("");
  };

  /* ---------------- MONTH ---------------- */

  const handleMonthSelect = (monthIndex: number) => {
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const day = Math.min(selectedDateObj.getDate(), daysInMonth);

    const newDate = new Date(currentYear, monthIndex, day)
      .toISOString()
      .split("T")[0];

    setSelectedDate(newDate);
    setDisplayDate(newDate);
    setShowMonthPicker(false);
  };

  /* ---------------- DAY ---------------- */

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setDisplayDate(day.dateString);
  };

  useEffect(() => {
    if (visible) {
      setSelectedDate(date);
      setDisplayDate(date);
      setShowMonthPicker(false);
      setShowYearPicker(false);
      setYearSearch("");
    }
  }, [visible, date]);

  /* ---------------- UI ---------------- */

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center bg-black/60 px-4">
          <View className="w-full max-w-md rounded-3xl bg-[#1A1926] overflow-hidden">
            {/* HEADER */}
            <View className="border-b border-[#3A3950] p-4">
              <View className="flex-row justify-center gap-4 mb-4">
                <TouchableOpacity
                  onPress={() => {
                    setShowMonthPicker((v) => !v);
                    setShowYearPicker(false);
                  }}
                  className="bg-[#252535] px-4 py-2.5 flex-row items-center justify-center gap-[2%] rounded-lg"
                >
                  <Text className="text-white font-semibold text-lg">
                    {MONTHS[currentMonth]}
                  </Text>
                  <Entypo name="chevron-down" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowYearPicker((v) => !v);
                    setShowMonthPicker(false);
                  }}
                  className="bg-[#252535] px-4 py-2.5 flex-row items-center justify-center gap-[2%] rounded-lg"
                >
                  <Text className="text-white font-semibold text-lg">
                    {currentYear}
                  </Text>
                  <Entypo name="chevron-down" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* MONTH PICKER */}
              {showMonthPicker && (
                <View className="bg-[#252535] rounded-xl max-h-60">
                  <ScrollView>
                    {MONTHS.map((m, i) => (
                      <TouchableOpacity
                        key={m}
                        onPress={() => handleMonthSelect(i)}
                        className={`py-3 ${
                          i === currentMonth ? "bg-[#B08A4A]" : ""
                        }`}
                      >
                        <Text
                          className={`text-center text-lg ${
                            i === currentMonth
                              ? "text-white font-bold"
                              : "text-gray-300"
                          }`}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* YEAR PICKER */}
              {showYearPicker && (
                <View className="bg-[#252535] rounded-xl max-h-80">
                  <TextInput
                    value={yearSearch}
                    onChangeText={setYearSearch}
                    placeholder="Search year"
                    placeholderTextColor="#888"
                    keyboardType="number-pad"
                    className="m-3 rounded-lg bg-[#1A1926] px-4 py-2 text-white"
                  />

                  <ScrollView
                    ref={yearScrollRef}
                    onScroll={handleYearScroll}
                    scrollEventThrottle={16}
                  >
                    {filteredYears.map((y) => (
                      <TouchableOpacity
                        key={y}
                        onPress={() => handleYearSelect(y)}
                        className={`py-3 ${
                          y === currentYear ? "bg-[#B08A4A]" : ""
                        }`}
                      >
                        <Text
                          className={`text-center text-lg ${
                            y === currentYear
                              ? "text-white font-bold"
                              : "text-gray-300"
                          }`}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* CALENDAR */}
            {!showMonthPicker && !showYearPicker && (
              <Calendar
                current={displayDate}
                onDayPress={handleDayPress}
                hideArrows
                renderHeader={() => null}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: "#B08A4A",
                  },
                }}
                theme={{
                  calendarBackground: "#1A1926",
                  dayTextColor: "#fff",
                  monthTextColor: "#fff",
                  textDisabledColor: "#555",
                }}
              />
            )}

            {/* ACTIONS */}
            <View className="flex-row justify-center items-center gap-6 py-4">
              <TouchableOpacity onPress={onClose}>
                <Text className="text-gray-400">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onConfirm(selectedDate)}>
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 10 }}
                  className="rounded-lg px-6 py-2"
                >
                  <Text className="font-semibold text-white">Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomDatePicker;
