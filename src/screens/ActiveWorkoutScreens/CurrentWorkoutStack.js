// CurrentWorkoutStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import NewWorkoutScreen from "./NewWorkoutScreen";
import ExerciseMenu from "./ExerciseMenu";
import ExerciseDescriptionScreen from "./ExerciseDescriptionScreen";
import { CurrentWorkoutProvider } from "../../context/CurrentWorkoutContext";
const Stack = createNativeStackNavigator();

export default function CurrentWorkoutStack({ route }) {
    return (
        <CurrentWorkoutProvider>
            <Stack.Navigator
                initialRouteName="NewWorkout"
                screenOptions={{
                    initialParams: route?.params,
                    headerStyle: { backgroundColor: "#0B132B" },
                    headerTintColor: '#fff',
                }}
            >
                <Stack.Screen
                    name="NewWorkout"
                    component={NewWorkoutScreen}
                    options={{ title: "Start Your Workout" }}
                    initialParams={route?.params}
                />
                <Stack.Screen
                    name="ExerciseMenu"
                    component={ExerciseMenu}
                    options={{ title: "Choose Your Exercise" }}
                />
                <Stack.Screen
                    name="ExerciseDescription"
                    component={ExerciseDescriptionScreen}
                    options={{ title: "Exercise Description" }}
                />
            </Stack.Navigator>
        </CurrentWorkoutProvider>

    );
}
