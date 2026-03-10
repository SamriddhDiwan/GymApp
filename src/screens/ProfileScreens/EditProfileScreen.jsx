import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import userDetailServices from "../../services/userDetailServices.js";
import { useUserDetails } from "../../context/UserDetailsContext.js";
import api from "../../services/api.js";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { refreshUserDetails } = useUserDetails();
  const [user, setUser] = useState({ name: "", email: "", phoneNo: "", dateOfBirth: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await userDetailServices.getUserDetails();
      setUser({
        name: details.name || "",
        email: details.email || "",
        phoneNo: details.phoneNo || "",
        dateOfBirth: details.dateOfBirth || "",
      });
    };
    fetchDetails();
  }, []);
  
  const handleFieldChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };
  const [saving,setSaving]=useState(false); 
  const handleSave=async () => {
    console.log("saving the changes");
    if(saving) return;
    setSaving(true);
    await userDetailServices.changeUserDetails(user);
    await refreshUserDetails();
    console.log(user);
    setSaving(false);
  }  
  
  const [focusedField, setFocusedField] = useState(null);




  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#4A90D9", "#357ABD"]}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </LinearGradient>
              {/* <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "name" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={focusedField === "name" ? "#4A90D9" : "#555"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#555"
                  value={user.name}
                  onChangeText={(v) => handleFieldChange("name", v)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PHONE</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "phone" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={focusedField === "phone" ? "#4A90D9" : "#555"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#555"
                  value={user.phoneNo}
                  onChangeText={(v) => handleFieldChange("phoneNo", v)}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "dob" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={focusedField === "dob" ? "#4A90D9" : "#555"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY/MM/DD"
                  placeholderTextColor="#555"
                  value={user.dateOfBirth}
                  onChangeText={(v) => handleFieldChange("dateOfBirth", v)}
                  keyboardType="default"
                  returnKeyType="done"
                  onFocus={() => setFocusedField("dob")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity activeOpacity={0.85} onPress={handleSave}>
            <LinearGradient
              colors={["#4A90D9", "#357ABD"]}
              style={styles.saveBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.saveBtnText}>{saving?"Saving...":"Save Changes"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 16,
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
  avatarSection: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#4A90D9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0B132B",
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#556",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2541",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2a3a5a",
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: "#4A90D9",
    backgroundColor: "#1a2a4a",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#fff",
  },
  saveBtn: {
    flexDirection: "row",
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
