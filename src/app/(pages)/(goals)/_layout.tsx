import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="createforn" options={{ headerShown: false }} />
      <Stack.Screen name="goalsedit" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
