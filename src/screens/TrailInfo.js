/* eslint react/prop-types: 0 */
import * as React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Edit from '../components/EditData'
import { ScrollView } from 'react-native-gesture-handler';
export function TrailInfo({route, navigation: { goBack, pop }}) {
    const {name, info, key, imageUri} = route.params.item;
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

//TODO: 
    return(
        <>
       {/* <editData/> */}
        <ScrollView>
            <View>
                {admin && <Edit 
                        onPressFunction={handlePress}
                        title={"edit"}
                        style={{margin: 10}}
                        color={'green'}
                        trailCollection={key}
                        />}
                <Text style={{fontSize:30}}> {name}</Text>
                <View >
                    <Image source={{uri: imageUri}} style={{width: '100%', height: 200}} />
                    <Text>{info}</Text>
                </View>
            </View>
        </ScrollView>
       </>
    )
}