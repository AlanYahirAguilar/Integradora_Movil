import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CourseDetailScreen (){
  return (
    <ScrollView style={styles.container}>
      {/* Imagen del curso */}
      <Image
        source={{ uri: 'https://your-image-url.com' }}
        style={styles.courseImage}
      />
      
      {/* Título y creador */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Arquitectos del Código: Diseño de Software Avanzado</Text>
        <Text style={styles.subtitle}><FontAwesome name="user" size={14} /> Creado por: Dr. Ezra Bytewell</Text>
      </View>
      
      {/* Calificación */}
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>4.7</Text>
        <FontAwesome name="star" size={16} color="gold" />
        <FontAwesome name="star" size={16} color="gold" />
        <FontAwesome name="star" size={16} color="gold" />
        <FontAwesome name="star" size={16} color="gold" />
        <FontAwesome name="star-half" size={16} color="gold" />
      </View>
      
      {/* Descripción */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📌 Descripción:</Text>
        <Text style={styles.description}>
          Domina el diseño de software con patrones avanzados, arquitecturas escalables y mejores prácticas...
        </Text>
      </View>
      
      {/* Contenido clave */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Contenido clave:</Text>
        <Text>✅ Patrones de diseño avanzados</Text>
        <Text>✅ Arquitecturas escalables y distribuidas</Text>
        <Text>✅ Microservicios y mensajería</Text>
        <Text>✅ Clean Code y SOLID</Text>
      </View>
      
      {/* Duración y requisitos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏳ Duración: 28 Hrs</Text>
        <Text style={styles.sectionTitle}>📖 Requisitos previos:</Text>
        <Text>Conocimientos en programación y fundamentos de arquitectura de software.</Text>
      </View>
      
      {/* Comentarios */}
      <TouchableOpacity style={styles.commentButton}>
        <Text style={styles.commentText}>💬 1000 Comentarios</Text>
      </TouchableOpacity>
      
      {/* Botón de inscripción */}
      <TouchableOpacity style={styles.enrollButton}>
        <Text style={styles.enrollButtonText}>Inscribirse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  courseImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  headerContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    marginRight: 6,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  commentButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  commentText: {
    fontSize: 14,
    color: 'black',
  },
  enrollButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
  },
  enrollButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
