import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWorkout } from "../context/CurrentWorkoutContext";
import { useExercise } from "../context/ExerciseContext";

export default ExerciseCard = ({ exerciseId }) => {
  const { selectedExercises, toggleExercise } = useWorkout();
  const { getExerciseById } = useExercise();
  const exercise = getExerciseById(exerciseId);
  const [isSelected, setIsSelected] = useState(
    selectedExercises.has(exercise.exerciseName)
  );
  const navigation = useNavigation();

  const onInfoPress = () => {
    navigation.navigate("WorkoutFlow", {
      screen: "ExerciseDescription",
      params: { exercise: exercise },
    });
  };

  const onCardPress = () => {
    toggleExercise(exerciseId);
    setIsSelected(!isSelected);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onCardPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: exercise.exerciseImage }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {exercise.name}
        </Text>
        <Text style={styles.muscle} numberOfLines={1}>
          {exercise.muscleGroup || "Muscle Group"}
        </Text>
      </View>

      <TouchableOpacity style={styles.infoBtn} onPress={onInfoPress}>
        <Text style={styles.infoText}>ⓘ</Text>
      </TouchableOpacity>

      {isSelected && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2541",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a3a5a",
  },
  cardSelected: {
    backgroundColor: "#243b55",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#0B132B",
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  muscle: {
    fontSize: 13,
    color: "#888",
  },
  infoBtn: {
    padding: 8,
  },
  infoText: {
    fontSize: 18,
    color: "#666",
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4A90D9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  checkText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
});
