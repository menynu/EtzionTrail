import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {AuthContext} from '../utils/Context';
import auth from '@react-native-firebase/auth';


export function ProfileScreen() {
    const { signOut } = React.useContext(AuthContext);
   

    return (
      <View>
        <Text style={{textAlign: 'center', fontSize:18}}>{auth().currentUser.email} ברוך שובך</Text>
        <Text style={{marginTop: 100}}/>
        <Button title="Sign out"  onPress= {signOut} />
      </View>
    );
  }
  