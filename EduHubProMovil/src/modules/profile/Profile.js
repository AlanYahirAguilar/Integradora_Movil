import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('https://preview.redd.it/prwa3v3e7cu91.jpg?width=1080&crop=smart&auto=webp&s=cb9cc451b72b6b82f29c1cedca8d393f4a20f991'); // Imagen predeterminada
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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
    Alert.alert('Éxito', 'Los cambios han sido guardados correctamente.');
  };

  // Función para cambiar la foto de perfil
  const changeProfileImage = () => {
    // Simulamos la selección de una nueva imagen (en una aplicación real, usarías un módulo como react-native-image-picker)
    const newImage = 'https://preview.redd.it/prwa3v3e7cu91.jpg?width=1080&crop=smart&auto=webp&s=cb9cc451b72b6b82f29c1cedca8d393f4a20f991'; // URL de ejemplo
    setProfileImage(newImage);
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Perfil:</Text>

      {/* Contenedor del Estudiante */}
      <View style={styles.studentContainer}>
        <Text style={styles.studentLabel}>Estudiante:</Text>

        {/* Foto de Perfil */}
        <View style={styles.profileInfo}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
          <TouchableOpacity onPress={changeProfileImage} style={styles.editIconContainer}>
            <Image
              source={require('../../../assets/Editar.png')} // Ícono de lápiz
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Nombre Completo */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={isEditingName}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)}>
            <Image
              source={require('../../../assets/Editar.png')} // Ícono de lápiz
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Correo Electrónico */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            editable={isEditingEmail}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)}>
            <Image
              source={require('../../../assets/Editar.png')} // Ícono de lápiz
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Contraseña */}
        <View style={styles.infoItem}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isEditingPassword}
            editable={isEditingPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setIsEditingPassword(!isEditingPassword)}>
            <Image
              source={require('../../../assets/Editar.png')} // Ícono de lápiz
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón Guardar Cambios */}
      <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
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
  },
  studentContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  studentLabel: {
    backgroundColor: '#800080',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0ff',
    borderRadius: 12,
    padding: 4,
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
    backgroundColor: '#800080',
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
});