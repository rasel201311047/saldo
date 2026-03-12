import GradientBackground from "@/src/component/background/GradientBackground";
import CustomAlert from "@/src/component/customAlart/CustomAlert";
import { useGetMyProfileQuery } from "@/src/redux/api/Auth/authApi";
import {
  useDeleteBalanceAccountByIdMutation,
  useGetBalanceAccountByIdQuery,
} from "@/src/redux/api/Page/Balance/balanceApi";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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

const Balancedetails = () => {
  const { data: getProfileData, isLoading: profileLoading } =
    useGetMyProfileQuery();
  const params = useLocalSearchParams();
  const { data: balanceData, isLoading: balanceLoading } =
    useGetBalanceAccountByIdQuery(params.id as string);

  const [deleteBalanceAccountById, { isLoading: deleteLoading }] =
    useDeleteBalanceAccountByIdMutation();

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTittle, setAlertTittle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible2, setAlertVisible2] = useState(false);
  const [alertTittle2, setAlertTittle2] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const account = balanceData?.data;
  console.log("Account Details Data:", account?._id);

  useEffect(() => {
    if (account) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [account]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleEdit = () => {
    // Navigate to edit screen
    router.push({
      pathname: "/editbalance",
      params: { id: account?._id },
    });
  };

  const handleRemove = () => {
    setAlertVisible(true);
    setAlertTittle("Delete Account");
    setAlertMessage(
      "Are you sure you want to delete this account? This action cannot be undone.",
    );
  };

  // Delete account function
  const handleDelete = async () => {
    try {
      const res = await deleteBalanceAccountById(params.id as string);
      if (deleteLoading) {
        setAlertTittle("Removing...");
        setAlertMessage("Please wait while we remove the account.");
      }
      if (res?.data?.success) {
        router.push("/balance");
      }
    } catch (error: any) {
      setAlertVisible2(true);
      setAlertTittle2("Error");
      setAlertMessage2("An error occurred while deleting the account.");
    }
  };

  //====================================================
  //  information card component
  // ====================================================

  const InfoCard = ({ label, value, icon, color = "#ECCD72" }: any) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="mb-4"
    >
      <LinearGradient
        colors={["#2a2a2a", "#1a1a1a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16 }}
        className="p-4 rounded-2xl border border-[#333333]"
      >
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name={icon} size={16} color={color} />
          <Text className="text-gray-400 font-Inter ml-2">{label}</Text>
        </View>
        <Text className="text-white font-Inter text-lg font-semibold">
          {value}
        </Text>
      </LinearGradient>
    </Animated.View>
  );

  if (balanceLoading) {
    return (
      <GradientBackground>
        <SafeAreaView
          edges={["top"]}
          className="flex-1 justify-center items-center"
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <ActivityIndicator size="large" color="#ECCD72" />
          </Animated.View>
        </SafeAreaView>
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
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white font-Inter text-2xl text-center font-bold">
            {account?.name || "Account Details"}
          </Text>

          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-[5%]"
          showsVerticalScrollIndicator={false}
        >
          {/* ===========================
          Main Balance Card 
          ================================*/}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
            className="mt-6 mb-6"
          >
            <LinearGradient
              colors={[account?.color || "#2196F3", "#1a1a1a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6 rounded-3xl"
              style={{
                shadowColor: account?.color || "#2196F3",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderRadius: 24,
              }}
            >
              <View className="items-center">
                <FontAwesome5 name={account?.icon} size={40} color="#fff" />
                {/* <Text className="text-6xl mb-2">{account?.icon || "💎"}</Text> */}
                <Text className="text-white/80 font-Inter text-lg mb-2">
                  Current Balance
                </Text>

                <Text className="text-white font-Inter text-4xl font-bold">
                  {getCurrencySymbol(getProfileData?.data?.currency)}
                  {account?.amount}
                </Text>
                <View className="flex-row mt-4">
                  <View className="bg-white/20 px-4 py-2 rounded-full">
                    <Text className="text-white font-Inter">
                      {account?.accountType || "Investment"}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Account Details */}
          <Text className="text-white/60 font-Inter text-sm mb-3 ml-1">
            ACCOUNT INFORMATION
          </Text>

          <InfoCard label="Account Name" value={account?.name} icon="wallet" />

          <InfoCard
            label="Account Type"
            value={account?.accountType}
            icon="tag"
            color="#4CAF50"
          />

          <InfoCard
            label="Currency"
            value={getProfileData?.data?.currency}
            icon="money-bill-wave"
            color="#FF9800"
          />

          <InfoCard
            label="Credit Limit"
            value={formatCurrency(
              account?.creditLimit || 0,
              getProfileData?.data?.currency || "USD",
            )}
            icon="credit-card"
            color="#F44336"
          />

          <InfoCard
            label="Notes"
            value={account?.notes || "No notes added"}
            icon="sticky-note"
            color="#9C27B0"
          />

          <InfoCard
            label="Created"
            value={formatDate(account?.createdAt)}
            icon="calendar-alt"
            color="#00BCD4"
          />

          <InfoCard
            label="Last Updated"
            value={formatDate(account?.lastUpdated)}
            icon="clock"
            color="#FFC107"
          />

          {/* Action Buttons */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="flex-row justify-between mt-6 mb-8"
          >
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 mr-2"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4CAF50", "#45a049"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 16 }}
                className="py-4 rounded-2xl items-center flex-row justify-center"
              >
                <FontAwesome5 name="edit" size={18} color="#fff" />
                <Text className="text-white font-Inter font-semibold ml-2">
                  Edit
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRemove}
              className="flex-1 ml-2"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#F44336", "#d32f2f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 16 }}
                className="py-4 rounded-2xl items-center flex-row justify-center"
              >
                <FontAwesome5 name="trash" size={18} color="#fff" />
                <Text className="text-white font-Inter font-semibold ml-2">
                  {deleteLoading ? "Removing..." : "Remove"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          title={alertTittle}
          message={alertMessage}
          onConfirm={() => {
            handleDelete();
            setAlertVisible(false);
          }}
          onCancel={() => {
            console.log("Cancelled");
            setAlertVisible(false);
          }}
          type={"destructive"}
          confirmText={"OK"}
          cancelText="Cancel"
        />
        <CustomAlert
          visible={alertVisible2}
          title={alertTittle2}
          message={alertMessage2}
          onConfirm={() => {
            console.log("Confirmed");
            setAlertVisible(false);
          }}
          // onCancel={() => {
          //   console.log("Cancelled");
          //   setAlertVisible(false);
          // }}
          type={"error"}
          confirmText={"OK"}
          cancelText="Cancel"
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Balancedetails;
