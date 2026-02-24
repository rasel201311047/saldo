import Constants from "expo-constants";
// import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;

  //   if (!Device.isDevice) {
  //     console.log("Must use physical device for Push Notifications");
  //     return;
  //   }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token!");
    return;
  }

  // Get FCM / Expo token
  token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })
  ).data;

  console.log("FCM / Expo Token:", token);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
