import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, Clipboard, Alert, ActivityIndicator, FlatList } from 'react-native';
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

  console.log(course);

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);


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

      // Intentar inscribirse al curso
      const enrollmentResponse = await CourseService.enrollCourse(course.id || course.courseId);

      setIsLoading(false); // Ocultar indicador de carga

      if (enrollmentResponse.success) {
        // Inscripción exitosa
        if (course.price > 0) {
          // Si el curso tiene un precio, mostrar el modal de pago
          setIsPaymentModalVisible(true);
        } else {
          // Si el curso es gratuito, mostrar el modal de inscripción exitosa
          setIsSuccessModalVisible(true);
        }
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString(); // ⚠️ month - 1 porque Date usa 0-11
  };

  const courseData = [
    {
      id: '1',
      title: 'Módulo 1: Introducción al curso',
      lessons: ['Lección 1.1: Bienvenida', 'Lección 1.2: Objetivos del curso'],
    },
    {
      id: '2',
      title: 'Módulo 2: Fundamentos básicos',
      lessons: ['Lección 2.1: Conceptos clave', 'Lección 2.2: Herramientas necesarias'],
    },
    {
      id: '3',
      title: 'Módulo 3: Proyectos prácticos',
      lessons: ['Lección 3.1: Proyecto inicial', 'Lección 3.2: Evaluación final'],
    },
  ];

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

      <View style={styles.keyContentContainer}>
        <Image source={require('../../../assets/Alfiler.png')} style={styles.checkIcon} />
        <Text style={styles.keyContentTitle}>Contenido clave:</Text>
      </View>

      {/* Lista de módulos y lecciones */}
      {course.modules?.map((module) => (
        <View key={module.moduleId} style={styles.moduleContainer}>
          <View style={styles.moduleHeader}>
            <Image source={require('../../../assets/GreenCheck.png')} style={styles.checkIcon} />
            <Text style={styles.moduleTitle}>{module.name}</Text>
          </View>
          <View style={styles.lessonContainer}>
            {(module.sections || []).map((lesson, index) => (
              <Text key={lesson.sectionId || index} style={styles.lessonText}>
                - {lesson.name}
              </Text>
            ))}
          </View>
        </View>
      ))}

      {/* Información del curso */}
      <View style={styles.infoContainer}>
        <View style={styles.durationContainer}>
          <Image source={require('../../../assets/RelojArena.png')} style={styles.icon} />
          <Text style={styles.infoText}>Duración: {course.duration || 0} Hrs</Text>
        </View>
        <View style={styles.prerequisitesContainer}>
          <Image source={require('../../../assets/Book.png')} style={styles.icon} />
          {course.startDate && course.endDate ? (
            <Text style={styles.infoText}>
              Fechas: {formatDate(course.startDate)} - {formatDate(course.endDate)}
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

      {/* Modal de Curso Lleno */}
      <Modal visible={isFullCourseModalVisible} transparent animationType="fade">
        <View style={fullCourseStyles.modalOverlay}>
          <View style={fullCourseStyles.modalContent}>
            <Text style={fullCourseStyles.modalTitle}>Curso Lleno</Text>
            <Text style={fullCourseStyles.modalMessage}>
              Lo sentimos, este curso ya ha alcanzado el número máximo de inscripciones.
            </Text>
            <View style={fullCourseStyles.modalButtons}>
              <TouchableOpacity
                style={[fullCourseStyles.modalButton, fullCourseStyles.modalCancelButton]}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={fullCourseStyles.modalButtonText}>Ver otros cursos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[fullCourseStyles.modalButton, fullCourseStyles.modalContactButton]}
                onPress={() => {
                  setIsFullCourseModalVisible(false);
                  setIsSupportModalVisible(true);
                }}
              >
                <Text style={fullCourseStyles.modalButtonText}>Contactar a soporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Pago del Curso */}
      <Modal visible={isPaymentModalVisible} transparent animationType="fade">
        <View style={paymentStyles.modalOverlay}>
          <View style={paymentStyles.modalContent}>
            <Text style={paymentStyles.modalTitle}>Pago del curso</Text>
            <Text style={paymentStyles.modalMessage}>
              Ahora estas inscrito. Para asegurar tu lugar, deberás realizar el pago correspondiente y subir un comprobante. Pulsa en "Siguiente sección" para ver las cuentas disponibles para realizar el pago
            </Text>
            <View style={paymentStyles.modalButtons}>
              <TouchableOpacity
                style={[paymentStyles.modalButton, paymentStyles.modalSuccessButton]}
                onPress={() => {
                  setIsPaymentModalVisible(false);
                  navigation.navigate('PaymentInfo', {
                    paymentId: `payment_${Date.now()}`,
                    courseTitle: course.title,
                    amount: course.price,
                    courseId: course.id || course.courseId,
                    isRegistration: true
                  });
                }}
              >
                <Text style={paymentStyles.modalButtonText}>Siguiente sección</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[paymentStyles.modalButton, paymentStyles.modalCancelButton]}
                onPress={() => {
                  setIsPaymentModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={paymentStyles.modalButtonText}>Ir al inicio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Inscripción Exitosa */}
      <Modal visible={isSuccessModalVisible} transparent animationType="fade">
        <View style={successStyles.modalOverlay}>
          <View style={successStyles.modalContent}>
            <Text style={successStyles.modalTitle}>¡Felicidades!</Text>
            <Text style={successStyles.modalMessage}>
              ¡Tu inscripción al curso se ha completado con éxito!
            </Text>
            <View style={successStyles.modalButtons}>
              <TouchableOpacity
                style={[successStyles.modalButton, successStyles.modalSuccessButton]}
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  navigation.navigate('Inscritos');
                }}
              >
                <Text style={successStyles.modalButtonText}>Ir a "Mis Cursos"</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[successStyles.modalButton, successStyles.modalCancelButton]}
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={successStyles.modalButtonText}>Volver al Inicio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Error Genérico */}
      <Modal visible={isErrorModalVisible} transparent animationType="fade">
        <View style={errorStyles.modalOverlay}>
          <View style={errorStyles.modalContent}>
            <Text style={errorStyles.modalTitle}>❌ Error</Text>
            <Text style={errorStyles.modalMessage}>
              {enrollmentErrorMessage}
            </Text>
            <View style={errorStyles.modalButtons}>
              <TouchableOpacity
                style={[errorStyles.modalButton, errorStyles.modalCancelButton]}
                onPress={() => {
                  setIsErrorModalVisible(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={errorStyles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[errorStyles.modalButton, errorStyles.modalContactButton]}
                onPress={() => {
                  setIsErrorModalVisible(false);
                  setIsSupportModalVisible(true);
                }}
              >
                <Text style={errorStyles.modalButtonText}>Contactar a soporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Ya estás inscrito */}
      <Modal visible={isAlreadyEnrolledModalVisible} transparent animationType="fade">
        <View style={alreadyEnrolledStyles.modalOverlay}>
          <ScrollView contentContainerStyle={alreadyEnrolledStyles.modalContentScroll}>
            <View style={alreadyEnrolledStyles.modalContent}>
              {/* Icono de Éxito */}
              <Image
                source={require('../../../assets/Exito.png')} // Asegúrate de tener un ícono de éxito
                style={alreadyEnrolledStyles.successIcon}
              />
              {/* Título del Modal */}
              <Text style={alreadyEnrolledStyles.modalTitle}>¡Ya estás inscrito!</Text>
              {/* Mensaje del Modal */}
              <Text style={alreadyEnrolledStyles.modalMessage}>
                Ya te encuentras registrado en este curso.
              </Text>
              {/* Botón de Acción */}
              <TouchableOpacity
                style={alreadyEnrolledStyles.actionButton}
                onPress={() => {
                  setIsAlreadyEnrolledModalVisible(false);
                  navigation.navigate('Inscritos');
                }}
              >
                <Text style={alreadyEnrolledStyles.actionButtonText}>Ir a "Mis Cursos"</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={isSupportModalVisible} transparent animationType="fade">
        <View style={supportStyles.modalOverlay}>
          <View style={supportStyles.modalContent}>
            <Text style={supportStyles.modalTitle}>Envíanos un correo:</Text>
            <TouchableOpacity onPress={copyToClipboard} style={supportStyles.emailContainer}>
              <Text style={supportStyles.emailText}>SupportEduHubP@gmail.com</Text>
              <Image source={require('../../../assets/Copy.png')} style={supportStyles.copyIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={supportStyles.closeButton} onPress={() => {
              setIsSupportModalVisible(false);
              navigation.navigate('Home');
            }}>
              <Text style={supportStyles.closeButtonText}>Cerrar</Text>
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
  inscribirseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  enrollButton: {
    backgroundColor: '#800080',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 6,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Estilos para modules */
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  lessonContainer: {
    paddingLeft: 24, // Indenta las lecciones respecto al icono
  },

  lessonText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  moduleContainer: {
    backgroundColor: '#F3F2F5', // Suave fondo lila/gris
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }
  
});

const supportStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center' // Asegura que el contenido esté centrado horizontalmente
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' // Asegura que el título esté centrado
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center' // Centra el contenido horizontalmente
  },
  emailText: {
    marginRight: 10
  },
  copyIcon: {
    width: 20,
    height: 20
  },
  closeButton: {
    backgroundColor: '#3D1779',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Asegura que el botón ocupe todo el ancho disponible
    marginTop: 10 // Espacio adicional entre el contenido y el botón
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16
  }
};

const fullCourseStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center' // Asegura que el contenido esté centrado horizontalmente
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' // Asegura que el título esté centrado
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center' // Asegura que el mensaje esté centrado
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que los botones ocupen todo el ancho disponible
    marginTop: 10 // Espacio adicional entre el mensaje y los botones
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%'
  },
  modalCancelButton: {
    backgroundColor: '#3D1779'
  },
  modalContactButton: {
    backgroundColor: '#65739F'
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center'
  }
};


const paymentStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center' // Asegura que el contenido esté centrado horizontalmente
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' // Asegura que el título esté centrado
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center' // Asegura que el mensaje esté centrado
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que los botones ocupen todo el ancho disponible
    marginTop: 10 // Espacio adicional entre el mensaje y los botones
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%'
  },
  modalSuccessButton: {
    backgroundColor: '#3D1779'
  },
  modalCancelButton: {
    backgroundColor: '#65739F'
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center'
  }
};


const successStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center' // Asegura que el contenido esté centrado horizontalmente
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' // Asegura que el título esté centrado
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center' // Asegura que el mensaje esté centrado
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que los botones ocupen todo el ancho disponible
    marginTop: 10 // Espacio adicional entre el mensaje y los botones
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%'
  },
  modalSuccessButton: {
    backgroundColor: '#28a745'
  },
  modalCancelButton: {
    backgroundColor: '#6c757d'
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center'
  }
};

const errorStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center' // Asegura que el contenido esté centrado horizontalmente
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' // Asegura que el título esté centrado
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center' // Asegura que el mensaje esté centrado
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que los botones ocupen todo el ancho disponible
    marginTop: 10 // Espacio adicional entre el mensaje y los botones
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%'
  },
  modalCancelButton: {
    backgroundColor: '#65739F'
  },
  modalContactButton: {
    backgroundColor: '#3D1779'
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center'
  }
};

const alreadyEnrolledStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContentScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', // Asegura que el contenido esté centrado horizontalmente
    width: '100%' // Asegura que el ScrollView ocupe todo el ancho disponible
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center' // Asegura que el título esté centrado
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center'
  },
  actionButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center'
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16
  }
};

