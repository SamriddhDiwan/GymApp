import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ExerciseCard from "../../components/ExerciseCard.js";
import { useExercise } from "../../context/ExerciseContext.jsx";

export default function ExerciseMenu({ route }) {
  const { exercises } = useExercise();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const exerciseList = Object.entries(exercises).filter(([key, exercise]) =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={exerciseList}
          keyExtractor={([key]) => key}
          renderItem={({ item: [key] }) => <ExerciseCard exerciseId={key} />}
          contentContainerStyle={styles.list}
        />

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: "#1C2541",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#fff",
  },
  list: {
    paddingBottom: 100,
  },
  doneBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4A90D9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
