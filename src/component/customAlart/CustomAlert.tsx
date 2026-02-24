import { CustomAlartImages } from "@/assets/customalart/customimage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "destructive" | "success" | "error";
}

const { width } = Dimensions.get("window");

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "success",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getGradientColors = () => {
    switch (type) {
      case "destructive":
      case "error":
        return ["#4A2A2A", "#2A1A1A"] as const;
      case "success":
        return ["#1A4A2A", "#0F2A1A"] as const;
      default:
        return ["#2A2A3A", "#1A1A2A"] as const;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case "destructive":
      case "error":
        return "#FF6B6B";
      case "success":
        return "#6BFF6B";
      default:
        return "#E0B66A";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "destructive":
      case "error":
        return CustomAlartImages.warning;
      case "success":
        return CustomAlartImages.success;
      default:
        return CustomAlartImages.letter_i;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={{
              width: width * 0.85,
              maxWidth: 400,
              transform: [{ scale: scaleAnim }],
              borderRadius: 28,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 20,
              },
              shadowOpacity: 0.5,
              shadowRadius: 30,
              elevation: 20,
            }}
          >
            <LinearGradient
              colors={getGradientColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 24 }}
            >
              {/* Decorative Accent Line */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: getAccentColor(),
                }}
              />

              {/* Icon Circle */}
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <Image
                    source={getIcon()}
                    style={{ width: 36, height: 36 }}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginBottom: 8,
                  letterSpacing: 0.5,
                  textShadowColor: "rgba(0,0,0,0.3)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                {title}
              </Text>

              {/* Message */}
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  marginBottom: 24,
                  lineHeight: 22,
                  letterSpacing: 0.3,
                }}
              >
                {message}
              </Text>

              {/* Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                {(type === "destructive" || onCancel) && (
                  <TouchableOpacity
                    onPress={onCancel}
                    activeOpacity={0.7}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: 14,
                        paddingVertical: 14,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        {cancelText}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Confirm Button */}
                <TouchableOpacity
                  onPress={onConfirm}
                  activeOpacity={0.8}
                  style={{
                    flex:
                      type === "destructive" || type === "error" || onCancel
                        ? 1
                        : 1,
                  }}
                >
                  <LinearGradient
                    colors={
                      type === "destructive" || type === "error"
                        ? ["#FF6B6B", "#FF4444"]
                        : ["#B08A4A", "#E0B66A"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                      }}
                    >
                      {confirmText}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

export default CustomAlert;
