import { addCorsHeaders } from "../_lib/cors.js";
import authServices from "../_utils/auth.js";
import supabase from "../_utils/db.js";

export default async function handler(req, res) {
    if (addCorsHeaders(req, res)) return;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        var jwtData;
        try {
            jwtData = await authServices.verifyToken(req);
        } catch (error) {
            return res.status(401).json({ error: error || 'Unauthorized' });
        }
        const { userId } = jwtData;
        const days = req.query.days;
        let query = supabase
            .from('workout_sessions')
            .select(`
                id,
                date,
                duration,
                client_id,
                workout_exercises (
                    id,
                    exercise_id,
                    exercise_name,
                    order_index,
                    exercise_sets (
                        set_number,
                        weight,
                        reps
                    )
                )`
            )
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (days) {
            const daysNumber = parseInt(days);
            if (isNaN(daysNumber) || daysNumber < 1) {
                return res.status(400).json({ error: 'Invalid days parameter' });
            }

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysNumber);

            query = query.gte('date', startDate.toISOString());
        }

        const { data: sessions, error: sessionsError } = await query;

        if (sessionsError) {
            console.error('Error fetching sessions:', sessionsError);
            return res.status(500).json({ error: 'Failed to fetch workouts' });
        }
        const workouts = sessions
            .filter(session => session.workout_exercises.length > 0)
            .map(session => ({
                id: session.client_id,
                date: session.date,
                durationSeconds: session.duration,
                exercises: session.workout_exercises
                    .sort((a, b) => a.order_index - b.order_index) // Ensure correct order
                    .map(exercise => ({
                        exerciseId: exercise.exercise_id,
                        exerciseName: exercise.exercise_name,
                        sets: exercise.exercise_sets
                            .sort((a, b) => a.set_number - b.set_number) // Ensure correct order
                            .map(set => ({
                                weight: set.weight,
                                reps: set.reps
                            }))
                    }))
            }));

        return res.status(200).json({ workouts });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}