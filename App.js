import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import WelcomeScreen from "./src/screens/WelcomeScreen.js";
import WorkoutSessionsScreen from "./src/screens/WorkoutSessionsScreen.js";
import CurrentWorkoutStack from './src/screens/ActiveWorkoutScreens/CurrentWorkoutStack.js';
import { AIChatProvider } from './src/context/AIChatContext.js';
import AIChatButton from './src/components/AIChatButton.js';
import AIChatModal from './src/screens/AIChatModal.js';
import { ExerciseProvider } from './src/context/ExerciseContext.jsx';
import AuthenticationStack from './src/screens/AuthenticationScreens/AuthenticationStacks.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
              name="Welcome"
              component={WelcomeScreen}
              options={{ title: 'Start Your Workout' }}
            />

            <Stack.Screen
              name="WorkoutSessions"
              component={WorkoutSessionsScreen}
              options={{ title: 'Choose Your Session' }}
            />
            <Stack.Screen
              name="AuthenticationFlow"
              component={AuthenticationStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WorkoutFlow"
              component={CurrentWorkoutStack}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <AIChatButton />
          <AIChatModal />
        </AIChatProvider>

      </ExerciseProvider>
    </NavigationContainer>
  );
}