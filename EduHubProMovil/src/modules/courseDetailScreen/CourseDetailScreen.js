import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, Clipboard, Alert } from 'react-native';

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params; // Recibe el curso seleccionado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCourseFullModalVisible, setIsCourseFullModalVisible] = useState(false); // Controla el modal de curso lleno
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false); // Controla el modal de soporte

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Función para manejar la inscripción
  const handleEnroll = () => {
    if (course.isFull) {
      // Mostrar el modal si el curso está lleno
      setIsCourseFullModalVisible(true);
    } else {
      // Redirigir a la pantalla de pagos si hay cupo disponible
      navigation.navigate('PaymentInfo');
    }
  };

  // Función para copiar el correo al portapapeles
  const copyToClipboard = async () => {
    const supportEmail = 'SupportEduHubP@gmail.com';
    await Clipboard.setString(supportEmail);
    Alert.alert('Correo copiado', `Envíanos un correo a ${supportEmail}, te ayudaremos a resolver tu problema`);
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
      <Image source={course.image} style={styles.courseImage} />

      {/* Título del Curso */}
      <Text style={styles.title}>{course.title}</Text>

      {/* Creado por */}
      <View style={styles.creatorContainer}>
        <Image source={require('../../../assets/User.png')} style={styles.userIcon} />
        <Text style={styles.creator}>Creado por: {course.instructor}</Text>
      </View>

      {/* Calificación */}
      <View style={styles.ratingContainer}>
        <Image source={require('../../../assets/Star.png')} style={styles.starIcon} />
        <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{course.description}</Text>

      {/* Contenido Clave */}
      <View style={styles.keyContentContainer}>
        <Image source={require('../../../assets/Alfiler.png')} style={styles.checkIcon} />
        <Text style={styles.keyContentTitle}>Contenido clave:</Text>
      </View>

      {/* Duración y Requisitos Previos */}
      <View style={styles.infoContainer}>
        <View style={styles.durationContainer}>
          <Image source={require('../../../assets/RelojArena.png')} style={styles.icon} />
          <Text style={styles.infoText}>Duración: {course.duration} Hrs</Text>
        </View>
        <View style={styles.prerequisitesContainer}>
          <Image source={require('../../../assets/Book.png')} style={styles.icon} />
          <Text style={styles.infoText}>Requisitos previos: {course.prerequisites}</Text>
        </View>
      </View>

      {/* Comentarios e Inscribirse */}
      <View style={styles.commentsContainer}>
        <Image source={require('../../../assets/Comment.png')} style={styles.commentIcon} />
        <Text style={styles.comments}>{course.comments} Comentarios</Text>
      </View>

      {/* Botón de Inscribirse */}
      <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
        <Text style={styles.enrollButtonText}>Inscribirse</Text>
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