import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="analytics" />
      <Stack.Screen name="notification" />
    </Stack>
  );
};

export default _layout;
