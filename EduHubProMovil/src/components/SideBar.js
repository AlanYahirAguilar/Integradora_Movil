import React, { useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarWidth = useRef(new Animated.Value(isOpen ? 250 : 0)).current;
  const overlayOpacity = useRef(new Animated.Value(isOpen ? 0.5 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarWidth, {
        toValue: isOpen ? 250 : 0,
        duration: 25,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 0.5 : 0,
        duration: 25,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen]);

  return (
    isOpen && (
      <Pressable style={styles.overlay} onPress={toggleSidebar}>
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          <TouchableOpacity style={styles.sidebarItem}><Text style={styles.itemText}>Inicio</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem}><Text style={styles.itemText}>Mis Cursos</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem}><Text style={styles.itemText}>Categorias</Text></TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.overlayBackground, { opacity: overlayOpacity }]} />
      </Pressable>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 2,
  },
  overlayBackground: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'black',
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
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
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
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sidebar;
