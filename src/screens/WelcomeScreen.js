import { useNavigation } from '@react-navigation/native';
import { Text, View, Button } from 'react-native';


export default function WelcomeScreen() {
  const navigation=useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Welcome!</Text>
      <Button
        title="Go to Workout Sessions"
        onPress={() => navigation.navigate('WorkoutSessions')}
      />
    </View>
  );
}
