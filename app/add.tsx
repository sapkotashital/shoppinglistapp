import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "../components/Toast";
import { useLists } from "../hooks/useLists";

export default function AddScreen() {
  const router = useRouter();

  // Access addItem from ListContext via the useLists hook
  const { addItem } = useLists();

  // Local state for the text input
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Save the new item to Appwrite via the context, then go back
  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError("Please enter an item name.");
      return;
    }
    setValidationError("");
    setSaving(true);
    try {
      await addItem({ title: trimmed });
      router.back(); // Return to the home screen after saving
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>

      {/* Text input for the new item title */}
      <TextInput
        style={styles.input}
        placeholder="e.g. Milk, Bread, Eggs..."
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSave}
        returnKeyType="done"
        autoFocus
        editable={!saving}
      />

      {/* Inline validation error shown below the input */}
      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}

      {/* Save button – calls addItem from ListContext */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Item</Text>
        )}
      </TouchableOpacity>

      {/* Cancel navigates back without saving */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      {/* Floating toast for success / error feedback */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#983b5c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: -14,
    marginBottom: 14,
  },
});
