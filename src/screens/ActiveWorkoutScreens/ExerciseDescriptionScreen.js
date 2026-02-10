import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function ExerciseDescriptionScreen({ route }) {
  const exercise = route.params.exercise;
  const navigation = useNavigation();

  const openVideo = () => {
    if (exercise.exerciseVideoTutorial) {
      Linking.openURL(exercise.exerciseVideoTutorial);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: exercise.exerciseImage }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{exercise.name}</Text>

          {exercise.muscleGroup && (
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{exercise.muscleGroup}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exercise.howto?.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {exercise.exerciseVideoTutorial && (
            <TouchableOpacity style={styles.videoBtn} onPress={openVideo}>
              <Text style={styles.videoBtnText}>▶  Watch Video Tutorial</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    fontSize: 24,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1C2541",
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#1C2541",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: "#4A90D9",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: {
    fontSize: 15,
    color: "#ccc",
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1C2541",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A90D9",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#ccc",
    lineHeight: 22,
  },
  videoBtn: {
    backgroundColor: "#4A90D9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  videoBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
