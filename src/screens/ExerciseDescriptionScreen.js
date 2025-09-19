import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // for gradient backgrounds
import { Ionicons } from "@expo/vector-icons"; // for icons

export default function ExerciseDescriptionScreen({ route }) {
  const exercise = route.params.exercise;

  const openVideo = () => {
    if (exercise.exerciseVideoTutorial) {
      Linking.openURL(exercise.exerciseVideoTutorial);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Image with Gradient Overlay */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: exercise.exerciseImage }} style={styles.image} />
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={styles.overlay}
        />
        <Text style={styles.heroTitle}>{exercise.exerciseName}</Text>
      </View>

      <View style={styles.content}>
        {/* Description */}
        <Text style={styles.description}>{exercise.exerciseDescription}</Text>

        {/* How-to Section */}
        <Text style={styles.sectionTitle}>How To Do It</Text>
        {exercise.exerciseHowto?.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.step}>{step}</Text>
          </View>
        ))}

        {/* Video Tutorial Button */}
        {exercise.exerciseVideoTutorial && (
          <TouchableOpacity style={styles.button} onPress={openVideo}>
            <Ionicons name="play-circle" size={22} color="#fff" />
            <Text style={styles.buttonText}> Watch Tutorial</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 280,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTitle: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  step: {
    fontSize: 16,
    color: "#444",
    marginLeft: 8,
    flexShrink: 1,
  },
  button: {
    marginTop: 30,
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 6,
  },
});
