import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const barWidths = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    barWidths.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 800 + i * 200,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const barMaxWidths = [width * 0.5, width * 0.35, width * 0.2];

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTopRight]} />
      <View style={[styles.circle, styles.circleBottomLeft]} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏋️</Text>
        </View>

        {/* App name */}
        <Text style={styles.title}>GymApp</Text>
        <Text style={styles.subtitle}>Your Fitness Journey</Text>

        {/* Loading bars */}
        <View style={styles.barsContainer}>
          {barWidths.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.bar,
                {
                  width: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, barMaxWidths[i]],
                  }),
                  opacity: anim,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
        Loading your workouts...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B132B",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(74, 144, 217, 0.08)",
  },
  circleTopRight: {
    width: 300,
    height: 300,
    top: -80,
    right: -80,
  },
  circleBottomLeft: {
    width: 200,
    height: 200,
    bottom: -60,
    left: -60,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: "#1C2541",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2a3a5a",
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
    marginBottom: 40,
  },
  barsContainer: {
    alignItems: "center",
    gap: 8,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4A90D9",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    fontSize: 14,
    color: "#666",
    letterSpacing: 0.5,
  },
});
