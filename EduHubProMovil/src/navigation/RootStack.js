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
import VoucherVerification from '../components/NUEVOOOOOS/VoucherVerification'
import CourseModuleDetails from '../components/NUEVOOOOOS/CourseModuleDetails';
import Profile from '../modules/profile/Profile';
import CourseCompletionScreen from '../components/CompletionScreen';
import LessonScreen from '../modules/lessonScreen/LessonProgressScreen';
import CategoryInformatica from '../modules/categories/CategoryInformatica'; 
import CategoryDesarrolloWeb from '../modules/categories/CategoryDesarrolloWeb';
import CategoryIOT from '../modules/categories/CategoryIOT';
import CategoryProgramacion from '../modules/categories/CategoryProgramacion';
import CategoryComunicacion from '../modules/categories/CategoryComunicacion';
import CategoryScreen from '../modules/categories/CategoryScreen';
import AdvancedSearch from '../modules/advancedSearch/AdvancedSearch';
import RecoverPassword from '../modules/recoverPassword/recoverPassword';
import VerificationCodeScreen from '../modules/recoverPassword/VerificationCodeScreen';
import ResetPasswordScreen from '../modules/recoverPassword/ResetPasswordScreen';
import MyInscriptionsCourses from '../modules/myCourses/MyInscriptionsCourses'; 
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
      <Stack.Screen name="perfil" component={Profile} options={({ navigation }) => ({ header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
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
    name="informatica"
    component={CategoryInformatica}
    options={({ navigation }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
      title: 'Informatica',
    })}/>

<Stack.Screen 
    name="desarrollo"
    component={CategoryDesarrolloWeb}
    options={({ navigation }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
      title: 'Desarrollo Web',
    })}/>

<Stack.Screen 
    name="programacion"
    component={CategoryProgramacion}
    options={({ navigation }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
      title: 'Programacion',
    })}/>

<Stack.Screen 
    name="iot"
    component={CategoryIOT}
    options={({ navigation }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
      title: 'IOT',
    })}/>

<Stack.Screen 
    name="comunicacion"
    component={CategoryComunicacion}
    options={({ navigation }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
      title: 'Comunicacion',
    })}/>

<Stack.Screen 
    name="Category"
    component={CategoryScreen}
    options={({ navigation, route }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />,
      title: route.params?.categoryName || 'Categoría',
    })}/>

    <Stack.Screen
    name='busquedaAvanzada'
    component={AdvancedSearch}
    options={({ navigation }) => ({
      header: () => <CustomHeader toggleSidebar={() => navigation.setParams({ toggleSidebar: true })} />
    })}/>

    <Stack.Screen
    name='recoverPass'
    component={RecoverPassword} 
    options={{headerShown: false}}/>

    <Stack.Screen
    name='verificacionCode'
    component={VerificationCodeScreen} 
    options={{headerShown: false}}/>

    <Stack.Screen
    name='resetPassword'
    component={ResetPasswordScreen} 
    options={{headerShown: false}}/>

    </Stack.Navigator>
  );
};
