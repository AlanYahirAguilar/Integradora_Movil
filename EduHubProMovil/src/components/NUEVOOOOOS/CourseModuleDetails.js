import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../SideBar';

const CourseModuleDetails = ({ navigation, route }) => {
  // Sample module data - in a real app, this would come from the route params or API
  const [moduleData, setModuleData] = useState({
    title: "Arquitectos del Código",
    progress: 60,
    lessons: [
      { id: 1, title: "Lección 1: Introducción", completed: true, locked: false },
      { id: 2, title: "Lección 2: Patrones de Diseño", completed: true, locked: false },
      { id: 3, title: "Lección 3: Introducción a Arquitectura de Software", completed: true, locked: false },
      { id: 4, title: "Lección 3: Arquitectura Hexagonal", completed: false, locked: false },
      { id: 5, title: "Lección 5: Los componentes", completed: false, locked: true },
      { id: 6, title: "Lección 6: Conclusiones", completed: false, locked: true },
    ]
  });
  
  // Add sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Listen for sidebar toggle events from navigation params
  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  const renderLessonItem = ({ item }) => {
    let icon, buttonText, buttonStyle;
    
    if (item.completed) {
      icon = <Ionicons name="checkmark-circle" size={24} color="green" />;
      buttonText = "Ver Lección";
      buttonStyle = styles.viewButton;
    } else if (item.locked) {
      icon = <Ionicons name="lock-closed" size={24} color="#888" />;
      buttonText = "Bloqueado";
      buttonStyle = styles.lockedButton;
    } else {
      icon = <Ionicons name="ellipse-outline" size={24} color="#673AB7" />;
      buttonText = "Continuar";
      buttonStyle = styles.continueButton;
    }

    return (
      <View style={styles.lessonItem}>
        <View style={styles.lessonInfo}>
          {icon}
          <Text style={styles.lessonTitle}>{item.title}</Text>
        </View>
        <TouchableOpacity 
          style={buttonStyle}
          disabled={item.locked}
          onPress={() => navigation.navigate('LessonDetail', { lessonId: item.id })}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Add Sidebar component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>{moduleData.title}</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Progreso General</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${moduleData.progress}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>Progreso: {moduleData.progress}%</Text>
        </View>
        
        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Módulos</Text>
          
          <FlatList
            data={moduleData.lessons}
            renderItem={renderLessonItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver a Mis Cursos</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    width: '100%',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#673AB7',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  modulesContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  modulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 15,
    textAlign: 'center',
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonTitle: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  continueButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  lockedButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  backButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CourseModuleDetails;
