import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";

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
            <Stack.Screen
                name="Signup"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
            />
        </Stack.Navigator>
    );
}
