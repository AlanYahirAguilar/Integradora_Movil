import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomHeader = ({ toggleSidebar }) => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Icon name="menu" size={35} color="#fff" />
        </TouchableOpacity>
          <View style={styles.contentlogo}>
          <Image
                  source={require('../../assets/logoEduHub.png')}
                  style={styles.logo} 
              />
          </View>
          <TouchableOpacity style={styles.searchButton}>
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
    color: '#fff'
  },
  contentlogo:{
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
  searchButton:{
    marginLeft: 28,
    width: 26, 
    color: '#fff'
  }
});

export default CustomHeader;

        