import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {AuthContext} from '../utils/Context';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProfileScreen() {
    const { signOut } = React.useContext(AuthContext);
  //get the data of current user.
  AsyncStorage.getItem('userData', (err, result) => {
    console.log(result);
})

    return (
      <>
      
      <View>
      
        <Text style={{textAlign: 'center', fontSize:18}}>{auth().currentUser.email} ברוך שובך</Text>
        <Text style={{marginTop: 100}}/>
        <Button title="Sign out"  onPress= {signOut} />
        
         
      </View>
      </>
    );
  }
  