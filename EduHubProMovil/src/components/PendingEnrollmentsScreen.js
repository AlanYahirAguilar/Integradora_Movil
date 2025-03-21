// PendingEnrollmentsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

export default function PendingEnrollmentsScreen({navigate}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredCourses = courses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Inscripciones Pendientes:</Text>

      {/* Buscar Curso */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Escribe el nombre del curso"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Tabla de Inscripciones */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.title}</Text>
            <View style={styles.cell}>
              {item.status === 'Pago pendiente' && (
                <View style={styles.statusContainer}>
                  <Image  style={styles.statusIcon} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              )}
              {item.status === 'En revisión' && (
                <View style={styles.statusContainer}>
                  <Image style={styles.statusIcon} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              )}
              {item.status === 'Aprobado' && (
                <View style={styles.statusContainer}>
                  <Image style={styles.statusIcon} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              )}
            </View>
            <View style={styles.cell}>
              {item.action === 'Subir Voucher' && (
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{item.action}</Text>
                </TouchableOpacity>
              )}
              {item.action === 'Esperando validación' && (
                <View style={styles.actionContainer}>
                  <Image  style={styles.actionIcon} />
                  <Text style={styles.actionText}>{item.action}</Text>
                </View>
              )}
              {item.action === 'Inscripción completa' && (
                <View style={styles.actionContainer}>
                  <Image style={styles.actionIcon} />
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
  // Agregar más cursos aquí...
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
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
    marginLeft: 4,
  },
  statusText: {
    color: '#800080',
  },
  actionButton: {
    backgroundColor: '#800080',
    padding: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  actionText: {
    color: '#800080',
  },
});