import * as React from 'react';
import {Button, Text, TextInput, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../utils/Context'
import RegisterScreen from './RegisterScreen'
import { createStackNavigator } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StackAuth = createStackNavigator();
// const StackRoot = createStackNavigator();

// const { signIn } = React.useContext(AuthContext);
function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="SignIn">
      <StackAuth.Screen name="SignIn" component={SignInScreen} />
      <StackAuth.Screen name="Register" component={RegisterScreen} />
    </StackAuth.Navigator>
  );
}



const doSignIn = async (email, password) => {
  // const  { signIn }  = React.useContext(AuthContext);
  try {
    let response = await auth().signInWithEmailAndPassword(email, password)
    if (response && response.user) {
      alert("Success Authenticated successfully")
  

    }
  } catch (e) {
    console.error(e.message)
  }
  // signIn({ email, password })
}



export function SignInScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const  { signIn }  = React.useContext(AuthContext);

   
    const {container, txtInput} = styles;
  
    return (
      <View style={container}>
        <TextInput 
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={txtInput}
        />
        <TextInput 
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={txtInput}
        />
        <Button title="Sign in" onPress={() => {
           //signIn({ username, password })
          doSignIn(email,password)
          

          }} />
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
      </View>
    );
  }

  const styles = StyleSheet.create({
      container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
      },
      txtInput: {
          height: 50,
          width: '90%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 5,
      }
  })