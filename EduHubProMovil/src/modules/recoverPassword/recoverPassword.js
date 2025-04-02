import React, { useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const RecoverPassword = ({ navigation, route }) => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>


      {/* Sección superior con imagen e indicación */}
      <View style={styles.header}>
        <Text style={styles.title}>¿Perdiste u olvidaste tu contraseña?</Text>
        {/* Imagen de recuperación de contraseña */}
        <Image source={require('../../../assets/Group 190.png')} style={styles.image} />
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
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('verificacionCode', { email})}>
          <Text style={styles.buttonText}>Recuperar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#8A2BE2', padding: 20, alignItems: 'center' },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  image: { width: 330, height: 240, marginTop: 40 }, // Ajusta el tamaño de la imagen aquí
  formContainer: { padding: 30, alignItems: 'center' },
  label: { fontSize: 24, fontWeight: 'bold', color: '#4B0082', marginBottom: 10 },
  input: { width: '90%', borderWidth: 1, borderColor: '#ccc', borderRadius: 25, padding: 10, backgroundColor: '#f5f5f5' },
  button: { marginTop: 20, backgroundColor: '#4B0082', padding: 12, borderRadius: 25, width: '60%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RecoverPassword;