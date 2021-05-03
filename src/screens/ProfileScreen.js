import * as React from "react";
import { Button, Text, View, Linking } from "react-native";
import { AuthContext } from "../utils/Context";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApproveMarkers from "../components/ApproveMarkers";
import { WebView } from "react-native-webview";

export function ProfileScreen() {
  const { signOut } = React.useContext(AuthContext);
  const [admin, setAdmin] = React.useState(false);
  //get the data of current user.
  AsyncStorage.getItem("userData", (err, result) => {
    console.log("user data is: ", result);
  });
  AsyncStorage.getItem("Admin", (err, result) => {
    console.log("is admin on?: ", result);
    if (result) {
      setAdmin(result);
      console.log("only for admin: ", admin);
    }
  });


  return (
    <>
      {admin && <ApproveMarkers/>}
      <View>
        <Text style={{ textAlign: "center", fontSize: 18 }}>{auth().currentUser.email} ברוך שובך</Text>
        {console.log("auth is:", auth().currentUser)}
        {/* <Text style={{ marginTop: 100 }}/> */}
        <Text style={{ color: "blue", fontSize: 18 }}
              onPress={() => Linking.openURL("http://etziontour.org.il/")}>
          לאתר המלא
        </Text>
        <View style={{ width: "100%", height: 450 }}>
          <WebView style={{ flex: 1 ,marginBottom: 10}} source={{ uri: "http://etziontour.org.il/" }}/>
        </View>
        <Button title="יציאה" onPress={signOut}/>
      </View>
    </>
  );
}
  