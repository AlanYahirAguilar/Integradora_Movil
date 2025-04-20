// VideoPlayer.js
import { Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const VideoPlayer = ({ source, contentType /* = 'video'  */ }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Manejar carga de contenido
  const handleLoadStart = () => {
    setIsLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (err) => {
    //console.error('Error al cargar el contenido:', err);
    setIsLoading(false);
    setError(true);
  };

  // Función para abrir PDF usando WebBrowser
  const openPDF = useCallback(async () => {
    try {
      setDownloadingPdf(true);
      setDownloadProgress(0);
      setError(false);

      // Intenta abrir el PDF directamente primero
      const result = await WebBrowser.openBrowserAsync(source);
      setDownloadingPdf(false);

      if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log('Usuario cerró el navegador web');
      }
    } catch (error) {
      // console.error('Error al abrir el PDF:', error);
      setError(true);
      setDownloadingPdf(false);

      Alert.alert(
        "Error",
        "No se pudo abrir el PDF. Verifica tu conexión a internet.",
        [{ text: "OK" }]
      );
    }
  }, [source]);

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
  } else if (contentType === 'pdf') {
    const WebView = require('react-native-webview').WebView;

    return (
      <View style={styles.pdfContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#673AB7" />
            <Text style={styles.loadingText}>Cargando PDF...</Text>
          </View>
        )}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudo cargar el documento PDF</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(false);
                setIsLoading(true);
              }}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{ uri: `https://docs.google.com/gview?url=${source}&embedded=true` }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={(err) => {
              console.log('WebView error:', err);
              setIsLoading(false);
              setError(true);
            }}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            style={{ flex: 1 }}
          />
        )}
      </View>
    );
  } else {
    // Tipo de contenido no soportado
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tipo de contenido no soportado: {contentType}</Text>
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
  errorDescription: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  pdfContainer: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  pdfViewerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pdfTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#673AB7',
    marginTop: 10,
  },
  pdfDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  openPdfButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  openPdfButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '80%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#673AB7',
  },
  retryButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;