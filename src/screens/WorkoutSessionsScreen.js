import { useNavigation } from '@react-navigation/native';
import { Text, View, Button } from 'react-native';

export default function WorkoutSessionsScreen() {
  const navigation=useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Workout Sessions</Text>
      <Button
        title="Create New Workout"
        onPress={() => navigation.navigate("WorkoutFlow")}
      />
    </View>
  );
}
