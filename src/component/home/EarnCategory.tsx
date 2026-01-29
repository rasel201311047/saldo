import { BudgetImg } from "@/assets/budget/budgetimg";
import { useAppDispatch } from "@/src/redux/hooks";
import { setCategory } from "@/src/redux/slices/userSlice";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SetupBudget from "./SetupBudget";

interface AddCategoryProps {
  openModal: boolean;
  close: (v: boolean) => void;
}

type CategoryType = {
  title: string;
  image: any;
};

const dataOfCategory: CategoryType[] = [
  { title: "Salary", image: BudgetImg.dollar },
  { title: "Investment", image: BudgetImg.investment },
  { title: "Rewards", image: BudgetImg.rank },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Business", image: BudgetImg.business },
  { title: "Other", image: BudgetImg.Other },
];

const EarnCategory: React.FC<AddCategoryProps> = ({ openModal, close }) => {
  const [selected, setSelected] = useState<CategoryType | null>(null);
  const [openSetup, setOpenSetup] = useState(false);
  const dispatch = useAppDispatch();

  const handleSelect = (item: CategoryType) => {
    dispatch(
      setCategory({
        title: item.title,
        image: item.image,
      }),
    );
    router.push("/addearning");
    setSelected(item);
    setOpenSetup(false);
  };

  return (
    <>
      <Modal transparent visible={openModal} animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => close(false)}
          className="absolute inset-0 bg-black/60"
        />

        <View className="absolute bottom-0 w-full h-[55%] bg-[#1A1A24] rounded-t-3xl pt-6 px-5">
          <Text className="text-xl text-center font-bold text-white mb-4">
            Select Category
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {dataOfCategory.map((item, index) => {
              const isActive = selected?.title === item.title;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(item)}
                  className={`flex-row items-center px-4 py-3 mb-3 rounded-xl ${
                    isActive ? "bg-[#3B3B50]" : "bg-[#242333]"
                  }`}
                >
                  <Image
                    source={item.image}
                    className="w-6 h-6 mr-3"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-base flex-1">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      <SetupBudget
        selected={selected}
        open={openSetup}
        setOpen={setOpenSetup}
      />
    </>
  );
};

export default EarnCategory;
