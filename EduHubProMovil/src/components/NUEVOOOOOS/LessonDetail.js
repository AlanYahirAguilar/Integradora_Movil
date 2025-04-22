import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Sidebar from '../../components/SideBar';
import VideoPlayer from '../../components/VideoPlayer';

import {
  ACTIONS,
  getNextSectionIdInModule,
  getPrevSectionIdInModule,
  useCourseProgress,
} from '../../context/CourseProgressProvider';
import CourseService from '../../services/CourseService';

const LessonDetail = ({ route, navigation }) => {


  /* ---------- Context ---------- */
  const { state, dispatch } = useCourseProgress();
  const { sectionId, moduleId: paramModuleId } = route.params;

  /* ---------- Datos de la lección ---------- */
  const section = state.sectionEntities[sectionId];
  const nextId = getNextSectionIdInModule(state, sectionId);
  const prevId = getPrevSectionIdInModule(state, sectionId);

  const moduleId = paramModuleId || section?.moduleId;   // respaldo desde el contexto

  /* ---------- Sidebar ---------- */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false });
    }
  }, [route.params?.toggleSidebar]);

  /* ---------- Guardar "sección actual" ---------- */
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_CURRENT_SECTION, payload: sectionId });
  }, [sectionId]);

  /* ---------- Helpers ---------- */
  const renderContentIcon = () => {
    switch (section?.contentType) {
      case 'video':
        return <Ionicons name="videocam" size={24} color="#673AB7" />;
      case 'image':
        return <Ionicons name="image" size={24} color="#673AB7" />;
      case 'pdf':
        return <Ionicons name="document-text" size={24} color="#673AB7" />;
      default:
        return <Ionicons name="document" size={24} color="#673AB7" />;
    }
  };

  const handlePreviousLesson = () => {
    if (!prevId) return;
    navigation.replace('LessonDetail', { sectionId: prevId });
  };

  /* ---------- avanzar ---------- */
  const handleNextLesson = async () => {
    // 1) Hay otra lección dentro del mismo módulo ➜ navegar
    if (nextId) {
      navigation.replace('LessonDetail', {
        sectionId: nextId,
        moduleId,            // ← aseguramos que viaje
      });
      return;
    }

    // 2) Esta es la última lección del módulo
    if (section.isLast) {
      const attendResp = await CourseService.fetchCompleteSection(sectionId);
      if (!attendResp.success) {
        Alert.alert('Error', attendResp.error);
        return;
      }
      Alert.alert('Éxito', 'Asistencia registrada');

      // refrescar malla
      console.log('\Actualizando malla\n', section.courseId);
      
      const modsResp = await CourseService.fetchModulesWithSectionsByCourse(
        section.courseId
      );
      if (modsResp.success) {
        // Marcar el módulo actual como completado
        const updatedModules = modsResp.data.map(mod => {
          if (mod.moduleId === moduleId) {
            return { ...mod, isAttended: true };
          }
          return mod;
        });

        dispatch({
          type: ACTIONS.LOAD_COURSE_STRUCTURE,
          payload: { modules: updatedModules },
        });

        // Volver dos pantallas atrás para asegurar que llegamos a CourseModuleDetails
        navigation.goBack();
        navigation.goBack();
      }
    }
  };

  /* ---------- Loading ---------- */
  if (!section) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#673AB7" />
        <Text style={styles.loadingText}>Cargando lección…</Text>
      </SafeAreaView>
    );
  }

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.container}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#673AB7" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{section.name}</Text>
            <View style={styles.contentTypeIndicator}>
              {renderContentIcon()}
              <Text style={styles.contentTypeText}>
                {section.contentType === 'video'
                  ? 'Video'
                  : section.contentType === 'image'
                    ? 'Imagen'
                    : section.contentType === 'pdf'
                      ? 'Documento PDF'
                      : 'Contenido'}
              </Text>
            </View>
          </View>
        </View>

        {/* Contenido multimedia */}
        <View
          style={[
            styles.contentWrapper,
            section.contentType === 'pdf' && styles.pdfContentWrapper,
          ]}
        >
          {section.contentUrl ? (
            <VideoPlayer
              source={section.contentUrl}
              contentType={section.contentType}
            />
          ) : (
            <View style={styles.noContentContainer}>
              <Ionicons name="alert-circle" size={64} color="#FFB300" />
              <Text style={styles.noContentText}>
                No hay contenido disponible para esta lección
              </Text>
            </View>
          )}
        </View>

        {/* Descripción */}
        {section.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción:</Text>
            <Text style={styles.descriptionText}>{section.description}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Navegación */}
      <View style={styles.navigationButtonsContainer}>
        {/* ← PREV */}
        <TouchableOpacity
          style={[
            styles.navigationButton,
            !prevId && { opacity: 0.4 },
          ]}
          disabled={!prevId}
          onPress={handlePreviousLesson}
        >
          <Text style={styles.navigationButtonText}>Lección anterior</Text>
        </TouchableOpacity>

        {/* → NEXT  (solo se desactiva si NO hay nextId y NO es la última) */}
        <TouchableOpacity
          style={[
            styles.navigationButton,
            !nextId && !section.isLast && { opacity: 0.4 },
          ]}
          disabled={!nextId && !section.isLast}
          onPress={handleNextLesson}
        >
          <Text style={styles.navigationButtonText}>Lección siguiente</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

/* ---------- Estilos ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#673AB7' },
  scrollView: { flexGrow: 1 },
  contentContainer: { padding: 20, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  titleContainer: { flex: 1, marginLeft: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  contentTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  contentTypeText: { marginLeft: 5, fontSize: 14, color: '#666' },
  contentWrapper: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pdfContentWrapper: {
    height: Dimensions.get('window').height * 0.53,
  },
  noContentContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
  },
  noContentText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  descriptionContainer: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 10,
  },
  descriptionText: { fontSize: 16, lineHeight: 24, color: '#555' },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  navigationButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#673AB7',
    alignItems: 'center',
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LessonDetail;
