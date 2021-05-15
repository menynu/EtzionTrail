import * as React from "react";
import { View, TouchableOpacity,Alert,ImageBackground,Text,StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LocationAlert({navigation}) {

    React.useEffect(async () => {
        const askPermission = await AsyncStorage.getItem("Permission");
        if (!askPermission){
     
            Alert.alert(
              "הרשאת מיקום",
              "שביל עציון אוספת מידע אודות מיקומך בכדי להציג ולהקליט את המסלול גם כאשר האפליקציה עובדת ברקע. בכדי להמשיך עלייך לאשר לשביל עציון לגשת לנתוני מיקומך גם כשהאפליקציה פועלת ברקע",
              [
                {
                  text: "אישור",
                  onPress: () => {try {
                     AsyncStorage.setItem("Permission", 'true');
                     navigation.navigate("HomeScreen")
                     
                  } catch (error) {
                    console.log("Something went wrong", error);
                  }}
                },
               
                // { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            )
            
          }
          else {
            navigation.navigate("HomeScreen")
          }
    
    
    
    }, []);

   
    
  return (
    <View>
      {/* { setTimeout(() => {
      navigation.navigate("HomeScreen")
    }, 1000)} */}
      <ImageBackground source={require("../assets/waitingLogo.png")} style={{width: '100%', height: '100%', }}>
      <TouchableOpacity
          style={styles.button}
          onPress={() =>  navigation.navigate("HomeScreen")}>
          <Text style={styles.submitButtonText}> למפה </Text>
        </TouchableOpacity>
        </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
 
  button: {
    height: 40,
    width: 160,
    bottom: 20,
    borderRadius: 10,
    backgroundColor: "#537cdb",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",

    // right: 20,

  



  },

});