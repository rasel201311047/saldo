import { BudgetImg } from "@/assets/budget/budgetimg";
import { budgeticon } from "@/assets/icons";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import {
  useDeleteBudgeDataMutation,
  useGetBudgeDatawithfilterQuery,
} from "@/src/redux/api/Page/calendar/calendarApi";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import CustomAlert from "../customAlart/CustomAlert";
import AddCategory from "./AddCategory";

interface BudgetModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

interface BudgetItem {
  id: string;
  category: string;
  budgetValue: number;
  amountSpent: number;
  spendingPercentage: number;
  currency: string;
}

interface BudgetData {
  status: string;
  dateRange: string;
  totalBudget: number;
  totalSpent: number;
  totalPercentage: number;
  totalCategories: number;
  budgets: BudgetItem[];
}

type Period = "WEEKLY" | "MONTHLY";

const getCategoryImage = (category: string) => {
  const categoryMap: { [key: string]: any } = {
    Food: BudgetImg.supermarket,
    Entertainment: BudgetImg.entertainment,
    Clothing: BudgetImg.clothing,
    House: BudgetImg.house,
    Supermarket: BudgetImg.supermarket,

    Transport: BudgetImg.Transport,
    Gifts: BudgetImg.Gifts,
    Travel: BudgetImg.Travel,
    Education: BudgetImg.Education,
    Work: BudgetImg.Work,
    Electronics: BudgetImg.Electronics,
    Sport: BudgetImg.Sport,
    Restaurant: BudgetImg.Restaurant,
    Health: BudgetImg.Health,
    Communications: BudgetImg.Communications,
    Other: BudgetImg.Other,
  };

  return categoryMap[category] || BudgetImg.supermarket;
};

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    Food: "#885255",
    Entertainment: "#714754",
    Clothing: "#364B82",
    House: "#8F5950",
    Supermarket: "#885255",
  };

  return colorMap[category] || "#885255";
};
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

const BudgetModal: React.FC<BudgetModalProps> = ({ open, setOpen }) => {
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const [deleteData, { isLoading: deleteDataLoading }] =
    useDeleteBudgeDataMutation();

  const [catagoryOpen, setCatagoryOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("WEEKLY");
  const [showPeriod, setShowPeriod] = useState(false);
  const [iddelete, setIdDelete] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Fetch budget data based on selected period
  const {
    data: budgetResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetBudgeDatawithfilterQuery(period);

  // Refetch when modal opens or period changes
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, period, refetch]);

  const budgetData: BudgetData | null = budgetResponse?.data || null;

  const formatDateRange = (dateRange: string) => {
    if (!dateRange) return { start: "", end: "" };
    const [start, end] = dateRange.split(" - ");
    return { start, end };
  };

  const dateRange = budgetData?.dateRange
    ? formatDateRange(budgetData.dateRange)
    : { start: "", end: "" };

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    setShowPeriod(false);
  };

  const loading = isLoading || isFetching;

  const handlethedelete = () => {
    setAlertVisible(true);
    setAlertTittle("Delete");
    setAlertMessage("Are You sure ");
    setAlertType("");
  };

  const handleDeleted = async () => {
    console.log(iddelete);

    try {
      const res = await deleteData(iddelete).unwrap();
      console.log("Delete success:", res);
      setAlertVisible(false);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View className="flex-1 relative bg-black/60 justify-center items-center">
        <Pressable
          onPress={() => setOpen(false)}
          className=" absolute inset-0"
        />
        <View className="w-[94%] max-h-[85%] rounded-3xl bg-[#1A1A24] border border-[#4F4F59] p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl font-Inter font-bold">
              Budget
            </Text>

            <View className="relative">
              <Pressable onPress={() => setShowPeriod(!showPeriod)}>
                <LinearGradient
                  colors={["#FAD885", "#C49F59", "#8A622A"]}
                  style={{ borderRadius: 8 }}
                  className="px-4 py-1.5 rounded-lg flex-row items-center"
                >
                  <Text className="text-white font-bold text-sm">
                    {period === "WEEKLY" ? "Weekly" : "Monthly"}
                  </Text>
                  <Entypo name="chevron-down" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>

              {showPeriod && (
                <View className="absolute right-0 top-9 bg-[#222232] rounded-lg border border-[#4F4F59] overflow-hidden z-50">
                  {["WEEKLY", "MONTHLY"].map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => handlePeriodChange(p as Period)}
                      className="px-4 py-2"
                    >
                      <Text
                        className={`text-sm ${
                          period === p ? "text-[#FAD885]" : "text-white"
                        }`}
                      >
                        {p === "WEEKLY" ? "Weekly" : "Monthly"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Total budget */}
          <View className="bg-[#242333] border border-[#4F4F59] rounded-2xl p-[4%] mb-[2%]">
            {loading ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="large" color="#FAD885" />
              </View>
            ) : (
              <View>
                <View className="flex-row items-center gap-[2%]">
                  <View className="">
                    <SvgXml xml={budgeticon} width={34} height={34} />
                  </View>
                  <View className=" w-[85%] ">
                    <View className="flex-row justify-between items-center ">
                      <Text className="text-gray-400 text-sm">
                        Total budget
                      </Text>
                      <Text className="text-[#FFFFFF] font-Inter text-sm">
                        {budgetData?.totalPercentage || 0}%
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center ">
                      <Text className="text-white text-lg">
                        {getCurrencySymbol(getProfileData?.data?.currency)}{" "}
                        {budgetData?.totalBudget?.toFixed(2) || "0.00"}
                      </Text>
                      <Text className="text-white text-lg">
                        {getCurrencySymbol(getProfileData?.data?.currency)}
                        {budgetData?.totalSpent?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row justify-between items-start mt-2">
                  <Text className="text-gray-500 text-xs mt-2">
                    Budget period
                  </Text>
                  <View>
                    <Text className="text-xs text-gray-500 text-right">
                      {dateRange.start || "No date range"}
                    </Text>
                    <Text className="text-xs text-gray-500 text-right">
                      {dateRange.end || ""}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Categories */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="large" color="#FAD885" />
              </View>
            ) : budgetData?.budgets && budgetData.budgets.length > 0 ? (
              budgetData.budgets.map((item) => (
                <View key={item.id}>
                  <View className="mb-3 px-[4%] rounded-2xl flex-row items-center bg-[#242333] border border-[#4F4F59] overflow-hidden">
                    {/* Progress fill */}
                    <LinearGradient
                      colors={[
                        getCategoryColor(item.category),
                        `${getCategoryColor(item.category)}CC`,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${item.spendingPercentage}%`,
                      }}
                    />

                    {/* Content */}
                    <View>
                      <Image
                        source={getCategoryImage(item.category)}
                        className="w-8 h-8"
                      />
                    </View>
                    <View className="p-4 w-[87%]">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-white font-Inter font-semibold">
                          {item.category}
                        </Text>
                        <Text className="text-white font-Inter font-medium">
                          {item.spendingPercentage}%
                        </Text>
                      </View>

                      <View className="flex-row justify-between">
                        <Text className="text-[#F1F1F2] font-Inter text-sm">
                          {getCurrencySymbol(getProfileData?.data?.currency)}
                          {item.budgetValue?.toFixed(2)}
                        </Text>
                        <Text className="text-[#F1F1F2] font-Inter text-sm">
                          {getCurrencySymbol(getProfileData?.data?.currency)}
                          {item.amountSpent?.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        handlethedelete();
                        setIdDelete(item.id);
                      }}
                      className="mr-3%"
                    >
                      <Entypo
                        name="dots-three-vertical"
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View className="py-8 items-center justify-center">
                <Text className="text-gray-400 text-center">
                  No budget categories found for this period
                </Text>
              </View>
            )}

            {/* Add button */}
            <TouchableOpacity
              onPress={() => setCatagoryOpen(true)}
              className="mb-4"
            >
              <LinearGradient
                colors={["#FAD885", "#C49F59", "#8A622A"]}
                style={{
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                }}
              >
                <View className="w-full flex-row justify-center items-center gap-[3%]">
                  <Entypo name="plus" size={24} color="#fff" />
                  <Text className="text-[#fff] font-semibold text-base">
                    Add category budget
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <AddCategory
        openModal={catagoryOpen}
        routed="modalbudge"
        close={() => setCatagoryOpen(false)}
      />
      <CustomAlert
        visible={alertVisible}
        title={alertTittle}
        message={alertMessage}
        onConfirm={() => {
          handleDeleted();
        }}
        onCancel={() => {
          console.log("Cancelled");
          setAlertVisible(false);
        }}
        type={"destructive"}
        confirmText={deleteDataLoading ? "...." : "OK"}
        cancelText="Cancel"
      />
    </Modal>
  );
};

export default BudgetModal;
