import { Image, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function Background1({ children }: Props) {
  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <Image
        source={require("../../../assets/images/HomeBackground.png")}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <View className="flex-1">{children}</View>
    </View>
  );
}
