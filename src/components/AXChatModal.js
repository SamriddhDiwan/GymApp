import React, { useState, useRef, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView,
  Platform, SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import agentService from '../services/agentService.js';
import { useNavigation } from '@react-navigation/native';

// ─── App palette ───
const BG = '#0B132B';
const CARD = '#1C2541';
const ACCENT = '#4A90D9';
const BORDER = '#2A3A5A';
const TEXT = '#FFFFFF';
const TEXT_MUTED = '#7A8BA8';

const QUICK_PROMPTS = [
  { icon: '💪', text: 'What should I train today?' },
  { icon: '📅', text: 'Plan my week' },
  { icon: '🔍', text: 'What am I neglecting?' },
  { icon: '📈', text: 'How is my progress?' },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function PulseDot() {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true
    );
  }, []);
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.8, 1.2]) }],
  }));
  return (
    <View style={styles.dotWrap}>
      <Animated.View style={[styles.dotGlow, glowStyle]} />
      <View style={styles.liveDot} />
    </View>
  );
}

function TypingDots() {
  const anim = useSharedValue(0);
  useEffect(() => {
    anim.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.linear }), -1);
  }, []);
  const d1 = useAnimatedStyle(() => {
    const v = anim.value;
    return { opacity: interpolate(v, [0, 0.33, 0.66, 1], [0.3, 1, 0.3, 0.3]), transform: [{ scale: interpolate(v, [0, 0.33, 0.66, 1], [0.6, 1.2, 0.6, 0.6]) }] };
  });
  const d2 = useAnimatedStyle(() => {
    const v = anim.value;
    return { opacity: interpolate(v, [0, 0.33, 0.66, 1], [0.3, 0.3, 1, 0.3]), transform: [{ scale: interpolate(v, [0, 0.33, 0.66, 1], [0.6, 0.6, 1.2, 0.6]) }] };
  });
  const d3 = useAnimatedStyle(() => {
    const v = anim.value;
    return { opacity: interpolate(v, [0, 0.33, 0.66, 1], [0.3, 0.3, 0.3, 1]), transform: [{ scale: interpolate(v, [0, 0.33, 0.66, 1], [0.6, 0.6, 0.6, 1.2]) }] };
  });
  return (
    <View style={styles.typingDots}>
      <Animated.View style={[styles.tDot, d1]} />
      <Animated.View style={[styles.tDot, d2]} />
      <Animated.View style={[styles.tDot, d3]} />
    </View>
  );
}

function TypingIndicator() {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.agentAvatar}>
        <Ionicons name="sparkles" size={12} color={ACCENT} />
      </View>
      <View style={styles.typingBubble}>
        <TypingDots />
      </View>
    </Animated.View>
  );
}

export default function AXChatModal({ visible, onClose }) {
  const navigation=useNavigation();
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'agent',
      text: "Hey! I'm AX — your AI coach. I can see your entire workout history. Ask me anything.",
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const sendScale = useSharedValue(1);

  function addMessage(role, text) {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role, text, time: now() },
    ]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  async function send(text) {
    if (!text.trim() || loading) return;
    setInput('');
    addMessage('user', text);
    setLoading(true);
    try {
      const data = await agentService.sendMessage(text);
      addMessage('agent', data.message||"Here it is");
      if(data.type==='ui_tool'){
        switch (data.tool) {
          case 'create_new_workout_session': {
            if (data.message) addMessage('agent', data.message);
            const workoutObject = { exercises: data.arguments.exercises.map(id => ({ exerciseId: id })) };
            await new Promise(r => setTimeout(r, 2000));
            onClose();
            navigation.navigate("AppFlow", { screen: "WorkoutFlow", params: { previousWorkoutObject: workoutObject } });
            break;
          }
          default:
            break;
        }
      }
    } catch(error) {
      console.log(error);
      addMessage('agent', "Couldn't reach AX right now. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    agentService.clearHistory();
    setMessages([{
      id: '0', role: 'agent',
      text: "Hey! I'm AX — your AI coach. I can see your entire workout history. Ask me anything.",
      time: now(),
    }]);
    onClose();
  }

  function handleSendPress() {
    sendScale.value = withSequence(
      withSpring(0.75, { damping: 6, stiffness: 500 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );
    send(input);
  }

  const sendBtnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  const canSend = input.trim() && !loading;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.safe}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Ionicons name="chatbubble-ellipses" size={16} color={ACCENT} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AX Coach</Text>
              <View style={styles.liveRow}>
                <PulseDot />
                <Text style={styles.liveText}>reading your history</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color={TEXT_MUTED} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={10}
        >
          {/* ─── Messages ─── */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => <Bubble message={item} />}
            ListFooterComponent={loading ? <TypingIndicator /> : null}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />

          {/* ─── Quick Prompts ─── */}
          {messages.length === 1 && !loading && (
            <View style={styles.quickRow}>
              {QUICK_PROMPTS.map(p => (
                <TouchableOpacity key={p.text} onPress={() => send(p.text)} activeOpacity={0.7} style={styles.chip}>
                  <Text style={styles.chipEmoji}>{p.icon}</Text>
                  <Text style={styles.chipText}>{p.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ─── Input ─── */}
          <View style={styles.inputWrap}>
            <View style={styles.inputRow}>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Ask your coach..."
                  placeholderTextColor={TEXT_MUTED}
                  onSubmitEditing={() => send(input)}
                  returnKeyType="send"
                  editable={!loading}
                  multiline
                />
              </View>
              <TouchableOpacity onPress={handleSendPress} disabled={!canSend} activeOpacity={0.8}>
                <Animated.View style={sendBtnAnim}>
                  <View style={[styles.sendBtn, canSend && styles.sendBtnActive]}>
                    <Ionicons name="arrow-up" size={20} color={canSend ? TEXT : '#444'} />
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function Bubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && (
        <View style={styles.agentAvatar}>
          <Ionicons name="sparkles" size={12} color={ACCENT} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
        <Text style={styles.bubbleText}>{message.text}</Text>
        <Text style={[styles.bubbleTime, isUser && { color: 'rgba(255,255,255,0.5)' }]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  headerTitle: { color: TEXT, fontWeight: '700', fontSize: 16 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dotWrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  dotGlow: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#4ade80' },
  liveText: { color: '#4ade80', fontSize: 10, fontWeight: '500' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messageList: { padding: 16, paddingBottom: 8 },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  bubbleRowUser: { justifyContent: 'flex-end' },
  agentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: ACCENT,
    borderBottomRightRadius: 4,
  },
  bubbleAgent: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { color: TEXT, fontSize: 14, lineHeight: 21 },
  bubbleTime: { color: 'rgba(255,255,255,0.2)', fontSize: 9, marginTop: 4, textAlign: 'right' },

  // Typing
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  typingDots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  tDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },

  // Quick prompts
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipEmoji: { fontSize: 12 },
  chipText: { color: TEXT_MUTED, fontSize: 12, fontWeight: '500' },

  // Input
  inputWrap: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
  },
  inputField: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: TEXT,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: ACCENT,
  },
});
