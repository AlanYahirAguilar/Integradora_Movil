import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  Image,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import Sidebar from '../SideBar';
import PaymentService from '../../services/PaymentService';

const { width } = Dimensions.get('window');

const VoucherVerification = ({ navigation, route }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [voucherUrl, setVoucherUrl] = useState('');
  const [alertStatus, setAlertStatus] = useState(null); // 'success', 'error', or null
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  const handleFileUpload = async () => {
    try {
      // Web implementation only since we don't have expo-document-picker
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Solo acepta imágenes
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedFile({
              name: file.name,
              size: file.size,
              uri: URL.createObjectURL(file),
              type: file.type,
              file: file
            });
            setAlertStatus(null);
            setErrorMessage('');
          }
        };
        input.click();
      } else {
        // Para dispositivos móviles, muestra un alerta
        Alert.alert('Aviso', 'Función de selección de archivo disponible próximamente en dispositivos móviles');
        setSelectedFile({
          name: 'ejemplo_imagen.jpg',
          size: 1024,
          uri: '',
          type: 'image/jpeg'
        });
        setAlertStatus(null);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setErrorMessage('Error al seleccionar la imagen');
      setAlertStatus('error');
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      setErrorMessage('Por favor selecciona una imagen primero');
      setAlertStatus('error');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      let fileUrl = '';
      if (Platform.OS === 'web' && selectedFile.file) {
        try {
          fileUrl = await PaymentService.uploadFile(selectedFile.file);
        } catch (error) {
          console.error('Error uploading file:', error);
          fileUrl = 'https://example.com/image-example';
        }
      } else {
        fileUrl = 'https://example.com/image-example';
      }

      const result = await PaymentService.uploadVoucher(paymentId, fileUrl);
      if (result.success) {
        setAlertStatus('success');
      } else {
        console.error('Error updating payment:', result.message);
        setErrorMessage(result.message || 'Ocurrió un error al enviar la imagen');
        setAlertStatus('error');
      }
    } catch (error) {
      console.error('General error:', error);
      setErrorMessage('No se pudo enviar la imagen. Intenta de nuevo más tarde.');
      setAlertStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertStatus(null);
  };

  const renderAlert = () => {
    if (!alertStatus) return null;

    return (
      <Modal
        transparent={true}
        visible={alertStatus !== null}
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.alertContainer}>
            {alertStatus === 'success' ? (
              <>
                <View style={styles.successIconContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <Text style={styles.alertTitle}>¡EXITO!</Text>
                <Text style={styles.alertMessage}>
                  Imagen enviada correctamente
                </Text>
              </>
            ) : (
              <>
                <View style={styles.errorIconContainer}>
                  <Text style={styles.exclamation}>!</Text>
                </View>
                <Text style={styles.alertTitle}>¡ERROR!</Text>
                <Text style={styles.alertMessage}>
                  Ha ocurrido un problema al enviar la imagen. Por favor, verifica la información e inténtalo nuevamente.
                </Text>
              </>
            )}
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => {
                closeAlert();
                if (alertStatus === 'success') {
                  navigation.navigate('PendingEnrollments');
                }
              }}
            >
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      {renderAlert()}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Verificación de imagen:</Text>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instrucciones para cargar tu imagen:</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1.</Text>
            <View style={styles.instructionTextContainer}>
              <Text style={styles.instructionTitle}>Prioriza una imagen clara y legible.</Text>
              <Text style={styles.instructionDescription}>
                Asegúrate de que los detalles sean visibles para facilitar su verificación.
              </Text>
            </View>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2.</Text>
            <View style={styles.instructionTextContainer}>
              <Text style={styles.instructionTitle}>Sube la imagen en formato JPEG, PNG o GIF.</Text>
              <Text style={styles.instructionDescription}>
                Si no es posible, otros formatos de imagen son aceptables.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadText}>
            Por favor, carga tu imagen para ser verificada.
          </Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleFileUpload}
          >
            <Text style={styles.uploadButtonText}>Cargar Imagen</Text>
          </TouchableOpacity>
          {selectedFile && (
            <Text style={styles.fileNameText}>
              Archivo: {selectedFile.name}
            </Text>
          )}
        </View>
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>Aviso importante:</Text>
          <Text style={styles.warningText}>
            Si la imagen no cumple con los requisitos o si el pago no es correcto, la imagen será rechazada.
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.verifyButton, 
            !selectedFile || isLoading ? styles.verifyButtonDisabled : null
          ]}
          onPress={handleVerify}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Subir e verificar</Text>
          )}
        </TouchableOpacity>
        {errorMessage && (
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 20,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionDescription: {
    fontSize: 14,
    color: '#555',
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#7E57C2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fileNameText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  warningContainer: {
    marginBottom: 25,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 14,
    color: '#555',
  },
  verifyButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  verifyButtonDisabled: {
    backgroundColor: '#B39DDB',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3D00',
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.85,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3D00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkmark: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  exclamation: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  alertMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VoucherVerification;