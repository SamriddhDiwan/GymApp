import { useNavigation } from '@react-navigation/native';
import React, { useEffect,useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import ExerciseSessionCard from '../../components/ExerciseSessionCard';
import { useWorkout } from '../../context/CurrentWorkoutContext';
import workoutSessionServices from '../../services/workoutSessionServices.js'


export default function NewWorkoutScreen({route}) {const navigation = useNavigation();
    const { selectedExercises, buildWorkoutObject,initializeWorkoutScreen } = useWorkout();
    const [startTime] = useState(Date.now());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    useEffect(() => {
            if(route&&route.params&&route.params.previousWorkoutObject){
        initializeWorkoutScreen(route.params.previousWorkoutObject);
    }
        const interval = setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
        },1000);
        return () => clearInterval(interval);
    }, []);
    const formatTime = (secs) => {
        let mins = Math.floor(secs / 60);
        let hours=Math.floor(mins/60);
        mins=mins%60;
        const s = secs % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    const exerciseMenuButtonHandler = () => navigation.navigate('ExerciseMenu');
    const endWorkoutHandler = async () => {
        try {
            const workoutObject = { ...buildWorkoutObject(), durationSeconds: elapsedSeconds};
            await workoutSessionServices.create(workoutObject);
            navigation.goBack();
        } catch (err) {
            console.error('Error saving workout:', err);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={exerciseMenuButtonHandler}
                >
                    <Text style={styles.actionBtnText}>+ Exercise</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={[...selectedExercises.entries()]}
                keyExtractor={([key]) => key}
                renderItem={({ item: [key, exerciseSets] }) => (
                    <ExerciseSessionCard exerciseSets={exerciseSets} exerciseId={key}/>
                )}
                ListHeaderComponent={
                    <TouchableOpacity style={styles.aiCard}>
                        <Text style={styles.aiCardText}>✨ Let AI coach plan a workout for you</Text>
                    </TouchableOpacity>
                }
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
            />
            <View style={styles.floatingFooter}>
                <TouchableOpacity
                    style={styles.endBtn}
                    onPress={endWorkoutHandler}
                >
                    <Text style={styles.endBtnText}>End Workout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B132B',
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    timer: {
        fontSize: 28,
        fontWeight: '300',
        color: '#fff',
        letterSpacing: 2,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#666',
    },
    actionBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    actionBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    aiCard: {
        backgroundColor: '#1C2541',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    aiCardText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    floatingFooter: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    endBtn: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 28,
    },
    endBtnText: {
        color: '#0B132B',
        fontWeight: '600',
        fontSize: 15,
    },
});
