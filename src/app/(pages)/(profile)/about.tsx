import GradientBackground from "@/src/component/background/GradientBackground";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
const about = () => {
  const source = {
    html: `
  <p>
    gravida elit enim. lobortis, ex orci lobortis, Donec orci elit felis, luctus
    ultrices odio tincidunt cursus elit ex nisi vehicula, Morbi Nunc Morbi venenatis
    sollicitudin. tortor. dui non quam dui. nibh tortor. sit viverra maximus ipsum
  </p>

  <p>
    massa tincidunt massa non, Ut ex lobortis, nulla, sit orci Nam massa viverra
    venenatis massa placerat In viverra laoreet massa Lorem at elit scelerisque
    Quisque viverra id ipsum risus quam Lorem id quis ultrices vel placerat dui.
    elit nec
  </p>

  <p>
    lobortis, vehicula, tempor Quisque sed felis, vitae Sed varius dolor volutpat
    in sed non, massa sit porta nisi ex. porta nulla, turpis efficitur. Nunc dolor
    dolor id non est. lacus, varius ipsum placerat. elementum dignissim, Vestibulum
  </p>

  <p>
    quam efficitur. gravida non. lacus, vehicula, nec id commodo turpis Donec Nam
    faucibus quis elementum tincidunt tortor. orci adipiscing odio sed sollicitudin.
    eget quis faucibus diam Cras fringilla Nam Lorem adipiscing vel in Vestibulum
  </p>



  
`,
  };
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        {/* HEADER */}
        <View className="flex-row items-center justify-between gap-4 px-[5%] mt-4">
          <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
              colors={["#b08b4a80", "#2626a180"]}
              style={{ borderRadius: 50 }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold">About Us</Text>
          <View className="w-2" />
        </View>

        <View className="px-[5%] mt-[9%] flex-1">
          <LinearGradient
            colors={["#0F0D25", "#2A2114"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 25 }}
            className="h-[95%] w-full py-8 px-3 rounded-3xl"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <RenderHtml
                source={source}
                tagsStyles={{
                  p: {
                    color: "#FFFFFF",
                    fontFamily: "Inter",
                    fontSize: 14,
                    lineHeight: 22,
                    marginBottom: 16,
                  },
                }}
              />
            </ScrollView>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default about;
