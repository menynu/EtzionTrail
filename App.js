/* eslint-disable react/display-name */
/* eslint-disable no-mixed-spaces-and-tabs */
import * as React from "react";
import {
  SplashScreen,
  SignInScreen,
  ProfileScreen,
  HomeScreen,
  Registration,
  TrailScreen,
  UploadScreen,
  TrailInfo,
  LocationAlert
} from "./src/screens";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./src/utils/Context";


import auth from "@react-native-firebase/auth";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const StackAuth = createStackNavigator();
const StackMap = createStackNavigator();
const StackTrails = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="SignIn">
      <StackAuth.Screen name="SignIn" component={SignInScreen} 
        options={{headerShown: false}}
      />
      <StackAuth.Screen name="Register" component={Registration}
          options={{
            title: 'הרשמה',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              alignSelf: 'center',
              marginRight: 40
            }}}
      />
    </StackAuth.Navigator>
  );
}

function TrailStack() {
  return (
    <StackTrails.Navigator initialRouteName="SignIn">
      <StackTrails.Screen name="Trail" component={TrailScreen} options={{
        headerShown: false
      }}/>
      <StackTrails.Screen name="TrailInfo" component={TrailInfo} options={{
        headerShown: false
      }}/>
      <StackTrails.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false
        }}/>
    </StackTrails.Navigator>
  );
}

export function MapStack() {
  return (
    <StackMap.Navigator>
      <StackMap.Screen
        name="Alert"
        component={LocationAlert}
        options={{
          headerShown: false
        }}/>
      <StackMap.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false
        }}/>
      <StackMap.Screen
        name="UploadScreen"
        component={UploadScreen}
        options={{
          headerShown: false
        }}/>
    </StackMap.Navigator>
  );

}

export default function App({ navigation }) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      // readData()
      switch (action.type) {
        case "RESTORE_TOKEN":
          console.log("user token for restore token: ", action.token);
          // console.log('AFTER: ',this.state.userData);
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false

          };
        case "SIGN_IN":
          if (action.token) {
            AsyncStorage.setItem("userToken", action.token);
            console.log("user token for signed in: ", action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token
          };
        case "SIGN_OUT":
          // AsyncStorage.removeItem('userToken')
          AsyncStorage.clear();
          auth().signOut();
          console.log("sign out remove token?: ", action.token);
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
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
        AsyncStorage.getItem("userName", (err, result) => {
          console.log("user data is: ", result);
        });
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarVisible: false }}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <StackMap.Screen
              name="Splash"
              component={SplashScreen}
              
              screenOptions={{
                headerShown: false,
                tabBarVisible: false
              }}/>
          ) : state.userToken == null ? (
            <>
              {/* // No token found, user isn't signed in */}

              <Tab.Screen
                name="SignIn"
                component={AuthStack}
                options={{
                  title: "כניסה",
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                  // tabBarLabel: 'Profile',
                  tabBarIcon: ({ color }) => (
                    <Icon name="ios-home" color={color} size={26}/>)
                }}
              />
              <Tab.Screen
                name="HomeScreen"
                component={MapStack}
                options={{
                  title: "מפה",
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                  // tabBarLabel: 'Profile',
                  tabBarIcon: ({ color }) => (
                    <Icon name="earth" color={color} size={26}/>)
                }}
              />
              <Tab.Screen name="Trails" component={TrailStack}
                          options={{
                            title: "שבילים",
                            // When logging out, a pop animation feels intuitive
                            animationTypeForReplace: state.isSignout ? "pop" : "push",
                            // tabBarLabel: 'Profile',
                            tabBarIcon: ({ color }) => (
                              <Icon name="map" color={color} size={26}/>)
                          }}/>
            </>

          ) : (
            // User is signed in
            <>
              {console.log("auth context: ", authContext)}


              <Tab.Screen
                name="HomeScreen"
                component={MapStack}
                options={{
                  title: "מפה",
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                  // tabBarLabel: 'Profile',
                  tabBarIcon: ({ color }) => (
                    <Icon name="earth" color={color} size={26}/>)
                }}
              />
              <Tab.Screen name="Trails" component={TrailStack}
                          options={{
                            title: "שבילים",
                            // When logging out, a pop animation feels intuitive
                            animationTypeForReplace: state.isSignout ? "pop" : "push",
                            // tabBarLabel: 'Profile',
                            tabBarIcon: ({ color }) => (
                              <Icon name="map" color={color} size={26}/>)
                            }}
              />
              <Tab.Screen name="Profile" component={ProfileScreen}
                          options={{
                            title: "פרופיל",
                            // When logging out, a pop animation feels intuitive
                            animationTypeForReplace: state.isSignout ? "pop" : "push",
                            // tabBarLabel: 'Profile',
                            tabBarIcon: ({ color }) => (
                              <Icon name="settings" color={color} size={26}/>)
                          }}
              />
                          
            </>

          )}
        </Tab.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
