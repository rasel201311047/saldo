import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen name="profilesetting" />
      <Stack.Screen name="weeklyreport" />
      <Stack.Screen name="detailsweeklyreport" />
      <Stack.Screen name="startmonth" />
      <Stack.Screen name="changepassword" />
      <Stack.Screen name="about" />
      <Stack.Screen name="policy" />
      <Stack.Screen name="terms" />
    </Stack>
  );
};

export default _layout;
