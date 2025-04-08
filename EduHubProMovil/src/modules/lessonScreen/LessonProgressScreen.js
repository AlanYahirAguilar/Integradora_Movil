import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LessonProgressScreen = ({ lesson }) => {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>{lesson.title}</Text>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressText}>Lección {lesson.currentLesson} de {lesson.totalLessons}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${lesson.progress}%` }]} />
        </View>
      </View>

      {/* Contenido Principal */}
      <Text style={styles.description}>{lesson.description}</Text>

      {/* Lista de Lecciones */}
      <View style={styles.lessonList}>
        {lesson.lessons.map((lessonItem, index) => (
          <View key={index} style={styles.lessonItem}>
            <Text style={styles.lessonTitle}>{lessonItem.title}</Text>
            <TouchableOpacity
              style={[
                styles.continueButton,
                lessonItem.isLocked && styles.lockedButton,
              ]}
              disabled={lessonItem.isLocked}
            >
              <Text style={styles.buttonText}>
                {lessonItem.isLocked ? 'Bloqueado' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Botones de Navegación */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Lección Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Lección Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#604274',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  lessonList: {
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#604274',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  lockedButton: {
    backgroundColor: '#ccc', // Fondo gris claro para indicar bloqueo
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LessonProgressScreen;