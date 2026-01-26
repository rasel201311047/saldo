import {
  balanceicon,
  calendericon,
  focusBalance,
  focusCalender,
  focusGoals,
  goaldicon,
} from "@/assets/icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";

const { width } = Dimensions.get("window");

const TAB_COUNT = 3;
const TAB_WIDTH = width / TAB_COUNT;
const BAR_HEIGHT = 90;

type TabKey = "goals" | "calendar" | "balance";

const ICONS: Record<TabKey, string> = {
  goals: goaldicon,
  calendar: calendericon,
  balance: balanceicon,
};

const FICONS: Record<TabKey, string> = {
  goals: focusGoals,
  calendar: focusCalender,
  balance: focusBalance,
};

const getRouteKey = (name: string): TabKey | null => {
  const key = name.split("/").pop() as TabKey;
  return key in ICONS ? key : null;
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(state.index * TAB_WIDTH + 10, {
      duration: 280,
    });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const activeRouteKey = getRouteKey(state.routes[state.index].name);

  return (
    <View style={styles.container}>
      {/* ---------------- Focus Pill ---------------- */}
      {activeRouteKey && (
        <Animated.View style={[styles.focusPill, animatedStyle]}>
          <LinearGradient
            colors={["#b08b4a6c", "#2626a18a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={styles.pillGradient}
          >
            <SvgXml xml={FICONS[activeRouteKey]} width={22} height={22} />
            <Text style={styles.focusText} className="font-Inter">
              {activeRouteKey.charAt(0).toUpperCase() + activeRouteKey.slice(1)}
            </Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* ---------------- Tabs ---------------- */}
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = index === state.index;
          const routeKey = getRouteKey(route.name);

          if (!routeKey) return null;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate(route.name);
              }}
            >
              {!focused && (
                <>
                  <SvgXml
                    xml={ICONS[routeKey]}
                    width={22}
                    height={22}
                    opacity={0.5}
                    color={"#8C8C9A"}
                  />
                  <Text style={styles.label} className="font-Inter">
                    {routeKey.charAt(0).toUpperCase() + routeKey.slice(1)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",

    backgroundColor: "#171321",
  },

  row: {
    flexDirection: "row",
    height: BAR_HEIGHT,
  },

  tab: {
    width: TAB_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#8C8C9A",
  },

  focusPill: {
    position: "absolute",
    top: 12,
    width: TAB_WIDTH - 20,
    height: 52,
    borderRadius: 16,
    zIndex: 10,
  },

  pillGradient: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 8,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },

  focusText: {
    fontSize: 13,
    color: "#FFD479",
  },
});
