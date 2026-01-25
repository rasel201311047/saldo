import { Text, View } from "react-native";
import Background1 from "../component/background/Background1";
import GradientBackground from "../component/background/GradientBackground";

export default function Index() {
  return (
    <GradientBackground>
      <Background1>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-2xl">Welcome to the App!</Text>
        </View>
      </Background1>
    </GradientBackground>
  );
}
