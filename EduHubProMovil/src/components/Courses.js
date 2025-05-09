import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CourseService from '../services/CourseService';

const Courses = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses(); // tu función para cargar los cursos

    const timer = setTimeout(() => {
      loadCourses(); // recarga después de 30s
    }, 30000); // 30,000 ms = 30 segundos

    return () => clearTimeout(timer); // limpieza del timer
  }, []);

  // Función para cargar los cursos desde el backend
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const coursesData = await CourseService.getAllCourses();

      // Mapear los datos del backend al formato que espera el componente
      const formattedCourses = coursesData.map(course => ({
        id: course.courseId,
        title: course.title,
        isFull: course.size <= 0,
        autor: course.instructor ? course.instructor.name : 'Profesor',
        description: course.description || 'Sin descripción',
        image: course.bannerPath || 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg',
        precio: course.price ? `MX$ ${parseFloat(course.price).toFixed(2)}` : 'MX$ 0.00',
        price: course.price || 0,
        courseId: course.courseId,
        bannerPath: course.bannerPath,
        startDate: course.startDate,
        endDate: course.endDate,
        size: course.size,
        courseStatus: course.courseStatus,
        categories: course.categories || [],
        modules: course.modules || [],
        instructor: course.instructor,
        duration: course.duration || 0,
      }));

      setCourses(formattedCourses);
    } catch (error) {
      setError('No se pudieron cargar los cursos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderCourse = (course) => (
    <TouchableOpacity
      key={course.id}
      style={styles.card}
      onPress={() => navigation.navigate('CourseDetail', {
        course: {
          ...course,
          id: course.id || course.courseId,
          courseId: course.id || course.courseId,
          instructor: course.instructor?.name || course.autor || 'Instructor',
          description: course.description || '',
          price: course.price || 0,
          precio: course.precio || (course.price ? `MX$ ${parseFloat(course.price).toFixed(2)}` : 'MX$ 0.00'),
          image: course.image,
          bannerPath: course.bannerPath,
          startDate: course.startDate || null,
          endDate: course.endDate || null,
          categories: course.categories || [],
          size: course.size || 0,
          courseStatus: course.courseStatus || 'PUBLISHED',
          duration: course.duration || 0,
        }
      })}
    >
      <Image
        source={{ uri: course.image }}
        style={styles.cardImage}
        defaultSource={require('../../assets/Test.png')}
      />
      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.autor}>{course.autor}</Text>
      <Text style={styles.cardDescription}>
        {course.description.length > 46 ?
          course.description.substring(0, 25) + '...'
          : course.description}</Text>
      <Text style={styles.textPrice}>{course.precio}</Text>
    </TouchableOpacity>
  );

  // Dividir los cursos en grupos de 3 para cada fila
  const chunkedCourses = [];
  for (let i = 0; i < courses.length; i += 3) {
    chunkedCourses.push(courses.slice(i, i + 3));
  }

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#604274" />
        <Text style={styles.loadingText}>Cargando cursos...</Text>
      </View>
    );
  }

  // Si hay un error, mostrar mensaje
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCourses}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si no hay cursos, mostrar mensaje
  if (courses.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No hay cursos disponibles.</Text>
      </View>
    );
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {chunkedCourses.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {/* Agregar scroll horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {row.map(renderCourse)}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#604274',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 8, // Espacio entre cards
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 190, // Ancho fijo para que entren 3 cards por fila
    marginRight: 16, // Espaciado entre cards
    alignItems: 'left',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 5,
  },
  starsContainer: {
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  textPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'space-between'
  },
  autor: {
    fontSize: 10,
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
    color: '#555',
    textAlign: 'center',
  },
});

export default Courses;