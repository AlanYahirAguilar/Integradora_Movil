// PaymentService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

class PaymentService {
  /**
   * Obtiene los pagos del estudiante desde la API
   * @returns {Promise<Array>} Lista de pagos del estudiante
   */
  async getStudentPayments() {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      console.log('Obteniendo pagos del estudiante con token:', token.substring(0, 15) + '...');
      
      // Preparar la petición
      const endpoint = `${API_BASE_URL}/student/payment/by-student`;
      const payload = {
        studentId: token
      };
      
      console.log('Enviando solicitud para obtener pagos del estudiante:', JSON.stringify(payload));
      
      // Realizar la petición usando fetch
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Código de respuesta pagos del estudiante:', response.status);
      
      // Obtener el texto de la respuesta
      const responseText = await response.text();
      console.log('Texto de respuesta pagos del estudiante:', responseText);
      
      // Si el texto está vacío pero la respuesta es exitosa
      if (!responseText && response.ok) {
        return [];
      }
      
      // Intentar parsear como JSON si hay contenido
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error al parsear JSON de pagos del estudiante:', e);
        return [];
      }
      
      if (response.ok && data.type === 'SUCCESS') {
        console.log('Pagos del estudiante obtenidos exitosamente:', data.result);
        return data.result || [];
      } else {
        const errorMsg = data?.text || data?.message || 'Error desconocido al obtener los pagos del estudiante';
        console.error('Error al obtener pagos del estudiante:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error en la petición de pagos del estudiante:', error);
      throw error;
    }
  }
  
  /**
   * Sube un voucher de pago para un curso
   * @param {string} paymentId - ID del pago
   * @param {string} paymentUrl - URL del voucher
   * @returns {Promise<Object>} Resultado de la operación
   */
  async uploadVoucher(paymentId, paymentUrl) {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      console.log('[PaymentService] Actualizando voucher para el pago:', paymentId, 'con URL:', paymentUrl);
      console.log('[PaymentService] Token de autenticación (parcial):', token.substring(0, 15) + '...');
      
      // Preparar la petición
      const endpoint = `${API_BASE_URL}/student/payment/update-url`;
      const payload = {
        paymentId: paymentId,
        paymentUrl: paymentUrl
      };
      
      console.log('[PaymentService] Enviando solicitud a:', endpoint);
      console.log('[PaymentService] Payload:', JSON.stringify(payload));
      
      // Realizar la petición usando fetch
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('[PaymentService] Código de respuesta actualizar voucher:', response.status);
      
      // Obtener el texto de la respuesta
      const responseText = await response.text();
      console.log('[PaymentService] Texto de respuesta actualizar voucher:', responseText);
      
      // Si el texto está vacío pero la respuesta es exitosa
      if (!responseText && response.ok) {
        return { success: true, message: 'Voucher actualizado correctamente' };
      }
      
      // Intentar parsear como JSON si hay contenido
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
        console.log('[PaymentService] Datos parseados:', data);
      } catch (e) {
        console.error('[PaymentService] Error al parsear JSON de actualizar voucher:', e);
        return { success: false, message: 'Error al procesar la respuesta del servidor' };
      }
      
      if (response.ok && data.type === 'SUCCESS') {
        console.log('[PaymentService] Voucher actualizado exitosamente:', data.result);
        return { 
          success: true, 
          message: data.text || 'Voucher actualizado correctamente',
          payment: data.result
        };
      } else {
        const errorMsg = data?.text || data?.message || 'Error desconocido al actualizar el voucher';
        console.error('[PaymentService] Error al actualizar voucher:', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error('[PaymentService] Error en la petición de actualizar voucher:', error);
      return { success: false, message: error.message || 'Error al actualizar el voucher' };
    }
  }
  
  /**
   * Sube un archivo al servidor y devuelve la URL
   * @param {object} fileData - Datos del archivo a subir
   * @returns {Promise<string>} URL del archivo subido
   */
  async uploadFile(fileData) {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      console.log('[PaymentService] Iniciando carga de archivo');
      
      // Preparar la petición
      const endpoint = `${API_BASE_URL}/api/storage/upload`;
      
      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', fileData);
      
      console.log('[PaymentService] Enviando archivo a:', endpoint);
      
      // Realizar la petición usando fetch
      const response = await fetch(endpoint, {
        method: 'POST', // POST es correcto para subir archivos
        headers: {
          'Authorization': `Bearer ${token}`
          // No incluir Content-Type para que el navegador establezca el boundary correcto para FormData
        },
        body: formData
      });
      
      console.log('[PaymentService] Código de respuesta subida de archivo:', response.status);
      
      // Obtener el texto de la respuesta
      const responseText = await response.text();
      console.log('[PaymentService] Respuesta subida de archivo:', responseText);
      
      if (!response.ok) {
        throw new Error(`Error al subir archivo: ${response.status}`);
      }
      
      // La respuesta es directamente la URL como string
      return responseText;
    } catch (error) {
      console.error('[PaymentService] Error al subir archivo:', error);
      throw error;
    }
  }
}

export default new PaymentService();
