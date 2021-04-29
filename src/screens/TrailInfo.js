/* eslint react/prop-types: 0 */
import * as React from 'react';
import {View, Image, Text, StyleSheet, Button, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Edit from '../components/EditData'
import { ScrollView } from 'react-native-gesture-handler';
export function TrailInfo({route, navigation}) {
    const {name, info, key, imageUri, track, gallery} = route.params.item;
    const [admin, setAdmin] = React.useState(false)

      AsyncStorage.getItem('Admin', (err, result) => {
      console.log('is admin on?: ',result);
      if (result)
      {
        setAdmin(result)  
        console.log('only for admin: ', admin)
      }
      })

      const handlePress =() =>{
        console.log('theres a press')
         
      }

    return(
        <>
       {/* <editData/> */}
        <ScrollView>
            <View>
                {admin && <Edit 
                        onPressFunction={handlePress}
                        title={"ערוך מידע"}
                        style={{margin: 10}}
                        color={'red'}
                        trailCollection={key}
                        />}
                <Text style={{fontSize:30}}> {name}</Text>
                <View >
                    <Image source={{uri: imageUri}} style={{width: '100%', height: 200}} />
                    <Text style={{fontSize: 19, margin: 10}}>{info}</Text>
                    {console.log('cords: ', track)}
                    {gallery && <Text style={{color: 'blue'}}
                       onPress={() => Linking.openURL(gallery)}>
                        לגלריה ותמונות נוספות
                   </Text>}
                    <Button title="test" onPress={()=> navigation.navigate('HomeScreen', {coords: track})}/>
                </View>
            </View>
        </ScrollView>
       </>
    )
}