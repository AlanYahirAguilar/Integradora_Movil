import React, { useEffect, useRef, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable, 
  Image, Modal, Clipboard, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Sidebar = ({ isOpen, toggleSidebar, navigation }) => {
  const sidebarWidth = useRef(new Animated.Value(isOpen ? 250 : 0)).current;
  const overlayOpacity = useRef(new Animated.Value(isOpen ? 0.5 : 0)).current;
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar el modal
  
    useEffect(() => {
      // Cargar datos del usuario desde AsyncStorage
      const loadUserData = async () => {
        try {
          const storedUserImage = await AsyncStorage.getItem('profileImage');
          const storedUserName = await AsyncStorage.getItem('profileName');
  
          if (storedUserImage && storedUserName) {
            setUserImage(storedUserImage);
            setUserName(storedUserName);
          }
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        }
      };
  
      loadUserData();
    }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sidebarWidth, {
        toValue: isOpen ? 250 : 0,
        duration: 150, // Reducir la duración para una animación más rápida
        useNativeDriver: false, // No compatible con 'width' directamente
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 0.5 : 0,
        duration: 120, // Reducir la duración para una animación más rápida
        useNativeDriver: true, // Compatible con 'opacity'
      }),
    ]).start();
  }, [isOpen]);

  const copyToClipboard = async () => {
    const supportEmail = 'SupportEduHubP@gmail.com';
    await Clipboard.setString(supportEmail);
    Alert.alert('Correo copiado', `Envianos un correo a ${supportEmail}, te ayudaremos a resolver tu problema`);
  };

  return (
    isOpen && (
      <Pressable style={styles.overlay} onPress={toggleSidebar}>
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          {/* Header */}
          <View style={styles.header}>
          <TouchableOpacity style={styles.profileButton} >
    {userImage ? (
      <Image source={{ uri: userImage }} style={styles.userImage} />
    ) : (
      <Image source={require('../../assets/Test.png')} style={styles.userImage} />
    )}
  </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
        {/* Botón para ir al perfil */}
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('perfil')}>
          <Image style={styles.icon} source={require('../../assets/ReEscribir.png')} />
        </TouchableOpacity>
      </View>

          {/* Menu Items */}
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.itemText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('mis cursos')}>
            <Text style={styles.itemText}>Mis Cursos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItemDropdown}>
            <Text style={styles.itemText}>Categorias</Text>
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('informatica')}>
                <Text style={styles.dropdownItemText}>Informática</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('programacion')}>
                <Text style={styles.dropdownItemText}>Programación</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('comunicacion')}>
                <Text style={styles.dropdownItemText}>Comunicación</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('desarrollo')}>
                <Text style={styles.dropdownItemText}>Desarrollo Web</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('iot')}>
                <Text style={styles.dropdownItemText}>IoT</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('PendingEnrollments')}>
            <Text style={styles.itemText}>Inscripciones Pendientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('PaymentInfo')}>
            <Text style={styles.itemText}>Información de Pago</Text>
          </TouchableOpacity>
          
          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('signIn')}>
              <Text style={styles.footerItemText}>Cerrar Sesión</Text>
              <Image source={require('../../assets/Exit.png')} style={styles.iconic2} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.footerItem} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.footerItemText}>Ayuda y Soporte</Text>
              <Image source={require('../../assets/Support.png')} style={styles.iconic} />
            </TouchableOpacity>
          </View>

          {/* Modal de Ayuda y Soporte */}
          <Modal visible={isModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Título del Modal */}
                <Text style={styles.modalTitle}>Envíanos un correo:</Text>

                {/* Dirección de Correo */}
                <TouchableOpacity onPress={copyToClipboard} style={styles.emailContainer}>
                  <Text style={styles.emailText}>SupportEduHubP@gmail.com</Text>
                  <Image source={require('../../assets/Copy.png')} style={styles.copyIcon} />
                </TouchableOpacity>

                {/* Botón para Cerrar el Modal */}
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 5,
  },
  sidebarItemDropdown: {
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
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
    marginTop: 55,
    width: '100%',
  },
  footerItem: {
    paddingVertical: 12,
    marginVertical: 5,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
  },
  footerItemText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    marginBottom: 10, 
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Asegura que el nombre ocupe el espacio disponible
    textAlign: 'left', // Centra el nombre horizontalmente
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Hace que la imagen sea circular
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 16,
    color: '#800080',
    marginRight: 8,
  },
  copyIcon: {
    width: 20,
    height: 20,
    tintColor: '#800080',
  },
  closeButton: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconic: {
    width: 24,
    height: 24,
    marginRight: 8, 
    marginLeft: 50, 
  },
  iconic2: {
    width: 26,
    height: 26,
    marginRight: 8, 
    marginLeft: 70, 
  },
});

export default Sidebar;