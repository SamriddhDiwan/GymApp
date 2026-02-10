import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";

// Screens
const Stack = createNativeStackNavigator();

export default function AuthenticationStack({ route }) {
    return (
        <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{
                headerStyle: { backgroundColor: "#0B132B" },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
