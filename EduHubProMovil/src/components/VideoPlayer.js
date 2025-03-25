// VideoPlayer.js
import { Video } from 'expo-av';
import React from 'react';
import { StyleSheet } from 'react-native';

const VideoPlayer = ({ source }) => {
  return (
    <Video
      source={{ uri: source }}
      style={styles.video}
      resizeMode="contain"
      isLooping
      shouldPlay
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default VideoPlayer;