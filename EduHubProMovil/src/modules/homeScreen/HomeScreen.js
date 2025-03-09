import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Carrusel from '../../components/Carrusel';
import Courses from '../../components/Courses';
import Sidebar from '../../components/SideBar';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Sidebar debe estar fuera del flujo principal */}
      <Sidebar />
      
      {/* Sección principal */}
      <View style={styles.mainContent}>
        <View style={styles.carruselContainer}>
          <Carrusel />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Cursos Disponibles</Text>
          <Courses />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Asegura que Sidebar y el contenido estén en línea
  },
  mainContent: {
    flex: 1, 
  },
  carruselContainer: {
    height: 200, // Espacio fijo para el carrusel
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
});