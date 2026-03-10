import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import WelcomeScreen from "./WelcomeScreen";
import WorkoutSessionsScreen from "./WorkoutSessionsScreen";
import ExerciseDescriptionScreen from "./ActiveWorkoutScreens/ExerciseDescriptionScreen";
import CurrentWorkoutStack from "./ActiveWorkoutScreens/CurrentWorkoutStack";
import ProfileStack from "./ProfileScreens/ProfileStack";

// Context
import { CurrentWorkoutProvider } from "../context/CurrentWorkoutContext";
import { ExerciseProvider } from "../context/ExerciseContext";
import { UserDetailsProvider } from "../context/UserDetailsContext.js";
import { WorkoutStatsProvider } from "../context/WorkoutStatsContext.js";

const Stack = createNativeStackNavigator();



export default function AppStack({ route }) {
    return (
        <UserDetailsProvider>
        <WorkoutStatsProvider>
        <CurrentWorkoutProvider>
            <ExerciseProvider>
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
                        options={{ headerShown: false }}
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

                    <Stack.Screen
                        name="Profile"
                        component={ProfileStack}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </ExerciseProvider>
        </CurrentWorkoutProvider>
        </WorkoutStatsProvider>
        </UserDetailsProvider>

    );
}