import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text,StyleSheet, View, Button, Image } from 'react-native';


export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.profileStrip}>
        <View>
          <Text>Name</Text>
        </View>
        <View>
          <Image source={require("../components/avatar.png")} style={styles.avatar} />
        </View>
      </View>
      <View>
        <Button title='View Profile' onPress={()=>{navigation.navigate('Profile')}}/>
      </View>
      <Text style={{ fontSize: 24 }}>Welcome!</Text>
      <Button
        title="Go to Workout Sessions"
        onPress={() => navigation.navigate('WorkoutSessions')}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  profileStrip:{
    flexDirection: "row"
  },
  avatar: {
      width: 40,
      height: 40,
      borderRadius: 22,
      marginRight: 12,
      backgroundColor: '#fff'
  }
})