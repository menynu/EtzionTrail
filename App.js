/* eslint-disable no-mixed-spaces-and-tabs */
import * as React from 'react';
import {SplashScreen, SignInScreen, ProfileScreen, RegisterScreen, HomeScreen , Registration, TrailScreen} from './src/screens'
// import {AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AuthContext} from './src/utils/Context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';


// const Stack = createStackNavigator();
const StackAuth = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="SignIn">
      <StackAuth.Screen name="SignIn" component={SignInScreen} />
      <StackAuth.Screen name="Register" component={Registration} />
    </StackAuth.Navigator>
  );
}
function RootStack() {
	return (
		<NavigationContainer>
			<Tab.Navigator >
		    <Tab.Screen name="HomeScreen" component={HomeScreen} />
				<Tab.Screen name="Profile" component={ProfileScreen} />
				{/* <Tab.Screen name="Registration" component={Registration} /> */}
			</Tab.Navigator>
		</NavigationContainer>
	);
  }



export default function App({ navigation }) {
  // const [userData, setUserData] = React.useState([])



//this test for restart token:
  // const readData = async () => {
  //   try {
  //     const data = await AsyncStorage.getItem('userData')
  //     let _data = JSON.parse(data);
  //     console.log('data === ', _data.email)
  //     console.log('auth is:', auth().currentUser)
  //     if (data !== null) {
  //       setUserData(data)
  //     }
  //   } catch (e) {
  //     alert('Failed to fetch the data from storage')
  //   }
  // }
  // React.useEffect(() => {
  //   // console.log('HEHE')
  //   readData()
  // }, [])
  const [state, dispatch] = React.useReducer(
    
    (prevState, action) => {
      // readData()
      switch (action.type) {
        case 'RESTORE_TOKEN':
          console.log('user token for restore token: ', action.token)
          // console.log('AFTER: ',this.state.userData);
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            
          };
        case 'SIGN_IN':
			if (action.token) {
        AsyncStorage.setItem('userToken',action.token)
        console.log('user token for signed in: ', action.token)
			}
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
      // AsyncStorage.removeItem('userToken')
      AsyncStorage.clear();
      auth().signOut()
      console.log('sign out remove token?: ', action.token)
          return {
            ...prevState,
            isSignout: true,
            userToken: null, 
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
		// In the example, we'll use a dummy token
		console.log("Sign in data:", data);

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{headerShown: false}}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Tab.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <>
            {/* // No token found, user isn't signed in */}
         
            <Tab.Screen
              name="SignIn"
              component={AuthStack}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
               <Tab.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                title: 'Home Screen',
                // When logging out, a pop animation feels intuitive
                
              }}
            />
            <Tab.Screen name="Trails" component={TrailScreen} />
            </>
            
          ) : (
            // User is signed in
            <>
            {console.log('auth context: ', authContext)}
              
              <Tab.Screen name="Profile" component={ProfileScreen} />
              <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                title: 'Home Screen',
                // When logging out, a pop animation feels intuitive
                
              }}
            />  
            <Tab.Screen name="Trails" component={TrailScreen} />
            </>

          )}
        </Tab.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
