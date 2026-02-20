import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, View } from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
import workoutSessionServices from '../services/workoutSessionServices';


export default function WorkoutSessionsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();
  const resumePreviousWorkout = (previousWorkoutObject) => {
    navigation.navigate("WorkoutFlow", { previousWorkoutObject: previousWorkoutObject });
  }

  useFocusEffect(useCallback(() => {
    let isCurrent = true;
    async function fetchWorkouts() {
      const storedSessions = await workoutSessionServices.getWorkouts(undefined, {
        onRefresh: (fresh) => {
          if (isCurrent) setWorkouts(fresh);
        },
      });
      if (isCurrent) setWorkouts(storedSessions || []);
    }
    fetchWorkouts();
    return () => { isCurrent = false; };
  }, []));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={({ item }) => <WorkoutCard workout={item} resumePreviousWorkout={resumePreviousWorkout} />}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.newSession}
        onPress={() => navigation.navigate("WorkoutFlow")}
      >
        <Text style={styles.newSessionText}>Create New Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
  },
  newSession: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#4A90D9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  newSessionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
