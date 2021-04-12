import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput
} from 'react-native';
import {
    // launchCamera,
    launchImageLibrary
  } from 'react-native-image-picker';
// import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';

export const refContext = React.createContext()

export function UploadScreen({route, navigation: { goBack, pop }}) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userEmail,setUserEmail] = useState(null)
    const[imageURI, setImageURI] = useState(null)
    const[markerID, setMarkerID] = useState(null)  // in order to get marker ID
    const[markerTitle, setMarkerTitle] = useState(null)
    const[markerInfo, setMarkerInfo] = useState(null)
    
    const markerRef = firestore().collection('Markers');
    const {marker, email} = route.params;

    AsyncStorage.getItem('userData', (err, result) => {
        let mail = JSON.parse(result)
        // this.setState({userMail: userEmail.email})
        setUserEmail(mail.email)
        console.log(userEmail)
    })

    const selectImage = () => {
        const options = {
          maxWidth: 2000,
          maxHeight: 2000,
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }
        };
       launchImageLibrary(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };
            console.log(source);
            setImage(source);
          }
        });
      };



      const uploadImage = async () => {
        const { uri } = image;
        console.log('THE URI:', uri) //uri stands for the image location on device
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        
        console.log('file name is: ', filename)
        setUploading(true);
        setTransferred(0);
        const task = storage()
          .ref(filename)
          .putFile(uri)
           
        // set progress state
        task.on('state_changed', snapshot => {
          setTransferred(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
          if (snapshot.state === "success"){
              console.log('success!!');           
          }       
        });
        try {
          await task;
        } catch (e) {
          console.error(e);
        }
        const uriRef =  storage().ref(filename)
        const url = await uriRef.getDownloadURL();
        console.log('uri: ', url);
        setImageURI(url)
        setUploading(false);
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!'
        );
        setImage(null);
      };
      

      const _addMarker =() =>{
        markerRef.add({
          longitude: marker.longitude,
          latitude: marker.latitude,
          email: email,
          imageUri: imageURI,
          title: markerTitle,
          info: markerInfo,
          approved: false
          
        })
        .then((snapshot) =>{ //get marker doc ID from firestore
            console.log('snapshot: ', snapshot)
            setMarkerID(snapshot.id)
        })
        .then(alert('הוספת נקודת עניין חדשה בהצלחה'))
        .then(pop()) //remove from stack and return back
        
    
      };

      return (
        <ScrollView> 
        <SafeAreaView style={styles.container}>
            
          <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {image !== null ? (
              <Image source={{ uri: image.uri }} style={styles.imageBox} />
            ) : null}
            {uploading ? (
              <View style={styles.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                <Text style={styles.buttonText}>Upload image</Text>
              </TouchableOpacity>
            )}
            <Text>
                this is {marker.latitude}
            </Text>
            <TextInput
                style={styles.textInput}
                backgroundColor={'#f7f7f7'}
                multiline={true}
                numberOfLines={2}
                fontSize={10}
                placeholder={'כותרת'}
                value={markerTitle}
                onChangeText={setMarkerTitle}
            />
            <TextInput
                style={styles.textInput}
                backgroundColor={'#f7f7f7'}
                multiline={true}
                numberOfLines={4}
                fontSize={10}
                placeholder={'מידע נוסף'}
                value={markerInfo}
                onChangeText={setMarkerInfo}
            />
                            

            <TouchableOpacity 
                style = {{borderColor: 'black', backgroundColor: 'lightgreen', borderWidth: 1}}      
                onPress={() =>_addMarker()}>
                <Text style={{fontSize: 20, color: 'red'}}>לחץ כדי להוסיף נק' עניין</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style = {{borderColor: 'black', backgroundColor: 'red', alignItems: 'center', borderWidth: 1, marginTop: 4, width: 100}}      
                onPress={() =>pop()}>
                <Text style={{fontSize: 20, color: 'black'}}>ביטול</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        </ScrollView>
      );
    }
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#bbded6'
        },
        selectButton: {
          borderRadius: 5,
          width: 150,
          height: 50,
          backgroundColor: '#8ac6d1',
          alignItems: 'center',
          justifyContent: 'center'
        },
        uploadButton: {
          borderRadius: 5,
          width: 150,
          height: 50,
          backgroundColor: '#ffb6b9',
          alignItems: 'center',
          justifyContent: 'center',
        //   marginTop: 20
        },
        buttonText: {
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold'
        },
        imageContainer: {
          marginTop: 30,
          marginBottom: 50,
          alignItems: 'center'
        },
        progressBarContainer: {
          marginTop: 20
        },
        imageBox: {
          width: 300,
          height: 300
        },
        textInput: {
            // height: 40,
            margin: 12,
            borderWidth: 1,
            width: 200
        }
      });