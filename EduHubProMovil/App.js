import { NavigationContainer } from '@react-navigation/native';
<<<<<<< HEAD
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/modules/splash/SplashScreen';
import SignIn from './src/modules/signIn/signIn';
import SignUp from './src/modules/signUp/signUp';
=======
import { StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';
import { RootStack } from './src/navigation/RootStack';
>>>>>>> 84057d300d76745a0717d441987cf0d464a869f3

export default function App() {
  return (
<<<<<<< HEAD
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }} // Oculta la barra de navegación
        />
        <Stack.Screen
          name="signIn"
          component={SignIn}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
         name="SignUp"
         component={SignUp}
         options={{ title: 'Registro' }}
/>
      </Stack.Navigator>
=======
    <NavigationContainer style={styles.container}>
     <RootStack />
     <StatusBar style="auto" />
>>>>>>> 84057d300d76745a0717d441987cf0d464a869f3
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
