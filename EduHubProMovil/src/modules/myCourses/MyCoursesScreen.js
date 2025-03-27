// MyCoursesScreen.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Importar Progress.Bar
import { useNavigation } from '@react-navigation/native';

export default function MyCoursesScreen({route}) {
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
<Sidebar 
                  isOpen={isSidebarOpen} 
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                  navigation={navigation} 
                />
      {/* Cards de Cursos */}
      <View style={styles.coursesContainer}>
        {courses.map((course) => (
          <TouchableOpacity key={course.id} onPress={() => handleCoursePress(course.id)} style={styles.courseCard}>
            {/* Usar uri para imágenes remotas */}
            <Image source={{ uri: course.image }} style={styles.courseImage} />
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  courseImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  courseInfo: {
    marginTop: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#800080',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});