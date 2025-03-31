import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

const CustomHeader = ({ toggleSidebar }) => {
  const navigation = useNavigation(); // Obtener el objeto navigation

  return (
    <View style={styles.header}>
      {/* Botón de Menú */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Icon name="menu" size={35} color="#fff" />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.contentlogo}>
        <Image
          source={require('../../assets/logoEduHub.png')}
          style={styles.logo}
        />
      </View>

      {/* Botón de Búsqueda */}
      <TouchableOpacity
        onPress={() => navigation.navigate('busquedaAvanzada')} // Navegar a "busquedaAvanzada"
        style={styles.searchButton}
      >
        <Icon name="search" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#AA39AD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  menuButton: {
    marginRight: 20,
    width: 26,
  },
  contentlogo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
    marginTop: 14,
  },
  searchButton: {
    marginLeft: 28,
    width: 26,
  },
});

export default CustomHeader;