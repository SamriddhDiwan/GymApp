import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "../../services/authService.js";

const OTP_LENGTH = 6;

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [generateLoading, setGenerateLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");
    const hiddenInput = useRef(null);
    const navigation = useNavigation();

    const handleSendOTP = async () => {
        if (generateLoading) return;
        setGenerateLoading(true);
        setError("");
        try {
            const response = await authService.sendOTP(email);
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                setEmailSent(true);
                setTimeout(() => hiddenInput.current?.focus(), 150);
            }
        } finally {
            setGenerateLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (verifyLoading || otp.length < OTP_LENGTH) return;
        setVerifyLoading(true);
        setError("");
        try {
            const response = await authService.verifyOTP(email, otp);
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                navigation.navigate("ResetPassword", {
                    email: data.email,
                    resetPasswordToken: data.resetPasswordToken,
                });
            }
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleOtpChange = (value) => {
        const cleaned = value.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
        setOtp(cleaned);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {emailSent ? "Enter OTP" : "Forgot Password?"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {emailSent
                            ? `We sent a 6-digit code to ${email}`
                            : "Enter your registered email to receive a verification code"}
                    </Text>
                </View>

                {!emailSent ? (
                    <View style={styles.form}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@example.com"
                            placeholderTextColor="#4a5568"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus
                        />

                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.btn, generateLoading && styles.btnDisabled]}
                            disabled={generateLoading || !email}
                            onPress={handleSendOTP}
                            activeOpacity={0.8}
                        >
                            {generateLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.btnText}>Send Code</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <TextInput
                            ref={hiddenInput}
                            value={otp}
                            onChangeText={handleOtpChange}
                            keyboardType="number-pad"
                            maxLength={OTP_LENGTH}
                            style={styles.hiddenInput}
                            autoFocus
                        />
                        <Pressable
                            style={styles.otpRow}
                            onPress={() => hiddenInput.current?.focus()}
                        >
                            {Array.from({ length: OTP_LENGTH }).map((_, i) => {
                                const filled = i < otp.length;
                                const active = i === otp.length && i < OTP_LENGTH;
                                return (
                                    <View
                                        key={i}
                                        style={[
                                            styles.otpBox,
                                            filled && styles.otpBoxFilled,
                                            active && styles.otpBoxActive,
                                        ]}
                                    >
                                        <Text style={[styles.otpDigit, filled && styles.otpDigitFilled]}>
                                            {otp[i] || ""}
                                        </Text>
                                        {active && <View style={styles.cursor} />}
                                    </View>
                                );
                            })}
                        </Pressable>

                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[
                                styles.btn,
                                (verifyLoading || otp.length < OTP_LENGTH) && styles.btnDisabled,
                            ]}
                            disabled={verifyLoading || otp.length < OTP_LENGTH}
                            onPress={handleVerifyOTP}
                            activeOpacity={0.8}
                        >
                            {verifyLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.btnText}>Verify</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.resendBtn}
                            onPress={handleSendOTP}
                            disabled={generateLoading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.resendText}>
                                {generateLoading ? "Sending..." : "Didn't get a code? Resend"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    hiddenInput: {
        position: "absolute",
        opacity: 0,
        height: 0,
        width: 0,
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginVertical: 8,
    },
    otpBox: {
        width: 48,
        height: 58,
        borderRadius: 14,
        backgroundColor: "#131d36",
        borderWidth: 2,
        borderColor: "#1e2d4d",
        alignItems: "center",
        justifyContent: "center",
    },
    otpBoxActive: {
        borderColor: "#4A90D9",
        backgroundColor: "#141f3d",
    },
    otpBoxFilled: {
        borderColor: "#2d6abf",
        backgroundColor: "#162040",
    },
    otpDigit: {
        fontSize: 24,
        fontWeight: "700",
        color: "#334155",
    },
    otpDigitFilled: {
        color: "#fff",
    },
    cursor: {
        position: "absolute",
        bottom: 14,
        width: 20,
        height: 2,
        backgroundColor: "#4A90D9",
        borderRadius: 1,
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
    resendBtn: {
        alignItems: "center",
        paddingVertical: 8,
    },
    resendText: {
        fontSize: 14,
        color: "#4A90D9",
        fontWeight: "500",
    },
});
