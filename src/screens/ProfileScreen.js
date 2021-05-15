import * as React from "react";
import { Button, Text, View, Linking, ScrollView } from "react-native";
import { AuthContext } from "../utils/Context";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApproveMarkers from "../components/ApproveMarkers";
import { WebView } from "react-native-webview";
import firestore from "@react-native-firebase/firestore";


export function ProfileScreen() {

  const { signOut } = React.useContext(AuthContext);
  const [admin, setAdmin] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");



  // React.useEffect(async () => {
   
  // }, []);
console.log('display name? ', auth().currentUser.displayName)
  // auth().currentUser.displayName

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
      <ScrollView>
        {auth().currentUser.email ?
          <Text style={{ textAlign: "center", fontSize: 18 }}>{name} ברוך שובך</Text> : null}
        {console.log("auth is:", auth().currentUser)}
        {/* <Text style={{ marginTop: 100 }}/> */}

        <Text style={{ color: "blue", fontSize: 18, textAlign: "center", margin: 15 }}
              onPress={() => Linking.openURL("http://etziontour.org.il/")}>
          מעבר לאתר גוש עציון
        </Text>
        <View style={{ width: "100%", height: 500, marginTop: 10, marginBottom: 5 }}>
          <WebView source={{ uri: "http://etziontour.org.il/" }}/>
        </View>
        <View>

          <View style={{ marginBottom: 20 }}>
            <Button title="יציאה" onPress={signOut}/>
          </View>

        </View>

      </ScrollView>

    </>
  );
}
  