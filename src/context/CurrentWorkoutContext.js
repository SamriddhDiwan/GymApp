import { createContext, useContext, useState,useEffect } from "react";
import { useExercise } from "./ExerciseContext";
const WorkoutContext = createContext();

export function CurrentWorkoutProvider({ children }) {
    //Store the exerciseID and the sets and reps
    //APIs required
    //store only the id that can be done using set
    //APIs required - 
    const [selectedExercises, setSelectedExercises] = useState(new Map());
    const toggleExercise = (exerciseId) => {
        setSelectedExercises(prev => {
            const newMap = new Map(prev);
            newMap.has(exerciseId) ? newMap.delete(exerciseId) : newMap.set(exerciseId, []);
            return newMap;
        });
    };
    const addNewSet = (exerciseId) => {
        setSelectedExercises((prev) => {
            const newMap = new Map(prev);
            newMap.get(exerciseId).push({"reps":0,"weight":0});
            return newMap;
        });
    };

    const updateSet = (exerciseId, index, field, value) => {
        setSelectedExercises((prev) => {
            const newMap = new Map(prev);
            newMap.get(exerciseId)[index][field]=value;
            return newMap;
        });
    };
    //this will break changes on past workout page
    const buildWorkoutObject = () => {
        const workout = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            exercises: []
        };

        selectedExercises.forEach((exerciseSets, exerciseId) => {
            workout.exercises.push({
                exerciseId: exerciseId,
                sets: exerciseSets.map(s => ({
                    weight: s.weight,
                    reps: s.reps,
                })),
            });
        });
        return workout;
    };
    const initializeWorkoutScreen = (previousWorkoutObject) => {
        previousWorkoutObject.exercises.forEach(exercise => {
            toggleExercise(exercise.exerciseId);
        });
    }
    return (
        <WorkoutContext.Provider value={{ initializeWorkoutScreen, selectedExercises, toggleExercise, addNewSet, updateSet, buildWorkoutObject }}>
            {children}
        </WorkoutContext.Provider>
    )
}
export const useWorkout = () => useContext(WorkoutContext);