import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { MESSAGES } from '../../constants';
import UserService from '../../services/UserService';

const RecoverPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    let timer;
    if (errorMessage || successMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  // Función para mostrar mensajes de error o éxito
  const showMessage = (message, isError = false) => {
    /* console.log(message); */

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }

    // También establecemos el mensaje en el estado para mostrarlo visualmente
    if (isError) {
      setErrorMessage(message);
    } else {
      setSuccessMessage(message);
    }
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'El correo electrónico no puede estar vacío';
    }

    if (email.length > 255) {
      return 'El correo electrónico no puede exceder los 255 caracteres';
    }

    return null; // No hay error
  };

  const handleResetPassword = async () => {
    if (!email) {
      return showMessage(MESSAGES.FIELDS_REQUIRED, true);
    }

    const emailError = validateEmail(email);
    if (emailError) {
      showMessage(emailError, true);
      return;
    }

    try {
      await UserService.getResetCode(email);

      showMessage('Hemos enviado un código de verificación a tu correo.');
      navigation.navigate('verificacionCode', { email });
    } catch (error) {
      const errorMessage = error.message || 'Error al enviar correo de recuperación';
      showMessage(errorMessage, true);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Mensajes de error o éxito */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {successMessage ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

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

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Recuperar</Text>
        </TouchableOpacity>
      </View>
    </View >
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

  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
  },
});

export default RecoverPassword;