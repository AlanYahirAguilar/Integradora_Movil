import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '../VideoPlayer';

const LessonDetail = ({ navigation, route }) => {
  // Obtener los parámetros de la ruta
  const {
    sectionId,
    sectionName,
    sectionDescription,
    contentUrl,
    contentType = 'image', // Por defecto, asumir imagen
  } = route.params || {};

  // Función para volver atrás
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {/* Cabecera con título y botón de retroceso */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backIconContainer}>
            <Ionicons name="arrow-back" size={24} color="#673AB7" />
          </TouchableOpacity>
          <Text style={styles.title}>{sectionName || 'Detalle de lección'}</Text>
        </View>

        {/* Contenido multimedia (video o imagen) */}
        {contentUrl ? (
          <View style={styles.mediaContainer}>
            <VideoPlayer source={contentUrl} contentType={contentType} />
          </View>
        ) : (
          <View style={styles.noMediaContainer}>
            <Ionicons name="image-outline" size={64} color="#ccc" />
            <Text style={styles.noMediaText}>No hay contenido multimedia disponible</Text>
          </View>
        )}

        {/* Descripción de la lección */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>
            {sectionDescription || 'No hay descripción disponible para esta lección.'}
          </Text>
        </View>

        {/* Botón para marcar como completada (funcionalidad futura) */}
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Marcar como completada</Text>
        </TouchableOpacity>

        {/* Botón para volver */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Volver al módulo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIconContainer: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#673AB7',
    flex: 1,
  },
  mediaContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  noMediaContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noMediaText: {
    marginTop: 10,
    color: '#888',
    fontSize: 16,
  },
  descriptionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonDetail;
