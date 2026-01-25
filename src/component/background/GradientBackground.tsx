import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function GradientBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2A2114", "#0F0D25"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0D25",
  },
  gradient: {
    flex: 1,
  },
});
