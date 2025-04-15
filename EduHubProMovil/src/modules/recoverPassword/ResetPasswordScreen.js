import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import UserService from '../../services/UserService';

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, code } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Función para manejar el cambio de contraseña
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      return Alert.alert('Campos requeridos', 'Debes completar ambos campos de contraseña.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Contraseñas no coinciden', 'Las contraseñas deben coincidir.');
    }

    if (password.length < 8) {
      return Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres.');
    }

    try {
      await UserService.resetPassword(code, email, password);
      Alert.alert(
        'Éxito',
        'Tu contraseña se ha actualizado correctamente.',
        [{ text: 'OK', onPress: () => navigation.navigate('signIn') }],
        { cancelable: false }
      );
    } catch (error) {
      const errorMessage = error.message || 'No se pudo restablecer la contraseña.';
      Alert.alert('Error', errorMessage);
    }
  };
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>Restablecer contraseña</Text>
      <Image source={require('../../../assets/Reset.png')} style={styles.illustration} />

      {/* Campos de Entrada */}
      <TextInput
        placeholder="Nueva contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Botón de Envío */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BE6DC0',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '80%',
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  illustration: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 15,
  },
});