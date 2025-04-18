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
  /*  const calculateDuration = () => {
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
  */

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
      <FlatList
        data={courseData}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled={true} // Habilita el scroll anidado
        renderItem={({ item }) => (
          <View style={styles.moduleContainer}>
            <Text style={styles.moduleTitle}>{item.title}</Text>
            <View style={styles.lessonContainer}>
              {item.lessons.map((lesson, index) => (
                <Text key={index} style={styles.lessonText}>
                  - {lesson}
                </Text>
              ))}
            </View>
          </View>
        )}
      />

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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Curso Lleno</Text>
            <Text style={styles.modalMessage}>
              Lo sentimos, este curso ya ha alcanzado el número máximo de inscripciones.
            </Text>
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
            <Text style={styles.modalTitle}>Pago del curso</Text>
            <Text style={styles.modalMessage}>
              Ahora estas inscrito. Para asegurar tu lugar, deberás realizar el pago correspondiente y subir un comprobante. Pulsa en "Siguiente sección" para ver las cuentas disponibles para realizar el pago
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSuccessButton]}
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
                <Text style={styles.modalButtonText}>Siguiente sección</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
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
            <Text style={styles.modalTitle}>¡Felicidades!</Text>
            <Text style={styles.modalMessage}>
              ¡Tu inscripción al curso se ha completado con éxito!
            </Text>
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
                style={[styles.modalButton, styles.modalCancelButton]}
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
            <Text style={styles.modalTitle}>❌ Error</Text>
            <Text style={styles.modalMessage}>
              {enrollmentErrorMessage}
            </Text>
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

      {/* Modal de Ya estás inscrito */}
      <Modal visible={isAlreadyEnrolledModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Ya estás inscrito!</Text>
            <Text style={styles.modalMessage}>
              Ya te encuentras registrado en este curso.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalSuccessButton]}
              onPress={() => {
                setIsAlreadyEnrolledModalVisible(false);
                navigation.navigate('Inscritos');
              }}
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
            <Text style={styles.modalTitle}>Envíanos un correo:</Text>
            <TouchableOpacity onPress={copyToClipboard} style={styles.emailContainer}>
              <Text style={styles.emailText}>SupportEduHubP@gmail.com</Text>
              <Image source={require('../../../assets/Copy.png')} style={styles.copyIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              setIsSupportModalVisible(false);
              navigation.navigate('Home');
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
  inscribirseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  enrollButton: {
    backgroundColor: '#800080',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 2,
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
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  modalSuccessButton: {
    backgroundColor: '#800080',
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
    textAlign: 'center',
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