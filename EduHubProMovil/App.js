import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { RootStack } from './src/navigation/RootStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './src/constants';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  
  useEffect(() => {
    // Verificar si hay un token almacenado
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        setUserToken(token);
      } catch (error) {
        console.error('Error al verificar token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkToken();
  }, []);
  
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#604274" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <RootStack initialToken={userToken} />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});