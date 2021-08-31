// import React from 'react';
import { Alert } from "react-native";
import BackgroundGeolocation from "@darron1217/react-native-background-geolocation";

const BgSettings = (props) => {

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

 

};

export default BgSettings;