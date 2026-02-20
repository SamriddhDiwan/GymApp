import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import EditProfileScreen from "./EditProfileScreen";
import BodyMeasurementsScreen from "./BodyMeasurementsScreen";
import FitnessGoalScreen from "./FitnessGoalScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator
            initialRouteName="ProfileMain"
            screenOptions={{
                headerStyle: { backgroundColor: "#0B132B" },
                headerTintColor: "#fff",
                headerShown: false,
            }}
        >
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="BodyMeasurements" component={BodyMeasurementsScreen} />
            <Stack.Screen name="FitnessGoal" component={FitnessGoalScreen} />
        </Stack.Navigator>
    );
}
