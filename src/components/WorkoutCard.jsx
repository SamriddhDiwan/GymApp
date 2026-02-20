import { View, Text, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import ExerciseRow from './ExerciseRow.jsx';


export default function WorkoutCard({ workout,resumePreviousWorkout }) {

    const event = new Date(workout.date || Date.now());

    let timeOfTheDay;
    const hours = event.getHours();

    if (hours >= 5 && hours < 9) {
        timeOfTheDay = "Early morning workout 🌅";
    } else if (hours >= 9 && hours < 12) {
        timeOfTheDay = "Morning workout ☀️";
    } else if (hours >= 12 && hours < 17) {
        timeOfTheDay = "Afternoon workout 🌤️";
    } else if (hours >= 17 && hours < 21) {
        timeOfTheDay = "Evening workout 🌇";
    } else {
        timeOfTheDay = "Late night workout 🌙";
    }
    const formattedTime = event.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat(undefined, options).format(event);
    const durationMins = Math.floor(workout.durationSeconds / 60);
    const volume = workout.exercises.reduce(
        (total, ex) =>
            total +
            ex.sets.reduce(
                (s, set) =>
                    s + Number(set.weight) * Number(set.reps),
                0
            ), 0
    );
    return (
        <TouchableOpacity onPress={()=>{
            resumePreviousWorkout(workout);
        }}>
            <View style={stylesWorkoutCard.card}>
                <Text style={stylesWorkoutCard.title}>
                    {`${timeOfTheDay} ${formattedTime}`}
                </Text>
                <Text style={stylesWorkoutCard.titleDate}>
                    {formattedDate}
                </Text>
                <View style={stylesWorkoutCard.statsRow}>
                    <View >
                        <Text style={stylesWorkoutCard.label}> Time</Text>
                        <Text style={stylesWorkoutCard.value}>{durationMins} mins</Text>
                    </View>
                    <View>
                        <Text style={stylesWorkoutCard.label}> Volume</Text>
                        <Text style={stylesWorkoutCard.value}>{volume} kg</Text>
                    </View>
                </View>
                {workout.exercises.map((ex, index) => (
                    <ExerciseRow key={index} exercise={ex} />
                ))}
            </View>
        </TouchableOpacity>
    );
}


const stylesWorkoutCard = StyleSheet.create({
    card: {
        backgroundColor: "#1C2541",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
    },
    title: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 4,
    },
    titleDate: {
        color: "#888",
        fontSize: 13,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: "row",
        marginBottom: 16,
        gap: 32,
    },
    label: {
        color: "#666",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },
    value: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});