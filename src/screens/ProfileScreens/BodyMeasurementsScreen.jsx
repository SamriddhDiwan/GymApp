import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const MEASUREMENTS = [
  { label: "Chest", icon: "fitness-outline", value: "38", unit: "in" },
  { label: "Waist", icon: "resize-outline", value: "32", unit: "in" },
  { label: "Arms", icon: "barbell-outline", value: "15", unit: "in" },
  { label: "Thighs", icon: "walk-outline", value: "24", unit: "in" },
  { label: "Body Fat", icon: "water-outline", value: "15", unit: "%" },
  { label: "BMI", icon: "analytics-outline", value: "25.9", unit: "" },
];

export default function BodyMeasurementsScreen() {
  const navigation = useNavigation();
  const [weight, setWeight] = useState("82");
  const [height, setHeight] = useState("178");
  const [measurements, setMeasurements] = useState(MEASUREMENTS);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Body Measurements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Primary Stats */}
        <View style={styles.primaryRow}>
          <View style={styles.primaryCard}>
            <LinearGradient
              colors={["#4A90D9", "#357ABD"]}
              style={styles.accentBorder}
            />
            <View style={styles.primaryCardContent}>
              <Ionicons name="scale-outline" size={24} color="#4A90D9" />
              <Text style={styles.primaryValue}>{weight}</Text>
              <Text style={styles.primaryUnit}>kg</Text>
              <Text style={styles.primaryLabel}>Weight</Text>
            </View>
          </View>

          <View style={styles.primaryCard}>
            <LinearGradient
              colors={["#4A90D9", "#357ABD"]}
              style={styles.accentBorder}
            />
            <View style={styles.primaryCardContent}>
              <Ionicons name="body-outline" size={24} color="#4A90D9" />
              <Text style={styles.primaryValue}>{height}</Text>
              <Text style={styles.primaryUnit}>cm</Text>
              <Text style={styles.primaryLabel}>Height</Text>
            </View>
          </View>
        </View>

        {/* Measurements Grid */}
        <View style={styles.grid}>
          {measurements.map((item, index) => (
            <View key={index} style={styles.gridCard}>
              <View style={styles.gridCardHeader}>
                <Ionicons name={item.icon} size={18} color="#888" />
                <Text style={styles.gridLabel}>{item.label}</Text>
              </View>
              <View style={styles.gridValueRow}>
                <Text style={styles.gridValue}>{item.value}</Text>
                {item.unit ? (
                  <Text style={styles.gridUnit}>{item.unit}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Update Button */}
        <TouchableOpacity activeOpacity={0.8} style={styles.updateBtnWrapper}>
          <LinearGradient
            colors={["#4A90D9", "#357ABD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.updateBtn}
          >
            <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.updateBtnText}>Update Measurements</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1C2541",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  primaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  primaryCard: {
    flex: 1,
    backgroundColor: "#1C2541",
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2a3a5a",
  },
  accentBorder: {
    width: 4,
  },
  primaryCardContent: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  primaryValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
  },
  primaryUnit: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  primaryLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#1C2541",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a3a5a",
  },
  gridCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 13,
    color: "#888",
  },
  gridValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  gridValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  gridUnit: {
    fontSize: 14,
    color: "#888",
  },
  updateBtnWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  updateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
