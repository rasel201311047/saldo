import GradientBackground from "@/src/component/background/GradientBackground";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const FalsePage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Parallel animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),

      // Scale up
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),

      // Icon rotation
      Animated.timing(iconRotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),

      // Progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1900,
        useNativeDriver: false,
        easing: Easing.linear,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // Exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => {
        router.replace("/calendar");
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated Icon Container */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ rotate: iconRotation }],
                shadowColor: "#F5C56B",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 10,
              },
            ]}
          >
            <View style={styles.iconInner}>
              <Animated.View
                style={[
                  styles.iconGlow,
                  {
                    opacity: iconRotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0],
                    }),
                  },
                ]}
              />
              <FontAwesome5
                name="university"
                size={40}
                color="#F5C56B"
                style={styles.icon}
              />
            </View>
          </Animated.View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>No bank connection required.</Text>
            <Text style={styles.subtitle}>
              {` You're in full control now.`}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeCircles}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "rgba(245, 197, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "rgba(245, 197, 107, 0.3)",
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(245, 197, 107, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 197, 107, 0.4)",
  },
  iconGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#F5C56B",
  },
  icon: {
    shadowColor: "#F5C56B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#F5C56B",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#F5C56B",
    borderRadius: 2,
  },
  decorativeCircles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  circle: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(245, 197, 107, 0.05)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -30,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: "50%",
    left: "70%",
  },
});

export default FalsePage;

//
