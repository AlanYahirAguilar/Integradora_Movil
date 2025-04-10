import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, Modal, ActivityIndicator, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Biblioteca de Expo para seleccionar imágenes
import { STORAGE_KEYS } from '../../constants';
import UserService from '../../services/UserService';
import PaymentService from '../../services/PaymentService'; // Importar PaymentService

export default function Profile({ route, navigation }) {
  const [name, setName] = useState('Jhoana Zuel');
  const [email, setEmail] = useState('example@gmail.com');
  const [password, setPassword] = useState('123456');
  const [profileImage, setProfileImage] = useState('https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'); // Imagen predeterminada
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const [currentField, setCurrentField] = useState(''); // Campo actual en edición (name, email, password)
  const [tempValue, setTempValue] = useState(''); // Valor temporal para el campo en edición
  const [fieldError, setFieldError] = useState(''); // Error específico para el campo en edición

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Cargar datos del perfil desde el backend
  const loadProfileData = async () => {
    try {
      setLoadingProfile(true);
      setError(null);
      
      // Obtener el token para almacenar el userId
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        setUserId(token);
      }
      
      // Obtener perfil desde el backend
      const profileData = await UserService.getUserProfile();
      
      if (profileData) {
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        // No mostramos la contraseña real por seguridad
        setPassword('********');
        
        if (profileData.profilePhotoPath) {
          setProfileImage(profileData.profilePhotoPath);
        } else {
          // Imagen predeterminada si no hay foto de perfil
          setProfileImage('https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg');
        }
        
        // Guardar en AsyncStorage para uso en otras partes de la app
        await AsyncStorage.setItem('profileName', profileData.name || '');
        await AsyncStorage.setItem('profileEmail', profileData.email || '');
        if (profileData.profilePhotoPath) {
          await AsyncStorage.setItem('profileImage', profileData.profilePhotoPath);
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setError('No se pudo cargar la información del perfil. Por favor, intenta nuevamente.');
      
      // Cargar datos locales como fallback
      loadLocalData();
    } finally {
      setLoadingProfile(false);
    }
  };

  // Cargar datos desde AsyncStorage como fallback
  const loadLocalData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('profileName');
      const storedEmail = await AsyncStorage.getItem('profileEmail');
      const storedImage = await AsyncStorage.getItem('profileImage');

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedImage) setProfileImage(storedImage);
      setPassword('********'); // Valor por defecto
    } catch (error) {
      console.error('Error al cargar datos locales:', error);
    }
  };

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    loadProfileData();
  }, []);

  // Validar contraseña
  const validatePassword = (pwd) => {
    if (!pwd || pwd === '') {
      return 'La contraseña no puede estar vacía';
    }
    
    if (pwd.length < 8 || pwd.length > 20) {
      return 'La contraseña debe tener entre 8 y 20 caracteres';
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,20}$/;
    if (!passwordRegex.test(pwd)) {
      return 'La contraseña debe tener al menos una letra mayúscula y un número';
    }
    
    return null; // No hay error
  };

  // Validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email === '') {
      return 'El correo electrónico no puede estar vacío';
    }
    
    if (!emailRegex.test(email)) {
      return 'Ingrese un correo electrónico válido';
    }
    
    return null; // No hay error
  };

  // Validar nombre
  const validateName = (name) => {
    if (!name || name.trim() === '') {
      return 'El nombre no puede estar vacío';
    }
    
    if (name.length > 100) {
      return 'El nombre no puede exceder los 100 caracteres';
    }
    
    return null; // No hay error
  };

  // Función para actualizar el perfil
  const updateProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar datos antes de enviar
      const nameError = validateName(name);
      if (nameError) {
        setError(nameError);
        Alert.alert('Error de validación', nameError);
        return;
      }
      
      const emailError = validateEmail(email);
      if (emailError) {
        setError(emailError);
        Alert.alert('Error de validación', emailError);
        return;
      }
      
      // Solo validar contraseña si ha sido modificada
      if (password !== '********') {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          Alert.alert('Error de validación', passwordError);
          return;
        }
      }
      
      // Preparar los datos del perfil para actualizar
      const profileData = {
        name,
        email,
        password: password === '********' ? null : password,
        profilePhotoPath: profileImage
      };
      
      // Actualizar perfil en el backend
      await UserService.updateUserProfile(profileData);
      
      // Actualizar datos en AsyncStorage
      await AsyncStorage.setItem('profileName', name);
      await AsyncStorage.setItem('profileEmail', email);
      await AsyncStorage.setItem('profileImage', profileImage);
      
      Alert.alert(
        'Éxito',
        'Los cambios han sido guardados correctamente.',
        [{ text: 'Guardar Cambios', onPress: () => console.log('Cambios guardados') }],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      
      // Extraer mensaje de error
      const errorMessage = error.message || 'Error desconocido al actualizar el perfil';
      setError(errorMessage);
      
      // Mostrar alerta con mensaje de error específico
      Alert.alert(
        'Error al actualizar perfil',
        errorMessage,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar la foto de perfil con expo-image-picker
  const changeProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar una imagen.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType ? ImagePicker.MediaType.Images : 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        // Mostrar indicador de carga
        setLoading(true);
        
        try {
          // Obtener la URI de la imagen seleccionada
          const localUri = pickerResult.assets[0].uri;
          console.log('Imagen seleccionada:', localUri);
          
          // Preparar el archivo para subir
          const filename = localUri.split('/').pop();
          
          // Determinar el tipo MIME
          const match = /\.([\w]+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          // Crear el objeto File para web o un objeto similar para React Native
          let fileToUpload;
          
          if (Platform.OS === 'web') {
            // En web, podemos obtener un blob desde la URI
            const response = await fetch(localUri);
            const blob = await response.blob();
            fileToUpload = new File([blob], filename, { type });
          } else {
            // En React Native, creamos un objeto similar a File
            fileToUpload = {
              uri: localUri,
              name: filename,
              type,
            };
          }
          
          console.log('Subiendo archivo:', filename);
          
          // Paso 1: Subir la imagen a Cloudflare usando PaymentService
          const imageUrl = await PaymentService.uploadFile(fileToUpload);
          console.log('Imagen subida exitosamente a Cloudflare. URL:', imageUrl);
          
          // Paso 2: Actualizar la foto de perfil en el backend usando UserService
          const updateResult = await UserService.uploadProfilePhoto(imageUrl);
          console.log('Perfil actualizado con nueva foto:', updateResult);
          
          // Actualizar la URL de la imagen de perfil en el estado local
          setProfileImage(imageUrl);
          
          // Guardar en AsyncStorage para uso en otras partes de la app
          await AsyncStorage.setItem('profileImage', imageUrl);
          
          // Mostrar mensaje de éxito
          Alert.alert(
            'Éxito',
            'La imagen de perfil se ha actualizado correctamente.',
            [{ text: 'OK' }]
          );
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          Alert.alert(
            'Error',
            'No se pudo subir la imagen. Por favor, intenta nuevamente.',
            [{ text: 'OK' }]
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert(
        'Error',
        'No se pudo seleccionar la imagen. Por favor, intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  // Abrir el modal para editar un campo específico
  const openEditModal = (field, value) => {
    setCurrentField(field);
    setTempValue(field === 'password' ? '' : value); // Para contraseña, comenzar con campo vacío
    setFieldError('');
    setIsModalVisible(true);
  };

  // Validar el campo actual en el modal
  const validateCurrentField = () => {
    let error = null;
    
    if (currentField === 'name') {
      error = validateName(tempValue);
    } else if (currentField === 'email') {
      error = validateEmail(tempValue);
    } else if (currentField === 'password') {
      error = validatePassword(tempValue);
    }
    
    if (error) {
      setFieldError(error);
      return false;
    }
    
    setFieldError('');
    return true;
  };

  // Guardar los cambios realizados en el modal
  const saveModalChanges = () => {
    if (!validateCurrentField()) {
      return; // No guardar si hay errores de validación
    }
    
    if (currentField === 'name') {
      setName(tempValue);
    } else if (currentField === 'email') {
      setEmail(tempValue);
    } else if (currentField === 'password') {
      setPassword(tempValue);
    }
    setIsModalVisible(false);
  };

  // Mostrar un indicador de carga mientras se obtiene el perfil
  if (loadingProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#604274" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>Perfil:</Text>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          navigation={navigation}
        />

        {/* Mostrar error si existe */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contenedor del Estudiante */}
        <View style={styles.studentContainer}>
          <Text style={styles.studentLabel}>Estudiante:</Text>

          {/* Foto de Perfil Centrada */}
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={changeProfileImage} style={styles.avatarContainer}>
              <Image 
                source={{ uri: profileImage || 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg' }} 
                style={styles.avatar} 
              />
              <View style={[styles.editIconContainer, { backgroundColor: '#604274' }]}>
                <Image source={require('../../../assets/Camera.png')} style={styles.editIcon} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Nombre Completo */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Nombre Completo</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={name}
                editable={false}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => openEditModal('name', name)}
                style={[styles.editButton, { backgroundColor: '#604274' }]}
              >
                <Image source={require('../../../assets/Editar.png')} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Correo Electrónico */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                editable={false}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => openEditModal('email', email)}
                style={[styles.editButton, { backgroundColor: '#604274' }]}
              >
                <Image source={require('../../../assets/Editar.png')} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={password}
                secureTextEntry
                editable={false}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => openEditModal('password', password)}
                style={[styles.editButton, { backgroundColor: '#604274' }]}
              >
                <Image source={require('../../../assets/Editar.png')} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botón Guardar Cambios */}
        <TouchableOpacity 
          onPress={updateProfile} 
          style={[styles.saveButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        {/* Modal de Edición */}
        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {currentField === 'name' ? 'Editar nombre' : 
                 currentField === 'email' ? 'Editar correo electrónico' : 
                 'Cambiar contraseña'}
              </Text>
              
              <TextInput
                value={tempValue}
                onChangeText={setTempValue}
                style={[styles.modalInput, fieldError ? styles.inputError : null]}
                secureTextEntry={currentField === 'password'}
                placeholder={currentField === 'password' ? 'Ingrese nueva contraseña' : ''}
                autoCapitalize={currentField === 'password' ? 'none' : 'words'}
                keyboardType={currentField === 'email' ? 'email-address' : 'default'}
              />
              
              {/* Mostrar mensaje de error en el modal si existe */}
              {fieldError ? (
                <Text style={styles.modalErrorText}>{fieldError}</Text>
              ) : null}
              
              {currentField === 'password' && (
                <Text style={styles.passwordHint}>
                  La contraseña debe tener entre 8 y 20 caracteres, incluir al menos una letra mayúscula y un número.
                </Text>
              )}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCancelButton}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveModalChanges} style={styles.modalSaveButton}>
                  <Text style={styles.modalButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#604274',
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#cc0000',
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#604274',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#604274',
  },
  studentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 20,
  },
  studentLabel: {
    backgroundColor: '#65739F',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoItem: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  editButton: {
    padding: 10,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#776B80',
    borderRadius: 15,
    padding: 8,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#604274',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#604274',
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#cc0000',
    backgroundColor: '#ffeeee',
  },
  modalErrorText: {
    color: '#cc0000',
    fontSize: 14,
    marginBottom: 8,
  },
  passwordHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalSaveButton: {
    backgroundColor: '#604274',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});