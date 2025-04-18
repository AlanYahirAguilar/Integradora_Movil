import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Sidebar from '../../components/SideBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import CategoryService from '../../services/CategoryService';

const CategoryScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Cargar cursos de la categoría
  useEffect(() => {
    loadCoursesByCategory();
  }, [categoryId]);

  const loadCoursesByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coursesData = await CategoryService.getCoursesByCategory(categoryId);
      
      // Transformar los datos del backend al formato que necesitamos
      const formattedCourses = coursesData.map(course => ({
        id: course.courseId,
        title: course.title,
        subtitle: course.description ? 
                  (course.description.length > 30 ? 
                    course.description.substring(0, 30) + '...' : 
                    course.description) : 
                  'Sin descripción',
        image: course.bannerPath || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpbeIdvXsrOVNtqnFvgTnaEFryqk6skOpyUg&s',
        price: `MX$${parseFloat(course.price || 0).toFixed(2)}`,
        priceValue: parseFloat(course.price || 0),
        rating: 4.5, // Valor por defecto
        courseData: course // Guardar los datos completos para la pantalla de detalle
      }));
      
      setCourses(formattedCourses);
    } catch (error) {
    //  console.error('Error al cargar cursos por categoría:', error);
      setError('No se pudieron cargar los cursos de esta categoría');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para navegar a la pantalla de detalles del curso
  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetail', {
      course: {
        id: course.id,
        courseId: course.id,
        title: course.courseData.title,
        instructor: course.courseData.instructor?.name || 'Instructor',
        description: course.courseData.description || '',
        price: course.priceValue,
        precio: course.price,
        image: course.image ? { uri: course.image } : require('../../../assets/Test.png'),
        bannerPath: course.image,
        startDate: course.courseData.startDate,
        endDate: course.courseData.endDate,
        categories: course.courseData.categories,
        size: course.courseData.size, 
        comments: '0'
      }
    });
  };

  // Función para renderizar las estrellas
  // const renderStars = (rating) => (
  //   <View style={styles.starsContainer}>
  //     {[...Array(5)].map((_, index) => (
  //       <Icon
  //         key={index}
  //         name="star"
  //         size={14}
  //         color={index < Math.floor(rating) ? '#FFD700' : '#ccc'}
  //       />
  //     ))}
  //   </View>
  // );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#604274" />
        <Text style={styles.loadingText}>Cargando cursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCoursesByCategory}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Cursos de {categoryName}:</Text>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      {/* Grid de Cursos */}
      {courses.length > 0 ? (
        <View style={styles.coursesContainer}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              onPress={() => handleCoursePress(course)}
              style={styles.courseCard}
            >
              <Image 
                source={{ uri: course.image }} 
                style={styles.courseImage}
                defaultSource={require('../../../assets/Test.png')}
              />
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
              <Text style={styles.coursePrice}>{course.price}</Text>
              {/* <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
                {renderStars(course.rating)}
              </View> */}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noCoursesContainer}>
          <Text style={styles.noCoursesText}>No hay cursos disponibles en esta categoría</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#604274',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#604274',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#604274',
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%', // Ancho ligeramente reducido
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12, // Padding reducido
    marginBottom: 12, // Espaciado entre tarjetas reducido
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  courseImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 10,
    color: '#800080',
    marginBottom: 8,
  },
  coursePrice: {
    fontSize: 12,
    color: '#800080',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  noCoursesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CategoryScreen; 