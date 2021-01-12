import * as React from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {AuthContext} from '../utils/Context';

export function ProfileScreen() {
    const { signOut } = React.useContext(AuthContext);
  
    return (
      <View>
        <Text>Signed in!</Text>
        <Button title="Sign out" onPress={signOut} />
      </View>
    );
  }
  