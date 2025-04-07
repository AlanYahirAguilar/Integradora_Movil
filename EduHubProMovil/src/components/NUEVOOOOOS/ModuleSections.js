import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ModuleSections = ({ navigation, route }) => {
  // Obtener los parámetros de la ruta
  const { moduleId, moduleName, sections = [] } = route.params || {};

  // Función para manejar el clic en una sección
  const handleSectionPress = (section) => {
    navigation.navigate('LessonDetail', {
      sectionId: section.sectionId,
      sectionName: section.name,
      sectionDescription: section.description,
      contentUrl: section.contentUrl,
      contentType: section.contentType || 'image' // Por defecto, asumir imagen
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
});

export default ModuleSections;
