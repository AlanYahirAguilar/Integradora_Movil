import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
          navigation.replace('signIn'); 
        }, 5000);
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