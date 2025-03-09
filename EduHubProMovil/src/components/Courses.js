import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const courses = [
  { id: 1, title: 'Curso de React Native', description: 'Aprende a desarrollar apps móviles con React Native.' },
  { id: 2, title: 'Curso de JavaScript', description: 'Domina JavaScript desde cero.' },
  { id: 3, title: 'Curso de Node.js', description: 'Construye aplicaciones backend con Node.js.' },
];

const Courses = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.coursesContainer}>
      {courses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.card}
          onPress={() => navigation.navigate('CourseDetail', { course })}
        >
          <Text style={styles.cardTitle}>{course.title}</Text>
          <Text style={styles.cardDescription}>{course.description}</Text>
        </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#ddd',
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