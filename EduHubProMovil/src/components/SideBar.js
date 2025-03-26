import React, { useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Sidebar = ({ isOpen, toggleSidebar, navigation }) => {
  const sidebarWidth = useRef(new Animated.Value(isOpen ? 250 : 0)).current;
  const overlayOpacity = useRef(new Animated.Value(isOpen ? 0.5 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarWidth, {
        toValue: isOpen ? 250 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 0.5 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen]);

  return (
    isOpen && (
      <Pressable style={styles.overlay} onPress={toggleSidebar}>
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('perfil')}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <Text style={styles.userName}>Johanna zuel</Text>
          </View>

          {/* Menu Items */}
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Home')}><Text style={styles.itemText}>Inicio</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('mis cursos')}><Text style={styles.itemText}>Mis Cursos</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItemDropdown}>
            <Text style={styles.itemText}>Categorias</Text>
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('informatica')}><Text style={styles.dropdownItemText}>Informatica</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('programacion')}><Text style={styles.dropdownItemText}>Programación</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('comunicacion')}><Text style={styles.dropdownItemText}>Comunicación</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('desarrollo')}><Text style={styles.dropdownItemText}>Desarrollo web</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('iot')}><Text style={styles.dropdownItemText}>IOT</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('PendingEnrollments')}><Text style={styles.itemText}>Inscripciones Pendientes</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('PaymentInfo')}><Text style={styles.itemText}>Información de Pago</Text></TouchableOpacity>
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => navigation.navigate('voucher-verification')}
          >
            <Text style={styles.itemText}>Verificación de Voucher</Text>
          </TouchableOpacity>

          

          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => navigation.navigate('recoverPass')}
          >
            <Text style={styles.itemText}>Recuperar Contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => navigation.navigate('coursePayment')}
          >
            <Text style={styles.itemText}>Pagos de Cursos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => navigation.navigate('course-module-details')}
          >
            <Text style={styles.itemText}>Detalles de Módulo</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerItem}><Text style={styles.footerItemText}>Cerrar Sesión</Text></TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}><Text style={styles.footerItemText}>Ayuda y Soporte</Text></TouchableOpacity>
          </View>
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
    boxShadow: '4px 4px 5px rgba(0, 0, 0, 0.3)',
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sidebarItem: {
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  sidebarItemDropdown: {
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  dropdown: {
    marginTop: 5,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'relative',
    marginTop:  55,
    width: '100%',
  },
  footerItem: {
    paddingVertical: 12,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  footerItemText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Sidebar;