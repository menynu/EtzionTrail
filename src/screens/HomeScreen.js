import React, { Component } from 'react';
import {Dimensions, StyleSheet, Button, View, Text, TouchableOpacity} from 'react-native';
import {Trail1, Trail2, Trail3 ,Trail4, area} from '../trails';

import MapView, { PROVIDER_GOOGLE, Geojson, Polygon} from 'react-native-maps';
// import {AuthContext} from '../utils'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const halfHeight = height / 2;
  const Map = props => (
    <MapView>
      <Geojson 
        geojson={Trail2} 
        strokeColor="red"
        fillColor="green"
        strokeWidth={3}
      />
    </MapView>
  );


  export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Trail: Trail1,
        password: "",
        _latitude: 31.6600768,
        _longitude: 35.1102883,

      };
    }


    handleTrail = text => {
      this.setState({ Trail: text });
    };
  
  render() {
    return (
     
       <View>
    
        {/* <Text>Home Screen</Text> */}
     

        <View>
        
    <MapView
        provider={PROVIDER_GOOGLE} 
        style={styles.map}
        mapType={"hybrid"}
        showUserLocation
        followUserLocation
        region={{
        latitude: this.state._latitude,
        longitude: this.state._longitude,
        latitudeDelta: 0.015,
        //longitudeDelta: 0.0121,
        longitudeDelta: 0.1  //set the distance view
        }}
    >
        <Geojson 
        geojson={this.state.Trail} 
        strokeColor="red"
        fillColor="green"
        strokeWidth={2}
        />
          <Geojson 
        geojson={area} 
        strokeColor="red"
        fillColor= "#4d1427a5"
        strokeWidth={1}
        />
    </MapView>
    </View>
        <View style={{top:height-150}}>
       
        <TouchableOpacity
          onPress={() => {this.handleTrail(Trail1) , this.setState({_latitude: 31.6600768 }) , this.setState({longitude: 35.1102883})} } >
          <Text> מסלול 1 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {this.handleTrail(Trail2)
           this.state._latitude= 31.6601686
            this.state._longitude= 35.1094347}} >
          <Text> מסלול 2 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {this.handleTrail(Trail3), this.setState({_latitude: 31.5988057 }) , this.setState({longitude: 35.2161671})}} >
          <Text> מסלול 3 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {this.handleTrail(Trail4), this.state._latitude= 31.606510558676, this.state._longitude= 35.219570128242 } }>
          <Text> מסלול 4 </Text>
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
      bottom: 70,
      width,
      height: height-150
    },
   });