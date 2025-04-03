// Constantes para la aplicación EduHubPro

// URL base para las peticiones al backend
export const API_BASE_URL = 'http://localhost:8080/eduhubpro';


// Endpoints específicos
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  COURSES: '/courses',
  PROFILE: '/profile',
  ENROLLMENTS: '/enrollments',
};

// Constantes para almacenamiento local
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  USER_ROLE: 'userRole',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
};

// Mensajes de error/éxito
export const MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_ERROR: 'Error al iniciar sesión. Verifica tus credenciales.',
  NETWORK_ERROR: 'Error al iniciar sesión. Verifica tus credenciales.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  REGISTER_SUCCESS: 'Usuario registrado correctamente',
  REGISTER_ERROR: 'Error al registrar usuario. Intenta nuevamente.',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  FIELDS_REQUIRED: 'Todos los campos son obligatorios',
};