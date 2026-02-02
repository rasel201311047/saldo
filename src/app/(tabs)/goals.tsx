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
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Goals = () => {
  const [active, setActive] = useState("GOALS");
  const dispatch = useAppDispatch();

  const LoanRecord = useSelector((state: RootState) => state.user.loanRecord);
  console.log("hi", LoanRecord);
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
                    className={`font-Inter font-semibold text-base text-[#fff]`}
                  >
                    {item}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
        {active === "GOALS" && (
          <View className="flex-1 px-[5%]">
            {LoanRecord ? (
              <View className="flex-1">
                <GoalsSec />
              </View>
            ) : (
              <View>
                <Text className="font-Inter text-white mt-3 ">
                  Money you’re saving for something you want
                </Text>
                <Image
                  source={HomeImg.goalHome}
                  className=" mx-auto w-[80%] my-3"
                  resizeMode="contain"
                />
                <Text className="text-center text-[#a1a1a3] text-xs">
                  No saved Account
                </Text>
                <TouchableOpacity>
                  <Text className="font-Inter text-xl text-center text-white mt-[3%] font-bold">
                    Tap to create
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {active === "BORROWED" && (
          <View className="flex-1 px-[5%]">
            <Text className="font-Inter text-white mt-3 ">
              Money you borrowed and still need to pay back.
            </Text>
            <Image
              source={HomeImg.goalHome}
              className=" mx-auto w-[80%] my-3"
              resizeMode="contain"
            />
            <Text className="text-center text-[#a1a1a3] text-xs">
              No saved Account
            </Text>
            <TouchableOpacity>
              <Text className="font-Inter text-xl text-center text-white mt-[3%] font-bold">
                Tap to create
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {active === "LENT" && (
          <View className="flex-1 px-[5%]">
            <Text className="font-Inter text-white mt-3 ">
              Money others owe you.
            </Text>
            <Image
              source={HomeImg.goalHome}
              className=" mx-auto w-[80%] my-3"
              resizeMode="contain"
            />
            <Text className="text-center text-[#a1a1a3] text-xs">
              No saved Account
            </Text>
            <TouchableOpacity>
              <Text className="font-Inter text-xl text-center text-white mt-[3%] font-bold">
                Tap to create
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push("/createforn")}
          className=" absolute bottom-28 right-3"
        >
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            style={{ borderRadius: 10, padding: 8 }}
            className=" "
          >
            <Entypo name="plus" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </Background1>
  );
};

export default Goals;
