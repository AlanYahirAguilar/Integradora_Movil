import { createStackNavigator } from '@react-navigation/stack';
import CustomHeader from '../components/CustomHeader';
import CourseModuleDetails from '../components/NUEVOOOOOS/CourseModuleDetails';
import VoucherVerification from '../components/NUEVOOOOOS/VoucherVerification';
import PaymentInfoScreen from '../components/PaymentInfoScreen';
import PendingEnrollmentsScreen from '../components/PendingEnrollmentsScreen';
import AdvancedSearch from '../modules/advancedSearch/AdvancedSearch';
import CategoryScreen from '../modules/categories/CategoryScreen';
import CourseDetailScreen from '../modules/courseDetailScreen/CourseDetailScreen';
import HomeScreen from '../modules/homeScreen/HomeScreen';
import MyCoursesScreen from '../modules/myCourses/MyCoursesScreen';
import MyInscriptionsCourses from '../modules/myCourses/MyInscriptionsCourses';
import Profile from '../modules/profile/Profile';
import RecoverPassword from '../modules/recoverPassword/recoverPassword';
import ResetPasswordScreen from '../modules/recoverPassword/ResetPasswordScreen';
import VerificationCodeScreen from '../modules/recoverPassword/VerificationCodeScreen';
import SignIn from '../modules/signIn/signIn';
import SignUp from '../modules/signUp/signUp';
import SplashScreen from '../modules/splash/SplashScreen';
// Importar los nuevos componentes
import LessonDetail from '../components/NUEVOOOOOS/LessonDetail';
import ModuleSections from '../components/NUEVOOOOOS/ModuleSections';


const Stack = createStackNavigator();

export const RootStack = ({ initialToken }) => {
  const initialRouteName = initialToken ? 'Home' : 'carga';

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {/* Pantallas sin header */}
      <Stack.Screen name="carga" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="signIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />

      {/* Pantallas con header personalizado */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
        })}
      />
      <Stack.Screen name="perfil" component={Profile} options={({ navigation }) => ({
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
      <Stack.Screen name='En curso' component={MyCoursesScreen} options={({ navigation }) => ({
        header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
      })}
      />
      <Stack.Screen name='Inscritos' component={MyInscriptionsCourses} options={({ navigation }) => ({
        header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
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

      {/* Nuevas pantallas para el detalle de lecciones y secciones */}
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetail}
        options={({ navigation, route }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: route.params?.sectionName || 'Detalle de Lección',
        })}
      />

      <Stack.Screen
        name="ModuleSections"
        component={ModuleSections}
        options={({ navigation, route }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: `Módulo ${route.params?.moduleName || ''}`,
        })}
      />

      {/* <Stack.Screen
      name="leccion"
      componente={LessonScreen}
      options={({ route }) => ({
        title: route.params.courseTitle, header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
        title: 'Detalles del Módulo',
      })}
    />

    <Stack.Screen
    name="lecciones_Completado"
    component={CourseCompletionScreenn}
    options={({navigation}) => ({header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
    title: 'Detalles del Módulo',})}
    /> */}

      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ navigation, route }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
          title: route.params?.categoryName || 'Categoría',
        })} />

      <Stack.Screen
        name='busquedaAvanzada'
        component={AdvancedSearch}
        options={({ navigation }) => ({
          header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
        })} />

      <Stack.Screen
        name='recoverPass'
        component={RecoverPassword}
        options={{ headerShown: false }} />

      <Stack.Screen
        name='verificacionCode'
        component={VerificationCodeScreen}
        options={{ headerShown: false }} />

      <Stack.Screen
        name='resetPassword'
        component={ResetPasswordScreen}
        options={{ headerShown: false }} />

    </Stack.Navigator>
  );
};
