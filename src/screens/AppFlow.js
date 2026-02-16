import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import WelcomeScreen from "./WelcomeScreen";
import WorkoutSessionsScreen from "./WorkoutSessionsScreen";
import ExerciseDescriptionScreen from "./ActiveWorkoutScreens/ExerciseDescriptionScreen";
import CurrentWorkoutStack from "./ActiveWorkoutScreens/CurrentWorkoutStack";

// Context
import { CurrentWorkoutProvider } from "../context/CurrentWorkoutContext";

const Stack = createNativeStackNavigator();



export default function AppStack({ route }) {
    return (
        <CurrentWorkoutProvider>
            <Stack.Navigator
                initialRouteName="Welcome"
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
                    name="ExerciseDescription"
                    component={ExerciseDescriptionScreen}
                    options={{ title: "Exercise Description" }}
                />

                <Stack.Screen
                    name="WorkoutFlow"
                    component={CurrentWorkoutStack}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </CurrentWorkoutProvider>

    );
}