import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from "@react-native-firebase/auth"
import storage from '@react-native-firebase/storage';
import {Card} from '../components/Card'
export function TrailScreen() {

    const {containerStyle,txtInput} = styles;
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [trails, setTrails] = useState([]); // Initial empty array of trails
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log('This first use effect ')
        const user = firebase.auth().currentUser;
        
        
        if (user) {
        // console.log('User email: ', user.email);
        }
        const subscriber = firestore()
          .collection('Trails')
          .onSnapshot(querySnapshot => {
            const trails = [];
            querySnapshot.forEach(async documentSnapshot => {
              trails.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,

              });
               console.log("trails test", trails)
              
            });

            
            setTrails(trails);
            setLoading(false);
          });
        return () => {subscriber()};
      }, []);
  
    if (loading) {
      return <ActivityIndicator />;
    }

    return (

        <View>
   
           <Text style={{textAlign: 'center', fontSize: 18}}>מסלולים</Text>
             <FlatList
                data={trails}
                renderItem={({ item }) => ( 
                  <Card>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source = {{uri: item.imageUri}}
                    style = {{ width: '90%', height: 200}}
                    />   
                    <Text> {item.name}</Text>
                    <Text style={{}}>פרטי השביל: {item.info} </Text>
                    </View>
                    </Card>
                )}
            />
      <View><Text style={{marginBottom: 5}}></Text></View>
        </View>    
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