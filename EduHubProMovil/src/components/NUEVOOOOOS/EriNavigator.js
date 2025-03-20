import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VoucherVerification from './VoucherVerification';
import CourseModuleDetails from './CourseModuleDetails';
import EriView2 from './EriView2';
import EriView3 from './EriView3';
import EriView4 from './EriView4';

const Stack = createStackNavigator();

const EriNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="VoucherVerification"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="VoucherVerification" component={VoucherVerification} />
      <Stack.Screen name="CourseModuleDetails" component={CourseModuleDetails} />
    </Stack.Navigator>
  );
};

export default EriNavigator;
