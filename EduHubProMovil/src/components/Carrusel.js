import React from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const images = [
  { id: 1, url: 'https://www.ikusi.com/mx/wp-content/uploads/sites/2/2022/06/post_thumbnail-4efabca9bd56b38edc0058c4ba006481.jpeg' },
  { id: 2, url: 'https://cdn.pixabay.com/photo/2022/04/04/16/42/technology-7111804_640.jpg' },
  { id: 3, url: 'https://revistaseguridad360.com/wp-content/uploads/2022/01/nube.jpeg' },
];

const Carrusel = () => {
    return (
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {images.map((image) => (
          <Image key={image.id} source={{ uri: image.url }} style={styles.carruselImage} />
        ))}
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    carruselImage: {
      width: Dimensions.get('window').width, // Ancho igual al de la pantalla
      height: 200, // Alto fijo para las imágenes del carrusel
      resizeMode: 'cover',
    },
  });
  
  export default Carrusel;
  