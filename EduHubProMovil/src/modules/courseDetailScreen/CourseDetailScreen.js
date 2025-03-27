// CourseDetailScreen.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CourseFullAlert from '../../components/CourseFullAlert'; // Importar el componente de alerta

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params; // Recibe el curso seleccionado

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
         if (route.params?.toggleSidebar) {
           setIsSidebarOpen((prev) => !prev);
           navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
         }
       }, [route.params?.toggleSidebar]);
  
  const handleSeeOtherCourses = () => {
    // Lógica para ver otros cursos
    console.log('Ver otros cursos');
  };

  const handleContactSupport = () => {
    // Lógica para contactar al soporte
    console.log('Contactar a soporte');
  };

  return (
    <View style={styles.container}>
    <Sidebar 
                  isOpen={isSidebarOpen} 
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                  navigation={navigation} 
                />
      {/* Imagen del Curso */}
      <Image source={course.image} style={styles.courseImage} />

      {/* Título del Curso */}
      <Text style={styles.title}>{course.title}</Text>

      {/* Creado por */}
      <View style={styles.creatorContainer}>
        <Image  style={styles.userIcon} />
        <Text style={styles.creator}>Creado por: {course.instructor}</Text>
      </View>

      {/* Calificación */}
      <View style={styles.ratingContainer}>
        <Image  style={styles.starIcon} />
        <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{course.description}</Text>

      {/* Contenido Clave */}
      <View style={styles.keyContentContainer}>
        <Image  style={styles.checkIcon} />
        <Text style={styles.keyContentTitle}>Contenido clave:</Text>
      </View>
      
      {/* {course.keyContent.map((item, index) => (
        <View key={index} style={styles.keyContentItem}>
          <Image  style={styles.checkIcon} />
          <Text style={styles.keyContent}>{item}</Text>
        </View>
      ))} */}

      {/* Duración y Requisitos Previos */}
      <View style={styles.infoContainer}>
        <View style={styles.durationContainer}>
          <Image  style={styles.icon} />
          <Text style={styles.infoText}>Duración: {course.duration} Hrs</Text>
        </View>
        <View style={styles.prerequisitesContainer}>
          <Image  style={styles.icon} />
          <Text style={styles.infoText}>Requisitos previos: {course.prerequisites}</Text>
        </View>
      </View>

      {/* Comentarios e Inscribirse */}
      <View style={styles.commentsContainer}>
        <Image  style={styles.commentIcon} />
        <Text style={styles.comments}>{course.comments} Comentarios</Text>
      </View>

      {/* Alerta si el curso está lleno */}
      {course.isFull && (
        <CourseFullAlert
          onSeeOtherCourses={handleSeeOtherCourses}
          onContactSupport={handleContactSupport}
        />
      )}

      {/* Botón de Inscribirse */}
      {!course.isFull && (
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Inscribirse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#800080',
    padding: 10,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  creator: {
    fontSize: 14,
    color: '#800080',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#800080',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  keyContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  keyContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyContentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  keyContent: {
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prerequisitesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  comments: {
    fontSize: 14,
  },
  enrollButton: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});