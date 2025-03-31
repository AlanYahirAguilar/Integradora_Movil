import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Sidebar from '../../components/SideBar';

const courses = [
  { id: '1', title: 'Hackers Éticos: El Arte de Defender', author: 'Dr. Iván Kernel', price: 'MX$980' },
  { id: '2', title: 'Por que el america es el mas grande', author: 'Dr. Iván Kernel', price: 'MX$800' },
  { id: '3', title: 'Buenas practicas para programacion', author: 'Dr. Iván Kernel', price: 'MX$1000' },
  { id: '4', title: 'como irle al america', author: 'Dr. Iván Kernel', price: 'MX$1520' },
  { id: '5', title: 'Aprender a animar', author: 'Dr. Iván Kernel', price: 'MX$560' },
  { id: '6', title: 'desarrollar tu propio comic desde 0', author: 'Dr. Iván Kernel', price: 'MX$493' },
];

const CoursePaymentsScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  useEffect(() => {
    const filtered = courses
      .filter(course => course.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title));
    setFilteredCourses(filtered);
  }, [search]);

  return (
    <View style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Image source={require('../../../assets/Filtrar.png')} style={styles.icon} />
          <Text style={styles.title}>Búsqueda Avanzada:</Text>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Escribe el nombre del curso"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      {/* Botones de ordenamiento */}
      <View style={styles.sortButtons}>
        <TouchableOpacity style={styles.sortButton}><Text>A - Z</Text></TouchableOpacity>
        <TouchableOpacity style={styles.sortButton}><Text>Z - A</Text></TouchableOpacity>
        <TouchableOpacity style={styles.sortButton}><Text>Menor a mayor</Text></TouchableOpacity>
        <TouchableOpacity style={styles.sortButton}><Text>Mayor a menor</Text></TouchableOpacity>
      </View>
      
      {/* Lista de cursos */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={require('../../../assets/Test.png')} style={styles.image} />
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    marginBottom: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 10, 
    color: '#604274'
  },
  searchInput: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    borderRadius: 14,
    marginBottom: 10, 
    backgroundColor: '#fff' 
  },
  sortButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  sortButton: { 
    padding: 8, 
    backgroundColor: '#65739F', 
    borderRadius: 14 
  },
  card: {
    width: Dimensions.get('window').width / 2 - 20, // Ancho fijo basado en la pantalla
    height: 250, // Altura fija
    backgroundColor: '#fff',
    margin: 5,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center', // Centrar contenido verticalmente
  },
  image: { 
    width: 140, 
    height: 140,
    borderRadius: 8, 
    marginBottom: 10 
  },
  courseTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  author: { 
    fontSize: 12, 
    color: '#666' 
  },
  price: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    marginBottom: 10, 
  },
});

export default CoursePaymentsScreen;