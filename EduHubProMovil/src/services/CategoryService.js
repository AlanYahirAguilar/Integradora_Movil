import { API_BASE_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Servicio para gestionar las operaciones relacionadas con categorías
 */
export default class CategoryService {
  /**
   * Obtiene todas las categorías activas
   * @returns {Promise} Promesa con los datos de las categorías
   */
  static async getActiveCategories() {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      // Realizar petición al endpoint
      const response = await fetch(`${API_BASE_URL}/student/category/get-actives`, {
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
        console.log('Categorías cargadas exitosamente:', data.result);
        return data.result;
      } else {
        console.error('Error al cargar categorías:', data);
        throw new Error(data?.text || 'Error al obtener las categorías');
      }
    } catch (error) {
      console.error('Error en la petición de categorías:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene los cursos de una categoría específica
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise} Promesa con los cursos de la categoría
   */
  static async getCoursesByCategory(categoryId) {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      // Realizar petición al endpoint con el ID de categoría en el body
      const response = await fetch(`${API_BASE_URL}/student/course/by-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          categoryId: categoryId
        }),
      });
      
      // Convertir respuesta a JSON
      const data = await response.json();
      
      // Validar si la respuesta fue exitosa (type SUCCESS)
      if (data && data.type === 'SUCCESS') {
        console.log('Cursos por categoría cargados exitosamente:', data.result);
        return data.result;
      } else {
        console.error('Error al cargar cursos por categoría:', data);
        throw new Error(data?.text || 'Error al obtener los cursos por categoría');
      }
    } catch (error) {
      console.error('Error en la petición de cursos por categoría:', error);
      throw error;
    }
  }
} 