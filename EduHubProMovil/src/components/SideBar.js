import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidth = new Animated.Value(0); // Valor inicial del ancho del sidebar

  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: isOpen ? 0 : 250, // Ancho del sidebar cuando está abierto
      duration: 300, // Duración de la animación
      useNativeDriver: false, // No usar el native driver para animar propiedades de layout
    }).start(() => setIsOpen(!isOpen)); // Actualiza el estado después de la animación
  };

  return (
    <View style={styles.container}>
      {/* Botón para abrir/cerrar el sidebar */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>☰</Text>
      </TouchableOpacity>

      {/* Sidebar animado */}
      <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
        <Text style={styles.sidebarTitle}>Menú</Text>
        <TouchableOpacity style={styles.sidebarItem}>
          <Text>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Text>Cursos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Text>Perfil</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2, // Asegura que el botón esté por encima del sidebar
  },
  toggleButtonText: {
    fontSize: 24,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height, // Altura completa de la pantalla
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    padding: 16,
    zIndex: 1, // Asegura que el sidebar esté por encima del contenido principal
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sidebarItem: {
    paddingVertical: 10,
  },
});

export default Sidebar;