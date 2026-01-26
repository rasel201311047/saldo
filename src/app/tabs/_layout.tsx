import CustomTabBar from "@/src/component/tab/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="goals" options={{ title: "Goals" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />

      <Tabs.Screen name="balance" options={{ title: "Balance" }} />
    </Tabs>
  );
}
