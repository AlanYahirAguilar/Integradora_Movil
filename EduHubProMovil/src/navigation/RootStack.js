import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../modules/homeScreen/HomeScreen";
import SplashScreen from "../modules/splash/SplashScreen";


export const RootStack = () => {

    const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="carga">
    <Stack.Screen name="carga" component={SplashScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EduHub Pro' }}/>
  </Stack.Navigator>
  )
}
