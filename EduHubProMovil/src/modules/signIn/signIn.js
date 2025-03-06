// src/modules/signIn/signIn.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';

const SignIn = ({ navigation }) => {
  // Lógica para "INICIA SESIÓN"
  const handleLogin = () => {
    // Aquí iría la navegación o la lógica de inicio de sesión
    // Por ejemplo: navigation.replace('Home');
  };

  // Lógica para "REGISTRARSE"
  const handleRegister = () => {
    // Podrías navegar a otra pantalla o procesar el registro en la misma
    // Ejemplo: navigation.navigate('signUp');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección superior: Morado + "¿Ya eres miembro?" */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>¿Ya eres miembro?</Text>
        <Text style={styles.subtitle}>
          Inicia sesión y sigue disfrutando de todo nuestro contenido
        </Text>

        {/* Imagen en un círculo blanco (ajusta el require si tu logo está en otra ruta) */}
        <View style={styles.imageCircle}>
          <Image
            source={require('../../../assets/signIn.png')}
            style={styles.image}
          />
        </View>

        {/* Botón de "INICIA SESIÓN" */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>INICIA SESIÓN</Text>
        </TouchableOpacity>
      </View>

      {/* Sección inferior: fondo blanco + campos de "Registrarse" */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerTitle}>Registrarse</Text>

        {/* Campos de texto de ejemplo */}
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#999"
          secureTextEntry
        />

        {/* Botón de "REGISTRARSE" */}
       <TouchableOpacity
  style={styles.registerButton}
  onPress={() => navigation.navigate('SignUp')}
>
  <Text style={styles.registerButtonText}>REGISTRARSE</Text>
</TouchableOpacity>

        {/* Texto para registro con Google */}
        <Text style={styles.googleText}>
          O REGÍSTRATE CON TU CUENTA DE GOOGLE
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#AA39AD', // Morado principal
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden', // para recortar la imagen en forma circular
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  loginButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 2, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  registerTitle: {
    fontSize: 22,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
  },
  registerButton: {
    backgroundColor: '#604274',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'center', // Centra el botón horizontalmente
    width: 200,          // Ancho fijo (ajusta según tu preferencia)
    elevation: 2,        // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
  },
});
