import {
  about,
  calender,
  lock,
  logout,
  privacy,
  report,
  term,
  user,
} from "@/assets/icons";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import LogoutModal from "./LogoutModal";

const Genaral = () => {
  const [logoutModal, setLogoutModal] = useState(false);
  return (
    <ScrollView className="flex-1 ">
      {/* Profile Section */}
      <View className="  mx-auto my-3 ">
        <View className="flex-row items-center">
          <View className="w-24 h-24 rounded-full justify-center items-center ">
            <Image
              source={{ uri: "https://i.ibb.co/27NB7NcJ/user-12.png" }}
              className="w-full h-full rounded-full"
            />
          </View>
        </View>
        <Text className="text-xl mt-2 text-[#FFFFFF] font-JosefinSansSemiBold">
          Rasel Islam
        </Text>
      </View>

      <View className="space-y-3">
        {[
          {
            title: "Profile Setting",
            icon: user,
            route: "/profilesetting",
          },
          {
            title: "Weekly & Monthly Reports",
            icon: report,
            route: "/weeklyreport",
          },
          {
            title: "Set month start date",
            icon: calender,
            route: "/startmonth",
          },
          { title: "Change password", icon: lock, route: "/changepassword" },
          { title: "About Us", icon: about, route: "/about" },
          { title: "Privacy Policy", icon: privacy, route: "/policy" },
          { title: "Terms and Conditions", icon: term, route: "/terms" },
        ].map((item, i) => (
          <TouchableOpacity
            onPress={() => item.route && router.push(item.route)}
            key={i}
            className="bg-[#242333]  p-4 rounded-2xl  flex-row justify-between items-center mb-[2%]"
          >
            <View className="flex-row items-center">
              <View className="w-[20] h-[20] rounded-full justify-center items-center">
                <SvgXml
                  xml={item.icon}
                  width={20}
                  height={20}
                  color={"#121030"}
                />
              </View>
              <Text className="ml-3 text-[#FFFFFF] font-JosefinSansSemiBold  text-base">
                {item.title}
              </Text>
            </View>

            <Entypo name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        ))}
      </View>
      {/* Log Out */}
      <TouchableOpacity
        onPress={() => setLogoutModal(true)}
        className="bg-[#242333] mt-[4%] p-4 rounded-2xl flex-row items-center"
      >
        <View className="w-[20] h-[20] rounded-full justify-center items-center">
          <SvgXml xml={logout} width={20} height={20} color={"#E34949"} />
        </View>
        <Text className="ml-3 text-[#E34949] font-JosefinSansSemiBold  text-base">
          Log Out
        </Text>
      </TouchableOpacity>

      {/* =====================
      logout
      ==============================*/}
      <LogoutModal
        visible={logoutModal}
        onClose={() => setLogoutModal(false)}
      />
    </ScrollView>
  );
};

export default Genaral;
