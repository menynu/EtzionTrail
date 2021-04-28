/* eslint-disable react/prop-types */
import React from 'react';
import {Dimensions, StyleSheet, View, LogBox ,Alert, Text, TouchableOpacity, ToastAndroid, Image, PermissionsAndroid} from 'react-native';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import {Trail1, Trail2, Trail3 ,Trail4} from '../trails';
import haversine from "haversine";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal'
import MapView, { PROVIDER_GOOGLE, Geojson, Marker, AnimatedRegion, Polyline} from 'react-native-maps';
import {Icon} from 'react-native-vector-icons'

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 31.6600768;
const LONGITUDE = 35.1102883;

const markerRef = firestore().collection('Markers');

export class HomeScreen extends React.Component {

constructor(props) {
  super(props);
  console.log("props is",props);
  // const { navigation, route } = this.props;
  this.state = {
    // trailCoords:  this.props.navigation.route.params,
    currMarker: null,
    trailCords: [],
    region: null,
    locations: [],
    stationaries: [],
    routeCoordinates: [],
    distanceTravelled: 0,
    isRunning: false,
    markerUrl: '',
    width: '99%',
    userEmail: '',
    active : null,
    activeModal : null,
    infoModal: null,
    modalVisible: false,
    Trail: Trail1, //represent the Trail json
    latitude: 31.6600768,
    longitude: 35.1102883,
    marker: null,
    markers: [],
    prevLatLng: {},
    initialRegion:{  // init region on map change
      latitude: 31.6600768,
      longitude: 35.1102883,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.009
    },
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0
    })
  };
  }

    //get the user email from storage
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        let Email = JSON.parse(value)
        console.log('the user email: ', Email.email)
      this.setState({userEmail: Email.email})
      }
    } catch (error) {
      console.log('no user found')
    }
  };

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
// get markers from DB
    markerRef.onSnapshot(querySnapshot => {
      const markers = [];
      if (querySnapshot)    
      querySnapshot.forEach(res => {
        markers.push({
          ...res.data(),
          id: res.id
        })
      });
      this.setState({
        markers,
      })
    });

    this._retrieveData()

    BackgroundGeolocation.getCurrentLocation(lastLocation => {
      let region = this.state.region;
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      region = Object.assign({}, lastLocation, {
        latitudeDelta,
        longitudeDelta
      });
      this.setState({ locations: [lastLocation], region });
    }, (error) => {
      setTimeout(() => {
        Alert.alert('Error obtaining current location', JSON.stringify(error));
      }, 100);
    });

    BackgroundGeolocation.on('location', location => {
      console.log('[DEBUG] BackgroundGeolocation location', location);
      console.log('what location is: ', location)
      BackgroundGeolocation.startTask(taskKey => {
        const { coordinate, routeCoordinates, distanceTravelled } =   this.state;
        const { latitude, longitude } = location;
        // console.log('lat is:', latitude)
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
          console.log('the route is: ', this.state.routeCoordinates)
          console.log('the distance is: ', this.state.distanceTravelled)
          BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (location) => {
      console.log('[DEBUG] BackgroundGeolocation stationary', location);
      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          const stationaries = this.state.stationaries.slice(0);
          if (location.radius) {
            const longitudeDelta = 0.01;
            const latitudeDelta = 0.01;
            const region = Object.assign({}, location, {
              latitudeDelta,
              longitudeDelta
            });
            const stationaries = this.state.stationaries.slice(0);
            stationaries.push(location);
            this.setState({ stationaries, region });
          }
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }

  // function to save track to DB
  async saveTrack(){
    console.log('save track')
    if (this.state.distanceTravelled > 0)
    {
      await firestore().collection('Tracks').
      add({
        track: this.state.routeCoordinates,
        distance: this.state.distanceTravelled,
        user: this.state.userEmail
    })
      this.setState({
        routeCoordinates:[],
        distance: 0,
      })
    } 
  }

  toggleTracking() {
    console.log('bg tracking enabled')
    
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
        return false;
      }

      if (!locationServicesEnabled) {
        Alert.alert(
          'Location services disabled',
          'Would you like to open location settings?',
          [
            {
              text: 'Yes',
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel'
            }
          ]
        );
        return false;
      }

      if (authorization == 99) {
        // authorization yet to be determined
        BackgroundGeolocation.start();
      } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
        // calling start will also ask user for permission if needed
        // permission error will be handled in permisision_denied event
        BackgroundGeolocation.start();
      } else {
        Alert.alert(
          'App requires location tracking',
          'Please grant permission',
          [
            {
              text: 'Ok',
              onPress: () => BackgroundGeolocation.start()
            }
          ]
        );
      }
    });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  requestGeoLocationPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
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
    // ToastAndroid.show(JSON.stringify(initialRegion), ToastAndroid.SHORT)
    // console.log(JSON.stringify(initialRegion))
    this.setState({
      initialRegion
    })
  };

  handleTrail = text => {
    this.setState({ Trail: text });
  };

  newMarker = coords => {
    // console.log('cords are: ', coords)
    this.setState({ marker: coords })
    this.setState({activeModal: 'true'}) // enable the modal
  }

  authHandler() {
    if (this.state.userEmail) {
      this.props.navigation.navigate('UploadScreen', {
        marker: this.state.marker,
        email: this.state.userEmail,
      }), this.setState({ activeModal: null })}
    else 
    {
      Alert.alert(
        'על מנת להוסיף נקודת עניין עליך להתחבר למערכת',
        ' ',     
        [
          {
            text: 'התחברות',
            onPress: () => this.props.navigation.navigate('SignIn')
          },
          {
            text: 'הרשמה',
            onPress: () => this.props.navigation.navigate('Register')
          },
          {
            text: 'ביטול',
            onPress: () =>  this.setState({activeModal: null}),
            style: 'cancel'
          }
        ]
      );
    }
    
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
       <TouchableOpacity onPress={() => this.authHandler()}> 
          <Text> הוסף נקודת עניין חדשה</Text>
        </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  infoModal(){
    const {infoModal, currMarker} = this.state;
    if (!infoModal) return null;     
    return(
      <Modal
       isVisible
       transparent
       onBackButtonPress={() => this.setState({ infoModal: null })}
       onBackdropPress={() => this.setState({ infoModal: null })}
       style={styles.modalView}
      >  
        <View >     
       {console.log('the real infomodal: ', currMarker.email)}
          <Text> {currMarker.title} </Text>
          <Text> {currMarker.info} </Text>
          {/* <Text> {this.state.markerUrl}</Text> */}
          <Image source = {{uri:this.state.markerUrl}} //{{uri: marker.imageUri}}
              style = {{ width: 400, height: 300, justifyContent: 'center', flex: 1,}}
            />    
        </View>
      </Modal>
    )
  }

//function move to current location
  gotToMyLocation(){
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        // console.log("curent location: ", coords)
        if (this.map) {
          // console.log("curent location: ", coords)
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

  

  onMarkerPress = (mapEventData, marker) => {
    const markerID = mapEventData._targetInst.return.key;
    console.log('marker email: ', marker.id, markerID)
    console.log('marker: ', marker)
    this.setState({currMarker: marker})
    this.setState({infoModal: 'true', markerUrl: marker.imageUri})
    console.log('the current marker: ', this.state.currMarker)
  //  if (this.props.route.params)
  //getparams
    // console.log('route is: ', this.props.route.params.coords)
    // const cords=this.props.route.params.coords
    // this.setState({trailCords: cords})
  }

//method to show location button
  _fixLocationButton =() =>{
    this.setState({width: '100%'})
    this.requestGeoLocationPermission
  }


render() {

  return (
     
      <View style={{paddingBottom: this.state.paddingBottom }}>
        {/* Next method to make custom current location button */}
      <TouchableOpacity onPress={this.gotToMyLocation.bind(this)} style={[ {
          width: 60, height: 60,
          position: "absolute", bottom: 20, right: 20, borderRadius: 30, backgroundColor: "#d2d2d2"
        }]}>
          <Text>follow</Text>
      </TouchableOpacity>        
      <Text style={{backgroundColor: 'white'}}> 
      <TouchableOpacity onPress={()=>this.toggleTracking()}><Text style={{marginRight: 20}} >הפעל</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.toggleTracking()}><Text style={{marginRight: 20}} >עצור</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.saveTrack()}><Text style={{marginRight: 20}} >שמור</Text></TouchableOpacity></Text>
      <MapView
      provider={PROVIDER_GOOGLE} 
      // style={styles.map}
      style={{
      position: 'absolute',
      top: 0,
      // bottom: 70,
      width: this.state.width,
      height: height-20,
      flex: 1,
      zIndex: -1,
      }}
      
      mapType={"hybrid"}
      showsPointsOfInterest={true}
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
      >

            {this.state.stationaries.map((stationary, idx) => {
              return (
                <MapView.Circle
                  key={idx}
                  center={stationary}
                  radius={stationary.radius}
                  fillColor="#AAA"
                />
              );
            })}
{
        this.state.markers.map(marker => (
          marker.approved &&
          <MapView.Marker
            key={marker.id}
            coordinate={{longitude: marker.longitude, latitude: marker.latitude}}
            onPress={(e)=>this.onMarkerPress(e, marker)}  
            >
              {/* TODO: need to fix */}
              {marker.img? <Image source={(marker.img)} style={{width: 42, height: 42}} />: 
              <Image source={require('../assets/marker.png')} style={{width: 42, height: 42}} />}
              {/* <Image source={require('../assets/marker.png')} style={{width: 42, height: 42}} /> */}
              <MapView.Callout //tooltip
                      onPress={() => this.setState({infoModal: 'true', markerUrl: marker.imageUri})}
              >
              </MapView.Callout>         
          </MapView.Marker>   
        ))
      }

      <Geojson 
        geojson={Trail1} 
        strokeColor="red"
        fillColor="green"
        strokeWidth={3}
      />
      <Geojson 
        geojson={Trail2} 
        strokeColor="yellow"
        fillColor="green"
        strokeWidth={3}
      />
      <Geojson 
        geojson={Trail3} 
        strokeColor="blue"
        fillColor="green"
        strokeWidth={3}
      />
      <Geojson 
        geojson={Trail4} 
        strokeColor="green"
        fillColor="green"
        strokeWidth={3}
      />

        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
        <Marker.Animated     
          ref={marker => {
            this.marker = marker;
          }}
          coordinate={this.state.coordinate}  
        >
        </Marker.Animated>
  </MapView>
  
      <View  >
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
    {this.infoModal()}
    </View>

    );
  }
}



const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    modal: {
      height: height, //* 0.75,
    },
    modalView: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '30%',
    margin: 0,
    backgroundColor: 'lightblue',
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