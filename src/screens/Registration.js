import React, { Component } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const usersRef = firestore().collection("Users");

export class Registration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userData: {},
      name: '',
    };
  }


  async storeToken(user) {
    console.log("set user register: ", user);
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      await AsyncStorage.setItem("userName", this.state.name);
    } catch (error) {
      console.log("Something went wrong", error);
    }

  }

  handleEmail = text => {
    this.setState({ email: text });
  };

  handleName = text => {
    this.setState({ name: text });
  };

  handlePassword = text => {
    this.setState({ password: text });
  };

  Validate() {
    if (!this.state.email || !this.state.password) {
      alert("נא למלא אימייל וסיסמה");
      return;
    }
    // eslint-disable-next-line no-useless-escape
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      alert("נא להכניס אמייל תקין");
      return;
    }
    if (this.state.password.length < 6) {
      alert("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    this.Register(this.state.email, this.state.password);
  }

  async Register(Email, Password) {
    console.log('the name is:  ', this.state.name)
    try {
      let res = await auth().createUserWithEmailAndPassword(Email, Password)
      if (res) {
        this.setState({ userData: res.user });
        this.storeToken(res.user);
        console.log("the res data user: ", res.user);
        console.log(this.state.userData);
        console.log("user login id:", res.user.uid);
        console.log('EMAIL : ', this.state.email, 'NAME: ', this.state.name)
        const user = auth().currentUser;
         user.updateProfile({
          displayName: this.state.name
        })
        usersRef.add({
          Name: this.state.name,
          Email: this.state.email
        });
        this.props.navigation.navigate("SignIn", res);
      }
    } catch (e) {
      console.error(e.message);
    }
  }


  render() {
    return (


      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.image}/>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="שם"
          color = '#333'
          placeholderTextColor = "#666"
          autoCapitalize="none"
          onChangeText={this.handleName}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="אימייל"
          autoCapitalize="none"
          color = '#333'
          placeholderTextColor = "#666"
          onChangeText={this.handleEmail}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="סיסמה"
          color = '#333'
          placeholderTextColor = "#666"
          autoCapitalize="none"
          textAlign='right'
          secureTextEntry={true}
          onChangeText={this.handlePassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.Validate()}>
          <Text style={styles.submitButtonText}> להרשמה </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text> השימוש באפליקציה מהווה הסכמה </Text>
          <Text style={{ fontWeight: "bold" }}
                onPress={() => Linking.openURL("https://etzion-trail.flycricket.io/terms.html")}>
            לתנאי השימוש
          </Text>

        </View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text> ולתנאי </Text>
          <Text style={{ fontWeight: "bold" }}
                onPress={() => Linking.openURL("https://etzion-trail.flycricket.io/privacy.html")}>
            הפרטיות
          </Text>
        </View>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
    // alignItems: "center",
    // backgroundColor: "#F5FCFF"
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "black",
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: "black",
    padding: 10,
    margin: 15,
    alignItems: "center",
    height: 40
  },
  button: {
    padding: 10,
    margin: 15,
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#537cdb"
  },
  image: {
    alignSelf: "center",
    height: 180,
    width: 250
    // resizeMode: 'stretch',
    // marginLeft: 15
  },
  submitButtonText: {
    color: "white"
  }
});



