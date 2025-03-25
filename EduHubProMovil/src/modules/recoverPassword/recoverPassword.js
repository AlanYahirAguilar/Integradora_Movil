import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Sidebar from '../../components/SideBar';

const RecoverPassword = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  return (
    <View style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      {/* Sección superior con imagen e indicación */}
      <View style={styles.header}>
        <Text style={styles.title}>¿Perdiste u olvidaste tu contraseña?</Text>
        {/* Imagen de recuperación de contraseña */}
        <Image source={require('../../../assets/imagen4.png')} style={styles.image} />
      </View>
      
      {/* Sección inferior con formulario */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Ingresa tu correo</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico" 
          keyboardType="email-address" 
          value={email} 
          onChangeText={setEmail} 
        />
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Recuperar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#8A2BE2', padding: 20, alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  image: { width: 150, height: 150, marginTop: 10 }, // Ajusta el tamaño de la imagen aquí
  formContainer: { padding: 20, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#4B0082', marginBottom: 10 },
  input: { width: '90%', borderWidth: 1, borderColor: '#ccc', borderRadius: 25, padding: 10, backgroundColor: '#f5f5f5' },
  button: { marginTop: 20, backgroundColor: '#4B0082', padding: 12, borderRadius: 25, width: '60%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RecoverPassword;