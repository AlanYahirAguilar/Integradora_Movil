import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../SideBar';
import CourseService from '../../services/CourseService';
import { ACTIONS, useCourseProgress } from '../../context/CourseProgressProvider';

const CourseModuleDetails = ({ navigation, route }) => {

  const { dispatch } = useCourseProgress();

  // Estado para almacenar los datos del curso
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Estado para la barra lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Escuchar eventos de toggle de la barra lateral desde los parámetros de navegación
  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Cargar los datos del curso cuando el componente se monta
  useEffect(() => {
    if (route.params?.course) {
      // Limpiar módulos antes de hacer la petición
      const { modules, ...courseWithoutModules } = route.params.course;
      setCourseData({
        ...courseWithoutModules,
        modules: [] // aseguramos que esté limpio
      });
      loadModulesWithSections(route.params.course.courseId); // Fetch
      setIsLoading(false);
    } else if (route.params?.courseId) {
      // Aquí se podría implementar una llamada a la API para obtener los detalles del curso
      // por ahora solo mostramos un error
      Alert.alert('Error', 'No se pudieron cargar los detalles del curso');
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [route.params]);

  const loadModulesWithSections = async (courseId) => {
    console.log('\nCARGANDO MODULOS\n', courseId);

    const response = await CourseService.fetchModulesWithSectionsByCourse(courseId); // ← tu servicio
    const modules = response.data;
    console.log(modules);

    if (modules) {
      setCourseData(prev => ({ ...prev, modules }));
      // despacha todo al contexto
      dispatch({
        type: ACTIONS.LOAD_COURSE_STRUCTURE,
        payload: { courseId, modules }
      });
    }
  };

  // Función para renderizar cada módulo
  const renderModuleItem = ({ item }) => {
    // Determinar el estado del módulo
    let icon, buttonText, buttonStyle, isDisabled;
    if (item.status === 'UNLOCKED' || item.status === 'COMPLETED') {
      icon = <Ionicons name="lock-open" size={24} color="#673AB7" />;
      buttonText = "Ver Módulo";
      buttonStyle = styles.viewButton;
      isDisabled = false;
    } else {
      icon = <Ionicons name="lock-closed" size={24} color="#888" />;
      buttonText = "Bloqueado";
      buttonStyle = styles.lockedButton;
      isDisabled = true;
    }

    return (
      <View style={styles.moduleItem}>
        <View style={styles.moduleInfo}>
          {icon}
          <Text style={styles.moduleTitle}>Módulo {item.name}</Text>
        </View>
        <TouchableOpacity
          style={buttonStyle}
          disabled={isDisabled}
          onPress={() => handleModulePress(item)}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Función para renderizar cada sección dentro de un módulo
  const renderSectionItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.sectionItem}
        onPress={() => handleSectionPress(item)}
      >
        <View style={styles.sectionInfo}>
          <Ionicons
            name={getIconByContentType(item.contentType)}
            size={24}
            color="#673AB7"
          />
          <Text style={styles.sectionTitle}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#673AB7" />
      </TouchableOpacity>
    );
  };

  // Función para manejar el clic en un módulo
  const handleModulePress = (module) => {
    if (module.sections && module.sections.length > 0) {
      navigation.navigate('ModuleSections', {
        moduleId: module.moduleId,
        moduleName: module.name,
        sections: module.sections,
        status: module.status,
      });
    } else {
      Alert.alert('Información', 'Este módulo aún no tiene contenido disponible.');
    }
  };

  // Función para manejar el clic en una sección
  const handleSectionPress = (section) => {
    let contentType = section.contentType || 'image';
    if (!section.contentType && section.contentUrl) {
      const url = section.contentUrl.toLowerCase();
      if (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi')) {
        contentType = 'video';
      } else if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')) {
        contentType = 'image';
      } else if (url.endsWith('.pdf')) {
        contentType = 'pdf';
      }
    }
    navigation.navigate('LessonDetail', {
      sectionId: section.sectionId,
      sectionName: section.name,
      sectionDescription: section.description,
      contentUrl: section.contentUrl,
      contentType: contentType
    });
  };

  // Si está cargando, mostrar un indicador
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#673AB7" />
        <Text style={styles.loadingText}>Cargando detalles del curso...</Text>
      </View>
    );
  }

  // Si no hay datos del curso, mostrar un mensaje
  if (!courseData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudieron cargar los detalles del curso</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver a Mis Cursos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Encontrar el módulo desbloqueado para mostrar sus secciones
  const unlockedModule = courseData.modules.find(module => module.status === 'UNLOCKED');

  // Verificar si todos los módulos están completados
  const allModulesCompleted = courseData.modules.every(mod => mod.isAttended);

  console.log(allModulesCompleted);
  const instructorId = courseData.modules?.[0]?.instructorId;

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra lateral */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      {/* Contenido principal */}
      <ScrollView style={styles.scrollContent}>
        {/* Información del curso */}
        <View style={styles.courseInfoContainer}>
          {/* Imagen del curso */}
          {courseData.bannerPath && (
            <Image
              source={{ uri: courseData.bannerPath }}
              style={styles.courseBanner}
              resizeMode="cover"
            />
          )}
          <Text style={styles.title}>{courseData.title}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{courseData.description || 'Sin descripción disponible'}</Text>
          </View>
        </View>

        {/* Módulos del curso */}
        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Módulos del Curso</Text>
          <FlatList
            data={courseData.modules}
            renderItem={renderModuleItem}
            keyExtractor={item => item.moduleId}
            scrollEnabled={false} // Desactivamos el scroll interno para que el ScrollView control todo
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Botón para calificar curso si todos los módulos están completados */}
        {allModulesCompleted && (
          <TouchableOpacity
            style={[styles.reviewButton]}
            onPress={() => navigation.navigate('lecciones_Completado', {
              courseId: courseData.courseId,
              instructorId
            })}
          >
            <Text style={styles.reviewButtonText}>Calificar Curso</Text>
          </TouchableOpacity>
        )}

        {/* Botón para volver */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver a Mis Cursos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  reviewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#673AB7',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  courseInfoContainer: {
    marginBottom: 20,
  },
  courseBanner: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  modulesContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  modulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 15,
    textAlign: 'center',
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
  },
  moduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  lockedButton: {
    backgroundColor: '#888',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  backButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseModuleDetails;