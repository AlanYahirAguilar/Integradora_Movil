import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export default function Profile() {
  const [name, setName] = useState('Ximena Renata Esqueda Soto');
  const [email, setEmail] = useState('example.proyect@gmail.com');
  const [password, setPassword] = useState('***************');

  const handleSaveChanges = () => {
    // Aquí puedes implementar la lógica para guardar los cambios
    console.log('Guardar cambios:', { name, email, password });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('./path/to/menu-icon.png')} style={styles.menuIcon} />
        </TouchableOpacity>
        <Image source={require('./path/to/logo.png')} style={styles.logo} />
        <TouchableOpacity>
          <Image source={require('./path/to/search-icon.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Perfil */}
      <Text style={styles.title}>Perfil:</Text>

      {/* Estudiante */}
      <View style={styles.studentContainer}>
        <Text style={styles.studentLabel}>Estudiante:</Text>
        <View style={styles.profileInfo}>
          <Image source={require('./path/to/user-avatar.png')} style={styles.avatar} />
          <TouchableOpacity>
            <Image source={require('./path/to/edit-icon.png')} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} />
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        </View>
      </View>

      {/* Botón Guardar Cambios */}
      <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#800080',
    padding: 10,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  logo: {
    width: 50,
    height: 50,
  },
  searchIcon: {
    width: 24,
    height: 24,
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
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
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
