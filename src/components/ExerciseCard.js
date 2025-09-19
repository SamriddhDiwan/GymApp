import { useEffect, useState } from "react";
import Exercise from "../classes/ExerciseClass";
import { Text, View, StyleSheet, Image, Button, TouchableOpacity, } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useWorkout } from "../context/CurrentWorkoutContext";
export default ExerciseCard = ({ exercise }) => {
    const {selectedExercises,toggleExercise}=useWorkout();
    const [isSelected,setIsSelected]=useState(selectedExercises.has(exercise.exerciseName));
    var navigation=useNavigation();
    const onPressHandler = ((ex) => {
        return navigation.navigate('WorkoutFlow',{screen:'ExerciseDescription' ,params:{exercise: exercise} });
    })
    return (
        <TouchableOpacity onPress={() => {
            toggleExercise(exercise);
            setIsSelected(!isSelected);
        }}>
            <View style={[styles.card,{ borderColor: isSelected ? "green" : "#ccc", borderWidth: 2 }]}>
                <Image source={{ uri: exercise.exerciseImage }} style={styles.image} />
                <Text style={styles.title}>{exercise.exerciseName}</Text>
                <Button onPress={onPressHandler} title="How To" />
            </View>
        </TouchableOpacity>

    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 12,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4, // Android shadow
    },
    image: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        borderRadius: 12,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 12,
    },
    howtoTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginTop: 8,
    },
    howto: {
        fontSize: 15,
        color: "#444",
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});