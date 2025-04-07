// MyCoursesScreen.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Importar Progress.Bar
import { useNavigation } from '@react-navigation/native';
import CourseService from '../../services/CourseService';

export default function MyCoursesScreen({route}) {
  const navigation = useNavigation();
   
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);
  
  // Cargar los cursos del estudiante al montar el componente
  useEffect(() => {
    loadStudentCourses();
  }, []);
  
  // Función para cargar los cursos del estudiante
  const loadStudentCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const studentCourses = await CourseService.getStudentCourses();
      console.log('Cursos obtenidos:', studentCourses);
      
      // Transformar los datos para adaptarlos al formato esperado por el componente
      const formattedCourses = studentCourses.map(course => ({
        id: course.courseId,
        title: course.title,
        image: course.bannerPath || 'https://via.placeholder.com/150',
        progress: calculateCourseProgress(course),
        instructor: course.instructor?.name || 'Instructor',
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
        modules: course.modules || [],
        // Guardar el objeto completo para tener todos los datos disponibles
        originalData: course
      }));
      
      setCourses(formattedCourses);
    } catch (err) {
      console.error('Error al cargar cursos:', err);
      setError('No se pudieron cargar tus cursos. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  // Función para calcular el progreso del curso basado en módulos desbloqueados
  const calculateCourseProgress = (course) => {
    if (!course.modules || course.modules.length === 0) return 0;
    
    // Contar módulos desbloqueados
    const unlockedModules = course.modules.filter(module => 
      module.status === 'UNLOCKED' || module.status === 'COMPLETED'
    ).length;
    
    return unlockedModules / course.modules.length;
  };
  
  // Función para manejar la acción de pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadStudentCourses();
  };

  const handleCoursePress = (courseId) => {
    // Encontrar el curso completo con todos sus datos
    const selectedCourse = courses.find(course => course.id === courseId);
    if (selectedCourse) {
      navigation.navigate('course-module-details', { courseId, course: selectedCourse.originalData });
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      {/* Mis Cursos */}
      <Text style={styles.title}>Mis Cursos:</Text>
      
      {/* Estado de carga */}
      {isLoading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#604274" />
          <Text style={styles.loadingText}>Cargando tus cursos...</Text>
        </View>
      )}
      
      {/* Mensaje de error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStudentCourses}>
            <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Mensaje cuando no hay cursos */}
      {!isLoading && !error && courses.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no estás inscrito en ningún curso.</Text>
          <TouchableOpacity 
            style={styles.exploreCourseButton} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreCourseButtonText}>Explorar cursos disponibles</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cards de Cursos */}
      {!isLoading && !error && courses.length > 0 && (
        <View style={styles.coursesContainer}>
          {courses.map((course) => (
            <TouchableOpacity 
              key={course.id} 
              onPress={() => handleCoursePress(course.id)} 
              style={styles.courseCard}
            >
              {/* Usar uri para imágenes remotas */}
              <Image 
                source={{ uri: course.image }} 
                style={styles.courseImage} 
                defaultSource={require('../../../assets/Test.png')}
              />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.instructor}>{course.instructor}</Text>
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={course.progress} 
                    width={null} 
                    color="#604274"
                    unfilledColor="#E0E0E0"
                    borderWidth={0}
                    style={styles.progressBar} 
                  />
                  <Text style={styles.progressText}>{Math.round(course.progress * 100)}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 16,
    color: '#604274'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#604274',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#604274',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
  },
  exploreCourseButton: {
    backgroundColor: '#604274',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exploreCourseButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  courseImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
  },
  courseInfo: {
    marginTop: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#800080',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#604274',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});