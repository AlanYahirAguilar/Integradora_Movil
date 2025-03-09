import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const courses = [
  { id: 1, title: 'React Native', autor: 'Prof. Clara Bitwise', description: 'Desarrolla apps móviles.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 4, precio: 'MX$ 780' },
  { id: 2, title: 'JavaScript', autor: 'Dr. Nolan Kernel', description: 'Domina JS desde cero.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 5, precio: 'MX$ 980' },
  { id: 3, title: 'Node.js', autor: 'Ing. Tessa Cachewood', description: 'Backend con Node.js.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 4, precio: 'MX$ 567'},
  { id: 4, title: 'Python', autor: 'Prof. Clara Bitwise',description: 'Programación en Python.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 5, precio: 'MX$ 936'},
  { id: 5, title: 'UX/UI Design', autor: 'Dr. Nolan Kernel', description: 'Diseño de interfaces.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 3, precio: 'MX$ 167'},
  { id: 6, title: 'SQL & Databases', autor: 'Prof. Clara Bitwise', description: 'Bases de datos.', image: 'https://img.freepik.com/vector-gratis/concepto-diseno-web-dibujado-mano_23-2147839737.jpg', numRating: 4.2, rating: 4, precio: 'MX$ 925'},
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
      <Text style={styles.autor}>{course.autor}</Text>
      <Text style={styles.cardDescription}>{course.description}</Text>
      <Text>
      <Text style={styles.rank}>{course.numRating}</Text> {renderStars(course.rating)}
    </Text>
      <Text style={styles.textPrice}>{course.precio}</Text>
    </TouchableOpacity>
  );

  const firstHalf = courses.slice(0, Math.ceil(courses.length / 2));
  const secondHalf = courses.slice(Math.ceil(courses.length / 2));

  return (
    <View style={styles.container}>
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
    alignItems: 'left',
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
    textAlign: 'left',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 5,
  },
  starsContainer: {
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  textPrice:{
    fontSize: 14,
    fontWeight: 'bold',
  },
  rank:{
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'space-between'
  },
  autor:{
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Courses;
