import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';

const SignUp = ({ navigation }) => {
  // Lógica para "INICIA SESIÓN" (arriba)
  const handleLogin = () => {
    navigation.navigate('Home');
  };

  // Lógica para "REGISTRARSE" (abajo)
  const handleSignUp = () => {
    navigation.navigate('Register'); // Reemplaza 'Register' por la ruta correcta
  };

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>INICIA SESIÓN</Text>
        </TouchableOpacity>

        {/* Enlace para recuperar contraseña */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('recoverPass')}
        >
          <Text style={styles.forgotPasswordText}>¿Perdiste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      {/* Sección inferior (¿Eres nuevo aquí?) */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <Text style={styles.bottomTitle}>¿Eres nuevo aquí?</Text>
          <Text style={styles.bottomSubtitle}>
            Regístrate y conoce todo lo que nuestro sistema ofrece para el aprendizaje
          </Text>
          <Image
            source={require('../../../assets/Group 180.png')}
            style={styles.illustration}
          />
          {/* Botón de "REGISTRARSE" */}
          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('signIn')}>
            <Text style={styles.registerButtonText}>REGISTRARSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topContainer: {
    flex: 0.4,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#604274',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    width: 180,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 0.6,
    backgroundColor: '#AA39AD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  bottomSubtitle: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#604274',
    paddingVertical: 15,
    borderRadius: 25,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  illustration: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  forgotPasswordContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#604274',
    textDecorationLine: 'underline',
  },
});