import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import WelcomeScreen from "./src/screens/WelcomeScreen.js";
import WorkoutSessionsScreen from "./src/screens/WorkoutSessionsScreen.js";
import CurrentWorkoutStack from './src/screens/CurrentWorkoutStack.js'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
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
          name="WorkoutFlow"
          component={CurrentWorkoutStack}
        />
      </Stack.Navigator>

      <TouchableOpacity style={styles.floatingButton} onPress={() => alert("AI Button Pressed!")}>
        <Text style={styles.buttonText}>AI</Text>
      </TouchableOpacity>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,       // makes it circular
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,           // shadow for Android
    shadowColor: '#000',    // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
