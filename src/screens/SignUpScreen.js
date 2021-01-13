import * as React from 'react';
import {Button, Text, TextInput, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../utils/Context'
import Register from './RegisterScreen'
export function SignUpScreen({navigation}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    const { signIn } = React.useContext(AuthContext);
    const {container, txtInput} = styles;
  
    return (
      <View style={container}>
        <TextInput 
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={txtInput}
        />
        <TextInput 
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={txtInput}
        />
        <Button title="Sign in" onPress={() => signIn({ username, password })} />
        <Button title="Register" onPress={() => this.props.navigation.navigate('RegisssterScreen')} />
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