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
        /* console.log('Cursos cargados exitosamente:', data.result); */
        return data.result;
      } else {
        //console.error('Error al cargar cursos:', data);
        throw new Error(data?.text || 'Error al obtener los cursos');
      }
    } catch (error) {
      //    console.error('Error en la petición de cursos:', error);
      throw error;
    }
  }

  /**
   * Registra un estudiante en un curso
   * @param {string} courseId - ID del curso al que se desea inscribir
   * @returns {Promise} Promesa con el resultado de la inscripción
   */
  static async enrollCourse(courseId) {
    try {
      /* console.log('Iniciando inscripción al curso con ID:', courseId); */

      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      /* console.log('Token obtenido para inscripción:', token.substring(0, 15) + '...'); */

      // Estructura del payload según el ejemplo proporcionado
      const payload = {
        studentId: token, // El ID del estudiante es el token JWT
        courseId: courseId
      };

      /* console.log('Enviando solicitud de inscripción con payload:', JSON.stringify(payload)); */

      // Realizar petición al endpoint de inscripción
      const response = await fetch(`${API_BASE_URL}/student/registration/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      /* console.log('Código de respuesta inscripción:', response.status); */

      // Obtener el texto de la respuesta
      const responseText = await response.text();
      /* console.log('Texto de respuesta inscripción:', responseText); */

      // Manejar caso específico de error 409 (Conflict) - Ya inscrito
      if (response.status === 409) {
        let errorMessage = 'Ya está inscrito en este curso';
        try {
          const data = JSON.parse(responseText);
          if (data && data.text) {
            errorMessage = data.text;
          }
        } catch (e) {
          //    console.error('Error al parsear respuesta de conflicto:', e);
        }

        // Devolver objeto con información del error para mostrar alerta personalizada
        return {
          success: false,
          isAlreadyEnrolled: true,
          message: errorMessage
        };
      }

      // Si el texto está vacío pero la respuesta es exitosa
      if (!responseText && response.ok) {
        return { success: true, message: 'Inscripción realizada correctamente' };
      }

      // Intentar parsear como JSON si hay contenido
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        //    console.error('Error al parsear JSON de inscripción:', e);
        // Si la respuesta es exitosa pero no es JSON, consideramos éxito
        if (response.ok) {
          return { success: true, message: 'Inscripción realizada correctamente' };
        }
        throw new Error('El servidor no respondió con un formato válido');
      }

      if (response.ok) {
        /* console.log('Inscripción exitosa:', data); */
        return { success: true, message: 'Inscripción realizada correctamente', data: data.result || data };
      } else {
        const errorMsg = data?.text || data?.message || 'Error desconocido al realizar la inscripción';
        //    console.error('Error en inscripción:', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      //   console.error('Error en inscripción al curso:', error);
      return { success: false, message: error.message || 'Error al procesar la inscripción' };
    }
  }

  /**
   * Obtiene los cursos en los que está inscrito el estudiante
   * @returns {Promise} Promesa con los datos de los cursos del estudiante
   */
  static async getStudentCourses() {
    try {
      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      /* console.log('Obteniendo cursos del estudiante con token:', token.substring(0, 15) + '...'); */

      // Estructura del payload según el ejemplo proporcionado
      const payload = {
        userId: token // El ID del estudiante es el token JWT
      };

      /* console.log('Enviando solicitud para obtener cursos del estudiante:', JSON.stringify(payload)); */

      // Realizar petición al endpoint
      const response = await fetch(`${API_BASE_URL}/student/course/in_progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      /* console.log('Código de respuesta cursos del estudiante:', response.status); */

      // Obtener el texto de la respuesta
      const responseText = await response.text();
      /* console.log('Texto de respuesta cursos del estudiante:', responseText); */

      // Si el texto está vacío pero la respuesta es exitosa
      if (!responseText && response.ok) {
        return [];
      }

      // Intentar parsear como JSON si hay contenido
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        //  console.error('Error al parsear JSON de cursos del estudiante:', e);
        return [];
      }

      if (response.ok && data.type === 'SUCCESS') {
        /* console.log('Cursos del estudiante obtenidos exitosamente:', data.result); */
        return data.result || [];
      } else {
        const errorMsg = data?.text || data?.message || 'Error desconocido al obtener los cursos del estudiante';
        // console.error('Error al obtener cursos del estudiante:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      //    console.error('Error en la petición de cursos del estudiante:', error);
      throw error;
    }
  }

  // Traer todos los cursos inscritos por estudiante
  static async fetchRegistrationByStudent() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    return await fetch(`${API_BASE_URL}/student/course/registered`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId: token })
    }).then((response) => response.json())
      .then((response) => {
        console.log("Respuesta: ", response);

        if (response.type !== "SUCCESS") {
          if (typeof response === "object" && !response.text) {
            const errorMessages = Object.values(response).join("\n");
            return { success: false, error: errorMessages };
          }

          if (response.text) {
            return { success: false, error: response.text };
          }

          return { success: false, error: "Ha ocurrido un error. Por favor intenta de nuevo más tarde." };
        }

        return { success: true, data: response.result };
      })
      .catch((error) => {
        return { success: false, error: error?.message || "Ha ocurrido un error. Por favor intenta de nuevo más tarde." };
      });
  };

}