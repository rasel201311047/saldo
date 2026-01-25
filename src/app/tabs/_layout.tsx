import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

const _layout = () => {
  return (
    <Stack>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
