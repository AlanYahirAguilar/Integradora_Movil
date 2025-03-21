// CourseFullAlert.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CourseFullAlert = ({ onSeeOtherCourses, onContactSupport }) => {
  return (
    <View style={styles.alertContainer}>
      {/* Título de la Alerta */}
      <View style={styles.titleContainer}>
        <Image style={styles.errorIcon} />
        <Text style={styles.title}>Curso Lleno</Text>
      </View>

      {/* Mensaje de la Alerta */}
      <Text style={styles.message}>
        Lo sentimos, este curso ya ha alcanzado el número máximo de inscripciones.
      </Text>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={onSeeOtherCourses} style={styles.button}>
          <Text style={styles.buttonText}>Ver otros cursos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContactSupport} style={[styles.button, styles.contactButton]}>
          <Text style={styles.buttonText}>Contactar a soporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800080',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#551A8B', // Color diferente para el botón de contacto
  },
});

export default CourseFullAlert;