import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { AIChatProvider } from './src/context/AIChatContext.js';
import AIChatButton from './src/components/AIChatButton.js';
import AIChatModal from './src/screens/AIChatModal.js';
import { ExerciseProvider } from './src/context/ExerciseContext.jsx';
import AuthenticationStack from './src/screens/AuthenticationScreens/AuthenticationStacks.js';
import { AuthenticationProvider } from './src/context/AuthenticationContext.js';
import AppStack from './src/screens/AppFlow.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthenticationProvider>
        <ExerciseProvider>
          <AIChatProvider>
            <Stack.Navigator
              initialRouteName="AuthenticationFlow"
              screenOptions={{
                headerStyle: { backgroundColor: "#0B132B" },
                headerTintColor: '#fff',
              }}
            >
              
              <Stack.Screen
                name="AuthenticationFlow"
                component={AuthenticationStack}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AppFlow"
                component={AppStack}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
            <AIChatButton />
            <AIChatModal />
          </AIChatProvider>
        </ExerciseProvider>
      </AuthenticationProvider>
    </NavigationContainer>
  );
}