import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CourseService from '../services/CourseService';

// Datos estáticos como fallback en caso de error
const staticCourses = [
  { id: 1, title: 'React Native', isFull: false, autor: 'Prof. Clara Bitwise', description: 'Desarrolla apps móviles.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 4, precio: 'MX$ 780' },
  { id: 2, title: 'JavaScript', isFull: true, autor: 'Dr. Nolan Kernel', description: 'Domina JS desde cero.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 5, precio: 'MX$ 980' },
  { id: 3, title: 'Node.js', isFull: false, autor: 'Ing. Tessa Cachewood', description: 'Backend con Node.js.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 4, precio: 'MX$ 567' },
];

const Courses = () => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
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
        numRating: 4.2, // Valor por defecto ya que no viene en la respuesta
        rating: 4, // Valor por defecto ya que no viene en la respuesta
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
        instructor: course.instructor
      }));

      setCourses(formattedCourses);
    } catch (error) {
      /* console.error('Error al cargar cursos:', error); */
      setError('No se pudieron cargar los cursos. Por favor, intenta nuevamente.');
      // En caso de error, usar datos estáticos como fallback
      setCourses(staticCourses);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => (
    <View style={styles.starsContainer}>
      {[...Array(5)].map((_, index) => (
        <Icon key={index} name="star" size={16} color={index < rating ? '#FFD700' : '#ccc'} />
      ))}
    </View>
  );

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
          courseStatus: course.courseStatus || 'PUBLISHED'
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
      <Text>
        <Text style={styles.rank}>{course.numRating}</Text> {renderStars(course.rating)}
      </Text>
      <Text style={styles.textPrice}>{course.precio}</Text>
    </TouchableOpacity>
  );

  // Dividir los cursos en grupos de 5 para cada fila
  const chunkedCourses = [];
  for (let i = 0; i < courses.length; i += 5) {
    chunkedCourses.push(courses.slice(i, i + 5));
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

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {chunkedCourses.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(renderCourse)}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '23%', // Ajuste para que entren 4 tarjetas por fila
    alignItems: 'left',
  },
  cardImage: {
    width: '100%',
    height: 100,
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
});

export default Courses;