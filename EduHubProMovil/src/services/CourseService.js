import { API_BASE_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Servicio para gestionar las operaciones relacionadas con cursos
 */
export default class CourseService {
  /**
   * Obtiene todos los cursos disponibles para estudiantes
   * @returns {Promise} Promesa con los datos de los cursos
   */
  static async getAllCourses() {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      // Realizar petición al endpoint
      const response = await fetch(`${API_BASE_URL}/student/course/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      // Convertir respuesta a JSON
      const data = await response.json();
      
      // Validar si la respuesta fue exitosa (type SUCCESS)
      if (data && data.type === 'SUCCESS') {
        console.log('Cursos cargados exitosamente:', data.result);
        return data.result;
      } else {
        console.error('Error al cargar cursos:', data);
        throw new Error(data?.text || 'Error al obtener los cursos');
      }
    } catch (error) {
      console.error('Error en la petición de cursos:', error);
      throw error;
    }
  }
} 