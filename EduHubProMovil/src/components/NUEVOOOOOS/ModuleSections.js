import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACTIONS, useCourseProgress } from '../../context/CourseProgressProvider';

const ModuleSections = ({ navigation, route }) => {

  const { dispatch } = useCourseProgress();

  // Obtener los parámetros de la ruta
  const { moduleId, moduleName, status, sections = [], isLoading } = route.params || {};

  // Función para manejar el clic en una sección
  /*   const handleSectionPress = (section) => {
      dispatch({ type: ACTIONS.SET_CURRENT_SECTION, payload: section.sectionId });
  
      navigation.navigate('LessonDetail', {
        sectionId: section.sectionId,
      });
    }; */

  const handleSectionPress = (section) => {
    if (status !== 'UNLOCKED' && status !== 'COMPLETED') return; // bloqueado
    dispatch({ type: ACTIONS.SET_CURRENT_SECTION, payload: section.sectionId });

    navigation.navigate('LessonDetail', {
      sectionId: section.sectionId,
      moduleId,                        // ← importante
    });
  };


  // Renderizar cada sección
  const renderSectionItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.sectionItem}
        onPress={() => handleSectionPress(item)}
      >
        <View style={styles.sectionInfo}>
          <Ionicons
            name={item.contentType === 'video' ? "play-circle" : "image"}
            size={24}
            color="#673AB7"
          />
          <Text style={styles.sectionTitle}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#673AB7" />
      </TouchableOpacity>
    );
  };

  // Si no hay datos o está cargando, mostrar solo el spinner
  if (!sections || sections.length === 0 || isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#673AB7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
          <Ionicons name="arrow-back" size={24} color="#673AB7" />
        </TouchableOpacity>
        <Text style={styles.title}>Módulo {moduleName}</Text>
      </View>

      {sections.length > 0 ? (
        <FlatList
          data={sections}
          renderItem={renderSectionItem}
          keyExtractor={item => item.sectionId}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No hay contenido disponible en este módulo</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Volver al curso</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  listContainer: {
    paddingBottom: 20,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ModuleSections;
