import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/modules/splash/SplashScreen';
import SignIn from './src/modules/signIn/signIn';
import SignUp from './src/modules/signUp/signUp';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
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
    </NavigationContainer>
  );
};

export default App;