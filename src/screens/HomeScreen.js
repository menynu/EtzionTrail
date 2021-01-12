import React, { Component } from 'react';
import {Dimensions, StyleSheet, Button, View, Text, TouchableOpacity} from 'react-native';
import {trail1, trail2, trail3 ,trail4} from '../trails';

import MapView, { PROVIDER_GOOGLE, Geojson} from 'react-native-maps';
// import {AuthContext} from '../utils'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const halfHeight = height / 2;
  const Map = props => (
    <MapView>
      <Geojson 
        geojson={trail2} 
        strokeColor="red"
        fillColor="green"
        strokeWidth={3}
      />
    </MapView>
  );

  //const trail2=trail;

  export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        trail: trail1,
        password: ""
      };
    }
    handleTrail = text => {
      this.setState({ trail: text });
    };
    // handlePassword = text => {
    //   this.setState({ password: text });
    // };


  render() {
    return (
      //<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <View>
    
        <Text>Home Screen</Text>
        <Button
          title="Go to Login"
          onPress={() => this.props.navigation.navigate('LoginScreen')}
        />
        <Button
          title="Go to Registration"
          onPress={() => this.props.navigation.navigate('Registration')}
        />

        <View>
        
    <MapView
        provider={PROVIDER_GOOGLE} 
        style={styles.map}
        mapType={"hybrid"}
        region={{
        latitude: 31.6600768,
        longitude: 35.1102883,
        latitudeDelta: 0.015,
        //longitudeDelta: 0.0121,
        longitudeDelta: 0.1  //set the distance view
        }}
    >
        <Geojson 
        geojson={this.state.trail} 
        strokeColor="red"
        fillColor="green"
        strokeWidth={2}
        />
    </MapView>
    </View>
        <View style={{top:height/2}}>
        <Text> test</Text>
        <TouchableOpacity
          onPress={() => this.handleTrail(trail1)} >
          <Text> Trail1 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleTrail(trail2)} >
          <Text> Trail2 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleTrail(trail3)} >
          <Text> Trail3 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleTrail(trail4)} >
          <Text> Trail4 </Text>
        </TouchableOpacity>
      </View>
      </View>
  
    );
  }
}



const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      position: 'absolute',
      //top: 50,
      bottom: 50,
      width,
      height: height/2
    },
   });