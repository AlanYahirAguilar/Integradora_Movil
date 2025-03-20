import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../modules/homeScreen/HomeScreen';
import SplashScreen from '../modules/splash/SplashScreen';
import CourseDetailScreen from '../modules/courseDetailScreen/CourseDetailScreen';
import SignIn from '../modules/signIn/signIn';
import SignUp from '../modules/signUp/signUp';
import CustomHeader from '../components/CustomHeader';
import MyCoursesScreen from '../modules/myCourses/MyCoursesScreen';
import PaymentInfoScreen from '../components/PaymentInfoScreen';
import PendingEnrollmentsScreen from '../components/PendingEnrollmentsScreen';
import VoucherVerification from '../components/4Eri/VoucherVerification';
import CourseModuleDetails from '../components/4Eri/CourseModuleDetails';

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
      <Stack.Screen name='mis cursos' component={MyCoursesScreen} options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: 'Mis Cursos'
        })} 
        />
      {/* Nuevas pantallas agregadas */}
      <Stack.Screen 
        name="PaymentInfo" 
        component={PaymentInfoScreen} 
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: 'Información de Pago',
        })} 
      />
      <Stack.Screen 
        name="PendingEnrollments" 
        component={PendingEnrollmentsScreen} 
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: 'Inscripciones Pendientes',
        })} 
      />
      {/* Ruta directa a la pantalla de verificación de voucher */}
      <Stack.Screen 
        name="voucher-verification" 
        component={VoucherVerification} 
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: 'Verificación de Voucher',
        })} 
      />
      
      {/* Ruta directa a la pantalla de detalles del módulo */}
      <Stack.Screen 
        name="course-module-details" 
        component={CourseModuleDetails} 
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: 'Detalles del Módulo',
        })} 
      />
    </Stack.Navigator>
  );
};
