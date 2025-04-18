import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable,
  Image, Modal, Clipboard, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import CategoryService from '../services/CategoryService';

const { width, height } = Dimensions.get('window');

const Sidebar = ({ isOpen, toggleSidebar, navigation }) => {
  const sidebarWidth = useRef(new Animated.Value(isOpen ? 250 : 0)).current;
  const overlayOpacity = useRef(new Animated.Value(isOpen ? 0.5 : 0)).current;
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

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
        /* console.error('Error al cargar datos del usuario:', error); */
      }
    };

    loadUserData();
  }, []);

  // Cargar categorías cuando se abre el sidebar
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);

      const categoriesData = await CategoryService.getActiveCategories();
      setCategories(categoriesData);
    } catch (error) {
      //    console.error('Error al cargar categorías en Sidebar:', error);
      setCategoriesError('No se pudieron cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

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

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Eliminar token y datos de usuario
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLE);

      // Redirigir a la pantalla de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'signIn' }],
      });
    } catch (error) {
      // console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión. Intente nuevamente.');
    }
  };

  // Función para navegar a la pantalla de categoría
  const navigateToCategory = (categoryId, categoryName) => {
    navigation.navigate('Category', {
      categoryId,
      categoryName,
    });
    toggleSidebar(); // Cerrar sidebar al navegar
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

          {/* Contenido con scroll */}
          <ScrollView
            style={styles.scrollContent}
            nestedScrollEnabled={true} // Habilita el scroll anidado
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {/* Menu Items */}
            <TouchableOpacity style={styles.sidebarItem} onPress={() => {
              navigation.navigate('Home');
              toggleSidebar();
            }}>
              <Text style={styles.itemText}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItemDropdown}>
          <Text style={styles.itemText}>Cursos</Text>
          <View style={styles.dropdown}>
          {/* Subbotón para "Inscritos" */}
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              navigation.navigate('Inscritos'); // Redirige a la vista "Inscritos"
              toggleSidebar(); // Cierra el sidebar
              }}
                >
          <Text style={styles.dropdownItemText}>Inscritos</Text>
          </TouchableOpacity>

           {/* Subbotón para "En Curso" */}
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
            navigation.navigate('En curso'); // Redirige a la vista "En Curso"
            toggleSidebar(); // Cierra el sidebar
            }}
          >
          <Text style={styles.dropdownItemText}>En Curso</Text>
          </TouchableOpacity>
          </View>
          </TouchableOpacity>
            

            <TouchableOpacity style={styles.sidebarItemDropdown}>
              <Text style={styles.itemText}>Categorías</Text>
              <View style={styles.dropdown}>
                {loadingCategories ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#604274" />
                  </View>
                ) : categoriesError ? (
                  <TouchableOpacity style={styles.errorItem} onPress={loadCategories}>
                    <Text style={styles.errorText}>Error. Toque para reintentar</Text>
                  </TouchableOpacity>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <TouchableOpacity
                      key={category.categoryId}
                      style={styles.dropdownItem}
                      onPress={() => navigateToCategory(category.categoryId, category.name)}
                    >
                      <Text style={styles.dropdownItemText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity style={styles.dropdownItem} onPress={loadCategories}>
                    <Text style={styles.dropdownItemText}>No hay categorías</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => {
              navigation.navigate('PendingEnrollments');
              toggleSidebar();
            }}>
              <Text style={styles.itemText}>Inscripciones Pendientes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => {
              navigation.navigate('PaymentInfo');
              toggleSidebar();
            }}>
              <Text style={styles.itemText}>Información de Pago</Text>
            </TouchableOpacity>

          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 5,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    paddingTop: 50,
    paddingHorizontal: 15,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  profileButton: {
    padding: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingBottom: 10,
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sidebarItemDropdown: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
    paddingBottom: 20,
    width: '100%',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  footerItemText: {
    fontSize: 16,
    color: '#333',
  },
  iconic: {
    width: 20,
    height: 20,
  },
  iconic2: {
    width: 25,
    height: 25,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    marginRight: 10,
    color: '#604274',
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  closeButton: {
    backgroundColor: '#604274',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  errorItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#ff0000',
  },
  sidebarItemDropdown: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Sidebar;