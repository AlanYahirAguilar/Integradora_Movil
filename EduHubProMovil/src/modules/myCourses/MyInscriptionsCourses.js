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

  // Cargar los cursos del estudiante
  const loadStudentCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener inscripciones desde el backend
      const response = await CourseService.fetchRegistrationByStudent();
      
      if (!response.success) {
        setError(response.error || "Error al cargar los cursos.");
        console.error("Error al cargar cursos:", response.error);
        return;
      }

      const studentCourses = response.data;
      console.log("Cursos del estudiante cargados:", studentCourses.length);

      // Transformar los datos para adaptarlos al formato esperado por el componente
      const formattedCourses = studentCourses.map(course => ({
        id: course.courseId,
        title: course.title,
        image: course.bannerPath || 'https://via.placeholder.com/150',
        progress: course.progress || 0,
        instructor: course.instructor?.name || 'Instructor',
        originalData: course // Guardar datos originales para pasar a la pantalla de detalles
      }));

      setCourses(formattedCourses);
    } catch (err) {
      console.error("Error al cargar inscripciones:", err);
      setError('No se pudieron cargar tus cursos. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Función para navegar a los detalles del curso
  const navigateToCourseDetails = (course) => {
    try {
      console.log("Navegando a detalles de curso:", course.id);
      
      // Asegurarse de que los datos del curso incluyan todos los campos necesarios
      const courseData = {
        courseId: course.id,
        title: course.title,
        bannerPath: course.image,
        instructor: course.originalData?.instructor || { name: "Instructor" },
        modules: course.originalData?.modules || [],
        // Agregar otros campos que puedan ser necesarios
        description: course.originalData?.description || "",
        price: course.originalData?.price || 0,
        duration: course.originalData?.duration || 0,
        courseStatus: course.originalData?.courseStatus || "PUBLISHED",
      };
      
      // Navegar a la pantalla de detalles pasando el curso completo
      navigation.navigate('CourseDetail', { course: courseData });
    } catch (error) {
      console.error("Error al navegar:", error);
      // Mostrar un mensaje al usuario
      alert("No se pudo cargar los detalles del curso. Inténtalo de nuevo.");
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

          {/* No hay cursos */}
          {!isLoading && !error && courses.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No estás inscrito en ningún curso actualmente.</Text>
            </View>
          )}

          {/* Tarjetas de Cursos */}
          {!isLoading && !error && courses.length > 0 && (
            <View style={styles.coursesContainer}>
              {courses.map((course) => (
                <TouchableOpacity 
                  key={course.id} 
                  style={styles.courseCard} 
                  onPress={() => navigateToCourseDetails(course)}
                >
                  <Image 
                    source={{ uri: course.image }} 
                    style={styles.courseImage}
                    onError={(e) => {
                      console.log("Error al cargar imagen, usando imagen por defecto");
                      // En React Native Web, el manejo de error es diferente
                      // Aquí simplemente registramos el error
                    }}
                  />
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle} numberOfLines={2} ellipsizeMode="tail">
                      {course.title}
                    </Text>
                    <Text style={styles.instructor} numberOfLines={1} ellipsizeMode="tail">
                      {course.instructor}
                    </Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
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