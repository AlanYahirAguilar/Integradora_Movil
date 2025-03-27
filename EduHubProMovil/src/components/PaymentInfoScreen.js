// PaymentInfoScreen.js
import { View, Text, StyleSheet, Image } from 'react-native';
import Sidebar from './SideBar';
import React, { useState, useEffect } from 'react';

export default function PaymentInfoScreen({route, navigation}) {
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
          <Text style={styles.bankName}>{`Banco: ${bank.name}`}</Text>
          <Text style={styles.accountInfo}>{`Número de cuenta: ${bank.accountNumber}`}</Text>
          <Text style={styles.accountInfo}>{`CLABE: ${bank.clabe}`}</Text>
          <Text style={styles.accountInfo}>{`Titular: ${bank.titular}`}</Text>
        </View>
      ))}

      {/* Instrucciones de Pago */}
      <Text style={styles.instructionsTitle}>Instrucciones de Pago:</Text>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instruction}>
          - Realiza la transferencia o depósito en cualquiera de las cuentas mencionadas.
        </Text>
        <Text style={styles.instruction}>
          - Asegúrate de dejar como referencia tu nombre completo y el nombre del curso en la referencia.
        </Text>
        <Text style={styles.instruction}>
          - Guarda el comprobante de pago en formato PDF o imagen clara.
        </Text>
        <Text style={styles.instruction}>
          - Regresa a la plataforma y sube tu voucher para validación.
        </Text>
      </View>

      {/* Importante */}
      <View style={styles.importantContainer}>
        <Image style={styles.warningIcon} />
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
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  bankContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  instructionsContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
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
    backgroundColor: '#800080',
    padding: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  warningIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  importantText: {
    fontSize: 14,
    color: '#fff',
  },
});