import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, Clipboard, Alert, ActivityIndicator } from 'react-native';
import CourseService from '../../services/CourseService';

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params; // Recibe el curso seleccionado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [isAlreadyEnrolledModalVisible, setIsAlreadyEnrolledModalVisible] = useState(false);
  const [isFullCourseModalVisible, setIsFullCourseModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
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
  // Función para manejar la inscripción
  // Función para manejar la inscripción
  const handleEnroll = async () => {
    try {
      setIsLoading(true); // Mostrar indicador de carga

      // Validación 1: Verificar si el curso está lleno
      if (course.isFull || (course.size !== undefined && course.size <= 0)) {
        setIsLoading(false);
        setIsFullCourseModalVisible(true); // Mostrar modal de curso lleno
        return;
      }

      // Validación 2: Verificar si el curso tiene un precio
      if (course.price > 0) {
        const enrollmentResponse = await CourseService.enrollCourse(course.id || course.courseId);
        setIsLoading(false);

        if (enrollmentResponse.success) {
          // Inscripción exitosa
          setIsPaymentModalVisible(true); // Mostrar modal de pago
        } else if (enrollmentResponse.isAlreadyEnrolled) {
          // Ya inscrito
          setIsAlreadyEnrolledModalVisible(true); // Mostrar modal de ya inscrito
        } else {
          // Error genérico
          setEnrollmentErrorMessage(enrollmentResponse.message || 'Ocurrió un error al procesar tu solicitud');
          setIsErrorModalVisible(true); // Mostrar modal de error
        }
        return;
      }

      // Validación 3: Curso gratuito -> Intentar inscribirse directamente
      const enrollmentResponse = await CourseService.enrollCourse(course.id || course.courseId);

      setIsLoading(false); // Ocultar indicador de carga

      if (enrollmentResponse.success) {
        // Inscripción exitosa
        setIsSuccessModalVisible(true); // Mostrar modal de inscripción exitosa
      } else if (enrollmentResponse.isAlreadyEnrolled) {
        // Ya inscrito
        setIsAlreadyEnrolledModalVisible(true); // Mostrar modal de ya inscrito
      } else {
        // Error genérico
        setEnrollmentErrorMessage(enrollmentResponse.message || 'Ocurrió un error al procesar tu solicitud');
        setIsErrorModalVisible(true); // Mostrar modal de error
      }
    } catch (error) {
      setIsLoading(false); // Ocultar indicador de carga
      // Mostrar modal de error genérico
      setEnrollmentErrorMessage(error.message || 'Ocurrió un error al procesar tu solicitud');
      setIsErrorModalVisible(true);
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
        <Text style={styles.rating}>{course.rating ? course.rating.toFixed(1) : '0.0'}</Text>
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
          </Text>
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

      <Modal visible={isFullCourseModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Icono de Advertencia */}
            <Text style={styles.modalTitle}>Curso Lleno</Text>

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
                  setIsFullCourseModalVisible(false);
                  setIsSupportModalVisible(true);
                }}
              >
                <Text style={styles.modalButtonText}>Contactar a soporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Pago del Curso */}
      <Modal visible={isPaymentModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Icono de Advertencia */}
            <Text style={styles.modalTitle}>Pago del curso</Text>
            {/* Mensaje de la Alerta */}
            <Text style={styles.modalMessage}>
              Ahora estas inscrito. Para asegurar tu lugar, deberás realizar el pago correspondiente y subir un comprobante. Pulsa en "Siguiente sección" para ver las cuentas disponibles para realizar el pago
            </Text>
            {/* Opciones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPayButton]}
                onPress={() => {
                  setIsPaymentModalVisible(false);
                  navigation.navigate('PaymentInfo', {
                    paymentId: `payment_${Date.now()}`,
                    courseTitle: course.title,
                    amount: course.price,
                    courseId: course.id || course.courseId
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Siguiente sección</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPayButton]}
                onPress={() => {
                  setIsPaymentModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.modalButtonText}>Ir al inicio</Text>
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
            <Text style={styles.modalTitle}>¡Felicidades!</Text>

            {/* Mensaje de Éxito */}
            <Text style={styles.modalMessage}>
              ¡Tu inscripción al curso se ha completado con éxito!
            </Text>

            {/* Opciones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSuccessButton]}
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  navigation.navigate('Inscritos');
                }}
              >
                <Text style={styles.modalButtonText}>Ir a "Mis Cursos"</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSuccessButton]}
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.modalButtonText}>Volver al Inicio</Text>
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
                onPress={() => {
                  setIsErrorModalVisible(false);
                  navigation.navigate('Home');
                }}
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

      {/* Modal de Ya estas inscrito */}
      <Modal visible={isAlreadyEnrolledModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Ya estás inscrito!</Text>
            <Text style={styles.modalMessage}>
              Ya te encuentras registrado en este curso.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalSuccessButton]}
              onPress={() => { setIsAlreadyEnrolledModalVisible(false); navigation.navigate('Inscritos') }}
            >
              <Text style={styles.modalButtonText}>Ir a "Mis Cursos"</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              setIsSupportModalVisible(false);
              navigation.navigate('Home')
            }}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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