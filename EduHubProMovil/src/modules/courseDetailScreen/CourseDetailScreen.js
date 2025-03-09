import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CourseDetailScreen = ({ route }) => {
  const { course } = route.params; // Recibe el curso seleccionado

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});

export default CourseDetailScreen;