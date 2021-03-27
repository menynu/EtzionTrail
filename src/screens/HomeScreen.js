/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {Dimensions, StyleSheet, View, Text, TouchableOpacity, Platform, ToastAndroid, Image} from 'react-native';
import {Trail1, Trail2, Trail3 ,Trail4, area} from '../trails';
import haversine from "haversine";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal'
import MapView, { PROVIDER_GOOGLE, Geojson, Marker, AnimatedRegion, Polyline, Callout} from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 31.6600768;
const LONGITUDE = 35.1102883;
// const usersRef = firestore().collection('Users');

const markerRef = firestore().collection('Markers');

export class HomeScreen extends React.Component {

constructor(props) {
  super(props);
  console.log('props: ', props)

  this.state = {
    width: '99%',
    childRef: '',
    userMail: '',
    active : null,
    activeModal : null,
    modalVisible: false,
    hackHeight: height,
    Trail: Trail1, //represent the Trail json
    latitude: 31.6600768,
    longitude: 35.1102883,
    routeCoordinates: [],
    distanceTravelled: 0,
    flex: 0,
    marker: null,
    markers: [],
    markerText: "test",
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
    //get the user email from async storage
    AsyncStorage.getItem('userData', (err, result) => {
      // console.log('result is: ', result);
      let userEmail = JSON.parse(result)
      this.setState({userMail: userEmail.email})
      // console.log(userEmail.email)
})
// get markers from DB
    markerRef.get()
    .then(querySnapshot => {
      console.log('Total users: ', querySnapshot.size);
      const markers = [];
      querySnapshot.forEach(res => {
        const {title, info, latitude, longitude, imageUri} = res.data()
        markers.push({
          latitude,
          longitude,
          title,
          info,
          imageUri,
          id: res.id
        })
      });
      this.setState({
        markers,
      })
    });
    
    //method to track user.
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

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  handleUserLocation =() =>{
    Geolocation.getCurrentPosition(pos => {
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

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

// shows the latlng on each view change
  onChangeValue = initialRegion => {
    ToastAndroid.show(JSON.stringify(initialRegion), ToastAndroid.SHORT)
    console.log(JSON.stringify(initialRegion))
    this.setState({
      initialRegion
    })
  };

  handleTrail = text => {
    this.setState({ Trail: text });
  };

  newMarker = coords => {
    console.log('cords are: ', coords)
    this.setState({ marker: coords })
    this.setState({activeModal: 'true'}) // enable the modal
  }

  renderModal(){
    const {activeModal} = this.state;
    if (!activeModal) return null;     
    return(
      <Modal
       isVisible
       transparent
       onBackButtonPress={() => this.setState({ activeModal: null })}
       onBackdropPress={() => this.setState({ activeModal: null })}
      >
        
        <View style={styles.modalView}>
      {/* this.props.navigation.navigate - in order to work under class */}
       <TouchableOpacity onPress={() => {this.props.navigation.navigate('UploadScreen', {
         marker: this.state.marker,
         email: this.state.userMail,
       }), this.setState({ activeModal: null })}
       }> 
          <Text> הוסף נקודת עניין חדשה</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=>this.setState({activeModal: null})}>
          <Text> Close</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={()=>console.log('marker::: ', this.state.markers)}>
          <Text> marker show test</Text>
        </TouchableOpacity> */}
        </View>
      </Modal>
    )
  }

//function move to current location
  gotToMyLocation(){
    console.log('gotToMyLocation is called')
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log("curent location: ", coords)
        // console.log(this.map);
        if (this.map) {
          console.log("curent location: ", coords)
          this.map.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          })
        }
      }, //on error:
      () => alert('Error: Are location services on?'),
      { enableHighAccuracy: true }
    )
  }

//method to show location button
  _fixLocationButton =() =>{
    this.setState({width: '100%'})
  }

render() {
  return (
      <View style={{paddingBottom: this.state.paddingBottom }}>
        {/* Next method to make custom current location button */}
      {/* <TouchableOpacity onPress={this.gotToMyLocation.bind(this)} style={[ {
          width: 60, height: 60,
          position: "absolute", bottom: 20, right: 20, borderRadius: 30, backgroundColor: "#d2d2d2"
        }]}>
          <Text>follow</Text>
      </TouchableOpacity>      */}
      <MapView
      provider={PROVIDER_GOOGLE} 
      // style={styles.map}
      style={{
      position: 'absolute',
      top: 0,
      bottom: 70,
      width: this.state.width,
      height: height-150,
      flex: 1,
      zIndex: -1,
      }}
      
      mapType={"hybrid"}
      showsScale={true}
      showsPointsOfInterest={false}
      showsBuildings={true}
      showsUserLocation ={true}
      showsCompass = {true}
      rotateEnabled
      followsUserLocation={true}
      showsMyLocationButton = {true}
      initialRegion = {this.state.initialRegion}
      loadingEnabled
      onMapReady={this._fixLocationButton} 
      onRegionChangeComplete = {this.onChangeValue}
      ref = {ref => this.map =ref}
      //add longpress event for marker callout
      onLongPress={(e) => this.newMarker(e.nativeEvent.coordinate)}
      // onLongPress={(e) => this.setState({ marker: e.nativeEvent.coordinate })}
      >
      {
            this.state.marker &&
            <MapView.Marker coordinate={this.state.marker}  >
              <MapView.Callout>
                <View>
                    <Text>Lat:, Lon:</Text>
                    <Text> test marker</Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
      }
      {
        this.state.markers.map(marker => (
          
          <MapView.Marker
            key={marker.id}
            coordinate={{longitude: marker.longitude, latitude: marker.latitude}}>
              <MapView.Callout>
                <View>
                      <View>
                        {marker.imageUri && <Image source = {{uri: marker.imageUri}}
                        style = {{ width: '90%', height: 100, justifyContent: 'center', flex: 1, alignContent: 'center', resizeMode: 'stretch'}}
                      />  }        
                      </View>
                    <Text>Lat: {marker.latitude}, Lon: {marker.longitude}</Text>
                    <Text>{marker.email}</Text>
                </View>
              </MapView.Callout>         
          </MapView.Marker>
        ))
      }
  
      <Geojson 
        geojson={this.state.Trail} 
        strokeColor="red"
        fillColor="green"
        strokeWidth={2}
      />
      {/* Used for custom area limitation */}
      {/* <Geojson 
        geojson={area} 
        strokeColor="red"
        fillColor= "#4d1427a5"
        strokeWidth={1}
      /> */}
      <Marker 
        coordinate={{
          latitude: 31.7955783,
          longitude: 35.1535883
        }}
        title= "new marker"
        description= "desc..."
      >
      </Marker>

      <Marker
        coordinate={this.getMapRegion()}
        title={this.state.markerText}
        draggable 
        >
      <MapView.Callout>
                <View>
                    <Text>Lat:, Lon:</Text>
                    <Text>Magnitude, Depth:</Text>
                </View>
        </MapView.Callout>


      </Marker>

    
        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
        <Marker.Animated
          ref={marker => {
            this.marker = marker;
          }}
          coordinate={this.state.coordinate}
        >
          
        </Marker.Animated>


  </MapView>
  
      <View style={{marginTop: 10}}>
      </View>
      <View style={{top:height-160}}>
  
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
    {this.renderModal()}
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
    modalContainer: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    modal: {
      height: height, //* 0.75,
      // position: 'absolute',
      // backgroundColor: theme.COLORS.white,
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
    modalView: {
    margin: 20,
    backgroundColor: 'lightblue',
    // height: height * 1.25,
    position: 'absolute',
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
   });