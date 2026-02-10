import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useWorkout } from "../context/CurrentWorkoutContext";
import { useNavigation } from "@react-navigation/native";
import { useExercise } from "../context/ExerciseContext";

export default function ExerciseSessionCard({ exerciseSets, exerciseId }) {
  const navigation = useNavigation();
  const { addNewSet, updateSet } = useWorkout();
  const { getExerciseById } = useExercise();
  const exercise = getExerciseById(exerciseId);

  const onPressHandler = () => {
    navigation.navigate("WorkoutFlow", {
      screen: "ExerciseDescription",
      params: { exercise: exercise },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: exercise.exerciseImage }} style={styles.thumb} />
        <Text style={styles.title}>{exercise.name}</Text>
        <TouchableOpacity onPress={onPressHandler}>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.colLabel, styles.colSet]}>SET</Text>
        <Text style={[styles.colLabel, styles.colPrev]}>PREVIOUS</Text>
        <Text style={[styles.colLabel, styles.colInput]}>KG</Text>
        <Text style={[styles.colLabel, styles.colInput]}>REPS</Text>
        <Text style={[styles.colLabel, styles.colCheck]}>✓</Text>
      </View>

      {exerciseSets.map((set, i) => (
        <View key={i} style={styles.setRow}>
          <Text style={[styles.setNum, styles.colSet]}>{i + 1}</Text>
          <Text style={[styles.prevText, styles.colPrev]}>
            {set.prevWeight && set.prevReps
              ? `${set.prevWeight} × ${set.prevReps}`
              : "—"}
          </Text>
          <TextInput
            style={[styles.input, styles.colInput]}
            placeholder="—"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={set.weight}
            onChangeText={(val) => updateSet(exerciseId, i, "weight", val)}
          />
          <TextInput
            style={[styles.input, styles.colInput]}
            placeholder="—"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={set.reps}
            onChangeText={(val) => updateSet(exerciseId, i, "reps", val)}
          />
          <TouchableOpacity style={styles.checkBtn}>
            <Text style={styles.checkText}>✓</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addSetBtn}
        onPress={() => addNewSet(exerciseId)}
      >
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C2541",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0B132B",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  infoIcon: {
    fontSize: 18,
    color: "#888",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2a3a5a",
  },
  colLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  colSet: {
    width: 36,
  },
  colPrev: {
    flex: 1,
  },
  colInput: {
    width: 56,
    marginHorizontal: 4,
  },
  colCheck: {
    width: 36,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  setNum: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  prevText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0B132B",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    fontSize: 16,
    color: "#555",
  },
  addSetBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  addSetText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A90D9",
  },
});
