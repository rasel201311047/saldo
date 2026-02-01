import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(balance)" options={{ headerShown: false }} />
      <Stack.Screen name="(calendar)" options={{ headerShown: false }} />
      <Stack.Screen name="(goals)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
