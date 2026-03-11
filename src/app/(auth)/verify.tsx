import GradientBackground from "@/src/component/background/GradientBackground";
import {
  useOtpresendValidationMutation,
  useVerifyCodeMutation,
} from "@/src/redux/api/Auth/authApi";
import responsive from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const email = Array.isArray(typeOfvarification)
    ? typeOfvarification[0]
    : typeOfvarification || "";

  // Timer state
  const [timeLeft, setTimeLeft] = useState(180);
  const [canResend, setCanResend] = useState(false);

  // API mutations
  const [verifyCode, { isLoading: isLoadingVerifyCode }] =
    useVerifyCodeMutation();
  const [resendCode, { isLoading: isLoadingResendCode }] =
    useOtpresendValidationMutation();

  // OTP state
  const otpRefs = useRef<(RNTextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

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

  // Countdown timer
  useEffect(() => {
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
  const handleResend = async () => {
    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const response = await resendCode({
        email: email,
      }).unwrap();

      if (response?.success) {
        setTimeLeft(180);
        Alert.alert(
          "Success",
          "Verification code has been resent to your email",
        );
      }
    } catch (error: any) {
      console.error("Resend error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.data?.error?.message ||
        error?.message ||
        "Failed to resend code. Please try again.";

      Alert.alert("Error", errorMessage);
    }
  };

  // Handle verification
  const handleVerification = async () => {
    const code = otp.join("");

    // Validate OTP
    if (code.length < 6) {
      Alert.alert("Error", "Please enter complete 6-digit code");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const response = await verifyCode({
        email: email,
        otp: code,
      }).unwrap();

      if (response?.success) {
        Alert.alert("Success", "Email verified successfully!", [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/resetpassword",
                params: { email: email, otp: code },
              }),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Verification error:", error);

      const errorMessage =
        error?.data?.message ||
        error?.data?.error?.message ||
        error?.message ||
        "Failed to verify code. Please try again.";

      Alert.alert("Error", errorMessage);

      // Clear OTP fields on error
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
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

                <Text className="text-gray-200 mt-2 text-center text-base font-Inter">
                  Enter the 6 digits code that you received on {"\n"}
                  {email ? email : "your email"}
                </Text>

                {/* OTP Input Fields */}
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
                      } p-2 text-center text-[#fff] rounded-lg bg-transparent font-LexendBold text-3xl`}
                      keyboardType="numeric"
                      maxLength={1}
                      autoFocus={index === 0}
                      editable={!isLoadingVerifyCode}
                      selectionColor={"#fff"}
                      onChangeText={(text) => handleOTP(text, index)}
                      onKeyPress={(e) => handleKeyPress(index, value, e)}
                      ref={(ref) => (otpRefs.current[index] = ref)}
                    />
                  ))}
                </View>

                {/* Timer / Resend Text */}
                <Text className="mt-10 text-center font-Inter text-[#fff] font-bold text-sm">
                  {!canResend ? (
                    <>
                      Resend Code in{" "}
                      <Text className="text-[#fff] font-Inter font-normal text-sm">
                        {formatTime(timeLeft)}
                      </Text>
                    </>
                  ) : (
                    <>
                      Didn't receive the code?{" "}
                      <Text
                        onPress={handleResend}
                        className="text-[#C49F59] font-bold"
                      >
                        Resend
                      </Text>
                    </>
                  )}
                </Text>

                {/* Verify Button */}
                <TouchableOpacity
                  onPress={handleVerification}
                  activeOpacity={0.8}
                  className="my-4"
                  disabled={isLoadingVerifyCode}
                >
                  <LinearGradient
                    colors={["#B08A4A", "#E0B66A"]}
                    style={{ borderRadius: 8 }}
                    className="py-4 items-center"
                  >
                    {isLoadingVerifyCode ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-semibold text-base">
                        Verify
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Verify;
