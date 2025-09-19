import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useWorkout } from "../context/CurrentWorkoutContext";

export default function ExerciseSessionCard({ exercise }) {
   const { addNewSet,updateSet } = useWorkout();
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={{ uri: exercise.exerciseImage }} style={styles.image} />
        <Text style={styles.title}>{exercise.exerciseName}</Text>

        {exercise.sets.map((set, i) => (
          <View key={i} style={styles.setRow}>
            <Text style={styles.setLabel}>Set {i + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={set.weight}
              onChangeText={(val) => updateSet(exercise.exerciseName,i, "weight", val)}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={set.reps}
              onChangeText={(val) => updateSet(exercise.exerciseName,i, "reps", val)}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={()=>{
          addNewSet(exercise.exerciseName)
        }}>
          <Text style={styles.addButtonText}>+ Add Set</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.howToButton} onPress={() => console.log("How To")}>
          <Text style={styles.howToText}>How To</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  setLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    width: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 25,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  howToButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  howToText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
});
