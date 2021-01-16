import * as React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {AuthContext} from '../utils/Context';
import auth from '@react-native-firebase/auth';

export function ProfileScreen() {
    const { signOut } = React.useContext(AuthContext);
   
    const doSignOut = async () => {
      signOut
      try {
        await auth().signOut()
        .then(() => {console.log('User signed out!'),  signOut});
      } catch (e) {
        console.error(e.message)
      }
      // signIn({ email, password })
    }
  
    return (
      <View>
        <Text>Signed in!</Text>
        <Button title="Sign out" onPress={
          // doSignOut
          signOut
          // auth().signOut()
          } />
      </View>
    );
  }
  