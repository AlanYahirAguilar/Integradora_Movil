import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Carrusel from '../../components/Carrusel';
import Courses from '../../components/Courses';
import Sidebar from '../../components/SideBar';

export default function HomeScreen({ navigation, route }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  return (
    <View style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      <View style={styles.mainContent}>
        <View style={styles.carruselContainer}>
          <Carrusel />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Nuestros Cursos</Text>
          <Courses />
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1, 
  },
  carruselContainer: {
    height: 200,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 16,
    paddingHorizontal: 12, 
    paddingTop: 5,
    color: '#604274'
  },
});
