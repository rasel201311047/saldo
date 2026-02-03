import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="profilesetting" options={{ headerShown: false }} />
      <Stack.Screen name="weeklyreport" options={{ headerShown: false }} />
      <Stack.Screen
        name="detailsweeklyreport"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="startmonth" options={{ headerShown: false }} />
      <Stack.Screen name="changepassword" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="policy" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
