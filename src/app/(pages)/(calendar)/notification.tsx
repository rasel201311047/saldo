import GradientBackground from "@/src/component/background/GradientBackground";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    id: 1,
    title: "Budget Alert: Housing",
    message: "You've used 90% of your housing budget for this month",
    time: "2 hours ago",
    icon: <MaterialIcons name="warning" size={18} color="#FACC15" />,
    gradient: ["#3b2f14", "#1a1408"],
    border: "#FACC15",
    status: true,
  },
  {
    id: 2,
    title: "Transaction Added",
    message: "Monthly salary of $5,000 has been recorded",
    time: "5 hours ago",
    icon: <Feather name="check-circle" size={18} color="#22C55E" />,
    gradient: ["#0f2d26", "#081a16"],
    border: "#22C55E",
    status: true,
  },
  {
    id: 3,
    title: "Budget Exceeded",
    message: "Shopping expenses exceeded by $120 this month",
    time: "Yesterday",
    icon: <MaterialIcons name="error-outline" size={18} color="#F43F5E" />,
    gradient: ["#2a0f16", "#16080c"],
    border: "#F43F5E",
    status: false,
  },
  {
    id: 4,
    title: "Weekly Report Ready",
    message: "Your weekly financial summary is now available",
    time: "3 days ago",
    icon: <Feather name="bell" size={18} color="#38BDF8" />,
    gradient: ["#0c1f2e", "#07131d"],
    border: "#38BDF8",
    status: false,
  },
];

const Notification = () => {
  return (
    <GradientBackground>
      <View className="flex-1">
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center gap-3 px-5 mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <LinearGradient
                colors={["#b08b4a6c", "#2626a18a"]}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5 name="arrow-left" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Notifications</Text>
          </View>

          {/* Notifications */}
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
          >
            {notifications.map((item) => (
              <LinearGradient
                key={item.id}
                colors={[item.gradient[0], item.gradient[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: item.border + "55",
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <View className="flex-row items-start gap-4">
                  {/* Icon */}
                  <View
                    style={{
                      backgroundColor: item.border + "22",
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-gray-400 text-sm leading-5">
                      {item.message}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-2">
                      {item.time}
                    </Text>
                  </View>

                  {/* Unread dot */}
                  {item.status && (
                    <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  )}
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default Notification;
