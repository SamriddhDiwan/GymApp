import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserDetails } from '../context/UserDetailsContext.js';
import { useWorkoutStats } from '../context/WorkoutStatsContext.js';

export default function WelcomeScreen() {
    const navigation = useNavigation();

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };
    const { userDetails: fetchedDetails } = useUserDetails();
    const userDetails = fetchedDetails || { name: "User" };




    const {workoutStats: rawStats}=useWorkoutStats();
    const workoutStats = rawStats || { totalWorkout: 0, totalTime: 0, totalVolume: 0, currentStreak: 0 };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>{greeting()}</Text>
                        <Text style={styles.name}>{userDetails.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={require("../components/avatar.png")}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="flame-outline" size={22} color="#FF6B6B" />
                        <Text style={styles.statValue}>{workoutStats.totalWorkout}</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="time-outline" size={22} color="#4A90D9" />
                        <Text style={styles.statValue}>{`${workoutStats.totalTime.toFixed(1)}h`}</Text>
                        <Text style={styles.statLabel}>Total Time</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="barbell-outline" size={22} color="#5ED87A" />
                        <Text style={styles.statValue}>{workoutStats.totalVolume}</Text>
                        <Text style={styles.statLabel}>Volume (kg)</Text>
                    </View>
                </View>

                {/* Streak Card */}
                <View style={styles.streakCard}>
                    <View style={styles.streakLeft}>
                        <Text style={styles.streakEmoji}>🔥</Text>
                        <View>
                            <Text style={styles.streakTitle}>{workoutStats.currentStreak} Day Streak!</Text>
                            <Text style={styles.streakSub}>{workoutStats.currentStreak?"Keep it going, don't break the chain":""}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('WorkoutFlow')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(74,144,217,0.15)' }]}>
                            <Ionicons name="add-circle-outline" size={28} color="#4A90D9" />
                        </View>
                        <Text style={styles.actionText}>New Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('WorkoutSessions')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(94,216,122,0.15)' }]}>
                            <Ionicons name="list-outline" size={28} color="#5ED87A" />
                        </View>
                        <Text style={styles.actionText}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,107,107,0.15)' }]}>
                            <Ionicons name="person-outline" size={28} color="#FF6B6B" />
                        </View>
                        <Text style={styles.actionText}>Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Start Workout CTA */}
                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => navigation.navigate('WorkoutSessions')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="flash" size={22} color="#fff" />
                    <Text style={styles.ctaText}>Start Workout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B132B',
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 28,
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: 15,
        color: '#7a8ba8',
        marginBottom: 4,
    },
    name: {
        fontSize: 26,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1C2541',
        borderWidth: 2,
        borderColor: '#4A90D9',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1C2541',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    statLabel: {
        fontSize: 11,
        color: '#556580',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    streakCard: {
        backgroundColor: '#1C2541',
        borderRadius: 14,
        padding: 18,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,165,0,0.2)',
    },
    streakLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    streakEmoji: {
        fontSize: 32,
    },
    streakTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
    },
    streakSub: {
        fontSize: 13,
        color: '#7a8ba8',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#556580',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 14,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#1C2541',
        borderRadius: 14,
        paddingVertical: 20,
        alignItems: 'center',
        gap: 10,
    },
    actionIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    ctaButton: {
        backgroundColor: '#4A90D9',
        paddingVertical: 18,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    ctaText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
});
