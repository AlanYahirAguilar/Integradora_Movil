import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const courses = [
  { id: 1, title: 'Curso de React Native', description: 'Aprende a desarrollar aplicaciones móviles con React Native.' },
  { id: 2, title: 'Curso de JavaScript', description: 'Domina JavaScript desde cero.' },
  { id: 3, title: 'Curso de Node.js', description: 'Aprende a construir aplicaciones backend con Node.js.' },
];

const Courses = () => {
  return (
    <View style={styles.coursesContainer}>
      {courses.map((course) => (
        <View key={course.id} style={styles.card}>
          <Text style={styles.cardTitle}>{course.title}</Text>
          <Text style={styles.cardDescription}>{course.description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  coursesContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default Courses;