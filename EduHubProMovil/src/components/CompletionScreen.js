import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import ReviewService from '../services/ReviewService';

const CompletionScreen = ({ navigation, route }) => {
  const { courseId, instructorId } = route.params;

  const [rating, setRating] = useState(0); // Estado para almacenar la calificación seleccionada
  const [comments, setComments] = useState(''); // Estado para almacenar los comentarios

  // Función para manejar la selección de estrellas
  const handleStarPress = (selectedStar) => {
    setRating(selectedStar);
  };


  const handleSubmitEvaluation = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor califica el curso, de no ser así no podremos enviarte tu constancia.');
      return;
    }

    try {
      const response = await ReviewService.createReview(rating, comments
        , courseId, instructorId);
      console.log('Review enviada:', response.data);

      Alert.alert(
        'Éxito',
        'Tu evaluación ha sido enviada. ¡Gracias por tu retroalimentación!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      const msg = error?.response?.data?.message || 'Ocurrió un error al enviar tu evaluación.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>¡Felicitaciones!</Text>
      <Text style={styles.subtitle}>Has completado todos los módulos del curso</Text>

      {/* Barra de Progreso */}
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressText}>Progreso: 100%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      {/* Sección de Evaluación */}
      <Text style={styles.evaluationTitle}>Evalúa el curso</Text>
      <Text style={styles.evaluationSubtitle}>¿Qué te pareció el contenido del curso?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => handleStarPress(star)}
          >
            <Text
              style={[
                styles.starText,
                { color: star <= rating ? '#FFD700' : '#ccc' }
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.commentLabel}>Comentarios adicionales:</Text>
      <TextInput
        placeholder="Ingresa tus comentarios"
        multiline
        value={comments}
        onChangeText={setComments}
        style={styles.commentInput}
      />

      {/* Botón de Completar Evaluación */}
      <TouchableOpacity style={styles.completeButton} onPress={handleSubmitEvaluation}>
        <Text style={styles.completeButtonText}>Completar evaluación</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
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
  evaluationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  evaluationSubtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginRight: 8,
  },
  starText: {
    fontSize: 24,
    color: '#ccc', // Color gris por defecto
  },
  commentLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 80, // Altura mínima para permitir múltiples líneas
    textAlignVertical: 'top', // Alinear texto en la parte superior
  },
  completeButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CompletionScreen;