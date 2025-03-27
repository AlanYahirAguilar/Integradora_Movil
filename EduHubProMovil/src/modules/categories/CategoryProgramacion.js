import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa FontAwesome para los íconos

export default function CategoryProgramacion({route}) {
  const navigation = useNavigation();

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

useEffect(() => {
       if (route.params?.toggleSidebar) {
         setIsSidebarOpen((prev) => !prev);
         navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
       }
     }, [route.params?.toggleSidebar]);

  const courses = [
    {
      id: '1',
      title: 'Arquitectura del Código',
      subtitle: 'Desarrollo de Software Avanzado',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpbeIdvXsrOVNtqnFvgTnaEFryqk6skOpyUg&s',
      price: 'MX$900',
      rating: 4.5,
    },
    {
      id: '2',
      title: 'FullStack Hermes: De Frontend a Backend',
      subtitle: 'Incluye Laravel y JavaScript',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpbeIdvXsrOVNtqnFvgTnaEFryqk6skOpyUg&s', // Reemplaza con la URL correcta
      price: 'MX$900',
      rating: 4.8,
    },
    {
      id: '3',
      title: 'Automatización Inteligente',
      subtitle: 'Programación con Scripts',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpbeIdvXsrOVNtqnFvgTnaEFryqk6skOpyUg&s', // Reemplaza con la URL correcta
      price: 'MX$900',
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Estructuras de Datos',
      subtitle: 'Fundamentos de Algoritmos y Clases',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpbeIdvXsrOVNtqnFvgTnaEFryqk6skOpyUg&s', // Reemplaza con la URL correcta
      price: 'MX$900',
      rating: 4.6,
    },
  ];

  const handleCoursePress = (courseId) => {
    navigation.navigate('CourseDetails', { courseId });
  };

  // Función para renderizar las estrellas
  const renderStars = (rating) => (
    <View style={styles.starsContainer}>
      {[...Array(5)].map((_, index) => (
        <Icon
          key={index}
          name="star"
          size={14} // Reducimos el tamaño de las estrellas
          color={index < Math.floor(rating) ? '#FFD700' : '#ccc'} // Color amarillo para estrellas llenas
        />
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Cursos de Programacion:</Text>
      <Sidebar 
                  isOpen={isSidebarOpen} 
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                  navigation={navigation} 
                />
      {/* Grid de Cursos */}
      <View style={styles.coursesContainer}>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            onPress={() => handleCoursePress(course.id)}
            style={styles.courseCard}
          >
            <Image source={{ uri: course.image }} style={styles.courseImage} />
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
            <Text style={styles.coursePrice}>{course.price}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
              {renderStars(course.rating)} {/* Renderiza las estrellas */}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%', // Ancho ligeramente reducido
    backgroundColor: '#f0f0f0',
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
    height: 120, // Altura de la imagen reducida
    borderRadius: 8,
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 14, // Fuente del título reducida
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 10, // Fuente del subtítulo reducida
    color: '#800080',
    marginBottom: 8,
  },
  coursePrice: {
    fontSize: 12, // Fuente del precio reducida
    color: '#800080',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12, // Fuente de la calificación reducida
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
});