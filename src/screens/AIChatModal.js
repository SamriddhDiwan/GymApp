import { useContext, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  Modal,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AIChatContext from "../context/AIChatContext";
import OpenAI from "openai";
const endpoint = "https://openrouter.ai/api/v1";
const deploymentName = "x-ai/grok-4-fast:free";
const apiKey = "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";

export default function AIChatModal() {
  const navigation = useNavigation();
  const { modalVisible, setModalVisible, getExercises } = useContext(AIChatContext);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const client = new OpenAI({
    baseURL: endpoint,
    apiKey,
  });

  const sendMessage = async () => {
    try {
      const completion = await client.chat.completions.create({
        model: deploymentName,
        messages: [...messages, { role: "user", content: inputText }],
        tools: [
          {
            type: "function",
            function: {
              name: "getExercises",
              description: "Get a list of available workout exercises",
              parameters: { type: "object", properties: {} }
            }
          }
        ],
        tool_choice: "auto"
      });

      const choice = completion.choices[0].message;

      if (choice.tool_calls && choice.tool_calls.length > 0) {
        // Step 2: Model decided to call getExercises
        const result = await getExercises(); // <- real function in your app
        // Step 3: Send the result BACK to the model so it can phrase nicely
        const secondCompletion = await client.chat.completions.create({
          model: deploymentName,
          messages: [
            ...messages,
            { role: "user", content: inputText },
            choice, // the tool call from the model
            {
              role: "tool",
              tool_call_id: choice.tool_calls[0].id,
              name: "getExercises",
              content: JSON.stringify(result),
            },
          ],
        });

        const aiReply =
          secondCompletion.choices?.[0]?.message?.content ||
          "Here are your exercises!";

        setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      } else {
        // No tool call → regular AI response
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: choice.content }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error contacting AI service." },
      ]);
    }
  };



  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "ai" ? styles.aiBubble : styles.userBubble,
                ]}
              >
                <Text style={{ color: item.sender === "ai" ? "#000" : "#fff" }}>
                  {item.text}
                </Text>
              </View>
            )}
          />

          {loading && <ActivityIndicator style={{ marginVertical: 5 }} />}

          <View style={styles.inputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              style={styles.input}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={{ color: "#fff" }}>Send</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  chatContainer: {
    height: "50%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  aiBubble: { backgroundColor: "#e0e0e0", alignSelf: "flex-start" },
  userBubble: { backgroundColor: "#6200EE", alignSelf: "flex-end" },
  inputContainer: { flexDirection: "row", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
});
