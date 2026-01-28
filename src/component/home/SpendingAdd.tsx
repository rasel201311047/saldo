import { BudgetImg } from "@/assets/budget/budgetimg";
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
  { title: "Supermarket", image: BudgetImg.supermarket },
  { title: "Clothing", image: BudgetImg.clothing },
  { title: "House", image: BudgetImg.house },
  { title: "Entertainment", image: BudgetImg.entertainment },
  { title: "Transport", image: BudgetImg.Transport },
  { title: "Gifts", image: BudgetImg.Gifts },
  { title: "Travel", image: BudgetImg.Travel },
  { title: "Education", image: BudgetImg.Education },
  { title: "Food", image: BudgetImg.Food },
  { title: "Work", image: BudgetImg.Work },
  { title: "Electronics", image: BudgetImg.Electronics },
  { title: "Sport", image: BudgetImg.Sport },
  { title: "Restaurant", image: BudgetImg.Restaurant },
  { title: "Health", image: BudgetImg.Health },
  { title: "Communications", image: BudgetImg.Communications },
  { title: "Other", image: BudgetImg.Other },
];

const SpendingAdd: React.FC<AddCategoryProps> = ({
  openModal,

  close,
}) => {
  console.log(openModal);
  const [selected, setSelected] = useState<CategoryType | null>(null);
  const [openSetup, setOpenSetup] = useState(false);

  const handleSelect = (item: CategoryType) => {
    setSelected(item);
    setOpenSetup(true);
    close(false);
  };

  return (
    <>
      <Modal transparent visible={openModal} animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => close(false)}
          className="absolute inset-0 bg-black/60"
        />

        <View className="absolute bottom-0 w-full h-[85%] bg-[#1A1A24] rounded-t-3xl pt-6 px-5">
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

export default SpendingAdd;
