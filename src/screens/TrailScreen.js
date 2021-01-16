import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from "@react-native-firebase/auth"


export function TrailScreen() {

    const {containerStyle,txtInput} = styles;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [trails, setTrails] = useState([]); // Initial empty array of trails
    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log('This first use effect ')
        const user = firebase.auth().currentUser;

        if (user) {
        console.log('User email: ', user.email);
        }
        const subscriber = firestore()
          .collection('Trails')
          .onSnapshot(querySnapshot => {
            const trails = [];
            
            // querySnapshot.forEach(documentSnapshot => {
            //   trails.push({
            //     ...documentSnapshot.data(),
            //     key: documentSnapshot.id,
            //   });
            // //   console.log("test", documentSnapshot)
              
            // });
            
            setTrails(trails);
            setLoading(false);
          });

        //   const subscriber2 = firestore()
        //   .collection('Users')
        //   .onSnapshot(querySnapshot => {
        //     const users = [];
      
        //     querySnapshot.forEach(documentSnapshot => {
              
        //         users.push({
        //         ...documentSnapshot.data(),
        //         key: documentSnapshot.id,
        //       });
        //     //   console.log("test", documentSnapshot)
        //     console.log('user data: ', documentSnapshot.data())
        //     });
            
        //     setUsers(users);
        //     setLoading(false);
        //   });
          
        // Unsubscribe from events when no longer in use
        return () => {subscriber()};
      }, []);
  
    if (loading) {
      return <ActivityIndicator />;
    }




    return (
        <ScrollView>
             <FlatList
                data={trails}
                renderItem={({ item }) => (
                    <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>User ID: {item.info}</Text>
                    <Text>User Name: {item.name}</Text>
                   
                    </View>
                )}
            />



            <View style={containerStyle}>
                <Text>Welcome to trail screen :-)</Text>
            </View>
            <View style={containerStyle}>
                <Text>Welcome to trail2 screen :-)</Text>
            </View>
            <View style={containerStyle}>
                <Text>Welcome to trail3 screen :-)</Text>
            </View>
        </ScrollView>
      
      
    );
  }




  const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 0,
        borderRadius: 10,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 2},
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
      },
    txtInput: {
        height: 50,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 5,
    }
})