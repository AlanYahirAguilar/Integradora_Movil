// CourseDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CourseFullAlert from '../../components/CourseFullAlert'; // Importar el componente de alerta

export default function CourseDetailScreen({ route }) {
  const { course } = route.params; // Recibe el curso seleccionado

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
      {/* Imagen del Curso */}
      <Image source={course.image} style={styles.courseImage} />

      {/* Título del Curso */}
      <Text style={styles.title}>{course.title}</Text>

      {/* Creado por */}
      <View style={styles.creatorContainer}>
        <Image style={styles.userIcon} />
        <Text style={styles.creator}>Creado por: {course.instructor}</Text>
      </View>

      {/* Calificación */}
      <View style={styles.ratingContainer}>
        <Image style={styles.starIcon} />
        <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{course.description}</Text>

      {/* Contenido Clave */}
      <View style={styles.keyContentContainer}>
        <Image style={styles.checkIcon} />
        <Text style={styles.keyContentTitle}>Contenido clave:</Text>
      </View>
      {/* {course.keyContent.map((item, index) => (
        <View key={index} style={styles.keyContentItem}>
          <Image style={styles.checkIcon} />
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
          <Image style={styles.icon} />
          <Text style={styles.infoText}>Requisitos previos: {course.prerequisites}</Text>
        </View>
      </View>

      {/* Comentarios e Inscribirse */}
      <View style={styles.commentsContainer}>
        <Image style={styles.commentIcon} />
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
  courseImage: {
   
  },
  title: {
 
  },
  creatorContainer: {
 
  },
  userIcon: {
 
  },
  creator: {
 
  },
  ratingContainer: {
  
  },
  starIcon: {
 
  },
  rating: {
  
  },
  description: {
  
  },
  keyContentContainer: {
   
  },
  checkIcon: {

  },
  keyContentTitle: {
 
  },
  keyContentItem: {
  
  },
  keyContent: {
    
  },
  infoContainer: {
  
  },
  durationContainer: {

  },
  prerequisitesContainer: {
 
  },
  icon: {
    
  },
  infoText: {
    
  },
  commentsContainer: {
   
  },
  commentIcon: {
  
  },
  comments: {
   
  },
  enrollButton: {
   
  },
  enrollButtonText: {

  },
});