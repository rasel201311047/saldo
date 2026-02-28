import GradientBackground from "@/src/component/background/GradientBackground";
import { useGetNotificationDataQuery } from "@/src/redux/api/Page/calendar/calendarApi";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { formatDistanceToNow, parseISO } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper function to get icon based on notification type
const getNotificationIcon = (type: string, isRead: boolean) => {
  const iconColor = isRead ? "#9CA3AF" : "#FBBF24";

  switch (type?.toUpperCase()) {
    case "SYSTEM":
      return {
        icon: (
          <MaterialIcons
            name="notifications-active"
            size={20}
            color={iconColor}
          />
        ),
        gradient: isRead ? ["#1F2937", "#111827"] : ["#2A2A1A", "#1A1A0A"],
        border: isRead ? "#4B5563" : "#FBBF24",
        bgColor: isRead ? "#374151" : "#FBBF2422",
      };
    case "BUDGET":
      return {
        icon: (
          <MaterialIcons
            name="account-balance-wallet"
            size={20}
            color={iconColor}
          />
        ),
        gradient: isRead ? ["#1F2937", "#111827"] : ["#1A2A1A", "#0A1A0A"],
        border: isRead ? "#4B5563" : "#10B981",
        bgColor: isRead ? "#374151" : "#10B98122",
      };
    case "TRANSACTION":
      return {
        icon: <Feather name="credit-card" size={20} color={iconColor} />,
        gradient: isRead ? ["#1F2937", "#111827"] : ["#1A1A2A", "#0A0A1A"],
        border: isRead ? "#4B5563" : "#3B82F6",
        bgColor: isRead ? "#374151" : "#3B82F622",
      };
    case "ALERT":
      return {
        icon: <MaterialIcons name="warning" size={20} color={iconColor} />,
        gradient: isRead ? ["#1F2937", "#111827"] : ["#2A1A1A", "#1A0A0A"],
        border: isRead ? "#4B5563" : "#EF4444",
        bgColor: isRead ? "#374151" : "#EF444422",
      };
    default:
      return {
        icon: <Feather name="bell" size={20} color={iconColor} />,
        gradient: isRead ? ["#1F2937", "#111827"] : ["#1F2937", "#111827"],
        border: isRead ? "#4B5563" : "#6B7280",
        bgColor: isRead ? "#374151" : "#6B728022",
      };
  }
};

// Format date to relative time
const formatRelativeTime = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Unknown time";
  }
};

const Notification = () => {
  const {
    data: getNotificationData,
    isLoading: notificationLoading,
    refetch,
  } = useGetNotificationDataQuery();

  const [refreshing, setRefreshing] = React.useState(false);

  const notifications = useMemo(() => {
    return getNotificationData?.data || [];
  }, [getNotificationData]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: any[] } = {};

    notifications.forEach((notification: any) => {
      const date = parseISO(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey = "";

      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday";
      } else {
        groupKey = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  }, [notifications]);

  if (notificationLoading && !refreshing) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FBBF24" />
          <Text className="text-gray-400 mt-4">Loading notifications...</Text>
        </View>
      </GradientBackground>
    );
  }

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

          {/* Notifications List */}
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FBBF24"
                colors={["#FBBF24"]}
              />
            }
          >
            {notifications.length === 0 ? (
              <View className="flex-1 justify-center items-center py-20">
                <View className="bg-gray-800/50 rounded-full p-6 mb-4">
                  <Feather name="bell-off" size={40} color="#4B5563" />
                </View>
                <Text className="text-white text-lg font-semibold mb-2">
                  No notifications yet
                </Text>
                <Text className="text-gray-400 text-center">
                  {`We'll notify you when something important arrives`}
                </Text>
              </View>
            ) : (
              Object.entries(groupedNotifications).map(([dateGroup, items]) => (
                <View key={dateGroup} className="mb-6">
                  {/* Date Header */}
                  <Text className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                    {dateGroup}
                  </Text>

                  {/* Notifications for this date */}
                  {items.map((item: any) => {
                    const iconConfig = getNotificationIcon(
                      item.type,
                      item.isRead,
                    );

                    return (
                      <TouchableOpacity
                        key={item._id}
                        activeOpacity={0.7}
                        onPress={() => {
                          // Handle notification press
                          console.log("Notification pressed:", item._id);
                        }}
                      >
                        <LinearGradient
                          colors={[
                            iconConfig.gradient[0],
                            iconConfig.gradient[1],
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor:
                              iconConfig.border + (item.isRead ? "22" : "55"),
                            padding: 16,
                            marginBottom: 10,
                          }}
                        >
                          <View className="flex-row items-start gap-4">
                            {/* Icon with enhanced styling */}
                            <View
                              style={{
                                backgroundColor: iconConfig.bgColor,
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1,
                                borderColor: iconConfig.border + "33",
                              }}
                            >
                              {iconConfig.icon}
                            </View>

                            {/* Content */}
                            <View className="flex-1">
                              <View className="flex-row items-center justify-between mb-1">
                                <Text
                                  className={`text-base font-semibold ${
                                    item.isRead ? "text-gray-300" : "text-white"
                                  }`}
                                >
                                  {item.title}
                                </Text>
                                <Text className="text-gray-500 text-xs">
                                  {formatRelativeTime(item.createdAt)}
                                </Text>
                              </View>

                              <Text
                                className={`text-sm leading-5 ${
                                  item.isRead
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                                numberOfLines={2}
                              >
                                {item.body}
                              </Text>

                              {/* Type badge */}
                              <View className="flex-row items-center mt-2">
                                <View
                                  className="px-2 py-1 rounded-full"
                                  style={{
                                    backgroundColor: iconConfig.bgColor,
                                  }}
                                >
                                  <Text
                                    className="text-xs font-medium"
                                    style={{ color: iconConfig.border }}
                                  >
                                    {item.type || "GENERAL"}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            {/* Unread indicator */}
                            {!item.isRead && (
                              <View
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: "#FBBF24",
                                  borderWidth: 2,
                                  borderColor: "#FBBF2444",
                                }}
                              />
                            )}
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            )}

            {/* Bottom padding */}
            <View className="h-10" />
          </ScrollView>
        </SafeAreaView>
      </View>
    </GradientBackground>
  );
};

export default Notification;
