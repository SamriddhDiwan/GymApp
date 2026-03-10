import { createContext, useCallback, useContext, useEffect, useState } from "react";
import workoutSessionServices from "../services/workoutSessionServices.js";

const WorkoutStatsContext = createContext();

export function WorkoutStatsProvider({ children }) {
    const [workoutStats, setWorkoutStats] = useState(null);

    const refreshWorkoutStats = useCallback(async () => {
        const stats = await workoutSessionServices.calculateStats();
        setWorkoutStats(stats);
    }, []);

    useEffect(() => {
        refreshWorkoutStats();
    }, [refreshWorkoutStats]);

    return (
        <WorkoutStatsContext.Provider value={{ workoutStats, refreshWorkoutStats }}>
            {children}
        </WorkoutStatsContext.Provider>
    );
}

export const useWorkoutStats = () => useContext(WorkoutStatsContext);
