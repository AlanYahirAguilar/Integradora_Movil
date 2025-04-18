import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Importar Progress.Bar
import { useNavigation } from '@react-navigation/native';
import UserService from '../../services/UserService';
import CourseService from '../../services/CourseService';

export default function MyInscriptionsCourses({ route }) {
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

  // Función para cargar los cursos del estudiante al montar el componente
  useEffect(() => {
    loadStudentCourses();
  }, []);

  // Simulación de carga de datos
  const loadStudentCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular respuesta del backend
      const response = await CourseService.fetchRegistrationByStudent();

      if (!response.success) {
        setError(studentCourses.error || "Error al cargar los cursos.");
        return;
      }

      const studentCourses = response.data;

      console.log("\nRESPONSE\n");
      console.log(studentCourses);

      // Transformar los datos para adaptarlos al formato esperado por el componente
      const formattedCourses = studentCourses.map(course => ({
        id: course.courseId,
        title: course.title,
        image: course.bannerPath || 'https://via.placeholder.com/150',
        progress: course.progress || 0,
        instructor: course.instructor.name || 'Instructor',
      }));

      setCourses(formattedCourses);
    } catch (err) {
      console.log(err);

      setError('No se pudieron cargar tus cursos. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      <View style={styles.mainContent}>
        <ScrollView
          style={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadStudentCourses} />
          }
        >
          {/* Encabezado */}
          <Text style={styles.title}>Inscritos:</Text>

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

          {/* Tarjetas de Cursos */}
          {!isLoading && !error && courses.length > 0 && (
            <View style={styles.coursesContainer}>
              {courses.map((course) => (
                <TouchableOpacity key={course.id} style={styles.courseCard}>
                  <Image source={{ uri: course.image }} style={styles.courseImage} />
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.instructor}>{course.instructor}</Text>
                    <View style={styles.progressContainer}>
                      <ProgressBar
                        progress={course.progress / 100}
                        width={null}
                        color="#604274"
                        unfilledColor="#E0E0E0"
                        borderWidth={0}
                        style={styles.progressBar}
                      />
                      <Text style={styles.progressText}>{`${course.progress}%`}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 16,
    color: '#604274',
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