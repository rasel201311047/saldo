import Background1 from "@/src/component/background/Background1";
import NavBalance from "@/src/component/balance/NavBalance";
import WithDataBH from "@/src/component/balance/WithDataBH";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const balance = () => {
  return (
    <Background1>
      <SafeAreaView edges={["top"]} className="flex-1">
        <NavBalance />
        <WithDataBH />
      </SafeAreaView>
    </Background1>
  );
};

export default balance;
