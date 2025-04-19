import React from 'react';
import Sidebar from '../../components/SideBar';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

export default function CourseDetailScreenIns({ route, navigation }) {
  const { course } = route.params; // Recibe el curso seleccionado
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString(); // ⚠️ month - 1 porque Date usa 0-11
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navigation={navigation}
      />
      {/* Imagen del Curso */}
      {typeof course.image === 'object' && course.image !== null ? (
        <Image source={course.image} style={styles.courseImage} />
      ) : typeof course.image === 'string' && course.image ? (
        <Image source={{ uri: course.image }} style={styles.courseImage} />
      ) : course.bannerPath ? (
        <Image source={{ uri: course.bannerPath }} style={styles.courseImage} />
      ) : (
        <Image source={require('../../../assets/Test.png')} style={styles.courseImage} />
      )}
      {/* Título del Curso */}
      <Text style={styles.title}>{course.title}</Text>
      {/* Creado por */}
      <View style={styles.creatorContainer}>
        <Image source={require('../../../assets/User.png')} style={styles.userIcon} />
        <Text style={styles.creator}>Creado por: {
          course.autor ||
          course.instructor ||
          (course.instructor && course.instructor.name) ||
          'Instructor'
        }</Text>
      </View>
      {/* Calificación */}
      <View style={styles.ratingContainer}>
        <Image source={require('../../../assets/Star.png')} style={styles.starIcon} />
        <Text style={styles.rating}>{course.rating ? course.rating.toFixed(1) : '0.0'}</Text>
      </View>
      {/* Descripción */}
      <Text style={styles.description}>{course.description || 'Sin descripción disponible'}</Text>
      <View style={styles.keyContentContainer}>
        <Image source={require('../../../assets/Alfiler.png')} style={styles.checkIcon} />
        <Text style={styles.keyContentTitle}>Contenido clave:</Text>
      </View>
      {/* Lista de módulos y lecciones */}
      {course.modules?.map((module) => (
        <View key={module.moduleId} style={styles.moduleContainer}>
          <View style={styles.moduleHeader}>
            <Image source={require('../../../assets/GreenCheck.png')} style={styles.checkIcon} />
            <Text style={styles.moduleTitle}>{module.name}</Text>
          </View>
          <View style={styles.lessonContainer}>
            {(module.sections || []).map((lesson, index) => (
              <Text key={lesson.sectionId || index} style={styles.lessonText}>
                - {lesson.name}
              </Text>
            ))}
          </View>
        </View>
      ))}
      {/* Información del curso */}
      <View style={styles.infoContainer}>
        <View style={styles.durationContainer}>
          <Image source={require('../../../assets/RelojArena.png')} style={styles.icon} />
          <Text style={styles.infoText}>Duración: {course.duration || 0} Hrs</Text>
        </View>
        <View style={styles.prerequisitesContainer}>
          <Image source={require('../../../assets/Book.png')} style={styles.icon} />
          {course.startDate && course.endDate ? (
            <Text style={styles.infoText}>
              Fechas: {formatDate(course.startDate)} - {formatDate(course.endDate)}
            </Text>
          ) : (
            <Text style={styles.infoText}>Requisitos: {course.prerequisites || 'Ninguno'}</Text>
          )}
        </View>
      </View>
      {/* Detalles adicionales */}
      <View style={styles.additionalInfoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cupos totales:</Text>
          <Text style={styles.infoValue}>{course.size || 0}</Text>
        </View>
      </View>
      {/* Categorías */}
      {course.categories && course.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categorías:</Text>
          <View style={styles.categoriesList}>
            {course.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Comentarios */}
      <View style={styles.commentsContainer}>
        <Image source={require('../../../assets/Comment.png')} style={styles.commentIcon} />
        <Text style={styles.comments}>{course.comments || '0'} Comentarios</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  creator: {
    fontSize: 14,
    color: '#800080',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#800080',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  keyContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  keyContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
  },
  additionalInfoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#604274',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: '#604274',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  comments: {
    fontSize: 14,
  },
  /* Estilos para modules */
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lessonContainer: {
    paddingLeft: 24, // Indenta las lecciones respecto al icono
  },
  lessonText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  moduleContainer: {
    backgroundColor: '#F3F2F5', // Suave fondo lila/gris
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }
});