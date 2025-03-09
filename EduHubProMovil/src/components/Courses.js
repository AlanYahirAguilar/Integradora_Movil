import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const courses = [
  { id: 1, title: 'React Native', description: 'Desarrolla apps móviles.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', rating: 4 },
  { id: 2, title: 'JavaScript', description: 'Domina JS desde cero.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', rating: 5 },
  { id: 3, title: 'Node.js', description: 'Backend con Node.js.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', rating: 4 },
  { id: 4, title: 'Python', description: 'Programación en Python.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', rating: 5 },
  { id: 5, title: 'UX/UI Design', description: 'Diseño de interfaces.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', rating: 3 },
  { id: 6, title: 'SQL & Databases', description: 'Bases de datos.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', rating: 4 },
];

const Courses = () => {
  const navigation = useNavigation();

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
      onPress={() => navigation.navigate('CourseDetail', { course })}
    >
      <Image source={{ uri: course.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.cardDescription}>{course.description}</Text>
      {renderStars(course.rating)}
    </TouchableOpacity>
  );

  const firstHalf = courses.slice(0, Math.ceil(courses.length / 2));
  const secondHalf = courses.slice(Math.ceil(courses.length / 2));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Nuevos Cursos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {firstHalf.map(renderCourse)}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {secondHalf.map(renderCourse)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  scrollView: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 160,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
});

export default Courses;
