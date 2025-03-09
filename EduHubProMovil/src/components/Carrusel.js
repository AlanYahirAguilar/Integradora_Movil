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
        <View key={image.id} style={styles.imageContainer}>
          <Image source={{ uri: image.url }} style={styles.carruselImage} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get('window').width, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  carruselImage: {
    width: '100%',
    height: 200, 
    resizeMode: 'cover',
  },
});

export default Carrusel;