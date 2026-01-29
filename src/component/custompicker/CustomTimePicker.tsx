import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
  initialTime?: string;
}

export default function CustomTimePicker({
  visible,
  onClose,
  onConfirm,
  initialTime = "09:00 AM",
}: Props) {
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const hourInputRef = useRef<TextInput>(null);
  const minuteInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      parseInitialTime(initialTime);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start();

      // Auto-focus hour input when modal opens
      setTimeout(() => {
        hourInputRef.current?.focus();
      }, 300);
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      setShowPeriodDropdown(false);
    }
  }, [visible, initialTime]);

  const parseInitialTime = (time: string) => {
    const timeParts = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeParts) {
      let h = parseInt(timeParts[1], 10);
      const m = timeParts[2];
      const p = timeParts[3].toUpperCase() as "AM" | "PM";

      // Convert to 12-hour format
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      setHour(displayHour.toString().padStart(2, "0"));
      setMinute(m);
      setPeriod(p);
    }
  };

  const handleHourChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText === "") {
      setHour("");
      return;
    }

    let num = parseInt(numericText, 10);

    // Validate hour range (1-12)
    if (num > 12) {
      num = 12;
    } else if (num < 1 && numericText !== "") {
      num = 1;
    }

    const formattedHour = num.toString();
    setHour(formattedHour);

    // Auto-focus to minute after 2 digits
    if (numericText.length >= 2) {
      minuteInputRef.current?.focus();
    }
  };

  const handleMinuteChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText === "") {
      setMinute("");
      return;
    }

    let num = parseInt(numericText, 10);

    // Validate minute range (0-59)
    if (num > 59) {
      num = 59;
    } else if (num < 0 && numericText !== "") {
      num = 0;
    }

    const formattedMinute = num.toString().padStart(2, "0");
    setMinute(formattedMinute);

    // Auto-close keyboard after 2 digits
    if (numericText.length >= 2) {
      Keyboard.dismiss();
    }
  };

  const handleHourBlur = () => {
    if (hour === "" || parseInt(hour, 10) < 1) {
      setHour("01");
    } else if (parseInt(hour, 10) > 12) {
      setHour("12");
    } else {
      setHour(parseInt(hour, 10).toString().padStart(2, "0"));
    }
  };

  const handleMinuteBlur = () => {
    if (minute === "" || parseInt(minute, 10) < 0) {
      setMinute("00");
    } else if (parseInt(minute, 10) > 59) {
      setMinute("59");
    } else {
      setMinute(parseInt(minute, 10).toString().padStart(2, "0"));
    }
  };

  const handlePeriodSelect = (p: "AM" | "PM") => {
    setPeriod(p);
    setShowPeriodDropdown(false);
  };

  const togglePeriodDropdown = () => {
    setShowPeriodDropdown(!showPeriodDropdown);
  };

  const submit = () => {
    // Validate inputs
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);

    const validHour = h >= 1 && h <= 12 ? h : 9;
    const validMinute = m >= 0 && m <= 59 ? m : 0;

    const formattedHour = validHour.toString().padStart(2, "0");
    const formattedMinute = validMinute.toString().padStart(2, "0");

    onConfirm(`${formattedHour}:${formattedMinute} ${period}`);
    onClose();
  };

  const handleContainerPress = () => {
    Keyboard.dismiss();
    if (showPeriodDropdown) {
      setShowPeriodDropdown(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <BlurView
        intensity={80}
        tint="dark"
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor:
            Platform.OS === "web" ? "rgba(0, 0, 0, 0.7)" : "transparent",
        }}
      >
        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={onClose}
        >
          <View className="flex-1" />
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={handleContainerPress}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
            className="w-full max-w-[420px] px-5"
          >
            <View>
              <LinearGradient
                colors={[
                  "rgba(176, 138, 74, 0.15)",
                  "rgba(224, 182, 106, 0.1)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl border border-[rgba(176,138,74,0.3)] overflow-hidden shadow-lg shadow-[#E0B66A]/30"
                style={{
                  shadowOffset: { width: 0, height: 10 },
                  shadowRadius: 20,
                  elevation: 20,
                }}
              >
                <View className="bg-[#0F0E17]/95">
                  {/* Header */}
                  <LinearGradient
                    colors={[
                      "rgba(176, 138, 74, 0.2)",
                      "rgba(224, 182, 106, 0.15)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="pt-7 pb-6 px-7 border-b border-[rgba(176,138,74,0.1)]"
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-2xl font-bold tracking-tight">
                          Select Time
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close-sharp" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  {/* Time Picker Content */}
                  <View className="p-7">
                    <View className="mb-6 flex-row justify-between items-center">
                      <View className="flex-1 mr-2">
                        <Text className="text-[#E0B66A] text-xs font-semibold tracking-wider mb-3 text-center">
                          HOUR
                        </Text>
                        <TextInput
                          ref={hourInputRef}
                          value={hour}
                          onChangeText={handleHourChange}
                          onBlur={handleHourBlur}
                          className="bg-[#2A293B]/80 border-2 border-[#E0B66A]/40 rounded-2xl text-white text-3xl font-bold text-center py-4 px-4 tracking-wider w-full"
                          keyboardType="number-pad"
                          maxLength={2}
                          placeholder="09"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            minuteInputRef.current?.focus()
                          }
                        />
                        <Text className="text-[#E0B66A]/50 text-xs text-center mt-2">
                          (1-12)
                        </Text>
                      </View>

                      {/* Separator */}
                      <View className="pt-8">
                        <Text className="text-[#E0B66A] text-3xl font-bold opacity-60">
                          :
                        </Text>
                      </View>

                      {/* Minute Input */}
                      <View className="flex-1 mx-2">
                        <Text className="text-[#E0B66A] text-xs font-semibold tracking-wider mb-3 text-center">
                          MINUTE
                        </Text>
                        <TextInput
                          ref={minuteInputRef}
                          value={minute}
                          onChangeText={handleMinuteChange}
                          onBlur={handleMinuteBlur}
                          className="bg-[#2A293B]/80 border-2 border-[#E0B66A]/40 rounded-2xl text-white text-3xl font-bold text-center py-4 px-4 tracking-wider w-full"
                          keyboardType="number-pad"
                          maxLength={2}
                          placeholder="00"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          returnKeyType="done"
                          onSubmitEditing={Keyboard.dismiss}
                        />
                        <Text className="text-[#E0B66A]/50 text-xs text-center mt-2">
                          (00-59)
                        </Text>
                      </View>

                      {/* AM/PM Dropdown */}
                      <View className="flex-1 ml-2">
                        <Text className="text-[#E0B66A] text-xs font-semibold tracking-wider mb-3 text-center">
                          PERIOD
                        </Text>
                        <View className="relative w-full">
                          <TouchableOpacity
                            onPress={togglePeriodDropdown}
                            activeOpacity={0.8}
                            className="w-full"
                          >
                            <LinearGradient
                              colors={["#B08A4A", "#E0B66A"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ borderRadius: 16 }}
                              className="py-5 px-3  items-center justify-center"
                            >
                              <Text className="text-center text-xl font-bold text-white">
                                {period}
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>

                          {/* Dropdown Menu */}
                          {showPeriodDropdown && (
                            <View
                              className="absolute top-16 left-0 right-0 z-50 bg-[#0F0E17]/98 rounded-xl border-2 border-[#E0B66A]/40 shadow-lg shadow-[#E0B66A]/30 overflow-hidden"
                              style={{
                                shadowOffset: { width: 0, height: 4 },
                                shadowRadius: 12,
                                elevation: 10,
                              }}
                            >
                              {(["AM", "PM"] as const).map((p) => (
                                <TouchableOpacity
                                  key={p}
                                  onPress={() => handlePeriodSelect(p)}
                                  activeOpacity={0.7}
                                  className={`py-4 px-3 bg-[#B08A4A] `}
                                >
                                  <Text
                                    className={`text-center text-lg font-semibold text-white`}
                                  >
                                    {p}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                        <Text className="text-[#E0B66A]/50 text-xs text-center mt-2">
                          AM/PM
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-4">
                      <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.7}
                        className="flex-1 py-4 rounded-xl border border-white/10 bg-white/5"
                      >
                        <Text className="text-white/80 text-center text-base font-semibold">
                          Cancel
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={submit}
                        activeOpacity={0.8}
                        className="flex-1 rounded-xl overflow-hidden"
                      >
                        <LinearGradient
                          colors={["#B08A4A", "#E0B66A"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="py-4"
                        >
                          <Text className="text-white text-center text-base font-bold tracking-wider">
                            CONFIRM
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
}
