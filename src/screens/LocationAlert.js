import * as React from "react";
import { View, Image,Alert } from "react-native";
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
      <Image source={require("../assets/waitingLogo.png")} style={{width: '100%', height: '100%', resizeMode: "cover"}}/>
    </View>
  );
}