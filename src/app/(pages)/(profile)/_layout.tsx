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
    </Stack>
  );
};

export default _layout;
