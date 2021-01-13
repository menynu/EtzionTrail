import React, { Component } from 'react';
import {AsyncStorage, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../utils/Context'
const usersRef = firestore().collection('Users');



export class Registration extends Component {

  componentDidMount() {
    console.log(this.state.userData);
    this.getToken();
 }

  constructor(props) {
    super(props);
    this.state = {
        email: "",
        password: "",
        userData: {}
      };
    }


    async storeToken(user) {
      try {
         await AsyncStorage.setItem("userData", JSON.stringify(user));
      } catch (error) {
        console.log("Something went wrong", error);
      }
    }
    async getToken(user) {
      try {
        let userData = await AsyncStorage.getItem("userData");
        let data = JSON.parse(userData);
        console.log(data);
      } catch (error) {
        console.log("Something went wrong", error);
      }
    }
    
    handleEmail = text => {
      this.setState({ email: text });
    };
    handlePassword = text => {
      this.setState({ password: text });
    };
    inputValueUpdate = (val, prop) => {
      const state = this.state;
      state[prop] = val;
      this.setState(state);
    }
  
    async Register(Email,Password) {
      if (Email === "" || Password === "" )
        alert("נא למלא את כל הפרטים")
    
    else {
      try {
        let res = await auth().createUserWithEmailAndPassword(Email, Password)
        if (res) {
          console.log( "?", res)
          
            this.setState({ userData: JSON.stringify( res.user) });
            this.storeToken(JSON.stringify(res.user));        
            console.log(this.state.userData);
            alert(res.user.uid)
            usersRef.add({
              Name: this.state.Name,
              Email: this.state.email})
            this.props.navigation.navigate('SignIn' , res)
            

        }
      } catch (e) {
        console.error(e.message)
      }
      
      



    //   auth().createUserWithEmailAndPassword(Email, Password)
    //   .then(() => {
    //     console.log('User account created & signed in!');
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       console.log('That email address is already in use!');
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!');
    //     }

    //     console.error(error);
    //   })
    //   .then(res => {
    //     this.setState({ userData: JSON.stringify( res.user) });        
    //     console.log(this.state.userData);
    // })
    // .then(res => {
    //   this.storeToken(JSON.stringify(res.user));
    // })
    //   .then(usersRef.add({
    //     Name: this.state.Name,
    //     Email: this.state.email
    //   }).then(() =>{console.log("User added!")}))
    }

    // usersRef.add({
    //   Name: this.state.Name,
    //   Email: this.state.email
    // }).then(() =>{console.log("User added!")})
  }
  

  render() {
    return (


      <View style={styles.container}>
         <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholder="Name"
      placeholderTextColor="black"
      autoCapitalize="none"
      onChangeText={(val) => this.inputValueUpdate(val, 'Name')}
       />
        <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholder="Email"
      placeholderTextColor="black"
      autoCapitalize="none"
      onChangeText={this.handleEmail}
       />
       <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Password"
        placeholderTextColor="black"
        autoCapitalize="none"
        secureTextEntry={true} 
        onChangeText={this.handlePassword}
       />
      <TouchableOpacity
      style={styles.submitButton}
      onPress={() => this.Register(this.state.email, this.state.password)} >
     <Text style={styles.submitButtonText}> Register </Text>
    </TouchableOpacity>
    </View>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#F5FCFF"
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
  submitButtonText: {
    color: "white"
  }
});



