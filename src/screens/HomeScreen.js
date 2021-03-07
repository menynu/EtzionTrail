import React, { Component } from 'react';
import {Dimensions, StyleSheet, View, Text, TouchableOpacity,PermissionsAndroid, Platform, ToastAndroid, Button} from 'react-native';
import {Trail1, Trail2, Trail3 ,Trail4, area} from '../trails';
import haversine from "haversine";
// import geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Geojson, Marker, AnimatedRegion, Polyline} from 'react-native-maps';
// import {AuthContext} from '../utils'

// const width = Dimensions.get('window').width
// const height = Dimensions.get('window').height

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 31.6600768;
const LONGITUDE = 35.1102883;
export class HomeScreen extends Component {
  
constructor(props) {
  super(props);
  console.log('props: ', props)

  this.state = {
    hackHeight: height,
    Trail: Trail1, //represent the Trail json
    latitude: 31.6600768,
    longitude: 35.1102883,
    routeCoordinates: [],
    distanceTravelled: 0,
    flex: 0,
    mapMargin:1,
    prevLatLng: {},
    initialRegion:{
      latitude: 31.6600768,
      longitude: 35.1102883,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.009
      // longitudeDelta: Dimensions.get('window').width / Dimensions.get('window')
    },
    marginBottom: 0,
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0
    })
  };


  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      setTimeout( () => {
        this.state.mapMargin = 0;
        this.setState({mapMargin: 0})
      }, 100);
    }
    setTimeout(()=>this.forceUpdate() , 500);
    setTimeout( () => this.setState({ hackHeight: height+1}), 500);
    setTimeout( () => this.setState({ hackHeight: height}), 1000);
    this.handleUserLocation();
    setTimeout( () =>this.setState({marginBottom: 1}), 100)
    this.watchID = Geolocation.watchPosition(
      position => {
        const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
        const { latitude, longitude } = position.coords;
  
        const newCoordinate = {
          latitude,
          longitude
        };
        
            coordinate.timing(newCoordinate).start();
          
          this.setState({
            latitude,
            longitude,
            routeCoordinates: routeCoordinates.concat([newCoordinate]),
            distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
            prevLatLng: newCoordinate
          });
        },
        error => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  componentWillUnmount() {
   
    Geolocation.clearWatch(this.watchID);
  }

  componentWillmount() {
   
    this.state.mapMargin = 1;
    this.setState({mapMargin: 1})
  }

  setMargin = () => { this.setState({mapMargin:1}) }

  handleUserLocation =() =>{
    // alert("executed")
    Geolocation.getCurrentPosition(pos => {
      // alert("Executed")
      // alert(JSON.stringify(pos)) // <<~ works 
      this.map.animateToRegion({
        ...this.state.initialRegion,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })
      this.setState({
        ...this.state.initialRegion,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })
    },
    err => {
      console.log(err);
      alert("Something went wrong! please select location manually")
    },
    // { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 },
    )
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

 

  _onMapReady = () => (this.setState({marginBottom: 0.5}), console.log("GOT HERE MAP READY"))

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  onChangeValue = initialRegion => {
    ToastAndroid.show(JSON.stringify(initialRegion), ToastAndroid.SHORT)
    this.setState({
      initialRegion
    })
  };

  handleTrail = text => {
    this.setState({ Trail: text });
  };

  gotToMyLocation(){
    console.log('gotToMyLocation is called')
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log("curent location: ", coords)
        console.log(this.map);
        if (this.map) {
          console.log("curent location: ", coords)
          this.map.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          })
        }
      },
      (error) => alert('Error: Are location services on?'),
      { enableHighAccuracy: true }
    )
  }

render() {
  return (
    
      <View style={{paddingBottom: this.state.paddingBottom }}>
  
      {/* <Text>Home Screen</Text> */}
    

     
      
      <MapView
      // provider={PROVIDER_GOOGLE} 
      // style={styles.map}
      style={{
        // ...StyleSheet.absoluteFillObject,
      position: 'absolute',
      top: 0,
      bottom: 70,
      width,
      height: height-150,
      flex: 1,
      marginBottom: this.state.marginBottom
      }}
      onMapReady={() => {
        this.setMargin
        this._onMapReady
        
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ).then(granted => {
          // alert(granted) // just to ensure that permissions were granted
        });
      }}
      // style= {{flex:1 , marginBottom:this.state.marginBottom,...StyleSheet.absoluteFillObject,}}
      mapType={"hybrid"}
      showsScale={true}
      showsPointsOfInterest={false}
      showsBuildings={true}
      showsUserLocation ={true}
      showsCompass = {true}
      rotateEnabled
      // showMyLocationButton = {true}
      followsUserLocation={true}
      // onRegionChange={this.onRegionChange.bind(this)}
      showsMyLocationButton = {true}
      initialRegion = {this.state.initialRegion}
      loadingEnabled
      // onMapReady={this._onMapReady}
      // onMapReady={() => this.setState({ bottomMargin: 0 })}
      
      onRegionChangeComplete = {this.onChangeValue, this._onMapReady}
      // region={this.getMapRegion()}
      ref = {ref => this.map =ref}
      // region={{
      // latitude: this.state.latitude,
      // longitude: this.state.longitude,
      // latitudeDelta: 0.015,
      // //longitudeDelta: 0.0121,
      // longitudeDelta: 0.1  //set the distance view
      // }}
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
      <Marker
        // coordinate={{ 
        //               "latitude": this.state.latitude,   
        //              "longitude": this.state.latitude 
        //             }}
        coordinate={this.getMapRegion()}
        title={"Your Location"}
        draggable />
        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
        <Marker.Animated
          ref={marker => {
            this.marker = marker;
          }}
          coordinate={this.state.coordinate}
        >
          
        </Marker.Animated>


  </MapView>
 
      <View style={{top:height-150}}>
      {/* <Button title={'click me'}
      onPress={() => {
        this.handleUserLocation
      }}
      
      > click me</Button> */}
      <TouchableOpacity
        onPress={() => {this.handleTrail(Trail1) , this.setState({latitude: 31.6600768 }) , this.setState({longitude: 35.1102883})} } >
        <Text> מסלול 1 </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {this.handleTrail(Trail2)
          this.setState({latitude: 31.6601686})
          this.setState({longitude: 35.1094347})
          }} >
        <Text> מסלול 2 </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.gotToMyLocation.bind(this)} style={[ {
          width: 60, height: 60,
          position: "absolute", bottom: 20, right: 20, borderRadius: 30, backgroundColor: "#d2d2d2"
        }]}>
          <Text>CLICK ME</Text>
        </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {this.handleTrail(Trail3), this.setState({latitude: 31.5988057 }) , this.setState({longitude: 35.2161671})}} >
        <Text> מסלול 3 </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {this.handleTrail(Trail4)
          this.setState({latitude: 31.606510558676})
          this.setState({longitude: 35.219570128242})
        }}>
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
      height: height-150,
      flex:1,
      marginBottom:1
    },
   });