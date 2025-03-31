// PaymentInfoScreen.js
import { View, Text, StyleSheet, Image } from 'react-native';
import Sidebar from './SideBar';
import React, { useState, useEffect } from 'react';

export default function PaymentInfoScreen({ route, navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  const banks = [
    {
      name: 'BBVA',
      accountNumber: '0123456789',
      clabe: '123456789012345678',
      titular: 'Admin1',
    },
    {
      name: 'Santander',
      accountNumber: '9876543210',
      clabe: '876543210987654321',
      titular: 'Admin2',
    },
  ];

  return (
    <View style={styles.container}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      {/* Título */}
      <Text style={styles.title}>Información de Pago:</Text>

      {/* Realiza tu pago a cualquiera de las siguientes cuentas */}
      <Text style={styles.subtitle}>Realiza tu pago a cualquiera de las siguientes cuentas:</Text>
  

      {/* Cuentas Bancarias */}
      {banks.map((bank, index) => (
        <View key={index} style={styles.bankContainer}>
          <View style={styles.row}>
            <Image source={require('../../assets/Bank.png')} style={styles.icon} />
            <Text style={styles.bankName}>{`Banco: ${bank.name}`}</Text>
          </View>
          <View style={styles.row}>
            <Image source={require('../../assets/Alfiler.png')} style={styles.icon} />
            <Text style={styles.accountInfo}>{`Número de cuenta: ${bank.accountNumber}`}</Text>
          </View>
          <View style={styles.row}>
            <Image source={require('../../assets/Clave.png')} style={styles.icon} />
            <Text style={styles.accountInfo}>{`CLABE: ${bank.clabe}`}</Text>
          </View>
          <View style={styles.row}>
            <Image source={require('../../assets/User.png')} style={styles.icon} />
            <Text style={styles.accountInfo}>{`Titular: ${bank.titular}`}</Text>
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
          'Asegúrate de dejar como referencia tu nombre completo y el nombre del curso en la referencia.',
          'Guarda el comprobante de pago en formato PDF o imagen clara.',
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 8,
    color: '#604274'
  },
  instructionsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
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
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountInfo: {
    fontSize: 14,
    color: '#333',
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
});