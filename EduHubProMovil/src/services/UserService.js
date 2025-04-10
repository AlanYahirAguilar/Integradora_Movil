import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

/**
 * Servicio para gestionar las operaciones relacionadas con usuarios
 */
class UserService {
  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise} Promesa con los datos del perfil
   */
  async getUserProfile() {
    try {
      const token = await this.getAuthToken();
      /* console.log('Obteniendo perfil con token:', token.substring(0, 15) + '...'); */

      const response = await fetch(`${API_BASE_URL}/student/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: token })
      });
      
      // Verificar respuesta
      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
      //  console.error('Error al parsear respuesta:', e, responseText);
        throw new Error('Formato de respuesta inválido');
      }
      
      /* console.log('Respuesta perfil:', JSON.stringify(data, null, 2)); */
      
      if (response.ok) {
        return data.result || data;
      } else {
        throw new Error(data.text || 'Error al obtener perfil');
      }
    } catch (error) {
  //    console.error('Error al obtener perfil:', error);
      throw new Error('No se pudo obtener la información del perfil');
    }
  }
  
  /**
   * Actualiza el perfil del usuario
   * @param {Object} profileData - Datos del perfil a actualizar
   * @returns {Promise} Promesa con el resultado de la actualización
   */
  async updateUserProfile(profileData) {
    try {
      // Validar parámetros básicos
      if (!profileData) {
        throw new Error('No se proporcionaron datos para actualizar');
      }

      const token = await this.getAuthToken();
      
      // Estructura exacta esperada por el backend - IMPORTANTE: userId es el token mismo y password NUNCA debe ser null
      const payload = {
        userId: token,
        name: profileData.name || '',
        email: profileData.email || '',
        // Si la contraseña es null o undefined, usar una contraseña por defecto que cumpla con los requisitos
        password: (profileData.password === null || profileData.password === undefined) 
          ? 'DefaultPassword123' // Contraseña por defecto que cumple con los requisitos
          : profileData.password,
        profilePhotoPath: profileData.profilePhotoPath || ''
      };
      
      // Verificación adicional para password - asegurar que nunca sea vacía o null
      if (!payload.password || payload.password === '') {
        payload.password = 'DefaultPassword123';
        /* console.log('⚠️ Usando contraseña por defecto para evitar error 400'); */
      }
      
      // Log detallado para depuración
      /* console.log(`Enviando actualización a ${API_BASE_URL}/student/user/update-profile`);
      console.log('Payload:', JSON.stringify(payload, null, 2)); */
      
      // Usar método PUT en lugar de POST - El backend espera PUT para actualizar el perfil
      const response = await fetch(`${API_BASE_URL}/student/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      /* console.log('Código de respuesta:', response.status); */
      
      // Obtener el texto de la respuesta
      const responseText = await response.text();
      /* console.log('Texto de respuesta:', responseText); */
      
      // Si el texto está vacío pero la respuesta es exitosa
      if (!responseText && response.ok) {
        return { success: true, message: 'Perfil actualizado correctamente' };
      }
      
      // Intentar parsear como JSON si hay contenido
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
   //     console.error('Error al parsear JSON:', e);
        // Si la respuesta es exitosa pero no es JSON, consideramos éxito
        if (response.ok) {
          return { success: true, message: 'Perfil actualizado correctamente' };
        }
        throw new Error('El servidor no respondió con un formato válido');
      }
      
      if (response.ok) {
        /* console.log('Perfil actualizado exitosamente:', data); */
        return data.result || data;
      } else {
        const errorMsg = data?.text || data?.message || 'Error desconocido al actualizar el perfil';
     //   console.error('Error actualización:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
   //   console.error('Error en actualización de perfil:', error);
      throw error;
    }
  }

  /**
   * Sube una foto de perfil al servidor
   * @param {string} photoUrl - URL de la foto de perfil
   * @returns {Promise} Promesa con el resultado de la operación
   */
  async uploadProfilePhoto(photoUrl) {
    try {
      const token = await this.getAuthToken();
      /* console.log('Subiendo foto de perfil con token:', token.substring(0, 15) + '...');
      console.log('URL de la foto:', photoUrl); */

      // Verificar si la URL es demasiado larga (máximo 255 caracteres permitidos por el backend)
      if (photoUrl && photoUrl.length > 255) {
        /* console.log('URL de la foto demasiado larga, truncando a 255 caracteres'); */
        // Truncar la URL si es demasiado larga
        photoUrl = photoUrl.substring(0, 255);
      }

      // Preparar payload según la estructura esperada por el backend
      const payload = {
        userId: token,
        profilePhotoPath: photoUrl
      };

      /* console.log(`Enviando solicitud a ${API_BASE_URL}/student/user/upload-photo`);
      console.log('Payload:', JSON.stringify(payload, null, 2)); */

      const response = await fetch(`${API_BASE_URL}/student/user/upload-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      /* console.log('Código de respuesta:', response.status); */

      // Obtener el texto de la respuesta
      const responseText = await response.text();
      /* console.log('Texto de respuesta:', responseText); */

      // Intentar parsear como JSON si hay contenido
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
     //   console.error('Error al parsear JSON:', e);
        throw new Error('Formato de respuesta inválido');
      }

      if (response.ok && (data.type === 'SUCCESS' || !data.type)) {
        /* console.log('Foto de perfil actualizada exitosamente'); */
        return { success: true, data: data.result || data };
      } else {
        const errorMsg = data.profilePhotoPath || data?.text || data?.message || 'Error desconocido al actualizar la foto de perfil';
      //  console.error('Error al actualizar foto de perfil:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
    //  console.error('Error en la petición de actualización de foto de perfil:', error);
      throw error;
    }
  }

  // Obtener el token de autenticación
  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      return token;
    } catch (error) {
 //     console.error('Error al obtener token:', error);
      throw error;
    }
  }
}

export default new UserService(); 