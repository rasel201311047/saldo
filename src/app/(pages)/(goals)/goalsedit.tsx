import { BudgetImg } from "@/assets/budget/budgetimg";
import GradientBackground from "@/src/component/background/GradientBackground";
import CustomAlert from "@/src/component/customAlart/CustomAlert";
import CompleteModal from "@/src/component/goals/CompleteModal";
import DeleteModal from "@/src/component/home/DeleteModal";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import {
  useAddBorrowedProgressMutation,
  useAddGoalProgressMutation,
  useGetSingleBorrowedDetailsQuery,
  useGetSingleGoalDetailsQuery,
  useGetSingleLentDetailsQuery,
} from "@/src/redux/api/Page/Goals/goalsApi";
import { FontAwesome5 } from "@expo/vector-icons";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getCurrencySymbol = (code?: string) => {
  if (!code) return "";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    BDT: "৳",
    INR: "₹",
    AED: "د.إ",

    RON: "L",
    HUF: "Ft",
    BGN: "лв",
    RSD: "дин",
    UAH: "₴",
    MDL: "L",

    CHF: "CHF",
    PLN: "zł",
    CZK: "Kč",
  };

  return currencySymbols[code] || code;
};
const Goalsedit = () => {
  const params = useLocalSearchParams();
  const { id, type } = params;
  const [amount, setAmount] = useState<number | null>(null);
  const [opendelete, setOpenDelete] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const { data: goalData, isLoading: goalLoading } =
    useGetSingleGoalDetailsQuery(type === "goal" ? id : skipToken);
  const { data: borrowedData, isLoading: borrowedLoading } =
    useGetSingleBorrowedDetailsQuery(type === "borrowed" ? id : skipToken);
  const { data: lentData, isLoading: lentLoading } =
    useGetSingleLentDetailsQuery(type === "lent" ? id : skipToken);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [addprogressdata, { isLoading: addProgressLoading }] =
    useAddGoalProgressMutation();

  const [addBorrowedprogressdata, { isLoading: addBorrowedProgressLoading }] =
    useAddBorrowedProgressMutation();

  // Determine which data is active and loading
  let activeData, isLoading;
  if (type === "goal") {
    activeData = goalData?.data;
    isLoading = goalLoading;
  } else if (type === "borrowed") {
    activeData = borrowedData?.data;
    isLoading = borrowedLoading;
  } else if (type === "lent") {
    activeData = lentData?.data;
    isLoading = lentLoading;
  }

  // Map fields to the UI – keep the design identical
  const title = activeData?.name || "Untitled";
  const description = activeData?.notes || "No description provided";
  const accumulatedAmount = activeData?.accumulatedAmount || 0;
  const totalAmount = activeData?.targetAmount || activeData?.total || 0;
  const date = activeData?.date || activeData?.lentDate || null;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No date";

  // date formate
  const AnyformattedDate = (date?: string) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "No date";
  };

  // Category / lender handling
  let categoryName = "";
  let iconColor = "#36c461"; // default green
  let iconImage = null;

  if (type === "goal") {
    categoryName = activeData?.category || "Other";
    iconColor = activeData?.color || "#36c461";
    iconImage = BudgetImg[categoryName] || BudgetImg.Other;
  } else {
    categoryName = activeData?.lender || "You";

    iconImage = BudgetImg.User;
  }

  // the progress
  const handleTheAmount = async () => {
    if (!amount) {
      setAlertVisible(true);
      setAlertTittle("Error");
      setAlertMessage("Amount is required");
      setAlertType("error");
      return;
    }

    try {
      let response;
      if (type === "goal") {
        response = await addprogressdata({
          id: id,
          data: { amount },
        }).unwrap();
      }
      if (type === "borrowed") {
        response = await addBorrowedprogressdata({
          id: id,
          data: { amount },
        }).unwrap();
      }

      if (response.success) {
        setAlertVisible(true);
        setAlertTittle("Success");
        setAlertMessage(response.message);
        setAlertType("success");
      } else {
        setAlertVisible(true);
        setAlertTittle("Error");
        setAlertMessage(response.message);
        setAlertType("error");
      }
    } catch (error: any) {
      console.log("Error:", error);
      // setAlertMessage(error?.data?.message);
      setAlertVisible(true);
      setAlertTittle("Error");
      setAlertMessage(error?.data?.message);
      setAlertType("error");
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#D4AF66" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center gap-4 px-[5%] mt-2">
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

          <TouchableOpacity
            onPress={() =>
              router.push({
                params: { id: id, category: type },
                pathname: "/editgoalform",
              })
            }
          >
            <LinearGradient
              colors={["#b08b4a6c", "#2626a18a"]}
              style={{
                height: 35,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text className="font-Inter font-semibold text-xl text-white px-5">
                Edit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="flex-1 px-[5%]">
            {/* Content */}
            <View className="flex-1 mt-6">
              {/* Category  */}
              {type === "goal" && (
                <View className="flex-row items-center self-start bg-[#2A2536] px-3 py-1.5 rounded-full gap-2">
                  {/* {iconImage && <Image source={iconImage} className="w-6 h-6" />} */}
                  <Text className="text-white text-[13px]">{categoryName}</Text>
                </View>
              )}

              {/* Title */}
              <Text className="text-white text-[22px] font-semibold mt-4">
                {title}
              </Text>
              <Text className="text-[#B0B0B0] text-[14px] mt-1">
                {description}
              </Text>

              {/* Amount cards */}
              <View className="flex-row justify-between mt-6">
                <View className="w-[48%] bg-[#262233] rounded-2xl p-4">
                  <Text className="text-[#B5B5B5] text-[13px]">
                    Accumulated amount
                  </Text>
                  <Text className="text-white text-[16px] font-semibold mt-1.5">
                    {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
                    {accumulatedAmount.toFixed(2)}
                  </Text>
                </View>

                <View className="w-[48%] bg-[#262233] rounded-2xl p-4">
                  <Text className="text-[#B5B5B5] text-[13px]">Total</Text>
                  <Text className="text-white text-[16px] font-semibold mt-1.5">
                    {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
                    {totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* add progress */}
              {type === "goal" ||
                (type === "borrowed" && (
                  <View>
                    <Text className="text-[#B5B5B5] text-sm font-semibold mt-4">
                      Add Progress
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <TextInput
                        placeholder=""
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          setAmount(Number(text));
                        }}
                        className="w-[78%] py-4 bg-transparent  border border-[#C49F59] rounded-xl px-[4%] mt-2 text-[13px] font-Inter  text-[#fff]"
                      />

                      <TouchableOpacity
                        onPress={handleTheAmount}
                        className="bg-[#584C2F] py-4 px-[5%] rounded-xl"
                      >
                        <Text className="text-white text-[13px] font-Inter">
                          {addProgressLoading || addBorrowedProgressLoading ? (
                            <View>
                              <ActivityIndicator size="small" color="#fff" />
                            </View>
                          ) : (
                            "Add"
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

              {/* Date */}
              {type === "goal" && (
                <View className="flex-row justify-between items-center my-4">
                  <Text className="text-[#B5B5B5] text-[14px] mb-2">Date</Text>
                  <View className="self-start bg-[#2A2536] px-4 py-1.5 rounded-full">
                    <Text className="text-white text-[13px]">
                      {formattedDate}
                    </Text>
                  </View>
                </View>
              )}

              {/* borrow */}
              {type === "borrowed" && (
                <View>
                  {/* date */}
                  <View className="flex-row justify-between items-center my-4">
                    <Text className="text-[#B5B5B5] text-[14px] mb-2">
                      Debt Date
                    </Text>
                    <View className="self-start bg-[#2A2536] px-4 py-1.5 rounded-full">
                      <Text className="text-white text-[13px]">
                        {AnyformattedDate(activeData?.lentDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-[#B5B5B5] text-[14px] mb-2">
                      Lender
                    </Text>

                    <Text className="text-white text-[13px]">
                      {" "}
                      {activeData?.lender}
                    </Text>
                  </View>

                  {/* date */}

                  <View className="flex-row justify-between items-center my-4">
                    <Text className="text-[#B5B5B5] text-[14px] mb-2">
                      Payoff Date
                    </Text>
                    <View className="self-start bg-[#2A2536] px-4 py-1.5 rounded-full">
                      <Text className="text-white text-[13px]">
                        {AnyformattedDate(activeData?.payoffDate)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* len */}
              {type === "lent" && (
                <View>
                  {/* date */}
                  <View className="flex-row justify-between items-center my-4">
                    <Text className="text-[#B5B5B5] text-[14px] mb-2">
                      Debt Date
                    </Text>
                    <View className="self-start bg-[#2A2536] px-4 py-1.5 rounded-full">
                      <Text className="text-white text-[13px]">
                        {AnyformattedDate(activeData?.lentDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-[#B5B5B5] text-[14px] mb-2">
                      Lender
                    </Text>

                    <Text className="text-white text-[13px]">
                      {activeData?.lender}
                    </Text>
                  </View>

                  {/* date */}

                  <View className="flex-row justify-between items-center my-4">
                    <Text className="text-[#B5B5B5] text-[14px] mb-2">
                      Payoff Date
                    </Text>
                    <View className="self-start bg-[#2A2536] px-4 py-1.5 rounded-full">
                      <Text className="text-white text-[13px]">
                        {AnyformattedDate(activeData?.payoffDate)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Mark as complete */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity onPress={() => setOpenDelete(true)}>
                  <FontAwesome5 name="trash" size={40} color="#FF3B3B" />
                </TouchableOpacity>

                {type === "goal" && (
                  <TouchableOpacity
                    onPress={() => setOpenComplete(true)}
                    className=" border border-[#E6C27A] px-3 py-1 items-center justify-center rounded-xl "
                  >
                    <Text className="text-[#fff] text-[15px]">
                      Mark as complete
                    </Text>
                  </TouchableOpacity>
                )}

                {type === "borrowed" && (
                  <TouchableOpacity
                    onPress={() => setOpenComplete(true)}
                    className=" border border-[#E6C27A] px-3 py-1 items-center justify-center rounded-xl "
                  >
                    <Text className="text-[#fff] text-[15px]">
                      Mark as repaid
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-white mt-4 text-xs font-Inter">
                {activeData?.status || ""}
              </Text>

              {/* OK Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.9}
                className="mt-[8%]"
              >
                <LinearGradient
                  colors={["#B08A4A", "#E0B66A"]}
                  style={{ borderRadius: 8 }}
                  className="  py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <DeleteModal
          theDeleteId={id}
          catagory={type}
          opendelete={opendelete}
          setOpendelete={() => setOpenDelete(false)}
        />

        <CompleteModal
          theCompleteId={id}
          catagory={type}
          openComplete={openComplete}
          setOpenComplete={() => setOpenComplete(false)}
        />

        <CustomAlert
          visible={alertVisible}
          title={alertTittle}
          message={alertMessage}
          onConfirm={() => {
            console.log("Confirmed");
            setAlertVisible(false);
          }}
          // onCancel={() => {
          //   console.log("Cancelled");
          //   setAlertVisible(false);
          // }}
          type={alertType}
          confirmText={"OK"}
          cancelText="Cancel"
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Goalsedit;
