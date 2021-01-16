import * as React from 'react';
import {Button, TextInput, View, StyleSheet} from 'react-native';
import {AuthContext} from '../utils/Context'
import auth from '@react-native-firebase/auth';


export function SignInScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const  { signIn }  = React.useContext(AuthContext); 
    const {container, txtInput} = styles;
  
    const doSignIn = async (email, password) => {
    
      try {
        let response = await auth().signInWithEmailAndPassword(email, password)
        if (response && response.user) {
          alert("Success Authenticated successfully")
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