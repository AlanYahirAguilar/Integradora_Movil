import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '../../components/VideoPlayer';
import Sidebar from '../../components/SideBar';

const LessonDetail = ({ route, navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);

  // Obtener datos de la lección desde los parámetros de ruta
  useEffect(() => {
    if (route.params) {      
      setLessonData({
        id: route.params.sectionId,
        name: route.params.sectionName,
        description: route.params.sectionDescription,
        contentUrl: route.params.contentUrl,
        contentType: route.params.contentType
      });
      setIsLoading(false);
    }
  }, [route.params]);

  // Escuchar eventos de toggle de la barra lateral desde los parámetros de navegación
  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen(!isSidebarOpen);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  const renderContentIcon = () => {
    switch (lessonData.contentType) {
      case 'video':
        return <Ionicons name="videocam" size={24} color="#673AB7" />;
      case 'image':
        return <Ionicons name="image" size={24} color="#673AB7" />;
      case 'pdf':
        return <Ionicons name="document-text" size={24} color="#673AB7" />;
      default:
        return <Ionicons name="document" size={24} color="#673AB7" />;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#673AB7" />
        <Text style={styles.loadingText}>Cargando lección...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra lateral */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#673AB7" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{lessonData.name}</Text>
            <View style={styles.contentTypeIndicator}>
              {renderContentIcon()}
              <Text style={styles.contentTypeText}>
                {lessonData.contentType === 'video' ? 'Video' : 
                 lessonData.contentType === 'image' ? 'Imagen' : 
                 lessonData.contentType === 'pdf' ? 'Documento PDF' : 'Contenido'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Contenido multimedia */}
        <View style={[
          styles.contentWrapper, 
          lessonData.contentType === 'pdf' && styles.pdfContentWrapper
        ]}>
          {lessonData.contentUrl ? (
            <VideoPlayer 
              source={lessonData.contentUrl} 
              contentType={lessonData.contentType}
            />
          ) : (
            <View style={styles.noContentContainer}>
              <Ionicons name="alert-circle" size={64} color="#FFB300" />
              <Text style={styles.noContentText}>No hay contenido disponible para esta lección</Text>
            </View>
          )}
        </View>
        
        {/* Descripción de la lección */}
        {lessonData.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción:</Text>
            <Text style={styles.descriptionText}>{lessonData.description}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#673AB7',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  contentTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  contentTypeText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  contentWrapper: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pdfContentWrapper: {
    height: Dimensions.get('window').height * 0.6, // Mayor altura para PDFs
  },
  noContentContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
  },
  noContentText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  descriptionContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
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
});

export default LessonDetail;
