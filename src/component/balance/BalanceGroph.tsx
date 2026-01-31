import responsive from "@/src/utils/responsive";
import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

/* =====================
   CONFIG
===================== */
const STROKE_WIDTH = responsive.scale(42);
const LABEL_SPACE = responsive.scale(100);
const DEFAULT_ANIMATION_DURATION = 1200;

/* =====================
   TYPES
===================== */
interface BalanceGraphProps {
  balance?: number;
  progressValue?: number;
  showLabels?: boolean;
  animationDuration?: number;
  size?: number;
}

/* =====================
   ANIMATED SVG
===================== */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/* =====================
   COMPONENT
===================== */
const BalanceGraph: React.FC<BalanceGraphProps> = ({
  balance = 5000,
  progressValue = 100,
  showLabels = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  size = responsive.scale(240),
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  const [currency, setCurrency] = useState("USD");
  const [showCurrency, setShowCurrency] = useState(false);
  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD"];

  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;

  const svgWidth = size + LABEL_SPACE;
  const svgHeight = size;

  const centerX = size / 2;
  const centerY = size / 2;

  /* =====================
     ANIMATION
  ===================== */
  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: progressValue,
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progressValue, animationDuration]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const formattedBalance = balance.toFixed(2);

  return (
    <View style={styles.container}>
      {/* ================= SVG ================= */}
      <Svg width={svgWidth} height={svgHeight}>
        <Defs>
          <LinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F6D98A" />
            <Stop offset="50%" stopColor="#D4AF37" />
            <Stop offset="100%" stopColor="#B3873A" />
          </LinearGradient>
        </Defs>

        {/* Background Ring */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#1F1E2C"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Progress Ring */}
        <AnimatedCircle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="url(#goldGradient)"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${centerX}, ${centerY}`}
          fill="none"
        />

        {/* ================= LABEL ================= */}
        {showLabels && (
          <>
            {/* Percentage */}
            <SvgText
              x={centerX + radius - 18}
              y={centerY}
              fill="#fff"
              fontSize={13}
              fontWeight="600"
              alignmentBaseline="middle"
            >
              {progressValue}%
            </SvgText>

            {/* Line */}
            <Line
              x1={centerX + radius + STROKE_WIDTH / 2}
              y1={centerY}
              x2={centerX + radius + STROKE_WIDTH / 2 + 40}
              y2={centerY}
              stroke="#D4AF6A"
              strokeWidth={2}
            />

            {/* Label */}
            <SvgText
              x={centerX + radius + STROKE_WIDTH / 2 + 48}
              y={centerY}
              fill="#CFCFD6"
              fontSize={13}
              alignmentBaseline="middle"
            >
              Salary
            </SvgText>
          </>
        )}
      </Svg>

      {/* ================= CENTER CONTENT ================= */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            alignItems: "center",
            justifyContent: "center",
            transform: [{ translateX: -LABEL_SPACE / 2 }],
          },
        ]}
      >
        {/* Text (non-interactive) */}
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.amount}>+${formattedBalance}</Text>

        {/* Currency Selector (interactive) */}
        <View style={styles.currencyWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowCurrency((p) => !p)}
          >
            <View style={styles.currencyButton}>
              <Text style={styles.currencyText}>{currency}</Text>
              <Entypo name="chevron-down" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          {showCurrency && (
            <View style={styles.currencyDropdown}>
              {currencyOptions.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    setCurrency(c);
                    setShowCurrency(false);
                  }}
                  style={styles.currencyItem}
                >
                  <Text
                    style={[
                      styles.currencyItemText,
                      currency === c && styles.currencyActive,
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default BalanceGraph;

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  balanceLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "600",
  },

  /* Currency */
  currencyWrapper: {
    marginTop: 8,
  },
  currencyButton: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  currencyText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginRight: 6,
  },
  currencyDropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    backgroundColor: "#584C2F",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4F4F59",
    overflow: "hidden",
    zIndex: 50,
  },
  currencyItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  currencyItemText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  currencyActive: {
    color: "#FAD885",
    fontWeight: "600",
  },
});
