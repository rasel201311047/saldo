import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import { useGetBalanceAccountQuery } from "@/src/redux/api/Page/Balance/balanceApi";
import responsive from "@/src/utils/responsive";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
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
interface Account {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

interface BalanceGraphProps {
  showLabels?: boolean;
  animationDuration?: number;
  size?: number;
}

// =====================
//   Carency Symbols
// =====================

const getCurrencySymbol = (code?: string) => {
  if (!code) return "";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    BDT: "৳",
    INR: "₹",
    AED: "د.إ",

    RON: "L",
    HUF: "Ft",
    BGN: "лв",
    RSD: "дин",
    UAH: "₴",
    MDL: "L",

    CHF: "CHF",
    PLN: "zł",
    CZK: "Kč",
  };

  return currencySymbols[code] || code;
};
/* =====================
   ANIMATED SVG
===================== */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/* =====================
   COMPONENT
===================== */
const BalanceGraph: React.FC<BalanceGraphProps> = ({
  showLabels = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  size = responsive.scale(240),
}) => {
  const {
    data: balanceData,
    isLoading,
    isError,
    refetch,
  } = useGetBalanceAccountQuery();
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();

  const progress = useRef(new Animated.Value(0)).current;

  // Calculate derived values from API data
  const totalBalance = balanceData?.data?.totalBalance || 0;
  const accounts = balanceData?.data?.accounts || [];
  const formattedBalance = totalBalance.toFixed(2);

  const progressValue = 100;

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
    if (!isLoading && totalBalance > 0) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: progressValue,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [progressValue, animationDuration, isLoading]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  /* =====================
     LOADING / ERROR STATES
  ===================== */
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.loadingContainer, { width: size, height: size }]}>
          <Text style={styles.loadingText}>Loading balance...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={[styles.errorContainer, { width: size, height: size }]}>
          <Text style={styles.errorText}>Failed to load balance</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

        {/* ================= LABELS ================= */}
        {showLabels &&
          accounts.slice(0, 2).map((account: Account, index: number) => (
            <React.Fragment key={account.id}>
              {/* Percentage */}
              <SvgText
                x={centerX + radius - 18}
                y={centerY + index * 20}
                fill="#fff"
                fontSize={12}
                fontWeight="600"
                alignmentBaseline="middle"
              >
                {((account.amount / totalBalance) * 100).toFixed(0)}%
              </SvgText>

              {/* Line */}
              <Line
                x1={centerX + radius + STROKE_WIDTH / 2}
                y1={centerY + index * 20}
                x2={centerX + radius + STROKE_WIDTH / 2 + 40}
                y2={centerY + index * 20}
                stroke="#D4AF6A"
                strokeWidth={2}
              />

              {/* Account Label */}
              <SvgText
                x={centerX + radius + STROKE_WIDTH / 2 + 48}
                y={centerY + index * 20}
                fill="#CFCFD6"
                fontSize={10}
                alignmentBaseline="middle"
              >
                {account.name.replace(" Account", "")}
              </SvgText>
            </React.Fragment>
          ))}
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
        pointerEvents="box-none"
      >
        {/* Text (non-interactive) */}
        <Text className="font-Inter text-[#9CA3AF] text-xs">Total Balance</Text>
        <Text className="font-Inter font-bold text-2xl text-[#FFFFFF]">
          {getCurrencySymbol(getProfileData?.data?.currency)} {formattedBalance}
        </Text>
        <Text className="font-Inter text-[#6B7280] text-sm">
          {accounts.length} {accounts.length === 1 ? "Account" : "Accounts"}
        </Text>
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
    position: "relative",
  },
  balanceLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  accountCount: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 8,
  },

  /* Currency */
  currencyWrapper: {
    marginTop: 8,
    position: "relative",
  },
  currencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  currencyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  currencyChevron: {
    color: "#D4AF37",
    fontSize: 10,
  },
  currencyDropdown: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "#2A2A36",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#40404C",
    overflow: "hidden",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  currencyItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencyItemText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  currencyActive: {
    color: "#D4AF37",
    fontWeight: "600",
  },

  /* Loading / Error States */
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  retryText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "500",
  },
});
