import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../modules/homeScreen/HomeScreen';
import SplashScreen from '../modules/splash/SplashScreen';
import CourseDetailScreen from '../modules/courseDetailScreen/CourseDetailScreen';
import SignIn from '../modules/signIn/signIn';
import SignUp from '../modules/signUp/signUp';
import CustomHeader from '../components/CustomHeader';

const Stack = createStackNavigator();

export const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="carga">
      {/* Pantallas sin header */}
      <Stack.Screen name="carga" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="signIn" component={SignIn} options={{ title: 'Inicio'}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Registro'}} />

      {/* Pantallas con header personalizado */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
        })} 
      />
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: 'Detalles del Curso'
        })} 
      />
    </Stack.Navigator>
  );
};


