import { HomeImg } from "@/assets/home/homeimg";
import Background1 from "@/src/component/background/Background1";
import NavBalance from "@/src/component/balance/NavBalance";
import WithDataBH from "@/src/component/balance/WithDataBH";
import { useGetBalanceAccountQuery } from "@/src/redux/api/Page/Balance/balanceApi";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Balance = () => {
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useGetBalanceAccountQuery();

  console.log("Balance Data:", balanceData?.data);
  if (isBalanceLoading) {
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
  const renderEmptyState = () => (
    <View className="flex-1 justify-between ">
      {/* Image and content */}
      <View className="items-center flex-1 justify-center mt-20">
        <Image
          source={HomeImg.balanceHome}
          className="w-[80%] max-w-[300px] h-[200px]"
          resizeMode="contain"
        />

        <View className="items-center mt-4">
          <View className="bg-white/10 px-6 py-3 rounded-full">
            <Text className="text-[#a1a1a3] text-sm font-Inter">
              No saved account
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/accountbalanceadd")}
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
        <NavBalance />
        <ScrollView className="flex-1">
          {/* Content sections */}
          <View className="flex-1 px-[5%]">
            <View className="flex-1">
              {balanceData?.data?.totalBalance ? (
                <WithDataBH />
              ) : (
                renderEmptyState()
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background1>
  );
};

export default Balance;
