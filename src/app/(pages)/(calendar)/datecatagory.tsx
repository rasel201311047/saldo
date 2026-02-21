import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import SetupBudget from "@/src/component/home/SetupBudget";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SEGMENT_WIDTH = SCREEN_WIDTH * 0.85;
const BUTTON_WIDTH = SEGMENT_WIDTH / 2;

type CategoryType = {
  title: string;
  image: any;
};

const SpendCategories: CategoryType[] = [
  { title: "Supermarket", image: BudgetImg.supermarket },
  { title: "Clothing", image: BudgetImg.clothing },
  { title: "House", image: BudgetImg.house },
  { title: "Entertainment", image: BudgetImg.entertainment },
  { title: "Transport", image: BudgetImg.Transport },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Travel", image: BudgetImg.Travel },
  { title: "Education", image: BudgetImg.Education },
  { title: "Food", image: BudgetImg.Food },
  { title: "Work", image: BudgetImg.Work },
  { title: "Electronics", image: BudgetImg.Electronics },
  { title: "Sport", image: BudgetImg.Sport },
  { title: "Restaurant", image: BudgetImg.Restaurant },
  { title: "Health", image: BudgetImg.Health },
  { title: "Communications", image: BudgetImg.Communications },
  { title: "Other", image: BudgetImg.Other },
];

const EarnCategories: CategoryType[] = [
  { title: "Salary", image: BudgetImg.dollar },
  { title: "Investment", image: BudgetImg.investment },
  { title: "Rewards", image: BudgetImg.rank },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Business", image: BudgetImg.business },
  { title: "Other", image: BudgetImg.Other },
];

const Datecatagory = () => {
  const [activeTab, setActiveTab] = useState<"SPENDINGS" | "EARNINGS">(
    "SPENDINGS",
  );
  const [selected, setSelected] = useState<CategoryType | null>(null);
  const [openSetup, setOpenSetup] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  /** Segment animation */
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeTab === "SPENDINGS" ? 0 : BUTTON_WIDTH,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();

    listAnim.setValue(0);
    Animated.timing(listAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const data = activeTab === "SPENDINGS" ? SpendCategories : EarnCategories;

  const handleSelect = (item: CategoryType) => {
    setSelected(item);

    if (activeTab === "SPENDINGS") {
      router.push("/addspending");
    } else {
      router.push("/addearning");
    }
  };

  const animatedStyle = {
    opacity: listAnim,
    transform: [
      {
        translateY: listAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-[3%] px-[5%] mt-3">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white font-Inter text-xl font-bold">
            Categories
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="px-[5%] my-6">
            {/* Segmented Control */}
            <View
              style={{ width: SEGMENT_WIDTH }}
              className="bg-[#242333] rounded-full mx-auto"
            >
              <Animated.View
                style={{
                  position: "absolute",
                  width: BUTTON_WIDTH,
                  height: "100%",
                  backgroundColor:
                    activeTab === "SPENDINGS" ? "#EE2626" : "#38B27A",
                  borderRadius: 999,
                  transform: [{ translateX }],
                }}
              />

              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setActiveTab("SPENDINGS")}
                  style={{ width: BUTTON_WIDTH }}
                  className="py-5 items-center"
                >
                  <Text className="text-white text-lg font-Inter">
                    SPENDINGS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab("EARNINGS")}
                  style={{ width: BUTTON_WIDTH }}
                  className="py-5 items-center"
                >
                  <Text className="text-white text-lg font-Inter">
                    EARNINGS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category List */}
            <Animated.View style={[animatedStyle, { marginTop: 24 }]}>
              {data.map((item, index) => {
                const isActive = selected?.title === item.title;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(item)}
                    className={`flex-row items-center px-4 py-3 mb-3 rounded-xl ${
                      isActive ? "bg-[#3B3B50]" : "bg-[#242333]"
                    }`}
                  >
                    <Image
                      source={item.image}
                      className="w-6 h-6 mr-3"
                      resizeMode="contain"
                    />
                    <Text className="text-white text-base flex-1 ml-3">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </View>
        </ScrollView>

        <SetupBudget
          selected={selected}
          open={openSetup}
          setOpen={setOpenSetup}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Datecatagory;
