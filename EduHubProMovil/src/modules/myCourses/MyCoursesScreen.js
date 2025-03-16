// MyCoursesScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Importar Progress.Bar
import { useNavigation } from '@react-navigation/native';

export default function MyCoursesScreen ({ route, navigate }) {
  const navigation = useNavigation();

  const courses = [
    {
      id: '1',
      title: 'Hacking Ético: El Arte de Defender',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzxn75BpAlXGDFZdXKqJYSqJmVpi55NipkYA&s',
      progress: 0.69,
      instructor: 'Dr. Nicolas Kozak',
    },
    {
      id: '2',
      title: 'Base de datos en la nube: MongoDB',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzxn75BpAlXGDFZdXKqJYSqJmVpi55NipkYA&s',
      progress: 0.80,
      instructor: 'Dr. Gustavo Peralta',
    },
    // Agrega más cursos aquí...
  ];

  const handleCoursePress = (courseId) => {
    navigation.navigate('Modules', { courseId });
  };

  return (
    <View style={styles.container}>

      {/* Mis Cursos */}
      <Text style={styles.title}>Mis Cursos:</Text>

      {/* Cards de Cursos */}
      <View style={styles.coursesContainer}>
        {courses.map((course) => (
          <TouchableOpacity key={course.id} onPress={() => handleCoursePress(course.id)} style={styles.courseCard}>
            <Image source={course.image} style={styles.courseImage} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.instructor}>{course.instructor}</Text>
              <ProgressBar progress={course.progress} width={null} style={styles.progressBar} /> {/* Usar Progress.Bar */}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
  
  },
  coursesContainer: {
   
  },
  courseCard: {

  },
  courseImage: {

  },
  courseInfo: {
 
  },
  courseTitle: {

  },
  instructor: {
 
  },
  progressBar: {

  },
});
