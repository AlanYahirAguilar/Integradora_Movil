import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomHeader = ({ toggleSidebar }) => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Icon name="menu" size={35} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} >EduHub Pro</Text>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  menuButton: {
    marginRight: 20,
    width: 26, 
    color: '#fff'
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    alignContent: 'center',
    paddingHorizontal: 62
  },
});

export default CustomHeader;

        