import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidth = useRef(new Animated.Value(0)).current; // Mantiene el valor entre renders

  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: isOpen ? 0 : 200, 
      duration: 200,
      useNativeDriver: false,
    }).start(() => setIsOpen(!isOpen));
  };

  return (
    <View style={styles.container}>
      {!isOpen && (
        <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>☰</Text>
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.sidebarTitle}>Menú</Text>
        <TouchableOpacity style={styles.sidebarItem}><Text>Inicio</Text></TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}><Text>Cursos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}><Text>Perfil</Text></TouchableOpacity>
      </Animated.View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: Dimensions.get('window').height,
  },
  toggleButton: {
    padding: 10,
    position: 'absolute',
    zIndex: 3,
  },
  toggleButtonText: {
    fontSize: 24,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    padding: 16,
    zIndex: 2,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
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