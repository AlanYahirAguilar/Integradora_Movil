// src/modules/signIn/signIn.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, MESSAGES } from '../../constants';

const SignIn = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estados para el formulario de registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

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

  // Función para mostrar mensajes
  const showMessage = (message, isError = false) => {
    console.log(message);
    
    if (Platform.OS === 'android') {
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

  // Lógica para "INICIA SESIÓN"
  const handleLogin = () => {
    // Mostrar el formulario de inicio de sesión
    setShowLoginForm(true);
    // Navegar a la sección de login
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  // Función para realizar la petición de inicio de sesión
  const performLogin = async () => {
    // Validación básica
    if (!email.trim() || !password.trim()) {
      showMessage('Por favor ingresa email y contraseña', true);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('Iniciando petición de login...');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        // Guardar el token JWT y datos del usuario en AsyncStorage
        console.log('Guardando token JWT en AsyncStorage:', data.jwt);
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.jwt);
        console.log('Token JWT guardado correctamente');
        
        console.log('Guardando datos del usuario en AsyncStorage');
        await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.email);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, data.name);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, data.role);
        
        // También guardamos todos los datos del usuario como un objeto JSON
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
        console.log('Datos del usuario guardados correctamente');
        
        // Mostrar mensaje de éxito
        showMessage(MESSAGES.LOGIN_SUCCESS);
        
        // Navegar a la pantalla principal
        console.log('Navegando a la pantalla principal...');
        setTimeout(() => {
          navigation.replace('Home');
        }, 1000); // Pequeño retraso para que el usuario vea el mensaje de éxito
      } else {
        // Mostrar mensaje de error
        console.log('Error en inicio de sesión:', data.message || MESSAGES.LOGIN_ERROR);
        showMessage(data.message || MESSAGES.LOGIN_ERROR, true);
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      showMessage(MESSAGES.NETWORK_ERROR, true);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para realizar el registro de usuario
  const performRegister = async () => {
    // Validación básica
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim() || !confirmPassword.trim()) {
      showMessage(MESSAGES.FIELDS_REQUIRED, true);
      return;
    }

    // Validar que las contraseñas coincidan
    if (registerPassword !== confirmPassword) {
      showMessage(MESSAGES.PASSWORD_MISMATCH, true);
      return;
    }

    setIsRegistering(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('Iniciando petición de registro...');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          role: 'STUDENT' // Rol por defecto
        }),
      });

      const data = await response.json();
      console.log('Respuesta del servidor (registro):', data);

      if (response.ok && data.type === 'SUCCESS') {
        // Mostrar mensaje de éxito
        showMessage(data.text || MESSAGES.REGISTER_SUCCESS);
        
        // Limpiar formulario
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        
        // Opcional: Cambiar a la pantalla de login después de un registro exitoso
        setTimeout(() => {
          setShowLoginForm(true);
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 2000);
      } else {
        // Extraer y mostrar mensajes de error específicos del backend
        let errorMsg = MESSAGES.REGISTER_ERROR;
        
        // Si la respuesta es un objeto con propiedades que contienen mensajes de error
        if (typeof data === 'object' && data !== null) {
          // Buscar el primer mensaje de error en el objeto
          for (const key in data) {
            if (typeof data[key] === 'string') {
              errorMsg = data[key];
              break;
            }
          }
        } 
        // Si la respuesta tiene un campo 'text' (formato estándar de error)
        else if (data && data.text) {
          errorMsg = data.text;
        }
        
        console.log('Error en registro:', errorMsg);
        showMessage(errorMsg, true);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      showMessage(MESSAGES.NETWORK_ERROR, true);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <ScrollView 
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
    >
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
      
      {showLoginForm ? (
        // Formulario de inicio de sesión
        <View style={styles.loginFormContainer}>
          <Text style={styles.loginFormTitle}>Iniciar Sesión</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            autoFocus={true}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={[styles.loginFormButton, isLoading && styles.disabledButton]}
            onPress={performLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>INICIA SESIÓN</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchFormButton}
            onPress={() => setShowLoginForm(false)}
            disabled={isLoading}
          >
            <Text style={styles.switchFormText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('recoverPass')}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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

            {/* Campos de texto para el registro */}
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={registerName}
              onChangeText={setRegisterName}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={registerEmail}
              onChangeText={setRegisterEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={registerPassword}
              onChangeText={setRegisterPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* Botón de "REGISTRARSE" */}
            <TouchableOpacity
              style={[styles.registerButton, isRegistering && styles.disabledButton]}
              onPress={performRegister}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>REGISTRARSE</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
  // Estilos para el formulario de inicio de sesión
  loginFormContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 60,
  },
  loginFormTitle: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginFormButton: {
    backgroundColor: '#604274',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: '#9E9E9E',
    opacity: 0.7,
  },
  switchFormButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchFormText: {
    color: '#604274',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#AA39AD',
    fontSize: 14,
    fontWeight: '500',
  },
  // Estilos para mensajes de error y éxito
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
