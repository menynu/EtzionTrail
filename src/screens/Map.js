import React, { useState, useEffect } from 'react'
import { StyleSheet, View, PermissionsAndroid } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'


export  function Map() {
 
    const [mapWidth, setMapWidth] = useState('99%')

    // Update map style to force a re-render to make sure the geolocation button appears
    const updateMapStyle = () => {
      setMapWidth('100%')
    }
  
    // Request geolocation in Android since it's not done automatically
    const requestGeoLocationPermission = () => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }
  
    return (
      <View style={styles.container}>
  
        <MapView
          showsScale = {true}
          provider={PROVIDER_GOOGLE}
          mapType='hybrid'
          showsIndoorLevelPicker
          customMapStyle={googleMapStyle}
          style={[styles.map, { width: mapWidth }]}
          showsUserLocation={true}
          onLongPress={console.log("test")}
          
          showsBuildings = {true}
          showsPointsOfInterest={true}
          showsMyLocationButton={true}
          showsCompass={true}
          onMapReady={() => {
            requestGeoLocationPermission()
            updateMapStyle()
          }}
        >
  
        </MapView>
      </View>
    )
  }
  
  const googleMapStyle = [{
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{
      visibility: "off"
    }]
  }]
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    map: {
      height: '100%'
    }
  })