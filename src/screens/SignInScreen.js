import * as React from 'react';
import {Button, TextInput, View, StyleSheet} from 'react-native';
import {AuthContext} from '../utils/Context'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SignInScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const  { signIn }  = React.useContext(AuthContext); 
    const {container, txtInput} = styles;
  
    const [userData, setUserData] = React.useState([]);

    const setToken = async (user) => {
      console.log('set user login!:: ', JSON.stringify(user))
      try {
         await AsyncStorage.setItem("userData", JSON.stringify(user));
      } catch (error) {
        console.log("Something went wrong", error);
      }
    }


    const doSignIn = async (email, password) => {
    
      try {
        let response = await auth().signInWithEmailAndPassword(email, password)
        if (response && response.user) {
          alert("Success Authenticated successfully")
          console.log('after login: res data: ', response.user)
          // setUserData(response.user)
          setToken(response.user)
          // console.log('user data: ', userData)
          signIn('Token', response.user.uid)
    
        }
      } catch (e) {
        console.error(e.message)
      }
      // signIn({ email, password })
    }


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