import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import NavigationMapView from '../components/NavigationMapView';

export default function MainScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Half: Camera */}
      <View style={styles.halfHeight}>
        <CameraView style={styles.camera} facing="back">
           {/* Overlay UI elements for the camera (like object detection boxes) go here */}
        </CameraView>
      </View>

      {/* Bottom Half: Google Maps Navigation */}
      <View style={styles.halfHeight}>
        <NavigationMapView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
  },
  halfHeight: {
    flex: 1, // This ensures both views take up 50% of the screen
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white'
  },
});