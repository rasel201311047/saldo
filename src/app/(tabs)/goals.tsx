import { HomeImg } from "@/assets/home/homeimg";
import Background1 from "@/src/component/background/Background1";
import GoalsSec from "@/src/component/goals/GoalsSec";
import NavGoals from "@/src/component/goals/NavGoals";
import { useAppDispatch } from "@/src/redux/hooks";
import { setButtonCatagory } from "@/src/redux/slices/userSlice";
import { RootState } from "@/src/redux/store";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const { height } = Dimensions.get("window");

const Goals = () => {
  const [active, setActive] = useState("GOALS");
  const dispatch = useAppDispatch();

  const LoanRecord = useSelector((state: RootState) => state.user.loanRecord);

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
            onPress={() => router.push("/createforn")}
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
              {LoanRecord ? (
                <GoalsSec />
              ) : (
                renderEmptyState("Money you're saving for something you want")
              )}
            </View>
          )}

          {active === "BORROWED" &&
            renderEmptyState("Money you borrowed and still need to pay back")}

          {active === "LENT" && renderEmptyState("Money others owe you")}
        </View>

        {/* Floating action button */}
        <TouchableOpacity
          onPress={() => router.push("/createforn")}
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
