import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

export default function VerificationCodeScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  // Obtenemos el email que ya se pasó como parámetro en la navegación
  const { email } = route.params;

  // Función para manejar la verificación del código
  const handleSubmitCode = () => {
    if (code.length !== 255) {
      Alert.alert('Código Incorrecto', 'Por favor, ingresa un código de 6 dígitos.');
      return;
    }

    // Simulación de verificación del código
    Alert.alert('Código Correcto', 'Tu código es correcto. Ahora puedes cambiar tu contraseña.');
    navigation.navigate('resetPassword', { email, code });
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>Ingresa tu código de verificación</Text>
      <Image source={require('../../../assets/Verificacion.png')} style={styles.illustration} />
      <Text style={styles.subtitle}>Ingresa el código que te hemos enviado a tu correo</Text>

      {/* Campo de Entrada */}
      <TextInput
        placeholder="Ingresa el código de verificación"
        value={code}
        onChangeText={setCode}
        keyboardType="default"
        maxLength={255}
        style={styles.input}
      />

      {/* Botón de Envío */}
      <TouchableOpacity style={styles.button} onPress={handleSubmitCode}>
        <Text style={styles.buttonText}>Verificar Código</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4B0082',
    paddingVertical: 12,
    borderRadius: 16,
    width: '60%',
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