import * as React from "react";
import { View, Image} from "react-native";

export function SplashScreen() {
  return (
    <View>
      <Image source={require("../assets/waitingLogo.png")} style={{width: '100%', height: '100%', resizeMode: "cover"}}/>
    </View>
  );
}