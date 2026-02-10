import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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

const deploymentName = "deepseek/deepseek-chat-v3.1:free";
const apiKey = "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";

const tools = [
  {
    type: "function",
    function: {
      name: "getExercises",
      description: "Get all exercises available in the app database",
      parameters: {
        type: "object",
        properties: {},
        required: []
      },
    },
  },
  {
    type: "function",
    function: {
      name: "startNewSession",
      description: "Creates a new workout session in the UI. Must use an exercise name from getExercises().",
      parameters: {
        type: "object",
        properties: {
          exerciseName: {
            type: "string",
            description: "The exact name of the exercise (must match one from getExercises).",
          },
          options: {
            type: "object",
            description: "Optional settings for the session.",
            properties: {
              duration: {
                type: "integer",
                description: "Duration in minutes (optional).",
              },
              intensity: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "Intensity level (optional).",
              },
            },
          },
        },
        required: ["exerciseName"],
      },
    },
  }
];

export default function AIChatModal() {
  const { modalVisible, setModalVisible, getExercises } = useContext(AIChatContext);
  const [messages, setMessages] = useState([{ role: "system", content: "You are gym app assissatant , you can query data and change using exposed function, call functions judically" }]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleFunctionCall = async (function_name, function_params) => {
    console.log("Function handler called");
    if (function_name === "getExercises") {
      const exercises = await getExercises();
      return exercises;
    } else if (function_name == "startNewSession") {
      console.log("function parameters")
      console.log(function_params);
    } else {
      console.log("Invalid function called:", function_name);
      return "Invalid function.";
    }
  };
  const sendMessage = async (currentMessages) => {
    try {

      setLoading(true);
      const sanitizedMessages = currentMessages.map(msg => ({
        role: msg.role === "tool" ? "assistant" : msg.role, // convert tool messages to assistant
        content: msg.content
      }));
      console.log(sanitizedMessages);
      if (!sanitizedMessages) {
        return;
      }
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: deploymentName,
          messages: sanitizedMessages,
          tools: tools
        }),
      });


      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = data.choices[0].message;
      setMessages((prev) => [...prev, assistantMessage]);
      // Handle tool calls if present
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        var newMessages;
        for (const toolCall of assistantMessage.tool_calls) {
          if (toolCall.function.name) {
            const toolName = toolCall.function.name;
            const { function_params } = JSON.parse(toolCall.function.arguments);
            const toolResponse = await handleFunctionCall(toolName, function_params);
            newMessages = [
              ...messages,
              {
                role: 'tool',
                toolCallId: toolCall.id,
                name: toolName,
                content: JSON.stringify(toolResponse),
              },
            ];
          }
          setMessages(newMessages);
        }
        sendMessage(newMessages);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error contacting AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  }
  const sendMessageHandler = async () => {
    const newMessages = [...messages, { role: "user", content: inputText }];
    setMessages(newMessages);
    setInputText("");
    sendMessage(newMessages);
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
              item.content && <View
                style={[
                  styles.messageBubble,
                  item.role === "assistant"
                    ? styles.aiBubble
                    : item.role === "tool"
                      ? styles.functionBubble
                      : styles.userBubble,
                ]}
              >
                <Text
                  style={{
                    color:
                      item.role === "assistant"
                        ? "#000"
                        : item.role === "tool"
                          ? "#333"
                          : "#fff",
                  }}
                >
                  {item.content}
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
            <TouchableOpacity onPress={sendMessageHandler} style={styles.sendButton}>
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
    height: "60%",
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
  functionBubble: {
    backgroundColor: "#c0ffc0",
    alignSelf: "flex-start",
  },
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