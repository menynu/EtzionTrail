import React from 'react';
import {Text, TextInput, View, StyleSheet, Pressable, TouchableOpacity, Alert} from 'react-native'
import Modal from 'react-native-modal'

const infoModal = (props) => {

    return(
        <Modal
         isVisible
         transparent
         onBackButtonPress={() => this.setState({ infoModal: null })}
         onBackdropPress={() => this.setState({ infoModal: null })}
        //  style={{flex: 1, justifyContent: 'flex-end', width: '100%',}}
        >
          
          <View style={styles.modalView}>
        {/* this.props.navigation.navigate - in order to work under class */}
         <TouchableOpacity onPress={() => {this.props.navigation.navigate('UploadScreen', {
           marker: this.state.marker,
           email: this.state.userEmail,
         }), this.setState({ infoModal: null })}
         }> 
            <Text> this is infomodal</Text>
          </TouchableOpacity>
          
          <Image source = {{uri:this.state.markerUrl}} //{{uri: marker.imageUri}}
                style = {{ width: '90%', height: 200, justifyContent: 'center', flex: 1,}}
              />        
          </View>
        </Modal>
      )
}

// infoModal(marker){
//     const {infoModal} = this.state;
//     if (!infoModal) return null;     
  
//   }

export default infoModal