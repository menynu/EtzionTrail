import React from "react";
import { Text, Image, View, TouchableOpacity} from "react-native";
import Modal from "react-native-modal";

const infoModal = (props) => {

  return (
    <Modal
      isVisible
      transparent
      onBackButtonPress={() => this.setState({ infoModal: null })}
      onBackdropPress={() => this.setState({ infoModal: null })}
    >

      <View style={styles.modalView}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("UploadScreen", {
            marker: this.state.marker,
            email: this.state.userEmail
          }), this.setState({ infoModal: null });
        }
        }>
          <Text> this is infomodal</Text>
        </TouchableOpacity>

        <Image source={{ uri: this.state.markerUrl }} //{{uri: marker.imageUri}}
               style={{ width: "90%", height: 200, justifyContent: "center", flex: 1 }}
        />
      </View>
    </Modal>
  );
};


export default infoModal;