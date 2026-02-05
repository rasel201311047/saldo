import { budgeticon, menu } from "@/assets/icons";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import BalanceGroph from "./BalanceGroph";
import RenameAccount from "./RenameAccount";

const WithDataBH = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [renameModal, setRenameModal] = useState(false);

  console.log(menuOpen);

  const chartData = {
    balance: 5000,
    total: 5250,
    used: 0,
    limit: 250,
    percentage: 100,
    salary: 5000,
  };

  return (
    <View
      style={{ flex: 1 }}
      className={` ${showChart ? "pt-[8%]" : "pt-[4%]"} `}
    >
      {/* ===== Balance Chart ===== */}
      {showChart && <BalanceGroph />}

      {/* ===== Header ===== */}
      <View
        className={`flex-row items-center justify-between px-5 ${showChart ? "mt-[5%]" : ""} mb-4`}
      >
        <View className="">
          <View className="flex-row items-center gap-[6%]">
            <SvgXml xml={menu} width={20} height={20} color={"#fff"} />
            <Text className="text-white font-Inter text-base">My Accounts</Text>
          </View>

          <View className="flex-row items-center gap-[3%]">
            <View className="w-5 h-5" />
            <Text className="text-sm text-[#FFFFFF] font-Inter">
              +${chartData.balance.toLocaleString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className=" relative"
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Entypo name="dots-three-vertical" size={18} color="#fff" />
          <View
            className={`${menuOpen ? "flex-col" : "hidden"} bg-[#1F1E2C] absolute z-50 top-[100%] right-0 border border-[#3A3950] rounded-xl w-48 overflow-hidden`}
          >
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-3"
              onPress={() => setShowChart((v) => !v)}
            >
              <Text className="text-white">Show in chart</Text>
              <View
                className={`w-10 h-5 rounded-full ${
                  showChart ? "bg-[#D4AF6A]" : "bg-[#3A3950]"
                }`}
              >
                <View
                  className={`w-4 h-4 bg-white rounded-full mt-0.5 ${
                    showChart ? "ml-5" : "ml-1"
                  }`}
                />
              </View>
            </TouchableOpacity>

            <View className="h-[1px] bg-[#3A3950]" />

            <TouchableOpacity
              onPress={() => setRenameModal(true)}
              className="px-4 py-3"
            >
              <Text className="text-white font-Inter">Rename</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      {/* ===== Account Card ===== */}
      <View className="px-4 -z-50">
        <View className="bg-[#242333] border border-[#4F4F59] rounded-2xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <SvgXml xml={budgeticon} width={24} height={24} color={"#fff"} />
              <Text className="text-white font-Inter text-base">Salary</Text>
            </View>
            <Text className="text-white text-lg font-Inter font-semibold">
              $
              {chartData.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400 text-xs">
              <Text className="text-white font-Inter text-base">
                $
                {chartData.limit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>{" "}
              <Text className="font-Inter">limit</Text>
            </Text>
            <Text className="text-gray-400 text-xs font-Inter">
              used{" "}
              <Text className="text-white font-Inter text-base">
                $
                {chartData.used.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Text>
          </View>

          {/* <View className="h-2 bg-[#2B2A3A] rounded-full overflow-hidden">
            <View
              className="h-2 bg-[#D4AF6A]"
              style={{ width: `${(chartData.used / chartData.limit) * 100}%` }}
            />
          </View> */}
          <LinearGradient
            colors={["#FAD885", "#C49F59", "#8A622A"]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              height: 8,
            }}
          ></LinearGradient>
        </View>
      </View>
      <RenameAccount
        openRemane={renameModal}
        setOpenRename={() => setRenameModal(false)}
      />
    </View>
  );
};

export default WithDataBH;
