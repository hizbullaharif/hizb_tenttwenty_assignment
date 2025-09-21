import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FullScreenTrailerPlayer } from '../../components/movie/TrailerPlayer';

export default function VideoPlayerModal() {
  const { videoKey, title } = useLocalSearchParams<{ videoKey: string; title: string }>();

  const handleClose = () => {
    router.back();
  };

  const handleVideoEnd = () => {
    router.back();
  };

  if (!videoKey) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Stack.Screen options={{ headerShown: false }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <FullScreenTrailerPlayer
        videoKey={videoKey}
        title={title}
        autoPlay={true}
        onVideoEnd={handleVideoEnd}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});