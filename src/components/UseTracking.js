/* eslint-disable react/prop-types */
import React from "react";
import {Alert} from 'react-native';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import haversine from "haversine";

import  { AnimatedRegion } from "react-native-maps";






class UseTracking extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      latitude: this.props.latitude, 
      longitude: this.props.longitude,
      region: this.props.region,
      routeCoordinates: [], 
      distanceTravelled: 0,
      coordinate: this.props.coordinate,
      stationaries: [],
      prevLatLng: [],
      isRunning: false,
    }
  }

  sendData = () => {
    console.log('senddata callback')
    this.props.parentCallback(this.state.distanceTravelled);
    // צריך להחזיר את אלה:
    //latitude , longitude, distanceTravelled, routeCoordinates
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  componentDidMount() {
    console.log("YES I GOT HERE")
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
        // this.sendData()
        console.log("the route is: ", this.state.routeCoordinates);
        console.log("the distance is: ", this.state.distanceTravelled);
        BackgroundGeolocation.endTask(taskKey);
      });
    });


    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 10, //meters
      notificationTitle: "Background tracking",
      notificationText: "enabled",
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
      this.setState({ isRunning: true });
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
            "App requires location tracking",
            "Would you like to open app settings?",
            [
              {
                text: "Yes",
                onPress: () => BackgroundGeolocation.showAppSettings()
              },
              {
                text: "No",
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
  
    BackgroundGeolocation.on("foreground", () => {
      console.log("[INFO] App is in foreground");
    });
  
    BackgroundGeolocation.on("background", () => {
      console.log("[INFO] App is in background");
    });
  
    BackgroundGeolocation.checkStatus(({ isRunning }) => {
      this.setState({ isRunning });
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

 
}
export default UseTracking