import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  withDecay,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import AXChatModal from './AXChatModal.js';

const BG = '#0B132B';
const ACCENT = '#4A90D9';

const SIZE = 44;
const BORDER = 2.5;
const OUTER = SIZE + BORDER * 2;
const HIT = OUTER + 20;

function OrbitDot({ angle, orbit, pulse }) {
  const style = useAnimatedStyle(() => {
    const a = ((orbit.value + angle) * Math.PI) / 180;
    const r = 9;
    const glow = interpolate(pulse.value, [0, 1], [0.5, 1]);
    return {
      transform: [{ translateX: Math.cos(a) * r }, { translateY: Math.sin(a) * r }],
      opacity: glow,
    };
  });
  return <Animated.View style={[styles.orbitDot, style]} />;
}

function SonarRing({ anim }) {
  const style = useAnimatedStyle(() => {
    const scale = interpolate(anim.value, [0, 1], [1, 3]);
    const opacity = interpolate(anim.value, [0, 0.15, 1], [0, 0.5, 0]);
    return { transform: [{ scale }], opacity };
  });
  return <Animated.View style={[styles.sonar, style]} />;
}

export default function AXFloatingButton() {
  const [open, setOpen] = useState(false);
  const { width: W, height: H } = useWindowDimensions();

  // --- Position (draggable) ---
  // Start at bottom-right
  const startX = W - HIT - 18;
  const startY = H - HIT - 28;
  const transX = useSharedValue(startX);
  const transY = useSharedValue(startY);
  const ctxX = useSharedValue(0);
  const ctxY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const dragScale = useSharedValue(1);
  const dragRotate = useSharedValue(0);

  // --- Visual effects ---
  const spin1 = useSharedValue(0);
  const spin2 = useSharedValue(0);
  const colorPhase = useSharedValue(0);
  const breathe = useSharedValue(0);
  const orbit = useSharedValue(0);
  const dotPulse = useSharedValue(0);
  const sonar1 = useSharedValue(0);
  const sonar2 = useSharedValue(0);
  const burstScale = useSharedValue(0);
  const burstOpacity = useSharedValue(0);

  useEffect(() => {
    spin1.value = withRepeat(withTiming(360, { duration: 2200, easing: Easing.linear }), -1);
    spin2.value = withRepeat(withTiming(-360, { duration: 3400, easing: Easing.linear }), -1);
    colorPhase.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    breathe.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
    orbit.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1);
    dotPulse.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
    sonar1.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) }), -1);
    sonar2.value = withDelay(1200, withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) }), -1));
  }, []);

  // --- Drag gesture with momentum ---
  const panGesture = Gesture.Pan()
    .onStart(() => {
      ctxX.value = transX.value;
      ctxY.value = transY.value;
      isDragging.value = true;
      dragScale.value = withSpring(1.12, { damping: 8 });
    })
    .onUpdate((e) => {
      transX.value = ctxX.value + e.translationX;
      transY.value = ctxY.value + e.translationY;
      // Tilt based on velocity
      dragRotate.value = interpolate(
        e.velocityX,
        [-2000, 0, 2000],
        [-15, 0, 15]
      );
    })
    .onEnd((e) => {
      isDragging.value = false;
      dragScale.value = withSpring(1, { damping: 6 });
      dragRotate.value = withSpring(0, { damping: 8 });

      // Momentum with decay, clamped to screen edges
      transX.value = withDecay({
        velocity: e.velocityX,
        deceleration: 0.988,
        clamp: [4, W - HIT - 4],
      });
      transY.value = withDecay({
        velocity: e.velocityY,
        deceleration: 0.988,
        clamp: [60, H - HIT - 4],
      });
    });

  // --- Tap gesture (open chat) ---
  const tapGesture = Gesture.Tap()
    .maxDuration(200)
    .onStart(() => {
      dragScale.value = withSpring(0.65, { damping: 6, stiffness: 500 });
    })
    .onEnd(() => {
      burstScale.value = 0;
      burstOpacity.value = 0.8;
      burstScale.value = withTiming(4, { duration: 500, easing: Easing.out(Easing.ease) });
      burstOpacity.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
      dragScale.value = withSequence(
        withSpring(1.15, { damping: 3, stiffness: 400 }),
        withSpring(1, { damping: 8, stiffness: 200 })
      );
      runOnJS(setOpen)(true);
    });

  const composed = Gesture.Exclusive(panGesture, tapGesture);

  // --- Animated styles ---
  const positionStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: transX.value },
      { translateY: transY.value },
      { scale: dragScale.value },
      { rotate: `${dragRotate.value}deg` },
    ],
  }));

  const spin1Anim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin1.value}deg` }],
  }));
  const spin2Anim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin2.value}deg` }],
  }));
  const glow1Anim = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.15, 0.45]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [0.95, 1.2]) }],
  }));
  const glow2Anim = useAnimatedStyle(() => ({
    opacity: interpolate(colorPhase.value, [0, 0.5, 1], [0, 0.4, 0]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1.1, 1.3]) }],
  }));
  const glow3Anim = useAnimatedStyle(() => ({
    opacity: interpolate(colorPhase.value, [0, 0.5, 1], [0.1, 0, 0.4]),
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.15]) }],
  }));
  const burstAnim = useAnimatedStyle(() => ({
    transform: [{ scale: burstScale.value }],
    opacity: burstOpacity.value,
  }));

  return (
    <>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.wrapper, positionStyle]}>
          {/* Aurora glow layers */}
          <Animated.View style={[styles.glow, styles.glow1, glow1Anim]} />
          <Animated.View style={[styles.glow, styles.glow2, glow2Anim]} />
          <Animated.View style={[styles.glow, styles.glow3, glow3Anim]} />

          {/* Sonar rings */}
          <SonarRing anim={sonar1} />
          <SonarRing anim={sonar2} />

          {/* Burst ring on tap */}
          <Animated.View style={[styles.burst, burstAnim]} />

          {/* Ring 1 — fast clockwise */}
          <Animated.View style={[styles.borderWrap, spin1Anim]}>
            <LinearGradient
              colors={['#3A6FB5', ACCENT, '#5BA8E0', '#82C4F0', '#3A6FB5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.borderGradient}
            />
          </Animated.View>

          {/* Ring 2 — slow counter-clockwise */}
          <Animated.View style={[styles.borderWrap2, spin2Anim]}>
            <LinearGradient
              colors={[ACCENT, '#3A6FB5', '#5BA8E0', ACCENT]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.borderGradient}
            />
          </Animated.View>

          {/* Dark inner button */}
          <View style={styles.inner}>
            <OrbitDot angle={0} orbit={orbit} pulse={dotPulse} />
            <OrbitDot angle={120} orbit={orbit} pulse={dotPulse} />
            <OrbitDot angle={240} orbit={orbit} pulse={dotPulse} />
            <View style={styles.nucleus} />
          </View>
        </Animated.View>
      </GestureDetector>

      <AXChatModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HIT,
    height: HIT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  glow: {
    position: 'absolute',
    width: OUTER + 14,
    height: OUTER + 14,
    borderRadius: (OUTER + 14) / 2,
  },
  glow1: { backgroundColor: ACCENT },
  glow2: { backgroundColor: '#5BA8E0' },
  glow3: { backgroundColor: '#3A6FB5' },
  sonar: {
    position: 'absolute',
    width: OUTER - 4,
    height: OUTER - 4,
    borderRadius: (OUTER - 4) / 2,
    borderWidth: 1,
    borderColor: 'rgba(74,144,217,0.5)',
  },
  burst: {
    position: 'absolute',
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    borderWidth: 2,
    borderColor: ACCENT,
  },
  borderWrap: {
    position: 'absolute',
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    overflow: 'hidden',
    opacity: 0.85,
  },
  borderWrap2: {
    position: 'absolute',
    width: OUTER + 4,
    height: OUTER + 4,
    borderRadius: (OUTER + 4) / 2,
    overflow: 'hidden',
    opacity: 0.35,
  },
  borderGradient: {
    width: '100%',
    height: '100%',
  },
  inner: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  nucleus: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
});
