import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Card } from "../components/Card";
import PropTypes from "prop-types";

export function TrailScreen({ navigation }) {

  const { containerStyle, txtInput } = styles;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [trails, setTrails] = useState([]); // Initial empty array of trails
  useEffect(() => {
    const subscriber = firestore()
      .collection("Trails").orderBy("name")
      .onSnapshot(querySnapshot => {
        const trails2 = [];
        if (querySnapshot)
          querySnapshot.forEach(documentSnapshot => {
            trails2.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id
            });
            setTrails(trails2);
          });
        setLoading(false);
      });
    return () => {
      subscriber();
    };
  }, []);

  if (loading) {
    return <ActivityIndicator/>;
  }

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textTitle}>מקטעי הגוש</Text>
      <FlatList
        data={trails}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.listView}>
              <Image source={{ uri: item.imageUri }}
                     style={styles.imgTrail}
              />
              <Text style={styles.txtTrailName}> {item.name}</Text>
              <TouchableOpacity onPress={() => navigation.navigate("TrailInfo", { item })}>
                <Text style={styles.txtLink}> לפרטים נוספים</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
      <View><Text style={{ marginBottom: 500 }}></Text></View>
    </View>
  );
}


const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 0,
    borderRadius: 10,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  },
  txtTrailName: {
    fontSize: 18,
    color: "#599c46"
  },
  textTitle: {
    fontSize: 35,
    textAlign: "center",
    color: "#262626",
    shadowColor: "blue",
    borderColor: "blue",
    margin: 10
  },
  txtLink: {
    color: "blue",
    fontSize: 17,
    marginBottom: 5
  },
  txtName: {
    fontSize: 12,
    textAlign: "center"
  },
  imgTrail: {
    width: "90%",
    height: 200,
    resizeMode: "stretch",
    marginTop: 7
  },
  listView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

TrailScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};