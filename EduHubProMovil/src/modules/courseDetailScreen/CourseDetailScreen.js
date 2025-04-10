import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, Clipboard, Alert, ActivityIndicator } from 'react-native';
import CourseService from '../../services/CourseService';

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params; // Recibe el curso seleccionado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCourseFullModalVisible, setIsCourseFullModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [isAlreadyEnrolledModalVisible, setIsAlreadyEnrolledModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [enrollmentErrorMessage, setEnrollmentErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Función para manejar la inscripción
  const handleEnroll = async () => {
    if (course.isFull) {
      // Mostrar el modal si el curso está lleno
      setIsCourseFullModalVisible(true);
    } else {
      try {
        setIsLoading(true); // Mostrar indicador de carga
        /* console.log('Iniciando proceso de inscripción al curso:', course.id || course.courseId); */
        
        // Llamar al servicio para inscribir al estudiante
        const result = await CourseService.enrollCourse(course.id || course.courseId);
        
        /* console.log('Resultado de inscripción:', result); */
        setIsLoading(false); // Ocultar indicador de carga
        
        if (result.success) {
          // Mostrar modal de éxito
          setIsSuccessModalVisible(true);
        } else if (result.isAlreadyEnrolled) {
          // Caso específico: ya está inscrito en el curso
          setEnrollmentErrorMessage(result.message || 'Ya estás inscrito en este curso. No es necesario volver a inscribirte.');
          setIsAlreadyEnrolledModalVisible(true);
        } else {
          // Otros errores
          setEnrollmentErrorMessage(result.message || 'Ocurrió un error al intentar inscribirte al curso');
          setIsErrorModalVisible(true);
        }
      } catch (error) {
        setIsLoading(false); // Ocultar indicador de carga
     //   console.error('Error al inscribirse:', error);
        
        // Mostrar modal de error genérico
        setEnrollmentErrorMessage(error.message || 'Ocurrió un error al intentar inscribirte al curso');
        setIsErrorModalVisible(true);
      }
    }
  };

  // Función para copiar el correo al portapapeles
  const copyToClipboard = async () => {
    const supportEmail = 'SupportEduHubP@gmail.com';
    await Clipboard.setString(supportEmail);
    Alert.alert('Correo copiado', `Envíanos un correo a ${supportEmail}, te ayudaremos a resolver tu problema`);
  };

  // Calcular la duración en horas basado en fechas si está disponible
  const calculateDuration = () => {
    if (!course.startDate || !course.endDate) return '40';
    
    try {
      const start = new Date(course.startDate);
      const end = new Date(course.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Asumimos 8 horas de estudio por día
      return (diffDays * 8).toString();
    } catch (error) {
   //   console.error('Error al calcular duración:', error);
      return '40'; // Valor por defecto
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      {/* Imagen del Curso */}
      {typeof course.image === 'object' && course.image !== null ? (
        <Image source={course.image} style={styles.courseImage} />
      ) : typeof course.image === 'string' && course.image ? (
        <Image source={{ uri: course.image }} style={styles.courseImage} />
      ) : course.bannerPath ? (
        <Image source={{ uri: course.bannerPath }} style={styles.courseImage} />
      ) : (
        <Image source={require('../../../assets/Test.png')} style={styles.courseImage} />
      )}

      {/* Título del Curso */}
      <Text style={styles.title}>{course.title}</Text>

      {/* Creado por */}
      <View style={styles.creatorContainer}>
        <Image source={require('../../../assets/User.png')} style={styles.userIcon} />
        <Text style={styles.creator}>Creado por: {
          course.autor || 
          course.instructor || 
          (course.instructor && course.instructor.name) || 
          'Instructor'
        }</Text>
      </View>

      {/* Calificación */}
      <View style={styles.ratingContainer}>
        <Image source={require('../../../assets/Star.png')} style={styles.starIcon} />
        <Text style={styles.rating}>{course.rating ? course.rating.toFixed(1) : '4.5'}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{course.description || 'Sin descripción disponible'}</Text>

      {/* Contenido Clave */}
      <View style={styles.keyContentContainer}>
        <Image source={require('../../../assets/Alfiler.png')} style={styles.checkIcon} />
        <Text style={styles.keyContentTitle}>Contenido clave:</Text>
      </View>

      {/* Información del curso */}
      <View style={styles.infoContainer}>
        <View style={styles.durationContainer}>
          <Image source={require('../../../assets/RelojArena.png')} style={styles.icon} />
          <Text style={styles.infoText}>Duración: {course.duration || calculateDuration()} Hrs</Text>
        </View>
        <View style={styles.prerequisitesContainer}>
          <Image source={require('../../../assets/Book.png')} style={styles.icon} />
          {course.startDate && course.endDate ? (
            <Text style={styles.infoText}>
              Fechas: {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
            </Text>
          ) : (
            <Text style={styles.infoText}>Requisitos: {course.prerequisites || 'Ninguno'}</Text>
          )}
        </View>
      </View>

      {/* Detalles adicionales */}
      <View style={styles.additionalInfoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Precio:</Text>
          <Text style={styles.infoValue}>
            {course.precio || (course.price ? `MX$ ${parseFloat(course.price).toFixed(2)}` : 'MX$ 0.00')}
          </Text>Ok
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cupos totales:</Text>
          <Text style={styles.infoValue}>{course.size || 0}</Text>
        </View>
      </View>

      {/* Categorías */}
      {course.categories && course.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categorías:</Text>
          <View style={styles.categoriesList}>
            {course.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Comentarios e Inscribirse */}
      <View style={styles.commentsContainer}>
        <Image source={require('../../../assets/Comment.png')} style={styles.commentIcon} />
        <Text style={styles.comments}>{course.comments || '0'} Comentarios</Text>
      </View>

      {/* Botón de Inscribirse */}
      <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.enrollButtonText}>Inscribirse</Text>
        )}
      </TouchableOpacity>

      {/* Modal de Alerta para Curso Lleno */}
      <Modal visible={isCourseFullModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Icono de Advertencia */}
            <Text style={styles.modalTitle}>⚠️ Curso Lleno</Text>

            {/* Mensaje de la Alerta */}
            <Text style={styles.modalMessage}>
              Lo sentimos, este curso ya ha alcanzado el número máximo de inscripciones.
            </Text>

            {/* Opciones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.modalButtonText}>Ver otros cursos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalContactButton]}
                onPress={() => {
                  setIsCourseFullModalVisible(false); // Ocultar el primer modal
                  setIsSupportModalVisible(true); // Mostrar el segundo modal
                }}
              >
                <Text style={styles.modalButtonText}>Contactar a soporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Ya Inscrito */}
      <Modal visible={isAlreadyEnrolledModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Icono de Información */}
            <Text style={styles.modalTitle}>ℹ️ Ya estás inscrito</Text>

            {/* Mensaje de la Alerta */}
            <Text style={styles.modalMessage}>
              {enrollmentErrorMessage}
            </Text>

            {/* Opciones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalContactButton]}
                onPress={() => {
                  setIsAlreadyEnrolledModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.modalButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Inscripción Exitosa */}
      <Modal visible={isSuccessModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Icono de Éxito */}
            <Text style={styles.modalTitle}>✔️ Inscripción Exitosa</Text>

            {/* Mensaje de Éxito */}
            <Text style={styles.modalMessage}>
              ¡Te has inscrito correctamente al curso!
            </Text>

            {/* Opciones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalContactButton]}
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.modalButtonText}>Ir a Inicio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Error Genérico */}
      <Modal visible={isErrorModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Icono de Error */}
            <Text style={styles.modalTitle}>❌ Error</Text>

            {/* Mensaje de Error */}
            <Text style={styles.modalMessage}>
              {enrollmentErrorMessage}
            </Text>

            {/* Opciones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsErrorModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalContactButton]}
                onPress={() => {
                  setIsErrorModalVisible(false);
                  setIsSupportModalVisible(true);
                }}
              >
                <Text style={styles.modalButtonText}>Contactar a soporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Ayuda y Soporte */}
      <Modal visible={isSupportModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Título del Modal */}
            <Text style={styles.modalTitle}>Envíanos un correo:</Text>

            {/* Dirección de Correo */}
            <TouchableOpacity onPress={copyToClipboard} style={styles.emailContainer}>
              <Text style={styles.emailText}>SupportEduHubP@gmail.com</Text>
              <Image source={require('../../../assets/Copy.png')} style={styles.copyIcon} />
            </TouchableOpacity>

            {/* Botón para Cerrar el Modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsSupportModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  creator: {
    fontSize: 14,
    color: '#800080',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#800080',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  keyContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  keyContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
  },
  additionalInfoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#604274',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: '#604274',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  comments: {
    fontSize: 14,
  },
  enrollButton: {
    backgroundColor: '#800080',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  modalCancelButton: {
    backgroundColor: '#65739F',
  },
  modalContactButton: {
    backgroundColor: '#800080',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 16,
    color: '#800080',
    marginRight: 8,
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  closeButton: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});