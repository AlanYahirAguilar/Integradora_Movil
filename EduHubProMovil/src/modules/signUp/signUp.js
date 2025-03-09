// src/modules/signUp/signUp.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import HomeScreen from '../homeScreen/HomeScreen';

const SignUp = ({ navigation }) => {
  // Lógica para "INICIA SESIÓN" (arriba)
  const handleLogin = () => {
    // Si quisieras redirigir a signIn:
    // navigation.navigate('SignIn');
  };

  // Lógica para "REGISTRARSE" (abajo)
  const handleSignUp = () => {
    // Aquí pones la lógica de registro
    // Por ejemplo: navigation.replace('Home'); 
    // o la pantalla a donde quieras dirigir al usuario tras registrarse
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección superior (Iniciar Sesión) */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* Campos para correo y contraseña */}
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

        {/* Botón de "INICIA SESIÓN" */}
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home', { HomeScreen })}>
          <Text style={styles.loginButtonText}>INICIA SESION</Text>
        </TouchableOpacity>
        
        {/* Texto para iniciar sesión con Google */}
        <Text style={styles.googleText}>
          O INICIA SESION CON TU CUENTA DE GOOGLE
        </Text>
        
        <Image
          source={require('../../../assets/signup.png')} 
          style={styles.illustration}
        />
      </View>

      {/* Sección inferior (¿Eres nuevo aquí?) */}
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle}>¿Eres nuevo aquí?</Text>
        <Text style={styles.bottomSubtitle}>
          Regístrate y conoce todo lo que nuestro sistema ofrece para el aprendizaje
        </Text>

        {/* Si tienes una ilustración para esta sección, la puedes colocar aquí */}
        {/* <Image source={require('../../../assets/myIllustration.png')} style={styles.illustration} /> */}

        {/* Botón de "REGISTRARSE" */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
          <Text style={styles.registerButtonText}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  // Sección superior
  topContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF', // Blanco
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#604274', 
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'center', 
    width: 200, 
    elevation: 2, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  // Sección inferior
  bottomContainer: {
    backgroundColor: '#AA39AD', // Morado
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 200,
    alignItems: 'center',
  },
  bottomTitle: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bottomSubtitle: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    width: 200,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Opcional: si usas un ícono de Google o ilustración
  // googleIcon: {
  //   width: 30,
  //   height: 30,
  //   alignSelf: 'center',
  //   marginTop: 10,
  // },
   illustration: {
   width: 200,
   height: 200,
   resizeMode: 'contain',
  marginBottom: 20,
  },
});
