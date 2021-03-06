import React from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
/*
    Edit trail info data by admin user 
*/

const Edit = (props) => {
  const [editable, setEditable] = React.useState(false);
  const trailRef = firestore().collection("Trails");
  const [trailInfo, setTrailInfo] = React.useState(null);
  const [link, setLink] = React.useState(null);

  const pressed = async () => {
    setEditable(true);
    if (editable)
      setEditable(false);
            
    const myTrail = trailRef.doc(props.trailCollection);
    const doc = await myTrail.get(); // think to remove .get() for real time updates
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      console.log("Document data:", doc.data());
      setTrailInfo(doc.data().info);
      setLink(doc.data().gallery);
    }
  };
  const updateInfo = async () => {
    console.log("got here #1");
    const trailDoc = await trailRef.doc(props.trailCollection);

    if (trailDoc) {
      Alert.alert(
        "הנך עומד לערוך מידע",
        "האם אתה בטוח?",
        [
          { text: "כן", onPress: () => trailDoc.update({ info: trailInfo, gallery: link }).then(setEditable(false)) },
          { text: "לא", onPress: () => console.log("No item was removed"), style: "cancel" }
        ],
        {
          cancelable: true
        }
      );

    }

  };
  return (
    <>
        <TouchableOpacity onPress={pressed}>
        <View style={{alignContent: 'center', alignItems: 'center'}}>
        <MaterialIcons name="edit" size={35} color="red"/>

        </View>
        </TouchableOpacity>

      {editable && <View>
        <Text style={styles.text}> עריכת מידע עבור המקטע:</Text>
        <TextInput
          backgroundColor={"#f7f7f7"}
          multiline={true}
          numberOfLines={1}
          fontSize={20}
          placeholder={"עריכת מידע עבור המקטע"}
          value={trailInfo}
          onChangeText={setTrailInfo}
          color = '#333'
          placeholderTextColor = "#666"
        />
        <Text style={styles.text}> הוספת לינק לגלריית תמונות:</Text>
        <TextInput
          backgroundColor={"#f7f7f7"}
          multiline={true}
          numberOfLines={1}
          fontSize={20}
          placeholder={"לינק לגלריית תמונות"}
          value={link}
          onChangeText={setLink}
          color = '#333'
          placeholderTextColor = "#666"
        />
        <TouchableOpacity
          style={{ borderColor: "black", backgroundColor: "lightgreen", borderWidth: 1 }}
          onPress={updateInfo}>
          <Text style={{ fontSize: 20, color: "red" }}> לחץ לעדכון </Text>
        </TouchableOpacity>
      </View>
      }
      {/* // <View>
        //     <Text>Test</Text>
        // </View> */}

    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "red",
    fontSize: 20,
    margin: 10,
    textAlign: "center"
  },
});
export default Edit;
