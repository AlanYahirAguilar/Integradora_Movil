// CourseCompletionScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating'; // Importamos el componente de calificación

export default function CourseCompletionScreen({ navigation }) {
  // Comentamos los estados relacionados con la evaluación y alertas
  // const [contentRating, setContentRating] = useState(0);
  // const [instructorRating, setInstructorRating] = useState(0);
  // const [comments, setComments] = useState('');
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertType, setAlertType] = useState('success');
  // const [alertMessage, setAlertMessage] = useState('');

  // Comentamos la función de envío de evaluación
  // const handleCompleteEvaluation = () => {
  //   // Simulando el envío de la evaluación
  //   const evaluationData = {
  //     contentRating,
  //     instructorRating,
  //     comments,
  //   };

  //   // Lógica simulada para enviar la evaluación al backend
  //   setTimeout(() => {
  //     if (Math.random() > 0.5) { // Simulando un éxito aleatorio
  //       setAlertType('success');
  //       setAlertMessage('¡Gracias por evaluar! Pronto recibirás tu certificado por correo electrónico.');
  //     } else {
  //       setAlertType('error');
  //       setAlertMessage('Ocurrió un problema al enviar tu evaluación. Por favor, inténtalo de nuevo.');
  //     }
  //     setShowAlert(true);
  //   }, 1000);
  // };

  // Comentamos la función de cierre de alerta
  // const handleCloseAlert = () => {
  //   setShowAlert(false);
  //   if (alertType === 'success') {
  //     // Navegar a la siguiente pantalla o cerrar esta pantalla
  //     navigation.goBack();
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* Mensaje de Felicitación */}
      <View style={styles.congratulationsContainer}>
        <Text style={styles.congratulationsTitle}>¡Felicitaciones!</Text>
        <Text style={styles.congratulationsMessage}>Has completado todos los módulos del curso</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '100%' }]} />
        </View>
      </View>

      {/* Evaluación del Curso */}
      <ScrollView style={styles.evaluationContainer}>
        <Text style={styles.evaluationTitle}>Evalúa el curso</Text>

        {/* Calificación del Contenido */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingQuestion}>¿Qué te pareció el contenido del curso?</Text>
          <StarRating
            disabled={true} // Desactivamos la interacción
            maxStars={5}
            rating={4} // Valor estático para mostrar una calificación fija
            starSize={24}
            fullStarColor="#800080"
            emptyStarColor="#ccc"
          />
        </View>

        {/* Calificación del Desempeño del Maestro */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingQuestion}>¿Qué te pareció el desempeño del maestro?</Text>
          <StarRating
            disabled={true} // Desactivamos la interacción
            maxStars={5}
            rating={5} // Valor estático para mostrar una calificación fija
            starSize={24}
            fullStarColor="#800080"
            emptyStarColor="#ccc"
          />
        </View>

        {/* Comentarios Adicionales */}
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comentarios adicionales:</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Escribe tus comentarios aquí..."
            editable={false} // Desactivamos la edición
            value={"Este es un comentario de ejemplo."} // Valor estático
            style={styles.commentsInput}
          />
        </View>

        {/* Aviso Importante */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Aviso Importante:</Text>
          <Text style={styles.noticeMessage}>
            Para poder liberar su certificado, es indispensable completar la evaluación del curso y del maestro.
          </Text>
        </View>

        {/* Botón Completar Evaluación */}
        <TouchableOpacity
          onPress={() => console.log('Botón deshabilitado para maquetado')} // Desactivamos la acción
          style={styles.completeButton}
        >
          <Text style={styles.completeButtonText}>Completar evaluación</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Alert Modal */}
      {/* Comentamos el componente de alerta ya que no es necesario para el maquetado */}
      {/* <AlertModal
        isVisible={showAlert}
        type={alertType}
        message={alertMessage}
        onClose={handleCloseAlert}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  congratulationsContainer: {
    marginBottom: 16,
  },
  congratulationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    textAlign: 'center',
    marginBottom: 8,
  },
  congratulationsMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#800080',
  },
  evaluationContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  evaluationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingQuestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  commentsContainer: {
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
  },
  noticeContainer: {
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 8,
  },
  noticeMessage: {
    fontSize: 14,
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});