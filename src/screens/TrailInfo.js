/* eslint react/prop-types: 0 */
import * as React from "react";
import { View, Image, Text, StyleSheet, Button, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Edit from "../components/EditData";
import { ScrollView } from "react-native-gesture-handler";

export function TrailInfo({ route, navigation }) {
  const { name, info, key, imageUri, track, gallery } = route.params.item;
  const [admin, setAdmin] = React.useState(false);
  AsyncStorage.getItem("Admin", (err, result) => {
    console.log("is admin on?: ", result);
    if (result) {
      setAdmin(result);
      console.log("only for admin: ", admin);
    }
  });

  const handlePress = () => {
    console.log("theres a press");

  };

  return (
    <>
      <ScrollView>
        <View>
          {admin && <Edit
            onPressFunction={handlePress}
            style={{ margin: 10 }}
            color={"white"}
            trailCollection={key}
          />}
          <Text style={styles.textTitle}> {name}</Text>
          <View>
            <Image source={{ uri: imageUri }} style={styles.image}/>
            <Text style={styles.textInfo}>{info}</Text>
            {console.log("cords: ", track)}
            {gallery && <Text style={styles.linkGallery}
                              onPress={() => Linking.openURL(gallery)}>
              לגלריה ותמונות נוספות
            </Text>}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  textTitle: {
    fontSize: 35,
    textAlign: "center",
    color: "#262626",
    shadowColor: "blue",
    borderColor: "blue",
    margin: 10
  },
  textInfo: {
    fontSize: 19,
    margin: 10,
    marginRight: 10,
    color: "#262626",
    textAlign: "right"
  },
  linkGallery: {
    color: "blue",
    textAlign: "center",
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10
  },
  button: {
    padding: 10,
    margin: 15,
    alignItems: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#537cdb"
  },
  image: {
    height: 280,
    width: "100%",
    resizeMode: "stretch"
  }

});
