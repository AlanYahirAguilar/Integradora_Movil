import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CodeExampleScreen = ({ lesson }) => {
  // Validación de datos para evitar errores
  if (!lesson || !lesson.lessons) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Datos de lección no disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>{lesson.title}</Text>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressText}>
          Lección {lesson.currentLesson} de {lesson.totalLessons}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${lesson.progress}%` }]}
          />
        </View>
      </View>

      {/* Contenido Principal */}
      <Text style={styles.description}>{lesson.description}</Text>

      {/* Código de Ejemplo */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeTitle}>Ejemplo:</Text>
        <Text style={styles.codeExample}>
          {`function Welcome(props) {\n`}
          {`  return (\n`}
          {`    <h1>Hola, {props.name}</h1>\n`}
          {`  );\n`}
          {`}\n\n`}
          {`const App = () => {\n`}
          {`  return (\n`}
          {`    <div>\n`}
          {`      <Welcome name="Maria" />\n`}
          {`    </div>\n`}
          {`  );\n`}
          {`}\n\n`}
          {`export default App;`}
        </Text>
      </View>

      {/* Lista de Lecciones */}
      <View style={styles.lessonList}>
        {lesson.lessons.map((lessonItem, index) => (
          <View key={index} style={styles.lessonItem}>
            <Text style={styles.lessonTitle}>{lessonItem.title}</Text>
            <TouchableOpacity
              style={[
                styles.continueButton,
                lessonItem.isLocked && styles.lockedButton,
              ]}
              disabled={lessonItem.isLocked}
            >
              <Text style={styles.buttonText}>
                {lessonItem.isLocked ? 'Bloqueado' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Botones de Navegación */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Lección Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Lección Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#604274',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  codeContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  codeExample: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'monospace', // Fuente monoespaciada para mejorar la legibilidad
    marginBottom: 16,
  },
  lessonList: {
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#604274',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  lockedButton: {
    backgroundColor: '#ccc', // Fondo gris claro para indicar bloqueo
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#604274',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CodeExampleScreen;