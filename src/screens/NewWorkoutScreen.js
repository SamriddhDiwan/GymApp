import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseSessionCard from '../components/ExerciseSessionCard';
import { useWorkout } from '../context/CurrentWorkoutContext';

export default function NewWorkoutScreen() {
    const navigation = useNavigation();
    const { selectedExercises, buildWorkoutObject } = useWorkout();

    const exerciseMenuButtonHandler = () => navigation.navigate('ExerciseMenu');
    const endWorkoutHandler = async () => {
        try {
            const workoutObject = buildWorkoutObject();
            await AsyncStorage.setItem(
                'workoutHistory',
                JSON.stringify([workoutObject])
            );
            navigation.goBack();
        } catch (err) {
            console.error('Error saving workout:', err);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[...selectedExercises.entries()]}
                keyExtractor={([key]) => key}
                renderItem={({ item: [_, exercise] }) => (
                    <ExerciseSessionCard exercise={exercise} />
                )}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>Your Workout</Text>
                        <Text style={styles.subtitle}>
                            Add exercises or let AI craft a plan for you
                        </Text>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={exerciseMenuButtonHandler}
                        >
                            <Text style={styles.primaryBtnText}>
                                Add New Exercise
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryBtn}>
                            <Text style={styles.secondaryBtnText}>
                                Let the AI Coach Plan It
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.endBtn}
                            onPress={endWorkoutHandler}
                        >
                            <Text style={styles.endBtnText}>End Workout</Text>
                        </TouchableOpacity>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 80 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 16,
    },
    primaryBtn: {
        backgroundColor: '#4f46e5',
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryBtn: {
        backgroundColor: '#e0e7ff',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: '#4338ca',
        fontWeight: '600',
        fontSize: 16,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    endBtn: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    endBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
