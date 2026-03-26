import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ListRenderItem,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { getDirections, searchLocation } from './openRouteService';

// Type definitions
type Coordinate = [number, number]; // [longitude, latitude]
type MapCoordinate = { latitude: number; longitude: number };

// Add specific types for API responses to avoid 'any' type errors
interface ORSStep {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: [number, number];
}

interface ORSGeocodeFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: Coordinate;
  };
  properties: {
    id: string;
    label: string;
    // other properties are available but not used in this component
  };
}

// A simplified type for the directions response to help TypeScript
interface ORSDirectionsResponse {
  features: {
    geometry: { coordinates: Coordinate[] };
    properties: { segments: { steps: ORSStep[] }[] };
  }[];
}

export default function NavigationScreen() {
  const [currentLocation, setCurrentLocation] = useState<MapCoordinate | null>(null);
  const [destination, setDestination] = useState<MapCoordinate | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>([]);
  const [navigationSteps, setNavigationSteps] = useState<ORSStep[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ORSGeocodeFeature[]>([]);

  const mapRef = useRef<MapView>(null);

  // 1. Get user's initial location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in your device settings.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(userLocation);
      // Center map on user's location
      mapRef.current?.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  // 2. Fetch route when a destination is set
  useEffect(() => {
    if (currentLocation && destination) {
      // Capture coordinates outside the async function to fix TypeScript strict null checks
      const startLon = currentLocation.longitude;
      const startLat = currentLocation.latitude;
      const endLon = destination.longitude;
      const endLat = destination.latitude;

      const fetchRoute = async () => {
        try {
          const startCoord: Coordinate = [startLon, startLat];
          const endCoord: Coordinate = [endLon, endLat];

          const routeData = (await getDirections({ start: startCoord, end: endCoord })) as ORSDirectionsResponse;
          const firstFeature = routeData?.features?.[0];

          if (firstFeature) {
            // Extract coordinates for the polyline
            const points: MapCoordinate[] = firstFeature.geometry.coordinates.map((coord: Coordinate) => ({
              latitude: coord[1],
              longitude: coord[0],
            }));
            setRouteCoordinates(points);

            // Extract turn-by-turn instructions for guidance
            const steps = firstFeature.properties.segments?.[0]?.steps || [];
            setNavigationSteps(steps);

            // Announce the first step to start guidance
            const firstInstruction = steps[0]?.instruction;
            if (firstInstruction) {
              Speech.speak(`Starting route. First, ${firstInstruction}`, { language: 'en-US' });
            }

            // Fit map to the route
            mapRef.current?.fitToCoordinates(points, {
              edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
              animated: true,
            });
          }
        } catch (error) {
          console.error("Could not get directions", error);
          Alert.alert("Error", "Failed to fetch the route. Please check your connection and API key.");
        }
      };

      fetchRoute();
    }
  }, [currentLocation, destination]);

  // 3. Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = (await searchLocation(searchQuery)) as ORSGeocodeFeature[];
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search for location:', error);
      Alert.alert("Search Error", "Could not find the location.");
    }
  };

  // 4. Handle selection of a search result
  const onLocationSelect = (location: ORSGeocodeFeature) => {
    const [longitude, latitude] = location.geometry?.coordinates || [0, 0];
    setDestination({ latitude, longitude });

    // Clear search UI
    setSearchQuery(location.properties.label);
    setSearchResults([]);
  };

  // Extracted render function for the search results FlatList for clarity and type safety
  const renderSearchResult: ListRenderItem<ORSGeocodeFeature> = ({ item }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => onLocationSelect(item)}>
      <Text>{item.properties?.label || 'Unknown'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeColor="#007AFF" strokeWidth={5} />
        )}

        {/* Destination Marker */}
        {destination && <Marker coordinate={destination} title="Destination" pinColor="blue" />}
      </MapView>

      {/* Search UI */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Where to?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>

        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => item.properties?.id || index.toString()}
            renderItem={renderSearchResult}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled" // Allows tapping results without dismissing keyboard
          />
        )}
      </View>

      {/* Basic Guidance Display */}
      {navigationSteps.length > 0 && (
        <View style={styles.guidanceContainer}>
          <Text style={styles.guidanceText}>Next: {navigationSteps[0]?.instruction}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { ...StyleSheet.absoluteFillObject },
  searchOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60, // Adjusted for better visibility below status bar
    left: 10,
    right: 10,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: { flex: 1, marginRight: 10 },
  resultsList: { backgroundColor: 'white', borderRadius: 8, maxHeight: 200, marginTop: 2 },
  resultItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  guidanceContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  guidanceText: { color: 'white', fontSize: 16, textAlign: 'center' },
});