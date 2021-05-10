/* eslint-disable react/prop-types */
import * as React from "react";
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, Linking } from "react-native";
import { AuthContext } from "../utils/Context";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

export function SignInScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { signIn } = React.useContext(AuthContext);
  const { container, txtInput } = styles;
  const AdminRef = firestore().collection("Admins");

  const setToken = async (user) => {
    console.log("set user login!:: ", JSON.stringify(user));
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  // Format validation
  const Validate = () => {
    if (!email || !password) {
      alert("נא למלא אימייל וסיסמה");
      return;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      alert("נא להכניס אמייל תקין");
      return;
    }
    if (password.length < 6) {
      alert("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    doSignIn(email, password);
  };

  const doSignIn = async (email, password) => {
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        // alert("Success Authenticated successfully");
        console.log("after login: res data: ", response.user);
        AdminRef.onSnapshot(querySnapshot => {
          if (querySnapshot) {
            querySnapshot.forEach(async res => {
              if (res.data().userEmail === email)
                await AsyncStorage.setItem("Admin", JSON.stringify(true));
            });
          }
        });
        setToken(response.user);
        console.log("res user: ", response.user);
        AsyncStorage.setItem("userEmail", response.user.email);
        signIn("Token", response.user.uid);

      }
    } catch (e) {
      console.log(e.message);
      alert("אין משתמש כזה במערכת");
    }
  };


  return (
    <>
      <View style={container}>
        <Image source={require("../assets/logo.png")} style={styles.image}/>
        <TextInput
          placeholder="אימייל"
          value={email}
          onChangeText={setEmail}
          style={txtInput}
        />
        <TextInput
          placeholder="סיסמה"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textAlign='right'
          style={txtInput}
        />
        <View style={{ flexDirection: "row-reverse", margin: 15 }}>
          {/* <Button title="כניסה" style={styles.button} onPress={() => {Validate()}}/>
        <Text style={{margin: 8}}></Text>
        <Button title="הרשמה" style={styles.button} onPress={() => navigation.navigate("Register")}/> */}
          <TouchableOpacity onPress={() => Validate()} style={styles.button}>
            <Text style={{
              justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center"
            }}>כניסה </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.button}>
            <Text style={{ justifyContent: "center", alignContent: "center" }}>הרשמה </Text>
          </TouchableOpacity>


        </View>
        <View style={{ flexDirection: "row" }}>
          <Text> השימוש באפליקציה מהווה הסכמה </Text>
          <Text style={{ fontWeight: "bold" }}
                onPress={() => Linking.openURL("https://etzion-trail.flycricket.io/terms.html")}>
            לתנאי השימוש
          </Text>

        </View>
        <View style={{ flexDirection: "row" }}>
          <Text> ולתנאי </Text>
          <Text style={{ fontWeight: "bold" }}
                onPress={() => Linking.openURL("https://etzion-trail.flycricket.io/privacy.html")}>
            הפרטיות
          </Text>
        </View>

        {/* <TouchableOpacity style={[{
          width: 60, height: 60,
          position: "absolute", bottom: 20, right: 20, borderRadius: 30, backgroundColor: "#d2d2d2", shadowColor: 'blue', shadowOffset: 13
        }]}> */}

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    height: 280,
    width: 350,
    resizeMode: "stretch"
  },
  button: {
    height: 40,
    width: 160,
    borderRadius: 10,
    backgroundColor: "#537cdb",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"

  },
  txtInput: {
    marginTop: 10,
    height: 50,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5
  }
});