import { OnbordingImg } from "@/assets/onbording/onbording";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, StatusBar, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import Swiper from "react-native-swiper";
import GradientBackground from "../component/background/GradientBackground";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/* ---------------------- PROGRESS BUTTON COMPONENT ------------------------ */

const ProgressButton = ({ progress = 0, onPress }) => {
  const size = 70;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - circumference * animatedProgress.value,
  }));

  return (
    <View className="items-center justify-center">
      {/* Animated Circular Progress */}
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {/* SVG Gradient */}
        <Defs>
          <SvgLinearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor="#FAD885" />
            <Stop offset="50%" stopColor="#C49F59" />
            <Stop offset="100%" stopColor="#8A622A" />
          </SvgLinearGradient>
        </Defs>

        {/* Background Ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#fff"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
          strokeLinecap="round"
        />

        {/* Animated Gradient Ring */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="none"
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      {/* Gradient Center Button */}
      <LinearGradient
        colors={["#FAD885", "#C49F59", "#8A622A"]}
        style={{
          width: 64,
          height: 64,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
        }}
      >
        <Ionicons
          name="arrow-forward"
          size={26}
          color="white"
          onPress={onPress}
        />
      </LinearGradient>
    </View>
  );
};

/* ----------------------------- MAIN SCREEN ------------------------------- */

const Index = () => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const splashContent = [
    {
      image: OnbordingImg.im1,
      headerText: "Track Your Spending",
      paragraphText:
        "Monitor your income and expenses in real-time with intuitive tracking tools",
    },
    {
      image: OnbordingImg.im2,
      headerText: "Visualize Your Money",
      paragraphText:
        "Get clear insights with beautiful charts and reports to understand your financial habits",
    },
    {
      image: OnbordingImg.im3,
      headerText: "Stay in Control",
      paragraphText:
        "Set budgets and receive alerts when you're close to your spending limits",
    },
  ];

  const isLast = currentIndex === splashContent.length - 1;

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="light-content" />

        <View className="flex-1">
          {/* Swiper */}
          <View className="h-[70%]">
            <Swiper
              ref={swiperRef}
              loop={false}
              showsPagination={false}
              onIndexChanged={setCurrentIndex}
            >
              {splashContent.map((item, index) => (
                <View
                  key={index}
                  className="flex-1 items-center justify-center"
                >
                  <View className="w-full h-[80%]">
                    <Image
                      source={item.image}
                      resizeMode="contain"
                      className="w-full h-full"
                    />
                  </View>
                </View>
              ))}
            </Swiper>
          </View>

          {/* Text */}
          <View className="h-[30%]">
            <View className="px-8 w-full items-center">
              <Text className="text-2xl text-[#fff] font-Inter font-bold text-center mb-[3%]">
                {splashContent[currentIndex].headerText}
              </Text>

              <Text className="text-base text-gray-200  text-center font-Inter leading-6">
                {splashContent[currentIndex].paragraphText}
              </Text>
            </View>

            {/* Progress Button */}
            <View className="absolute bottom-10 w-full items-center">
              <ProgressButton
                progress={(currentIndex + 1) / splashContent.length}
                onPress={() => {
                  if (isLast) router.replace("/signin");
                  else swiperRef.current?.scrollBy(1);
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Index;
