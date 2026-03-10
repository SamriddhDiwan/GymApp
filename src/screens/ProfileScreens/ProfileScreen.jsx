import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
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
import { AuthContext } from "../../context/AuthContext.js";
import { useUserDetails } from "../../context/UserDetailsContext.js";




function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function StatCard({ icon, value, label }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={22} color="#4A90D9" style={{ marginBottom: 8 }} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuSection({ title, children }) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuCard}>{children}</View>
    </View>
  );
}

function MenuRow({ icon, label, onPress, color = "#fff", showChevron = true }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.menuRowLeft}>
        <View style={[styles.menuIconWrap, color === "#E74C3C" && { backgroundColor: "rgba(231,76,60,0.12)" }]}>
          <Ionicons name={icon} size={20} color={color === "#E74C3C" ? "#E74C3C" : "#4A90D9"} />
        </View>
        <Text style={[styles.menuRowLabel, { color }]}>{label}</Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#555" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  const [signingOut, setSigningOut] = useState(false);
  const { userDetails } = useUserDetails();
  const details = userDetails || {};
  const user = {
    name: details.name || "",
    email: details.email || "",
    weight: details.weight ? `${details.weight} ${details.weightUnit || ""}` : "",
    height: details.height ? `${details.height} ${details.heightUnit || ""}` : "",
    goal: details.fitnessGoal || "",
  };


  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        {/* Header Banner */}
        <LinearGradient
          colors={["#1C2541", "#0B132B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBanner}
        >
          <LinearGradient
            colors={["#4A90D9", "#1C65B5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </LinearGradient>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon="barbell-outline" value={user.weight} label="Weight" />
          <StatCard icon="resize-outline" value={user.height} label="Height" />
          <StatCard icon="flame-outline" value={user.goal} label="Goal" />
        </View>

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          <MenuSection title="PERSONAL INFO">
            <MenuRow
              icon="person-outline"
              label="Edit Profile"
              onPress={() => navigation.navigate("EditProfile")}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="body-outline"
              label="Body Measurements"
              onPress={() => navigation.navigate("BodyMeasurements")}
            />
          </MenuSection>

          <MenuSection title="PREFERENCES">
            <MenuRow
              icon="trophy-outline"
              label="Fitness Goal"
              onPress={() => navigation.navigate("FitnessGoal")}
            />
            <View style={styles.menuDivider} />
            <MenuRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => { }}
            />
          </MenuSection>

          <MenuSection title="ACCOUNT">
            <MenuRow
              icon="log-out-outline"
              label={signingOut ? "Signing Out…" : "Sign Out"}
              color="#E74C3C"
              showChevron={false}
              onPress={handleSignOut}
            />
          </MenuSection>
        </View>

        <View style={{ height: 40 }} />
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
    paddingVertical: 16,
    paddingHorizontal: 24
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
  headerBanner: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(74,144,217,0.3)",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 4,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1C2541",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a3a5a",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },
  menuContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#1C2541",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a3a5a",
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(74,144,217,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuRowLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#2a3a5a",
    marginLeft: 66,
  },
});
