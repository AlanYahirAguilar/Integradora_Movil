import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../modules/homeScreen/HomeScreen';
import SplashScreen from '../modules/splash/SplashScreen';
import CourseDetailScreen from '../modules/courseDetailScreen/CourseDetailScreen';

const Stack = createStackNavigator();

export const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="carga">
      <Stack.Screen name="carga" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="signIn" component={SignIn} options={{ title: 'Inicio' }}/>
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Registro' }}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false  }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Detalles del Curso' }} />
    </Stack.Navigator>
  );
};