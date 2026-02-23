import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "../../services/authService.js";

export default function ResetPasswordScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { email, resetPasswordToken } = route.params;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleResetPassword = async () => {
        if (loading) return;
        setError("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.resetPassword(email, newPassword, resetPasswordToken);
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                navigation.navigate("LoginScreen");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Create a new password for {email}
                    </Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>NEW PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        placeholderTextColor="#4a5568"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        autoFocus
                    />

                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        placeholderTextColor="#4a5568"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.btn, (loading || !newPassword || !confirmPassword) && styles.btnDisabled]}
                        disabled={loading || !newPassword || !confirmPassword}
                        onPress={handleResetPassword}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.btnText}>Update Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B132B",
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: "center",
    },
    header: {
        marginBottom: 36,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 15,
        color: "#7a8ba8",
        lineHeight: 22,
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 11,
        fontWeight: "700",
        color: "#556580",
        letterSpacing: 1.5,
        marginBottom: -8,
    },
    input: {
        backgroundColor: "#131d36",
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 18,
        fontSize: 16,
        color: "#fff",
        borderWidth: 1.5,
        borderColor: "#1e2d4d",
    },
    errorBox: {
        backgroundColor: "rgba(239, 68, 68, 0.12)",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.25)",
    },
    errorText: {
        color: "#f87171",
        fontSize: 13,
        textAlign: "center",
        fontWeight: "500",
    },
    btn: {
        backgroundColor: "#4A90D9",
        paddingVertical: 17,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 4,
    },
    btnDisabled: {
        opacity: 0.4,
    },
    btnText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.3,
    },
});
