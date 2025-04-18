import React, { useState, useEffect } from 'react';
import Sidebar from './SideBar';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import PaymentService from '../services/PaymentService';

export default function PendingEnrollmentsScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Cargar los pagos al montar el componente
  useEffect(() => {
    loadStudentPayments(); // tu función para cargar los cursos

    const timer = setTimeout(() => {
      loadStudentPayments(); // recarga después de 30s
    }, 30000); // 30,000 ms = 30 segundos

    return () => clearTimeout(timer); // limpieza del timer
  }, []);


  // Función para cargar los pagos del estudiante
  const loadStudentPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const studentPayments = await PaymentService.getStudentPayments();

      // Transformar los datos para adaptarlos al formato de la tabla
      const formattedPayments = studentPayments.map(payment => ({
        id: payment.paymentId,
        title: payment.registration?.course?.title || 'Curso sin nombre',
        status: getPaymentStatus(payment.status),
        action: getPaymentAction(payment.status),
        amount: payment.amount || 0,
        date: payment.paymentDate || 'Fecha no disponible',
        voucherPath: payment.voucherPath || '',
        courseId: payment.registration?.course?.courseId,
        // Guardar el objeto completo para tener todos los datos disponibles
        originalData: payment
      }));

      setPayments(formattedPayments);
      setFilteredPayments(formattedPayments);
    } catch (err) {
      /* console.error('Error al cargar pagos:', err); */
      setError('No se pudieron cargar tus pagos. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el estado del pago en formato legible
  const getPaymentStatus = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Pago pendiente';
      case 'REVIEWING':
        return 'En revisión';
      case 'APPROVED':
        return 'Aprobado';
      case 'REJECTED':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  // Función para obtener la acción correspondiente al estado del pago
  const getPaymentAction = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Subir Voucher';
      case 'REVIEWING':
        return 'Esperando validación';
      case 'APPROVED':
        return 'Inscripción completa';
      case 'REJECTED':
        return 'Reintentar';
      default:
        return 'Desconocido';
    }
  };

  // Función para realizar la búsqueda
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter((payment) =>
      payment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  // Función para manejar la acción de subir voucher
  const handleUploadVoucher = (payment) => {
    /*   console.log('[PendingEnrollmentsScreen] Navegando a voucher-verification con datos:', {
        paymentId: payment.id,
        courseTitle: payment.title,
        amount: payment.amount
      }); */

    navigation.navigate('voucher-verification', {
      paymentId: payment.id,
      courseTitle: payment.title,
      amount: payment.amount
    });
  };

  // Renderizar el componente
  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Inscripciones Pendientes:</Text>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      {/* Buscar Curso */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Escribe el nombre del curso"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Image source={require('../../assets/Lupa.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Estado de carga */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#604274" />
          <Text style={styles.loadingText}>Cargando tus pagos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStudentPayments}>
            <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      ) : filteredPayments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes pagos pendientes.</Text>
        </View>
      ) : (
        /* Tabla de Inscripciones */
        <FlatList
          data={filteredPayments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {/* Columna: Curso */}
              <Text style={styles.cell}>{item.title}</Text>

              {/* Columna: Estado */}
              <View style={[styles.cell, styles.centerContent]}>
                {item.status === 'Pago pendiente' && (
                  <View style={styles.statusContainer}>
                    <Image source={require('../../assets/Review.png')} style={styles.statusIcon} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                )}
                {item.status === 'En revisión' && (
                  <View style={styles.statusContainer}>
                    <Image source={require('../../assets/Reintentar.png')} style={styles.statusIcon} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                )}
                {item.status === 'Aprobado' && (
                  <View style={styles.statusContainer}>
                    <Image source={require('../../assets/Completado.png')} style={styles.statusIcon} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                )}
                {item.status === 'Rechazado' && (
                  <View style={styles.statusContainer}>
                    <Image source={require('../../assets/Reintentar.png')} style={styles.statusIcon} />
                    <Text style={[styles.statusText, styles.rejectedText]}>{item.status}</Text>
                  </View>
                )}
              </View>

              {/* Columna: Acción */}
              <View style={[styles.cell, styles.centerContent]}>
                {item.action === 'Subir Voucher' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleUploadVoucher(item)}
                  >
                    <Text style={styles.actionButtonText}>{item.action}</Text>
                  </TouchableOpacity>
                )}
                {item.action === 'Esperando validación' && (
                  <View style={styles.actionContainer}>
                    <Text style={styles.actionText}>{item.action}</Text>
                  </View>
                )}
                {item.action === 'Inscripción completa' && (
                  <View style={styles.actionContainer}>
                    <Text style={styles.actionText}>{item.action}</Text>
                  </View>
                )}
                {item.action === 'Reintentar' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleUploadVoucher(item)}
                  >
                    <Text style={styles.actionButtonText}>{item.action}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={styles.columnHeader}>Curso</Text>
              <Text style={styles.columnHeader}>Estado</Text>
              <Text style={styles.columnHeader}>Acción</Text>
            </View>
          )}
        />
      )}
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
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#604274'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#65739F',
    padding: 12,
    borderRadius: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#65739F',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  columnHeader: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  centerContent: {
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
  },
  rejectedText: {
    color: '#FF6B6B',
  },
  actionContainer: {
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#604274',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#604274',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#604274',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});