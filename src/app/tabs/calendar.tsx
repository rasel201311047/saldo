import { earningicon, spendingicon } from "@/assets/icons";
import Background1 from "@/src/component/background/Background1";
import ButtonSection from "@/src/component/home/ButtonSection";
import CalendershowData from "@/src/component/home/CalendershowData";
import Nav from "@/src/component/home/Nav";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
const calendar = () => {
  return (
    <Background1>
      <Nav />
      <ButtonSection />

      <ScrollView className="flex-1">
        <CalendershowData />
        <View className="px-[5%]">
          <LinearGradient
            colors={["#b08b4a6c", "#2626a18a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={{
              padding: 16,
              borderRadius: 18,
            }}
          >
            <View className="flex-row items-center justify-between">
              <TouchableOpacity>
                <Entypo name="chevron-left" size={24} color="#fff" />
              </TouchableOpacity>
              <View>
                <SvgXml xml={earningicon} width={30} height={30} />
              </View>
              <View>
                <Text className="text-[#fff] text-lg font-Inter">Earnings</Text>
                <Text className="text-[#fff] text-lg font-Inter font-medium">
                  $0.00
                </Text>
              </View>

              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{ borderRadius: 50 }}
                className=" py-2 px-3 rounded-lg"
              >
                <Text className="text-center font-Inter font-medium text-[#fff]">
                  Jan
                </Text>
              </LinearGradient>
              <View>
                <SvgXml xml={spendingicon} width={30} height={30} />
              </View>
              <View>
                <Text className="text-[#fff] text-lg font-Inter">
                  Spendings
                </Text>
                <Text className="text-[#fff] text-lg font-Inter font-medium">
                  $0.00
                </Text>
              </View>

              <TouchableOpacity className=" rotate-180">
                <Entypo name="chevron-left" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </Background1>
  );
};

export default calendar;
