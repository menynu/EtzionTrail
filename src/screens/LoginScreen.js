import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput, 
  TouchableOpacity,
  Button, 
  View, 
  Text,
  AsyncStorage
} from 'react-native';

const userInfo = {username: 'admin', password: '1234'}

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  render() {
    return (
      <View style={StyleSheet.container}>
        <StatusBar
          backgroundColor="lightblue"
          barStyle="light-content"
          />
          <Text style={styles.welcome}> Loging to my app</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(username)=>this.setState({username})}
            value={this.state.username}
            autoCapitalize = "none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(password)=>this.setState({password})}
            value={this.state.password}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
            style={styles.userBtn}
            onPress={this._login}
            // onPress={() => this.props.navigation.navigate('Home')}
            >
              <Text style={styles.btnTxt}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userBtn}
              onPress={() => alert("Sign-up Works!")}
            >
              <Text style={styles.btnTxt}>Sign up</Text>
            </TouchableOpacity>
          </View>
          
      </View>
      

    );
  }

  _login = async() => {
    if(userInfo.username === this.state.username && userInfo.password === this.state.password){
      //alert('Logged in');
      await AsyncStorage.setItem('isLoggedIn', '1');
      this.props.navigation.navigate('HomeScreen');
    }
    else{
      alert('Username or Password is incorrect.');
    }
      

  }
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    color: "#fff",
    fontFamily: "DancingScript-Bold",
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%"
  },
  userBtn: {
    backgroundColor: "#FFD700",
    padding: 15,
    width: "45%"
  },
  btnTxt: {
    fontSize: 18,
    textAlign: "center"
  }
})