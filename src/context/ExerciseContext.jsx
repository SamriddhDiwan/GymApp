import { createContext, useContext, useEffect, useState } from "react";
import storedExercises from "../exercise";

const ExerciseContext = createContext();

export function ExerciseProvider({ children }) {
    const [exercises, setExercises] = useState({});
    useEffect(() => {
        setExercises(storedExercises);
    }, [])
    const getExerciseById = (id) => {
        return exercises[id];
    }
    return (
        <ExerciseContext.Provider value={{ exercises, getExerciseById}}>
            {children}
        </ExerciseContext.Provider>
    )
}
export const useExercise = () => useContext(ExerciseContext);