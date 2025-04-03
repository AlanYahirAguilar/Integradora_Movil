import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Verificar si existe token de autenticación
                const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
                
                // Después de 2 segundos, navegar a la pantalla correspondiente
                setTimeout(() => {
                    if (token) {
                        // Si hay token, ir a Home
                        navigation.replace('Home');
                    } else {
                        // Si no hay token, ir a login
                        navigation.replace('signIn');
                    }
                }, 2000); // Reducimos el tiempo de splash a 2 segundos
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                // En caso de error, ir a login
                setTimeout(() => {
                    navigation.replace('signIn');
                }, 2000);
            }
        };
        
        checkAuthentication();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/logoEduHub.png')}
                style={styles.logo} 
            />
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AA39AD',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
});

export default SplashScreen;