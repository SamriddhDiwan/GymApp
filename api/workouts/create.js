import { addCorsHeaders } from "../_lib/cors.js";
import authServices from "../_utils/auth.js";
import supabase from "../_utils/db.js";

export default async function handler(req, res) {
    if (addCorsHeaders(req, res)) return;
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { workoutObject } = req.body;
        var jwtData;
        try {
            jwtData = await authServices.verifyToken(req);
        } catch (error) {
            return res.status(401).json({ error: error || 'Unauthorized' });
        }
        const { userId } = jwtData;
        if (!workoutObject || !workoutObject.date || !workoutObject.exercises) {
            return res.status(400).json({ error: 'Invalid workout data' });
        }
        if (workoutObject.id) {
            const { data: existing } = await supabase
                .from('workout_sessions')
                .select('id')
                .eq('user_id', userId)
                .eq('client_id', workoutObject.id)
                .single();

            if (existing) {
                return res.status(200).json({
                    id: existing.id,
                    message: 'Workout already saved',
                    alreadyExists: true
                });
            }
        }
        const { data: new_session, error: new_session_error } = await supabase.from('workout_sessions').insert([
            {
                user_id: userId,
                date: workoutObject.date,
                client_id: workoutObject.id,
                duration: workoutObject.durationSeconds
            }
        ]).select().single();
        if (new_session_error) {
            console.error('Session insert error:', new_session_error);
            return res.status(500).json({ error: new_session_error || 'Unable to save workout' });
        }
        const { id: session_id } = new_session;

        // Bulk insert all exercises in one call
        const exerciseRows = workoutObject.exercises.map((exercise, i) => ({
            session_id: session_id,
            exercise_id: exercise.exerciseId,
            exercise_name: exercise.exerciseName || "NA",
            order_index: i
        }));

        const { data: insertedExercises, error: exercisesError } = await supabase
            .from('workout_exercises')
            .insert(exerciseRows)
            .select();

        if (exercisesError) {
            console.error('Exercise insert error:', exercisesError);
            await supabase.from('workout_sessions').delete().eq('id', session_id);
            return res.status(500).json({ error: 'Failed to save exercises' });
        }

        // Sort by order_index to match original exercise order
        insertedExercises.sort((a, b) => a.order_index - b.order_index);

        // Bulk insert all sets in one call
        const setRows = [];
        workoutObject.exercises.forEach((exercise, i) => {
            const exerciseDbId = insertedExercises[i].id;
            exercise.sets.forEach((set, j) => {
                setRows.push({
                    workout_exercise_id: exerciseDbId,
                    set_number: j + 1,
                    weight: parseFloat(set.weight) || 0,
                    reps: parseInt(set.reps) || 0,
                    is_done: true
                });
            });
        });

        if (setRows.length > 0) {
            const { error: setsError } = await supabase
                .from('exercise_sets')
                .insert(setRows);

            if (setsError) {
                console.error('Sets insert error:', setsError);
                await supabase.from('workout_sessions').delete().eq('id', session_id);
                return res.status(500).json({ error: 'Failed to save sets' });
            }
        }

        return res.status(201).json({
            id: session_id,
            message: 'Workout saved successfully'
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}