import * as React from 'react';
import {AsyncStorage, StyleSheet, Text, TextInput, TouchableOpacity, View, Button} from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../utils/Context'

const usersRef = firestore().collection('Users');

// const { register } = React.useContext(AuthContext);
// const [username, setUsername] = React.useState('');
// const [password, setPassword] = React.useState('');

 //const  signIn  = React.useContext(AuthContext);
//  const  { signIn }  = React.useContext(AuthContext);
// const data = {
//   email: state.email,
//   password: state.password
// }
// signIn(data)


//  const CreateUser = async (email,password,navigation) => {
//   try {
//     let response = await auth().createUserWithEmailAndPassword(data.email, data.password)
//     if (response) {
//       console.log("test")
//     }
//   } catch (e) {
//     console.error(e.message)
//   }
//  usersRef.add({
//       // Name: this.state.Name,
//        Email: email
//       })
//        navigation.navigate("SignIn")
// }



// const CreateUser = async (email, password) => {
//   const [userID,setUID] = React.useState('');
//   try {
//     let response = await auth().createUserWithEmailAndPassword(email, password)
//     if (response) {
//       console.log( "?", response)
//     }
//   } catch (e) {
//     console.error(e.message)
//   }
//   usersRef.add({
//       // Name: this.state.Name,
//        Email: email
//       })
//        //navigation.navigate("SignIn")
       
//       const applyUser = ({navigation}) =>
//       {
//         const  signIn  = React.useContext(AuthContext);
        
//       }

// }
const userCreated = (props) => (
  
  props.navigation.navigate('SignIn')

)
export function RegisterScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    const { register } = React.useContext(AuthContext);
    const {container, txtInput} = styles;
    //const {email, password} = data;
  

    const CreateUser = async (email, password) => {
      const [userID,setUID] = React.useState('');
      try {
        let response = await auth().createUserWithEmailAndPassword(email, password)
        if (response) {
          console.log( "?", response)
        }
      } catch (e) {
        console.error(e.message)
      }
      usersRef.add({
          // Name: this.state.Name,
           Email: email
          })
           //navigation.navigate("SignIn")
           
          const applyUser = ({navigation}) =>
          {
            const  signIn  = React.useContext(AuthContext);
            
          }
    
    }




    
    return (
      <View style={container}>
        <Text>Reg</Text>
        <TextInput 
          placeholder="email"
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
       
        <Button title="Register" onPress={() => {
          // navigation.navigate('Register')
          //register(email,password)

          
          CreateUser(email,password)
            
            }} />
      </View>
    );
  }

















// export class RegisterScreen extends Component {

//   componentDidMount() {
//     console.log(this.state.userToken);
//     this.getToken();
//  }

//   constructor(props) {
//     super(props);
//     this.state = {
//         email: "",
//         password: "",
//         userToken: {}
//       };
//     }


//     async storeToken(user) {
//       try {
//          await AsyncStorage.setItem("userToken", JSON.stringify(user));
//       } catch (error) {
//         console.log("Something went wrong", error);
//       }
//     }
//     async getToken(user) {
//       try {
//         let userToken = await AsyncStorage.getItem("userToken");
//         let data = JSON.parse(userToken);
//         console.log(data);
//       } catch (error) {
//         console.log("Something went wrong", error);
//       }
//     }
    
//     handleEmail = text => {
//       this.setState({ email: text });
//     };
//     handlePassword = text => {
//       this.setState({ password: text });
//     };
//     inputValueUpdate = (val, prop) => {
//       const state = this.state;
//       state[prop] = val;
//       this.setState(state);
//     }
  
//     Register(Email,Password) {
//       if (Email === "" || Password === "" )
//         alert("נא למלא את כל הפרטים")
    
//     else {
//       auth()  // Make the email&pass unique in Firebase Authentication
//       .createUserWithEmailAndPassword(Email, Password)
//       .then(() => {
//         console.log('User account created & signed in!');
//       })
//       .catch(error => {
//         if (error.code === 'auth/email-already-in-use') {
//           console.log('That email address is already in use!');
//         }

//         if (error.code === 'auth/invalid-email') {
//           console.log('That email address is invalid!');
//         }

//         console.error(error);
//       })
//       .then(res => {
//         this.setState({ userToken: JSON.stringify( res.user) });        
//         console.log(this.state.userToken);
//     })
//     .then(res => {
//       this.storeToken(JSON.stringify(res.user));
//     })
//       usersRef.add({
//         Name: this.state.Name,
//         Email: this.state.email
//       })
//       .then(this.setState({
//           email: "",
//           password: ""
//       }))
//       {console.log("User added!")}
//       register(this.state.email, this.state.password)
//       this.props.navigation.navigate('SignIn')
//     }

//     // usersRef.add({
//     //   Name: this.state.Name,
//     //   Email: this.state.email
//     // }).then(() =>{console.log("User added!")})
//   }


//   render() {
//     return (

//       <View style={styles.container}>
//          <TextInput
//       style={styles.input}
//       underlineColorAndroid="transparent"
//       placeholder="Name"
//       placeholderTextColor="black"
//       autoCapitalize="none"
//       onChangeText={(val) => this.inputValueUpdate(val, 'Name')}
//        />
//         <TextInput
//       style={styles.input}
//       underlineColorAndroid="transparent"
//       placeholder="Email"
//       placeholderTextColor="black"
//       autoCapitalize="none"
//       onChangeText={this.handleEmail}
//        />
//        <TextInput
//         style={styles.input}
//         underlineColorAndroid="transparent"
//         placeholder="Password"
//         placeholderTextColor="black"
//         autoCapitalize="none"
//         secureTextEntry={true} 
//         onChangeText={this.handlePassword}
//        />
//       <TouchableOpacity
//       style={styles.submitButton}
//       onPress={() => this.Register(this.state.email, this.state.password) }>
//      <Text style={styles.submitButtonText}> Register </Text>
//     </TouchableOpacity>
//     </View>

//     );
//   }
// }
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



