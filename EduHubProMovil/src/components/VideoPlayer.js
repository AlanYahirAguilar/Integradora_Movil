// VideoPlayer.js
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text } from 'react-native';

const VideoPlayer = ({ source, contentType = 'video' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Manejar carga de contenido
  const handleLoadStart = () => {
    setIsLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Renderizar contenido según el tipo
  if (contentType === 'video') {
    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#673AB7" />
            <Text style={styles.loadingText}>Cargando video...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudo cargar el video</Text>
          </View>
        )}
        <Video
          source={{ uri: source }}
          style={styles.video}
          resizeMode="contain"
          isLooping
          shouldPlay
          onLoadStart={handleLoadStart}
          onLoad={handleLoadEnd}
          onError={handleError}
          useNativeControls
        />
      </View>
    );
  } else if (contentType === 'image') {
    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#673AB7" />
            <Text style={styles.loadingText}>Cargando imagen...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudo cargar la imagen</Text>
          </View>
        )}
        <Image
          source={{ uri: source }}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={handleLoadStart}
          onLoad={handleLoadEnd}
          onError={handleError}
        />
      </View>
    );
  } else {
    // Tipo de contenido no soportado
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tipo de contenido no soportado</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: '#673AB7',
    fontSize: 14,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default VideoPlayer;