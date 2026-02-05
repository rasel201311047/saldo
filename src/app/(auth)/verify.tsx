import GradientBackground from "@/src/component/background/GradientBackground";
import responsive from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Verify: React.FC = () => {
  // get the type
  const { typeOfvarification } = useLocalSearchParams();
  //min
  const [timeLeft, setTimeLeft] = useState(20);
  const [canResend, setCanResend] = useState(false);
  // ======================
  // otp
  // ======================
  const otpRefs = useRef<(RNTextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Handle OTP input
  const handleOTP = (text: string, index: number): void => {
    const numericText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    newOtp[index] = numericText;
    setOtp(newOtp);

    // Auto-focus next field
    if (numericText && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace Navigation
  const handleKeyPress = (
    index: number,
    value: string,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ): void => {
    if (event.nativeEvent.key === "Backspace" && !value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  // ============
  // Countdown timer
  // ============
  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time (MM:SS)
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Resend handler
  const handleResend = () => {
    setTimeLeft(20);
    console.log("Resend OTP triggered");
  };

  // handel send OTP
  const handleVarification = async () => {
    const code = otp.join("");
    console.log("===========================", code);
    console.log(code);
    if (typeOfvarification === "signup") {
      router.replace("/setupprofile");
    }
    if (typeOfvarification === "forget") {
      router.replace("/resetpassword");
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 w-[95%] mx-auto">
                {/* Back */}
                <TouchableOpacity
                  className="mt-[10%]"
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={26} color="white" />
                </TouchableOpacity>

                {/* Title */}
                <Text className="text-3xl font-Inter text-center mt-6 text-[#fff] font-semibold">
                  OTP Verification
                </Text>

                <Text className="text-gray-200 mt-2 text-center  text-base font-Inter">
                  Enter the 6 digits code that you received on {"\n"}
                  your email
                </Text>

                {/* OTP */}
                <View className="flex-row gap-2 justify-center my-5">
                  {otp.map((value, index) => (
                    <RNTextInput
                      key={index}
                      value={value}
                      style={{
                        width: responsive.scale(50),
                        height: responsive.scale(50),
                      }}
                      className={`border-2 ${
                        value ? "border-[#C49F59]" : "border-[#c49f5960]"
                      }  p-2  text-center text-[#fff] rounded-lg bg-transparent font-LexendBold text-3xl`}
                      keyboardType="numeric"
                      maxLength={1}
                      autoFocus={index === 0}
                      editable={!isSubmitting}
                      selectionColor={"#fff"}
                      onChangeText={(text) => handleOTP(text, index)}
                      onKeyPress={(e) => handleKeyPress(index, value, e)}
                      ref={(ref) => (otpRefs.current[index] = ref)}
                    />
                  ))}
                </View>

                {!canResend ? (
                  <Text className="mt-10 text-center font-Inter text-[#fff] font-bold text-sm">
                    Resend Code{" "}
                    <Text className="text-[#fff] font-Inter font-normal text-sm">
                      {formatTime(timeLeft)}
                    </Text>
                  </Text>
                ) : (
                  <Text className="mt-10 text-center font-Inter font-bold text-md"></Text>
                )}

                {/* Send Button */}
                {!canResend ? (
                  <TouchableOpacity
                    onPress={handleVarification}
                    activeOpacity={0.8}
                    className="my-4"
                  >
                    <LinearGradient
                      colors={["#B08A4A", "#E0B66A"]}
                      style={{ borderRadius: 8 }}
                      className="  py-4 items-center"
                    >
                      <Text className="text-white font-semibold text-base">
                        send
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleResend}
                    activeOpacity={0.8}
                    className="my-4"
                  >
                    <LinearGradient
                      colors={["#B08A4A", "#E0B66A"]}
                      style={{ borderRadius: 8 }}
                      className="  py-4 items-center"
                    >
                      <Text className="text-white font-semibold text-base">
                        Resend
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Verify;
