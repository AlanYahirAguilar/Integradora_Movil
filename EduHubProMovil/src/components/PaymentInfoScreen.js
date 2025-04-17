import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Sidebar from './SideBar';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import UserService from '../services/UserService';

export default function PaymentInfoScreen({ route, navigation }) {
  const isRegistration = route.params?.isRegistration;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Función para mostrar mensajes de error o éxito
  const showMessage = (message, isError = false) => {
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

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  const getAccounts = async () => {
    const token = await UserService.getAuthToken();

    await fetch(`${API_BASE_URL}/student/account/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type === 'SUCCESS') {
          setBanks(data.result);
          showMessage('Cuentas bancarias cargadas correctamente');
        } else {
          showMessage(data.message || 'Error al obtener las cuentas bancarias', true);
        }
      })
      .catch((err) => {
        showMessage('Fallo la conexión al servidor de cuentas', true);
       // console.log(err);
      });
  };

  // Fetch de cuentas bancarias al montar
  useEffect(() => {
    getAccounts();
    const interval = setInterval(getAccounts, 30000);
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      {/* Contenido principal */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
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

        {/* Título */}
        <Text style={styles.title}>Información de Pago:</Text>

        {/* Realiza tu pago a cualquiera de las siguientes cuentas */}
        <Text style={styles.subtitle}>Realiza tu pago a cualquiera de las siguientes cuentas:</Text>

        {/* Cuentas Bancarias */}
        {banks.map((bank, index) => (
          <View key={index} style={styles.bankContainer}>
            <View style={styles.row}>
              <Image source={require('../../assets/Bank.png')} style={styles.icon} />
              <Text style={styles.bankName}>{`Banco: ${bank.bankName}`}</Text>
            </View>
            <View style={styles.row}>
              <Image source={require('../../assets/Alfiler.png')} style={styles.icon} />
              <Text style={styles.accountInfo}>{`Número de cuenta: ${bank.accountNumber}`}</Text>
            </View>
            <View style={styles.row}>
              <Image source={require('../../assets/Clave.png')} style={styles.icon} />
              <Text style={styles.accountInfo}>{`CLABE: ${bank.key}`}</Text>
            </View>
            <View style={styles.row}>
              <Image source={require('../../assets/User.png')} style={styles.icon} />
              <Text style={styles.accountInfo}>{`Titular: ${bank?.admin.name}`}</Text>
            </View>
          </View>
        ))}

        {/* Instrucciones de Pago */}
        <View style={styles.instructionsTitleContainer}>
          <Image source={require('../../assets/Alfiler.png')} style={styles.icon} />
          <Text style={styles.instructionsTitle}>Instrucciones de Pago:</Text>
        </View>
        <View style={styles.instructionsContainer}>
          {[
            'Realiza la transferencia o depósito en cualquiera de las cuentas mencionadas.',
            'Asegúrate de dejar como referencia tu nombre completo y el nombre del curso.',
            'Guarda el comprobante de pago en formato de imagen, ésta debe ser clara.',
            'Regresa a la plataforma y sube tu voucher para validación.',
          ].map((instruction, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.instruction}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Importante */}
        <View style={styles.importantContainer}>
          <Image source={require('../../assets/Warning.png')} style={styles.warningIcon} />
          <Text style={styles.importantText}>
            Importante: Si tu pago no es validado correctamente, tu inscripción no será procesada.
          </Text>
        </View>

        {isRegistration && (
          <View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('PendingEnrollments')}
            >
              <Text style={styles.itemText}>Ir A Inscripciones Pendientes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20, // Espacio adicional al final para evitar recortes
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 8,
    color: '#604274',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
  },
  bankContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  smallIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountInfo: {
    fontSize: 14,
    color: '#333',
  },
  instructionsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  instruction: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  importantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#AA39AD',
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  importantText: {
    fontSize: 14,
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#604274',
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 3,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
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
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
  },
});