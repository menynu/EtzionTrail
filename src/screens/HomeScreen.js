/* eslint-disable react/prop-types */
import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  LogBox,
  Alert,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
  PermissionsAndroid,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BackgroundGeolocation from "@darron1217/react-native-background-geolocation";
import { Trail1, Trail2, Trail3, Trail4 } from "../trails";
import haversine from "haversine";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import Modal from "react-native-modal";
import MapView, { PROVIDER_GOOGLE, Geojson, AnimatedRegion, Polyline } from "react-native-maps";


const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 31.6600768;
const LONGITUDE = 35.1102883;

const markerRef = firestore().collection("Markers");

export class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    console.log("props is", props);
    // const { navigation, route } = this.props;
    this.state = {
      // trailCoords:  this.props.navigation.route.params,
      locationAlert: false,
      modalVisible2: false,
      watchTrail: false,
      playToggle: false,
      recordFlag: false,
      currMarker: null,
      trailCords: [],
      tracksViewChanges: true,
      region: null,
      locations: [],
      stationaries: [],
      routeCoordinates: [],
      distanceTravelled: 0,
      isRunning: false,
      markerUrl: "",
      width: "99%",
      userEmail: "",
      active: null,
      activeModal: null,
      infoModal: null,
      modalVisible: false,
      Trail: null, //represent the Trail json
      latitude: 31.6600768,
      longitude: 35.1102883,
      marker: null,
      markers: [],
      prevLatLng: {},
      initialRegion: {  // init region on map change
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
      }),
      startPt: ({
        longitude: 35.100004076958,
        latitude: 31.606495501781

      }),
      endPt: ({
        longitude: null,
        latitude: null
      })
    };
  }

  handleCallback = (childData) => {
    console.log("child data; ", childData);
    // this.setState({data: childData})
  };

  //get the user email from storage
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        let Email = JSON.parse(value);
        console.log("the user email: ", Email.email);
        this.setState({ userEmail: Email.email });
      }
    } catch (error) {
      console.log("no user found");
    }
  };

  async  requestLocationPermission(){
    // Alert.alert('בשביל לקבל מידע עבור מיקומך גם בעת שימוש האפליקיה וגם ברקע נצטרך את אישורך להפעלת מיקום, לאחר אישורך מומלץ להפעיל מחדש את האפליקציה')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'הפעלת שירותי מיקום',
          'message': 'שביל עציון משתמש בשירותי מיקום גם כאשר האפליקציה ברקע. על מנת לקבל את מיקומך עליך לאשר זאת '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
        // alert("You can use the location");
      } else {
        console.log("location permission denied")
        // alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err)
    }
  }
  

  async componentDidMount() {
    await this.requestLocationPermission()
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
// get markers from DB
    markerRef.onSnapshot(querySnapshot => {
      const markers = [];
      if (querySnapshot)
        querySnapshot.forEach(res => {
          markers.push({
            ...res.data(),
            id: res.id
          });
        });
      this.setState({
        markers
      });
    });

    this._retrieveData();


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
        Alert.alert("Error obtaining current location", JSON.stringify(error));
      }, 100);
    });

    BackgroundGeolocation.on("location", location => {
      console.log("[DEBUG] BackgroundGeolocation location", location);
      console.log("what location is: ", location);
      BackgroundGeolocation.startTask(taskKey => {
        const { coordinate, routeCoordinates, distanceTravelled } = this.state;
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
        console.log("the route is: ", this.state.routeCoordinates);
        console.log("the distance is: ", this.state.distanceTravelled);
        BackgroundGeolocation.endTask(taskKey);
      });
    });


    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 10, //meters
      notificationTitle: "הקלטת מסלול ברקע",
      notificationText: "פעיל",
      //debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, // DISTANCE_FILTER_PROVIDER for
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      // url: 'http://192.168.81.15:3000/location',
      httpHeaders: {
        "X-FOO": "bar"
      },
      // customize post properties
      postTemplate: {
        lat: "@latitude",
        lon: "@longitude",
        foo: "bar" // you can also add your own properties
      }
    });

    BackgroundGeolocation.on("start", () => {
      // service started successfully
      // you should adjust your app UI for example change switch element to indicate
      // that service is running
      console.log("[DEBUG] BackgroundGeolocation has been started");
      // this.setState({ isRunning: true });
    });

    BackgroundGeolocation.on("stop", () => {
      console.log("[DEBUG] BackgroundGeolocation has been stopped");
      this.setState({ isRunning: false });
    });

    BackgroundGeolocation.on("authorization", status => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay after permission prompt or otherwise alert will not be shown
        setTimeout(() =>
          Alert.alert(
            "האפליקציה דורשת שימוש בשירותי מיקום",
            "על מנת לאפשר לאפליקציה להשתמש בשירותי המיקום של הטלפון וגם עבור הפעלתה ברקע של האפליקציה או מחוסר שימוש בעת הקלטות מסלול עליך לאשר זאת",
            [
              {
                text: "מאשר/ת",
                onPress: () => BackgroundGeolocation.showAppSettings()
              },
              {
                text: "לא מאשר/ת",
                onPress: () => console.log("No Pressed"),
                style: "cancel"
              }
            ]
          ), 1000);
      }
    });

    BackgroundGeolocation.on("error", ({ message }) => {
      Alert.alert("BackgroundGeolocation error", message);
    });

    // BackgroundGeolocation.on("foreground", () => {
    //   console.log("[INFO] App is in foreground");
    // });

    // BackgroundGeolocation.on("background", () => {
    //   console.log("[INFO] App is in background");
    // });

    BackgroundGeolocation.checkStatus(({ isRunning }) => {
      // this.setState({ isRunning });
      if (isRunning) {
        BackgroundGeolocation.start();
      }
    });

    function logError(msg) {
      console.log(`[ERROR] getLocations: ${msg}`);
    }


    BackgroundGeolocation.on("stationary", (location) => {
      console.log("[DEBUG] BackgroundGeolocation stationary", location);
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


  async handleSave() {
    this.state.playToggle ? this.toggleTracking() : null;
    await firestore().collection("Tracks").add({
      track: this.state.routeCoordinates,
      distance: this.state.distanceTravelled,
      user: this.state.userEmail
    }).then(this.setState({
      routeCoordinates: [],
      distance: 0
    }));
    this.setState({ playToggle: false, isRunning: false });
    alert("המסלול נשמר בהצלחה!, הצגתו תתאפשר בעדכון הבא");
  }

  // function to save track to DB
  async saveTrack() {
    console.log("save track");

    if (this.state.distanceTravelled > 0) {
      Alert.alert(
        "?האם ברצונך להפסיק את ההקלטה",
        "?האם את/ה בטוח/ה",
        [
          { text: "כן", onPress: () => this.handleSave() },
          { text: "לא", onPress: () => console.log("No item was removed"), style: "cancel" }
        ],
        {
          cancelable: true
        }
      );
    }
  }

  toggleTracking() {
    if (!this.state.userEmail) {
      alert("בכדי להקליט עליך להתחבר למערכת");
      return;
    }
    if (!this.state.locationAlert) {
      console.log("got heree");
      Alert.alert(
        "הרשאת מיקום",
        "שביל עציון משתמשת במידע על מיקמוך בכדי להקליט ולהציג את מסלולך על המפה גם כאשר האפליקציה עובדת ברקע. על מנת שנוכל לעשות זאת נצטרך את אישורך כדי לאפשר לאפליקציה לגשת לנתוני מיקומך גם כשהאפליקציה פועלת ברקע",

        [
          {
            text: "אישור",
            onPress: () => {this.setState({ locationAlert: true})}
          },
          {
            text: "ביטול",
            onPress: () => console.log("canceled"),
            style: "cancel"
          }
          // { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      // this.setState({locationAlert: true})
    }
    if (!this.state.locationAlert)
      return;

    if (!this.state.recordFlag && this.state.locationAlert) {
      this.setState({ recordFlag: true});
      // this.setState({isRunning: true})
      ToastAndroid.show("הקלטת מסלול פעילה", ToastAndroid.SHORT);
    } else {
      this.setState({ recordFlag: false});
    }


    console.log("bg tracking enabled");
    this.state.playToggle ? this.setState({ playToggle: false }) : this.setState({ playToggle: true });
    // <UseTracking parentCallback = {this.handleCallback}
    //   latitude= {this.state.latitude}
    //   longitude = {this.state.longitude}
    //   region = {this.state.region}
    //   coordinate ={this.state.coordinates}
    // />
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
        return false;
      }

      if (!locationServicesEnabled) {
        Alert.alert(
          "Location services disabled",
          "Would you like to open location settings?",
          [
            {
              text: "Yes",
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: "No",
              onPress: () => console.log("No Pressed"),
              style: "cancel"
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
          "App requires location tracking",
          "Please grant permission",
          [
            {
              text: "Ok",
              onPress: () => BackgroundGeolocation.start()
            }
          ]
        );
      }
    });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };


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
    });
  };

  handleTrail = text => {
    this.setState({ Trail: text });
  };

  newMarker = coords => {
    // console.log('cords are: ', coords)
    this.setState({ marker: coords });
    this.setState({ activeModal: "true" }); // enable the modal
  };

  authHandler() {
    if (this.state.userEmail) {
      this.props.navigation.navigate("UploadScreen", {
        marker: this.state.marker,
        email: this.state.userEmail
      }), this.setState({ activeModal: null });
    } else {
      Alert.alert(
        "על מנת להוסיף נקודת עניין עליך להתחבר למערכת",
        " ",
        [
          {
            text: "התחברות",
            onPress: () => this.props.navigation.navigate("SignIn")
          },
          {
            text: "הרשמה",
            onPress: () => this.props.navigation.navigate("Register")
          },
          {
            text: "ביטול",
            onPress: () => this.setState({ activeModal: null }),
            style: "cancel"
          }
        ]
      );
    }
  }

  renderModal() {
    const { activeModal } = this.state;
    if (!activeModal) return null;
    return (
      <Modal
        isVisible
        transparent
        onBackButtonPress={() => this.setState({ activeModal: null })}
        onBackdropPress={() => this.setState({ activeModal: null })}
      >
        <View style={styles.newPtModal}>
          {/* this.props.navigation.navigate - in order to work under class */}
          <TouchableOpacity onPress={() => this.authHandler()}>
            <Text> הוסף נקודת עניין חדשה</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  infoModal() {
    const { infoModal, currMarker } = this.state;
    if (!infoModal) return null;
    return (
      <Modal
        isVisible
        transparent
        onBackButtonPress={() => this.setState({ infoModal: null })}
        onBackdropPress={() => this.setState({ infoModal: null })}
        style={styles.modalView}
      >
        <View>
          {console.log("the real infomodal: ", currMarker.email)}
          <Text> {currMarker.title} </Text>
          <Text>__________________________</Text>
          <Text> {currMarker.info} </Text>
          <Text>נוצר ע"י {currMarker.email}</Text>
          <Image source={{ uri: this.state.markerUrl }}
                 style={{ width: 400, height: 300, justifyContent: "center", flex: 1, resizeMode: "stretch" }}
          />
        </View>
      </Modal>
    );
  }

//go to trails
  selectTrail = trail => {
    console.log("text: ", trail);
    // this.setState({watchTrail: false})
    this.setState({ Trail: trail });
    if (Trail1) {
      console.log("trail1");
      // return(
      this.setState({
        startPt: (35.100004076958,
          31.606495501781)
      });
      this.setState({
        endPt: (35.115287303925,
          31.647938093268)
      });

      // )
    }


  };

  goToTrail() {

    this.state.watchTrail ? this.setState({ watchTrail: false }) : this.setState({ watchTrail: true });

    if (this.map && !this.state.watchTrail) {
      this.map.animateToRegion({
        latitude: 31.634666947529958,
        longitude: 35.16990227624774,
        latitudeDelta: 0.2260742636282238,
        longitudeDelta: 0.14534857124089484
      });
    }


  }

//function move to current location
  // gotToMyLocation() {
  //   Geolocation.getCurrentPosition(
  //     ({ coords }) => {
  //       // console.log("curent location: ", coords)
  //       if (this.map) {
  //         // console.log("curent location: ", coords)
  //         this.map.animateToRegion({
  //           latitude: coords.latitude,
  //           longitude: coords.longitude,
  //           latitudeDelta: 0.005,
  //           longitudeDelta: 0.005
  //         });
  //       }
  //     }, //on error:
  //     () => alert("Error: Are location services on?"),
  //     { enableHighAccuracy: true }
  //   );
  // }


  onMarkerPress = (mapEventData, marker) => {
    const markerID = mapEventData._targetInst.return.key;
    console.log("marker email: ", marker.id, markerID);
    console.log("marker: ", marker);
    this.setState({ currMarker: marker });
    this.setState({ infoModal: "true", markerUrl: marker.imageUri });
    console.log("the current marker: ", this.state.currMarker);
    //  if (this.props.route.params)
    //getparams
    // console.log('route is: ', this.props.route.params.coords)
    // const cords=this.props.route.params.coords
    // this.setState({trailCords: cords})
  };

//method to show location button
  _fixLocationButton = () => {
    this.setState({ width: "100%" });
    this.requestGeoLocationPermission;
  };

  handleTrail = text => {
    this.setState({ Trail: text });
  };

  stopRendering = () => {
    this.setState({ tracksViewChanges: false });
  };

  render() {
    return (

      <View style={styles.container}>
        {/* Only auth users can record the trails - for test - in future maybe only admin */}
        <View style={{ flexDirection: "row", alignSelf: "flex-end", margin: 15, marginTop: 55 }}>

          <TouchableOpacity onPress={() => this.toggleTracking()}>
            {!this.state.playToggle ? (<MaterialIcons name="play-circle-filled" size={25} color="red"/>) :
              <MaterialIcons name="pause" size={25} color="red"/>}
          </TouchableOpacity>
          {(this.state.distanceTravelled > 0) ? <TouchableOpacity onPress={() => this.saveTrack()}>
            <MaterialIcons name="stop" size={25} color="red"/>
          </TouchableOpacity> : null}
        </View>

        {/* Next method to make custom current location button */}
        <TouchableOpacity onPress={this.goToTrail.bind(this)} style={{
          width: 60,
          height: 60,
          position: "absolute",
          bottom: 20,
          right: 20,
          borderRadius: 30,
          backgroundColor: "#d2d2d2",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"
        }}>

          <Image source={require("../assets/trailsbtn.png")} style={styles.categoryIcon}/>
        </TouchableOpacity>

        {this.state.watchTrail ? <View style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => {
            this.selectTrail(Trail1), this.map.animateToRegion({
              latitude: 31.623459643104475,
              longitude: 35.119468700140715,
              latitudeDelta: 0.11305099010432329,
              longitudeDelta: 0.07267411798238754
            });
          }} style={styles.categoryBtn}>
            <View style={styles.categoryIcon}>
              <Image source={require("../assets/trail1.png")} style={styles.categoryIcon}/>
            </View>

          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.selectTrail(Trail2), this.map.animateToRegion({
              latitude: 31.664841294355234,
              longitude: 35.13709148392081,
              latitudeDelta: 0.1130006827056782,
              longitudeDelta: 0.07267411798238754
            });
          }}
                            style={styles.categoryBtn}>
            <View style={styles.categoryIcon}>
              <Image source={require("../assets/trail2.png")} style={styles.categoryIcon}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.selectTrail(Trail3) , this.map.animateToRegion({
              latitude: 31.62098228329318,
              longitude: 35.18275575712323,
              latitudeDelta: 0.226108091912959,
              longitudeDelta: 0.14534857124090195
            });
          }} style={styles.categoryBtn}>
            <View style={styles.categoryIcon}>
              <Image source={require("../assets/trail3.png")} style={styles.categoryIcon}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.selectTrail(Trail4), this.map.animateToRegion({
              latitude: 31.634349083365052,
              longitude: 35.230283830314875,
              latitudeDelta: 0.11303775760035606,
              longitudeDelta: 0.07267411798238754
            });
          }} style={styles.categoryBtn}>
            <View style={styles.categoryIcon}>
              <Image source={require("../assets/trail4.png")} style={styles.categoryIcon}/>
            </View>
          </TouchableOpacity>

        </View> : null}


        <MapView
          provider={PROVIDER_GOOGLE}
          style={{
            position: "absolute",
            top: 0,
            // bottom: 70,
            width: this.state.width, //fix for show location button
            height: height - 20,
            flex: 1,
            zIndex: -1
          }}
          mapType={"hybrid"}
          showsPointsOfInterest={true}
          showsBuildings={true}
          showsUserLocation={true}
          showsCompass={true}
          rotateEnabled
          followsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={this.state.initialRegion}
          loadingEnabled
          onMapReady={this._fixLocationButton}
          onRegionChangeComplete={this.onChangeValue}
          ref={ref => this.map = ref}
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
                tracksViewChanges={this.state.tracksViewChanges}
                coordinate={{ longitude: marker.longitude, latitude: marker.latitude }}
                onPress={(e) => this.onMarkerPress(e, marker)}
              >
                {marker.img == "alert" ?
                  <Image source={require("../assets/alert.png")} style={styles.marker}/> :
                  marker.img == "info" ?
                    <Image source={require("../assets/info.png")} style={styles.marker}/> :
                    <Image source={require("../assets/marker.png")} onLoad={this.stopRendering}
                           style={styles.marker}/>
                }
                <MapView.Callout //tooltip
                  onPress={() => this.setState({ infoModal: "true", markerUrl: marker.imageUri })}
                >
                </MapView.Callout>
              </MapView.Marker>
            ))
          }
          {this.state.Trail ? <Geojson
            geojson={this.state.Trail}
            strokeColor="lightblue"
            fillColor="green"
            strokeWidth={3}
            onPress={() => {
              console.log("clicked");
            }}
          /> : null}


          {/* Create the recorded track line */}
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5}/>
          {/*
          {this.state.Trail?  <Marker
            ref={marker => {
              this.marker = marker;
            }}
            title='התחלה'
            coordinate={this.state.startPt}
          /> : null} */}


          {/* <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            title='התחלה'
            coordinate={this.state.startPt}
          /> */}

          {/* <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            title='התחלה'
            coordinate={this.state.startPt}
          >
          </Marker.Animated>
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            title= 'סיום'
            coordinate={this.state.endPt}
          >
          </Marker.Animated> */}
        </MapView>

        <View>
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
    // justifyContent: "flex-end",
    alignItems: "center"
  },
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end"
  },
  modal: {
    height: height //* 0.75,
  },
  modalView: {
    justifyContent: "flex-end",
    width: "100%",
    height: "30%",
    margin: 0,
    backgroundColor: "lightblue",
    position: "absolute",
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
  categoryContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 10
  },
  categoryBtn: {
    flex: 1,
    width: "30%",
    marginHorizontal: 0,
    alignSelf: "center"
  },
  categoryIcon: {
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 70,
    height: 70,
    backgroundColor: "#fdeae7" /* '#FF6347' */,
    borderRadius: 50
  },
  categoryBtnTxt: {
    alignSelf: "center",
    marginTop: 5,
    color: "#de4f35"
  },
  newPtModal: {
    justifyContent: "center",
    alignContent: "center",
    width: "70%",
    height: "10%",
    backgroundColor: "lightblue",
    position: "absolute",
    borderRadius: 20,
    marginLeft: 60,
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
  marker: {
    width: 30,
    height: 30
  },
  iconStyle: {
    fontSize: 40,
    marginTop: 30,
    color: "black"
  }
});