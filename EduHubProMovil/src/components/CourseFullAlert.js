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
   
  },
  titleContainer: {
    
  },
  errorIcon: {
  
  },
  title: {
    
  },
  message: {
   
  },
  optionsContainer: {
    
  },
  button: {
   
  },
  buttonText: {
    
  },
  contactButton: {
    
  },
});

export default CourseFullAlert;