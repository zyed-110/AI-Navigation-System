import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function NavigationMapView() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Watch position updates
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every second
          distanceInterval: 2, // Update every 2 meters
        },
        (newLocation) => {
          setLocation(newLocation);
          
          // Animate map camera to new location
          if (mapRef.current) {
            mapRef.current.animateCamera({
              center: {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
              },
              pitch: 45, // Angled view for navigation
              heading: newLocation.coords.heading || 0,
              zoom: 18, // Close zoom for navigation
            }, { duration: 1000 });
          }
        }
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsTraffic={true}
      />
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});