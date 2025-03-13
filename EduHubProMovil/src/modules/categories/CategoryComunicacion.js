import { useNavigation } from '@react-navigation/native';

export default function CategoryComunicacion () {
    const navigation = useNavigation();

    const courses = [
      {
        id: '1',
        title: 'Arquitectura del Código',
        image: require('./path/to/image1.png'),
        price: 'MX$900',
        rating: 4.5,
      },
      // Agrega más cursos aquí...
    ];
  
    const handleCoursePress = (courseId) => {
      navigation.navigate('CourseDetails', { courseId });
    };
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={require('./path/to/menu-icon.png')} style={styles.menuIcon} />
          </TouchableOpacity>
          <Image source={require('./path/to/logo.png')} style={styles.logo} />
          <TouchableOpacity>
            <Image source={require('./path/to/search-icon.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
  
        {/* Cursos de Programación */}
        <Text style={styles.title}>Cursos de Programación:</Text>
  
        {/* Cards de Cursos */}
        <View style={styles.coursesContainer}>
          {courses.map((course) => (
            <TouchableOpacity key={course.id} onPress={() => handleCoursePress(course.id)} style={styles.courseCard}>
              <Image source={course.image} style={styles.courseImage} />
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.coursePrice}>{course.price}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
                <Image source={require('./path/to/star-icon.png')} style={styles.starIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
