import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Sidebar from '../../components/SideBar';
import CourseService from '../../services/CourseService';

const AdvancedSearch = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('a-z'); // Valor por defecto: a-z

  useEffect(() => {
    if (route.params?.toggleSidebar) {
      setIsSidebarOpen((prev) => !prev);
      navigation.setParams({ toggleSidebar: false }); // Reset para evitar múltiples activaciones
    }
  }, [route.params?.toggleSidebar]);

  // Cargar cursos desde el backend
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coursesData = await CourseService.getAllCourses();
      
      // Transformar los datos del backend al formato que necesitamos
      const formattedCourses = coursesData.map(course => ({
        id: course.courseId,
        title: course.title,
        author: course.instructor ? course.instructor.name : 'Instructor',
        price: parseFloat(course.price || 0),
        priceFormatted: `MX$${parseFloat(course.price || 0).toFixed(2)}`,
        image: course.bannerPath || null,
        description: course.description,
        // Datos adicionales por si los necesitamos
        courseId: course.courseId,
        size: course.size,
        isFull: course.size <= 0,
        startDate: course.startDate,
        endDate: course.endDate,
        categories: course.categories || [],
        modules: course.modules || []
      }));
      
      setCourses(formattedCourses);
      // Aplicar filtros iniciales
      applyFilters(formattedCourses, search, sortOrder);
    } catch (error) {
  //    console.error('Error al cargar cursos:', error);
      setError('No se pudieron cargar los cursos');
      // Usar datos estáticos en caso de error
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambia la búsqueda o el orden
  useEffect(() => {
    applyFilters(courses, search, sortOrder);
  }, [search, sortOrder]);

  // Función que aplica todos los filtros
  const applyFilters = (coursesArray, searchTerm, order) => {
    // Primero filtrar por término de búsqueda
    let filtered = [...coursesArray];
    
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Después ordenar según el criterio seleccionado
    switch (order) {
      case 'a-z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Por defecto, ordenar de A a Z
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredCourses(filtered);
  };

  // Manejadores para los botones de ordenamiento
  const handleSortAZ = () => setSortOrder('a-z');
  const handleSortZA = () => setSortOrder('z-a');
  const handleSortPriceAsc = () => setSortOrder('price-asc');
  const handleSortPriceDesc = () => setSortOrder('price-desc');

  // Navegar a la pantalla de detalles del curso
  const navigateToCourseDetail = (course) => {
    navigation.navigate('CourseDetail', {
      course: {
        id: course.id,
        courseId: course.id,
        title: course.title,
        instructor: course.author,
        description: course.description || '',
        price: course.price,
        precio: course.priceFormatted,
        image: course.image ? { uri: course.image } : require('../../../assets/Test.png'),
        bannerPath: course.image,
        startDate: course.startDate,
        endDate: course.endDate,
        categories: course.categories,
        size: course.size,
        rating: 4.5, // Valor por defecto
        comments: '0'
      }
    });
  };

  // Renderizar cada curso
  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigateToCourseDetail(item)}
    >
      <Image 
        source={item.image ? { uri: item.image } : require('../../../assets/Test.png')} 
        style={styles.image} 
      />
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.price}>{item.priceFormatted}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#604274" />
        <Text style={styles.loadingText}>Cargando cursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCourses}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        navigation={navigation} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Image source={require('../../../assets/Filtrar.png')} style={styles.icon} />
          <Text style={styles.title}>Búsqueda Avanzada:</Text>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Escribe el nombre del curso"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      {/* Botones de ordenamiento */}
      <View style={styles.sortButtons}>
        <TouchableOpacity 
          style={[styles.sortButton, sortOrder === 'a-z' && styles.activeButton]} 
          onPress={handleSortAZ}
        >
          <Text style={[styles.sortButtonText, sortOrder === 'a-z' && styles.activeButtonText]}>A - Z</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortButton, sortOrder === 'z-a' && styles.activeButton]} 
          onPress={handleSortZA}
        >
          <Text style={[styles.sortButtonText, sortOrder === 'z-a' && styles.activeButtonText]}>Z - A</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortButton, sortOrder === 'price-asc' && styles.activeButton]} 
          onPress={handleSortPriceAsc}
        >
          <Text style={[styles.sortButtonText, sortOrder === 'price-asc' && styles.activeButtonText]}>Menor a mayor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortButton, sortOrder === 'price-desc' && styles.activeButton]} 
          onPress={handleSortPriceDesc}
        >
          <Text style={[styles.sortButtonText, sortOrder === 'price-desc' && styles.activeButtonText]}>Mayor a menor</Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de cursos */}
      {filteredCourses.length > 0 ? (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderCourseItem}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron cursos con esos criterios</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#f5f5f5' 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#604274',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#604274',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  header: { 
    marginBottom: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 10, 
    color: '#604274'
  },
  searchInput: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    borderRadius: 14,
    marginBottom: 10, 
    backgroundColor: '#fff' 
  },
  sortButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  sortButton: { 
    padding: 8, 
    backgroundColor: '#65739F', 
    borderRadius: 14,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#604274',
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  activeButtonText: {
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  card: {
    width: Dimensions.get('window').width / 2 - 20, // Ancho fijo basado en la pantalla
    height: 250, // Altura fija
    backgroundColor: '#fff',
    margin: 5,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center', // Centrar contenido verticalmente
    elevation: 3, // sombra en Android
  },
  image: { 
    width: 140, 
    height: 140,
    borderRadius: 8, 
    marginBottom: 10 
  },
  courseTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  author: { 
    fontSize: 12, 
    color: '#666' 
  },
  price: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    marginBottom: 10, 
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdvancedSearch;