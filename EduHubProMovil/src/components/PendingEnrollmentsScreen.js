import React, { useState, useEffect } from 'react';
import Sidebar from './SideBar';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

export default function PendingEnrollmentsScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

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
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={require('../../assets/Lupa.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Tabla de Inscripciones */}
      <FlatList
        data={filteredCourses}
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
            </View>

            {/* Columna: Acción */}
            <View style={[styles.cell, styles.centerContent]}>
              {item.action === 'Subir Voucher' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('voucher-verification')}>
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
    </View>
  );
}

const courses = [
  {
    id: '1',
    title: 'Arquitectos del Código',
    status: 'Pago pendiente',
    action: 'Subir Voucher',
  },
  {
    id: '2',
    title: 'Desarrollo Web Full Stack',
    status: 'En revisión',
    action: 'Esperando validación',
  },
  {
    id: '3',
    title: 'IA Aplicada',
    status: 'Aprobado',
    action: 'Inscripción completa',
  },
];

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
    backgroundColor: '#800080',
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
    backgroundColor: '#800080',
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
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    padding: 8,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#800080',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#800080',
    padding: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#800080',
    fontSize: 14,
  },
});