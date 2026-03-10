import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useUserDetails } from "../../context/UserDetailsContext";
import userDetailServices from "../../services/userDetailServices";

const GOALS = [
  {
    key: "Build Muscle",
    icon: "barbell-outline",
    description: "Gain lean muscle mass and strength",
  },
  {
    key: "Lose Weight",
    icon: "flame-outline",
    description: "Burn fat and reduce body weight",
  },
  {
    key: "Stay Fit",
    icon: "heart-outline",
    description: "Maintain fitness and overall health",
  },
  {
    key: "Build Endurance",
    icon: "bicycle-outline",
    description: "Improve stamina and cardiovascular health",
  },
  {
    key: "Gain Strength",
    icon: "trophy-outline",
    description: "Maximize power and lifting capacity",
  },
];

export default function FitnessGoalScreen() {
  const {userDetails,refreshUserDetails}=useUserDetails();
  const [selectedGoal, setSelectedGoal] = useState(userDetails?.fitnessGoal||"Build Muscle");
  const [targetWeight, setTargetWeight] = useState(userDetails.targetWeight);
  const [saving,setSaving]=useState(false);
  const navigation = useNavigation();
  const currentGoal = GOALS.find((g) => g.key === selectedGoal);
  const handleSave=async () => {
    if(saving) return;
    setSaving(true);
    await userDetailServices.changeUserDetails({fitnessGoal:selectedGoal,targetWeight:targetWeight});
    await refreshUserDetails();
    setSaving(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Fitness Goal</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Current Goal Highlight */}
        <LinearGradient
          colors={["#4A90D9", "#357ABD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.currentGoalCard}
        >
          <Ionicons name="trophy" size={36} color="#FFD700" />
          <View style={styles.currentGoalInfo}>
            <Text style={styles.currentGoalLabel}>Current Goal</Text>
            <Text style={styles.currentGoalTitle}>{selectedGoal}</Text>
            {currentGoal && (
              <Text style={styles.currentGoalDesc}>
                {currentGoal.description}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* Goal Options */}
        <Text style={styles.sectionLabel}>CHOOSE YOUR GOAL</Text>
        {GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.key;
          return (
            <TouchableOpacity
              key={goal.key}
              style={[
                styles.goalCard,
                isSelected && styles.goalCardSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedGoal(goal.key)}
            >
              <View style={styles.goalIconContainer}>
                <Ionicons
                  name={goal.icon}
                  size={24}
                  color={isSelected ? "#4A90D9" : "#888"}
                />
              </View>
              <View style={styles.goalTextContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    isSelected && styles.goalTitleSelected,
                  ]}
                >
                  {goal.key}
                </Text>
                <Text style={styles.goalDesc}>{goal.description}</Text>
              </View>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#4A90D9"
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Target Weight */}
        <Text style={styles.sectionLabel}>TARGET WEIGHT</Text>
        <View style={styles.targetWeightCard}>
          <Ionicons
            name="scale-outline"
            size={22}
            color="#4A90D9"
            style={styles.targetWeightIcon}
          />
          <TextInput
            style={styles.targetWeightInput}
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
            placeholderTextColor="#555"
            placeholder="Enter target weight"
          />
          <Text style={styles.targetWeightUnit}>kg</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient
            colors={["#4A90D9", "#357ABD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>{saving?"Saving...":"Save Goal"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  currentGoalCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    gap: 16,
  },
  currentGoalInfo: {
    flex: 1,
  },
  currentGoalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  currentGoalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  currentGoalDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#556",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2541",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2a3a5a",
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  goalCardSelected: {
    borderColor: "#4A90D9",
    backgroundColor: "rgba(74,144,217,0.08)",
  },
  goalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  goalTitleSelected: {
    color: "#4A90D9",
  },
  goalDesc: {
    fontSize: 13,
    color: "#888",
  },
  targetWeightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2541",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2a3a5a",
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  targetWeightIcon: {
    marginRight: 12,
  },
  targetWeightInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#fff",
  },
  targetWeightUnit: {
    fontSize: 15,
    fontWeight: "600",
    color: "#888",
    marginLeft: 8,
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 14,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
});
