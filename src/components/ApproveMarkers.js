import React from "react";
import { Text, View, StyleSheet, Pressable, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Card } from "./Card";

const ApproveMarkers = (props) => {
  const [editable, setEditable] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const markerRef = firestore().collection("Markers");
  const [markers, setMarkers] = React.useState([]);
  const pressed = async () => {
    setEditable(true);
    if (editable) {
      setEditable(false);
      return;
    }

    markerRef
      .onSnapshot(querySnapshot => {
        const markers = [];
        if (querySnapshot)
          querySnapshot.forEach(async documentSnapshot => {
            let docref = documentSnapshot.data();
            if (docref.approved === false) //check for pending markers
              markers.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id

              });

          });
        setMarkers(markers);
        // setLoading(false);
      });

    console.log("one shot? : ", markers);
  };
  const Approve = async (marker) => {
    console.log("marker id: ", marker.key);
    const myMarker = await markerRef.doc(marker.key).get();
    let updateMarker = markerRef.doc(marker.key);
    if (myMarker) {
      console.log("MARKER???");
      console.log("Document data:", myMarker.data());
      // setTrailInfo(doc.data().info)
      updateMarker.update({ approved: true }).then(alert("Approved"));
    }

  };
  const deleteMarker = async (marker) => {
    console.log("marker id: ", marker.key);
    let updateMarker = markerRef.doc(marker.key);
    Alert.alert(
      "הנך עומד למחוק מידע",
      "האם אתה בטוח?",
      [
        { text: "מחק", onPress: async () => await updateMarker.delete() },
        { text: "בטל", onPress: () => console.log("No item was removed"), style: "cancel" }
      ],
      {
        cancelable: true
      }
    );

  };

  return (
    <>
      <Pressable
        onPress={pressed}
        // item= {props.trailCollection}
        hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#dddddd" : props.color },
          styles.button,
          { ...props.style }
        ]}
      >
        <Text style={{ color: "red", fontSize: 15, alignContent: "center" }}> לחץ להוספה\עדכון נק עניין</Text>
      </Pressable>
      {editable && <View>
        <Text>Test </Text>
        <ScrollView style={{ height: 400 }}>
          {
            markers.map((item, index) => (

              <View key={item.key}>
                <Card>

                  <Text
                    key={item.key}
                  >
                    <Text style={styles.text}>
                      {item.title} {item.key}
                    </Text>
                    {item.imageUri && <Image source={{ uri: item.imageUri }} style={{ height: 100, width: 200 }}/>}
                    <Text> {item.info} </Text>
                  </Text>
                  <TouchableOpacity onPress={() => Approve(item)}>
                    <Text> לאשר</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteMarker(item)}>
                    <Text> מחק</Text>
                  </TouchableOpacity>

                </Card>
                {showInfo && <View style={{ marginTop: 20 }} key={item.key}>
                  <Text>
                    welcome {item.title}
                  </Text>
                </View>}
              </View>
            ))
          }
        </ScrollView>


      </View>
      }
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
  button: {
    width: 150,
    height: 50,
    alignItems: "center"
  }
});
export default ApproveMarkers;
