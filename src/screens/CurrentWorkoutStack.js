// CurrentWorkoutStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import NewWorkoutScreen from "./NewWorkoutScreen";
import ExerciseMenu from "./ExerciseMenu";
import ExerciseDescriptionScreen from "./ExerciseDescriptionScreen";
import { CurrnetWorkoutProvider } from "../context/CurrentWorkoutContext";

const Stack = createNativeStackNavigator();

export default function CurrentWorkoutStack() {
    return (
        <CurrnetWorkoutProvider>
            <Stack.Navigator initialRouteName="NewWorkout">
                <Stack.Screen
                    name="NewWorkout"
                    component={NewWorkoutScreen}
                    options={{ title: "Start Your Workout" }}
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
        </CurrnetWorkoutProvider>

    );
}
