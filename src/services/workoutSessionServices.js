import api from "./api"
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'workoutHistory';

class WorkoutSessionServices {


    constructor() {
        this.allWorkouts = null;
    }
    async calculateStats() {
        this.allWorkouts=await this.getWorkouts();
        const stats= {
            totalWorkout: await this.calculateTotalWorkouts(),
            totalTime: await this.calculateTotalTime(),
            totalVolume: await this.calculateTotalVolume(),
            currentStreak: await this.calculateCurrentStreak()
        }
        return stats;
    }
    async calculateTotalWorkouts() {
        return this.allWorkouts.length;
    }
    async calculateTotalTime() {
        let totalTime = 0;
        for (var i = 0; i < this.allWorkouts.length; i++) {
            totalTime += this.allWorkouts[i]?.durationSeconds || 0;
        }
        return (totalTime / 60) / 60;
    }
    async calculateTotalVolume() {
        let totalVolume = 0;
        for (var i = 0; i < this.allWorkouts.length; i++) {
            const volume = this.allWorkouts[i].exercises.reduce(
                (total, ex) =>
                    total +
                    ex.sets.reduce(
                        (s, set) =>
                            s + Number(set.weight) * Number(set.reps),
                        0
                    ), 0
            )
            totalVolume += volume;
        }
        return totalVolume;
    }
    async calculateCurrentStreak() {
        const sortedWorkouts = [...this.allWorkouts].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        ); if (sortedWorkouts.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const workout of sortedWorkouts) {
            const workoutDate = new Date(workout.date);
            workoutDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor(
                (currentDate - workoutDate) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === streak) {
                // Consecutive day
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (diffDays > streak) {
                // Gap in streak
                break;
            }
        }

        return streak;
    }
    async create(workoutObject) {
        try {
            const cached = await this.getCachedWorkouts();
            const updated = [workoutObject, ...(cached || [])];
            await this.cacheWorkouts(updated);

            await api.makeRequest('/workouts/create', {
                method: 'POST',
                body: JSON.stringify({ workoutObject: workoutObject })
            });
        } catch (error) {
            console.log("Error saving the data");
        }
    }

    async fetchWorkouts(days) {
        try {
            const endpoint = days ? `/workouts/getWorkouts?days=${days}` : '/workouts/getWorkouts';
            const data = await api.makeRequest(endpoint, {
                method: 'GET',
            });
            return data.workouts;
        } catch (error) {
            console.log("Error fetching the data");
            return null;
        }
    }

    async getCachedWorkouts() {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    }

    async cacheWorkouts(workouts) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(workouts));
    }

    async clearCache() {
        await AsyncStorage.removeItem(CACHE_KEY);
    }

    /**
     * Stale-while-revalidate: returns cached data immediately,
     * then fetches fresh data and calls onRefresh so the UI can update.
     */
    async getWorkouts(days, { onRefresh } = {}) {
        const cached = await this.getCachedWorkouts();
        if (cached) {
            this.fetchWorkouts(days).then(fresh => {
                if (fresh) {
                    this.cacheWorkouts(fresh);
                    if (onRefresh) onRefresh(fresh);
                }
            }).catch(() => { });
            return cached;
        }
        const workouts = await this.fetchWorkouts(days);
        if (workouts) {
            await this.cacheWorkouts(workouts);
        }
        return this.allWorkouts = workouts || [];
    }
}

export default new WorkoutSessionServices();
