import api from "./api"
import AsyncStorage from '@react-native-async-storage/async-storage';
const CACHE_KEY = 'workoutHistory';
const workoutSessionServices = {
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
    },
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
    },
    async getCachedWorkouts() {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    },
    async cacheWorkouts(workouts) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(workouts));
    },
    async clearCache() {
        await AsyncStorage.removeItem(CACHE_KEY);
    },
    /**
     * Stale-while-revalidate: returns cached data immediately,
     * then fetches fresh data and calls onRefresh so the UI can update.
     */
    async getWorkouts(days, { onRefresh } = {}) {
        const cached = await this.getCachedWorkouts();
        if (cached) {
            // Fetch fresh data in background and notify caller
            this.fetchWorkouts(days).then(fresh => {
                if (fresh) {
                    this.cacheWorkouts(fresh);
                    if (onRefresh) onRefresh(fresh);
                }
            }).catch(() => {});
            return cached;
        }
        const workouts = await this.fetchWorkouts(days);
        if (workouts) {
            await this.cacheWorkouts(workouts);
        }
        return workouts || [];
    },
}

export default workoutSessionServices;
