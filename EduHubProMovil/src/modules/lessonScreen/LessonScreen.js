import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Para la barra de progreso
import VideoPlayer from '../../components/VideoPlayer'; // Importa el reproductor de video
import CodeBlock from '../../components/CodeBlock'; // Importa el bloque de código

export default function LessonScreen({ route }) {
  //const { lesson, courseTitle } = route.params; // Recibe la lección y el título del curso

  // Comentamos la validación de datos dinámicos para maquetado estático
  // if (!lesson || !courseTitle) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Error: Datos faltantes para esta lección.</Text>
  //     </View>
  //   );
  // }

  // Simulamos datos estáticos para maquetado
  const lesson = {
    currentLesson: 3,
    totalLessons: 8,
    progress: 60,
    description: 'En esta lección, aprenderás sobre los principios fundamentales del diseño de software.',
    media: {
      type: 'video',
      source: 'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    },
    keyConcepts: {
      description: 'React es una biblioteca de JavaScript para construir interfaces de usuario.',
      example: `
function Welcome(props) {
  return <h1>Hola, ${props.name}!</h1>;
}

const App = () => {
  return (
    <div>
      <Welcome name="Juan" />
      <Welcome name="María" />
    </div>
  );
};

export default App;
`,
    },
    relatedLessons: [
      {
        id: '1',
        name: 'Lección 1: Fundamentos',
        status: 'completed',
        action: 'Revisar',
      },
      {
        id: '2',
        name: 'Lección 2: Patrones de Diseño',
        status: 'inProgress',
        action: 'Continuar',
      },
      {
        id: '3',
        name: 'Lección 3: Arquitectura Hexagonal',
        status: 'locked',
        action: 'Bloqueado',
      },
    ],
  };
  const courseTitle = 'Introducción a Arquitectura de Software';

  return (
    <View style={styles.container}>
      {/* Título del Curso */}
      <Text style={styles.courseTitle}>{courseTitle}</Text>

      {/* Información de la Lección */}
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonNumber}>
          Lección {lesson.currentLesson} de {lesson.totalLessons}
        </Text>
        <ProgressBar progress={lesson.progress / 100} width={null} style={styles.progressBar} />
        <Text style={styles.progressText}>Progreso: {lesson.progress}%</Text>
      </View>

      {/* Contenido Principal */}
      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>Contenido Principal</Text>
        <Text style={styles.contentDescription}>{lesson.description}</Text>
        {lesson.media && (
          <View style={styles.mediaContainer}>
            <Text style={styles.mediaLabel}>Video/Imagen</Text>
            {lesson.media.type === 'video' ? (
              <VideoPlayer source={lesson.media.source} /> // Implementa un componente VideoPlayer si es necesario
            ) : (
              <Image source={{ uri: lesson.media.source }} style={styles.mediaImage} />
            )}
          </View>
        )}
      </View>

      {/* Conceptos Clave */}
      {lesson.keyConcepts && (
        <View style={styles.conceptsContainer}>
          <Text style={styles.conceptsTitle}>Conceptos Clave</Text>
          <Text style={styles.conceptsDescription}>{lesson.keyConcepts.description}</Text>
          {lesson.keyConcepts.example && (
            <CodeBlock code={lesson.keyConcepts.example} /> // Implementa un componente CodeBlock si es necesario
          )}
        </View>
      )}

      {/* Lecciones Relacionadas */}
      <View style={styles.relatedLessonsContainer}>
        <Text style={styles.relatedLessonsTitle}>Lecciones Relacionadas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {lesson.relatedLessons.map((relatedLesson) => (
            <View key={relatedLesson.id} style={styles.lessonCard}>
              <Text style={styles.lessonStatus}>
                {relatedLesson.status === 'completed' && (
                  <Image source={require('../../../assets/Completado.png')} style={styles.checkIcon} />
                )}
                {relatedLesson.status === 'inProgress' && (
                  <Image source={require('../../../assets/Reintentar.png')} style={styles.waitingIcon} />
                )}
                {relatedLesson.status === 'locked' && (
                  <Image source={require('../../../assets/Bloqueado.png')} style={styles.lockIcon} />
                )}
              </Text>
              <Text style={styles.lessonName}>{relatedLesson.name}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>{relatedLesson.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Navegación entre Lecciones */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Lección Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Lección Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lessonInfo: {
    marginBottom: 16,
  },
  lessonNumber: {
    fontSize: 16,
    color: '#800080',
  },
  progressBar: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  contentContainer: {
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  mediaContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaLabel: {
    fontSize: 14,
    color: '#800080',
    marginBottom: 8,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  conceptsContainer: {
    marginBottom: 16,
  },
  conceptsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  conceptsDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  relatedLessonsContainer: {
    marginBottom: 16,
  },
  relatedLessonsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  lessonStatus: {
    marginBottom: 8,
  },
  checkIcon: {
    width: 24,
    height: 24,
    tintColor: '#4CAF50', // Color verde para "completado"
  },
  waitingIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFC107', // Color amarillo para "en progreso"
  },
  lockIcon: {
    width: 24,
    height: 24,
    tintColor: '#F44336', // Color rojo para "bloqueado"
  },
  lessonName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#800080',
    padding: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center', // Centra el texto horizontalmente
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});