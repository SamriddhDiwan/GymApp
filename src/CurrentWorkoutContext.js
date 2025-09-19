import { createContext, useContext, useState } from "react";
const WorkoutContext = createContext();
export function CurrnetWorkoutProvider({ children }) {
    const [selectedExercises, setSelectedExercises] = useState(new Map());
    const toggleExercise = (exercise) => {
        setSelectedExercises(prev => {
            const newMap = new Map(prev);
            newMap.has(exercise.exerciseName) ? newMap.delete(exercise.exerciseName) : newMap.set(exercise.exerciseName, exercise);
            return newMap;
        });
    };
    const updateExerciseSets = (id, newSets) => {
        setWorkoutData((prev) =>
            prev.map((ex) => (ex.id === id ? { ...ex, sets: newSets } : ex))
        );
    };
    const addNewSet = (exerciseName) => {
        setSelectedExercises((prev) => {
            const newMap = new Map(prev);
            newMap.get(exerciseName).addSet();
            return newMap;
        });
    };

    const updateSet = (exerciseName, index, field, value) => {
        setSelectedExercises((prev) => {
            const newMap = new Map(prev);
            newMap.get(exerciseName).updateSet(index, field, value);
            return newMap;
        });
    };
    const buildWorkoutObject = () => {
        const workout = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            exercises: []
        };

        selectedExercises.forEach((exercise, key) => {
            workout.exercises.push({
                exerciseId: key,
                sets: exercise.sets.map(s => ({
                    weight: s.weight,
                    reps: s.reps,
                })),
            });
        });

        return workout;
    };

    return (
        <WorkoutContext.Provider value={{ selectedExercises, toggleExercise, addNewSet, updateSet, buildWorkoutObject }}>
            {children}
        </WorkoutContext.Provider>
    )
}
export const useWorkout = () => useContext(WorkoutContext);