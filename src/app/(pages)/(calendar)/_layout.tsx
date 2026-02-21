import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="analytics" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="addspending" />
      <Stack.Screen name="addearning" />
      <Stack.Screen name="datecatagory" />
    </Stack>
  );
};

export default _layout;
