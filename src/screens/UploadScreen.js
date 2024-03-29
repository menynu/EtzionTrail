/* global require */
import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput
} from "react-native";
import {
  launchImageLibrary
} from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import firestore from "@react-native-firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";

export const refContext = React.createContext();

export function UploadScreen({ route, navigation: { goBack, pop } }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  const [markerTitle, setMarkerTitle] = useState(null);
  const [markerInfo, setMarkerInfo] = useState(null);
  const [value, setValue] = React.useState("marker");
  const markerRef = firestore().collection("Markers");
  const { marker, email } = route.params;


  AsyncStorage.getItem("userData", (err, result) => {
    let mail = JSON.parse(result);
    setUserEmail(mail.email);
    console.log(userEmail);
  });

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(source);
        setImage(source);
      }
    });
  };

  const _addMarker = async () => {
    if (!markerInfo) {
      alert("יש לתת תיאור לנקודת עניין");
      return;
    }
    if (!image) {
      await markerRef.add({
        longitude: marker.longitude,
        latitude: marker.latitude,
        email: email,
        // imageUri: url,
        title: markerTitle,
        info: markerInfo,
        approved: false,
        img: value
      });
      Alert.alert("הוספת נקודת עניין חדשה בהצלחה");
      pop();
      return;
    }
    const { uri } = image;
    // console.log("THE URI:", uri); //uri stands for the image location on device
    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    console.log("file name is: ", filename);
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uri);

    // set progress state
    task.on("state_changed", snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
      if (snapshot.state === "success") {
        console.log("success!!");
      }
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    const uriRef = storage().ref(filename);
    const url = await uriRef.getDownloadURL();
    console.log("uri: ", url);
    setImageURI(url);
    setUploading(false);
    setImage(null);
    await markerRef.add({
      longitude: marker.longitude,
      latitude: marker.latitude,
      email: email,
      imageUri: url,
      title: markerTitle,
      info: markerInfo,
      approved: false,
      img: value
    });

    alert("הוספת נקודת עניין חדשה בהצלחה");
    pop(); //remove from stack and return back
  };


  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
          <Text style={styles.buttonText}>בחר\י תמונה</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {image !== null ? (
            <Image source={{ uri: image.uri }} style={styles.imageBox}/>
          ) : null}
          {uploading ? (
            <View style={styles.progressBarContainer}>
              <Progress.Bar progress={transferred} width={300}/>
            </View>
          ) : null}
          <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
            <View style={{ flexDirection: "row", fontSize: 10, margin: 10 }}>
              <Text>סימון רגיל</Text>
              <Image source={require("../assets/marker.png")} style={styles.marker}/>
              <RadioButton value="marker"/>
              <Text>מידע</Text>
              <Image source={require("../assets/info.png")} style={styles.marker}/>
              <RadioButton value="info"/>
              <Text>אזהרה</Text>
              <Image source={require("../assets/alert.png")} style={styles.marker}/>
              <RadioButton value="alert"/>
            </View>
          </RadioButton.Group>
          {/* </View> */}

          <TextInput
            style={styles.textInput}
            backgroundColor={"#f7f7f7"}
            multiline={true}
            numberOfLines={2}
            fontSize={10}
            placeholder={"כותרת"}
            value={markerTitle}
            onChangeText={setMarkerTitle}
            color = '#333'
            placeholderTextColor = "#666"
          />
          <TextInput
            style={styles.textInput}
            backgroundColor={"#f7f7f7"}
            multiline={true}
            numberOfLines={4}
            fontSize={10}
            placeholder={"מידע נוסף"}
            value={markerInfo}
            onChangeText={setMarkerInfo}
            color = '#333'
            placeholderTextColor = "#666"
          />


          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => _addMarker()}>
            <Text style={styles.txtApprove}> הוספת נק' עניין חדשה</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => pop()}>
            <Text style={{ fontSize: 20, color: "black" }}>ביטול</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#bbded6",
    justifyContent: "center"
  },
  marker: {
    width: 32,
    height: 32
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "#8ac6d1",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginLeft: 90
  },
  txtApprove: {
    fontSize: 20,
    color: "red",
    textAlign: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 5
  },
  approveBtn: {
    borderColor: "black",
    backgroundColor: "lightgreen",
    borderWidth: 1,
    width: "80%",
    textAlign: "center"
  },
  cancelBtn: {
    borderColor: "black",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 8,
    width: "60%"
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: "center"
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300,
    resizeMode: "stretch"
  },
  textInput: {
    // height: 40,
    margin: 12,
    borderWidth: 1,
    width: "80%",
    fontSize: 17
  }
});