import { useGetGoalShowingQuery } from "@/src/redux/api/Page/Goals/goalsApi";
import { RootState } from "@/src/redux/store";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const GoalsSec = () => {
  const loanRecord = useSelector((state: RootState) => state.user.loanRecord);
  const { data: getGoalShowing, isLoading: isGoalShowingLoading } =
    useGetGoalShowingQuery();
  // demo values (replace with redux later)
  const target = 10000;
  const saved = 500;
  const progress = (saved / target) * 100;

  console.log("Goals Data:", getGoalShowing?.data?.goals?.icon);
  return (
    <ScrollView className="flex-1 pt-4">
      {/* ===== TOP SUMMARY ===== */}
      <View className="flex-row justify-between mb-5">
        <View className="bg-[#242333] w-[48%] rounded-2xl p-4">
          <Text className="text-gray-400 text-xs font-Inter mb-1">
            Total left
          </Text>
          <Text className="text-white text-lg font-Inter font-semibold">
            {getGoalShowing?.data?.totalLeft}
          </Text>
        </View>

        <View className="bg-[#242333] w-[48%] rounded-2xl p-4">
          <Text className="text-gray-400 text-xs font-Inter mb-1">
            Fulfilled Goals
          </Text>
          <Text className="text-white text-lg font-Inter font-semibold">
            {getGoalShowing?.data?.fullfilledGoals}
          </Text>
        </View>
      </View>

      {/* ===== GOAL CARD ===== */}
      <View>
        {getGoalShowing?.data?.goals &&
          getGoalShowing?.data?.goals.map((goal, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push("/goalsedit")}
              className="bg-[#242333] rounded-2xl p-4 mb-6"
            >
              {/* Header */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="bg-white w-9 h-9 rounded-full items-center justify-center">
                    <FontAwesome5 name={goal?.icon} size={18} color="#000" />
                  </View>
                  <View>
                    <Text className="text-white text-base font-Inter">
                      {goal?.name}
                    </Text>
                    <Text className="text-gray-400 text-xs font-Inter">
                      {goal?.notes?.split(" ").slice(0, 8).join(" ")}
                      {goal?.notes?.split(" ").length > 8 && "..."}
                    </Text>
                  </View>
                </View>

                <Text className="text-white text-lg font-Inter font-semibold">
                  $10,000.00
                </Text>
              </View>

              {/* Progress Values */}
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-400 text-xs font-Inter">
                  ${goal?.accumulatedAmount.toFixed(2)}
                </Text>
                <Text className="text-gray-400 text-xs font-Inter">
                  {goal?.progressPercentage.toFixed(1)}%
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-[#2B2A3A] rounded-full overflow-hidden mb-2">
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  style={{
                    height: "100%",
                    width: `${goal?.progressPercentage}%`,
                  }}
                />
              </View>

              {/* Left Amount */}
              <View className="flex-row justify-end">
                <Text className="text-gray-400 text-xs font-Inter">
                  Left:{" "}
                  <Text className="text-white font-Inter">
                    {goal?.amountLeft}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
      <View className="h-96 w-full" />
    </ScrollView>
  );
};

export default GoalsSec;
