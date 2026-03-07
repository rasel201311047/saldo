import { HomeImg } from "@/assets/home/homeimg";
import Background1 from "@/src/component/background/Background1";
import BorrowedSec from "@/src/component/goals/BorrowedSec";
import GoalsSec from "@/src/component/goals/GoalsSec";
import LentSec from "@/src/component/goals/LentSec";
import NavGoals from "@/src/component/goals/NavGoals";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import {
  useGetBorrowedShowingQuery,
  useGetGoalShowingQuery,
  useGetLentShowingQuery,
} from "@/src/redux/api/Page/Goals/goalsApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setButtonCatagory } from "@/src/redux/slices/userSlice";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const Goals = () => {
  const [active, setActive] = useState("GOALS");
  const dispatch = useAppDispatch();
  const { data: getGoalShowing, isLoading: isGoalShowingLoading } =
    useGetGoalShowingQuery();

  const { data: getBorrowedShowing, isLoading: isBorrowedShowingLoading } =
    useGetBorrowedShowingQuery();
  const { data: getLentShowing, isLoading: isLentShowingLoading } =
    useGetLentShowingQuery();

  // console.log("Goals Data:", getGoalShowing?.data?.goals);
  // console.log("Borrowed Data:", getBorrowedShowing?.data?.borrowed);
  // console.log("Lent Data:", getLentShowing?.data?.lent);

  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  console.log("Profile Data in Goals:", getProfileData?.data?.premiumPlan);
  if (profileLoading) {
    return (
      <Background1>
        <SafeAreaView
          edges={["top"]}
          className="flex-1 justify-center items-center"
        >
          <ActivityIndicator size="large" color="#ECCD72" />
        </SafeAreaView>
      </Background1>
    );
  }

  useEffect(() => {
    const premiumPlan = getProfileData?.data?.premiumPlan;
    // "TRIAL_EXPIRED" ||
    if (premiumPlan === "TRIAL_EXPIRED" || !premiumPlan) {
      router.replace("/subcription");
    }
  }, [getProfileData]);

  if (
    isGoalShowingLoading ||
    isBorrowedShowingLoading ||
    isLentShowingLoading
  ) {
    return (
      <Background1>
        <SafeAreaView
          edges={["top"]}
          className="flex-1 justify-center items-center"
        >
          <ActivityIndicator size="large" color="#D4AF66" />
        </SafeAreaView>
      </Background1>
    );
  }
  const renderEmptyState = (helperText: string) => (
    <View className="flex-1 justify-between">
      {/* Helper text with better styling */}
      <View className="mt-6 px-4 py-3 bg-white/10 rounded-2xl border border-white/20">
        <Text className="font-Inter text-white/90 text-base leading-6 text-center">
          {helperText}
        </Text>
      </View>

      {/* Image and content */}
      <View className="items-center flex-1 justify-center -mt-20">
        <Image
          source={HomeImg.goalHome}
          className="w-[80%] max-w-[300px] h-[200px]"
          resizeMode="contain"
        />

        <View className="items-center mt-4">
          <View className="bg-white/10 px-6 py-3 rounded-full">
            <Text className="text-[#a1a1a3] text-sm font-Inter">
              No saved accounts yet
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                params: { category: active },
                pathname: "/createforn",
              })
            }
            activeOpacity={0.7}
            className="mt-6"
          >
            <LinearGradient
              colors={["#FAD885", "#C49F59", "#8A622A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 50 }}
              className="px-8 py-4 rounded-2xl"
            >
              <Text className="font-Inter text-xl text-white font-bold">
                Tap to create
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spacer for bottom padding */}
      <View className="h-10" />
    </View>
  );

  return (
    <Background1>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* navigation bar */}
        <NavGoals />

        {/* button */}
        <View className="px-[5%] flex-row items-center my-2 gap-[4%]">
          {["GOALS", "BORROWED", "LENT"].map((item, index) => {
            const isActive = active === item;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setActive(item);
                  dispatch(setButtonCatagory(item));
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isActive
                      ? ["#FAD885", "#C49F59", "#8A622A"]
                      : ["#ffffff00", "#ffffff00", "#ffffff00"]
                  }
                  style={{ borderRadius: 50 }}
                  className="p-1 px-[4%] items-center"
                >
                  <Text
                    className={`font-Inter font-semibold text-base ${
                      isActive ? "text-white" : "text-white/60"
                    }`}
                  >
                    {item}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content sections */}
        <View className="flex-1 px-[5%]">
          {active === "GOALS" && (
            <View className="flex-1">
              {getGoalShowing?.data?.goals ? (
                <GoalsSec />
              ) : (
                renderEmptyState("Money you're saving for something you want")
              )}
            </View>
          )}

          {active === "BORROWED" && (
            <View className="flex-1">
              {getGoalShowing?.data?.goals ? (
                <BorrowedSec />
              ) : (
                renderEmptyState(
                  "Money you borrowed and still need to pay back",
                )
              )}
            </View>
          )}

          {active === "LENT" && (
            <View className="flex-1">
              {getGoalShowing?.data?.goals ? (
                <LentSec />
              ) : (
                renderEmptyState("Money others owe you")
              )}
            </View>
          )}
        </View>

        {/* Floating action button */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              params: { category: active },
              pathname: "/createforn",
            })
          }
          className="absolute bottom-28 right-3"
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            style={{
              borderRadius: 16,
              padding: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Entypo name="plus" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </Background1>
  );
};

export default Goals;
