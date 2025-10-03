import { createContext, useState } from "react";
import Exercise from "../classes/ExerciseClass";
import exercises from "../exercise";

const AIChatContext = createContext();

export function AIChatProvider({ children }) {
    const [modalVisible, setModalVisible] = useState(false);
    function loadNewExercises() {
        return exercises;
    }
    async function getExercises() {
        let avialableExercies = await loadNewExercises();
        var ExerciseList = [];
        for (let key in avialableExercies) {
            ExerciseList.push(avialableExercies[key].name);
        }
        return ExerciseList;
    }
    return (
        <AIChatContext.Provider value={{ modalVisible, setModalVisible, getExercises }}>
            {children}
        </AIChatContext.Provider>
    )
}
export default AIChatContext;