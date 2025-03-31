import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // Biblioteca de Expo para seleccionar imágenes

export default function Profile({ route, navigation }) {
  const [name, setName] = useState('Jhoana Zuel');
  const [email, setEmail] = useState('example@gmail.com');
  const [password, setPassword] = useState('123456');
  const [profileImage, setProfileImage] = useState('https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'); // Imagen predeterminada

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const [currentField, setCurrentField] = useState(''); // Campo actual en edición (name, email, password)
  const [tempValue, setTempValue] = useState(''); // Valor temporal para el campo en edición

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Función para cargar datos desde AsyncStorage
  const loadData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('profileName');
      const storedEmail = await AsyncStorage.getItem('profileEmail');
      const storedPassword = await AsyncStorage.getItem('profilePassword');
      const storedImage = await AsyncStorage.getItem('profileImage');

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPassword) setPassword(storedPassword);
      if (storedImage) setProfileImage(storedImage);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    loadData();
  }, []);

  // Función para guardar datos en AsyncStorage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('profileName', name);
      await AsyncStorage.setItem('profileEmail', email);
      await AsyncStorage.setItem('profilePassword', password);
      await AsyncStorage.setItem('profileImage', profileImage);
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  // Manejar el guardado de cambios
  const handleSaveChanges = () => {
    saveData();
    Alert.alert(
      'Éxito',
      'Los cambios han sido guardados correctamente.',
      [{ text: 'OK', onPress: () => console.log('Cambios guardados') }],
      { cancelable: true }
    );
  };

  // Función para cambiar la foto de perfil con expo-image-picker
  const changeProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar una imagen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Abrir el modal para editar un campo específico
  const openEditModal = (field, value) => {
    setCurrentField(field);
    setTempValue(value);
    setIsModalVisible(true);
  };

  // Guardar los cambios realizados en el modal
  const saveModalChanges = () => {
    if (currentField === 'name') {
      setName(tempValue);
    } else if (currentField === 'email') {
      setEmail(tempValue);
    } else if (currentField === 'password') {
      setPassword(tempValue);
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Perfil:</Text>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      {/* Contenedor del Estudiante */}
      <View style={styles.studentContainer}>
        <Text style={styles.studentLabel}>Estudiante:</Text>

        {/* Foto de Perfil Centrada */}
        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={changeProfileImage} style={styles.avatarContainer}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={[styles.editIconContainer, { backgroundColor: '#604274' }]}>
              <Image source={require('../../../assets/Camera.png')} style={styles.editIcon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Nombre Completo */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={false}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => openEditModal('name', name)}
            style={[styles.editIconContainer, { backgroundColor: '#604274' }]}
          >
            <Image source={require('../../../assets/Editar.png')} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Correo Electrónico */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            editable={false}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => openEditModal('email', email)}
            style={[styles.editIconContainer, { backgroundColor: '#604274' }]}
          >
            <Image source={require('../../../assets/Editar.png')} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Contraseña */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={false}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => openEditModal('password', password)}
            style={[styles.editIconContainer, { backgroundColor: '#604274' }]}
          >
            <Image source={require('../../../assets/Editar.png')} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón Guardar Cambios */}
      <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      {/* Modal de Edición */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar {currentField}</Text>
            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              style={styles.modalInput}
            />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#604274',
  },
  studentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  studentLabel: {
    backgroundColor: '#65739F',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  input: {
    flex: 2,
    marginLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#604274',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    backgroundColor: '#65739F',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center'
  },
  modalSaveButton: {
    backgroundColor: '#604274',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center'
  }
}); 